"""
meta_tools.py — Meta Marketing API integration
גישה לקמפיינים, ביצועים, ומודעות של Smiley ב-Meta Ads Manager
"""

import os
import requests
from datetime import datetime, timedelta

META_API_VERSION = "v21.0"
BASE_URL = f"https://graph.facebook.com/{META_API_VERSION}"


def _get_credentials():
    token = os.getenv("META_ACCESS_TOKEN")
    account_id = os.getenv("META_AD_ACCOUNT_ID")
    if not token:
        raise ValueError("חסר META_ACCESS_TOKEN ב-.env")
    if not account_id:
        raise ValueError("חסר META_AD_ACCOUNT_ID ב-.env")
    # וודא שה-account ID מתחיל ב-act_
    if not account_id.startswith("act_"):
        account_id = f"act_{account_id}"
    return token, account_id


def get_campaigns(status_filter: str = "all") -> str:
    """
    שליפת כל הקמפיינים מ-Meta Ads Manager.
    status_filter: 'active', 'paused', 'all'
    """
    try:
        token, account_id = _get_credentials()

        params = {
            "access_token": token,
            "fields": "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time",
            "limit": 50,
        }

        if status_filter == "active":
            params["effective_status"] = '["ACTIVE"]'
        elif status_filter == "paused":
            params["effective_status"] = '["PAUSED"]'

        response = requests.get(
            f"{BASE_URL}/{account_id}/campaigns", params=params, timeout=15
        )
        data = response.json()

        if "error" in data:
            return f"שגיאת Meta API: {data['error'].get('message', 'שגיאה לא ידועה')}"

        campaigns = data.get("data", [])
        if not campaigns:
            return "לא נמצאו קמפיינים"

        output = f"📊 **קמפיינים ב-Meta Ads** ({len(campaigns)} סה\"כ):\n\n"
        for c in campaigns:
            status_emoji = "🟢" if c.get("status") == "ACTIVE" else "⏸️"
            budget = c.get("daily_budget") or c.get("lifetime_budget", "N/A")
            if budget != "N/A":
                budget = f"₪{int(budget)/100:.0f}"
            output += f"{status_emoji} **{c['name']}**\n"
            output += f"   סטטוס: {c.get('status', 'N/A')} | תקציב: {budget} | ID: `{c['id']}`\n\n"

        return output

    except Exception as e:
        return f"שגיאה בשליפת קמפיינים: {str(e)}"


def get_campaign_stats(campaign_id: str, days: int = 7) -> str:
    """
    נתוני ביצוע לקמפיין ספציפי ב-X ימים האחרונים.
    """
    try:
        token, _ = _get_credentials()

        since = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        until = datetime.now().strftime("%Y-%m-%d")

        params = {
            "access_token": token,
            "fields": "campaign_name,impressions,reach,clicks,spend,cpm,cpc,ctr,actions,cost_per_action_type",
            "time_range": f'{{"since":"{since}","until":"{until}"}}',
        }

        response = requests.get(
            f"{BASE_URL}/{campaign_id}/insights", params=params, timeout=15
        )
        data = response.json()

        if "error" in data:
            return f"שגיאת Meta API: {data['error'].get('message', 'שגיאה לא ידועה')}"

        insights = data.get("data", [])
        if not insights:
            return f"אין נתונים לקמפיין {campaign_id} ב-{days} הימים האחרונים"

        d = insights[0]
        campaign_name = d.get("campaign_name", campaign_id)

        # חפש purchases בactions
        purchases = 0
        purchase_value = 0
        actions = d.get("actions", [])
        for action in actions:
            if action.get("action_type") == "purchase":
                purchases = int(float(action.get("value", 0)))

        spend = float(d.get("spend", 0))
        roas = purchase_value / spend if spend > 0 and purchase_value > 0 else "N/A"

        output = f"📈 **{campaign_name}** — {days} ימים אחרונים\n\n"
        output += f"💰 הוצאה: ₪{spend:.2f}\n"
        output += f"👁️ חשיפות: {int(d.get('impressions', 0)):,}\n"
        output += f"🎯 Reach: {int(d.get('reach', 0)):,}\n"
        output += f"🖱️ קליקים: {int(d.get('clicks', 0)):,}\n"
        output += f"📊 CPM: ₪{float(d.get('cpm', 0)):.2f}\n"
        output += f"📊 CPC: ₪{float(d.get('cpc', 0)):.2f}\n"
        output += f"📊 CTR: {float(d.get('ctr', 0)):.2f}%\n"
        if purchases > 0:
            output += f"🛒 רכישות: {purchases}\n"
        if roas != "N/A":
            output += f"💎 ROAS: {roas:.2f}x\n"

        return output

    except Exception as e:
        return f"שגיאה בשליפת נתוני קמפיין: {str(e)}"


def get_account_overview(days: int = 7) -> str:
    """
    סקירה כוללת של כל החשבון ב-X ימים האחרונים.
    """
    try:
        token, account_id = _get_credentials()

        since = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        until = datetime.now().strftime("%Y-%m-%d")

        params = {
            "access_token": token,
            "fields": "account_name,impressions,reach,clicks,spend,cpm,cpc,ctr,actions",
            "time_range": f'{{"since":"{since}","until":"{until}"}}',
            "level": "account",
        }

        response = requests.get(
            f"{BASE_URL}/{account_id}/insights", params=params, timeout=15
        )
        data = response.json()

        if "error" in data:
            return f"שגיאת Meta API: {data['error'].get('message', 'שגיאה לא ידועה')}"

        insights = data.get("data", [])
        if not insights:
            return f"אין נתוני חשבון ל-{days} ימים האחרונים"

        d = insights[0]
        spend = float(d.get("spend", 0))

        # ספור רכישות
        purchases = 0
        for action in d.get("actions", []):
            if action.get("action_type") == "purchase":
                purchases = int(float(action.get("value", 0)))

        output = f"📊 **סקירת חשבון Meta Ads — {days} ימים**\n\n"
        output += f"💰 הוצאה כוללת: ₪{spend:.2f}\n"
        output += f"👁️ חשיפות: {int(d.get('impressions', 0)):,}\n"
        output += f"🎯 Reach: {int(d.get('reach', 0)):,}\n"
        output += f"🖱️ קליקים: {int(d.get('clicks', 0)):,}\n"
        output += f"📊 CPM: ₪{float(d.get('cpm', 0)):.2f}\n"
        output += f"📊 CPC: ₪{float(d.get('cpc', 0)):.2f}\n"
        output += f"📊 CTR: {float(d.get('ctr', 0)):.2f}%\n"
        if purchases > 0:
            output += f"🛒 רכישות: {purchases}\n"
            cpa = spend / purchases if purchases > 0 else 0
            output += f"💡 CPA: ₪{cpa:.2f}\n"

        return output

    except Exception as e:
        return f"שגיאה בסקירת חשבון: {str(e)}"


def get_top_ads(days: int = 7, metric: str = "ctr", limit: int = 5) -> str:
    """
    המודעות הטובות ביותר לפי מטריקה.
    metric: 'ctr', 'cpc', 'spend', 'impressions'
    """
    try:
        token, account_id = _get_credentials()

        since = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        until = datetime.now().strftime("%Y-%m-%d")

        params = {
            "access_token": token,
            "fields": f"ad_name,campaign_name,impressions,clicks,spend,cpm,cpc,ctr",
            "time_range": f'{{"since":"{since}","until":"{until}"}}',
            "level": "ad",
            "sort": f"['{metric}_descending']" if metric not in ["cpc", "cpm"] else f"['{metric}_ascending']",
            "limit": limit,
        }

        response = requests.get(
            f"{BASE_URL}/{account_id}/insights", params=params, timeout=15
        )
        data = response.json()

        if "error" in data:
            return f"שגיאת Meta API: {data['error'].get('message', 'שגיאה לא ידועה')}"

        ads = data.get("data", [])
        if not ads:
            return "אין נתוני מודעות לתקופה זו"

        metric_labels = {"ctr": "CTR גבוה", "cpc": "CPC נמוך", "spend": "הוצאה גבוהה", "impressions": "חשיפות"}
        output = f"🏆 **{limit} מודעות עם {metric_labels.get(metric, metric)} — {days} ימים:**\n\n"

        for i, ad in enumerate(ads, 1):
            output += f"{i}. **{ad.get('ad_name', 'N/A')}**\n"
            output += f"   קמפיין: {ad.get('campaign_name', 'N/A')}\n"
            output += f"   CTR: {float(ad.get('ctr', 0)):.2f}% | CPC: ₪{float(ad.get('cpc', 0)):.2f} | הוצאה: ₪{float(ad.get('spend', 0)):.2f}\n\n"

        return output

    except Exception as e:
        return f"שגיאה בשליפת מודעות: {str(e)}"

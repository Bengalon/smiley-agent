"""
web_tools.py — גלישה וקריאת תוכן מהאתר של Smiley ואתרים אחרים
"""

import requests
from bs4 import BeautifulSoup
import re

SMILEY_WEBSITE = "https://try-smiley.com"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    )
}


def browse_smiley_website(path: str = "") -> str:
    """
    כניסה לאתר try-smiley.com ושאיבת תוכן.
    path: נתיב לעמוד ספציפי (ריק = עמוד הבית)
    """
    url = SMILEY_WEBSITE.rstrip("/")
    if path:
        url = f"{url}/{path.lstrip('/')}"

    return _fetch_page(url)


def browse_url(url: str) -> str:
    """
    גלישה לכל URL ושאיבת תוכן טקסטואלי.
    """
    return _fetch_page(url)


def _fetch_page(url: str) -> str:
    """
    שליפת תוכן עמוד ופארסינג לטקסט נקי.
    """
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # הסר סקריפטים וסטיילים
        for tag in soup(["script", "style", "nav", "footer", "iframe", "noscript"]):
            tag.decompose()

        # נסה לשלוף את התוכן הראשי
        main_content = (
            soup.find("main")
            or soup.find("article")
            or soup.find(id="content")
            or soup.find(class_="content")
            or soup.find("body")
        )

        if not main_content:
            return f"לא הצלחתי לשלוף תוכן מ-{url}"

        # נקה טקסט
        text = main_content.get_text(separator="\n", strip=True)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = text[:6000]  # הגבל אורך

        # נסה לשלוף כותרת
        title = soup.find("title")
        title_text = title.get_text(strip=True) if title else ""

        output = f"🌐 **{url}**\n"
        if title_text:
            output += f"כותרת: {title_text}\n"
        output += f"\n{text}"

        return output

    except requests.exceptions.ConnectionError:
        return f"❌ לא ניתן להתחבר ל-{url} — בדוק חיבור אינטרנט"
    except requests.exceptions.Timeout:
        return f"❌ timeout בחיבור ל-{url}"
    except requests.exceptions.HTTPError as e:
        return f"❌ שגיאת HTTP {e.response.status_code} ב-{url}"
    except Exception as e:
        return f"❌ שגיאה בגלישה ל-{url}: {str(e)}"


def get_smiley_prices() -> str:
    """
    שליפת מחירים ומוצרים מאתר Smiley.
    """
    try:
        # נסה לגשת לעמוד מוצרים/חנות
        paths_to_try = ["", "products", "shop", "collections/all", "collections"]

        for path in paths_to_try:
            content = browse_smiley_website(path)
            # חפש מחירים בתוכן
            if "₪" in content or "ILS" in content or any(
                keyword in content.lower() for keyword in ["price", "מחיר", "שקל"]
            ):
                return f"**מחירים מאתר Smiley:**\n\n{content}"

        return browse_smiley_website("")  # החזר עמוד הבית אם לא נמצאו מחירים

    except Exception as e:
        return f"שגיאה בשליפת מחירים: {str(e)}"

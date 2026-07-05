# 🤖 Smiley Agent — מדריך הגדרה מלא

זמן משוער: כ-30 דקות לכל השלבים.

---

## שלב 1: יצירת בוט טלגרם (5 דקות)

1. פתח טלגרם בטלפון
2. חפש `@BotFather` ולחץ **Start**
3. שלח: `/newbot`
4. BotFather ישאל לשם הבוט — כתוב: `Smiley Agent`
5. BotFather ישאל לשם משתמש — כתוב: `smiley_my_agent_bot` (או כל שם פנוי שנגמר ב-bot)
6. BotFather ייתן לך **TOKEN** — שמור אותו! (נראה כך: `7123456789:AAH...`)

**קבלת ה-User ID שלך:**
1. חפש `@userinfobot` בטלגרם
2. לחץ **Start**
3. הוא ייתן לך את ה-**ID** שלך (מספר של ~10 ספרות)
4. שמור גם אותו

---

## שלב 2: Anthropic API Key (3 דקות)

1. לך ל: **https://console.anthropic.com**
2. הירשם/התחבר
3. לחץ על **API Keys** בתפריט שמאל
4. לחץ **Create Key** — שמור את המפתח (מתחיל ב-`sk-ant-`)

> ⚠️ המפתח מוצג פעם אחת בלבד — שמור מיד!

---

## שלב 3: Google Drive Service Account (10 דקות)

### 3א. יצירת פרויקט Google Cloud
1. לך ל: **https://console.cloud.google.com**
2. לחץ על בורר הפרויקטים (למעלה) → **New Project**
3. שם: `smiley-agent` → **Create**

### 3ב. הפעלת Google Drive API
1. בתפריט ← **APIs & Services** → **Enable APIs and Services**
2. חפש `Google Drive API` → לחץ עליו → **Enable**

### 3ג. יצירת Service Account
1. לך ל: **APIs & Services** → **Credentials**
2. לחץ **+ Create Credentials** → **Service Account**
3. שם: `smiley-drive-agent` → **Create and Continue** → **Done**
4. לחץ על ה-Service Account שנוצר
5. לשונית **Keys** → **Add Key** → **Create new key** → **JSON** → **Create**
6. קובץ JSON יורד אוטומטית — **אל תמחק אותו!**

### 3ד. שיתוף Drive עם ה-Service Account
1. פתח את קובץ ה-JSON ← מצא את השורה `"client_email"` — זו האימייל של ה-service account
   (נראה כך: `smiley-drive-agent@smiley-agent-xxxxx.iam.gserviceaccount.com`)
2. לך ל-**Google Drive** שלך
3. לחץ ימני על **תיקיית Smiley הראשית** → **Share** → הדבק את כתובת האימייל → **Viewer** → **Done**

---

## שלב 4: Meta Ads API Token (10 דקות)

### 4א. יצירת App ב-Meta for Developers
1. לך ל: **https://developers.facebook.com**
2. לחץ **My Apps** → **Create App**
3. בחר: **Other** → **Business** → הכנס שם ← לחץ **Create App**

### 4ב. הוספת Marketing API
1. בתוך ה-App → **Add Product** → **Marketing API** → **Set Up**

### 4ג. יצירת Token
1. לך ל: **Tools** → **Graph API Explorer**
2. בחר את ה-App שיצרת
3. בסעיף **Permissions** הוסף:
   - `ads_read`
   - `ads_management`
   - `business_management`
4. לחץ **Generate Access Token** → **Continue** → **Done**
5. העתק את ה-Token שמופיע

> ⚠️ ה-Token הבסיסי פג תוך שעה. לטוקן קבוע ← עשה **Extended Token**:
> - לחץ על סימן המידע (i) ליד ה-token → **Open in Access Token Tool**
> - לחץ **Extend Access Token** — זה ייתן token ל-60 יום

### 4ד. מציאת Ad Account ID
1. לך ל: **https://business.facebook.com**
2. לחץ ← **Ad Accounts**
3. מצא את חשבון Smiley — ה-ID מופיע (לדוגמה: `act_1234567890`)
4. **קח רק את המספרים** (ללא `act_`)

---

## שלב 5: העלאה ל-Railway (5 דקות)

### 5א. גיטהאב (אם אין לך)
1. הירשם ב: **https://github.com**
2. לחץ **+** → **New Repository**
3. שם: `smiley-agent` → **Create repository**
4. גרור את **כל הקבצים** מתיקיית `smiley-agent` לאתר → **Commit changes**

### 5ב. Railway
1. לך ל: **https://railway.app**
2. התחבר עם GitHub
3. לחץ **New Project** → **Deploy from GitHub repo**
4. בחר את `smiley-agent`
5. Railway יתחיל ל-build אוטומטית

### 5ג. הגדרת Environment Variables ב-Railway
1. לחץ על ה-service שנוצר → **Variables**
2. הוסף כל משתנה מ-`.env.example`:

| שם המשתנה | הערך |
|-----------|------|
| `TELEGRAM_BOT_TOKEN` | ה-token מ-BotFather |
| `ALLOWED_TELEGRAM_USER_IDS` | ה-User ID שלך |
| `ANTHROPIC_API_KEY` | המפתח מ-Anthropic |
| `GOOGLE_DRIVE_CREDENTIALS_JSON` | **כל תוכן** קובץ ה-JSON (בשורה אחת!) |
| `META_ACCESS_TOKEN` | ה-token מ-Meta |
| `META_AD_ACCOUNT_ID` | המספר של חשבון הפרסום |

> **איך להכניס את קובץ ה-JSON?**
> פתח את קובץ ה-JSON, העתק את **כל התוכן**, והדבק אותו כערך אחד של המשתנה.

3. לחץ **Deploy** — Railway יפעיל את הבוט

---

## שלב 6: בדיקה ✅

1. פתח טלגרם
2. חפש את שם הבוט שיצרת
3. שלח `/start`
4. שלח `/status` — תראה אילו חיבורים פעילים
5. שלח: `מה המצב של הקמפיינים?`

---

## פקודות הבוט

| פקודה | מה היא עושה |
|-------|-------------|
| `/start` | הודעת פתיחה ועזרה |
| `/status` | בדיקת חיבורים |
| `/campaigns` | כל הקמפיינים הפעילים |
| `/overview` | סקירת ביצועים 7 ימים |
| `/clear` | ניקוי היסטוריית שיחה |

## שאלות שהבוט מסוגל לענות עליהן

- "מה המצב של הקמפיינים?"
- "תראה לי את ביצועי הקמפיין XYZ ב-30 יום האחרונים"
- "תשלוף לי את תסריטי ה-UGC של הקפה מ-Drive"
- "מה המחיר הנוכחי של SmileyFresh באתר?"
- "כתוב לי תסריט UGC חדש לסצנת דייט"
- "מה המודעות הכי טובות ב-CTR השבוע?"
- "תפתח את הקובץ XXXX ב-Drive ותסכם לי אותו"

---

## פתרון בעיות נפוצות

**הבוט לא עונה:**
- בדוק ב-Railway שה-service רץ (לא crashed)
- בדוק את הלוגים ב-Railway → **Deployments** → **View Logs**

**שגיאת Google Drive:**
- ודא ששיתפת את התיקייה עם האימייל של ה-service account
- ודא שהדרייב API מופעל בפרויקט

**שגיאת Meta:**
- ה-token אולי פג — צור token חדש ועדכן ב-Railway

**שגיאת Anthropic:**
- ודא שיש קרדיט בחשבון ב-console.anthropic.com

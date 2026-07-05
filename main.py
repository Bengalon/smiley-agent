"""
main.py — Smiley Agent Telegram Bot
מריץ בוט טלגרם שמחובר ל-Claude agent.
"""

import os
import logging
from telegram import Update
from telegram.ext import (
    Application,
    MessageHandler,
    CommandHandler,
    filters,
    ContextTypes,
)
from agent import SmileyAgent

# ======================================================
# הגדרות לוגים
# ======================================================
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ======================================================
# אתחול האגנט
# ======================================================
agent = SmileyAgent()

# ======================================================
# בדיקת הרשאות
# ======================================================
def is_allowed(user_id: int) -> bool:
    """בדוק אם המשתמש מורשה להשתמש בבוט."""
    allowed_raw = os.getenv("ALLOWED_TELEGRAM_USER_IDS", "")
    if not allowed_raw:
        return True  # אין הגבלה אם לא הוגדר
    allowed_ids = [int(x.strip()) for x in allowed_raw.split(",") if x.strip()]
    return user_id in allowed_ids


# ======================================================
# פקודות
# ======================================================

async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /start — הודעת פתיחה."""
    if not is_allowed(update.effective_user.id):
        await update.message.reply_text("❌ אין לך הרשאה.")
        return

    welcome = (
        "👋 שלום! אני האגנט של Smiley.\n\n"
        "אני מחובר ל:\n"
        "📁 Google Drive — כל הנכסים שלך\n"
        "🖼️ Higgsfield AI — יצירת תמונות ומודעות\n"
        "🌐 try-smiley.com — האתר הלייב\n\n"
        "פשוט שלח לי הודעה ואני אטפל! לדוגמה:\n"
        '• "תשלוף לי את תסריטי ה-UGC של הקפה"\n'
        '• "צור לי מודעה לסצנת דייט עם SmileyFresh"\n'
        '• "מה המחיר הנוכחי באתר?"\n'
        '• "כתוב לי תסריט UGC חדש למעשנים"\n'
        '• "תראה לי את התמונות האחרונות שיצרנו"\n\n'
        "פקודות:\n"
        "/images — יצירות אחרונות מ-Higgsfield\n"
        "/clear — ניקוי היסטוריית שיחה\n"
        "/status — בדיקת חיבורים"
    )
    await update.message.reply_text(welcome)


async def cmd_clear(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /clear — ניקוי היסטוריית שיחה."""
    if not is_allowed(update.effective_user.id):
        return

    agent.clear_history(str(update.effective_user.id))
    await update.message.reply_text("🗑️ היסטוריית השיחה נוקתה. נתחיל מחדש!")


async def cmd_status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /status — בדיקת סטטוס חיבורים."""
    if not is_allowed(update.effective_user.id):
        return

    checks = []

    # בדוק API keys
    anthropic_ok = bool(os.getenv("ANTHROPIC_API_KEY"))
    drive_ok = bool(os.getenv("GOOGLE_DRIVE_CREDENTIALS_JSON"))
    meta_ok = bool(os.getenv("META_ACCESS_TOKEN") and os.getenv("META_AD_ACCOUNT_ID"))

    checks.append(f"{'✅' if anthropic_ok else '❌'} Claude AI (Anthropic)")
    checks.append(f"{'✅' if drive_ok else '❌'} Google Drive")
    checks.append(f"{'✅' if meta_ok else '❌'} Meta Ads")
    checks.append("✅ Telegram Bot")

    summary = agent.get_history_summary(str(update.effective_user.id))

    status_msg = "🔌 **סטטוס חיבורים:**\n\n" + "\n".join(checks)
    status_msg += f"\n\n📝 {summary}"

    await update.message.reply_text(status_msg)


async def cmd_images(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /images — יצירות אחרונות מ-Higgsfield."""
    if not is_allowed(update.effective_user.id):
        return

    await context.bot.send_chat_action(
        chat_id=update.effective_chat.id, action="typing"
    )
    text, _ = agent.chat(str(update.effective_user.id), "תראה לי את 10 היצירות האחרונות מ-Higgsfield")
    await _send_long_message(update, text)


# ======================================================
# טיפול בהודעות רגילות
# ======================================================

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """טיפול בכל הודעה רגילה."""
    if not is_allowed(update.effective_user.id):
        await update.message.reply_text("❌ אין לך הרשאה להשתמש בבוט זה.")
        return

    user_message = update.message.text
    user_id = str(update.effective_user.id)
    chat_id = update.effective_chat.id

    # הצג אינדיקטור "כותב..."
    await context.bot.send_chat_action(chat_id=chat_id, action="typing")

    logger.info(f"User {user_id}: {user_message[:100]}")

    try:
        text_response, image_urls = agent.chat(user_id=user_id, message=user_message)

        # שלח תמונות שנוצרו ב-Higgsfield
        for img_url in image_urls:
            try:
                await context.bot.send_photo(
                    chat_id=chat_id,
                    photo=img_url,
                    caption="🖼️ נוצר ב-Higgsfield"
                )
            except Exception as img_err:
                logger.warning(f"Could not send image {img_url}: {img_err}")
                # שלח את ה-URL בטקסט אם לא הצליח לשלוח כתמונה
                await update.message.reply_text(f"🖼️ תמונה מוכנה: {img_url}")

        # שלח את תגובת הטקסט
        if text_response and text_response.strip():
            await _send_long_message(update, text_response)

    except Exception as e:
        logger.error(f"Error in handle_message: {e}")
        await update.message.reply_text(
            f"⚠️ קרתה שגיאה: {str(e)}\n\nנסה שוב או שלח /clear לאיפוס."
        )


async def _send_long_message(update: Update, text: str):
    """שליחת הודעה ארוכה בחתיכות של עד 4000 תווים."""
    if not text:
        await update.message.reply_text("✅ בוצע (אין תוכן להצגה)")
        return

    MAX_LENGTH = 4000
    if len(text) <= MAX_LENGTH:
        await update.message.reply_text(text)
    else:
        # חלק להודעות
        chunks = []
        while text:
            if len(text) <= MAX_LENGTH:
                chunks.append(text)
                break
            # חפש נקודת חיתוך טובה (שורה חדשה)
            cut = text.rfind("\n", 0, MAX_LENGTH)
            if cut == -1:
                cut = MAX_LENGTH
            chunks.append(text[:cut])
            text = text[cut:].lstrip("\n")

        for chunk in chunks:
            await update.message.reply_text(chunk)


# ======================================================
# הפעלת הבוט
# ======================================================

def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("חסר TELEGRAM_BOT_TOKEN ב-.env!")

    print("🤖 Smiley Agent מתחיל...")

    app = Application.builder().token(token).build()

    # פקודות
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("clear", cmd_clear))
    app.add_handler(CommandHandler("status", cmd_status))
    app.add_handler(CommandHandler("images", cmd_images))

    # הודעות רגילות
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("✅ הבוט פעיל! ממתין להודעות...")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()

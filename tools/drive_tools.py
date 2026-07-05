"""
drive_tools.py — Google Drive integration
משתמש ב-Google Drive API v3 עם Service Account
"""

import os
import json
import io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]


def _get_service():
    """יצירת חיבור ל-Google Drive API"""
    creds_json = os.getenv("GOOGLE_DRIVE_CREDENTIALS_JSON")
    if not creds_json:
        raise ValueError("חסר GOOGLE_DRIVE_CREDENTIALS_JSON ב-.env")

    creds_dict = json.loads(creds_json)
    creds = service_account.Credentials.from_service_account_info(
        creds_dict, scopes=SCOPES
    )
    return build("drive", "v3", credentials=creds)


def search_drive(query: str, max_results: int = 10) -> str:
    """
    חיפוש קבצים ב-Google Drive לפי שאילתה.
    מחזיר רשימת קבצים עם שם, סוג ו-ID.
    """
    try:
        service = _get_service()
        # בנה שאילתה שמחפשת בשם ובתוכן
        drive_query = f"name contains '{query}' or fullText contains '{query}'"
        drive_query += " and trashed = false"

        results = (
            service.files()
            .list(
                q=drive_query,
                pageSize=max_results,
                fields="files(id, name, mimeType, modifiedTime, size)",
                orderBy="modifiedTime desc",
            )
            .execute()
        )

        files = results.get("files", [])
        if not files:
            return f"לא נמצאו קבצים עבור: '{query}'"

        output = f"נמצאו {len(files)} קבצים עבור '{query}':\n\n"
        for f in files:
            mime = f.get("mimeType", "")
            type_label = _mime_to_label(mime)
            modified = f.get("modifiedTime", "")[:10]
            output += f"📄 **{f['name']}**\n"
            output += f"   סוג: {type_label} | עודכן: {modified} | ID: `{f['id']}`\n\n"

        return output

    except Exception as e:
        return f"שגיאה בחיפוש Drive: {str(e)}"


def read_drive_file(file_id: str) -> str:
    """
    קריאת תוכן קובץ מ-Google Drive.
    תומך ב: Google Docs, Google Sheets, טקסט, PDF.
    """
    try:
        service = _get_service()

        # קבל מטדאטה של הקובץ
        file_meta = service.files().get(fileId=file_id, fields="name, mimeType").execute()
        name = file_meta.get("name", "קובץ")
        mime = file_meta.get("mimeType", "")

        # Google Docs — export as text
        if mime == "application/vnd.google-apps.document":
            response = (
                service.files()
                .export(fileId=file_id, mimeType="text/plain")
                .execute()
            )
            content = response.decode("utf-8") if isinstance(response, bytes) else response
            return f"📄 **{name}**\n\n{content[:8000]}"

        # Google Sheets — export as CSV
        elif mime == "application/vnd.google-apps.spreadsheet":
            response = (
                service.files()
                .export(fileId=file_id, mimeType="text/csv")
                .execute()
            )
            content = response.decode("utf-8") if isinstance(response, bytes) else response
            return f"📊 **{name}**\n\n{content[:6000]}"

        # קבצי טקסט רגילים
        elif mime.startswith("text/"):
            request = service.files().get_media(fileId=file_id)
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            while not done:
                _, done = downloader.next_chunk()
            content = fh.getvalue().decode("utf-8", errors="replace")
            return f"📄 **{name}**\n\n{content[:8000]}"

        else:
            return f"📎 הקובץ '{name}' (סוג: {mime}) לא ניתן לקריאת תוכן ישירה — ניתן להוריד לפי ID: {file_id}"

    except Exception as e:
        return f"שגיאה בקריאת קובץ Drive: {str(e)}"


def list_drive_folder(folder_name: str = "", folder_id: str = "") -> str:
    """
    הצגת תוכן תיקייה ב-Google Drive.
    """
    try:
        service = _get_service()

        if folder_id:
            query = f"'{folder_id}' in parents and trashed = false"
        elif folder_name:
            # מצא תיקייה לפי שם
            folder_query = (
                f"name = '{folder_name}' "
                f"and mimeType = 'application/vnd.google-apps.folder' "
                f"and trashed = false"
            )
            folders = (
                service.files()
                .list(q=folder_query, fields="files(id, name)")
                .execute()
                .get("files", [])
            )
            if not folders:
                return f"לא נמצאה תיקייה בשם '{folder_name}'"
            folder_id = folders[0]["id"]
            query = f"'{folder_id}' in parents and trashed = false"
        else:
            return "נא לספק שם תיקייה או folder_id"

        results = (
            service.files()
            .list(
                q=query,
                pageSize=30,
                fields="files(id, name, mimeType, modifiedTime)",
                orderBy="name",
            )
            .execute()
        )

        files = results.get("files", [])
        if not files:
            return "התיקייה ריקה"

        output = f"📁 תוכן התיקייה ({len(files)} פריטים):\n\n"
        for f in files:
            mime = f.get("mimeType", "")
            icon = "📁" if "folder" in mime else "📄"
            output += f"{icon} {f['name']} | ID: `{f['id']}`\n"

        return output

    except Exception as e:
        return f"שגיאה בהצגת תיקייה: {str(e)}"


def _mime_to_label(mime: str) -> str:
    mapping = {
        "application/vnd.google-apps.document": "Google Doc",
        "application/vnd.google-apps.spreadsheet": "Google Sheet",
        "application/vnd.google-apps.presentation": "Google Slides",
        "application/vnd.google-apps.folder": "תיקייה",
        "application/pdf": "PDF",
        "image/png": "תמונה PNG",
        "image/jpeg": "תמונה JPG",
        "video/mp4": "וידאו MP4",
        "text/plain": "טקסט",
    }
    return mapping.get(mime, mime.split("/")[-1] if "/" in mime else mime)

"""
agent.py — ה-brain של Smiley Agent
לולאת agent מבוססת Claude עם tool calling מלא.
"""

from anthropic import Anthropic
from knowledge import SMILEY_SYSTEM_PROMPT
from tools.drive_tools import search_drive, read_drive_file, list_drive_folder
from tools.higgsfield_tools import generate_image, list_recent_generations, get_generation_status
from tools.web_tools import browse_smiley_website, browse_url, get_smiley_prices

# ======================================================
# הגדרת כל הכלים הזמינים לאגנט
# ======================================================

TOOLS = [
    {
        "name": "search_google_drive",
        "description": "חיפוש קבצים ב-Google Drive של Smiley לפי מילות מפתח. מחזיר שמות קבצים, סוגם ו-ID שלהם.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "מה לחפש — לדוגמה: 'תסריט UGC קפה', 'תמונות מודעות', 'קמפיין מעשנים'"
                },
                "max_results": {
                    "type": "integer",
                    "description": "מקסימום תוצאות (ברירת מחדל: 10)",
                    "default": 10
                }
            },
            "required": ["query"]
        }
    },
    {
        "name": "read_drive_file",
        "description": "קריאת תוכן קובץ מ-Google Drive לפי file ID. מחזיר את הטקסט המלא.",
        "input_schema": {
            "type": "object",
            "properties": {
                "file_id": {
                    "type": "string",
                    "description": "ה-ID של הקובץ ב-Google Drive"
                }
            },
            "required": ["file_id"]
        }
    },
    {
        "name": "list_drive_folder",
        "description": "הצגת כל הקבצים בתיקייה ספציפית ב-Google Drive.",
        "input_schema": {
            "type": "object",
            "properties": {
                "folder_name": {
                    "type": "string",
                    "description": "שם התיקייה לחיפוש"
                },
                "folder_id": {
                    "type": "string",
                    "description": "ID של התיקייה (אם ידוע)"
                }
            }
        }
    },
    {
        "name": "generate_image_higgsfield",
        "description": "יצירת תמונה / מודעה עם Higgsfield AI. שלח פרומפט בעברית או אנגלית. האגנט יחכה ויחזיר את התמונה.",
        "input_schema": {
            "type": "object",
            "properties": {
                "prompt": {
                    "type": "string",
                    "description": "תיאור מפורט של התמונה לייצור"
                },
                "aspect_ratio": {
                    "type": "string",
                    "enum": ["1:1", "16:9", "9:16", "4:5"],
                    "description": "יחס מידות (ברירת מחדל: 1:1 לפייסבוק)",
                    "default": "1:1"
                },
                "reference_image_url": {
                    "type": "string",
                    "description": "URL לתמונת רפרנס (אופציונלי)"
                },
                "quality": {
                    "type": "string",
                    "enum": ["standard", "high"],
                    "description": "איכות (ברירת מחדל: standard)",
                    "default": "standard"
                }
            },
            "required": ["prompt"]
        }
    },
    {
        "name": "list_recent_higgsfield",
        "description": "הצגת יצירות תמונות אחרונות מ-Higgsfield — URLs ופרטים.",
        "input_schema": {
            "type": "object",
            "properties": {
                "limit": {
                    "type": "integer",
                    "description": "כמה יצירות להציג (ברירת מחדל: 10)",
                    "default": 10
                }
            }
        }
    },
    {
        "name": "check_higgsfield_job",
        "description": "בדיקת סטטוס של יצירה ספציפית ב-Higgsfield לפי job ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "job_id": {
                    "type": "string",
                    "description": "ה-ID של העבודה"
                }
            },
            "required": ["job_id"]
        }
    },
    {
        "name": "browse_smiley_website",
        "description": "גלישה לאתר try-smiley.com ושאיבת מידע עדכני — מחירים, מוצרים, מבצעים.",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {
                    "type": "string",
                    "description": "עמוד ספציפי לגלוש אליו (ריק = עמוד הבית). לדוגמה: 'products', 'collections'",
                    "default": ""
                }
            }
        }
    },
    {
        "name": "browse_url",
        "description": "גלישה לכל URL חיצוני ושאיבת תוכן. לשימוש כשצריך מידע ממקור חיצוני.",
        "input_schema": {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "ה-URL לגלישה"
                }
            },
            "required": ["url"]
        }
    },
    {
        "name": "get_smiley_prices",
        "description": "שליפת מחירים ומבצעים עדכניים מאתר Smiley.",
        "input_schema": {
            "type": "object",
            "properties": {}
        }
    }
]


# ======================================================
# מחלקת האגנט הראשית
# ======================================================

class SmileyAgent:
    def __init__(self):
        self.client = Anthropic()  # קורא אוטומטית מ-ANTHROPIC_API_KEY
        self.conversations: dict[str, list] = {}  # היסטוריית שיחה לכל משתמש
        self.pending_images: dict[str, list] = {}  # תמונות ממתינות לשליחה לכל user

    def chat(self, user_id: str, message: str) -> tuple[str, list]:
        """
        עיבוד הודעה מהמשתמש.
        מחזיר: (תשובת טקסט, רשימת URLs של תמונות לשלוח)
        """
        if user_id not in self.conversations:
            self.conversations[user_id] = []

        history = self.conversations[user_id]
        history.append({"role": "user", "content": message})

        if len(history) > 20:
            history = history[-20:]
            self.conversations[user_id] = history

        image_urls = []  # אוסף תמונות שנוצרו במהלך השיחה

        max_iterations = 5
        for iteration in range(max_iterations):
            response = self.client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=2048,
                system=SMILEY_SYSTEM_PROMPT,
                messages=history,
                tools=TOOLS,
            )

            history.append({"role": "assistant", "content": response.content})

            if response.stop_reason == "end_turn":
                text = ""
                for block in response.content:
                    if hasattr(block, "text"):
                        text += block.text
                self.conversations[user_id] = history
                return text if text else "✅ בוצע", image_urls

            elif response.stop_reason == "tool_use":
                tool_results = []

                for block in response.content:
                    if block.type == "tool_use":
                        print(f"🔧 מפעיל כלי: {block.name}")
                        result = self._execute_tool(block.name, block.input)

                        # זהה אם הוחזרה תמונה
                        if isinstance(result, str) and result.startswith("IMAGE:"):
                            url = result[6:].strip()
                            image_urls.append(url)
                            result = f"✅ התמונה נוצרה בהצלחה! URL: {url}"

                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result,
                        })

                history.append({"role": "user", "content": tool_results})

            else:
                break

        return "⚠️ האגנט לא הצליח לסיים את המשימה. נסה שוב.", image_urls

    def _execute_tool(self, tool_name: str, tool_input: dict) -> str:
        try:
            if tool_name == "search_google_drive":
                return search_drive(
                    query=tool_input["query"],
                    max_results=tool_input.get("max_results", 10)
                )
            elif tool_name == "read_drive_file":
                return read_drive_file(file_id=tool_input["file_id"])

            elif tool_name == "list_drive_folder":
                return list_drive_folder(
                    folder_name=tool_input.get("folder_name", ""),
                    folder_id=tool_input.get("folder_id", "")
                )
            elif tool_name == "generate_image_higgsfield":
                return generate_image(
                    prompt=tool_input["prompt"],
                    aspect_ratio=tool_input.get("aspect_ratio", "1:1"),
                    reference_image_url=tool_input.get("reference_image_url", ""),
                    quality=tool_input.get("quality", "standard"),
                )
            elif tool_name == "list_recent_higgsfield":
                return list_recent_generations(
                    limit=tool_input.get("limit", 10)
                )
            elif tool_name == "check_higgsfield_job":
                return get_generation_status(job_id=tool_input["job_id"])

            elif tool_name == "browse_smiley_website":
                return browse_smiley_website(path=tool_input.get("path", ""))

            elif tool_name == "browse_url":
                return browse_url(url=tool_input["url"])

            elif tool_name == "get_smiley_prices":
                return get_smiley_prices()

            else:
                return f"כלי לא מוכר: {tool_name}"

        except Exception as e:
            return f"שגיאה בהפעלת {tool_name}: {str(e)}"

    def clear_history(self, user_id: str):
        self.conversations[user_id] = []

    def get_history_summary(self, user_id: str) -> str:
        count = len(self.conversations.get(user_id, []))
        return f"היסטוריית שיחה: {count // 2} זוגות שאלה-תשובה"

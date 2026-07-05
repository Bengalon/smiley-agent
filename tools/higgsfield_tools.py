"""
higgsfield_tools.py — Higgsfield AI integration via CLI
יצירת תמונות, סרטונים ואודיו
"""

import os
import re
import time
import subprocess

WORKSPACE_ID = "f42c5703-8413-4162-8d9a-fc848db05a47"
_setup_done = False


def _get_env():
    env = os.environ.copy()
    extra = "/usr/local/bin:/root/.local/bin:" + os.path.expanduser("~/.local/bin")
    env["PATH"] = extra + ":" + env.get("PATH", "")
    return env


def _find_hf() -> str:
    candidates = [
        "/usr/local/bin/higgsfield", "/root/.local/bin/higgsfield",
        os.path.expanduser("~/.local/bin/higgsfield"),
        "/usr/local/bin/hf", "/root/.local/bin/hf",
        os.path.expanduser("~/.local/bin/hf"),
        "/usr/bin/higgsfield", "/usr/bin/hf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    for name in ["higgsfield", "hf"]:
        r = subprocess.run(["which", name], capture_output=True, text=True, env=_get_env())
        if r.returncode == 0:
            return r.stdout.strip()
    return "higgsfield"


def _setup():
    """כתוב credentials, התקן CLI אם חסר, הגדר workspace. רץ פעם אחת בלבד."""
    global _setup_done
    if _setup_done:
        return

    env = _get_env()

    # 1. כתוב credentials.json מ-env var
    creds_json = os.getenv("HIGGSFIELD_CREDENTIALS_JSON")
    if creds_json:
        creds_dir = os.path.expanduser("~/.config/higgsfield")
        os.makedirs(creds_dir, exist_ok=True)
        with open(os.path.join(creds_dir, "credentials.json"), "w") as f:
            f.write(creds_json)

    # 2. התקן CLI אם לא קיים
    r = subprocess.run(["which", "higgsfield"], capture_output=True, text=True, env=env)
    if r.returncode != 0:
        print("[Higgsfield] מתקין CLI...")
        subprocess.run(
            "curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh",
            shell=True, timeout=120, env=env
        )

    # 3. הגדר workspace
    hf = _find_hf()
    result = subprocess.run(
        [hf, "workspace", "set", WORKSPACE_ID],
        capture_output=True, text=True, timeout=30, env=env
    )
    print(f"[Higgsfield] workspace: {(result.stdout + result.stderr).strip()[:100]}")
    _setup_done = True


def _run(args: list, timeout: int = 60) -> str:
    hf = _find_hf()
    try:
        r = subprocess.run(
            [hf] + args,
            capture_output=True, text=True,
            timeout=timeout, env=_get_env()
        )
        output = r.stdout + r.stderr
        print(f"[Higgsfield] {' '.join(str(a) for a in args[:3])}")
        print(f"[Higgsfield] → {output[:400]}")
        return output
    except subprocess.TimeoutExpired:
        return "timeout"
    except Exception as e:
        return f"error: {str(e)}"


def _parse_job_id(output: str) -> str:
    """שלוף UUID מ-output של generate create."""
    match = re.search(r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', output)
    return match.group(0) if match else ""


def _find_url(text: str) -> str:
    """חפש URL של מדיה ב-text."""
    # נסה למצוא URL מלא
    matches = re.findall(r'https://\S+', text)
    for url in matches:
        url = url.strip(".,\"')")
        if any(ext in url for ext in ['.png', '.jpg', '.jpeg', '.webp', '.mp4', '.mov', '.wav', '.mp3']):
            return url
        if any(s in url for s in ['cdn', 'cloudfront', 's3', 'storage', 'higgsfield']):
            return url
    return ""


def _wait_for_url(job_id: str, max_wait: int = 300) -> str:
    """פולינג עד שהעבודה מסתיימת — מחזיר URL או מחרוזת ריקה."""
    start = time.time()
    while time.time() - start < max_wait:
        output = _run(["generate", "get", job_id], timeout=30)

        if "completed" in output.lower():
            url = _find_url(output)
            if url:
                return url
            # ניסיון נוסף: קח את הטוקן האחרון בשורה
            for line in output.splitlines():
                if "completed" in line.lower():
                    parts = line.split()
                    for p in reversed(parts):
                        if p.startswith("https://"):
                            return p

        if "failed" in output.lower():
            print(f"[Higgsfield] job failed: {output[:200]}")
            return ""

        time.sleep(8)

    return ""


def generate_image(prompt: str, aspect_ratio: str = "1:1",
                   reference_image_url: str = "", quality: str = "standard") -> str:
    _setup()
    args = ["generate", "create", "nano_banana_2", "--prompt", prompt]
    if reference_image_url:
        args += ["--image", reference_image_url]

    output = _run(args, timeout=60)
    job_id = _parse_job_id(output)
    if not job_id:
        return f"❌ שגיאת Higgsfield (תמונה): {output[:300]}"

    print(f"[Higgsfield] Image job {job_id} — ממתין...")
    url = _wait_for_url(job_id, max_wait=300)
    return f"IMAGE:{url}" if url else f"❌ Higgsfield timeout — job {job_id}"


def generate_video(prompt: str, reference_image_url: str = "") -> str:
    _setup()
    args = ["generate", "create", "kling3_0", "--prompt", prompt]
    if reference_image_url:
        args += ["--start-image", reference_image_url]

    output = _run(args, timeout=60)
    job_id = _parse_job_id(output)
    if not job_id:
        return f"❌ שגיאת Higgsfield (סרטון): {output[:300]}"

    print(f"[Higgsfield] Video job {job_id} — ממתין...")
    url = _wait_for_url(job_id, max_wait=600)
    return f"VIDEO:{url}" if url else f"❌ Higgsfield timeout — job {job_id}"


def generate_audio(prompt: str) -> str:
    _setup()
    args = ["generate", "create", "audio_gen", "--prompt", prompt]

    output = _run(args, timeout=60)
    job_id = _parse_job_id(output)
    if not job_id:
        return f"❌ שגיאת Higgsfield (אודיו): {output[:300]}"

    print(f"[Higgsfield] Audio job {job_id} — ממתין...")
    url = _wait_for_url(job_id, max_wait=300)
    return f"AUDIO:{url}" if url else f"❌ Higgsfield timeout — job {job_id}"


def list_recent_generations(limit: int = 10) -> str:
    _setup()
    output = _run(["generate", "list"], timeout=30)
    return output[:2000] if output else "אין יצירות"


def get_generation_status(job_id: str) -> str:
    _setup()
    output = _run(["generate", "get", job_id], timeout=30)
    return output[:1000]

# -*- coding: utf-8 -*-
"""בדיקת רינדור, גלישה אופקית ונגישות בסיסית לכל האתרים."""
import glob, os, sys
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/shots"
os.makedirs(OUT, exist_ok=True)

sites = sorted(glob.glob(os.path.join(BASE, "sites", "*", "index.html")))
problems = []

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    for widths in (390, 1280):
        ctx = browser.new_context(viewport={"width": widths, "height": 900})
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        for s in sites:
            slug = os.path.basename(os.path.dirname(s))
            errors.clear()
            page.goto("file://" + s, wait_until="load")
            info = page.evaluate("""() => ({
                scrollW: document.documentElement.scrollWidth,
                clientW: document.documentElement.clientWidth,
                h1: document.querySelectorAll('h1').length,
                title: document.title,
                lang: document.documentElement.lang,
                dir: document.documentElement.dir,
                imgNoAlt: [...document.querySelectorAll('img')].filter(i=>!i.alt).length,
                labels: [...document.querySelectorAll('input,textarea')].filter(el=>{
                    const id=el.id; return !(id && document.querySelector('label[for=\"'+id+'\"]'));
                }).length,
            })""")
            overflow = info["scrollW"] - info["clientW"]
            flags = []
            if overflow > 1: flags.append(f"OVERFLOW +{overflow}px@{widths}")
            if info["h1"] != 1: flags.append(f"h1={info['h1']}")
            if info["lang"] != "he" or info["dir"] != "rtl": flags.append("lang/dir")
            if info["imgNoAlt"]: flags.append(f"img-no-alt={info['imgNoAlt']}")
            if info["labels"]: flags.append(f"unlabeled-inputs={info['labels']}")
            if errors: flags.append(f"console-errors={len(errors)}")
            if flags:
                problems.append(f"[{widths}] {slug}: {', '.join(flags)}")
            if widths == 390 and slug in ("prachim-paz","kovalski-hair","falafel-ohana"):
                page.screenshot(path=os.path.join(OUT, f"m-{slug}.png"), full_page=True)
        ctx.close()
    browser.close()

print("בעיות שנמצאו:" if problems else "✅ אין בעיות — כל האתרים תקינים")
for pr in problems:
    print(" -", pr)

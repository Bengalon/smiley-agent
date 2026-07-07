# -*- coding: utf-8 -*-
import os, sys
from playwright.sync_api import sync_playwright

BASE = os.path.dirname(os.path.abspath(__file__))
CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/shots"
os.makedirs(OUT, exist_ok=True)
URL = "file://" + os.path.join(BASE, "dist", "live-preview.html")
fails = []

with sync_playwright() as p:
    br = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
    for W in (390, 1280):
        ctx = br.new_context(viewport={"width": W, "height": 900})
        pg = ctx.new_page()
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(URL, wait_until="load")

        # 1. index visible, all biz hidden
        vis = pg.evaluate("() => ({idx: !document.getElementById('index-view').hidden, "
                          "shown: [...document.querySelectorAll('.biz')].filter(a=>!a.hidden).length, "
                          "total: document.querySelectorAll('.biz').length})")
        if not vis["idx"] or vis["shown"] != 0:
            fails.append(f"[{W}] initial: idx={vis['idx']} shown={vis['shown']}")

        # 2. click a tile -> that biz visible, index hidden
        pg.click('.tile[href="#falafel-ohana"]')
        pg.wait_for_timeout(150)
        st = pg.evaluate("() => ({idx: document.getElementById('index-view').hidden, "
                         "shown: [...document.querySelectorAll('.biz')].filter(a=>!a.hidden).map(a=>a.id), "
                         "title: document.title, "
                         "sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth})")
        if not st["idx"] or st["shown"] != ["falafel-ohana"]:
            fails.append(f"[{W}] after click: idx_hidden={st['idx']} shown={st['shown']}")
        if st["sw"] - st["cw"] > 1:
            fails.append(f"[{W}] OVERFLOW +{st['sw']-st['cw']}px on business page")

        # 3. nav jump (click services) should not change hash to non-slug
        if W <= 860:
            pg.click('#falafel-ohana .nav-toggle')  # open mobile menu first
            pg.wait_for_timeout(100)
        pg.click('#falafel-ohana .nav-links button[data-sec="services"]')
        pg.wait_for_timeout(150)
        h = pg.evaluate("() => location.hash")
        if h != "#falafel-ohana":
            fails.append(f"[{W}] nav-jump changed hash to {h}")

        # 4. form validation
        pg.click('#falafel-ohana .contact-form .submit')
        pg.wait_for_timeout(100)
        msg = pg.evaluate("() => document.querySelector('#falafel-ohana .form-msg').textContent")
        if "למלא" not in msg:
            fails.append(f"[{W}] form validation msg unexpected: {msg!r}")

        # 5. back to index
        pg.click('#falafel-ohana .back')
        pg.wait_for_timeout(150)
        bk = pg.evaluate("() => ({idx: !document.getElementById('index-view').hidden, "
                         "shown: [...document.querySelectorAll('.biz')].filter(a=>!a.hidden).length})")
        if not bk["idx"] or bk["shown"] != 0:
            fails.append(f"[{W}] back: idx={bk['idx']} shown={bk['shown']}")

        # 6. deep-link direct load
        pg.goto(URL + "#leon-tailor", wait_until="load")
        pg.wait_for_timeout(150)
        dl = pg.evaluate("() => ({idx: document.getElementById('index-view').hidden, "
                         "shown: [...document.querySelectorAll('.biz')].filter(a=>!a.hidden).map(a=>a.id)})")
        if not dl["idx"] or dl["shown"] != ["leon-tailor"]:
            fails.append(f"[{W}] deeplink: idx_hidden={dl['idx']} shown={dl['shown']}")

        if errs:
            fails.append(f"[{W}] console-errors: {errs[:3]}")

        if W == 390:
            pg.screenshot(path=os.path.join(OUT, "spa-mobile-biz.png"), full_page=True)
        else:
            pg.goto(URL, wait_until="load")
            pg.screenshot(path=os.path.join(OUT, "spa-index.png"))
        ctx.close()
    br.close()

print("❌ בעיות:" if fails else "✅ SPA תקין — כל הבדיקות עברו")
for f in fails:
    print("  -", f)

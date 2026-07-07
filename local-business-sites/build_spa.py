# -*- coding: utf-8 -*-
"""
build_spa.py — אורז את כל 20 האתרים לעמוד אינטראקטיבי אחד (SPA) עם ניווט hash.
מייצר:
  dist/live-preview.html  — קובץ עצמאי מלא (לבדיקה מקומית / פריסה כלשהי)
  dist/artifact.html      — גרסת גוף בלבד (ללא doctype/head) לפרסום כ-Artifact

הניווט: עמוד אינדקס גלריה → לחיצה על כרטיס פותחת את אתר העסק (#slug),
כפתור "חזרה" חוזר לאינדקס. לכל עסק קישור-עומק משלו (…#slug).
"""
import json, os
from build import (PALETTES, CATEGORIES, REVIEWS, esc, whatsapp_link,
                   maps_link, waze_link, tel_link, YEAR)

BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(BASE, "dist")

# ---------------------------------------------------------------- CSS
CSS = """
*{box-sizing:border-box}
:root{--radius:16px;--maxw:1080px;--shadow:0 10px 30px rgba(0,0,0,.08);
  --font:'Segoe UI',system-ui,'Assistant','Rubik','Heebo',Arial,sans-serif}
#app{font-family:var(--font);color:#1a1a1e;background:#0f172a;line-height:1.7;font-size:17px}
#app h1,#app h2,#app h3,#app h4{line-height:1.25;margin:0 0 .4em;text-wrap:balance}
#app h2{font-size:clamp(1.5rem,3.5vw,2.1rem)}
#app p{margin:0 0 1em}
#app a{color:var(--primary)}
.biz,.idx{--primary:#334155;--dark:#0f172a;--accent:#94a3b8;--ink:#f8fafc;
  --bg:#fff;--surface:#f7f7f9;--text:#1a1a1e;--muted:#5b5b66;--line:#e6e6ec}
.container{max-width:var(--maxw);margin-inline:auto;padding-inline:20px}
.skip{position:absolute;right:-999px;top:0;background:#111;color:#fff;padding:10px 16px;z-index:100;border-radius:0 0 10px 10px}
.skip:focus{right:12px}
#app :focus-visible{outline:3px solid var(--accent,#38bdf8);outline-offset:2px;border-radius:6px}
[hidden]{display:none!important}

/* ---- index gallery ---- */
.idx{background:#0f172a;color:#e2e8f0;min-height:100vh}
.idx a{color:inherit;text-decoration:none}
.idx-header{padding:60px 0 36px;text-align:center;background:radial-gradient(circle at 50% 0%,#1e293b,#0f172a)}
.idx-header .eyebrow{display:inline-block;background:#1e293b;border:1px solid #334155;padding:6px 16px;border-radius:999px;font-weight:700;color:#93c5fd;margin-bottom:16px}
.idx-header h1{font-size:clamp(1.9rem,5vw,3rem);margin:0 0 12px;color:#fff}
.idx-header p{color:#94a3b8;max-width:60ch;margin:0 auto;font-size:1.1rem}
.stats{display:flex;gap:28px;justify-content:center;flex-wrap:wrap;margin-top:24px}
.stat b{display:block;font-size:2rem;color:#fff}
.stat span{color:#94a3b8;font-size:.9rem}
.idx-main{padding:36px 0 70px}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.tile{background:linear-gradient(160deg,#1e293b,#0f172a);border:1px solid #334155;border-radius:18px;padding:24px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden;transition:transform .15s,border-color .15s;cursor:pointer}
.tile::before{content:"";position:absolute;inset:0 0 auto 0;height:5px;background:linear-gradient(90deg,var(--c),var(--d))}
.tile:hover{transform:translateY(-4px);border-color:var(--c)}
.tile:focus-visible{outline:3px solid var(--c);outline-offset:3px}
.tile-emoji{font-size:2.3rem}
.tile-cat{color:#93c5fd;font-weight:700;font-size:.85rem}
.tile h2{font-size:1.18rem;margin:.1em 0;color:#fff}
.tile-loc,.tile-phone{color:#94a3b8;margin:0;font-size:.92rem}
.tile-go{margin-top:10px;font-weight:800;color:#fff}
.idx-foot{border-top:1px solid #1e293b;padding:26px 0;text-align:center;color:#64748b;font-size:.9rem}

/* ---- single business ---- */
.biz{background:#fff;color:var(--text);display:block}
.backbar{background:var(--dark);color:#fff}
.backbar .container{display:flex;align-items:center;justify-content:space-between;padding-block:10px;gap:12px}
.back{background:rgba(255,255,255,.14);color:#fff;border:1px solid rgba(255,255,255,.3);padding:8px 16px;border-radius:10px;font-weight:700;font-size:.95rem;cursor:pointer;text-decoration:none;display:inline-flex;gap:6px}
.back:hover{background:rgba(255,255,255,.25)}
.backbar .bb-name{font-weight:700;opacity:.85;font-size:.9rem}
.site-header{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-block:12px}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:1.12rem;color:var(--dark);background:none;border:0;cursor:pointer;font-family:inherit}
.brand .logo{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,var(--primary),var(--dark));color:#fff;font-size:1.2rem}
.nav-links{display:flex;gap:6px;align-items:center;list-style:none;margin:0;padding:0}
.nav-links button{background:none;border:0;font:inherit;color:var(--text);padding:8px 12px;border-radius:10px;font-weight:600;cursor:pointer}
.nav-links button:hover{background:var(--surface)}
.nav-links .nav-cta{background:var(--primary);color:#fff}
.nav-toggle{display:none;background:none;border:1px solid var(--line);border-radius:10px;padding:8px 12px;font-size:1.2rem;cursor:pointer}
.hero{position:relative;color:#fff;background:linear-gradient(135deg,var(--primary),var(--dark));overflow:hidden}
.hero::before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 20% 20%,rgba(255,255,255,.14),transparent 40%),radial-gradient(circle at 85% 80%,rgba(255,255,255,.1),transparent 40%)}
.hero-inner{position:relative;display:grid;grid-template-columns:1.3fr .7fr;gap:30px;align-items:center;padding-block:60px}
.hero .eyebrow{display:inline-block;background:rgba(255,255,255,.16);padding:6px 14px;border-radius:999px;font-weight:700;font-size:.9rem;margin-bottom:14px}
.hero h1{font-size:clamp(2rem,5vw,3.1rem);color:#fff}
.hero .lead{font-size:1.2rem;color:var(--ink);max-width:44ch}
.hero-badge{aspect-ratio:1;display:grid;place-items:center;font-size:clamp(4rem,14vw,8rem);background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.25);border-radius:28px}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:12px;font-weight:800;text-decoration:none;border:2px solid transparent;cursor:pointer;font-size:1rem}
.btn-primary{background:#fff;color:var(--dark)}
.btn-ghost{background:rgba(255,255,255,.1);color:#fff;border-color:rgba(255,255,255,.55)}
.btn-ghost:hover{background:rgba(255,255,255,.2)}
.biz .sec{padding-block:56px}
.sec-alt{background:var(--surface)}
.section-head{text-align:center;max-width:60ch;margin-inline:auto;margin-bottom:32px}
.section-head .kicker{color:var(--primary);font-weight:800;letter-spacing:.04em;font-size:.85rem}
.note{color:var(--muted);font-size:.95rem}
.grid{display:grid;gap:18px;list-style:none;margin:0;padding:0}
.g3{grid-template-columns:repeat(3,1fr)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:22px;transition:transform .15s,box-shadow .15s}
.card:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
.card-emoji{font-size:2rem;display:inline-block;margin-bottom:10px}
.card h3{font-size:1.12rem}.card p{color:var(--muted);margin:0}
.feature{display:flex;gap:14px;align-items:flex-start;background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:20px}
.feature-emoji{font-size:1.8rem}.feature h3{font-size:1.08rem;margin:0 0 .2em}.feature p{color:var(--muted);margin:0}
.shot{margin:0;border-radius:var(--radius);overflow:hidden;position:relative;aspect-ratio:4/3;display:grid;place-items:center;color:#fff}
.shot-0{background:linear-gradient(135deg,var(--primary),var(--dark))}
.shot-1{background:linear-gradient(135deg,var(--dark),var(--primary))}
.shot-2{background:linear-gradient(135deg,var(--accent),var(--primary))}
.shot-emoji{font-size:3.2rem;filter:drop-shadow(0 4px 8px rgba(0,0,0,.25))}
.shot figcaption{position:absolute;inset-inline:0;bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.55));padding:14px;font-weight:700}
.about-wrap{display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:center}
.about-card{background:linear-gradient(135deg,var(--primary),var(--dark));color:#fff;border-radius:24px;padding:34px;min-height:200px;display:grid;place-content:center;text-align:center}
.about-card .big{font-size:4.6rem}
.review{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:22px;margin:0}
.review p{font-size:1.05rem}.review cite{color:var(--primary);font-weight:700;font-style:normal}
.hc-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px}
.panel{background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:26px}
.hours-list{list-style:none;margin:0;padding:0}
.hours-list li{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px dashed var(--line)}
.hours-list li:last-child{border-bottom:0}.hours-list .day{font-weight:700}
.ci{display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-bottom:1px dashed var(--line)}
.ci:last-child{border-bottom:0}.ci .cem{font-size:1.3rem}
.ci dt{font-weight:800;font-size:.85rem;color:var(--muted)}.ci dd{margin:0;font-size:1.05rem}
.contact-form{display:grid;gap:14px;margin-top:16px}
.contact-form label{display:grid;gap:6px;font-weight:700;font-size:.95rem}
.contact-form input,.contact-form textarea{font:inherit;padding:12px 14px;border:1.5px solid var(--line);border-radius:10px;background:#fff;width:100%}
.contact-form input:focus,.contact-form textarea:focus{border-color:var(--primary);outline:none}
.form-msg{padding:12px 14px;border-radius:10px;font-weight:700;display:none}
.form-msg.ok{display:block;background:#ecfdf5;color:#065f46;border:1px solid #6ee7b7}
.form-msg.err{display:block;background:#fef2f2;color:#991b1b;border:1px solid #fca5a5}
.submit{background:var(--primary);color:#fff;justify-self:start}
.site-footer{background:var(--dark);color:#fff;padding-block:36px}
.site-footer a{color:#fff}
.foot-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:26px}
.foot-grid h4{margin:0 0 12px;font-size:1rem}
.foot-grid ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.foot-note{border-top:1px solid rgba(255,255,255,.15);margin-top:26px;padding-top:16px;font-size:.85rem;color:#cbd5e1;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
@media (max-width:860px){
  .hero-inner,.about-wrap,.hc-grid{grid-template-columns:1fr}
  .hero-badge{display:none}
  .g3,.foot-grid,.tiles{grid-template-columns:1fr 1fr}
  .nav-links{position:absolute;inset-inline:0;top:100%;flex-direction:column;background:#fff;border-bottom:1px solid var(--line);padding:14px 20px;display:none;align-items:stretch}
  .nav-links.open{display:flex}
  .nav-links button{width:100%;text-align:start}
  .nav-toggle{display:inline-block}
}
@media (max-width:520px){.g3,.foot-grid,.tiles{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
"""

# ---------------------------------------------------------------- one business
def biz_html(b):
    cat = CATEGORIES[b["category"]]
    pal = PALETTES.get(b.get("theme", "slate"), PALETTES["slate"])
    name, short = b["name"], b.get("short_name", b["name"])
    nav = cat["nav"]
    phone = b.get("phone")
    tel, wa = tel_link(phone), whatsapp_link(phone)
    maps, waze = maps_link(b["address"]), waze_link(b["address"])

    ctas = []
    if tel:
        ctas.append(f'<a class="btn btn-primary" href="{tel}">📞 {esc(phone)}</a>')
    if wa:
        ctas.append(f'<a class="btn btn-ghost" href="{wa}" target="_blank" rel="noopener">💬 וואטסאפ</a>')
    ctas.append(f'<a class="btn btn-ghost" href="{maps}" target="_blank" rel="noopener">📍 ניווט</a>')

    services = "\n".join(
        f'<li class="card"><span class="card-emoji" aria-hidden="true">{s[0]}</span>'
        f'<h3>{esc(s[1])}</h3><p>{esc(s[2])}</p></li>' for s in cat["services"])
    features = "\n".join(
        f'<li class="feature"><span class="feature-emoji" aria-hidden="true">{f[0]}</span>'
        f'<div><h3>{esc(f[1])}</h3><p>{esc(f[2])}</p></div></li>' for f in cat["features"])
    gallery = "\n".join(
        f'<figure class="shot shot-{i%3}"><span class="shot-emoji" aria-hidden="true">{cat["hero_emoji"]}</span>'
        f'<figcaption>{esc(lbl)}</figcaption></figure>' for i, lbl in enumerate(cat["gallery"]))
    reviews = "\n".join(
        f'<blockquote class="review"><p>“{esc(t)}”</p><cite>— {esc(w)}</cite></blockquote>'
        for w, t in REVIEWS)

    ci = [f'<div class="ci"><span class="cem" aria-hidden="true">📍</span><div><dt>כתובת</dt>'
          f'<dd><a href="{maps}" target="_blank" rel="noopener">{esc(b["address"])}</a></dd></div></div>']
    if phone:
        ci.append(f'<div class="ci"><span class="cem" aria-hidden="true">📞</span><div><dt>טלפון</dt>'
                  f'<dd><a href="{tel}">{esc(phone)}</a></dd></div></div>')
    if wa:
        ci.append(f'<div class="ci"><span class="cem" aria-hidden="true">💬</span><div><dt>וואטסאפ</dt>'
                  f'<dd><a href="{wa}" target="_blank" rel="noopener">שליחת הודעה</a></dd></div></div>')
    ci.append(f'<div class="ci"><span class="cem" aria-hidden="true">🧭</span><div><dt>ניווט</dt>'
              f'<dd><a href="{waze}" target="_blank" rel="noopener">Waze</a> · '
              f'<a href="{maps}" target="_blank" rel="noopener">Google Maps</a></dd></div></div>')

    foot_contact = [f'<li><a href="{maps}" target="_blank" rel="noopener">{esc(b["address"])}</a></li>']
    if phone:
        foot_contact.append(f'<li><a href="{tel}">{esc(phone)}</a></li>')
    if wa:
        foot_contact.append(f'<li><a href="{wa}" target="_blank" rel="noopener">וואטסאפ</a></li>')

    style = (f"--primary:{pal['primary']};--dark:{pal['dark']};"
             f"--accent:{pal['accent']};--ink:{pal['ink']}")
    title = f"{name} | {b['category_he']} ב{b['city']}"

    return f'''<article class="biz" id="{b['slug']}" data-title="{esc(title)}" style="{style}" hidden>
  <div class="backbar"><div class="container">
    <a class="back" href="#">→ חזרה לכל האתרים</a>
    <span class="bb-name">{esc(b['category_he'])} · {esc(b['city'])}</span>
  </div></div>
  <header class="site-header"><div class="container nav">
    <button class="brand jump" data-sec="hero"><span class="logo" aria-hidden="true">{cat['hero_emoji']}</span><span>{esc(short)}</span></button>
    <button class="nav-toggle" aria-expanded="false" aria-label="פתיחת תפריט">☰</button>
    <ul class="nav-links">
      <li><button class="jump" data-sec="services">{esc(nav['services'])}</button></li>
      <li><button class="jump" data-sec="gallery">{esc(nav['gallery'])}</button></li>
      <li><button class="jump" data-sec="hours">{esc(nav['hours'])}</button></li>
      <li><button class="jump nav-cta" data-sec="contact">{esc(nav['contact'])}</button></li>
    </ul>
  </div></header>
  <div class="biz-main">
  <section class="sec hero" data-sec="hero" aria-label="ברוכים הבאים"><div class="container hero-inner">
    <div>
      <span class="eyebrow">{esc(b['category_he'])} · {esc(b['city'])}</span>
      <h1>{esc(name)}</h1>
      <p class="lead">{esc(b['tagline'])}</p>
      <div class="cta-row">{''.join(ctas)}</div>
    </div>
    <div class="hero-badge" aria-hidden="true">{cat['hero_emoji']}</div>
  </div></section>
  <section class="sec" data-sec="services" aria-label="{esc(cat['services_title'])}"><div class="container">
    <div class="section-head"><span class="kicker">{esc(b['category_he'])}</span>
      <h2>{esc(cat['services_title'])}</h2><p class="note">{esc(cat['services_note'])}</p></div>
    <ul class="grid g3">{services}</ul>
  </div></section>
  <section class="sec sec-alt" data-sec="features" aria-label="למה אנחנו"><div class="container">
    <div class="section-head"><span class="kicker">למה אנחנו</span><h2>מה שאתם מקבלים אצלנו</h2></div>
    <ul class="grid g3">{features}</ul>
  </div></section>
  <section class="sec" data-sec="about" aria-label="קצת עלינו"><div class="container about-wrap">
    <div><span class="kicker" style="color:var(--primary);font-weight:800">קצת עלינו</span>
      <h2>הסיפור של {esc(short)}</h2>
      <p>{esc(short)} {esc(cat['about'])}</p>
      <p>אנחנו נמצאים ב{esc(b['address'])} ומשרתים את {esc(b['city'])} והסביבה. מוזמנים לקפוץ, להתקשר או לשלוח הודעה.</p></div>
    <div class="about-card"><div class="big" aria-hidden="true">{cat['hero_emoji']}</div>
      <p style="margin:0;font-weight:700;font-size:1.2rem">{esc(b['city'])}</p>
      <p style="margin:0;color:var(--ink)">{esc(b['address'])}</p></div>
  </div></section>
  <section class="sec sec-alt" data-sec="gallery" aria-label="גלריה"><div class="container">
    <div class="section-head"><span class="kicker">{esc(nav['gallery'])}</span><h2>רגעים מאצלנו</h2>
      <p class="note">התמונות להמחשה — ניתן להחליף בתמונות אמיתיות של העסק.</p></div>
    <div class="grid g3">{gallery}</div>
  </div></section>
  <section class="sec" data-sec="reviews" aria-label="המלצות"><div class="container">
    <div class="section-head"><span class="kicker">המלצות</span><h2>מה אומרים עלינו</h2>
      <p class="note">ביקורות לדוגמה — מומלץ להחליף בהמלצות אמיתיות.</p></div>
    <div class="grid g3">{reviews}</div>
  </div></section>
  <section class="sec sec-alt" data-sec="contact" aria-label="יצירת קשר"><div class="container">
    <div class="section-head"><span class="kicker">{esc(nav['contact'])}</span><h2>בואו נדבר</h2></div>
    <div class="hc-grid">
      <div class="panel" data-sec="hours"><h3>שעות פעילות</h3>
        <ul class="hours-list">
          <li><span class="day">ראשון–חמישי</span><span>09:00–19:00</span></li>
          <li><span class="day">שישי / ערבי חג</span><span>09:00–14:00</span></li>
          <li><span class="day">שבת</span><span>סגור</span></li>
        </ul>
        <p class="note" style="margin-top:14px">שעות הפעילות להמחשה — ניתן לעדכן לשעות המדויקות.</p>
        <h3 style="margin-top:22px">פרטים ליצירת קשר</h3>
        <dl style="margin:0">{''.join(ci)}</dl>
      </div>
      <div class="panel"><h3>השאירו הודעה</h3>
        <p class="note">מלאו את הפרטים ונחזור אליכם בהקדם.</p>
        <form class="contact-form" novalidate>
          <label>שם מלא<input name="name" type="text" autocomplete="name" required aria-required="true"></label>
          <label>טלפון<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-required="true"></label>
          <label>הודעה<textarea name="message" rows="4"></textarea></label>
          <p class="form-msg" role="status" aria-live="polite"></p>
          <button class="btn submit" type="submit">שליחה</button>
        </form>
      </div>
    </div>
  </div></section>
  <footer class="site-footer"><div class="container">
    <div class="foot-grid">
      <div><h4>{esc(name)}</h4><p style="color:#cbd5e1">{esc(b['tagline'])}</p>
        <p style="color:#cbd5e1">{esc(b['category_he'])} · {esc(b['city'])}</p></div>
      <div><h4>ניווט</h4><ul>
        <li><button class="jump" data-sec="services" style="background:none;border:0;color:#fff;font:inherit;cursor:pointer;padding:0">{esc(nav['services'])}</button></li>
        <li><button class="jump" data-sec="gallery" style="background:none;border:0;color:#fff;font:inherit;cursor:pointer;padding:0">{esc(nav['gallery'])}</button></li>
        <li><button class="jump" data-sec="contact" style="background:none;border:0;color:#fff;font:inherit;cursor:pointer;padding:0">{esc(nav['contact'])}</button></li>
      </ul></div>
      <div><h4>יצירת קשר</h4><ul>{''.join(foot_contact)}</ul></div>
    </div>
    <div class="foot-note"><span>© {YEAR} {esc(name)}. כל הזכויות שמורות.</span>
      <span>אתר לדוגמה שנבנה עבור העסק · התוכן ניתן לעדכון</span></div>
  </div></footer>
  </div>
</article>'''


def index_html(businesses):
    cities = sorted(set(b["city"] for b in businesses))
    tiles = []
    for b in businesses:
        cat = CATEGORIES[b["category"]]
        pal = PALETTES.get(b.get("theme", "slate"), PALETTES["slate"])
        phone = b.get("phone") or "לאימות"
        tiles.append(
            f'<a class="tile" href="#{b["slug"]}" style="--c:{pal["primary"]};--d:{pal["dark"]}">'
            f'<span class="tile-emoji" aria-hidden="true">{cat["hero_emoji"]}</span>'
            f'<span class="tile-cat">{esc(b["category_he"])}</span>'
            f'<h2>{esc(b["name"])}</h2>'
            f'<p class="tile-loc">📍 {esc(b["address"])}</p>'
            f'<p class="tile-phone">📞 {esc(phone)}</p>'
            f'<span class="tile-go">לצפייה באתר ←</span></a>')
    n = len(businesses)
    return f'''<div class="idx" id="index-view">
  <header class="idx-header"><div class="container">
    <span class="eyebrow">גוש דן · {esc(' · '.join(cities))}</span>
    <h1>אתרים לעסקים מקומיים</h1>
    <p>{n} אתרים מלאים, נגישים ומותאמים אישית — שנבנו לעסקים אמיתיים באזור שאין להם עדיין אתר אינטרנט. לחצו על עסק כדי לפתוח את האתר שלו.</p>
    <div class="stats">
      <div class="stat"><b>{n}</b><span>אתרים</span></div>
      <div class="stat"><b>{len(cities)}</b><span>ערים</span></div>
      <div class="stat"><b>{len(set(b['category'] for b in businesses))}</b><span>תחומים</span></div>
    </div>
  </div></header>
  <main class="idx-main"><div class="container"><div class="tiles">
{chr(10).join(tiles)}
  </div></div></main>
  <footer class="idx-foot"><div class="container">כל הפרטים נאספו ממקורות פומביים ומיועדים לאימות לפני פנייה לעסק · תוכן לדוגמה שהעסק מחליף בתוכנו שלו.</div></footer>
</div>'''


SCRIPT = """
(function(){
  var app=document.getElementById('app');
  var slugs={};
  document.querySelectorAll('.biz').forEach(function(a){slugs[a.id]=a;});
  var idx=document.getElementById('index-view');
  var baseTitle=document.title;
  function route(){
    var h=decodeURIComponent((location.hash||'').replace(/^#/,''));
    var biz=slugs[h];
    for(var k in slugs){slugs[k].hidden=(k!==h);}
    if(biz){idx.hidden=true;document.title=biz.getAttribute('data-title')||baseTitle;}
    else{idx.hidden=false;document.title=baseTitle;}
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);
  document.addEventListener('click',function(e){
    var j=e.target.closest('.jump');
    if(j){var b=j.closest('.biz');if(b){var s=b.querySelector('.sec[data-sec="'+j.getAttribute('data-sec')+'"]');if(s)s.scrollIntoView({behavior:'smooth',block:'start'});var m=b.querySelector('.nav-links');if(m){m.classList.remove('open');var t=b.querySelector('.nav-toggle');if(t)t.setAttribute('aria-expanded','false');}}return;}
    var tg=e.target.closest('.nav-toggle');
    if(tg){var menu=tg.closest('.site-header').querySelector('.nav-links');var open=menu.classList.toggle('open');tg.setAttribute('aria-expanded',open?'true':'false');}
  });
  document.addEventListener('submit',function(e){
    var f=e.target.closest('.contact-form');if(!f)return;e.preventDefault();
    var name=f.querySelector('[name=name]').value.trim();
    var phone=f.querySelector('[name=phone]').value.trim();
    var s=f.querySelector('.form-msg');s.className='form-msg';
    if(!name||!phone){s.classList.add('err');s.textContent='נא למלא שם וטלפון.';return;}
    if(!/^[0-9+\\-\\s()]{7,}$/.test(phone)){s.classList.add('err');s.textContent='מספר הטלפון אינו תקין.';return;}
    s.classList.add('ok');s.textContent='תודה '+name+'! ההודעה התקבלה ונחזור אליך בהקדם.';f.reset();
  });
  route();
})();
"""


def build():
    with open(os.path.join(BASE, "data", "businesses.json"), encoding="utf-8") as f:
        businesses = json.load(f)
    os.makedirs(DIST, exist_ok=True)

    body = (f'<div id="app" dir="rtl" lang="he">\n'
            f'<a class="skip" href="#index-view">דלג לתוכן</a>\n'
            + index_html(businesses) + "\n"
            + "\n".join(biz_html(b) for b in businesses)
            + "\n</div>")

    # גרסת Artifact — גוף בלבד
    artifact = f"<style>{CSS}</style>\n{body}\n<script>{SCRIPT}</script>\n"
    with open(os.path.join(DIST, "artifact.html"), "w", encoding="utf-8") as f:
        f.write(artifact)

    # גרסה עצמאית מלאה — לבדיקה/פריסה
    standalone = (f'<!DOCTYPE html>\n<html lang="he" dir="rtl"><head>'
                  f'<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
                  f'<title>אתרים לעסקים מקומיים · גוש דן</title>'
                  f'<style>{CSS}</style></head><body>{body}<script>{SCRIPT}</script></body></html>')
    with open(os.path.join(DIST, "live-preview.html"), "w", encoding="utf-8") as f:
        f.write(standalone)

    print(f"✅ dist/artifact.html ({len(artifact)//1024} KB)")
    print(f"✅ dist/live-preview.html ({len(standalone)//1024} KB)")
    print(f"   {len(businesses)} עסקים · deep-links: " +
          ", ".join('#' + b['slug'] for b in businesses[:3]) + " …")


if __name__ == "__main__":
    build()

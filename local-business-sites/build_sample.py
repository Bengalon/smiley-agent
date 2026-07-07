# -*- coding: utf-8 -*-
"""
build_sample.py — אתר דוגמה משודרג (פסיכו ברבר שופ) לפי מערכת העיצוב של
UI/UX Pro Max: סגנון Modern Dark, פונטים אמיתיים מוטמעים (Frank Ruhl Libre +
Noto Sans Hebrew), אייקוני SVG במקום אמוג'י, אקסנט אדום, מוֹשן עדין ונגישות.
מייצר:
  samples/psycho-barber-pro.html           — עצמאי מלא (לבדיקה/פריסה)
  samples/psycho-barber-pro.artifact.html   — גוף בלבד ל-Artifact
"""
import os

BASE = os.path.dirname(os.path.abspath(__file__))
FONTS = open(os.path.join(BASE, "assets", "fonts-heb.css"), encoding="utf-8").read()

# ---- אייקוני SVG (Lucide, stroke) ----
def svg(paths, w=24):
    return (f'<svg class="ic" width="{w}" height="{w}" viewBox="0 0 24 24" fill="none" '
            f'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true">{paths}</svg>')

IC = {
    "scissors": svg('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>'),
    "razor": svg('<path d="M7 3v6a3 3 0 0 0 3 3h1"/><path d="M14 12l7-7"/><rect x="3" y="12" width="8" height="9" rx="2"/>'),
    "user": svg('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    "sparkles": svg('<path d="M12 3l1.9 4.8L18 9.5l-4.1 1.7L12 16l-1.9-4.8L6 9.5l4.1-1.7z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/>'),
    "baby": svg('<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5S14.5 8 12 8"/>'),
    "droplet": svg('<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"/>'),
    "star": '<svg class="ic star" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>',
    "heart": svg('<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 12 5 5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>'),
    "clock": svg('<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>'),
    "shield": svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>'),
    "phone": svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.5-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/>'),
    "chat": svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>'),
    "pin": svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
    "nav": svg('<polygon points="3 11 22 2 13 21 11 13 3 11"/>'),
    "menu": svg('<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>'),
    "check": svg('<polyline points="20 6 9 17 4 12"/>'),
    "arrow": svg('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),
}

SERVICES = [
    ("scissors", "תספורת גברים", "תספורת מדויקת בהתאמה אישית, כולל פֵייד, גימור ועיצוב סופי."),
    ("razor", "עיצוב וטיפוח זקן", "קיצוב ועיצוב זקן עם מגבת חמה ושמנים לגימור חלק."),
    ("user", "תספורת נשים", "תספורת, פן ועיצוב לפי הסגנון והמבנה שמתאימים לך."),
    ("sparkles", "צבע והחלקה", "צביעה, גוונים והחלקות בחומרים מקצועיים ואיכותיים."),
    ("baby", "תספורת ילדים", "יחס סבלני ונעים, חוויה קלה גם לקטנטנים."),
    ("droplet", "חפיפה וטיפוח", "חפיפה, טריטמנט ועיצוב לשיער בריא ומטופח."),
]
FEATURES = [
    ("heart", "יחס אישי", "מכירים כל לקוח בשם ומתאימים את התספורת בדיוק אליך."),
    ("clock", "בלי להמתין", "מתאמים תור מראש ונכנסים בזמן, בלי תורים מיותרים."),
    ("shield", "היגיינה מלאה", "כלים מעוקרים וסביבה נקייה ומסודרת בכל תספורת."),
]
GALLERY = ["פֵייד קלאסי", "עיצוב זקן", "פומפדור", "גוונים", "לוק ערב", "האווירה במספרה"]
REVIEWS = [
    ("לקוח קבוע", "התספורת הכי טובה שקיבלתי בפלורנטין. יחס אישי ותוצאה מדויקת בכל פעם."),
    ("תושב השכונה", "מקום עם אופי. יושבים, מדברים, יוצאים מסופרים מצוין. ממליץ בחום."),
    ("לקוח חדש", "הגעתי בהמלצה ונשארתי. מקצועיות ברמה אחרת, שווה כל שקל."),
]

STYLE = """
""" + FONTS + """
*{box-sizing:border-box}
#app{
  --bg:#0b1120;--bg2:#0f1830;--surface:#111c34;--surface2:#16223f;
  --text:#e8ecf4;--muted:#9aa6bd;--line:rgba(255,255,255,.09);
  --accent:#e11d2a;--accent-soft:#f0454f;--gold:#c8a15a;
  --font:'Noto Sans Hebrew',system-ui,'Segoe UI',Arial,sans-serif;
  --display:'Frank Ruhl Libre',Georgia,serif;
  font-family:var(--font);background:var(--bg);color:var(--text);
  line-height:1.75;font-size:17px;-webkit-font-smoothing:antialiased;
}
#app h1,#app h2,#app h3{font-family:var(--display);line-height:1.15;margin:0 0 .4em;font-weight:700;letter-spacing:-.01em;text-wrap:balance}
#app p{margin:0 0 1em}
#app a{color:inherit;text-decoration:none}
.wrap{max-width:1120px;margin-inline:auto;padding-inline:22px}
.ic{flex:none;stroke-width:1.7}
.skip{position:absolute;right:-999px;top:0;background:var(--accent);color:#fff;padding:10px 16px;z-index:200;border-radius:0 0 12px 12px;font-weight:700}
.skip:focus{right:12px}
#app :focus-visible{outline:2.5px solid var(--accent-soft);outline-offset:3px;border-radius:8px}
.eyebrow{font-family:var(--font);display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent-soft)}
.kicker{font-family:var(--font);color:var(--accent-soft);font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.78rem}

/* header */
.hdr{position:sticky;top:0;z-index:100;background:rgba(11,17,32,.72);backdrop-filter:blur(14px) saturate(1.4);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-block:14px}
.brand{display:flex;align-items:center;gap:11px;font-family:var(--display);font-weight:900;font-size:1.28rem}
.brand .mark{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;color:#fff;background:linear-gradient(145deg,var(--accent),#7f1015);box-shadow:0 6px 18px rgba(225,29,42,.35)}
.brand .mark .ic{width:22px;height:22px}
.links{display:flex;gap:4px;align-items:center;list-style:none;margin:0;padding:0}
.links button{font-family:var(--font);background:none;border:0;color:var(--muted);font:inherit;font-weight:600;padding:9px 14px;border-radius:10px;cursor:pointer;transition:color .2s,background .2s}
.links button:hover{color:var(--text);background:rgba(255,255,255,.05)}
.btn{font-family:var(--font);display:inline-flex;align-items:center;gap:9px;padding:13px 24px;border-radius:12px;font-weight:700;cursor:pointer;border:1.5px solid transparent;font-size:1rem;transition:transform .18s cubic-bezier(.16,1,.3,1),box-shadow .2s,background .2s;text-decoration:none}
.btn .ic{width:19px;height:19px}
.btn-accent{background:var(--accent);color:#fff;box-shadow:0 8px 22px rgba(225,29,42,.32)}
.btn-accent:hover{background:var(--accent-soft);transform:translateY(-2px)}
.btn-accent:active{transform:scale(.97)}
.btn-ghost{background:rgba(255,255,255,.04);color:var(--text);border-color:var(--line)}
.btn-ghost:hover{background:rgba(255,255,255,.09);transform:translateY(-2px)}
.nav .btn{padding:10px 18px}
.toggle{display:none;background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--text);border-radius:10px;padding:8px 11px;cursor:pointer}

/* hero */
.hero{position:relative;overflow:hidden;border-bottom:1px solid var(--line)}
.hero::before{content:"";position:absolute;inset:0;background:
  radial-gradient(60% 55% at 78% 15%,rgba(225,29,42,.28),transparent 60%),
  radial-gradient(50% 50% at 15% 90%,rgba(200,161,90,.12),transparent 60%),
  linear-gradient(180deg,var(--bg2),var(--bg));z-index:-1}
.hero-in{display:grid;grid-template-columns:1.25fr .75fr;gap:36px;align-items:center;padding-block:84px}
.hero h1{font-size:clamp(2.6rem,6.5vw,4.6rem);font-weight:900}
.hero h1 .accent{color:var(--accent-soft)}
.hero .lead{font-size:1.24rem;color:var(--muted);max-width:46ch}
.cta-row{display:flex;flex-wrap:wrap;gap:13px;margin-top:28px}
.pole{position:relative;aspect-ratio:1;border-radius:24px;border:1px solid var(--line);background:linear-gradient(160deg,var(--surface),var(--bg2));display:grid;place-items:center;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.4)}
.pole .disc{width:60%;aspect-ratio:1;border-radius:50%;background:conic-gradient(from 0deg,var(--accent) 0 25%,#fff 0 50%,var(--accent) 0 75%,#fff 0 100%);opacity:.9;filter:blur(.3px);animation:spin 9s linear infinite}
.pole .glass{position:absolute;inset:0;background:radial-gradient(circle at 50% 35%,rgba(255,255,255,.14),transparent 55%)}
.pole .ic{position:absolute;width:64px;height:64px;color:#fff;filter:drop-shadow(0 4px 10px rgba(0,0,0,.5))}
@keyframes spin{to{transform:rotate(360deg)}}
.trust{display:flex;gap:26px;flex-wrap:wrap;margin-top:30px;padding-top:22px;border-top:1px solid var(--line)}
.trust .t b{font-family:var(--display);font-size:1.7rem;display:block;color:#fff}
.trust .t span{color:var(--muted);font-size:.85rem}

/* sections */
.sec{padding-block:76px;position:relative}
.sec.alt{background:linear-gradient(180deg,var(--bg),var(--bg2))}
.head{max-width:60ch;margin:0 auto 44px;text-align:center}
.head h2{font-size:clamp(1.9rem,4vw,2.7rem)}
.head p{color:var(--muted)}
.grid{display:grid;gap:20px;list-style:none;margin:0;padding:0}
.g3{grid-template-columns:repeat(3,1fr)}
.card{background:linear-gradient(180deg,var(--surface),var(--bg2));border:1px solid var(--line);border-radius:18px;padding:28px;transition:transform .22s cubic-bezier(.16,1,.3,1),border-color .22s,box-shadow .22s}
.card:hover{transform:translateY(-5px);border-color:rgba(225,29,42,.5);box-shadow:0 20px 40px rgba(0,0,0,.35)}
.card .ico{width:52px;height:52px;border-radius:13px;display:grid;place-items:center;color:var(--accent-soft);background:rgba(225,29,42,.1);border:1px solid rgba(225,29,42,.22);margin-bottom:16px}
.card h3{font-size:1.28rem;margin-bottom:.3em}
.card p{color:var(--muted);margin:0;font-size:.98rem}
.feat{display:flex;gap:16px;align-items:flex-start;background:rgba(255,255,255,.02);border:1px solid var(--line);border-radius:16px;padding:24px}
.feat .ico{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;color:var(--gold);background:rgba(200,161,90,.1);border:1px solid rgba(200,161,90,.22);flex:none}
.feat h3{font-size:1.15rem;font-family:var(--font);font-weight:700;margin:0 0 .2em}
.feat p{color:var(--muted);margin:0}
.gal{grid-template-columns:repeat(3,1fr)}
.shot{position:relative;aspect-ratio:4/3;border-radius:16px;overflow:hidden;border:1px solid var(--line);display:grid;place-items:center;background:linear-gradient(150deg,var(--surface2),var(--bg))}
.shot::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(225,29,42,.16),transparent 60%)}
.shot .ic{width:46px;height:46px;color:rgba(255,255,255,.4)}
.shot figcaption{position:absolute;inset-inline:0;bottom:0;padding:14px 16px;font-weight:700;font-size:.95rem;background:linear-gradient(transparent,rgba(0,0,0,.7))}
.shot .bar{position:absolute;top:0;inset-inline:0;height:4px;background:linear-gradient(90deg,var(--accent),var(--gold))}
.about{display:grid;grid-template-columns:1.1fr .9fr;gap:40px;align-items:center}
.about .big{font-family:var(--display);font-size:clamp(1.4rem,2.4vw,1.9rem);color:var(--text);font-weight:500;line-height:1.5}
.about .card-x{background:linear-gradient(150deg,var(--accent),#7f1015);border-radius:22px;padding:40px;color:#fff;box-shadow:0 26px 50px rgba(225,29,42,.3)}
.about .card-x .ic{width:56px;height:56px;margin-bottom:14px}
.about .card-x b{font-family:var(--display);font-size:1.5rem;display:block}
.review{background:linear-gradient(180deg,var(--surface),var(--bg2));border:1px solid var(--line);border-radius:18px;padding:26px}
.review .stars{display:flex;gap:2px;color:var(--gold);margin-bottom:12px}
.review p{font-size:1.05rem;color:var(--text)}
.review cite{color:var(--muted);font-style:normal;font-weight:700;font-size:.92rem}
.hc{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.panel{background:linear-gradient(180deg,var(--surface),var(--bg2));border:1px solid var(--line);border-radius:18px;padding:30px}
.panel h3{font-family:var(--font);font-weight:700;font-size:1.2rem;margin-bottom:.6em}
.hours{list-style:none;margin:0 0 8px;padding:0}
.hours li{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line)}
.hours li:last-child{border:0}.hours .day{font-weight:600}
.ci{display:flex;gap:13px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}
.ci:last-child{border:0}.ci .ico{color:var(--accent-soft);flex:none}
.ci dt{font-size:.78rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.06em}
.ci dd{margin:0;font-size:1.05rem;font-weight:600}
form{display:grid;gap:15px;margin-top:6px}
label{display:grid;gap:7px;font-weight:600;font-size:.92rem}
input,textarea{font:inherit;padding:13px 15px;border:1.5px solid var(--line);border-radius:11px;background:rgba(255,255,255,.03);color:var(--text);width:100%;transition:border-color .2s}
input::placeholder,textarea::placeholder{color:#6b7891}
input:focus,textarea:focus{outline:none;border-color:var(--accent-soft)}
.msg{padding:12px 15px;border-radius:11px;font-weight:700;display:none}
.msg.ok{display:block;background:rgba(34,197,94,.12);color:#4ade80;border:1px solid rgba(34,197,94,.3)}
.msg.err{display:block;background:rgba(225,29,42,.12);color:var(--accent-soft);border:1px solid rgba(225,29,42,.3)}
.ftr{border-top:1px solid var(--line);padding-block:40px;background:var(--bg2)}
.ftr-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:28px}
.ftr h4{font-family:var(--font);font-size:1rem;margin:0 0 12px}
.ftr ul{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.ftr a,.ftr button{color:var(--muted);background:none;border:0;font:inherit;padding:0;cursor:pointer;text-align:start;transition:color .2s}
.ftr a:hover,.ftr button:hover{color:var(--accent-soft)}
.ftr-note{border-top:1px solid var(--line);margin-top:26px;padding-top:18px;color:#6b7891;font-size:.85rem;display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px}
.reveal{opacity:0;transform:translateY(18px);transition:opacity .6s cubic-bezier(.16,1,.3,1),transform .6s cubic-bezier(.16,1,.3,1)}
.reveal.in{opacity:1;transform:none}
@media (max-width:960px){.hero-in,.about,.hc{grid-template-columns:1fr}.pole{max-width:340px;justify-self:center}.g3,.gal,.ftr-grid{grid-template-columns:1fr 1fr}
 .links{position:absolute;inset-inline:0;top:100%;flex-direction:column;background:var(--bg2);border-bottom:1px solid var(--line);padding:12px 22px;display:none}
 .links.open{display:flex}.links button{width:100%;text-align:start;padding:12px}.toggle{display:inline-flex}}
@media (max-width:600px){.g3,.gal,.ftr-grid{grid-template-columns:1fr}.hero-in{padding-block:56px}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
"""

def li_service(ic, t, d):
    return f'<li class="card reveal"><span class="ico">{IC[ic]}</span><h3>{t}</h3><p>{d}</p></li>'
def li_feature(ic, t, d):
    return f'<li class="feat reveal"><span class="ico">{IC[ic]}</span><div><h3>{t}</h3><p>{d}</p></div></li>'
def fig_shot(i, label):
    return (f'<figure class="shot reveal"><span class="bar"></span>{IC["scissors"]}'
            f'<figcaption>{label}</figcaption></figure>')
def review(w, t):
    return (f'<blockquote class="review reveal"><div class="stars" aria-label="5 מתוך 5 כוכבים">'
            f'{IC["star"]*5}</div><p>“{t}”</p><cite>— {w}</cite></blockquote>')

ADDR = "פלורנטין 44, תל אביב-יפו"
MAPS = "https://www.google.com/maps/search/?api=1&query=" + ADDR.replace(" ", "+")
WAZE = "https://waze.com/ul?q=" + ADDR.replace(" ", "%20")

BODY = f'''<div id="app" dir="rtl" lang="he">
<a class="skip" href="#main">דלג לתוכן</a>
<header class="hdr"><div class="wrap nav">
  <a class="brand" href="#top"><span class="mark">{IC['scissors']}</span>PSYCHO<span style="color:var(--accent-soft)">.</span></a>
  <button class="toggle" aria-expanded="false" aria-label="פתיחת תפריט">{IC['menu']}</button>
  <ul class="links">
    <li><button data-sec="services">השירותים</button></li>
    <li><button data-sec="gallery">גלריה</button></li>
    <li><button data-sec="about">עלינו</button></li>
    <li><button data-sec="contact">שעות</button></li>
    <li><a class="btn btn-accent" href="tel:">{IC['phone']}קביעת תור</a></li>
  </ul>
</div></header>
<main id="main">
<section class="hero" id="top"><div class="wrap hero-in">
  <div class="reveal in">
    <span class="eyebrow">{IC['razor']} מספרת גברים · פלורנטין</span>
    <h1>ברבר שופ עם <span class="accent">אופי</span>,<br>בלב תל אביב</h1>
    <p class="lead">תספורת מדויקת, עיצוב זקן ואווירה שאי אפשר לזייף. פֵייד נקי, יחס אישי, ותוצאה שגורמת לך לחזור.</p>
    <div class="cta-row">
      <a class="btn btn-accent" href="tel:">{IC['phone']} קביעת תור</a>
      <a class="btn btn-ghost" href="{MAPS}" target="_blank" rel="noopener">{IC['nav']} איך מגיעים</a>
    </div>
    <div class="trust">
      <div class="t"><b>15+</b><span>שנות ניסיון</span></div>
      <div class="t"><b>6</b><span>שירותי עיצוב</span></div>
      <div class="t"><b>5.0</b><span>דירוג לקוחות</span></div>
    </div>
  </div>
  <div class="pole reveal in" aria-hidden="true"><div class="disc"></div><div class="glass"></div>{IC['scissors']}</div>
</div></section>

<section class="sec" data-anchor="services"><div class="wrap">
  <div class="head reveal"><span class="kicker">השירותים שלנו</span><h2>כל מה שצריך ללוק מושלם</h2>
    <p>השירותים להמחשה — נשמח להתאים לך אישית לפי הסגנון והשיער.</p></div>
  <ul class="grid g3">{''.join(li_service(*s) for s in SERVICES)}</ul>
</div></section>

<section class="sec alt" data-anchor="features"><div class="wrap">
  <div class="head reveal"><span class="kicker">למה אנחנו</span><h2>ההבדל מרגישים בכיסא</h2></div>
  <ul class="grid g3">{''.join(li_feature(*f) for f in FEATURES)}</ul>
</div></section>

<section class="sec" data-anchor="about"><div class="wrap about">
  <div class="reveal"><span class="kicker">קצת עלינו</span><h2>הסיפור של פסיכו ברבר</h2>
    <p class="big">מספרת גברים עם אופי, בלב פלורנטין. אנחנו מאמינים שתספורת טובה מתחילה בהקשבה — להבין מה מתאים לך, לאורח החיים ולסגנון שלך.</p>
    <p style="color:var(--muted)">אנחנו נמצאים ב{ADDR} ומשרתים את תל אביב והסביבה. קפוץ, תתקשר או שלח הודעה — תמיד נשמח לארח.</p></div>
  <div class="about card-x reveal">{IC['scissors']}<b>תל אביב-יפו</b><p style="margin:.2em 0 0;opacity:.9">{ADDR}</p>
    <a class="btn btn-ghost" style="margin-top:18px;border-color:rgba(255,255,255,.4);color:#fff" href="{WAZE}" target="_blank" rel="noopener">{IC['nav']} ניווט ב-Waze</a></div>
</div></section>

<section class="sec alt" data-anchor="gallery"><div class="wrap">
  <div class="head reveal"><span class="kicker">גלריה</span><h2>עבודות מהמספרה</h2>
    <p>התמונות להמחשה — ניתן להחליף בתמונות אמיתיות של המספרה.</p></div>
  <div class="grid gal">{''.join(fig_shot(i, g) for i, g in enumerate(GALLERY))}</div>
</div></section>

<section class="sec" data-anchor="reviews"><div class="wrap">
  <div class="head reveal"><span class="kicker">המלצות</span><h2>מה אומרים עלינו</h2>
    <p>ביקורות לדוגמה — מומלץ להחליף בהמלצות אמיתיות של לקוחות.</p></div>
  <div class="grid g3">{''.join(review(*r) for r in REVIEWS)}</div>
</div></section>

<section class="sec alt" data-anchor="contact"><div class="wrap">
  <div class="head reveal"><span class="kicker">יצירת קשר</span><h2>בואו נקבע תור</h2></div>
  <div class="hc">
    <div class="panel reveal"><h3>שעות פעילות</h3>
      <ul class="hours">
        <li><span class="day">ראשון–חמישי</span><span>10:00–20:00</span></li>
        <li><span class="day">שישי / ערב חג</span><span>10:00–15:00</span></li>
        <li><span class="day">שבת</span><span>סגור</span></li>
      </ul>
      <p style="color:var(--muted);font-size:.9rem;margin:10px 0 20px">שעות הפעילות להמחשה — ניתן לעדכן לשעות המדויקות.</p>
      <h3>פרטים</h3>
      <dl style="margin:0">
        <div class="ci"><span class="ico">{IC['pin']}</span><div><dt>כתובת</dt><dd><a href="{MAPS}" target="_blank" rel="noopener">{ADDR}</a></dd></div></div>
        <div class="ci"><span class="ico">{IC['phone']}</span><div><dt>טלפון</dt><dd><a href="tel:">קביעת תור טלפונית</a></dd></div></div>
        <div class="ci"><span class="ico">{IC['nav']}</span><div><dt>ניווט</dt><dd><a href="{WAZE}" target="_blank" rel="noopener">Waze</a> · <a href="{MAPS}" target="_blank" rel="noopener">Google Maps</a></dd></div></div>
      </dl>
    </div>
    <div class="panel reveal"><h3>השאירו הודעה</h3>
      <p style="color:var(--muted);font-size:.95rem">מלאו פרטים ונחזור אליכם לתיאום תור.</p>
      <form novalidate>
        <label>שם מלא<input name="name" type="text" autocomplete="name" placeholder="איך קוראים לך?" required></label>
        <label>טלפון<input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="05X-XXXXXXX" required></label>
        <label>מתי נוח לך?<textarea name="message" rows="3" placeholder="יום ושעה מועדפים"></textarea></label>
        <p class="msg" role="status" aria-live="polite"></p>
        <button class="btn btn-accent" type="submit">{IC['check']} שליחת בקשה</button>
      </form>
    </div>
  </div>
</div></section>
</main>
<footer class="ftr"><div class="wrap">
  <div class="ftr-grid">
    <div><div class="brand" style="margin-bottom:10px"><span class="mark">{IC['scissors']}</span>PSYCHO<span style="color:var(--accent-soft)">.</span></div>
      <p style="color:var(--muted);max-width:34ch">ברבר שופ עם אופי בלב פלורנטין. תספורת, עיצוב זקן ואווירה — כמו שצריך.</p></div>
    <div><h4>ניווט</h4><ul>
      <li><button data-sec="services">השירותים</button></li>
      <li><button data-sec="gallery">גלריה</button></li>
      <li><button data-sec="contact">שעות וקשר</button></li></ul></div>
    <div><h4>יצירת קשר</h4><ul>
      <li><a href="{MAPS}" target="_blank" rel="noopener">{ADDR}</a></li>
      <li><a href="tel:">קביעת תור טלפונית</a></li></ul></div>
  </div>
  <div class="ftr-note"><span>© 2026 פסיכו ברבר שופ. כל הזכויות שמורות.</span>
    <span>אתר לדוגמה · עוצב עם UI/UX Pro Max</span></div>
</div></footer>
</div>'''

SCRIPT = """
(function(){
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-sec]');
    if(b){var t=document.querySelector('[data-anchor="'+b.getAttribute('data-sec')+'"]');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});var l=document.querySelector('.links');if(l)l.classList.remove('open');var tg=document.querySelector('.toggle');if(tg)tg.setAttribute('aria-expanded','false');return;}
    var tg=e.target.closest('.toggle');
    if(tg){var l=document.querySelector('.links');var o=l.classList.toggle('open');tg.setAttribute('aria-expanded',o?'true':'false');}
  });
  document.addEventListener('submit',function(e){
    var f=e.target.closest('form');if(!f)return;e.preventDefault();
    var n=f.querySelector('[name=name]').value.trim(),p=f.querySelector('[name=phone]').value.trim();
    var s=f.querySelector('.msg');s.className='msg';
    if(!n||!p){s.classList.add('err');s.textContent='נא למלא שם וטלפון.';return;}
    if(!/^[0-9+\\-\\s()]{7,}$/.test(p)){s.classList.add('err');s.textContent='מספר הטלפון אינו תקין.';return;}
    s.classList.add('ok');s.textContent='תודה '+n+'! קיבלנו את הבקשה ונחזור אליך לתיאום תור.';f.reset();
  });
  var io;try{io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});}catch(e){document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});}
})();
"""

def build():
    os.makedirs(os.path.join(BASE, "samples"), exist_ok=True)
    artifact = f"<style>{STYLE}</style>\n{BODY}\n<script>{SCRIPT}</script>\n"
    with open(os.path.join(BASE, "samples", "psycho-barber-pro.artifact.html"), "w", encoding="utf-8") as f:
        f.write(artifact)
    standalone = (f'<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="utf-8">'
                  f'<meta name="viewport" content="width=device-width, initial-scale=1">'
                  f'<title>פסיכו ברבר שופ | מספרת גברים בפלורנטין, תל אביב</title>'
                  f'<style>{STYLE}</style></head><body>{BODY}<script>{SCRIPT}</script></body></html>')
    with open(os.path.join(BASE, "samples", "psycho-barber-pro.html"), "w", encoding="utf-8") as f:
        f.write(standalone)
    print("✅ samples/psycho-barber-pro.html", len(standalone)//1024, "KB")
    print("✅ samples/psycho-barber-pro.artifact.html", len(artifact)//1024, "KB")


if __name__ == "__main__":
    build()

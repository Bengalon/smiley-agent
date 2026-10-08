import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { C, display, heb, sans } from "../brand";
import { backOut, ease, glide, lerp, pop, prog } from "../anim";
import { Avatar } from "./HUD";
import { Extruded, HeTitle, Pill, marks } from "./Text";
import { LogoTile, Wordmark } from "./Logo";
import { Backdrop } from "./Backdrop";
import { ChipRain, HeroTower } from "./Scenes3D";
import { Confetti, Flash, HeatVignette } from "./Effects";
import { Sfx } from "./Sfx";

/** VS countdown (PRD 4.5). Frame 0 = screen appears. */
export const VSScreen: React.FC<{ count?: number; tickEvery?: number; line?: React.ReactNode; countStart?: number; sfx?: boolean; hideCount?: boolean }> = ({
  count = 10,
  tickEvery = 30,
  line,
  countStart = 14,
  sfx = true,
  hideCount = false,
}) => {
  const f = useCurrentFrame();
  const inL = glide(f, 0);
  const inR = glide(f, 4);
  const n = Math.max(0, count - Math.floor(Math.max(0, f - countStart) / tickEvery));
  const tickF = (f - countStart) % tickEvery;
  const numPop = f >= countStart ? pop(f, countStart + Math.floor((f - countStart) / tickEvery) * tickEvery, 10, 260) : 0;
  const card = (who: "me" | "opp") => (
    <div
      style={{
        width: 380,
        padding: "44px 20px 36px",
        borderRadius: 40,
        textAlign: "center",
        background: who === "me" ? "linear-gradient(180deg, rgba(198,255,51,.16), rgba(22,19,42,.9))" : "linear-gradient(180deg, rgba(124,77,255,.3), rgba(22,19,42,.9))",
        border: `2px solid ${who === "me" ? "rgba(198,255,51,.45)" : "rgba(165,139,255,.45)"}`,
        boxShadow: `0 40px 100px -30px ${who === "me" ? "rgba(198,255,51,.35)" : "rgba(124,77,255,.5)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <Avatar who={who} size={150} />
      <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 52, color: C.text, marginTop: 10 }}>{who === "me" ? "You" : "mira.v"}</div>
      <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 30, color: C.muted }}>Rating {who === "me" ? "1,412" : "1,438"}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: -220 }}>
        <div style={{ transform: `translateX(${(1 - inL) * -700}px) rotate(${(1 - inL) * -8}deg)` }}>{card("me")}</div>
        <div style={{ fontFamily: display, fontWeight: 900, fontStyle: "italic", fontSize: 110, color: C.lime, textShadow: "0 0 50px rgba(198,255,51,.6)", transform: `scale(${pop(f, 10, 9, 240)})` }}>VS</div>
        <div style={{ transform: `translateX(${(1 - inR) * 700}px) rotate(${(1 - inR) * 8}deg)` }}>{card("opp")}</div>
      </div>
      {line && <div style={{ position: "absolute", top: 1180, left: 60, right: 60, textAlign: "center", fontFamily: sans, fontWeight: 700, fontSize: 40, color: C.muted, opacity: prog(f, 12, 24) }}>{line}</div>}
      <div style={{ position: "absolute", top: 1290, textAlign: "center", opacity: hideCount ? 0 : prog(f, countStart - 6, countStart + 4) }}>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 32, letterSpacing: "0.12em", color: C.muted }}>STARTING IN</div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 900,
            fontSize: 280,
            lineHeight: 1.1,
            color: C.lime,
            textShadow: "0 0 80px rgba(198,255,51,.6)",
            transform: `scale(${1.35 - 0.35 * numPop})`,
            opacity: n === 0 ? 0 : 1 - 0.3 * Math.max(0, tickF / tickEvery - 0.6),
          }}
        >
          {n}
        </div>
      </div>
      {sfx &&
        !hideCount &&
        Array.from({ length: count }, (_, i) => (
          <Sfx key={i} at={countStart + i * tickEvery} name={count - i <= 3 ? "count" : "tick"} volume={count - i <= 3 ? 0.9 : 0.6} />
        ))}
    </AbsoluteFill>
  );
};

/** Clutch takeover (PRD 5.6). Frame 0 = takeover starts. */
export const Takeover: React.FC<{ label: string; mult: number; sub?: string; he?: string; len?: number; sfx?: boolean; fadeOut?: boolean }> = ({ label, mult, sub, he, len = 75, sfx = true, fadeOut = false }) => {
  const f = useCurrentFrame();
  const inP = prog(f, 0, 6);
  const outP = fadeOut ? prog(f, len - 10, len) : 0;
  const big = pop(f, 6, 12, 160);
  const blur = interpolate(f, [6, 22], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: inP * (1 - outP) }}>
      <Backdrop hue="heat" bokeh={18} />
      <HeatVignette from={0} to={len} strength={1.4} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 46, letterSpacing: "0.18em", color: "#FFD7C8", textTransform: "uppercase", opacity: prog(f, 2, 12), transform: `translateY(${(1 - prog(f, 2, 14)) * 30}px)` }}>{label}</div>
        <div style={{ transform: `scale(${2.2 - 1.2 * big}) rotate(${(1 - big) * -10}deg)`, filter: `blur(${blur}px)` }}>
          <Extruded text={`×${mult}`} size={420} tiltX={8} tiltY={Math.sin(f / 20) * 8} />
        </div>
        {sub && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: "#FFE3D9", textAlign: "center", maxWidth: 900, lineHeight: 1.35, opacity: prog(f, 16, 28) }}>{sub}</div>}
        {he && (
          <div style={{ marginTop: 16 }}>
            <HeTitle text={he} at={18} size={64} weight={800} />
          </div>
        )}
      </AbsoluteFill>
      <Flash at={6} color="#FF6A3D" max={0.5} />
      {sfx && (
        <>
          <Sfx at={4} name="impact" volume={0.9} />
          <Sfx at={8} name="heartbeat" volume={1} />
          <Sfx at={30} name="heartbeat" volume={0.9} />
          <Sfx at={52} name="heartbeat" volume={0.8} />
        </>
      )}
    </AbsoluteFill>
  );
};

/** Win result (PRD 5.7) with count-up, chip rain and confetti. Frame 0 = appears. */
export const WinScreen: React.FC<{ amount: number; score?: string; sfx?: boolean; he?: string }> = ({ amount, score, sfx = true, he }) => {
  const f = useCurrentFrame();
  const v = amount * prog(f, 8, 40, ease);
  return (
    <AbsoluteFill>
      <Backdrop hue="lime" intensity={1} />
      <ChipRain at={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 128, color: C.lime, letterSpacing: "-0.02em", textShadow: "0 0 80px rgba(198,255,51,.6)", transform: `scale(${2 - pop(f, 0, 11, 200)})`, opacity: prog(f, 0, 6) }}>
          YOU WON
        </div>
        <div style={{ fontFamily: display, fontWeight: 900, fontSize: 168, color: C.text, marginTop: 10, transform: `scale(${0.6 + 0.4 * pop(f, 6, 10, 200)})`, textShadow: "0 10px 60px rgba(0,0,0,.6)" }}>
          +${v.toFixed(2)}
        </div>
        {score && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 40, color: C.muted, marginTop: 16, opacity: prog(f, 20, 30) }}>{score}</div>}
        {he && (
          <div style={{ marginTop: 50, opacity: prog(f, 26, 36) }}>
            <HeTitle text={he} at={26} size={70} />
          </div>
        )}
      </AbsoluteFill>
      <Confetti x={540} y={760} at={2} count={90} power={1.3} seed="win" />
      <Flash at={0} color={C.lime} max={0.22} len={8} />
      {sfx && (
        <>
          <Sfx at={0} name="win" volume={0.9} />
          <Sfx at={8} name="coins" volume={0.7} />
          <Sfx at={24} name="coins" volume={0.5} />
        </>
      )}
    </AbsoluteFill>
  );
};

/** Closing card: 3D tower, logo, tagline, CTA, url and the 18+ line. Frame 0 = appears. */
export const EndCard: React.FC<{ cta?: string; tagline?: string; sfx?: boolean; tower?: boolean }> = ({
  cta = "נסה משחק חינם",
  tagline = "תהמר על *הסקיל* שלך.",
  sfx = true,
  tower = true,
}) => {
  const f = useCurrentFrame();
  const logoP = pop(f, 4, 11, 200);
  const btn = pop(f, 22, 12, 180);
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, f - 34) / 5);
  return (
    <AbsoluteFill>
      <Backdrop />
      {tower && (
        <AbsoluteFill style={{ opacity: prog(f, 0, 10), transform: "translateY(-560px) scale(.78)" }}>
          <HeroTower at={-20} dice={false} chips={8} spin={0.02} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 800, flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30, transform: `scale(${logoP})`, opacity: Math.min(1, logoP * 2) }}>
          <LogoTile size={150} spin={(1 - logoP) * -180} />
          <Wordmark size={130} />
        </div>
        <div style={{ marginTop: 50 }}>
          <HeTitle text={tagline} at={12} size={84} />
        </div>
        <div style={{ marginTop: 70, transform: `scale(${btn * pulse})`, opacity: Math.min(1, btn * 2) }}>
          <div
            style={{
              padding: "34px 90px",
              borderRadius: 30,
              background: C.lime,
              color: C.limeInk,
              fontFamily: heb,
              fontWeight: 900,
              fontSize: 66,
              direction: "rtl",
              boxShadow: "0 0 80px rgba(198,255,51,.55), inset 0 -8px 0 rgba(0,0,0,.18)",
            }}
          >
            {cta}
          </div>
        </div>
        <div style={{ marginTop: 40, fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.text, opacity: prog(f, 28, 40), letterSpacing: "0.01em" }}>clutchgamebet.netlify.app</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", fontFamily: heb, fontWeight: 600, fontSize: 30, color: C.muted, direction: "rtl", opacity: prog(f, 30, 42) }}>
        18+ בלבד · שחקו באחריות · משחק מיומנות
      </div>
      {sfx && (
        <>
          <Sfx at={2} name="whoosh" volume={0.6} />
          <Sfx at={6} name="match" volume={0.7} />
        </>
      )}
    </AbsoluteFill>
  );
};

/** VO captions: [startFrame, endFrame, text] (text may use *lime* words). */
export const Captions: React.FC<{ items: [number, number, string][]; y?: number }> = ({ items, y = 1600 }) => {
  const f = useCurrentFrame();
  const cur = items.find(([a, b]) => f >= a && f < b);
  if (!cur) return null;
  const [a, b, text] = cur;
  const p = pop(f, a, 14, 260);
  const o = prog(f, b - 4, b);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "center", opacity: (1 - o) * Math.min(1, p * 1.5) }}>
      <div
        style={{
          direction: "rtl",
          textAlign: "center",
          fontFamily: heb,
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.2,
          color: "#fff",
          padding: "18px 34px",
          borderRadius: 28,
          background: "rgba(10,9,18,.72)",
          border: `2px solid ${C.line2}`,
          transform: `scale(${0.85 + 0.15 * p})`,
          boxShadow: "0 20px 60px rgba(0,0,0,.5)",
        }}
      >
        {marks(text).map(({ word, hl }, i) => (
          <span key={i} style={{ color: hl ? C.lime : undefined }}>
            {word}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

export { Sequence, lerp, backOut, Pill };

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, GRAD, display, heb, sans } from "../brand";
import { ease, glide, lerp, pop, prog, range, rnd } from "../anim";
import { Avatar } from "./HUD";
import { Round, RoundSpec } from "./Round";
import { FaceView, Face } from "./faces";
import { GameCard } from "./GameCard";

/** Three slot-machine reels spinning and stopping (luck scene). */
export const SlotReels: React.FC<{ at: number; stops?: number[] }> = ({ at, stops = [26, 34, 44] }) => {
  const f = useCurrentFrame();
  const SYM = ["7", "♦", "★", "BAR", "♣", "7", "♥", "★"];
  const H = 230;
  return (
    <div style={{ display: "flex", gap: 22, padding: 30, borderRadius: 50, background: "linear-gradient(180deg,#3a3a44,#1d1d24)", border: "6px solid #55555f", boxShadow: "0 40px 120px rgba(0,0,0,.8), inset 0 0 40px rgba(0,0,0,.6)" }}>
      {stops.map((stop, r) => {
        const t = f - at;
        const speed = 2.4;
        const settle = prog(t, stop - 10, stop, ease);
        const pos = t < stop - 10 ? t * speed : (stop - 10) * speed + settle * 3.2;
        const final = Math.round((stop - 10) * speed + 3.2);
        const y = -(((t >= stop ? final : pos) % SYM.length) * H);
        return (
          <div key={r} style={{ width: 230, height: H, overflow: "hidden", borderRadius: 24, background: "linear-gradient(180deg,#bbb,#eee 30%,#eee 70%,#bbb)", position: "relative" }}>
            <div style={{ transform: `translateY(${y % (SYM.length * H)}px)`, filter: t < stop ? `blur(${Math.min(8, 6 * (1 - settle))}px)` : undefined }}>
              {[...SYM, ...SYM].map((s, i) => (
                <div key={i} style={{ height: H, display: "grid", placeItems: "center", fontFamily: display, fontWeight: 900, fontSize: s === "BAR" ? 70 : 130, color: "#333" }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** RGB-split glitch wrapper, active between [a, b) */
export const Glitch: React.FC<{ children: React.ReactNode; a: number; b: number; amp?: number }> = ({ children, a, b, amp = 26 }) => {
  const f = useCurrentFrame();
  const on = f >= a && f < b;
  if (!on) return <AbsoluteFill>{children}</AbsoluteFill>;
  const k = rnd(`g${f}`);
  const dx = (k - 0.5) * amp * 2;
  const slice = rnd(`s${f}`) * 1700;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dx}px)`, mixBlendMode: "screen", filter: "url(#none) saturate(2)", opacity: 0.9 }}>
        <AbsoluteFill style={{ background: "rgba(255,0,60,.0)" }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-dx}px)`, opacity: 0.6, mixBlendMode: "screen" }}>{children}</AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: slice, height: 60 + k * 120, background: "rgba(255,255,255,.08)", transform: `translateX(${dx * 3}px)` }} />
      <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 5px)" }} />
    </AbsoluteFill>
  );
};

/** Two players on the same round at the same moment (split screen phones). */
export const SameRound: React.FC<{ spec: RoundSpec }> = ({ spec }) => {
  const f = useCurrentFrame();
  const phone = (who: "me" | "opp", i: number) => {
    const p = glide(f, i * 4);
    return (
      <div style={{ position: "relative", width: 470, height: 900, transform: `translateY(${(1 - p) * 300}px) rotateY(${who === "me" ? 10 : -10}deg)`, opacity: p }}>
        <div style={{ position: "absolute", top: -96, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Avatar who={who} size={64} />
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.text }}>{who === "me" ? "You" : "mira.v"}</div>
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 60, overflow: "hidden", border: `8px solid ${who === "me" ? "rgba(198,255,51,.6)" : "rgba(165,139,255,.6)"}`, background: C.bg, boxShadow: `0 40px 100px rgba(0,0,0,.7), 0 0 60px ${who === "me" ? "rgba(198,255,51,.25)" : "rgba(124,77,255,.35)"}` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: "scale(.4278)", transformOrigin: "0 0" }}>
            <AbsoluteFill style={{ background: "radial-gradient(80% 50% at 50% 40%, rgba(124,77,255,.45), transparent 70%), #0A0912" }} />
            <Round spec={spec} feltTop={640} sfx={who === "me"} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2000 }}>
      <div style={{ display: "flex", gap: 46, marginTop: 120 }}>
        {phone("me", 0)}
        {phone("opp", 1)}
      </div>
    </AbsoluteFill>
  );
};

/** Lobby duel card (PRD 3.2) */
export const DuelCard: React.FC<{ game?: "Classic" | "Sprint" | "High Roller"; stake: number; name?: string; scale?: number }> = ({ game = "Classic", stake, name = "mira.v", scale = 1 }) => {
  const grad = game === "Classic" ? GRAD.classic : game === "Sprint" ? GRAD.sprint : GRAD.high;
  const ladder = game === "Classic" ? [1, 1, 1, 1, 1, 1, 1, 1, 2, 3] : game === "Sprint" ? [1, 1, 1, 1, 2] : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4];
  return (
    <div style={{ width: 720, borderRadius: 40, overflow: "hidden", background: C.card, border: `2px solid ${C.line2}`, boxShadow: "0 50px 120px rgba(0,0,0,.7)", transform: `scale(${scale})` }}>
      <div style={{ background: grad, padding: "34px 40px 26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: display, fontWeight: 900, fontSize: 46, color: "#fff" }}>{game.toUpperCase()}</div>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 26, color: "#fff", background: "rgba(0,0,0,.25)", padding: "8px 18px", borderRadius: 30 }}>
            {ladder.length} rounds, up to {Math.max(...ladder)}x
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 54, marginTop: 20 }}>
          {ladder.map((m, i) => (
            <div key={i} style={{ flex: 1, height: 12 + (m - 1) * 16, borderRadius: 4, background: m > 1 ? "#fff" : "rgba(255,255,255,.4)", boxShadow: m > 1 ? "0 0 16px #fff" : undefined }} />
          ))}
        </div>
      </div>
      <div style={{ padding: "30px 40px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Avatar who="opp" size={80} />
          <div>
            <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.text }}>{name}</div>
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 28, color: C.muted }}>Rating 1,438</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 28 }}>
          {[["Stake", `$${stake.toFixed(2)}`, C.text], ["Winner gets", `$${(stake * 2 * 0.95).toFixed(2)}`, C.lime]].map(([k, v, col]) => (
            <div key={k} style={{ flex: 1, padding: "20px 26px", borderRadius: 24, background: C.card2 }}>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 26, color: C.muted }}>{k}</div>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 48, color: col }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, padding: "26px", borderRadius: 24, background: C.lime, color: C.limeInk, textAlign: "center", fontFamily: sans, fontWeight: 800, fontSize: 38, boxShadow: "0 0 40px rgba(198,255,51,.4)" }}>
          Join for ${stake.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

/** Ladder bars for a game (clutch bars rise and glow) */
export const Ladder: React.FC<{ ladder: number[]; at: number; width?: number; hotAt?: Record<number, number> }> = ({ ladder, at, width = 900, hotAt }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-end", width, height: 520 }}>
      {ladder.map((m, i) => {
        const p = pop(f, m > 1 && hotAt?.[m] !== undefined ? hotAt[m] : at + i * 2 + (m > 1 ? 10 + (m - 2) * 12 : 0), 12, 200);
        const hot = m > 1;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {hot && <div style={{ fontFamily: display, fontWeight: 900, fontSize: 40, color: "#FFB020", opacity: p, textShadow: "0 0 20px rgba(255,140,40,.8)" }}>×{m}</div>}
            <div
              style={{
                width: "100%",
                height: (60 + (m - 1) * 130) * p,
                borderRadius: 10,
                background: hot ? "linear-gradient(180deg,#FFF3B0,#FFB020 40%,#FF4D2E)" : "rgba(255,255,255,.22)",
                boxShadow: hot ? "0 0 40px rgba(255,120,40,.7)" : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/** A tilted wall of many round types scrolling (176 round types) */
export const RoundWall: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const faces: Face[] = [
    { k: "arrows", dirs: [0] }, { k: "num", v: "47" }, { k: "pc", rank: "Q", suit: "♥" }, { k: "die", n: 5 }, { k: "word", v: "BLUE", ink: C.red },
    { k: "frac", a: 3, b: 4 }, { k: "shape", s: "star", color: C.yellow }, { k: "eq", v: "8×7=56" }, { k: "swatch", color: C.green, label: "RED" }, { k: "shape", s: "hexagon", color: C.purple, hollow: true },
    { k: "arrows", dirs: [135, 135] }, { k: "num", v: "XIV" }, { k: "pc", rank: "7", suit: "♣" }, { k: "die", n: 2 }, { k: "word", v: "LEVEL", size: 0.15 },
    { k: "shape", s: "triangle", color: C.blue }, { k: "num", v: "1/9" }, { k: "word", v: "q", size: 0.4 }, { k: "die", n: 6 }, { k: "shape", s: "diamond", color: C.red },
  ];
  const cols = 5;
  const w = 300;
  const h = 375;
  const t = f - at;
  return (
    <AbsoluteFill style={{ perspective: 1400, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - (cols * (w + 24)) / 2,
          top: -200,
          width: cols * (w + 24),
          transform: `rotateX(28deg) rotateZ(-8deg) translateY(${-t * 6}px)`,
          transformOrigin: "50% 0%",
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        {range(40).map((i) => {
          const face = faces[i % faces.length];
          const fp = prog(t, 4 + (i % 9) * 2, 16 + (i % 9) * 2);
          return (
            <GameCard key={i} w={w} h={h} flip={fp} state={rnd(`wall${i}`) > 0.85 ? "answer" : "none"}>
              <FaceView face={face} w={w} />
            </GameCard>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(70% 45% at 50% 50%, rgba(10,9,18,.2), rgba(10,9,18,.92))" }} />
    </AbsoluteFill>
  );
};

/** Pot math: pot splits 95% to the winner and 5% fee */
export const PotSplit: React.FC<{ at: number; pot: number }> = ({ at, pot }) => {
  const f = useCurrentFrame();
  const p = prog(f, at + 20, at + 50, ease);
  const win = pot * 0.95;
  return (
    <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 30, alignItems: "center" }}>
      <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.muted, letterSpacing: "0.1em", opacity: prog(f, at, at + 10) }}>POT</div>
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 200, color: C.text, transform: `scale(${pop(f, at, 12, 200)})` }}>${pot}</div>
      <div style={{ width: 900, height: 90, borderRadius: 45, background: "rgba(255,255,255,.08)", overflow: "hidden", display: "flex", direction: "ltr" }}>
        <div style={{ width: `${95 * p}%`, background: `linear-gradient(90deg,#6EDC1E,${C.lime})`, boxShadow: "0 0 40px rgba(198,255,51,.6)", display: "grid", placeItems: "center", fontFamily: display, fontWeight: 900, fontSize: 44, color: C.limeInk }}>
          {p > 0.5 ? "95%" : ""}
        </div>
        <div style={{ width: `${5 * p}%`, background: "#5a5670" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 900, direction: "rtl", fontFamily: heb, fontWeight: 800, fontSize: 46, opacity: prog(f, at + 40, at + 50) }}>
        <span style={{ color: C.lime }}>למנצח: ${lerp(f, [at + 20, at + 50], [0, win]).toFixed(2)}</span>
        <span style={{ color: C.muted }}>עמלה 5%</span>
      </div>
    </div>
  );
};

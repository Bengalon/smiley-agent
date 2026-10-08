import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, display, sans } from "../brand";
import { backOut, ease, lerp, pop, prog, range, rnd } from "../anim";

const CONF_COLORS = [C.lime, C.violet, "#FFFFFF", C.gold, "#FF6FA0", "#5CC8FF"];

/** Deterministic confetti burst from (x, y) at frame `at`. */
export const Confetti: React.FC<{ x: number; y: number; at: number; count?: number; power?: number; seed?: string; spread?: number }> = ({
  x, y, at, count = 54, power = 1, seed = "c", spread = 1,
}) => {
  const f = useCurrentFrame();
  const t = (f - at) / 30;
  if (t < 0 || t > 2.6) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {range(count).map((i) => {
        const a = (-90 + (rnd(`${seed}a${i}`) - 0.5) * 220 * spread) * (Math.PI / 180);
        const sp = (900 + rnd(`${seed}s${i}`) * 1500) * power;
        const drag = Math.exp(-t * 1.6);
        const vx = Math.cos(a) * sp;
        const vy = Math.sin(a) * sp;
        const px = x + (vx * (1 - drag)) / 1.6;
        const py = y + (vy * (1 - drag)) / 1.6 + 900 * t * t * 0.6;
        const rot = rnd(`${seed}r${i}`) * 720 * t + i * 30;
        const w = 12 + rnd(`${seed}w${i}`) * 16;
        const op = interpolate(t, [0, 1.6, 2.6], [1, 1, 0], { extrapolateRight: "clamp" });
        const flipY = Math.abs(Math.cos(t * 9 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: w,
              height: w * (rnd(`${seed}h${i}`) > 0.5 ? 0.45 : 1),
              borderRadius: rnd(`${seed}k${i}`) > 0.7 ? "50%" : 3,
              background: CONF_COLORS[i % CONF_COLORS.length],
              opacity: op,
              transform: `rotate(${rot}deg) scaleY(${0.3 + flipY * 0.7})`,
              boxShadow: i % 6 === 0 ? `0 0 12px ${C.lime}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Coin: React.FC<{ size: number; spin?: number }> = ({ size, spin = 0 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #FFF3B0, #FFC94D 40%, #C98A12 75%, #8A5A00)",
      boxShadow: `0 0 ${size * 0.6}px rgba(255,201,77,.6), inset 0 0 0 ${size * 0.08}px rgba(255,236,160,.8)`,
      transform: `scaleX(${Math.cos(spin)})`,
      display: "grid",
      placeItems: "center",
      fontFamily: display,
      fontWeight: 900,
      fontSize: size * 0.5,
      color: "#8A5A00",
    }}
  >
    $
  </div>
);

/** Coins that fly from a point to a target in arcs. */
export const CoinFlight: React.FC<{ from: [number, number]; to: [number, number]; at: number; count?: number; seed?: string }> = ({
  from, to, at, count = 8, seed = "k",
}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {range(count).map((i) => {
        const st = at + i * 2;
        const p = prog(f, st, st + 20, ease);
        if (f < st || p >= 1) return null;
        const mx = (from[0] + to[0]) / 2 + (rnd(`${seed}${i}`) - 0.5) * 500;
        const my = Math.min(from[1], to[1]) - 260 - rnd(`${seed}y${i}`) * 200;
        const x = (1 - p) * (1 - p) * from[0] + 2 * (1 - p) * p * mx + p * p * to[0];
        const y = (1 - p) * (1 - p) * from[1] + 2 * (1 - p) * p * my + p * p * to[1];
        const sz = 54 * (1 - p * 0.5);
        return (
          <div key={i} style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2 }}>
            <Coin size={sz} spin={f * 0.4 + i} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Touch indicator with expanding rings */
export const TapRipple: React.FC<{ x: number; y: number; at: number; color?: string }> = ({ x, y, at, color = "#FFFFFF" }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -8 || t > 26) return null;
  const press = t < 0 ? lerp(t, [-8, 0], [0, 1]) : lerp(t, [0, 10], [1, 0]);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          width: 110,
          height: 110,
          left: -55,
          top: -55,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 0 30%, rgba(255,255,255,.35) 60%, transparent 70%)`,
          opacity: press * 0.85,
          transform: `scale(${0.7 + press * 0.3})`,
        }}
      />
      {[0, 5].map((d) => {
        const p = prog(f, at + d, at + d + 18);
        if (f < at + d) return null;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              width: 300,
              height: 300,
              left: -150,
              top: -150,
              borderRadius: "50%",
              border: `6px solid ${color}`,
              opacity: (1 - p) * 0.8,
              transform: `scale(${0.2 + p * 0.9})`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Round banner (PRD 5.4) */
export const Banner: React.FC<{ at: number; title: string; sub?: string; tone: "win" | "lose" | "neutral"; scale?: number; hold?: number }> = ({
  at, title, sub, tone, scale = 1, hold = 40,
}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + hold + 10) return null;
  const p = pop(f, at, 9, 220);
  const out = prog(f, at + hold, at + hold + 10);
  const col = tone === "win" ? C.lime : tone === "lose" ? C.loss : "#D9D6E8";
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%,-50%) scale(${(0.4 + p * 0.6) * scale * (1 - out * 0.2)})`,
        opacity: 1 - out,
        padding: "26px 44px 22px",
        borderRadius: 30,
        background: "rgba(16,14,28,.92)",
        border: `2px solid ${tone === "win" ? "rgba(198,255,51,.5)" : tone === "lose" ? "rgba(255,59,92,.5)" : C.line2}`,
        boxShadow: `0 30px 80px rgba(0,0,0,.6), 0 0 60px -10px ${tone === "win" ? "rgba(198,255,51,.5)" : tone === "lose" ? "rgba(255,59,92,.4)" : "transparent"}`,
        textAlign: "center",
        whiteSpace: "nowrap",
        zIndex: 5,
      }}
    >
      <div style={{ fontFamily: display, fontWeight: 900, fontSize: 110, lineHeight: 1, color: col, textShadow: `0 0 30px ${col}66` }}>{title}</div>
      {sub && <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 30, color: C.muted, marginTop: 10 }}>{sub}</div>}
    </div>
  );
};

/** Pulsing red clutch vignette */
export const HeatVignette: React.FC<{ from: number; to: number; strength?: number }> = ({ from, to, strength = 1 }) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const k = interpolate(f, [from, from + 12, to - 10, to], [0, 1, 1, 0], { extrapolateRight: "clamp" });
  const beat = (f - from) % 33;
  const pulse = beat < 4 ? 1 : beat < 8 ? 0.75 : beat < 12 ? 0.95 : 0.7;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: k * pulse,
        boxShadow: `inset 0 0 ${260 * strength}px rgba(255,77,46,.65), inset 0 0 ${80 * strength}px rgba(255,77,46,.45)`,
      }}
    />
  );
};

export const Flash: React.FC<{ at: number; color?: string; len?: number; max?: number }> = ({ at, color = "#FFFFFF", len = 10, max = 0.85 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f, [at, at + len], [max, 0]), pointerEvents: "none" }} />;
};

/** Expanding shockwave ring */
export const Shockwave: React.FC<{ x: number; y: number; at: number; color?: string; size?: number }> = ({ x, y, at, color = C.lime, size = 1400 }) => {
  const f = useCurrentFrame();
  const p = prog(f, at, at + 22, backOut);
  if (f < at || f > at + 24) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${18 * (1 - p) + 2}px solid ${color}`,
        opacity: 1 - prog(f, at + 6, at + 24),
        transform: `scale(${p})`,
        boxShadow: `0 0 60px ${color}`,
        pointerEvents: "none",
      }}
    />
  );
};

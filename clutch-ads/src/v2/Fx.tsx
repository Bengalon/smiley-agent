import React from "react";
import { AbsoluteFill, Img, Solid, interpolate, staticFile, useCurrentFrame } from "remotion";
import { lightLeak } from "@remotion/effects/light-leak";
import { K, map, p01, range, rnd, expoOut, expoIn } from "./kit";

/** Full-frame flash */
export const Flash: React.FC<{ at: number; len?: number; color?: string; max?: number }> = ({ at, len = 8, color = "#fff", max = 0.8 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f, [at, at + len], [max, 0]), mixBlendMode: "screen", pointerEvents: "none" }} />;
};

/** Organic light leak burst (WebGL), additive */
export const Leak: React.FC<{ at: number; len?: number; seed?: number; hue?: number; max?: number }> = ({ at, len = 22, seed = 2, hue = 0, max = 0.9 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: max, pointerEvents: "none" }}>
      <Solid width={1080} height={1920} color="black" effects={[lightLeak({ seed, hueShift: hue, progress: interpolate(f, [at, at + len], [0, 1]) })]} />
    </AbsoluteFill>
  );
};

/** Anamorphic horizontal lens flare streak */
export const Flare: React.FC<{ at: number; y?: number; len?: number; color?: string; width?: number }> = ({ at, y = 960, len = 18, color = K.lime, width = 1 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  const k = Math.sin(p01(f, at, at + len, (t) => t) * Math.PI);
  return (
    <div style={{ position: "absolute", left: -400, right: -400, top: y - 40, height: 80, pointerEvents: "none", mixBlendMode: "screen", opacity: k }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 34, height: 12 * width, background: `linear-gradient(90deg, transparent, ${color} 30%, #fff 50%, ${color} 70%, transparent)`, filter: "blur(4px)" }} />
      <div style={{ position: "absolute", left: "20%", right: "20%", top: 0, height: 80, background: `radial-gradient(50% 50% at 50% 50%, ${color}aa, transparent 70%)`, filter: "blur(8px)" }} />
      <div style={{ position: "absolute", left: "46%", width: "8%", top: -60, height: 200, background: `radial-gradient(50% 50% at 50% 50%, #ffffffcc, transparent 60%)`, filter: "blur(6px)" }} />
    </div>
  );
};

/** Cinematic bars */
export const LetterBox: React.FC<{ from?: number; to?: number; size?: number }> = ({ from = 0, to = 1e9, size = 150 }) => {
  const f = useCurrentFrame();
  const k = map(f, [from, from + 10, to - 10, to], [0, 1, 1, 0]);
  if (k <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: size * k, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: size * k, background: "#000" }} />
    </>
  );
};

export const Vignette: React.FC<{ amount?: number }> = ({ amount = 0.75 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(110% 75% at 50% 50%, transparent 50%, rgba(0,0,0,${amount}))` }} />
);

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const seed = f % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`gr${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#gr${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Floating light dust */
export const Dust: React.FC<{ count?: number; color?: string; seed?: string; opacity?: number }> = ({ count = 40, color = "#FFE7B0", seed = "d", opacity = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity }}>
      {range(count).map((i) => {
        const x = (rnd(`${seed}x${i}`) * 1180 + Math.sin(f / 40 + i) * 30) % 1180 - 50;
        const y = ((rnd(`${seed}y${i}`) * 2000 - f * (0.6 + rnd(`${seed}s${i}`) * 1.4)) % 2000 + 2000) % 2000 - 40;
        const z = rnd(`${seed}z${i}`);
        const sz = 3 + z * 10;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: color, opacity: 0.25 + z * 0.5, filter: `blur(${(1 - z) * 4 + 0.5}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Diagonal light sweep (lime) used to turn a scene */
export const Sweep: React.FC<{ at: number; len?: number; color?: string }> = ({ at, len = 14, color = K.lime }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + len) return null;
  const p = p01(f, at, at + len, expoIn);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: -1400 + p * 3600, top: -400, width: 260, height: 2800, transform: "rotate(18deg)", background: `linear-gradient(90deg, transparent, ${color}cc, #fff, ${color}cc, transparent)`, filter: "blur(18px)" }} />
    </AbsoluteFill>
  );
};

/**
 * Glass shatter: a freeze frame breaks into radial shards that fly toward the camera,
 * revealing whatever is underneath. Frame `at` is the impact.
 */
export const Shatter: React.FC<{ img: string; at: number; cx?: number; cy?: number; len?: number; filter?: string }> = ({ img, at, cx = 540, cy = 900, len = 26, filter = "none" }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t > len) return null;
  const rings = [0, 260, 620, 1100, 2400];
  const sectors = 9;
  const shards: { pts: [number, number][]; mid: [number, number]; k: string }[] = [];
  for (let r = 0; r < rings.length - 1; r++) {
    for (let s = 0; s < sectors; s++) {
      const j = (n: number) => (rnd(`j${r}${s}${n}`) - 0.5) * 0.35;
      const a0 = ((s + j(1)) / sectors) * Math.PI * 2;
      const a1 = ((s + 1 + j(2)) / sectors) * Math.PI * 2;
      const r0 = rings[r] * (1 + j(3));
      const r1 = rings[r + 1] * (1 + j(4));
      const pts: [number, number][] = [
        [cx + Math.cos(a0) * r0, cy + Math.sin(a0) * r0],
        [cx + Math.cos(a0) * r1, cy + Math.sin(a0) * r1],
        [cx + Math.cos((a0 + a1) / 2) * r1 * 1.05, cy + Math.sin((a0 + a1) / 2) * r1 * 1.05],
        [cx + Math.cos(a1) * r1, cy + Math.sin(a1) * r1],
        [cx + Math.cos(a1) * r0, cy + Math.sin(a1) * r0],
      ];
      const ma = (a0 + a1) / 2;
      const mr = (r0 + r1) / 2;
      shards.push({ pts, mid: [cx + Math.cos(ma) * mr, cy + Math.sin(ma) * mr], k: `${r}-${s}` });
    }
  }
  const crack = t < 0 ? map(t, [-6, 0], [0, 1]) : 1;
  return (
    <AbsoluteFill style={{ perspective: 1200, pointerEvents: "none" }}>
      {shards.map(({ pts, mid, k }) => {
        const p = t <= 0 ? 0 : p01(t, 0, len, (x) => x);
        const dx = mid[0] - cx;
        const dy = mid[1] - cy;
        const dist = Math.hypot(dx, dy) + 1;
        const sp = 0.6 + rnd(`sp${k}`) * 0.8;
        const tx = (dx / dist) * p * 900 * sp;
        const ty = (dy / dist) * p * 900 * sp + p * p * 500;
        const tz = p * (300 + rnd(`z${k}`) * 900);
        const rx = p * (rnd(`rx${k}`) - 0.5) * 220;
        const ry = p * (rnd(`ry${k}`) - 0.5) * 220;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(",")})`,
              transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`,
              transformOrigin: `${mid[0]}px ${mid[1]}px`,
              opacity: 1 - p01(t, len * 0.5, len),
            }}
          >
            <Img src={staticFile(img)} style={{ width: 1080, height: 1920, objectFit: "cover", filter }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${(rnd(`g${k}`) * 360) | 0}deg, rgba(255,255,255,.25), transparent 40%)` }} />
          </div>
        );
      })}
      {t < 2 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: crack }}>
          {shards.map(({ pts, k }) => (
            <polyline key={k} points={pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={2.5} />
          ))}
        </svg>
      )}
    </AbsoluteFill>
  );
};

/** Camera shake wrapper */
export const ShakeWrap: React.FC<{ hits: number[]; amp?: number; children: React.ReactNode }> = ({ hits, amp = 22, children }) => {
  const f = useCurrentFrame();
  let x = 0;
  let y = 0;
  let r = 0;
  for (const h of hits) {
    const t = f - h;
    if (t >= 0 && t < 12) {
      const k = (1 - t / 12) ** 2;
      x += (rnd(`sx${h}${f}`) * 2 - 1) * amp * k;
      y += (rnd(`sy${h}${f}`) * 2 - 1) * amp * k;
      r += (rnd(`sr${h}${f}`) * 2 - 1) * 0.8 * k;
    }
  }
  return <AbsoluteFill style={{ transform: `translate(${x}px,${y}px) rotate(${r}deg) scale(${x || y ? 1.03 : 1})` }}>{children}</AbsoluteFill>;
};

export { expoOut };

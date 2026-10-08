import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, display, heb } from "../brand";
import { ease, pop, prog } from "../anim";

/** Split a line into words; *stars* may span several words and mark them lime. */
export const marks = (line: string) => {
  let on = false;
  return line.split(" ").filter(Boolean).map((w) => {
    let word = w;
    let hl = on;
    if (word.startsWith("*")) {
      word = word.slice(1);
      hl = true;
      on = true;
    }
    if (word.endsWith("*")) {
      word = word.slice(0, -1);
      on = false;
    }
    return { word, hl };
  });
};

/**
 * Hebrew kinetic headline. Words wrapped in *stars* are lime.
 * Each word springs in with a blur, staggered right-to-left (reading order).
 */
export const HeTitle: React.FC<{
  text: string;
  at: number;
  size?: number;
  stagger?: number;
  color?: string;
  out?: number;
  weight?: number;
  style?: React.CSSProperties;
  glow?: boolean;
  lineHeight?: number;
}> = ({ text, at, size = 120, stagger = 3, color = C.text, out, weight = 900, style, glow = true, lineHeight = 1.05 }) => {
  const f = useCurrentFrame();
  const lines = text.split("\n");
  let k = 0;
  const outP = out !== undefined ? prog(f, out, out + 10) : 0;
  return (
    <div style={{ direction: "rtl", textAlign: "center", fontFamily: heb, fontWeight: weight, fontSize: size, lineHeight, color, letterSpacing: "-0.01em", ...style }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: `0 ${size * 0.25}px` }}>
          {marks(line).map(({ word, hl }, wi) => {
            const i = k++;
            const p = pop(f, at + i * stagger, 12, 180);
            const blur = interpolate(p, [0, 1], [18, 0], { extrapolateRight: "clamp" });
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  color: hl ? C.lime : undefined,
                  opacity: Math.min(1, p * 1.4) * (1 - outP),
                  transform: `translateY(${(1 - p) * size * 0.5 - outP * size * 0.3}px) scale(${0.7 + 0.3 * p})`,
                  filter: `blur(${blur + outP * 12}px)`,
                  textShadow: glow ? (hl ? "0 0 40px rgba(198,255,51,.55)" : "0 8px 40px rgba(0,0,0,.6)") : undefined,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Big display number/word (Unbounded) with slam-in */
export const Slam: React.FC<{ text: string; at: number; size?: number; color?: string; out?: number; style?: React.CSSProperties; from?: number }> = ({
  text, at, size = 260, color = C.lime, out, style, from = 2.6,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 13, 260);
  const o = out !== undefined ? prog(f, out, out + 8) : 0;
  if (f < at) return null;
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 900,
        fontSize: size,
        color,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        transform: `scale(${from - (from - 1) * p})`,
        opacity: Math.min(1, p * 2) * (1 - o),
        filter: `blur(${(1 - Math.min(1, p)) * 10}px)`,
        textShadow: `0 0 60px ${color}88, 0 ${size * 0.04}px 0 rgba(0,0,0,.35)`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Extruded "3D" multiplier text like ×3 */
export const Extruded: React.FC<{ text: string; size: number; color?: string; depth?: number; tiltX?: number; tiltY?: number }> = ({
  text, size, color = "#FFB020", depth = 18, tiltX = 0, tiltY = 0,
}) => {
  const layers = Array.from({ length: depth }, (_, i) => i);
  return (
    <div style={{ position: "relative", fontFamily: display, fontWeight: 900, fontSize: size, lineHeight: 1, transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`, transformStyle: "preserve-3d" }}>
      {layers.map((i) => (
        <div
          key={i}
          style={{
            position: i === 0 ? "relative" : "absolute",
            inset: 0,
            transform: `translateZ(${-i * 2.2}px)`,
            color: i === 0 ? undefined : `rgb(${120 - i * 3}, ${40 - i}, ${20})`,
            background: i === 0 ? `linear-gradient(180deg, #FFF3B0, ${color} 45%, #FF4D2E)` : undefined,
            WebkitBackgroundClip: i === 0 ? "text" : undefined,
            WebkitTextFillColor: i === 0 ? "transparent" : undefined,
            filter: i === 0 ? "drop-shadow(0 0 40px rgba(255,120,40,.7))" : undefined,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
};

/** Pill label */
export const Pill: React.FC<{ children: React.ReactNode; tone?: "lime" | "hot" | "ghost"; size?: number; style?: React.CSSProperties }> = ({ children, tone = "lime", size = 34, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.35}px ${size * 0.8}px`,
      borderRadius: 999,
      fontFamily: heb,
      fontWeight: 800,
      fontSize: size,
      direction: "rtl",
      background: tone === "lime" ? C.lime : tone === "hot" ? "linear-gradient(90deg,#FF4D2E,#FFB020)" : "rgba(255,255,255,.06)",
      color: tone === "lime" ? C.limeInk : "#fff",
      border: tone === "ghost" ? `2px solid ${C.line2}` : "none",
      boxShadow: tone === "lime" ? "0 0 40px rgba(198,255,51,.45)" : tone === "hot" ? "0 0 40px rgba(255,77,46,.5)" : "none",
      ...style,
    }}
  >
    {children}
  </div>
);

export const useIn = (at: number, len = 12) => {
  const f = useCurrentFrame();
  return prog(f, at, at + len, ease);
};

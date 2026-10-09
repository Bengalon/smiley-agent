import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { K, map, p01, expoOut, backOut } from "./kit";

export const HEB = "Heebo, Arial, sans-serif";
export const DISP = "Unbounded, 'Arial Black', sans-serif";

/** split "*a b* c" into words with highlight flags (stars can span words) */
export const words = (line: string) => {
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

type Base = {
  text: string;
  at: number;
  out?: number;
  size?: number;
  color?: string;
  hl?: string;
  style?: React.CSSProperties;
  weight?: number;
  font?: string;
};

const outK = (f: number, out?: number) => (out === undefined ? 0 : p01(f, out, out + 6, (t) => t));

/** Words slam in with an RGB split that snaps together. Lines split by \n. */
export const Slam: React.FC<Base & { stagger?: number; echo?: boolean }> = ({ text, at, out, size = 170, color = K.text, hl = K.lime, style, weight = 900, font = HEB, stagger = 3, echo = true }) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 6)) return null;
  const o = outK(f, out);
  let k = 0;
  return (
    <div style={{ direction: "rtl", textAlign: "center", fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.0, letterSpacing: "-0.02em", color, ...style }}>
      {text.split("\n").map((line, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: `0 ${size * 0.22}px` }}>
          {words(line).map(({ word, hl: h }, wi) => {
            const st = at + k++ * stagger;
            const p = p01(f, st, st + 7, backOut);
            const vis = f >= st;
            const split = (1 - p01(f, st, st + 6)) * size * 0.08;
            const c = h ? hl : color;
            const e = p01(f, st, st + 14, expoOut);
            return (
              <span key={wi} style={{ position: "relative", display: "inline-block", opacity: vis ? 1 - o : 0 }}>
                {echo && vis && e < 1 && (
                  <span style={{ position: "absolute", inset: 0, color: "transparent", WebkitTextStroke: `3px ${c}`, transform: `scale(${1 + e * 0.5})`, opacity: 1 - e }}>{word}</span>
                )}
                <span
                  style={{
                    display: "inline-block",
                    transform: `scale(${1.45 - 0.45 * p}) translateY(${o * -size * 0.3}px)`,
                    filter: `blur(${(1 - Math.min(1, p)) * 12 + o * 16}px)`,
                    textShadow: `${split}px 0 rgba(255,40,90,.85), ${-split}px 0 rgba(40,220,255,.85), 0 10px 50px rgba(0,0,0,.65)${h ? `, 0 0 40px ${hl}88` : ""}`,
                    color: c,
                  }}
                >
                  {word}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Masked rise reveal per word */
export const Rise: React.FC<Base & { stagger?: number }> = ({ text, at, out, size = 110, color = K.text, hl = K.lime, style, weight = 800, font = HEB, stagger = 2 }) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 6)) return null;
  const o = outK(f, out);
  let k = 0;
  return (
    <div style={{ direction: "rtl", textAlign: "center", fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.08, color, ...style }}>
      {text.split("\n").map((line, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: `0 ${size * 0.24}px` }}>
          {words(line).map(({ word, hl: h }, wi) => {
            const st = at + k++ * stagger;
            const p = p01(f, st, st + 9, expoOut);
            return (
              <span key={wi} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
                <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110 - o * 110}%)`, color: h ? hl : color, textShadow: `0 8px 40px rgba(0,0,0,.6)${h ? `, 0 0 36px ${hl}77` : ""}` }}>{word}</span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** A word stamped on a colored plate */
export const Plate: React.FC<Base & { bg?: string; ink?: string; rot?: number }> = ({ text, at, out, size = 120, bg = K.lime, ink = K.limeInk, rot = -4, style, weight = 900, font = HEB }) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 6)) return null;
  const p = p01(f, at, at + 8, backOut);
  const o = outK(f, out);
  return (
    <div style={{ display: "flex", justifyContent: "center", ...style }}>
      <div
        style={{
          direction: "rtl",
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1.05,
          padding: `${size * 0.12}px ${size * 0.35}px ${size * 0.16}px`,
          background: bg,
          color: ink,
          borderRadius: size * 0.18,
          transform: `rotate(${rot * (1 - o)}deg) scale(${(0.3 + 0.7 * p) * (1 - o * 0.3)})`,
          opacity: 1 - o,
          boxShadow: `0 0 80px ${bg}88, 0 20px 60px rgba(0,0,0,.6)`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Text with an animated strike-through */
export const Strike: React.FC<Base & { strikeAt: number; lineColor?: string }> = ({ text, at, out, strikeAt, size = 140, color = K.text, lineColor = K.loss, style, weight = 900, font = HEB }) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 6)) return null;
  const p = p01(f, at, at + 7);
  const s = p01(f, strikeAt, strikeAt + 6, expoOut);
  const o = outK(f, out);
  return (
    <div style={{ display: "flex", justifyContent: "center", ...style }}>
      <div style={{ position: "relative", direction: "rtl", fontFamily: font, fontWeight: weight, fontSize: size, color, opacity: (1 - o) * p, transform: `scale(${1.2 - 0.2 * p})`, filter: f >= strikeAt ? "saturate(.3) brightness(.8)" : undefined, textShadow: "0 10px 50px rgba(0,0,0,.6)" }}>
        {text}
        <div style={{ position: "absolute", left: -size * 0.15, right: -size * 0.15, top: "54%", height: size * 0.1, background: lineColor, transform: `scaleX(${s}) rotate(-4deg)`, transformOrigin: "right center", boxShadow: `0 0 30px ${lineColor}`, borderRadius: 8 }} />
      </div>
    </div>
  );
};

/** Big counting number (Unbounded) */
export const Count: React.FC<{ at: number; to: number; from?: number; len?: number; prefix?: string; suffix?: string; decimals?: number; size?: number; color?: string; style?: React.CSSProperties; out?: number }> = ({
  at, to, from = 0, len = 24, prefix = "", suffix = "", decimals = 0, size = 220, color = K.lime, style, out,
}) => {
  const f = useCurrentFrame();
  if (f < at || (out !== undefined && f > out + 6)) return null;
  const v = interpolate(f, [at, at + len], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: expoOut });
  const p = p01(f, at, at + 8, backOut);
  const o = outK(f, out);
  return (
    <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: size, color, textAlign: "center", letterSpacing: "-0.03em", transform: `scale(${(0.6 + 0.4 * p) * (1 - o * 0.2)})`, opacity: 1 - o, textShadow: `0 0 60px ${color}88, 0 12px 0 rgba(0,0,0,.35)`, direction: "ltr", ...style }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </div>
  );
};

export { map, interpolate };

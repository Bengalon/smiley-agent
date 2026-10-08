import React from "react";
import { C, display, sans } from "../brand";

/** Card faces that mirror the site's render kinds (PRD 8.3). Sizes are relative to the card width `w`. */
export type Face =
  | { k: "num"; v: string }
  | { k: "word"; v: string; ink?: string; size?: number }
  | { k: "arrows"; dirs: number[]; color?: string } // degrees, 0 = up
  | { k: "pc"; rank: string; suit: "♠" | "♥" | "♦" | "♣" }
  | { k: "die"; n: number }
  | { k: "frac"; a: number; b: number }
  | { k: "eq"; v: string }
  | { k: "shape"; s: "circle" | "triangle" | "square" | "star" | "hexagon" | "diamond"; color: string; hollow?: boolean }
  | { k: "swatch"; color: string; label?: string };

const Arrow: React.FC<{ size: number; dir: number; color: string }> = ({ size, dir, color }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ rotate: `${dir}deg` }}>
    <path d="M50 8 L84 46 L62 46 L62 92 L38 92 L38 46 L16 46 Z" fill={color} />
  </svg>
);

const shapePath = (s: string) => {
  const pts = (n: number, r: number, rot = -90) =>
    [...Array(n)].map((_, i) => {
      const a = ((rot + (360 * i) / n) * Math.PI) / 180;
      return `${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`;
    }).join(" ");
  switch (s) {
    case "triangle": return <polygon points={pts(3, 42)} transform="translate(0 7)" />;
    case "square": return <rect x="18" y="18" width="64" height="64" rx="4" />;
    case "hexagon": return <polygon points={pts(6, 40, 0)} />;
    case "diamond": return <polygon points="50,8 80,50 50,92 20,50" />;
    case "star": return <polygon points={[...Array(10)].map((_, i) => { const r = i % 2 ? 19 : 43; const a = ((-90 + 36 * i) * Math.PI) / 180; return `${(50 + Math.cos(a) * r).toFixed(1)},${(54 + Math.sin(a) * r).toFixed(1)}`; }).join(" ")} />;
    default: return <circle cx="50" cy="50" r="37" />;
  }
};

const PIPS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[27, 27], [73, 27], [50, 50], [27, 73], [73, 73]],
  6: [[28, 24], [72, 24], [28, 50], [72, 50], [28, 76], [72, 76]],
};

export const FaceView: React.FC<{ face: Face; w: number }> = ({ face, w }) => {
  switch (face.k) {
    case "num":
      return <div style={{ fontFamily: display, fontWeight: 800, fontSize: w * (face.v.length > 3 ? 0.26 : 0.36), color: C.text, letterSpacing: "-0.02em" }}>{face.v}</div>;
    case "frac":
      return <div style={{ fontFamily: display, fontWeight: 800, fontSize: w * 0.3, color: C.text }}>{face.a}/{face.b}</div>;
    case "eq":
      return <div style={{ fontFamily: display, fontWeight: 700, fontSize: w * 0.12, color: C.text, whiteSpace: "nowrap" }}>{face.v}</div>;
    case "word":
      return (
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: w * (face.size ?? 0.17), color: face.ink ?? C.text, letterSpacing: "0.01em" }}>
          {face.v}
        </div>
      );
    case "arrows": {
      const n = face.dirs.length;
      const sz = n === 1 ? w * 0.6 : n <= 2 ? w * 0.34 : w * 0.3;
      return (
        <div style={{ display: "flex", flexWrap: "wrap", width: w * 0.75, justifyContent: "center", gap: w * 0.04 }}>
          {face.dirs.map((d, i) => (
            <Arrow key={i} size={sz} dir={d} color={face.color ?? C.green} />
          ))}
        </div>
      );
    }
    case "pc": {
      const red = face.suit === "♥" || face.suit === "♦";
      return (
        <div
          style={{
            width: w * 0.66,
            height: w * 0.9,
            borderRadius: w * 0.06,
            background: "linear-gradient(180deg,#FFFFFF,#ECEAF4)",
            boxShadow: "0 10px 30px rgba(0,0,0,.45)",
            position: "relative",
            color: red ? "#E5263F" : "#16121F",
            fontFamily: display,
          }}
        >
          <div style={{ position: "absolute", left: w * 0.05, top: w * 0.03, fontSize: w * 0.15, fontWeight: 800 }}>{face.rank}</div>
          <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: w * 0.36, paddingTop: w * 0.08 }}>{face.suit}</div>
        </div>
      );
    }
    case "die":
      return (
        <svg viewBox="0 0 100 100" width={w * 0.6} height={w * 0.6}>
          <rect x="4" y="4" width="92" height="92" rx="20" fill="#F7F5FF" />
          {PIPS[face.n].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="9" fill="#16121F" />
          ))}
        </svg>
      );
    case "shape":
      return (
        <svg viewBox="0 0 100 100" width={w * 0.6} height={w * 0.6}>
          <g fill={face.hollow ? "none" : face.color} stroke={face.color} strokeWidth={face.hollow ? 7 : 0} strokeLinejoin="round">
            {shapePath(face.s)}
          </g>
        </svg>
      );
    case "swatch":
      return (
        <div style={{ display: "grid", placeItems: "center", gap: w * 0.04 }}>
          <div style={{ width: w * 0.5, height: w * 0.5, borderRadius: w * 0.08, background: face.color }} />
          {face.label && <div style={{ fontFamily: sans, fontWeight: 800, fontSize: w * 0.1, color: C.text }}>{face.label}</div>}
        </div>
      );
  }
};

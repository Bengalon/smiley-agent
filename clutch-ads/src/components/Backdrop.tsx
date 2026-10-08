import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../brand";
import { range, rnd } from "../anim";

/** Dark violet stage: radial glows, perspective grid floor, drifting bokeh, vignette and grain. */
export const Backdrop: React.FC<{
  hue?: "violet" | "heat" | "lime" | "grey";
  grid?: boolean;
  bokeh?: number;
  intensity?: number;
}> = ({ hue = "violet", grid = true, bokeh = 26, intensity = 1 }) => {
  const f = useCurrentFrame();
  const glow =
    hue === "heat"
      ? "rgba(255,77,46,.55)"
      : hue === "lime"
        ? "rgba(198,255,51,.28)"
        : hue === "grey"
          ? "rgba(150,150,170,.18)"
          : "rgba(124,77,255,.55)";
  const glow2 = hue === "grey" ? "rgba(90,90,110,.15)" : hue === "heat" ? "rgba(255,176,32,.25)" : "rgba(198,255,51,.12)";
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 50% at 50% ${38 + Math.sin(f / 60) * 3}%, ${glow}, transparent 70%), radial-gradient(60% 40% at ${20 + Math.sin(f / 80) * 8}% 85%, ${glow2}, transparent 70%)`,
          opacity: intensity,
        }}
      />
      {grid && (
        <AbsoluteFill style={{ perspective: 900, perspectiveOrigin: "50% 30%" }}>
          <div
            style={{
              position: "absolute",
              left: -1080,
              right: -1080,
              top: 1150,
              height: 2200,
              transform: "rotateX(72deg)",
              transformOrigin: "50% 0%",
              backgroundImage: `linear-gradient(${hue === "heat" ? "rgba(255,77,46,.35)" : "rgba(198,255,51,.22)"} 2px, transparent 2px), linear-gradient(90deg, ${hue === "heat" ? "rgba(255,77,46,.35)" : "rgba(198,255,51,.22)"} 2px, transparent 2px)`,
              backgroundSize: "120px 120px",
              backgroundPosition: `0px ${(f * 4) % 120}px`,
              maskImage: "linear-gradient(to bottom, transparent, black 30%, black 60%, transparent)",
              opacity: 0.55 * intensity,
            }}
          />
        </AbsoluteFill>
      )}
      {range(bokeh).map((i) => {
        const x = rnd(`bx${i}`) * 1080;
        const y0 = rnd(`by${i}`) * 1920;
        const sp = 0.3 + rnd(`bs${i}`) * 1.2;
        const y = ((y0 - f * sp) % 2100 + 2100) % 2100 - 90;
        const sz = 6 + rnd(`bz${i}`) * 26;
        const col = rnd(`bc${i}`) > 0.6 ? C.lime : hue === "heat" ? C.heat : C.violet;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: col,
              opacity: (0.08 + rnd(`bo${i}`) * 0.25) * intensity,
              filter: `blur(${sz / 3}px)`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,.75))" }} />
    </AbsoluteFill>
  );
};

/** Film grain overlay, cheap and deterministic */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${f % 6}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 6} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${f % 6})`} />
      </svg>
    </AbsoluteFill>
  );
};

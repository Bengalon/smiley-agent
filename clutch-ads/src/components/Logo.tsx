import React from "react";
import { C, display } from "../brand";

/** The Clutch mark: ring with tick marks and a C (from the site's logo SVG). */
export const LogoMark: React.FC<{ size: number; color?: string; ticks?: boolean; spin?: number }> = ({
  size,
  color = C.limeInk,
  ticks = true,
  spin = 0,
}) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: "block", rotate: `${spin}deg` }}>
    <circle cx="20" cy="20" r="17" fill="none" stroke={color} strokeWidth="3.2" />
    {ticks && (
      <g stroke={color} strokeWidth="5" strokeLinecap="round">
        <path d="M20 3v4M20 33v4M3 20h4M33 20h4" />
      </g>
    )}
    <path d="M25.5 14.2a8 8 0 1 0 0 11.6" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

/** Lime rounded square app icon */
export const LogoTile: React.FC<{ size: number; glow?: number; spin?: number }> = ({ size, glow = 1, spin = 0 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      background: `linear-gradient(160deg, #DFFF8A, ${C.lime} 55%, #A8E01E)`,
      display: "grid",
      placeItems: "center",
      boxShadow: `0 0 ${size * 0.7 * glow}px rgba(198,255,51,${0.45 * glow}), inset 0 -${size * 0.06}px 0 rgba(0,0,0,.18), inset 0 ${size * 0.04}px 0 rgba(255,255,255,.5)`,
    }}
  >
    <LogoMark size={size * 0.74} spin={spin} />
  </div>
);

export const Wordmark: React.FC<{ size: number; color?: string; spacing?: number }> = ({ size, color = C.text, spacing = -0.02 }) => (
  <div style={{ fontFamily: display, fontWeight: 900, fontSize: size, color, letterSpacing: `${spacing}em`, lineHeight: 1 }}>CLUTCH</div>
);

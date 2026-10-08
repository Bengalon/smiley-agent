import React from "react";
import { C, GRAD, display, sans } from "../brand";

export const Avatar: React.FC<{ who: "me" | "opp"; size: number; letter?: string }> = ({ who, size, letter }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: who === "me" ? GRAD.you : GRAD.them,
      display: "grid",
      placeItems: "center",
      fontFamily: display,
      fontWeight: 900,
      fontSize: size * 0.44,
      color: who === "me" ? C.limeInk : "#fff",
      boxShadow: `0 0 ${size * 0.4}px ${who === "me" ? "rgba(198,255,51,.45)" : "rgba(124,77,255,.55)"}`,
      flex: "none",
    }}
  >
    {letter ?? (who === "me" ? "Y" : "M")}
  </div>
);

export type TrackSeg = "now" | "won" | "lost" | "tie" | "todo";

/** In-match HUD (PRD 5.1): players, scores, round label, multiplier pill and the round track. */
export const HUD: React.FC<{
  me: number;
  opp: number;
  round: string;
  pill: string;
  hot?: boolean;
  track: { s: TrackSeg; mult?: number }[];
  oppName?: string;
  meFirst?: boolean;
  oppAnswered?: boolean;
  bumpMe?: number;
  bumpOpp?: number;
}> = ({ me, opp, round, pill, hot, track, oppName = "mira.v", meFirst, oppAnswered, bumpMe = 0, bumpOpp = 0 }) => (
  <div style={{ width: 960, display: "flex", flexDirection: "column", gap: 22 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 26px 14px 14px", borderRadius: 26, background: "rgba(22,19,42,.85)", border: `2px solid ${C.line2}` }}>
        <Avatar who="me" size={76} />
        <div>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 24, color: C.muted, display: "flex", gap: 10, alignItems: "center" }}>
            You
            {meFirst && <span style={{ background: C.lime, color: C.limeInk, borderRadius: 20, padding: "1px 12px", fontSize: 20, fontWeight: 800 }}>First</span>}
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: me < 0 ? C.loss : C.lime, lineHeight: 1.05, transform: `scale(${1 + bumpMe * 0.25})`, transformOrigin: "left center" }}>
            {fmt(me)}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 26, color: C.muted }}>{round}</div>
        <div
          style={{
            marginTop: 8,
            padding: "8px 22px",
            borderRadius: 30,
            fontFamily: sans,
            fontWeight: 800,
            fontSize: 28,
            background: hot ? "linear-gradient(90deg,#FF4D2E,#FFB020)" : "rgba(198,255,51,.12)",
            color: hot ? "#fff" : C.lime,
            border: hot ? "none" : "2px solid rgba(198,255,51,.4)",
            boxShadow: hot ? "0 0 30px rgba(255,77,46,.6)" : "none",
          }}
        >
          {pill}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 14px 14px 26px", borderRadius: 26, background: "rgba(22,19,42,.85)", border: `2px solid ${C.line2}` }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 24, color: C.muted, display: "flex", gap: 10, alignItems: "center", justifyContent: "flex-end" }}>
            {oppAnswered && <span style={{ background: C.violet, color: "#fff", borderRadius: 20, padding: "1px 12px", fontSize: 20, fontWeight: 800 }}>Answered</span>}
            {oppName}
          </div>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 52, color: C.text, lineHeight: 1.05, transform: `scale(${1 + bumpOpp * 0.25})`, transformOrigin: "right center" }}>
            {fmt(opp)}
          </div>
        </div>
        <Avatar who="opp" size={76} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      {track.map((t, i) => (
        <div key={i} style={{ flex: 1, position: "relative" }}>
          {t.mult && t.mult > 1 && (
            <div style={{ position: "absolute", top: -30, left: 0, right: 0, textAlign: "center", fontFamily: display, fontWeight: 800, fontSize: 20, color: "#FFB020" }}>×{t.mult}</div>
          )}
          <div
            style={{
              height: 10,
              borderRadius: 6,
              background:
                t.s === "now" ? "#FFFFFF" : t.s === "won" ? C.lime : t.s === "lost" ? C.loss : t.mult && t.mult > 1 ? "rgba(255,120,60,.45)" : "rgba(255,255,255,.14)",
              boxShadow: t.s === "won" ? "0 0 14px rgba(198,255,51,.7)" : t.s === "now" ? "0 0 12px rgba(255,255,255,.6)" : "none",
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

const fmt = (v: number) => (v < 0 ? "−" : "") + Math.abs(Math.round(v)).toLocaleString("en-US");

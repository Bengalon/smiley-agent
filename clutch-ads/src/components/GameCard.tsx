import React from "react";
import { C, display } from "../brand";
import { LogoTile } from "./Logo";

export type CardState = "none" | "picked" | "good" | "bad" | "answer" | "dim";

export const CardBack: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: w * 0.09,
      overflow: "hidden",
      background: `repeating-conic-gradient(from 0deg at 50% 50%, rgba(198,255,51,.07) 0deg 4deg, transparent 4deg 12deg), repeating-linear-gradient(45deg, rgba(198,255,51,.06) 0 2px, transparent 2px 12px), linear-gradient(160deg, #3A1F8F, #160F33)`,
      border: "2px solid rgba(198,255,51,.32)",
      boxShadow: "inset 0 0 50px rgba(124,77,255,.55)",
      display: "grid",
      placeItems: "center",
      backfaceVisibility: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        width: w * 0.62,
        height: w * 0.62,
        borderRadius: "50%",
        border: "2px solid rgba(198,255,51,.45)",
      }}
    />
    <LogoTile size={Math.min(w, h) * 0.34} glow={0.8} />
  </div>
);

export const GameCard: React.FC<{
  w: number;
  h: number;
  flip: number; // 0 back .. 1 face
  state?: CardState;
  idx?: number;
  children?: React.ReactNode;
  badges?: { me?: string; opp?: string };
  glare?: number;
  style?: React.CSSProperties;
}> = ({ w, h, flip, state = "none", idx, children, badges, glare = 0, style }) => {
  const r = w * 0.09;
  const border =
    state === "good"
      ? `0 0 0 5px ${C.lime}, 0 0 70px -6px rgba(198,255,51,.85)`
      : state === "bad"
        ? `0 0 0 5px ${C.loss}, 0 0 60px -8px rgba(255,59,92,.75)`
        : state === "answer"
          ? `0 0 0 4px rgba(198,255,51,.8), 0 0 40px -8px rgba(198,255,51,.6)`
          : state === "picked"
            ? `0 0 0 4px rgba(198,255,51,.7)`
            : "0 30px 60px -30px rgba(0,0,0,.95)";
  const lift = Math.sin(Math.PI * flip) * 0.06;
  return (
    <div style={{ width: w, height: h, perspective: 1600, opacity: state === "dim" ? 0.38 : 1, ...style }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateY(${flip * 180}deg) scale(${1 + lift})`,
        }}
      >
        <CardBack w={w} h={h} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: r,
            overflow: "hidden",
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            background: "radial-gradient(120% 80% at 50% 0%, rgba(124,77,255,.28), transparent 60%), linear-gradient(180deg, #241E46, #15122A)",
            border: "2px solid rgba(255,255,255,.1)",
            boxShadow: `${border}, inset 0 2px 0 rgba(255,255,255,.08)`,
            display: "grid",
            placeItems: "center",
          }}
        >
          {idx !== undefined && (
            <div style={{ position: "absolute", left: w * 0.07, top: w * 0.05, fontFamily: display, fontWeight: 800, fontSize: w * 0.075, color: "rgba(255,255,255,.35)" }}>
              {idx}
            </div>
          )}
          {children}
          {glare > 0 && (
            <div
              style={{
                position: "absolute",
                inset: -h,
                background: "linear-gradient(115deg, transparent 42%, rgba(255,255,255,.28) 50%, transparent 58%)",
                transform: `translateX(${(glare * 2 - 1) * w * 1.4}px)`,
              }}
            />
          )}
          {badges?.me && <Badge who="me" label={badges.me} w={w} />}
          {badges?.opp && <Badge who="opp" label={badges.opp} w={w} />}
        </div>
      </div>
    </div>
  );
};

const Badge: React.FC<{ who: "me" | "opp"; label: string; w: number }> = ({ who, label, w }) => (
  <div
    style={{
      position: "absolute",
      top: w * 0.05,
      [who === "me" ? "left" : "right"]: w * 0.05,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "6px 12px 6px 6px",
      borderRadius: 40,
      background: who === "me" ? C.lime : C.violet,
      color: who === "me" ? C.limeInk : "#fff",
      fontFamily: display,
      fontWeight: 800,
      fontSize: w * 0.06,
      boxShadow: "0 6px 20px rgba(0,0,0,.5)",
    }}
  >
    <span
      style={{
        width: w * 0.09,
        height: w * 0.09,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: who === "me" ? C.limeInk : "#fff",
        color: who === "me" ? C.lime : C.violet,
        fontSize: w * 0.05,
      }}
    >
      {who === "me" ? "Y" : "M"}
    </span>
    {label}
  </div>
);

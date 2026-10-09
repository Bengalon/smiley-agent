import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { K, map, p01, expoOut, backOut, inOutCubic } from "./kit";
import { HEB, DISP, Slam, Rise, Count } from "./Type";
import { Logo3D } from "./Three";
import { Leak, Flare, Flash, Dust } from "./Fx";
import { Round, RoundSpec } from "../components/Round";
import { ChipRain, ChipBurst } from "../components/Scenes3D";

/** Neon backdrop for graphic scenes */
export const NeonBg: React.FC<{ hue?: "violet" | "heat" | "lime" }> = ({ hue = "violet" }) => {
  const f = useCurrentFrame();
  const c = hue === "heat" ? "rgba(255,77,46,.55)" : hue === "lime" ? "rgba(198,255,51,.3)" : "rgba(124,77,255,.6)";
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% ${42 + Math.sin(f / 25) * 4}%, ${c}, transparent 70%), radial-gradient(50% 30% at ${30 + Math.sin(f / 30) * 20}% 85%, rgba(198,255,51,.12), transparent 70%)` }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "90px 90px", backgroundPosition: `0 ${f * 3}px`, maskImage: "radial-gradient(60% 50% at 50% 50%, black, transparent)" }} />
      <Dust color={hue === "heat" ? "#FFB37A" : "#D9CCFF"} count={30} seed={hue} />
    </AbsoluteFill>
  );
};

/** A floating 3D phone that plays a real game round on its screen */
export const PhoneGame: React.FC<{ spec: RoundSpec; len: number; tilt?: number; label?: string }> = ({ spec, len, tilt = 1 }) => {
  const f = useCurrentFrame();
  const inP = p01(f, 0, 14, expoOut);
  const ry = map(f, [0, len], [-24, 10], inOutCubic) * tilt;
  const rx = map(f, [0, len], [14, 4], inOutCubic) * tilt;
  const W = 620;
  const H = 1260;
  return (
    <AbsoluteFill style={{ perspective: 2200, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: W, height: H, transform: `translateY(${(1 - inP) * 900 + 40}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${(1 - inP) * -12}deg)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: -16, borderRadius: 96, background: "linear-gradient(140deg,#3b3a46,#0c0b12 40%,#2a2934)", boxShadow: "0 80px 160px rgba(0,0,0,.8), 0 0 120px rgba(124,77,255,.45), inset 0 0 0 3px rgba(255,255,255,.12)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: 80, overflow: "hidden", background: K.bg }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${W / 1080})`, transformOrigin: "0 0" }}>
            <AbsoluteFill style={{ background: "radial-gradient(80% 50% at 50% 40%, rgba(124,77,255,.45), transparent 70%), #0A0912" }} />
            <Round spec={spec} feltTop={560} />
          </div>
          <div style={{ position: "absolute", top: 22, left: "50%", width: 150, height: 42, marginLeft: -75, borderRadius: 30, background: "#000" }} />
          <AbsoluteFill style={{ background: `linear-gradient(${120 + f * 0.6}deg, transparent 35%, rgba(255,255,255,.14) 45%, transparent 55%)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Two players face off: two footage halves with a lime VS */
export const Versus: React.FC<{ len: number; left?: string; right?: string; lOff?: number; rOff?: number }> = ({ len, left = "focus", right = "rival", lOff = 0.5, rOff = 0.5 }) => {
  const f = useCurrentFrame();
  const sl = p01(f, 0, 10, expoOut);
  const vs = p01(f, 6, 14, backOut);
  const half = (clip: string, off: number, side: "top" | "bottom") => (
    <div style={{ position: "absolute", left: 0, right: 0, height: 960, [side]: 0, overflow: "hidden", transform: `translateX(${(1 - sl) * (side === "top" ? -1080 : 1080)}px)` }}>
      <div style={{ position: "absolute", left: 0, top: side === "top" ? -380 : -560, width: 1080, height: 1920, transform: `scale(${map(f, [0, len], [1.05, 1.15])})` }}>
        <Video src={staticFile(`clips/${clip}.mp4`)} muted trimBefore={Math.round(off * 30)} objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ background: side === "top" ? "linear-gradient(0deg, rgba(198,255,51,.25), transparent 40%)" : "linear-gradient(180deg, rgba(124,77,255,.35), transparent 40%)" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {half(left, lOff, "top")}
      {half(right, rOff, "bottom")}
      <div style={{ position: "absolute", left: -40, right: -40, top: 950, height: 20, background: K.lime, transform: `rotate(-4deg) scaleX(${sl})`, boxShadow: `0 0 60px ${K.lime}` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: DISP, fontWeight: 900, fontStyle: "italic", fontSize: 230, color: K.limeInk, background: K.lime, padding: "0 50px", borderRadius: 40, transform: `scale(${vs}) rotate(-6deg)`, boxShadow: `0 0 120px ${K.lime}, 0 30px 80px rgba(0,0,0,.6)` }}>VS</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, top: 820, fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 44, color: "#fff", opacity: p01(f, 10, 16), textShadow: "0 4px 20px #000" }}>You</div>
      <div style={{ position: "absolute", right: 60, top: 1000, fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 44, color: "#fff", opacity: p01(f, 12, 18), textShadow: "0 4px 20px #000" }}>mira.v</div>
      <Flash at={6} max={0.5} len={6} color={K.lime} />
    </AbsoluteFill>
  );
};

/** YOU WON + amount + 3D chip rain over the celebration shot */
export const WinBurst: React.FC<{ amount: number; under?: React.ReactNode }> = ({ amount, under }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {under}
      <AbsoluteFill style={{ background: "radial-gradient(70% 40% at 50% 45%, rgba(10,9,18,.25), rgba(10,9,18,.75))" }} />
      <ChipRain at={0} count={30} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 0 }}>
        <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 120, color: K.lime, letterSpacing: "-0.02em", transform: `scale(${2 - p01(f, 0, 9, backOut)})`, opacity: p01(f, 0, 4), textShadow: `0 0 70px ${K.lime}` }}>YOU WON</div>
        <Count at={3} to={amount} decimals={2} prefix="+$" size={190} color="#fff" len={22} />
      </AbsoluteFill>
      <Flare at={2} y={960} color={K.lime} len={20} width={1.5} />
      <Leak at={0} len={24} seed={5} hue={0} max={0.35} />
    </AbsoluteFill>
  );
};

/** Closing card. `len` frames. */
export const EndCardV2: React.FC<{ len: number; cta?: string; tagline?: string; pre?: string }> = ({ len, cta = "נסה משחק חינם", tagline = "תהמר על *עצמך.*", pre }) => {
  const f = useCurrentFrame();
  const btn = p01(f, 14, 24, backOut);
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <AbsoluteFill style={{ opacity: 0.55, filter: "blur(10px) brightness(.55) saturate(1.2)", transform: `scale(${1.1 + f * 0.001})` }}>
        <Video src={staticFile("clips/chips.mp4")} muted trimBefore={30} objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(60% 35% at 50% 32%, rgba(124,77,255,.55), transparent 70%)" }} />
      <AbsoluteFill style={{ transform: "translateY(-500px) scale(.8)" }}>
        <Logo3D at={0} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 820, flexDirection: "column" }}>
        <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: 132, color: K.text, letterSpacing: "-0.02em", opacity: p01(f, 4, 10), transform: `translateY(${(1 - p01(f, 4, 14)) * 40}px)`, textShadow: "0 10px 50px rgba(0,0,0,.7)" }}>CLUTCH</div>
        {pre && <Rise text={pre} at={8} size={58} color={K.muted} weight={700} style={{ marginTop: 26 }} />}
        <Slam text={tagline} at={pre ? 12 : 9} size={120} style={{ marginTop: pre ? 10 : 30 }} />
        <div style={{ marginTop: 60, transform: `scale(${btn * (1 + 0.025 * Math.sin(Math.max(0, f - 24) / 4))})`, opacity: Math.min(1, btn * 2) }}>
          <div style={{ direction: "rtl", padding: "30px 80px", borderRadius: 28, background: K.lime, color: K.limeInk, fontFamily: HEB, fontWeight: 900, fontSize: 64, boxShadow: `0 0 90px ${K.lime}99, inset 0 -8px 0 rgba(0,0,0,.18)` }}>{cta}</div>
        </div>
        <div style={{ marginTop: 34, fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 38, color: K.text, opacity: p01(f, 20, 28) }}>clutchgamebet.netlify.app</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", direction: "rtl", fontFamily: HEB, fontWeight: 600, fontSize: 30, color: K.muted, opacity: p01(f, 22, 30) }}>18+ בלבד · שחקו באחריות · משחק מיומנות</div>
      <Flare at={2} y={420} color={K.lime} len={22} width={1.3} />
      <Flash at={0} color={K.lime} max={0.35} len={8} />
      {len > 0 && null}
    </AbsoluteFill>
  );
};

/** Big 3-2-1 countdown ring over everything */
export const Countdown: React.FC<{ marks: number[]; size?: number }> = ({ marks, size = 300 }) => {
  const f = useCurrentFrame();
  const i = marks.findIndex((m, k) => f >= m && (k === marks.length - 1 || f < marks[k + 1]));
  if (i < 0 || f > marks[marks.length - 1] + 18) return null;
  const n = marks.length - i;
  const p = p01(f, marks[i], marks[i] + 7, backOut);
  const col = n === 1 ? K.heat : K.lime;
  return (
    <div style={{ position: "absolute", left: 540 - size / 2, top: 140, width: size, height: size, display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `14px solid ${col}`, boxShadow: `0 0 60px ${col}, inset 0 0 40px ${col}66`, transform: `scale(${1.4 - 0.4 * p})`, opacity: 1 - p01(f, marks[i] + 10, marks[i] + 16) * 0.3 }} />
      <div style={{ fontFamily: DISP, fontWeight: 900, fontSize: size * 0.55, color: col, transform: `scale(${1.8 - 0.8 * p})`, textShadow: `0 0 50px ${col}` }}>{n}</div>
    </div>
  );
};

export { ChipBurst, Sequence, Slam };

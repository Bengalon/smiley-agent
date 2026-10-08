import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { C, heb, sans } from "../brand";
import { backOut, ease, lerp, pop, prog } from "../anim";
import { GameCard, CardState } from "./GameCard";
import { Face, FaceView } from "./faces";
import { Banner, CoinFlight, Confetti, TapRipple } from "./Effects";
import { Sfx } from "./Sfx";

export type RoundSpec = {
  ins: string;
  he?: string;
  sub?: string; // lime sub-line under the instruction, e.g. "Ignore the words"
  faces: Face[];
  ans: number;
  me?: { pick: number; at: number };
  opp?: { pick: number; at: number };
  flip: number;
  reveal: number;
  banner?: { title: string; sub?: string; tone: "win" | "lose" | "neutral" };
  coinsTo?: [number, number];
  confetti?: number;
  hot?: boolean;
  timerSecs?: number;
};

export const CW = 400;
export const CH = 500;
export const GAP = 28;
export const PAD = 36;

export const cardCenter = (i: number, feltTop: number): [number, number] => {
  const c = i % 2;
  const r = Math.floor(i / 2);
  return [540 + (c - 0.5) * (CW + GAP), feltTop + PAD + r * (CH + GAP) + CH / 2];
};

export const Round: React.FC<{ spec: RoundSpec; feltTop?: number; sfx?: boolean; showIns?: boolean }> = ({ spec, feltTop = 560, sfx = true, showIns = true }) => {
  const f = useCurrentFrame();
  const { me, opp, flip, reveal } = spec;
  const revealed = f >= reveal;
  const meRight = me ? me.pick === spec.ans : false;
  const celebrate = meRight && (!spec.banner || spec.banner.tone === "win");
  const timerSecs = spec.timerSecs ?? 6;
  const timerP = prog(f, flip + 5, flip + 5 + timerSecs * 30, (t) => t);
  const timerStop = me ? prog(me.at, flip + 5, flip + 5 + timerSecs * 30, (t) => t) : 1;
  const tp = f >= (me?.at ?? 1e9) ? timerStop : timerP;
  const late = tp > 0.66;

  const stateOf = (i: number): CardState => {
    if (!me || f < me.at) return "none";
    if (!revealed) return i === me.pick ? "picked" : "dim";
    if (i === me.pick) return meRight ? "good" : "bad";
    if (i === spec.ans) return "answer";
    return "dim";
  };

  const first = me && opp ? (me.at <= opp.at ? "me" : "opp") : me ? "me" : "opp";
  const insIn = pop(f, 2, 14, 160);
  const feltH = PAD * 2 + CH * 2 + GAP + 60;

  return (
    <AbsoluteFill>
      {showIns && (
        <div style={{ position: "absolute", bottom: 1920 - feltTop + 28, left: 50, right: 50, textAlign: "center", opacity: insIn, transform: `translateY(${(1 - insIn) * 40}px)` }}>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: spec.ins.length > 30 ? 56 : 66, color: C.text, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{spec.ins}</div>
          {spec.he && (
            <div style={{ fontFamily: heb, fontWeight: 700, fontSize: 44, color: C.lime, marginTop: 12, direction: "rtl" }}>{spec.he}</div>
          )}
          {spec.sub && !spec.he && <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.lime, marginTop: 10 }}>{spec.sub}</div>}
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 540 - (CW * 2 + GAP + PAD * 2) / 2,
          top: feltTop,
          width: CW * 2 + GAP + PAD * 2,
          height: feltH,
          borderRadius: 44,
          background: spec.hot
            ? "radial-gradient(100% 70% at 50% 40%, rgba(255,77,46,.22), transparent 70%), linear-gradient(180deg,#1B1430,#120E22)"
            : "radial-gradient(100% 70% at 50% 40%, rgba(124,77,255,.26), transparent 70%), linear-gradient(180deg,#191433,#100D20)",
          border: `2px solid ${spec.hot ? "rgba(255,77,46,.35)" : C.line2}`,
          boxShadow: `inset 0 0 90px ${spec.hot ? "rgba(255,77,46,.18)" : "rgba(124,77,255,.22)"}, 0 50px 120px -40px rgba(0,0,0,.9)`,
          opacity: lerp(f, [0, 8], [0, 1]),
        }}
      >
        <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 34, height: 12, borderRadius: 6, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${(1 - tp) * 100}%`,
              background: late ? `linear-gradient(90deg, ${C.heat}, #FFB020)` : `linear-gradient(90deg, #6EDC1E, ${C.lime})`,
              boxShadow: late ? "0 0 18px rgba(255,77,46,.8)" : "0 0 18px rgba(198,255,51,.7)",
            }}
          />
        </div>
      </div>
      {spec.faces.map((face, i) => {
        const [cx, cy] = cardCenter(i, feltTop);
        const dealP = prog(f, i * 3, i * 3 + 14, backOut);
        const fp = interpolate(f, [flip + i, flip + i + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: backOut });
        const st = stateOf(i);
        const shakeX = st === "bad" ? Math.sin((f - reveal) * 2.2) * 16 * Math.max(0, 1 - (f - reveal) / 12) : 0;
        const goodPop = st === "good" ? 1 + 0.07 * Math.sin(Math.min(1, (f - reveal) / 8) * Math.PI) : 1;
        const tapPress = me && i === me.pick ? 1 - 0.05 * Math.sin(prog(f, me.at, me.at + 6, (t) => t) * Math.PI) : 1;
        const badges = revealed
          ? {
              me: me && i === me.pick ? (first === "me" ? "1st" : "2nd") : undefined,
              opp: opp && i === opp.pick ? (first === "opp" ? "1st" : "2nd") : undefined,
            }
          : undefined;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - CW / 2,
              top: cy - CH / 2,
              transform: `translate(${(1 - dealP) * (i % 2 ? 160 : -160) + shakeX}px, ${(1 - dealP) * -900}px) rotate(${(1 - dealP) * (i % 2 ? 25 : -25)}deg) scale(${goodPop * tapPress})`,
              opacity: prog(f, i * 3, i * 3 + 5),
              zIndex: st === "good" ? 3 : 1,
            }}
          >
            <GameCard w={CW} h={CH} flip={fp} state={st} idx={i + 1} glare={fp > 0 && fp < 1 ? fp : 0} badges={badges}>
              <FaceView face={face} w={CW} />
            </GameCard>
          </div>
        );
      })}
      {me && (() => {
        const [x, y] = cardCenter(me.pick, feltTop);
        return <TapRipple x={x + 40} y={y + 60} at={me.at} />;
      })()}
      {spec.banner && (
        <div style={{ position: "absolute", left: 0, right: 0, top: feltTop + PAD + CH + GAP / 2 - 10, height: 0 }}>
          <Banner at={reveal + 2} {...spec.banner} hold={34} />
        </div>
      )}
      {revealed && celebrate && spec.confetti !== 0 && (
        <Confetti x={cardCenter(me!.pick, feltTop)[0]} y={cardCenter(me!.pick, feltTop)[1]} at={reveal} count={spec.confetti ?? 54} seed={`r${spec.ins}`} />
      )}
      {revealed && celebrate && spec.coinsTo && <CoinFlight from={cardCenter(me!.pick, feltTop)} to={spec.coinsTo} at={reveal + 4} count={spec.hot ? 10 : 6} />}
      {sfx && (
        <>
          <Sfx at={0} name="deal" volume={0.7} />
          <Sfx at={6} name="deal" volume={0.5} />
          <Sfx at={flip} name="flip" volume={0.9} />
          {me && <Sfx at={me.at} name={first === "me" ? "first" : "tap"} volume={0.8} />}
          {opp && <Sfx at={opp.at} name={first === "opp" ? "oppfirst" : "tap"} volume={0.6} />}
          <Sequence from={reveal} layout="none">
            <Sfx at={0} name={meRight ? "good" : "bad"} volume={0.8} />
            {spec.banner?.tone === "win" && <Sfx at={3} name="roundwin" volume={0.75} />}
            {spec.banner?.tone === "lose" && <Sfx at={3} name="roundlose" volume={0.7} />}
            {celebrate && spec.coinsTo && <Sfx at={10} name="coins" volume={0.6} />}
          </Sequence>
        </>
      )}
    </AbsoluteFill>
  );
};

/** helper so ads can declare the 4 faces quickly */
export const nums = (...v: (string | number)[]): Face[] => v.map((x) => ({ k: "num", v: String(x) }));
export { ease };

import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, display, heb } from "../brand";
import { pop, prog } from "../anim";
import { Backdrop, Grain } from "../components/Backdrop";
import { HeTitle, Pill } from "../components/Text";
import { Round, RoundSpec } from "../components/Round";
import { EndCard, VSScreen, WinScreen } from "../components/Screens";
import { Cut } from "../components/Transitions";
import { Sfx } from "../components/Sfx";
import { LogoTile } from "../components/Logo";
import { Face } from "../components/faces";

// 128 BPM, beat = 14.0625 frames. 12 bars + tail = 23.5 s.
const B = (beat: number) => Math.round(beat * 14.0625);
export const AD5_FRAMES = 705;

/** Countdown ring 3-2-1 that runs from `start` for `len` frames. */
const Countdown: React.FC<{ start: number; len: number }> = ({ start, len }) => {
  const f = useCurrentFrame();
  const t = f - start;
  if (t < 0 || t >= len) return null;
  const step = len / 3;
  const n = 3 - Math.floor(t / step);
  const p = pop(f, start + Math.floor(t / step) * step, 10, 260);
  const frac = t / len;
  const col = n === 1 ? C.heat : C.lime;
  const R = 104;
  return (
    <div style={{ position: "absolute", top: 170, left: 540 - 130, width: 260, height: 260 }}>
      <svg width={260} height={260} style={{ position: "absolute", inset: 0, rotate: "-90deg" }}>
        <circle cx={130} cy={130} r={R} stroke="rgba(255,255,255,.1)" strokeWidth={16} fill="none" />
        <circle cx={130} cy={130} r={R} stroke={col} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * frac} style={{ filter: `drop-shadow(0 0 14px ${col})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: display, fontWeight: 900, fontSize: 150, color: col, transform: `scale(${1.4 - 0.4 * p})`, textShadow: `0 0 40px ${col}` }}>{n}</div>
    </div>
  );
};

const Challenge: React.FC<{ n: number; spec: Omit<RoundSpec, "flip" | "reveal" | "me">; len: number; after: string }> = ({ n, spec, len, after }) => {
  const f = useCurrentFrame();
  const flip = B(1);
  const reveal = len - B(4); // reveal one bar before the scene ends
  const countLen = reveal - flip - 6;
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: prog(f, 0, 8) }}>
        <Pill tone="ghost" size={34}>
          אתגר {n} מתוך 3
        </Pill>
      </div>
      <Countdown start={flip + 4} len={countLen} />
      {f >= reveal && (
        <div style={{ position: "absolute", top: 210, left: 0, right: 0 }}>
          <HeTitle text={after} at={reveal + 2} size={110} />
        </div>
      )}
      <AbsoluteFill style={{ transform: "scale(.9)", transformOrigin: "50% 100%" }}>
        <Round spec={{ ...spec, flip, reveal, me: { pick: spec.ans, at: reveal - 5 }, banner: { title: "+100", tone: "win" }, confetti: 60 }} feltTop={760} />
      </AbsoluteFill>
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={flip + 4 + (i * countLen) / 3} name={i === 2 ? "count" : "tick"} volume={0.8} />
      ))}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ transform: `scale(${pop(f, 0, 12, 200)})` }}>
          <LogoTile size={150} />
        </div>
        <HeTitle text={"יש לך\n*3 שניות.*"} at={4} size={170} stagger={5} />
        <HeTitle text="תספיק?" at={30} size={90} weight={700} color={C.muted} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Real: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
      <HeTitle text={"*3 מתוך 3?*"} at={0} size={150} />
      <HeTitle text={"עכשיו תעשה את זה\nמול שחקן אמיתי."} at={10} size={84} weight={800} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const arrows = (d: number[]): Face[] => d.map((x) => ({ k: "arrows", dirs: [x] }));

export const Ad5Challenge: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Cut from={0} dur={B(4)} punch={false} name="Hook">
      <Hook />
    </Cut>
    <Cut from={B(4)} dur={B(12) - B(4)} name="Challenge 1">
      <Challenge n={1} len={B(12) - B(4)} after="*הספקת?*" spec={{ ins: "Pick the odd arrow", he: "מצא את החץ השונה", faces: arrows([45, 45, 45, 225]), ans: 3 }} />
    </Cut>
    <Cut from={B(12)} dur={B(24) - B(12)} name="Challenge 2">
      <Challenge
        n={2}
        len={B(24) - B(12)}
        after="*עדיין איתנו?*"
        spec={{
          ins: "Pick the word printed in its own color",
          he: "המילה שצבועה בצבע של עצמה",
          faces: [
            { k: "word", v: "RED", ink: C.blue, size: 0.24 },
            { k: "word", v: "BLUE", ink: C.green, size: 0.22 },
            { k: "word", v: "YELLOW", ink: C.purple, size: 0.17 },
            { k: "word", v: "GREEN", ink: C.green, size: 0.19 },
          ],
          ans: 3,
        }}
      />
    </Cut>
    <Cut from={B(24)} dur={B(36) - B(24)} name="Challenge 3">
      <Challenge n={3} len={B(36) - B(24)} after="*מלך.*" spec={{ ins: "Pick the largest fraction", he: "בחר את השבר הגדול", faces: [{ k: "frac", a: 3, b: 8 }, { k: "frac", a: 5, b: 9 }, { k: "frac", a: 2, b: 3 }, { k: "frac", a: 4, b: 7 }], ans: 2 }} />
    </Cut>
    <Cut from={B(36)} dur={B(38) - B(36)} name="Now for real">
      <Real />
    </Cut>
    <Cut from={B(38)} dur={B(41) - B(38)} name="VS">
      <AbsoluteFill>
        <Backdrop />
        <VSScreen count={3} tickEvery={12} countStart={8} line={<span>Sprint, 5 rounds. <b style={{ color: C.text }}>$10</b> each, winner gets <b style={{ color: C.lime }}>$19</b>.</span>} />
        <div style={{ position: "absolute", bottom: 150, left: 0, right: 0 }}>
          <HeTitle text="על *כסף אמיתי.*" at={6} size={84} />
        </div>
      </AbsoluteFill>
    </Cut>
    <Cut from={B(41)} dur={B(44) - B(41)} name="Win">
      <WinScreen amount={19} score="Sprint, $10 stake." />
    </Cut>
    <Cut from={B(44)} dur={AD5_FRAMES - B(44)} name="End card">
      <EndCard />
    </Cut>
    <Grain />
    <Sequence layout="none">
      {[B(4), B(12), B(24), B(36), B(38), B(41)].map((at, i) => (
        <Sfx key={i} at={at - 3} name="whoosh-short" volume={0.45} />
      ))}
    </Sequence>
    <Audio src={staticFile("music/ad5.wav")} volume={0.4} />
  </AbsoluteFill>
);

export { heb };

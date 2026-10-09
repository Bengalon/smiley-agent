import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { F, K, p01, map, backOut } from "./kit";
import { Shot } from "./Shot";
import { Slam, Rise, Plate, Count, DISP } from "./Type";
import { Flash, Flare, Leak, LetterBox, Vignette, Grain, ShakeWrap, Sweep, Dust } from "./Fx";
import { Cards3D } from "./Three";
import { NeonBg, PhoneGame, Versus, WinBurst, EndCardV2 } from "./Scenes";
import { Extruded } from "../components/Text";
import { Shockwave, HeatVignette, Confetti } from "../components/Effects";
import { ChipBurst } from "../components/Scenes3D";
import { Sfx2, Whooshes } from "./Sound";

const OFF = 0.25;
const V = (t: number) => F(OFF + t);
export const STORY_FRAMES = F(44.0);
const low: React.CSSProperties = { position: "absolute", left: 40, right: 40, bottom: 380 };
const top: React.CSSProperties = { position: "absolute", left: 40, right: 40, top: 150 };

/** Big scoreboard you vs mira.v */
const Score: React.FC<{ me: number; opp: number; at: number }> = ({ me, opp, at }) => {
  const f = useCurrentFrame();
  const p = p01(f, at, at + 8, backOut);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 230, display: "flex", justifyContent: "space-between", alignItems: "center", transform: `scale(${p})`, fontFamily: DISP, fontWeight: 900 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, color: K.muted, fontFamily: "Manrope, sans-serif" }}>You</div>
        <div style={{ fontSize: 130, color: K.lime, textShadow: `0 0 40px ${K.lime}` }}>{me}</div>
      </div>
      <div style={{ fontSize: 60, color: K.muted }}>:</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 36, color: K.muted, fontFamily: "Manrope, sans-serif" }}>mira.v</div>
        <div style={{ fontSize: 130, color: "#fff" }}>{opp}</div>
      </div>
    </div>
  );
};

const Clutch3: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const big = p01(f, 4, 14, backOut);
  return (
    <AbsoluteFill>
      <NeonBg hue="heat" />
      <HeatVignette from={0} to={len} strength={1.5} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${2.4 - 1.4 * big}) rotate(${(1 - big) * -14}deg)`, filter: `blur(${(1 - big) * 20}px)` }}>
          <Extruded text="×3" size={460} tiltX={10} tiltY={Math.sin(f / 9) * 12} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const AdStory: React.FC = () => {
  const cuts = [V(1.76), V(3.46), V(5.14), V(6.4), V(7.76), V(9.3), V(11.58), V(13.52), V(15.5), V(17.64), V(20.4), V(21.22), V(22.5), V(25.5), V(27.48), V(30.56), V(32.1), V(32.78), V(34.76), V(37.56), V(39.5)];
  const montage = ["focus", "rival", "tap", "rival", "focus", "rival", "tap", "rival"];
  const mlen = Math.floor((V(24.3) - V(22.5)) / montage.length);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ShakeWrap hits={[V(9.3), V(25.5), V(32.1), V(32.78), V(39.5)]}>
        <Shot clip="hope" at={0} dur={V(1.76)} offset={0.2} grade="luck" zoom={[1.1, 1.3]} />
        <Shot clip="roulette" at={V(1.76)} dur={V(3.46) - V(1.76)} offset={0.6} grade="luck" zoom={[1.1, 1.3]} rotate={[0, 4]} />
        <Shot clip="dice" at={V(3.46)} dur={V(5.14) - V(3.46)} offset={0.6} rate={0.8} grade="luck" enter="whip-l" zoom={[1.05, 1.25]} />
        <Shot clip="rake" at={V(5.14)} dur={V(6.4) - V(5.14)} offset={0.8} grade="luck" zoom={[1.15, 1.3]} />
        <Shot clip="defeat" at={V(6.4)} dur={V(7.76) - V(6.4)} offset={0.8} grade="luck" desat={[0.2, 0.9]} zoom={[1.05, 1.2]} />
        <Shot clip="street" at={V(7.76)} dur={V(9.3) - V(7.76)} offset={0.5} grade="skill" enter="whip-r" zoom={[1.1, 1.2]} />
        <Shot clip="eye" at={V(9.3)} dur={V(11.58) - V(9.3)} offset={0.2} grade="skill" enter="none" zoom={[1.0, 1.4]} />
        <Sequence from={V(11.58)} durationInFrames={V(13.52) - V(11.58)}>
          <Versus len={V(13.52) - V(11.58)} />
        </Sequence>
        <Sequence from={V(13.52)} durationInFrames={V(15.5) - V(13.52)}>
          <NeonBg hue="lime" />
          <ChipBurst at={0} count={26} />
        </Sequence>
        <Sequence from={V(15.5)} durationInFrames={V(17.64) - V(15.5)}>
          <NeonBg />
          <PhoneGame len={V(17.64) - V(15.5)} spec={{ ins: "Pick the odd suit", faces: [{ k: "pc", rank: "9", suit: "♠" }, { k: "pc", rank: "7", suit: "♠" }, { k: "pc", rank: "5", suit: "♣" }, { k: "pc", rank: "8", suit: "♠" }], ans: 2, flip: 18, me: { pick: 2, at: 48 }, reveal: 52, banner: { title: "+100", tone: "win" } }} />
        </Sequence>
        <Sequence from={V(17.64)} durationInFrames={V(20.4) - V(17.64)}>
          <NeonBg />
          <Cards3D labels={["318", "381", "813", "183"]} good={2} flipAt={8} pickAt={V(19.26) - V(17.64)} />
        </Sequence>
        <Shot clip="tap" at={V(20.4)} dur={V(21.22) - V(20.4)} offset={1.2} grade="skill" zoom={[1.15, 1.35]} />
        <Shot clip="rival" at={V(21.22)} dur={V(22.5) - V(21.22)} offset={1.8} grade="skill" zoom={[1.1, 1.3]} />
        {montage.map((c, i) => (
          <Shot key={i} clip={c} at={V(22.5) + i * mlen} dur={mlen} offset={0.5 + i * 0.4} grade="skill" zoom={[1.25, 1.35]} punch={i % 2 === 0} />
        ))}
        <Sequence from={V(24.3)} durationInFrames={V(25.5) - V(24.3)}>
          <NeonBg hue="heat" />
        </Sequence>
        <Sequence from={V(25.5)} durationInFrames={V(27.48) - V(25.5)}>
          <Clutch3 len={V(27.48) - V(25.5)} />
        </Sequence>
        <Shot clip="focus" at={V(27.48)} dur={V(30.56) - V(27.48)} offset={0.6} rate={0.7} grade="skill" zoom={[1.2, 1.55]} />
        <Shot clip="eye" at={V(30.56)} dur={V(32.1) - V(30.56)} offset={1.5} rate={0.6} grade="skill" zoom={[1.3, 1.9]} />
        <Sequence from={V(32.1)} durationInFrames={V(32.78) - V(32.1)}>
          <Shot clip="tap" at={0} dur={V(32.78) - V(32.1)} offset={2.6} grade="skill" enter="zoom" zoom={[1.2, 1.5]} />
          <ChipBurst at={0} count={20} />
        </Sequence>
        <Sequence from={V(32.78)} durationInFrames={V(34.76) - V(32.78)}>
          <WinBurst amount={47.5} under={<Shot clip="win" at={0} dur={V(34.76) - V(32.78)} offset={0.3} grade="skill" zoom={[1.1, 1.2]} />} />
        </Sequence>
        <Shot clip="win" at={V(34.76)} dur={V(37.56) - V(34.76)} offset={2.0} rate={0.6} grade="skill" zoom={[1.15, 1.3]} />
        <Shot clip="roulette" at={V(37.56)} dur={F(0.5)} offset={1.0} grade="grey" zoom={[1.3, 1.4]} />
        <Shot clip="dice" at={V(37.56) + F(0.5)} dur={F(0.5)} offset={1.5} grade="grey" zoom={[1.3, 1.4]} />
        <Shot clip="slots" at={V(37.56) + F(1.0)} dur={F(0.5)} offset={2.0} grade="grey" zoom={[1.3, 1.4]} />
        <Shot clip="hope" at={V(37.56) + F(1.5)} dur={V(39.5) - V(37.56) - F(1.5)} offset={3.0} grade="grey" zoom={[1.3, 1.4]} />
        <Sequence from={V(39.5)}>
          <EndCardV2 len={STORY_FRAMES - V(39.5)} pre="מהיום," />
        </Sequence>
      </ShakeWrap>

      <Sequence durationInFrames={V(7.76)}>
        <LetterBox from={0} to={V(7.76)} size={150} />
        <Dust color="#FFD9A0" count={34} seed="st" />
      </Sequence>
      <Rise text={"שנים הוא הימר\nעל *המזל.*"} at={V(0)} out={V(1.76) - 2} size={110} hl={K.amber} style={low} />
      <Rise text={"הגלגל\nלא הכיר אותו."} at={V(1.76)} out={V(3.46) - 2} size={120} style={low} />
      <Rise text={"הקוביות\nלא ספרו אותו."} at={V(3.46)} out={V(5.14) - 2} size={120} style={low} />
      <Rise text="בכל פעם," at={V(5.14)} out={V(6.4) - 2} size={120} style={low} />
      <Rise text={"מישהו אחר\n*החליט בשבילו.*"} at={V(6.4)} out={V(7.76) - 2} size={110} hl={K.loss} style={low} />
      <Slam text={"הלילה\n*זה שונה.*"} at={V(7.76)} out={V(9.3) - 2} size={150} style={low} />
      <Slam text={"ההימור\n*עליו.*"} at={V(10.14)} out={V(11.58) - 2} size={190} style={low} />
      <Rise text={"דו-קרב.\n*אחד על אחד.*"} at={V(11.6)} out={V(13.52) - 2} size={90} style={{ position: "absolute", left: 40, right: 40, top: 120 }} />
      <Count at={V(13.52)} to={25} prefix="$" len={16} out={V(15.5) - 3} size={300} style={{ position: "absolute", left: 0, right: 0, top: 640 }} />
      <Rise text="כל אחד." at={V(14.62)} out={V(15.5) - 2} size={120} style={{ position: "absolute", left: 40, right: 40, top: 1000 }} />
      <Rise text={"אותם סיבובים.\n*אותה שנייה.*"} at={V(15.5)} out={V(17.64) - 2} size={96} style={{ position: "absolute", left: 40, right: 40, top: 110 }} />
      <Slam text="4 קלפים מתהפכים." at={V(17.64)} out={V(19.26) - 2} size={104} style={top} />
      <Slam text="רק *אחד* נכון." at={V(19.26)} out={V(20.4) - 2} size={120} style={top} />
      <Slam text={"הוא\n*מהיר.*"} at={V(20.4)} out={V(21.22) - 2} size={190} style={low} />
      <Slam text={"היא\nמהירה יותר."} at={V(21.22)} out={V(22.5) - 2} size={170} hl={K.violet} style={low} />
      <Sequence from={V(22.5)} durationInFrames={V(25.5) - V(22.5)}>
        <Score me={520} opp={660} at={0} />
      </Sequence>
      <Count at={V(24.3)} to={-140} from={0} len={14} out={V(25.5) - 3} size={290} color={K.loss} style={{ position: "absolute", left: 0, right: 0, top: 720 }} />
      <Rise text="בפיגור." at={V(24.4)} out={V(25.5) - 2} size={110} hl={K.loss} style={{ position: "absolute", left: 40, right: 40, top: 1080 }} />
      <Slam text={"סיבוב\n*הקלאץ'.*"} at={V(26.1)} out={V(27.48) - 2} size={150} hl={K.amber} style={{ position: "absolute", left: 40, right: 40, top: 150 }} />
      <Plate text="פי 3." at={V(27.48)} out={V(28.36) - 2} size={170} bg={K.heat} ink="#fff" style={{ position: "absolute", left: 40, right: 40, top: 1200 }} />
      <Rise text={"כל טעות\n*עולה 300.*"} at={V(28.36)} out={V(30.56) - 2} size={130} hl={K.loss} style={low} />
      <Slam text={"שנייה אחת\n*להחליט.*"} at={V(30.56)} out={V(32.1) - 2} size={140} style={low} />
      <Slam text="CLUTCH!" at={V(32.12)} out={V(32.78) - 2} size={200} font="Unbounded, sans-serif" style={{ position: "absolute", left: 0, right: 0, top: 820, direction: "ltr" }} />
      <Rise text={"ובפעם הראשונה,\nהניצחון *באמת שלו.*"} at={V(34.76)} out={V(37.56) - 2} size={104} style={low} />
      <Rise text={"עד היום הימרת\nעל *המזל.*"} at={V(37.56)} out={V(39.5) - 2} size={120} hl={K.amber} style={low} />

      <Sweep at={V(9.3) - 6} />
      <Flash at={V(9.3)} color={K.lime} max={0.6} len={8} />
      <Flare at={V(9.3) + 2} y={930} len={24} width={1.6} />
      <Leak at={V(7.76)} len={22} seed={3} hue={0} max={0.35} />
      <Flare at={V(19.26) + 4} y={980} len={18} />
      <Sequence from={V(30.56)} durationInFrames={V(32.1) - V(30.56)}>
        <TimerBar len={V(32.1) - V(30.56)} />
      </Sequence>
      <Sequence from={V(32.1)} durationInFrames={30}>
        <Shockwave x={540} y={960} at={0} size={1600} />
        <Confetti x={540} y={1000} at={2} count={110} power={1.4} seed="cl" />
      </Sequence>
      <Flash at={V(32.1)} color={K.lime} max={0.7} len={8} />
      <Flare at={V(32.1) + 1} y={900} len={22} width={2} />
      <Vignette amount={0.7} />
      <Grain opacity={0.08} />

      <Whooshes at={cuts.filter((c) => c !== V(32.1))} />
      <Sfx2 at={0} name="hit" volume={0.5} />
      <Sfx2 at={V(9.3)} name="braam" volume={0.6} />
      <Sfx2 at={V(13.52)} name="hit" volume={0.45} />
      <Sequence from={V(13.6)}>
        <Audio src={staticFile("sfx/coins.wav")} volume={0.4} />
      </Sequence>
      <Sfx2 at={V(24.3)} name="subdrop" volume={0.7} />
      <Sfx2 at={V(25.5)} name="braam" volume={0.7} />
      <Sfx2 at={V(32.1)} name="glass" volume={0.6} />
      <Sequence from={V(32.85)}>
        <Audio src={staticFile("sfx/coins.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={V(0)}>
        <Audio src={staticFile("vo2/vD.wav")} volume={1} />
      </Sequence>
      <Audio src={staticFile("music2/story.wav")} volume={0.42} />
    </AbsoluteFill>
  );
};

/** Draining round timer at the bottom for the final decision */
const TimerBar: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const w = 1 - f / len;
  const late = w < 0.4;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1640, height: 22, borderRadius: 11, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${map(w, [0, 1], [0, 100], (t) => t)}%`, background: late ? `linear-gradient(90deg, ${K.heat}, #FFB020)` : `linear-gradient(90deg, #6EDC1E, ${K.lime})`, boxShadow: late ? "0 0 24px rgba(255,77,46,.9)" : `0 0 24px ${K.lime}` }} />
    </div>
  );
};

import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { F, K } from "./kit";
import { Shot } from "./Shot";
import { Slam, Rise, Plate, Strike } from "./Type";
import { Flash, Flare, Leak, LetterBox, Vignette, Grain, ShakeWrap, Sweep, Dust } from "./Fx";
import { Logo3D } from "./Three";
import { NeonBg, PhoneGame, Countdown, WinBurst, EndCardV2 } from "./Scenes";
import { Round } from "../components/Round";
import { Sfx2, Whooshes } from "./Sound";

const OFF = 0.2;
const V = (t: number) => F(OFF + t);
export const CHALLENGE_FRAMES = F(20.5);
const low: React.CSSProperties = { position: "absolute", left: 40, right: 40, bottom: 400 };

export const AdChallenge: React.FC = () => {
  const cuts = [V(1.28), V(2.3), V(3.56), V(5.9), V(6.64), V(7.6), V(8.3), V(12.78), V(14.3), V(16.06)];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ShakeWrap hits={[V(2.3), V(12.06), V(16.06)]}>
        <Shot clip="dice" at={0} dur={V(1.28)} offset={0.4} rate={0.8} grade="luck" zoom={[1.1, 1.3]} />
        <Shot clip="roulette" at={V(1.28)} dur={V(2.3) - V(1.28)} offset={1.4} grade="luck" enter="whip-l" zoom={[1.25, 1.4]} />
        <Sequence from={V(2.3)} durationInFrames={V(3.56) - V(2.3)}>
          <NeonBg />
          <AbsoluteFill style={{ transform: "translateY(-160px)" }}>
            <Logo3D at={-3} />
          </AbsoluteFill>
        </Sequence>
        <Sequence from={V(3.56)} durationInFrames={V(5.9) - V(3.56)}>
          <NeonBg />
          <PhoneGame len={V(5.9) - V(3.56)} spec={{ ins: "Pick the word printed in its own color", faces: [{ k: "word", v: "RED", ink: "#3D8BFF", size: 0.24 }, { k: "word", v: "BLUE", ink: "#2EE6A8", size: 0.22 }, { k: "word", v: "YELLOW", ink: "#B27CFF", size: 0.17 }, { k: "word", v: "GREEN", ink: "#2EE6A8", size: 0.19 }], ans: 3, flip: 16, me: { pick: 3, at: 52 }, reveal: 56, banner: { title: "+100", tone: "win" } }} />
        </Sequence>
        <Shot clip="tap" at={V(5.9)} dur={V(6.64) - V(5.9)} offset={1.6} grade="skill" enter="zoom" zoom={[1.2, 1.4]} />
        <Shot clip="eye" at={V(6.64)} dur={V(7.6) - V(6.64)} offset={1.0} grade="skill" zoom={[1.2, 1.45]} />
        <Shot clip="focus" at={V(7.6)} dur={V(8.3) - V(7.6)} offset={2.6} grade="skill" zoom={[1.2, 1.35]} />
        <Sequence from={V(8.3)} durationInFrames={V(12.78) - V(8.3)}>
          <NeonBg />
          <AbsoluteFill style={{ transform: "scale(.92) translateY(90px)" }}>
            <Round
              spec={{ ins: "Pick the odd arrow", faces: [{ k: "arrows", dirs: [45] }, { k: "arrows", dirs: [45] }, { k: "arrows", dirs: [45] }, { k: "arrows", dirs: [225] }], ans: 3, flip: V(8.9) - V(8.3), me: { pick: 3, at: V(11.95) - V(8.3) }, reveal: V(12.06) - V(8.3), banner: { title: "+100", tone: "win" }, confetti: 80, timerSecs: 3.2 }}
              feltTop={620}
            />
          </AbsoluteFill>
        </Sequence>
        <Shot clip="roulette" at={V(12.78)} dur={V(14.3) - V(12.78)} offset={2.0} grade="grey" zoom={[1.2, 1.35]} glitch={[0, 20]} />
        <Sequence from={V(14.3)} durationInFrames={V(16.06) - V(14.3)}>
          <WinBurst amount={47.5} under={<Shot clip="win" at={0} dur={V(16.06) - V(14.3)} offset={0.4} grade="skill" zoom={[1.1, 1.25]} />} />
        </Sequence>
        <Sequence from={V(16.06)}>
          <EndCardV2 len={CHALLENGE_FRAMES - V(16.06)} cta="משחק אימון בחינם" />
        </Sequence>
      </ShakeWrap>

      <Sequence durationInFrames={V(2.3)}>
        <LetterBox from={0} to={V(2.3)} size={130} />
        <Dust color="#FFD9A0" count={28} seed="ch" />
      </Sequence>
      <Slam text={"למזל\n*לא אכפת*"} at={V(0)} out={V(1.28) - 2} size={170} hl={K.amber} style={low} />
      <Rise text={"כמה אתה\nטוב."} at={V(1.28)} out={V(2.3) - 2} size={150} style={low} />
      <Slam text={"לנו\n*כן.*"} at={V(2.32)} out={V(3.56) - 2} size={200} style={{ ...low, bottom: 330 }} />
      <Rise text={"כל סיבוב\n*בודק אותך.*"} at={V(4.22)} out={V(5.9) - 2} size={96} style={{ position: "absolute", left: 40, right: 40, top: 110 }} />
      <Plate text="מהירות." at={V(5.9)} out={V(6.64) - 2} size={150} style={low} />
      <Plate text="ריכוז." at={V(6.64)} out={V(7.6) - 2} size={150} rot={3} style={low} />
      <Plate text="החלטה." at={V(7.6)} out={V(8.3) - 2} size={150} style={low} />
      <Rise text={"מצא את\n*החץ השונה.*"} at={V(8.3)} out={V(9.88) - 4} size={92} style={{ position: "absolute", left: 40, right: 40, top: 80 }} />
      <Sequence>
        <Countdown marks={[V(9.88), V(10.68), V(11.28)]} size={200} />
      </Sequence>
      <Slam text="הספקת?" at={V(12.1)} out={V(12.78) - 2} size={170} style={{ position: "absolute", left: 40, right: 40, top: 760 }} />
      <Strike text="להמר על מזל?" at={V(12.78)} strikeAt={V(13.86)} out={V(14.3) - 2} size={120} style={{ position: "absolute", left: 30, right: 30, top: 820 }} />
      <Slam text={"להמר\n*על עצמך.*"} at={V(14.32)} out={V(16.06) - 2} size={150} style={{ position: "absolute", left: 40, right: 40, top: 1230 }} />

      <Sweep at={V(2.3) - 6} />
      <Flash at={V(2.3)} color={K.lime} max={0.6} len={8} />
      <Flare at={V(2.3) + 2} y={800} len={22} width={1.5} />
      <Leak at={V(2.3)} len={20} seed={1} hue={0} max={0.35} />
      <Flash at={V(12.06)} color={K.lime} max={0.5} len={7} />
      <Flash at={V(12.78)} color="#fff" max={0.4} len={4} />
      <Vignette amount={0.7} />
      <Grain opacity={0.08} />

      <Whooshes at={cuts} />
      <Sfx2 at={0} name="hit" volume={0.5} />
      <Sfx2 at={V(2.3)} name="braam" volume={0.6} />
      {[V(5.9), V(6.64), V(7.6)].map((c) => (
        <Sfx2 key={c} at={c} name="hit" volume={0.35} />
      ))}
      <Sfx2 at={V(13.86)} name="swish" volume={0.6} />
      <Sfx2 at={V(14.3)} name="hit" volume={0.5} />
      <Sequence from={V(14.4)}>
        <Audio src={staticFile("sfx/coins.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={V(0)}>
        <Audio src={staticFile("vo2/vE.wav")} volume={1} />
      </Sequence>
      <Audio src={staticFile("music2/challenge.wav")} volume={0.42} />
    </AbsoluteFill>
  );
};

import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { F, K } from "./kit";
import { Shot } from "./Shot";
import { Slam, Plate } from "./Type";
import { Flash, Flare, LetterBox, Vignette, Grain, Shatter, ShakeWrap, Dust } from "./Fx";
import { Cards3D } from "./Three";
import { NeonBg, WinBurst, EndCardV2 } from "./Scenes";
import { Sfx2, Whooshes } from "./Sound";

const OFF = 0.15;
const V = (t: number) => F(OFF + t);
export const SHORT_FRAMES = F(14.0);
const low: React.CSSProperties = { position: "absolute", left: 40, right: 40, bottom: 400 };
const mid: React.CSSProperties = { position: "absolute", left: 40, right: 40, top: 800 };
const grey = { bg: "#a8a39a", ink: "#16130e" };

export const AdShort: React.FC = () => {
  const cuts = [V(0.78), V(1.58), V(2.4), V(3.28), V(4.08), V(4.92), V(5.5), V(6.64), V(7.66), V(8.6), V(9.96)];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ShakeWrap hits={[V(0.78), V(2.4), V(4.08), V(4.92), V(8.6), V(9.96)]} amp={26}>
        <Shot clip="roulette" at={0} dur={V(0.78)} offset={0.3} grade="luck" zoom={[1.2, 1.35]} />
        <Shot clip="roulette" at={V(0.78)} dur={V(1.58) - V(0.78)} offset={2.4} grade="grey" zoom={[1.4, 1.5]} glitch={[0, 10]} />
        <Shot clip="dice" at={V(1.58)} dur={V(2.4) - V(1.58)} offset={0.4} grade="luck" enter="whip-l" zoom={[1.1, 1.3]} />
        <Shot clip="dice" at={V(2.4)} dur={V(3.28) - V(2.4)} offset={3.0} grade="grey" zoom={[1.35, 1.45]} glitch={[0, 12]} />
        <Shot clip="slots" at={V(3.28)} dur={V(4.08) - V(3.28)} offset={0.6} grade="luck" enter="whip-r" zoom={[1.1, 1.3]} />
        <Shot clip="slots" at={V(4.08)} dur={V(4.92) - V(4.08)} offset={2.2} grade="grey" zoom={[1.3, 1.4]} glitch={[0, 10]} />
        <Shot clip="eye" at={V(4.92)} dur={V(5.5) - V(4.92)} offset={0.4} grade="skill" enter="none" zoom={[1.0, 1.25]} />
        <Shot clip="focus" at={V(5.5)} dur={V(6.64) - V(5.5)} offset={1.4} grade="skill" zoom={[1.15, 1.35]} />
        <Sequence from={V(6.64)} durationInFrames={V(7.66) - V(6.64)}>
          <NeonBg />
          <Cards3D labels={["7", "3", "9", "2"]} good={2} flipAt={2} pickAt={18} />
        </Sequence>
        <Shot clip="tap" at={V(7.66)} dur={V(8.6) - V(7.66)} offset={1.0} grade="skill" enter="zoom" zoom={[1.2, 1.45]} />
        <Sequence from={V(8.6)} durationInFrames={V(9.96) - V(8.6)}>
          <WinBurst amount={47.5} under={<Shot clip="win" at={0} dur={V(9.96) - V(8.6)} offset={0.4} grade="skill" zoom={[1.1, 1.25]} />} />
        </Sequence>
        <Sequence from={V(9.96)}>
          <EndCardV2 len={SHORT_FRAMES - V(9.96)} />
        </Sequence>
      </ShakeWrap>

      <Sequence durationInFrames={V(4.92)}>
        <LetterBox from={0} to={V(4.92)} size={120} />
        <Dust color="#FFD9A0" count={30} seed="s" />
      </Sequence>
      <Slam text="רולטה?" at={V(0.0)} out={V(0.78) - 2} size={190} style={low} />
      <Plate text="מזל." at={V(0.78)} out={V(1.58) - 2} size={210} {...grey} style={mid} />
      <Slam text="קוביות?" at={V(1.58)} out={V(2.4) - 2} size={190} style={low} />
      <Plate text="מזל." at={V(2.4)} out={V(3.28) - 2} size={210} rot={4} {...grey} style={mid} />
      <Slam text="מכונות?" at={V(3.28)} out={V(4.08) - 2} size={190} style={low} />
      <Plate text="מזל." at={V(4.08)} out={V(4.92) - 2} size={210} {...grey} style={mid} />
      <Slam text="פה?" at={V(4.92) + 3} out={V(5.5) - 2} size={230} style={low} />
      <Slam text={"*רק\nאתה.*"} at={V(5.5)} out={V(6.64) - 2} size={230} style={low} />
      <Slam text="4 קלפים." at={V(6.64)} out={V(7.66) - 2} size={150} style={{ position: "absolute", left: 40, right: 40, top: 150 }} />
      <Slam text={"שנייה\n*אחת.*"} at={V(7.66)} out={V(8.6) - 2} size={190} style={low} />
      <Slam text={"מי שמהיר\n*לוקח.*"} at={V(8.62)} out={V(9.96) - 2} size={120} style={{ position: "absolute", left: 40, right: 40, top: 300 }} />

      <Sequence from={V(4.92)} durationInFrames={30}>
        <Shatter img="frames/slots.jpg" at={0} filter="grayscale(1) contrast(1.25) brightness(.8)" />
      </Sequence>
      <Flash at={V(4.92)} color={K.lime} max={0.6} len={8} />
      <Flare at={V(4.92) + 2} y={930} len={24} width={1.6} />
      {[V(0.78), V(2.4), V(4.08)].map((c) => (
        <Flash key={c} at={c} color="#fff" max={0.55} len={5} />
      ))}
      <Vignette amount={0.7} />
      <Grain opacity={0.08} />

      <Whooshes at={cuts} />
      <Sfx2 at={0} name="hit" volume={0.5} />
      {[V(0.78), V(2.4), V(4.08)].map((c) => (
        <Sfx2 key={c} at={c} name="hit" volume={0.45} />
      ))}
      <Sfx2 at={V(4.92) - 2} name="glass" volume={0.9} />
      <Sfx2 at={V(8.6)} name="hit" volume={0.5} />
      <Sequence from={V(8.6) + 4}>
        <Audio src={staticFile("sfx/coins.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={V(0)}>
        <Audio src={staticFile("vo2/vB.wav")} volume={1} />
      </Sequence>
      <Audio src={staticFile("music2/short.wav")} volume={0.42} />
    </AbsoluteFill>
  );
};

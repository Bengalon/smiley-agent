import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio, Video } from "@remotion/media";
import { F, K, p01, expoOut } from "./kit";
import { Shot } from "./Shot";
import { Slam, Rise, Plate, Strike, Count } from "./Type";
import { Flash, Flare, Vignette, Grain, Shatter, ShakeWrap, Sweep, Dust, LetterBox } from "./Fx";
import { NeonBg, PhoneGame, EndCardV2 } from "./Scenes";
import { Sfx2, Whooshes } from "./Sound";

const OFF = 0.2;
const V = (t: number) => F(OFF + t);
export const TWO_FRAMES = F(20.5);
const low: React.CSSProperties = { position: "absolute", left: 40, right: 40, bottom: 380 };

/** Luck on top, skill on the bottom, split by a glowing line */
const Split: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const sl = p01(f, 0, 12, expoOut);
  const half = (clip: string, off: number, side: "top" | "bottom", filter: string) => (
    <div style={{ position: "absolute", left: 0, right: 0, height: 960, [side]: 0, overflow: "hidden", transform: `translateY(${(1 - sl) * (side === "top" ? -960 : 960)}px)` }}>
      <div style={{ position: "absolute", left: 0, top: side === "top" ? -330 : -520, width: 1080, height: 1920, transform: `scale(${1.05 + (f / len) * 0.1})`, filter }}>
        <Video src={staticFile(`clips/${clip}.mp4`)} muted trimBefore={Math.round(off * 30)} objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {half("hope", 0.4, "top", "saturate(.8) sepia(.15) contrast(1.1)")}
      {half("focus", 1.0, "bottom", "saturate(1.15) contrast(1.15)")}
      <div style={{ position: "absolute", left: 0, right: 0, top: 952, height: 16, background: K.lime, transform: `scaleX(${sl})`, boxShadow: `0 0 60px ${K.lime}` }} />
    </AbsoluteFill>
  );
};

export const AdTwoPlayers: React.FC = () => {
  const cuts = [V(2.04), V(3.74), V(5.1), V(6.22), V(7.54), V(8.24), V(10.52), V(11.62), V(12.98), V(14.46), V(16.32)];
  const strobe = ["roulette", "dice", "slots", "roulette", "dice", "slots", "roulette", "dice", "slots", "roulette", "dice", "slots", "roulette", "dice", "slots"];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ShakeWrap hits={[V(6.22), V(9.82), V(12.98), V(16.32)]}>
        <Sequence durationInFrames={V(2.04)}>
          <Split len={V(2.04)} />
        </Sequence>
        <Shot clip="roulette" at={V(2.04)} dur={V(3.74) - V(2.04)} offset={0.4} grade="luck" zoom={[1.1, 1.3]} rotate={[2, -2]} />
        <Shot clip="hope" at={V(3.74)} dur={V(5.1) - V(3.74)} offset={2.4} grade="luck" zoom={[1.2, 1.35]} />
        <Shot clip="rake" at={V(5.1)} dur={V(6.22) - V(5.1)} offset={1.0} grade="luck" desat={[0, 0.8]} zoom={[1.1, 1.25]} />
        <Shot clip="eye" at={V(6.22)} dur={V(7.54) - V(6.22)} offset={0.3} grade="skill" enter="none" zoom={[1.0, 1.3]} />
        <Shot clip="focus" at={V(7.54)} dur={V(8.24) - V(7.54)} offset={2.2} grade="skill" zoom={[1.15, 1.3]} />
        <Sequence from={V(8.24)} durationInFrames={V(10.52) - V(8.24)}>
          <NeonBg />
          <PhoneGame len={V(10.52) - V(8.24)} spec={{ ins: "Pick the largest number", faces: [{ k: "num", v: "62" }, { k: "num", v: "92" }, { k: "num", v: "94" }, { k: "num", v: "39" }], ans: 2, flip: V(9.02) - V(8.24), me: { pick: 2, at: V(9.82) - V(8.24) }, reveal: V(9.82) - V(8.24) + 4, banner: { title: "+100", tone: "win" } }} />
        </Sequence>
        <Shot clip="tap" at={V(10.52)} dur={V(11.62) - V(10.52)} offset={2.4} grade="skill" enter="zoom" zoom={[1.2, 1.45]} />
        <Shot clip="defeat" at={V(11.62)} dur={V(12.98) - V(11.62)} offset={1.0} grade="grey" zoom={[1.1, 1.25]} />
        <Shot clip="win" at={V(12.98)} dur={V(14.46) - V(12.98)} offset={0.4} grade="skill" zoom={[1.1, 1.25]} />
        {strobe.map((c, i) => {
          const len = Math.floor((V(16.32) - V(14.46)) / strobe.length);
          return <Shot key={i} clip={c} at={V(14.46) + i * len} dur={i === strobe.length - 1 ? V(16.32) - V(14.46) - i * len : len} offset={1 + (i % 4) * 0.7} grade={i % 3 === 2 ? "luck" : "grey"} punch={false} zoom={[1.3 + (i % 3) * 0.1, 1.35 + (i % 3) * 0.1]} glitch={[0]} />;
        })}
        <Sequence from={V(16.32)}>
          <EndCardV2 len={TWO_FRAMES - V(16.32)} />
        </Sequence>
      </ShakeWrap>

      <Sequence durationInFrames={V(6.22)}>
        <Dust color="#FFD9A0" count={24} seed="tp" />
      </Sequence>
      <Sequence from={V(2.04)} durationInFrames={V(6.22) - V(2.04)}>
        <LetterBox from={0} to={V(6.22) - V(2.04)} size={130} />
      </Sequence>
      <Slam text="2 אנשים." at={V(0)} out={V(1.0) - 2} size={120} style={{ position: "absolute", left: 40, right: 40, top: 880 }} />
      <Plate text="אותו סכום." at={V(1.0)} out={V(2.04) - 2} size={96} style={{ position: "absolute", left: 40, right: 40, top: 890 }} />
      <Rise text={"הראשון מהמר\nעל *רולטה.*"} at={V(2.04)} out={V(3.74) - 2} size={120} hl={K.amber} style={low} />
      <Rise text={"ומחכה\nשהמזל *יחליט.*"} at={V(3.74)} out={V(5.1) - 2} size={120} hl={K.amber} style={low} />
      <Slam text="בשבילו." at={V(5.1)} out={V(6.22) - 2} size={170} style={low} />
      <Slam text={"השני מהמר\n*על עצמו.*"} at={V(6.22)} out={V(8.24) - 2} size={150} style={low} />
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <Plate text="קורא." at={V(8.24)} out={V(10.52) - 2} size={84} rot={-3} />
        <Plate text="מחליט." at={V(9.02)} out={V(10.52) - 2} size={84} rot={2} />
        <Plate text="לוחץ." at={V(9.82)} out={V(10.52) - 2} size={84} rot={-2} />
      </div>
      <Count at={V(10.52)} to={0.42} decimals={2} suffix="s" from={6} len={18} out={V(11.62) - 3} size={230} style={{ position: "absolute", left: 0, right: 0, top: 640 }} />
      <Rise text="בתוך שנייה." at={V(10.6)} out={V(11.62) - 2} size={96} style={{ position: "absolute", left: 40, right: 40, top: 920 }} />
      <Rise text={"הראשון\n*מקווה.*"} at={V(11.62)} out={V(12.98) - 2} size={150} hl={K.muted} style={low} />
      <Slam text={"השני\n*שולט.*"} at={V(12.98)} out={V(14.46) - 2} size={190} style={low} />
      <Strike text="תפסיק לקוות למזל." at={V(14.46)} strikeAt={V(15.42)} out={V(16.32) - 2} size={104} style={{ position: "absolute", left: 30, right: 30, top: 820 }} />

      <Sweep at={V(6.22) - 6} />
      <Flash at={V(6.22)} color={K.lime} max={0.6} len={8} />
      <Flare at={V(6.22) + 2} y={930} len={24} width={1.5} />
      <Sequence from={V(16.32)} durationInFrames={30}>
        <Shatter img="frames/roulette.jpg" at={0} filter="grayscale(1) contrast(1.25) brightness(.8)" />
      </Sequence>
      <Flash at={V(12.98)} color={K.lime} max={0.35} len={6} />
      <Vignette amount={0.7} />
      <Grain opacity={0.08} />

      <Whooshes at={cuts} />
      <Sfx2 at={0} name="hit" volume={0.5} />
      <Sfx2 at={V(1.0)} name="swish" volume={0.6} />
      <Sfx2 at={V(6.22)} name="braam" volume={0.6} />
      {[V(8.24), V(9.02), V(9.82)].map((c) => (
        <Sfx2 key={c} at={c} name="tick" volume={0.9} />
      ))}
      <Sfx2 at={V(12.98)} name="hit" volume={0.5} />
      <Sfx2 at={V(15.42)} name="swish" volume={0.6} />
      <Sfx2 at={V(16.32) - 2} name="glass" volume={0.85} />
      <Sequence from={V(0)}>
        <Audio src={staticFile("vo2/vC.wav")} volume={1} />
      </Sequence>
      <Audio src={staticFile("music2/twoplayers.wav")} volume={0.42} />
    </AbsoluteFill>
  );
};

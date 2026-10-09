import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { F, K } from "./kit";
import { Shot } from "./Shot";
import { Slam, Rise, Plate, Strike } from "./Type";
import { Flash, Leak, Flare, LetterBox, Vignette, Grain, Shatter, ShakeWrap, Dust, Sweep } from "./Fx";
import { Logo3D, Cards3D } from "./Three";
import { NeonBg, PhoneGame, Versus, WinBurst, EndCardV2 } from "./Scenes";
import { Sfx2, Whooshes } from "./Sound";

const OFF = 0.25;
const V = (t: number) => F(OFF + t);
export const MANIFESTO_FRAMES = F(33.5);

const low: React.CSSProperties = { position: "absolute", left: 40, right: 40, bottom: 380 };
const mid: React.CSSProperties = { position: "absolute", left: 40, right: 40, top: 760 };

export const AdManifesto: React.FC = () => {
  const cuts = [V(1.0), V(2.24), V(3.9), V(5.34), V(6.58), V(7.72), V(8.62), V(9.96), V(11.52), V(12.58), V(13.94), V(15.18), V(16.0), V(17.6), V(19.9), V(22.2), V(24.46), V(25.88), V(27.14), V(29.1)];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ShakeWrap hits={[V(7.72), V(9.96), V(15.18), V(25.88), V(29.1)]}>
        {/* ---------------- luck ---------------- */}
        <Shot clip="hope" at={0} dur={V(1.0)} offset={0.4} grade="luck" zoom={[1.15, 1.3]} />
        <Shot clip="roulette" at={V(1.0)} dur={V(2.24) - V(1.0)} offset={0.4} grade="luck" zoom={[1.1, 1.3]} rotate={[0, 3]} />
        <Shot clip="dice" at={V(2.24)} dur={V(3.9) - V(2.24)} offset={0.5} rate={0.8} grade="luck" zoom={[1.05, 1.25]} />
        <Shot clip="roulette" at={V(3.9)} dur={V(5.34) - V(3.9)} offset={2.2} grade="luck" enter="whip-l" zoom={[1.3, 1.45]} rotate={[-4, 2]} />
        <Shot clip="slots" at={V(5.34)} dur={V(6.58) - V(5.34)} offset={1.0} grade="luck" enter="whip-r" zoom={[1.1, 1.25]} />
        <Shot clip="lastchips" at={V(6.58)} dur={V(7.72) - V(6.58)} offset={0.6} grade="luck" zoom={[1.1, 1.22]} />
        <Shot clip="rake" at={V(7.72)} dur={V(8.62) - V(7.72)} offset={1.2} grade="luck" zoom={[1.2, 1.1]} glitch={[2, 14]} />
        <Shot clip="defeat" at={V(8.62)} dur={V(9.96) - V(8.62)} offset={0.6} grade="luck" desat={[0.2, 0.9]} zoom={[1.05, 1.2]} />
        {/* ---------------- self ---------------- */}
        <Shot clip="eye" at={V(9.96)} dur={V(11.52) - V(9.96)} offset={0.3} grade="skill" enter="none" zoom={[1.0, 1.35]} />
        <Shot clip="focus" at={V(11.52)} dur={V(12.58) - V(11.52)} offset={1.6} grade="skill" zoom={[1.12, 1.3]} />
        <Shot clip="tap" at={V(12.58)} dur={V(13.94) - V(12.58)} offset={0.6} grade="skill" enter="whip-l" zoom={[1.1, 1.25]} />
        <Shot clip="tap" at={V(13.94)} dur={V(15.18) - V(13.94)} offset={2.6} grade="skill" enter="zoom" zoom={[1.3, 1.6]} />
        <Sequence from={V(15.18)} durationInFrames={V(16.0) - V(15.18)}>
          <NeonBg />
          <AbsoluteFill style={{ transform: "translateY(-120px)" }}>
            <Logo3D at={-4} />
          </AbsoluteFill>
        </Sequence>
        <Shot clip="roulette" at={V(16.0)} dur={V(16.6) - V(16.0)} offset={3.0} grade="grey" zoom={[1.2, 1.3]} />
        <Shot clip="dice" at={V(16.6)} dur={V(17.6) - V(16.6)} offset={2.5} grade="grey" zoom={[1.2, 1.3]} />
        <Sequence from={V(17.6)} durationInFrames={V(19.9) - V(17.6)}>
          <Versus len={V(19.9) - V(17.6)} />
        </Sequence>
        <Sequence from={V(19.9)} durationInFrames={V(22.2) - V(19.9)}>
          <NeonBg />
          <PhoneGame len={V(22.2) - V(19.9)} spec={{ ins: "Pick the odd arrow", faces: [{ k: "arrows", dirs: [45] }, { k: "arrows", dirs: [45] }, { k: "arrows", dirs: [225] }, { k: "arrows", dirs: [45] }], ans: 2, flip: 16, me: { pick: 2, at: 48 }, reveal: 52, banner: { title: "+100", tone: "win" } }} />
        </Sequence>
        <Sequence from={V(22.2)} durationInFrames={V(24.46) - V(22.2)}>
          <NeonBg />
          <Cards3D labels={["62", "92", "94", "39"]} good={2} flipAt={8} pickAt={V(23.4) - V(22.2)} />
        </Sequence>
        <Shot clip="tap" at={V(24.46)} dur={V(25.88) - V(24.46)} offset={1.4} grade="skill" zoom={[1.15, 1.35]} />
        <Sequence from={V(25.88)} durationInFrames={V(27.14) - V(25.88)}>
          <WinBurst amount={47.5} under={<Shot clip="win" at={0} dur={V(27.14) - V(25.88)} offset={0.6} grade="skill" zoom={[1.1, 1.2]} />} />
        </Sequence>
        <Shot clip="roulette" at={V(27.14)} dur={F(0.5)} offset={1.0} grade="grey" zoom={[1.3, 1.4]} />
        <Shot clip="dice" at={V(27.14) + F(0.5)} dur={F(0.5)} offset={1.5} grade="grey" zoom={[1.3, 1.4]} />
        <Shot clip="slots" at={V(27.14) + F(1.0)} dur={F(0.5)} offset={2.0} grade="grey" zoom={[1.3, 1.4]} />
        <Shot clip="defeat" at={V(27.14) + F(1.5)} dur={V(29.1) - V(27.14) - F(1.5)} offset={2.0} grade="grey" zoom={[1.3, 1.4]} />
        <Sequence from={V(29.1)}>
          <EndCardV2 len={MANIFESTO_FRAMES - V(29.1)} pre="מהיום," />
        </Sequence>
      </ShakeWrap>

      {/* ---------------- type ---------------- */}
      <Sequence durationInFrames={V(9.96)}>
        <LetterBox from={0} to={V(9.96)} size={140} />
        <Dust color="#FFD9A0" count={34} seed="luck" />
      </Sequence>
      <Rise text="כל החיים אמרו לך" at={V(0)} out={V(1.0) - 3} size={96} style={low} />
      <Slam text={"לסמוך\nעל *המזל.*"} at={V(1.06)} out={V(2.24) - 3} hl={K.amber} style={low} />
      <Slam text={"זרקת\nקוביות."} at={V(2.66)} out={V(3.9) - 3} style={mid} />
      <Slam text={"סובבת\nאת הגלגל."} at={V(3.9)} out={V(5.34) - 3} style={low} />
      <Slam text={"משכת\nבידית."} at={V(5.34)} out={V(6.58) - 3} style={low} />
      <Slam text="ומי ניצח?" at={V(6.58)} out={V(7.72) - 3} size={150} style={low} />
      <Plate text="המזל." at={V(7.72)} out={V(8.62) - 3} size={190} bg="#9a958a" ink="#16130e" style={mid} />
      <Rise text={"אף פעם\n*לא אתה.*"} at={V(8.62)} out={V(9.96) - 2} size={150} hl={K.loss} style={low} />

      <Slam text={"ההימור\n*עליך?*"} at={V(10.54)} out={V(11.52) - 3} size={180} style={low} />
      <Slam text={"על הראש\n*שלך.*"} at={V(11.52)} out={V(12.58) - 3} style={low} />
      <Slam text={"על הרפלקסים\n*שלך.*"} at={V(12.58)} out={V(13.94) - 3} size={150} style={low} />
      <Slam text={"על היד\n*שלך.*"} at={V(13.94)} out={V(15.18) - 3} style={low} />
      <Slam text="CLUTCH" at={V(15.3)} out={V(16.0) - 3} size={150} font="Unbounded, sans-serif" style={{ ...low, bottom: 520 }} echo />
      <Strike text="אין גלגל." at={V(16.0)} strikeAt={V(16.2)} out={V(16.6) - 2} size={170} style={mid} />
      <Strike text="אין קוביות." at={V(16.6)} strikeAt={V(16.94)} out={V(17.6) - 3} size={160} style={mid} />
      <Rise text={"יש אותך.\nמול *שחקן אמיתי.*"} at={V(17.62)} out={V(19.9) - 3} size={84} style={{ position: "absolute", left: 40, right: 40, top: 120 }} />
      <Rise text={"אותם סיבובים.\n*אותה שנייה.*"} at={V(19.9)} out={V(22.2) - 3} size={96} style={{ position: "absolute", left: 40, right: 40, top: 110 }} />
      <Slam text="4 קלפים." at={V(22.2)} out={V(23.4) - 2} size={150} style={{ position: "absolute", left: 40, right: 40, top: 150 }} />
      <Slam text="*אחד* נכון." at={V(23.4)} out={V(24.46) - 3} size={150} style={{ position: "absolute", left: 40, right: 40, top: 150 }} />
      <Slam text={"מהיר\n*וצודק.*"} at={V(24.46)} out={V(25.88) - 3} size={170} style={low} />
      <Rise text="לוקח את הקופה." at={V(25.9)} out={V(27.14) - 3} size={96} style={{ position: "absolute", left: 40, right: 40, top: 1300 }} />
      <Rise text={"עד היום הימרת\nעל *המזל.*"} at={V(27.14)} out={V(29.1) - 2} size={120} hl={K.amber} style={low} />

      {/* ---------------- transitions & light ---------------- */}
      <Sequence from={V(9.96)} durationInFrames={30}>
        <Shatter img="frames/defeat.jpg" at={0} filter="saturate(.3) contrast(1.1) brightness(.85)" />
      </Sequence>
      <Flash at={V(9.96)} color={K.lime} max={0.6} len={8} />
      <Flare at={V(9.96) + 2} y={930} color={K.lime} len={24} width={1.6} />
      <Sweep at={V(15.18) - 6} />
      <Leak at={V(15.18)} len={20} seed={1} hue={0} max={0.4} />
      <Flash at={V(7.72)} color="#fff" max={0.5} len={5} />
      <Flare at={V(22.2) + 34} y={980} color={K.lime} len={18} />
      <Leak at={V(25.88)} len={24} seed={7} hue={0} max={0.35} />
      <Flash at={V(27.14)} color="#fff" max={0.4} len={4} />
      {cuts.slice(0, 7).map((c, i) => (
        <Flash key={i} at={c} color="#fff" max={0.18} len={4} />
      ))}
      <Vignette amount={0.7} />
      <Grain opacity={0.08} />

      {/* ---------------- sound ---------------- */}
      <Whooshes at={cuts} />
      <Sfx2 at={0} name="hit" volume={0.55} />
      <Sfx2 at={V(7.72)} name="hit" volume={0.5} />
      <Sfx2 at={V(9.96) - 2} name="glass" volume={0.9} />
      <Sfx2 at={V(9.96)} name="braam" volume={0.7} />
      <Sfx2 at={V(15.18)} name="hit" volume={0.6} />
      <Sfx2 at={V(16.2)} name="swish" volume={0.6} />
      <Sfx2 at={V(16.94)} name="swish" volume={0.6} />
      <Sfx2 at={V(25.88)} name="hit" volume={0.55} />
      <Sequence from={V(25.88) + 4}>
        <Audio src={staticFile("sfx/coins.wav")} volume={0.45} />
      </Sequence>
      <Sequence from={V(0)}>
        <Audio src={staticFile("vo2/vA.wav")} volume={1} />
      </Sequence>
      <Audio src={staticFile("music2/manifesto.wav")} volume={(f) => (f < V(31.3) ? 0.42 : 0.55)} />
    </AbsoluteFill>
  );
};

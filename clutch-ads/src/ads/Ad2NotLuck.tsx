import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C } from "../brand";
import { pop, prog, shake } from "../anim";
import { Backdrop, Grain } from "../components/Backdrop";
import { ChipBurst, DiceTumble, Roulette } from "../components/Scenes3D";
import { LogoTile, Wordmark } from "../components/Logo";
import { HeTitle } from "../components/Text";
import { Flash, Shockwave } from "../components/Effects";
import { GameScene, CLASSIC } from "../components/GameScene";
import { nums } from "../components/Round";
import { Captions, EndCard, VSScreen, WinScreen } from "../components/Screens";
import { Extruded } from "../components/Text";
import { Glitch, SameRound, SlotReels } from "../components/Extras";
import { Cut } from "../components/Transitions";
import { Sfx } from "../components/Sfx";
import { MusicBed, VoLine, VoiceTrack, caps } from "../components/Voice";

export const AD2_FRAMES = 1080; // 36 s at 120 BPM (18 bars)
const F = (sec: number) => Math.round(sec * 30);

const VO: VoLine[] = [
  { file: "ad2_s1", at: 0.5, dur: 3.158 },
  { file: "ad2_s2", at: 4.3, dur: 4.098 },
  { file: "ad2_s3", at: 8.9, dur: 2.495 },
  { file: "ad2_s4", at: 12.4, dur: 3.958 },
  { file: "ad2_s5", at: 16.7, dur: 6.358 },
  { file: "ad2_s6", at: 23.4, dur: 6.74 },
  { file: "ad2_s7", at: 30.2, dur: 1.835 },
  { file: "ad2_s8", at: 32.9, dur: 2.48 },
];

const CAPS = [
  ...caps(VO[1], [[0, "בכל ההימורים האלה,"], [1.36, "יש רק מי שקובע."]]).slice(0, 2).map(([a, b, t], i) => [a, i === 1 ? Math.round((VO[1].at + 3.2) * 30) : b, t] as [number, number, string]),
  ...caps(VO[3], [[1.7, "רק אתה, מול *שחקן אמיתי.*"]]),
  ...caps(VO[4], [[0, "אותם סיבובים,"], [1.2, "באותו רגע *בדיוק.*"], [3.26, "ארבעה קלפים מתהפכים,"], [4.9, "ורק *אחד* נכון."]]),
  ...caps(VO[5], [[0, "מי *שמהיר וצודק,*"], [1.44, "לוקח את הנקודות."], [3.1, "ובסיבובי ה-Clutch בסוף?"]]),
];

/** Grey "luck" world: roulette, slots, dice */
const Luck: React.FC = () => {
  const f = useCurrentFrame();
  const word = (t: string, a: number, b: number) =>
    f >= F(a) && f < F(b) ? (
      <div style={{ position: "absolute", top: 230, left: 0, right: 0 }}>
        <HeTitle text={t} at={F(a)} size={150} color="#C9C7D6" glow={false} stagger={0} />
      </div>
    ) : null;
  return (
    <Glitch a={F(4.1)} b={F(4.3)}>
      <AbsoluteFill style={{ filter: "grayscale(1) contrast(1.05) brightness(.9)" }}>
        <Backdrop hue="grey" grid={false} />
        {f < F(1.55) && <Roulette at={0} />}
        {f >= F(1.55) && f < F(2.85) && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `scale(${1.3 + prog(f, F(1.55), F(2.85)) * 0.12})` }}>
              <SlotReels at={F(1.55)} stops={[18, 26, 34]} />
            </div>
          </AbsoluteFill>
        )}
        {f >= F(2.85) && <DiceTumble at={F(2.85)} />}
      </AbsoluteFill>
      {word("רולטה.", 0.5, 1.55)}
      {word("מכונות מזל.", 1.55, 2.85)}
      {word("קוביות.", 2.85, 4.3)}
    </Glitch>
  );
};

/** Who decides? A grey wall of luck, then the word luck glitching */
const WhoDecides: React.FC = () => {
  const f = useCurrentFrame();
  const end = F(8.4) - F(4.3);
  return (
    <Glitch a={F(7.5) - F(4.3)} b={F(7.75) - F(4.3)} amp={40}>
      <AbsoluteFill style={{ filter: "grayscale(1)" }}>
        <Backdrop hue="grey" grid={false} />
        <AbsoluteFill style={{ opacity: 0.45, transform: `scale(${1.1 - prog(f, 0, end) * 0.1})` }}>
          <Roulette at={-90} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {f >= F(3.24) ? (
          <div style={{ transform: `scale(${1 + prog(f, F(3.24), end) * 0.12})` }}>
            <HeTitle text="המזל." at={F(3.24)} size={300} color="#8E8C99" stagger={0} glow={false} />
          </div>
        ) : (
          <HeTitle text={"מי\nקובע?"} at={F(1.3)} size={220} color="#C9C7D6" glow={false} />
        )}
      </AbsoluteFill>
    </Glitch>
  );
};

/** Black, then: what if YOU decide? */
const YouDecide: React.FC = () => {
  const f = useCurrentFrame();
  const t2 = F(1.46) + F(0.0);
  return (
    <AbsoluteFill style={{ background: "#050409" }}>
      <AbsoluteFill style={{ background: `radial-gradient(50% 30% at 50% 50%, rgba(198,255,51,${0.25 * prog(f, t2, t2 + 40)}), transparent 70%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <HeTitle text="אבל מה אם הפעם..." at={8} size={92} weight={700} color="#CFCDE0" />
        {f >= t2 && <HeTitle text={"*אתה*\nקובע?"} at={t2} size={240} stagger={6} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Drop: React.FC = () => {
  const f = useCurrentFrame();
  const sh = shake(f, 0, 30, 18, "d2");
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px,${sh.y}px)` }}>
      <Backdrop />
      <ChipBurst at={0} />
      <Shockwave x={540} y={860} at={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ transform: `scale(${3 - 2 * pop(f, 0, 10, 220)})` }}>
          <LogoTile size={220} glow={1.4} />
        </div>
        <div style={{ opacity: prog(f, 4, 10) }}>
          <Wordmark size={130} />
        </div>
        <div style={{ marginTop: 30 }}>
          <HeTitle text="*אין מזל.*" at={F(1.06) + F(12.4) - F(12.0)} size={130} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Multipliers: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    { m: 2, at: F(27.6) - F(26.6) },
    { m: 3, at: F(28.3) - F(26.6) },
    { m: 4, at: F(29.0) - F(26.6) },
  ];
  const cur = [...items].reverse().find((x) => f >= x.at);
  return (
    <AbsoluteFill>
      <Backdrop hue="heat" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60 }}>
        <HeTitle text="סיבובי *הקלאץ'*" at={2} size={100} />
        {cur && (
          <div key={cur.m} style={{ transform: `scale(${2.2 - 1.2 * pop(f, cur.at, 11, 230)})` }}>
            <Extruded text={`×${cur.m}`} size={400} tiltX={10} tiltY={Math.sin(f / 10) * 10} />
          </div>
        )}
        {f >= F(28.88) - F(26.6) && <HeTitle text="הכל *מוכפל.*" at={F(28.88) - F(26.6)} size={110} />}
      </AbsoluteFill>
      {items.map((x) => (
        <React.Fragment key={x.m}>
          <Flash at={x.at} color="#FF7A3D" max={0.4} len={6} />
          <Sfx at={x.at} name="impact" volume={0.55} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

export const Ad2NotLuck: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Cut from={0} dur={F(4.3)} punch={false} name="Luck">
      <Luck />
    </Cut>
    <Cut from={F(4.3)} dur={F(8.4) - F(4.3)} punch={false} name="Who decides">
      <WhoDecides />
    </Cut>
    <Cut from={F(8.4)} dur={F(12.0) - F(8.4)} punch={false} name="You decide">
      <YouDecide />
    </Cut>
    <Cut from={F(12.0)} dur={F(14.2) - F(12.0)} name="Drop">
      <Drop />
    </Cut>
    <Cut from={F(14.2)} dur={F(16.6) - F(14.2)} name="Real player">
      <AbsoluteFill>
        <Backdrop />
        <VSScreen hideCount line={<span>Real players. Same stake. <b style={{ color: C.lime }}>Winner takes the pot.</b></span>} />
      </AbsoluteFill>
    </Cut>
    <Cut from={F(16.6)} dur={F(19.9) - F(16.6)} name="Same round">
      <AbsoluteFill>
        <Backdrop />
        <SameRound spec={{ ins: "Pick the odd shape", faces: [{ k: "shape", s: "circle", color: C.blue }, { k: "shape", s: "circle", color: C.blue }, { k: "shape", s: "circle", color: C.blue }, { k: "shape", s: "square", color: C.blue }], ans: 3, flip: 30, reveal: 10000 }} />
        <div style={{ position: "absolute", top: 120, left: 0, right: 0 }}>
          <HeTitle text={"אותם סיבובים.\n*אותו רגע.*"} at={6} size={84} />
        </div>
      </AbsoluteFill>
    </Cut>
    <Cut from={F(19.9)} dur={F(26.6) - F(19.9)} name="Round">
      <GameScene
        spec={{
          ins: "Pick the largest number",
          he: "בחר את המספר הגדול",
          faces: nums(318, 381, 813, 183),
          ans: 2,
          flip: F(20.82) - F(19.9),
          me: { pick: 2, at: F(22.3) - F(19.9) },
          opp: { pick: 2, at: F(22.68) - F(19.9) },
          reveal: F(22.7) - F(19.9),
          banner: { title: "+100", sub: "You were faster by 0.38 s. mira.v +62", tone: "win" },
        }}
        before={{ me: 340, opp: 296 }}
        after={{ me: 440, opp: 358 }}
        roundNo={5}
        of={10}
        history={["won", "lost", "won", "won"]}
        ladder={CLASSIC}
        feltTop={600}
        scale={0.86}
      />
    </Cut>
    <Cut from={F(26.6)} dur={F(30.0) - F(26.6)} name="Multipliers">
      <Multipliers />
    </Cut>
    <Cut from={F(30.0)} dur={F(32.4) - F(30.0)} name="Win">
      <WinScreen amount={19} score="Classic, $10 stake." he="המנצח לוקח *את הקופה.*" />
    </Cut>
    <Cut from={F(32.4)} dur={AD2_FRAMES - F(32.4)} name="End card">
      <EndCard />
    </Cut>
    <Captions items={CAPS} y={1640} />
    <Grain />
    <Sequence layout="none">
      <Sfx at={F(0.4)} name="ding" volume={0.35} />
      <Sfx at={F(1.5)} name="slot-spin" volume={0.6} />
      <Sfx at={F(2.8)} name="rm-whip" volume={0.5} />
      <Sfx at={F(4.1)} name="glitch" volume={0.5} />
      <Sfx at={F(7.5)} name="glitch" volume={0.6} />
      <Sfx at={F(8.3)} name="tape-stop" volume={0.7} />
      <Sfx at={F(12.0)} name="impact-big" volume={0.7} />
      <Sfx at={F(14.2) - 3} name="whoosh" volume={0.5} />
      <Sfx at={F(14.4)} name="match" volume={0.5} />
      <Sfx at={F(16.6) - 3} name="whoosh" volume={0.5} />
      <Sfx at={F(19.9) - 3} name="whoosh-short" volume={0.4} />
      <Sfx at={F(26.6) - 3} name="whoosh" volume={0.5} />
    </Sequence>
    <VoiceTrack lines={VO} />
    <MusicBed file="ad2" lines={VO} base={0.48} low={0.18} />
  </AbsoluteFill>
);

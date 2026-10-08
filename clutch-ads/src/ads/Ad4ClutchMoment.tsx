import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, display, sans } from "../brand";
import { lerp, prog, shake } from "../anim";
import { Backdrop, Grain } from "../components/Backdrop";
import { HeTitle, Slam } from "../components/Text";
import { HUD } from "../components/HUD";
import { GameScene, CLASSIC } from "../components/GameScene";
import { RoundSpec, nums } from "../components/Round";
import { Captions, EndCard, Takeover, VSScreen, WinScreen } from "../components/Screens";
import { Confetti, Flash, Shockwave } from "../components/Effects";
import { Cut, Push } from "../components/Transitions";
import { Sfx } from "../components/Sfx";
import { MusicBed, VoLine, VoiceTrack, caps } from "../components/Voice";
import { TrackSeg } from "../components/HUD";

export const AD4_FRAMES = 1680; // 56 s at 120 BPM
const F = (sec: number) => Math.round(sec * 30);

const VO: VoLine[] = [
  { file: "ad4_s1", at: 0.8, dur: 3.819 },
  { file: "ad4_s2", at: 5.2, dur: 4.113 },
  { file: "ad4_s3", at: 10.2, dur: 0.967 },
  { file: "ad4_s4", at: 13.6, dur: 3.359 },
  { file: "ad4_s5", at: 23.6, dur: 3.684 },
  { file: "ad4_s6", at: 28.3, dur: 1.714 },
  { file: "ad4_s7", at: 30.6, dur: 3.439 },
  { file: "ad4_s8", at: 36.4, dur: 4.607 },
  { file: "ad4_s9", at: 44.1, dur: 0.786 },
  { file: "ad4_s10", at: 46.4, dur: 3.829 },
  { file: "ad4_s11", at: 51.0, dur: 2.339 },
];

const CAPS_VS = [
  ...caps(VO[0], [[0, "*עשר שניות.*"], [0.96, "זה כל מה שיש לך,"], [2.72, "לפני שזה מתחיל."]]),
  ...caps(VO[1], [[0, "מולך, *שחקנית אמיתית.*"], [2.06, "*25 דולר* כל אחד."]]),
];
const CAPS = [
  ...caps(VO[2], [[0, "סיבוב ראשון."]]),
  ...caps(VO[3], [[0, "אתה מהיר."], [0.94, "אבל היא... *מהירה יותר.*"]]),
  ...caps(VO[9], [[0, "*47.5 דולר.*"], [1.84, "בלי מזל."], [3.04, "*רק אתה.*"]]),
];

type R = { spec: RoundSpec; before: [number, number]; after: [number, number]; res: TrackSeg };
const H0: TrackSeg[] = ["won", "lost", "won", "lost", "lost", "won", "won", "lost", "won"];

const MONTAGE: R[] = [
  { spec: { ins: "Pick the even number", faces: nums(37, 51, 84, 99), ans: 2, flip: 6, me: { pick: 2, at: 16 }, opp: { pick: 2, at: 22 }, reveal: 19, banner: { title: "+100", tone: "win" } }, before: [162, 154], after: [262, 225], res: "won" },
  { spec: { ins: "Pick the odd suit", faces: [{ k: "pc", rank: "9", suit: "♠" }, { k: "pc", rank: "7", suit: "♠" }, { k: "pc", rank: "5", suit: "♣" }, { k: "pc", rank: "8", suit: "♠" }], ans: 2, flip: 6, me: { pick: 0, at: 14 }, opp: { pick: 2, at: 18 }, reveal: 19, banner: { title: "−100", tone: "lose" } }, before: [262, 225], after: [162, 325], res: "lost" },
  { spec: { ins: "Pick the 5", faces: [{ k: "die", n: 3 }, { k: "die", n: 5 }, { k: "die", n: 4 }, { k: "die", n: 1 }], ans: 1, flip: 6, me: { pick: 1, at: 18 }, opp: { pick: 1, at: 13 }, reveal: 19, banner: { title: "+78", tone: "neutral" } }, before: [162, 325], after: [240, 425], res: "lost" },
  { spec: { ins: "Pick the correct sum", faces: [{ k: "eq", v: "12+17=39" }, { k: "eq", v: "15+17=31" }, { k: "eq", v: "12+15=27" }, { k: "eq", v: "16+3=29" }], ans: 2, flip: 6, me: { pick: 2, at: 15 }, opp: { pick: 2, at: 20 }, reveal: 19, banner: { title: "+100", tone: "win" } }, before: [240, 425], after: [340, 510], res: "won" },
  { spec: { ins: "Pick the hollow shape", faces: [{ k: "shape", s: "circle", color: C.red }, { k: "shape", s: "square", color: C.blue }, { k: "shape", s: "triangle", color: C.yellow, hollow: true }, { k: "shape", s: "star", color: C.green }], ans: 2, flip: 6, me: { pick: 2, at: 14 }, opp: { pick: 2, at: 29 }, reveal: 19, banner: { title: "+100", tone: "win" } }, before: [340, 510], after: [440, 560], res: "won" },
  { spec: { ins: "Pick the prime number", faces: nums(21, 33, 17, 49), ans: 2, flip: 6, me: { pick: 2, at: 18 }, opp: { pick: 2, at: 14 }, reveal: 19, banner: { title: "+80", tone: "neutral" } }, before: [440, 560], after: [520, 660], res: "lost" },
];

const Behind: React.FC = () => {
  const f = useCurrentFrame();
  const slam = F(26.24) - F(23.4);
  return (
    <Push dur={F(4.6)} amount={0.08}>
      <Backdrop hue="heat" intensity={0.7} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
        <div style={{ transform: "scale(1.0)" }}>
          <HUD me={520} opp={660} round="Round 8 of 10" pill="Up to 100" track={CLASSIC.map((m, i) => ({ s: i < 8 ? H0[i] : "todo", mult: m }))} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <HeTitle text="שמונה סיבובים." at={4} size={110} weight={800} />
        {f >= slam - 10 && <HeTitle text="אתה בפיגור של" at={slam - 10} size={80} weight={700} color="#FFD7C8" />}
        <Slam text="−140" at={slam} size={300} color={C.loss} />
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: "#FFB3A6", opacity: prog(f, slam + 8, slam + 18) }}>You're behind by 140</div>
      </AbsoluteFill>
      <Flash at={slam} color={C.loss} max={0.25} />
      <Sfx at={slam} name="roundlose" volume={0.8} />
      <Sfx at={slam} name="impact" volume={0.5} />
    </Push>
  );
};

const Calm: React.FC = () => {
  const f = useCurrentFrame();
  const beat = (f % 22) / 22;
  return (
    <AbsoluteFill style={{ background: "#050409" }}>
      <AbsoluteFill style={{ background: `radial-gradient(40% 25% at 50% 50%, rgba(255,77,46,${0.18 + 0.12 * Math.exp(-beat * 6)}), transparent 70%)` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <HeTitle text={"ואז...\n*זה מגיע.*"} at={8} size={150} stagger={8} />
      </AbsoluteFill>
      <Sfx at={0} name="heartbeat" volume={0.9} />
      <Sfx at={22} name="heartbeat" volume={0.9} />
      <Sfx at={44} name="heartbeat" volume={0.95} />
    </AbsoluteFill>
  );
};

/** The final round, with a slow push while the timer drains and a big hit on the reveal */
const Final: React.FC = () => {
  const f = useCurrentFrame();
  const spec: RoundSpec = {
    ins: "Pick the word printed in its own color",
    he: "המילה שצבועה בצבע של עצמה",
    faces: [
      { k: "word", v: "BLUE", ink: C.yellow, size: 0.22 },
      { k: "word", v: "GREEN", ink: C.red, size: 0.19 },
      { k: "word", v: "PURPLE", ink: C.purple, size: 0.16 },
      { k: "word", v: "RED", ink: C.green, size: 0.24 },
    ],
    ans: 2,
    flip: 36,
    me: { pick: 2, at: 75 },
    opp: { pick: 2, at: 87 },
    reveal: 90,
    banner: { title: "+300", sub: "You were faster by 0.40 s. mira.v +180", tone: "win" },
    confetti: 120,
    timerSecs: 2.4,
  };
  const zoom = f < 90 ? lerp(f, [36, 88], [1, 1.12], (t) => t * t) : lerp(f, [90, 100], [1.12, 1]);
  const sh = shake(f, 90, 34, 20, "fin");
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translate(${sh.x}px, ${sh.y}px)` }}>
        <GameScene spec={spec} before={{ me: 720, opp: 790 }} after={{ me: 1020, opp: 970 }} roundNo={10} of={10} mult={3} history={H0} ladder={CLASSIC} feltTop={600} scale={0.9} />
      </AbsoluteFill>
      <Shockwave x={540} y={1000} at={90} />
      <Flash at={90} color={C.lime} max={0.45} len={10} />
      <Confetti x={540} y={1100} at={92} count={110} power={1.4} seed="fin2" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Slam text="CLUTCH!" at={93} size={190} out={140} />
      </AbsoluteFill>
      <Sfx at={44} name="heartbeat" volume={0.9} />
      <Sfx at={60} name="heartbeat" volume={0.95} />
      <Sfx at={74} name="heartbeat" volume={1} />
      <Sfx at={90} name="impact-big" volume={0.8} />
    </AbsoluteFill>
  );
};

export const Ad4ClutchMoment: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Cut from={0} dur={F(10.0)} punch={false} name="VS countdown">
      <Push dur={F(10)} amount={0.08}>
        <Backdrop />
        <VSScreen count={10} tickEvery={30} countStart={0} line={<span>Classic, 10 rounds. <b style={{ color: C.text }}>$25</b> each, winner gets <b style={{ color: C.lime }}>$47.50</b>.</span>} />
      </Push>
      <Captions items={CAPS_VS} y={1690} />
    </Cut>
    <Cut from={F(10.0)} dur={F(13.4) - F(10.0)} name="Round 1">
      <GameScene
        spec={{ ins: "Pick the odd arrow", he: "בחר את החץ השונה", faces: [{ k: "arrows", dirs: [315] }, { k: "arrows", dirs: [315] }, { k: "arrows", dirs: [135] }, { k: "arrows", dirs: [315] }], ans: 2, flip: 30, me: { pick: 2, at: 60 }, opp: { pick: 2, at: 74 }, reveal: 75, banner: { title: "+100", sub: "You were faster by 0.46 s. mira.v +54", tone: "win" } }}
        before={{ me: 0, opp: 0 }}
        after={{ me: 100, opp: 54 }}
        roundNo={1}
        of={10}
        history={[]}
        ladder={CLASSIC}
        feltTop={600}
        scale={0.86}
      />
    </Cut>
    <Cut from={F(13.4)} dur={F(17.4) - F(13.4)} name="Round 2">
      <GameScene
        spec={{ ins: "Pick the number ending in 9", he: "בחר את המספר שנגמר ב-9", faces: nums(62, 92, 94, 39), ans: 3, flip: 30, opp: { pick: 3, at: 51 }, me: { pick: 3, at: 62 }, reveal: 64, banner: { title: "+62", sub: "0.38 s slower than mira.v", tone: "neutral" } }}
        before={{ me: 100, opp: 54 }}
        after={{ me: 162, opp: 154 }}
        roundNo={2}
        of={10}
        history={["won"]}
        ladder={CLASSIC}
        feltTop={600}
        scale={0.86}
      />
    </Cut>
    {MONTAGE.map((r, i) => (
      <Cut key={i} from={F(17.4) + i * 30} dur={30} name={`Round ${i + 3}`} zoom={1.1}>
        <GameScene spec={r.spec} before={{ me: r.before[0], opp: r.before[1] }} after={{ me: r.after[0], opp: r.after[1] }} roundNo={i + 3} of={10} history={H0} ladder={CLASSIC} feltTop={600} scale={0.86} />
        <Sfx at={0} name="whoosh-short" volume={0.35} />
      </Cut>
    ))}
    <Cut from={F(23.4)} dur={F(28.0) - F(23.4)} name="Behind">
      <Behind />
    </Cut>
    <Cut from={F(28.0)} dur={F(30.0) - F(28.0)} punch={false} name="Then it comes">
      <Calm />
    </Cut>
    <Cut from={F(30.0)} dur={F(33.0) - F(30.0)} punch={false} name="Clutch x2">
      <Takeover label="Clutch round" mult={2} sub="Up to 200 points, and a wrong tap costs 200. You're behind by 140." he="סיבוב קלאץ'. *הלב דופק.*" len={F(3.0)} />
    </Cut>
    <Cut from={F(33.0)} dur={F(36.0) - F(33.0)} name="Round 9">
      <GameScene
        spec={{ ins: "Pick the largest number", he: "בחר את המספר הגדול", faces: nums(318, 381, 813, 183), ans: 2, flip: 24, me: { pick: 2, at: 48 }, opp: { pick: 2, at: 58 }, reveal: 60, banner: { title: "+200", sub: "You were faster by 0.35 s. mira.v +130", tone: "win" } }}
        before={{ me: 520, opp: 660 }}
        after={{ me: 720, opp: 790 }}
        roundNo={9}
        of={10}
        mult={2}
        history={H0}
        ladder={CLASSIC}
        feltTop={600}
        scale={0.86}
      />
    </Cut>
    <Cut from={F(36.0)} dur={F(41.0) - F(36.0)} punch={false} name="Final x3">
      <Takeover label="Final round" mult={3} sub="Up to 300 points, and a wrong tap costs 300. You're behind by 70." he="סיבוב אחרון. *פי 3.*" len={F(5.0)} />
    </Cut>
    <Cut from={F(41.0)} dur={F(46.0) - F(41.0)} name="Final round">
      <Final />
    </Cut>
    <Cut from={F(46.0)} dur={F(50.0) - F(46.0)} name="Win">
      <WinScreen amount={47.5} score="1,020 to 970 against mira.v." />
    </Cut>
    <Cut from={F(50.0)} dur={AD4_FRAMES - F(50.0)} name="End card">
      <EndCard />
    </Cut>
    <Captions items={CAPS} y={1680} />
    <Grain />
    <Sequence layout="none">
      <Sfx at={F(10.0)} name="impact" volume={0.6} />
      <Sfx at={F(13.4) - 3} name="whoosh-short" volume={0.4} />
      <Sfx at={F(23.4) - 3} name="whoosh" volume={0.5} />
      <Sfx at={F(33.0) - 3} name="whoosh-short" volume={0.4} />
      <Sfx at={F(41.0) - 3} name="whoosh-short" volume={0.4} />
    </Sequence>
    <VoiceTrack lines={VO} />
    <MusicBed file="ad4" lines={VO} base={0.48} low={0.19} />
  </AbsoluteFill>
);

export { display };

import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C } from "../brand";
import { pop, prog, shake } from "../anim";
import { Backdrop, Grain } from "../components/Backdrop";
import { ChipBurst, HeroTower } from "../components/Scenes3D";
import { LogoTile, Wordmark } from "../components/Logo";
import { HeTitle } from "../components/Text";
import { Flash, Shockwave } from "../components/Effects";
import { GameScene, CLASSIC } from "../components/GameScene";
import { nums } from "../components/Round";
import { EndCard, Takeover, WinScreen } from "../components/Screens";
import { Cut } from "../components/Transitions";
import { Sfx } from "../components/Sfx";

// 128 BPM: one beat = 14.0625 frames, one bar = 56.25 frames. 8 bars = 15 s.
const B = (beat: number) => Math.round(beat * 14.0625);
export const AD1_FRAMES = 450;

const Opener: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 2, 10, 220);
  const sh = shake(f, 2, 26, 16, "op");
  const wordA = f >= B(1) && f < B(2);
  const wordB = f >= B(2) && f < B(4);
  return (
    <AbsoluteFill style={{ transform: `translate(${sh.x}px, ${sh.y}px)` }}>
      <Backdrop />
      <ChipBurst at={2} />
      <Shockwave x={540} y={900} at={2} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, opacity: 1 - prog(f, B(1) - 3, B(1)) }}>
        <div style={{ transform: `scale(${3 - 2 * logo}) rotate(${(1 - logo) * 90}deg)` }}>
          <LogoTile size={260} glow={1.4} />
        </div>
        <div style={{ opacity: prog(f, 6, 12) }}>
          <Wordmark size={120} />
        </div>
      </AbsoluteFill>
      {wordA && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <HeTitle text="תחשוב." at={B(1)} size={260} stagger={0} />
        </AbsoluteFill>
      )}
      {wordB && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <HeTitle text="*תגיב.*" at={B(2)} size={300} stagger={0} />
        </AbsoluteFill>
      )}
      <Flash at={B(1)} len={5} max={0.4} />
      <Flash at={B(2)} len={5} max={0.5} color={C.lime} />
    </AbsoluteFill>
  );
};

const Pot: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop hue="lime" />
      <AbsoluteFill style={{ transform: `translateY(${180 - prog(f, 0, 50) * 60}px) scale(1.15)` }}>
        <HeroTower at={-6} spin={0.03} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
        <HeTitle text={"תיקח את\n*הקופה.*"} at={1} size={190} stagger={4} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Ad1Hype: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Cut from={0} dur={B(4)} punch={false} name="Opener">
      <Opener />
    </Cut>
    <Cut from={B(4)} dur={B(8) - B(4)} name="Take the pot">
      <Pot />
    </Cut>
    <Cut from={B(8)} dur={B(12) - B(8)} name="Round 7">
      <GameScene
        spec={{ ins: "Pick the largest number", he: "בחר את המספר הגדול", faces: nums(62, 92, 94, 39), ans: 2, flip: 12, me: { pick: 2, at: 27 }, opp: { pick: 2, at: 36 }, reveal: 37, banner: { title: "+100", sub: "You were faster by 0.31 s", tone: "win" } }}
        before={{ me: 480, opp: 455 }}
        after={{ me: 580, opp: 524 }}
        roundNo={7}
        of={10}
        history={["won", "won", "lost", "won", "won", "lost"]}
        ladder={CLASSIC}
      />
    </Cut>
    <Cut from={B(12)} dur={B(16) - B(12)} name="Round 8">
      <GameScene
        spec={{ ins: "Pick the odd arrow", he: "בחר את החץ השונה", faces: [{ k: "arrows", dirs: [90] }, { k: "arrows", dirs: [90] }, { k: "arrows", dirs: [270] }, { k: "arrows", dirs: [90] }], ans: 2, flip: 10, me: { pick: 2, at: 24 }, opp: { pick: 2, at: 33 }, reveal: 34, banner: { title: "+100", sub: "2 in a row", tone: "win" } }}
        before={{ me: 580, opp: 524 }}
        after={{ me: 680, opp: 594 }}
        roundNo={8}
        of={10}
        history={["won", "won", "lost", "won", "won", "lost", "won"]}
        ladder={CLASSIC}
      />
      <Sfx at={38} name="streak" volume={0.7} />
    </Cut>
    <Cut from={B(16)} dur={B(20) - B(16)} name="Final round takeover" flash={false}>
      <Takeover label="Final round" mult={3} sub="Up to 300 points, and a wrong tap costs 300." he="הסיבוב האחרון. *פי 3.*" len={B(20) - B(16)} />
    </Cut>
    <Cut from={B(20)} dur={B(24) - B(20)} name="Final round">
      <GameScene
        spec={{ ins: "Pick the smallest fraction", he: "בחר את השבר הקטן", faces: [{ k: "frac", a: 1, b: 5 }, { k: "frac", a: 5, b: 6 }, { k: "frac", a: 3, b: 8 }, { k: "frac", a: 1, b: 2 }], ans: 0, flip: 10, me: { pick: 0, at: 26 }, opp: { pick: 0, at: 38 }, reveal: 39, banner: { title: "+300", sub: "You were faster by 0.42 s", tone: "win" }, confetti: 90 }}
        before={{ me: 680, opp: 790 }}
        after={{ me: 980, opp: 964 }}
        roundNo={10}
        of={10}
        mult={3}
        history={["won", "won", "lost", "won", "won", "lost", "won", "won", "lost"]}
        ladder={CLASSIC}
      />
      <Sfx at={39} name="impact" volume={0.7} />
    </Cut>
    <Cut from={B(24)} dur={B(28) - B(24)} name="Win">
      <WinScreen amount={95} score="980 to 964 against mira.v." />
    </Cut>
    <Cut from={B(28)} dur={AD1_FRAMES - B(28)} name="End card">
      <EndCard />
    </Cut>
    <Grain />
    <Sequence layout="none">
      <Sfx at={0} name="whoosh-rev" volume={0.5} />
      <Sfx at={2} name="impact-big" volume={0.6} />
      {[B(4), B(8), B(12), B(20), B(24)].map((at, i) => (
        <Sfx key={i} at={at - 3} name="whoosh-short" volume={0.45} />
      ))}
    </Sequence>
    <Audio src={staticFile("music/ad1.wav")} volume={0.42} />
  </AbsoluteFill>
);

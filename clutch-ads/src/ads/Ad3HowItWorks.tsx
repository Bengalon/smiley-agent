import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, display, heb, sans } from "../brand";
import { lerp, pop, prog } from "../anim";
import { Backdrop, Grain } from "../components/Backdrop";
import { HeroTower } from "../components/Scenes3D";
import { Extruded, HeTitle, Slam } from "../components/Text";
import { Avatar } from "../components/HUD";
import { GameCard } from "../components/GameCard";
import { FaceView } from "../components/faces";
import { GameScene, CLASSIC } from "../components/GameScene";
import { nums } from "../components/Round";
import { Captions, EndCard, WinScreen } from "../components/Screens";
import { DuelCard, Ladder, PotSplit, RoundWall } from "../components/Extras";
import { Flash, HeatVignette } from "../components/Effects";
import { Cut } from "../components/Transitions";
import { Sfx } from "../components/Sfx";
import { MusicBed, VoLine, VoiceTrack, caps } from "../components/Voice";

export const AD3_FRAMES = 1620; // 54 s at 120 BPM
const F = (sec: number) => Math.round(sec * 30);

const VO: VoLine[] = [
  { file: "ad3_s1", at: 0.4, dur: 3.113 },
  { file: "ad3_s2", at: 4.2, dur: 6.691 },
  { file: "ad3_s3", at: 11.6, dur: 5.494 },
  { file: "ad3_s4", at: 17.4, dur: 4.328 },
  { file: "ad3_s5", at: 22.2, dur: 7.404 },
  { file: "ad3_s6", at: 30.0, dur: 7.909 },
  { file: "ad3_s7", at: 38.4, dur: 7.539 },
  { file: "ad3_s8", at: 46.4, dur: 5.392 },
];

const CAPS = [
  ...caps(VO[1], [[2.1, "שני שחקנים, אותו סכום."], [4.42, "נגיד, *עשרה דולר* כל אחד."]]),
  ...caps(VO[2], [[0.88, "קוראים את ההוראה,"], [2.28, "ארבעה קלפים מתהפכים,"], [3.88, "ולוחצים על *הנכון.*"]]),
  ...caps(VO[4], [[2.14, "הסיבובים האחרונים שווים"], [4.32, "*פי 2, פי 3,*"], [5.74, "ואפילו *פי 4.*"]]),
  ...caps(VO[5], [[0, "מי שצובר הכי הרבה נקודות,"], [1.92, "לוקח *95%* מהקופה."], [4.54, "על 10 דולר, זה *19 דולר* לכיס."]]),
  ...caps(VO[6], [[0, "*176* סוגי סיבובים,"], [2.36, "וכל אחד נוצר מחדש."]]),
  ...caps(VO[7], [[0, "רוצה לנסות?"]]).map(([a, , t]) => [a, F(46.4 + 1.0), t] as [number, number, string]),
];

const StepHeader: React.FC<{ n: number; title: string; at?: number; top?: number }> = ({ n, title, at = 4, top = 150 }) => {
  const f = useCurrentFrame();
  const p = pop(f, at, 12, 200);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div
        style={{
          width: 170,
          height: 170,
          borderRadius: 50,
          background: C.lime,
          color: C.limeInk,
          display: "grid",
          placeItems: "center",
          fontFamily: display,
          fontWeight: 900,
          fontSize: 110,
          boxShadow: "0 0 70px rgba(198,255,51,.55), inset 0 -10px 0 rgba(0,0,0,.18)",
          transform: `scale(${p}) rotate(${(1 - p) * -30}deg)`,
        }}
      >
        {n}
      </div>
      <HeTitle text={title} at={at + 6} size={100} />
    </div>
  );
};

const Hook: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <AbsoluteFill style={{ transform: "translateY(250px)" }}>
      <HeroTower at={-10} />
    </AbsoluteFill>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 220, flexDirection: "column", gap: 30 }}>
      <HeTitle text={"איך מנצחים\n*ב-CLUTCH?*"} at={F(0.4)} size={150} stagger={4} />
      <HeTitle text="זה פשוט." at={F(2.56)} size={96} weight={700} color={C.muted} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const Step1: React.FC = () => {
  const f = useCurrentFrame();
  const start = F(4.0);
  const merge = F(9.66) - start; // "ten dollars"
  const m = prog(f, merge + 14, merge + 34);
  const potIn = pop(f, merge + 30, 11, 200);
  const cardOut = prog(f, merge - 12, merge);
  const pill = (who: "me" | "opp") => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, transform: `translateX(${(who === "me" ? 1 : -1) * m * 280}px) scale(${1 - m * 0.3})`, opacity: 1 - m * 0.9 }}>
      <Avatar who={who} size={140} />
      <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.text }}>{who === "me" ? "You" : "mira.v"}</div>
      <div style={{ padding: "16px 40px", borderRadius: 40, background: C.card2, border: `2px solid ${C.line2}`, fontFamily: display, fontWeight: 900, fontSize: 64, color: C.lime, transform: `scale(${pop(f, merge + (who === "me" ? 0 : 6), 10, 220)})` }}>$10</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Backdrop />
      <StepHeader n={1} title="בוחרים *דו-קרב.*" at={6} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 640, opacity: 1 - cardOut }}>
        <div style={{ transform: `translateY(${(1 - pop(f, 40, 14, 160)) * 900}px) rotate(${(1 - pop(f, 40, 14, 160)) * 8}deg)` }}>
          <DuelCard stake={10} scale={1.15} />
        </div>
      </AbsoluteFill>
      {f >= merge - 6 && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 760 }}>
          <div style={{ display: "flex", gap: 200 }}>
            {pill("me")}
            {pill("opp")}
          </div>
        </AbsoluteFill>
      )}
      {f >= merge + 30 && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 800 }}>
          <div style={{ textAlign: "center", transform: `scale(${potIn})` }}>
            <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 44, letterSpacing: "0.14em", color: C.muted }}>POT</div>
            <div style={{ fontFamily: display, fontWeight: 900, fontSize: 260, color: C.lime, textShadow: "0 0 80px rgba(198,255,51,.6)" }}>$20</div>
          </div>
        </AbsoluteFill>
      )}
      <Sfx at={40} name="whoosh" volume={0.5} />
      <Sfx at={merge} name="clack" volume={0.8} />
      <Sfx at={merge + 6} name="clack" volume={0.8} />
      <Sfx at={merge + 30} name="coins" volume={0.6} />
    </AbsoluteFill>
  );
};

const Verdict: React.FC<{ good: boolean; q: string; qAt: number; slamAt: number }> = ({ good, q, qAt, slamAt }) => {
  const f = useCurrentFrame();
  const t = f - slamAt;
  const shakeX = !good && t >= 0 ? Math.sin(t * 2.2) * 22 * Math.max(0, 1 - t / 14) : 0;
  return (
    <AbsoluteFill>
      <Backdrop hue={good ? "lime" : "heat"} />
      <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
        <HeTitle text={q} at={qAt} size={130} />
      </div>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 560 }}>
        <div style={{ transform: `translateX(${shakeX}px) scale(${1 + (good && t >= 0 ? 0.06 * Math.sin(Math.min(1, t / 8) * Math.PI) : 0)})` }}>
          <GameCard w={480} h={600} flip={1} state={t >= 0 ? (good ? "good" : "bad") : "picked"} idx={good ? 3 : 4} badges={t >= 0 ? { me: "1st" } : undefined}>
            <FaceView face={{ k: "num", v: good ? "94" : "39" }} w={480} />
          </GameCard>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 1220 }}>
        <Slam text={good ? "+100" : "−100"} at={slamAt} size={250} color={good ? C.lime : C.loss} />
      </AbsoluteFill>
      <Flash at={slamAt} color={good ? C.lime : C.loss} max={0.3} len={8} />
      <Sfx at={slamAt} name={good ? "good" : "bad"} volume={0.9} />
      <Sfx at={slamAt + 3} name={good ? "roundwin" : "roundlose"} volume={0.7} />
    </AbsoluteFill>
  );
};

const Step3: React.FC = () => {
  const f = useCurrentFrame();
  const start = F(22.0);
  const hot = { 2: F(26.52) - start, 3: F(27.4) - start, 4: F(28.78) - start };
  const cur = ([4, 3, 2] as const).find((m) => f >= hot[m]);
  return (
    <AbsoluteFill>
      <Backdrop hue={f >= hot[2] ? "heat" : "violet"} />
      {f >= hot[2] && <HeatVignette from={hot[2]} to={10000} />}
      <StepHeader n={3} title="סיבובי *הקלאץ'.*" at={6} top={120} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 700 }}>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.muted, marginBottom: 20, opacity: prog(f, 50, 60) }}>High Roller, 15 rounds</div>
        <Ladder ladder={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4]} at={56} hotAt={hot} width={940} />
      </AbsoluteFill>
      {cur && (
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 1300 }}>
          <div key={cur} style={{ transform: `scale(${2 - pop(f, hot[cur], 11, 230)})` }}>
            <Extruded text={`×${cur}`} size={300} tiltX={10} tiltY={Math.sin(f / 12) * 10} />
          </div>
        </AbsoluteFill>
      )}
      {([2, 3, 4] as const).map((m) => (
        <React.Fragment key={m}>
          <Sfx at={hot[m]} name="impact" volume={0.5} />
          <Flash at={hot[m]} color="#FF7A3D" max={0.35} len={6} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

const Pot: React.FC = () => (
  <AbsoluteFill>
    <Backdrop hue="lime" />
    <div style={{ position: "absolute", top: 200, left: 0, right: 0 }}>
      <HeTitle text={"מי שצובר הכי הרבה\nנקודות, *לוקח.*"} at={4} size={100} />
    </div>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 640 }}>
      <PotSplit at={F(1.8)} pot={20} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const Wall: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(lerp(f, [4, 40], [0, 176]));
  const a1 = F(42.92) - F(38.4);
  const a2 = F(44.3) - F(38.4);
  return (
    <AbsoluteFill>
      <Backdrop />
      <RoundWall at={0} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        {f < a1 ? (
          <>
            <div style={{ fontFamily: display, fontWeight: 900, fontSize: 340, color: C.lime, textShadow: "0 0 90px rgba(198,255,51,.7), 0 10px 0 rgba(0,0,0,.4)", transform: `scale(${pop(f, 2, 12, 180)})` }}>{n}</div>
            <HeTitle text="סוגי סיבובים." at={14} size={110} />
          </>
        ) : (
          <>
            <div style={{ position: "relative" }}>
              <HeTitle text="אי אפשר לשנן." at={a1} size={120} color="#CFCDE0" />
              <div style={{ position: "absolute", left: -20, right: -20, top: "52%", height: 14, borderRadius: 7, background: C.loss, transform: `scaleX(${prog(f, a1 + 14, a1 + 24)})`, transformOrigin: "right center", boxShadow: "0 0 20px rgba(255,59,92,.7)" }} />
            </div>
            {f >= a2 && (
              <div style={{ marginTop: 40 }}>
                <HeTitle text={"אפשר רק\n*להיות טוב.*"} at={a2} size={150} stagger={5} />
              </div>
            )}
          </>
        )}
      </AbsoluteFill>
      <Sfx at={4} name="riser-2s" volume={0.35} />
      <Sfx at={a1 + 14} name="rm-whip" volume={0.6} />
    </AbsoluteFill>
  );
};

const Free: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 50 }}>
        <HeTitle text={"משחק אימון\n*בחינם.*"} at={F(1.06) - F(0.2)} size={150} stagger={5} />
        <div style={{ padding: "14px 34px", borderRadius: 40, background: "rgba(124,77,255,.25)", border: "2px solid rgba(165,139,255,.5)", fontFamily: sans, fontWeight: 800, fontSize: 34, color: "#D9CCFF", opacity: prog(f, 20, 30) }}>
          Practice game, no money involved
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Ad3HowItWorks: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Cut from={0} dur={F(4.0)} punch={false} name="Hook">
      <Hook />
    </Cut>
    <Cut from={F(4.0)} dur={F(11.4) - F(4.0)} name="Step 1">
      <Step1 />
    </Cut>
    <Cut from={F(11.4)} dur={F(12.4) - F(11.4)} name="Step 2 title">
      <AbsoluteFill>
        <Backdrop />
        <StepHeader n={2} title={"קוראים.\n*לוחצים.*"} at={0} top={560} />
      </AbsoluteFill>
    </Cut>
    <Cut from={F(12.4)} dur={F(17.2) - F(12.4)} name="Step 2 round">
      <GameScene
        spec={{
          ins: "Pick the largest number",
          he: "בחר את המספר הגדול",
          faces: nums(62, 92, 94, 39),
          ans: 2,
          flip: F(14.82) - F(12.4),
          me: { pick: 2, at: F(15.55) - F(12.4) },
          opp: { pick: 2, at: F(15.9) - F(12.4) },
          reveal: F(16.0) - F(12.4),
          banner: { title: "+100", sub: "You were faster by 0.35 s", tone: "win" },
        }}
        before={{ me: 0, opp: 0 }}
        after={{ me: 100, opp: 65 }}
        roundNo={1}
        of={10}
        history={[]}
        ladder={CLASSIC}
        feltTop={600}
        scale={0.86}
      />
    </Cut>
    <Cut from={F(17.2)} dur={F(19.9) - F(17.2)} name="Right">
      <Verdict good q="מהר *וצודק?*" qAt={F(17.4) - F(17.2)} slamAt={F(18.68) - F(17.2)} />
    </Cut>
    <Cut from={F(19.9)} dur={F(22.0) - F(19.9)} name="Wrong">
      <Verdict good={false} q="*טעות?*" qAt={F(19.98) - F(19.9)} slamAt={F(21.3) - F(19.9)} />
    </Cut>
    <Cut from={F(22.0)} dur={F(30.0) - F(22.0)} name="Step 3">
      <Step3 />
    </Cut>
    <Cut from={F(30.0)} dur={F(35.4) - F(30.0)} name="Pot">
      <Pot />
    </Cut>
    <Cut from={F(35.4)} dur={F(38.4) - F(35.4)} name="Win">
      <WinScreen amount={19} score="Classic, $10 stake. Winner gets $19." />
    </Cut>
    <Cut from={F(38.4)} dur={F(46.2) - F(38.4)} name="176 round types">
      <Wall />
    </Cut>
    <Cut from={F(46.2)} dur={F(48.0) - F(46.2)} name="Free practice">
      <Free />
    </Cut>
    <Cut from={F(48.0)} dur={AD3_FRAMES - F(48.0)} name="End card">
      <EndCard />
    </Cut>
    <Captions items={CAPS} y={1650} />
    <Grain />
    <Sequence layout="none">
      {[4.0, 11.4, 12.4, 17.2, 19.9, 22.0, 30.0, 35.4, 38.4, 46.2].map((t, i) => (
        <Sfx key={i} at={F(t) - 3} name={i % 2 ? "whoosh-short" : "whoosh"} volume={0.4} />
      ))}
    </Sequence>
    <VoiceTrack lines={VO} />
    <MusicBed file="ad3" lines={VO} base={0.45} low={0.17} />
  </AbsoluteFill>
);

export { heb };

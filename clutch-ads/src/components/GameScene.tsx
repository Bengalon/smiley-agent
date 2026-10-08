import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { HUD, TrackSeg } from "./HUD";
import { Round, RoundSpec } from "./Round";
import { Backdrop } from "./Backdrop";
import { HeatVignette } from "./Effects";
import { prog } from "../anim";

export type HudState = { me: number; opp: number };

/**
 * A full in-match screen: backdrop, HUD and one round. Scores count from `before` to `after`
 * right after the reveal. `roundNo`/`of` drive the round label and the track.
 */
export const GameScene: React.FC<{
  spec: RoundSpec;
  before: HudState;
  after: HudState;
  roundNo: number;
  of: number;
  mult?: number;
  history: TrackSeg[]; // results of earlier rounds
  ladder: number[];
  feltTop?: number;
  hudTop?: number;
  sfx?: boolean;
  oppName?: string;
  backdrop?: boolean;
  scale?: number;
}> = ({ spec, before, after, roundNo, of, mult = 1, history, ladder, feltTop = 640, hudTop = 120, sfx = true, oppName, backdrop = true, scale = 1 }) => {
  const f = useCurrentFrame();
  const p = prog(f, spec.reveal + 4, spec.reveal + 18);
  const me = before.me + (after.me - before.me) * p;
  const opp = before.opp + (after.opp - before.opp) * p;
  const bumpMe = after.me !== before.me ? Math.sin(p * Math.PI) : 0;
  const bumpOpp = after.opp !== before.opp ? Math.sin(p * Math.PI) : 0;
  const revealed = f >= spec.reveal + 4;
  const res: TrackSeg = after.me - before.me > after.opp - before.opp ? "won" : after.me - before.me < after.opp - before.opp ? "lost" : "tie";
  const track = ladder.map((m, i) => ({
    s: (i < roundNo - 1 ? history[i] ?? "todo" : i === roundNo - 1 ? (revealed ? res : "now") : "todo") as TrackSeg,
    mult: m,
  }));
  const hot = mult > 1;
  const meFirst = spec.me && f >= spec.me.at && (!spec.opp || spec.me.at <= spec.opp.at);
  const oppAnswered = spec.opp && f >= spec.opp.at && f < spec.reveal;
  return (
    <AbsoluteFill>
      {backdrop && <Backdrop hue={hot ? "heat" : "violet"} />}
      {hot && <HeatVignette from={0} to={10000} strength={roundNo === of ? 1.3 : 1} />}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 0%" }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: hudTop }}>
        <HUD
          me={me}
          opp={opp}
          round={`Round ${roundNo} of ${of}`}
          pill={hot ? `×${mult}, up to ${100 * mult}` : "Up to 100"}
          hot={hot}
          track={track}
          meFirst={!!meFirst}
          oppAnswered={!!oppAnswered}
          bumpMe={bumpMe}
          bumpOpp={bumpOpp}
          oppName={oppName}
        />
      </AbsoluteFill>
      <Round spec={{ ...spec, hot, coinsTo: spec.coinsTo ?? [250, hudTop + 75] }} feltTop={feltTop} sfx={sfx} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CLASSIC = [1, 1, 1, 1, 1, 1, 1, 1, 2, 3];
export const SPRINT = [1, 1, 1, 1, 2];

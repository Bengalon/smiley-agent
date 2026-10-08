import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

export type SfxName =
  | "tap" | "clack" | "deal" | "flip" | "first" | "oppfirst" | "good" | "bad" | "roundwin" | "roundlose"
  | "streak" | "tick" | "beat" | "count" | "match" | "win" | "lose" | "coin"
  | "whoosh" | "whoosh-short" | "whoosh-rev" | "impact" | "impact-big" | "riser-2s" | "riser-4s" | "downlifter"
  | "heartbeat" | "coins" | "pop" | "glitch" | "slot-spin" | "ding" | "tape-stop"
  | "rm-whoosh" | "rm-whip" | "rm-record-scratch" | "rm-shutter-modern" | "rm-switch" | "rm-mouse-click";

/** Overall effects level, leaves headroom for voice and music. */
const SFX_GAIN = 0.72;

/** One sound effect at an absolute frame. */
export const Sfx: React.FC<{ at: number; name: SfxName; volume?: number; rate?: number }> = ({ at, name, volume = 0.8, rate = 1 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={150} layout="none" name={`sfx:${name}`}>
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * SFX_GAIN} playbackRate={rate} />
  </Sequence>
);

/** A list of [frame, name, volume?] cues */
export const SfxTrack: React.FC<{ cues: [number, SfxName, number?][] }> = ({ cues }) => (
  <>
    {cues.map(([at, name, v], i) => (
      <Sfx key={i} at={at} name={name} volume={v ?? 0.8} />
    ))}
  </>
);

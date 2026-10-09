import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

export type Sfx2Name = "braam" | "hit" | "subdrop" | "swell" | "glass" | "swish" | "whoosh" | "whip" | "tick";

export const Sfx2: React.FC<{ at: number; name: Sfx2Name; volume?: number }> = ({ at, name, volume = 0.7 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={150} layout="none" name={`sfx2:${name}`}>
    <Audio src={staticFile(`sfx2/${name}.wav`)} volume={volume * 0.8} />
  </Sequence>
);

/** A whoosh just before every cut, alternating whoosh/whip */
export const Whooshes: React.FC<{ at: number[]; volume?: number }> = ({ at, volume = 0.45 }) => (
  <>
    {at.map((c, i) => (
      <Sfx2 key={i} at={c - (i % 2 ? 3 : 5)} name={i % 2 ? "whip" : "whoosh"} volume={volume} />
    ))}
  </>
);

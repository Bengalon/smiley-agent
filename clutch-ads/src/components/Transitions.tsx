import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { prog, lerp } from "../anim";
import { Flash } from "./Effects";

/** Punch-in: the scene starts slightly zoomed and blurred and snaps into place. */
export const PunchIn: React.FC<{ children: React.ReactNode; len?: number; from?: number; flash?: boolean; zoom?: number }> = ({ children, len = 8, flash = true, zoom = 1.18 }) => {
  const f = useCurrentFrame();
  const p = prog(f, 0, len);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom - (zoom - 1) * p})`, filter: `blur(${(1 - p) * 14}px)` }}>{children}</AbsoluteFill>
      {flash && <Flash at={0} len={6} max={0.32} />}
    </AbsoluteFill>
  );
};

/** Places a scene at [from, from+dur) with a punch-in. */
export const Cut: React.FC<{ from: number; dur: number; children: React.ReactNode; name?: string; punch?: boolean; flash?: boolean; zoom?: number }> = ({
  from,
  dur,
  children,
  name,
  punch = true,
  flash = true,
  zoom,
}) => (
  <Sequence from={from} durationInFrames={dur} name={name}>
    {punch ? <PunchIn flash={flash} zoom={zoom}>{children}</PunchIn> : children}
  </Sequence>
);

/** Slow push-in over a scene's life for a cinematic feel */
export const Push: React.FC<{ children: React.ReactNode; dur: number; amount?: number }> = ({ children, dur, amount = 0.06 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${1 + lerp(f, [0, dur], [0, amount], (t) => t)})` }}>{children}</AbsoluteFill>;
};

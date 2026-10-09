import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Video } from "@remotion/media";
import { zoomBlur } from "@remotion/effects/zoom-blur";
import { chromaticAberration } from "@remotion/effects/chromatic-aberration";
import { map, p01, expoOut, inOutCubic } from "./kit";

export type Grade = "luck" | "skill" | "grey" | "none";
export type Enter = "punch" | "whip-l" | "whip-r" | "zoom" | "none";

const gradeCss = (g: Grade, desat = 0) => {
  switch (g) {
    case "luck":
      return `saturate(${0.85 - desat * 0.85}) contrast(1.12) brightness(.92) sepia(${0.12 + desat * 0.2})`;
    case "grey":
      return "grayscale(1) contrast(1.25) brightness(.8)";
    case "skill":
      return `saturate(${1.15 - desat}) contrast(1.15) brightness(1.02)`;
    default:
      return "none";
  }
};

/**
 * One piece of footage on the timeline with a camera move, a punch-in with zoom blur on entry,
 * and a grade. `at`/`dur` in frames, `offset` in seconds into the clip.
 */
export const Shot: React.FC<{
  clip: string;
  at: number;
  dur: number;
  offset?: number;
  rate?: number;
  zoom?: [number, number];
  pan?: [number, number, number, number]; // x0,y0,x1,y1 in px
  grade?: Grade;
  desat?: [number, number];
  punch?: boolean;
  blurIn?: number;
  children?: React.ReactNode;
  rotate?: [number, number];
  enter?: Enter;
  glitch?: number[]; // local frames where an RGB glitch hits
}> = ({ clip, at, dur, offset = 0, rate = 1, zoom = [1.08, 1.18], pan = [0, 0, 0, 0], grade = "none", desat = [0, 0], punch = true, blurIn = 0.35, children, rotate = [0, 0], enter = "punch", glitch = [] }) => (
  <Sequence from={at} durationInFrames={dur} name={`shot:${clip}`}>
    <ShotInner clip={clip} dur={dur} offset={offset} rate={rate} zoom={zoom} pan={pan} grade={grade} desat={desat} punch={punch && enter === "punch"} blurIn={blurIn} rotate={rotate} enter={enter} glitch={glitch}>
      {children}
    </ShotInner>
  </Sequence>
);

const ShotInner: React.FC<{
  clip: string;
  dur: number;
  offset: number;
  rate: number;
  zoom: [number, number];
  pan: [number, number, number, number];
  grade: Grade;
  desat: [number, number];
  punch: boolean;
  blurIn: number;
  rotate: [number, number];
  enter: Enter;
  glitch: number[];
  children?: React.ReactNode;
}> = ({ clip, dur, offset, rate, zoom, pan, grade, desat, punch, blurIn, rotate, enter, glitch, children }) => {
  const f = useCurrentFrame();
  const id = React.useId().replace(/:/g, "");
  const wp = enter === "whip-l" || enter === "whip-r" ? 1 - p01(f, 0, 7) : 0;
  const wdir = enter === "whip-l" ? -1 : 1;
  const zin = enter === "zoom" ? 1 - p01(f, 0, 9) : 0;
  const g = glitch.some((gf) => f >= gf && f < gf + 4);
  const gx = g ? ((f * 37) % 11) - 5 : 0;
  const t = p01(f, 0, dur, inOutCubic);
  const pin = punch ? map(f, [0, 7], [1.22, 1], expoOut) : 1;
  const s = (zoom[0] + (zoom[1] - zoom[0]) * t) * pin;
  const x = pan[0] + (pan[2] - pan[0]) * t;
  const y = pan[1] + (pan[3] - pan[1]) * t;
  const zb = punch ? blurIn * (1 - p01(f, 0, 6)) : zin * 0.5;
  const d = desat[0] + (desat[1] - desat[0]) * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {wp > 0 && (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={`wb${id}`} x="-20%" y="0" width="140%" height="100%">
            <feGaussianBlur stdDeviation={`${wp * 90} 0`} />
          </filter>
        </svg>
      )}
      <AbsoluteFill
        style={{
          transform: `translate(${x + wp * wdir * -700 + gx * 6}px, ${y}px) scale(${s * (1 + zin * 0.6)}) rotate(${rotate[0] + (rotate[1] - rotate[0]) * t}deg)`,
          filter: `${wp > 0 ? `url(#wb${id}) ` : ""}${gradeCss(grade, d)}`,
        }}
      >
        <Video
          src={staticFile(`clips/${clip}.mp4`)}
          muted
          trimBefore={Math.round(offset * 30)}
          playbackRate={rate}
          objectFit="cover" style={{ width: "100%", height: "100%" }}
          effects={[...(zb > 0.01 ? [zoomBlur({ amount: zb })] : []), ...(g ? [chromaticAberration({ amount: 0.025, angle: 0 })] : [])]}
        />
      </AbsoluteFill>
      {grade === "luck" && <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,40,45,.35), transparent 40%, rgba(60,30,5,.3))", mixBlendMode: "multiply" }} />}
      {grade === "skill" && <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 40%, transparent, rgba(40,10,80,.45))", mixBlendMode: "multiply" }} />}
      {children}
    </AbsoluteFill>
  );
};

import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile } from "remotion";

/** A voice-over line: file in public/vo, start time and length in seconds. */
export type VoLine = { file: string; at: number; dur: number };

export const VoiceTrack: React.FC<{ lines: VoLine[]; volume?: number }> = ({ lines, volume = 1 }) => (
  <>
    {lines.map((l, i) => (
      <Sequence key={i} from={Math.round(l.at * 30)} durationInFrames={Math.ceil(l.dur * 30) + 6} layout="none" name={`vo:${l.file}`}>
        <Audio src={staticFile(`vo/${l.file}.wav`)} volume={volume} />
      </Sequence>
    ))}
  </>
);

/** Music volume that dips under the voice (sidechain style), with smooth 8-frame ramps. */
export const duck = (lines: VoLine[], base = 0.6, low = 0.24) => (f: number) => {
  let v = base;
  for (const l of lines) {
    const a = l.at * 30;
    const b = (l.at + l.dur) * 30;
    const d = interpolate(f, [a - 8, a, b, b + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    v = Math.min(v, base - (base - low) * d);
  }
  return v;
};

/** Music bed with ducking. */
export const MusicBed: React.FC<{ file: string; lines: VoLine[]; base?: number; low?: number }> = ({ file, lines, base = 0.6, low = 0.24 }) => {
  const fn = duck(lines, base, low);
  return <Audio src={staticFile(`music/${file}.wav`)} volume={(f) => fn(f)} />;
};

/** Build caption items from a VO line: [[offsetSec, text], ...] -> [startFrame, endFrame, text] */
export const caps = (line: VoLine, parts: [number, string][]): [number, number, string][] =>
  parts.map(([off, text], i) => {
    const start = Math.round((line.at + off) * 30);
    const end = i < parts.length - 1 ? Math.round((line.at + parts[i + 1][0]) * 30) : Math.round((line.at + line.dur) * 30) + 8;
    return [start, end, text];
  });

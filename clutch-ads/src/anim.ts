import { Easing, interpolate, random, spring } from "remotion";
import { FPS } from "./brand";

export const ease = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** clamped interpolate */
export const lerp = (f: number, input: number[], output: number[], easing: (t: number) => number = ease) =>
  interpolate(f, input, output, { ...CL, easing });

/** 0..1 progress between two frames */
export const prog = (f: number, a: number, b: number, easing: (t: number) => number = ease) =>
  interpolate(f, [a, b], [0, 1], { ...CL, easing });

/** bouncy pop in, 0 -> 1 with overshoot */
export const pop = (f: number, at: number, damping = 11, stiffness = 170) =>
  spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 0.8 } });

/** smooth no-bounce spring */
export const glide = (f: number, at: number, damping = 200) =>
  spring({ frame: f - at, fps: FPS, config: { damping } });

/** fade in at a, out at b */
export const inOut = (f: number, a: number, b: number, fadeIn = 8, fadeOut = 8) =>
  interpolate(f, [a, a + fadeIn, b - fadeOut, b], [0, 1, 1, 0], CL);

/** decaying camera shake */
export const shake = (f: number, at: number, amp = 18, len = 14, seed = "s") => {
  const t = f - at;
  if (t < 0 || t > len) return { x: 0, y: 0 };
  const k = 1 - t / len;
  return {
    x: (random(`${seed}x${f}`) * 2 - 1) * amp * k * k,
    y: (random(`${seed}y${f}`) * 2 - 1) * amp * k * k,
  };
};

export const rnd = (key: string | number) => random(String(key));
export const range = (n: number) => [...Array(n).keys()];

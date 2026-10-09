import { Easing, interpolate, random } from "remotion";

export const FPS = 30;
export const F = (sec: number) => Math.round(sec * FPS);

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const expoOut = Easing.bezier(0.16, 1, 0.3, 1);
export const expoIn = Easing.bezier(0.7, 0, 0.84, 0);
export const inOutCubic = Easing.bezier(0.65, 0, 0.35, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

export const p01 = (f: number, a: number, b: number, e: (t: number) => number = expoOut) => interpolate(f, [a, b], [0, 1], { ...CL, easing: e });
export const map = (f: number, i: number[], o: number[], e: (t: number) => number = expoOut) => interpolate(f, i, o, { ...CL, easing: e });
export const rnd = (k: string | number) => random(String(k));
export const range = (n: number) => [...Array(n).keys()];

/** decaying shake */
export const shakeAt = (f: number, at: number, amp = 20, len = 12, seed = "s") => {
  const t = f - at;
  if (t < 0 || t > len) return { x: 0, y: 0, r: 0 };
  const k = (1 - t / len) ** 2;
  return { x: (rnd(`${seed}x${f}`) * 2 - 1) * amp * k, y: (rnd(`${seed}y${f}`) * 2 - 1) * amp * k, r: (rnd(`${seed}r${f}`) * 2 - 1) * 1.2 * k };
};

/** Colors */
export const K = {
  bg: "#07060D",
  lime: "#C6FF33",
  limeInk: "#11160A",
  violet: "#7C4DFF",
  heat: "#FF4D2E",
  loss: "#FF3B5C",
  text: "#F4F2FB",
  muted: "#9C97B5",
  amber: "#FFB347",
};

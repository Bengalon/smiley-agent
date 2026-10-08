import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (variable fonts), so rendering never depends on the network.
const HEB = "U+0307-0308, U+0590-05FF, U+200C-2010, U+20AA, U+25CC, U+FB1D-FB4F";
loadFont({ family: "Heebo", url: staticFile("fonts/heebo-hebrew.woff2"), weight: "100 900", unicodeRange: HEB, display: "block" });
loadFont({ family: "Heebo", url: staticFile("fonts/heebo-latin.woff2"), weight: "100 900", display: "block" });
loadFont({ family: "Manrope", url: staticFile("fonts/manrope-latin.woff2"), weight: "200 800", display: "block" });
loadFont({ family: "Unbounded", url: staticFile("fonts/unbounded-latin.woff2"), weight: "200 900", display: "block" });

// Design tokens from the Clutch PRD (section 15.1)
export const C = {
  bg: "#0A0912",
  bg2: "#100E1C",
  card: "#16132A",
  card2: "#1E1A38",
  line: "rgba(255,255,255,.07)",
  line2: "rgba(255,255,255,.12)",
  text: "#F4F2FB",
  muted: "#8E89A8",
  lime: "#C6FF33",
  limeInk: "#11160A",
  violet: "#7C4DFF",
  heat: "#FF4D2E",
  loss: "#FF3B5C",
  opp: "#A58BFF",
  gold: "#FFC94D",
  // the five round colors (PRD 8.2)
  red: "#FF4438",
  blue: "#3D8BFF",
  green: "#2EE6A8",
  yellow: "#FFD60A",
  purple: "#B27CFF",
};

export const GRAD = {
  sprint: "linear-gradient(145deg, #3D7BFF, #6B3DF2)",
  classic: "linear-gradient(145deg, #FF3B6E, #9A2DE2)",
  high: "linear-gradient(145deg, #FFB020, #FF4D2E)",
  you: "linear-gradient(145deg, #DFFF8A, #C6FF33 55%, #6EDC1E)",
  them: "linear-gradient(145deg, #B9A3FF, #7C4DFF 55%, #4B22C9)",
};

export const display = "Unbounded, 'Arial Black', sans-serif";
export const sans = "Manrope, 'Helvetica Neue', Arial, sans-serif";
export const heb = "Heebo, Arial, sans-serif";

export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** seconds to frames */
export const s = (sec: number) => Math.round(sec * FPS);

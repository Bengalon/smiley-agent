// Usage: node scripts/stills.mjs <compositionId> <outDir> <frame,frame,...>
// Bundles once and renders several stills (for reviewing a cut without a full render).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [id, outDir, framesArg] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl: "swangle" } });
for (const frame of framesArg.split(",").map(Number)) {
  await renderStill({ serveUrl, composition, frame, output: path.join(outDir, `${id}-${String(frame).padStart(4, "0")}.png`), chromiumOptions: { gl: "swangle" }, scale: 0.5 });
  process.stdout.write(`${frame} `);
}
console.log("done");

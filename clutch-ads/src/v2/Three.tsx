import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Studio } from "../components/Chips3D";
import { map, p01, expoOut, backOut, inOutCubic } from "./kit";

const Canvas: React.FC<{ children: React.ReactNode; fov?: number; z?: number; y?: number }> = ({ children, fov = 30, z = 16, y = 0 }) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} style={{ position: "absolute", inset: 0 }} camera={{ fov, position: [0, y, z], near: 0.1, far: 200 }} gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}>
      {children}
    </ThreeCanvas>
  );
};

// ---------- Logo geometry (from the site's 40x40 SVG mark, centered at 0,0, y up) ----------
const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

const markShapes = () => {
  const shapes: THREE.Shape[] = [];
  const ring = new THREE.Shape();
  ring.absarc(0, 0, 18.6, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, 15.4, 0, Math.PI * 2, true);
  ring.holes.push(hole);
  shapes.push(ring);
  // tick marks (capsules)
  const cap = (cx: number, cy: number, horiz: boolean) => {
    const s = new THREE.Shape();
    const w = horiz ? 4 : 5;
    const h = horiz ? 5 : 4;
    const r = 2.5;
    const sh = roundedRect(horiz ? w + 5 : w, horiz ? h : h + 5, r);
    sh.getPoints(12).forEach((p, i) => (i === 0 ? s.moveTo(p.x + cx, p.y + cy) : s.lineTo(p.x + cx, p.y + cy)));
    return s;
  };
  shapes.push(cap(0, 15, false), cap(0, -15, false), cap(15, 0, true), cap(-15, 0, true));
  // the C: thick arc r 6..10, from 46.5deg to 313.5deg, round caps
  const a0 = (46.5 * Math.PI) / 180;
  const a1 = (313.5 * Math.PI) / 180;
  const c = new THREE.Shape();
  c.absarc(0, 0, 10, a0, a1, false);
  c.absarc(0, 0, 6, a1, a0, true);
  shapes.push(c);
  for (const a of [a0, a1]) {
    const d = new THREE.Shape();
    d.absarc(Math.cos(a) * 8, Math.sin(a) * 8, 2, 0, Math.PI * 2, false);
    shapes.push(d);
  }
  return shapes;
};

/** The Clutch app icon as a glossy extruded 3D object. Frame `at` = entrance. */
export const Logo3D: React.FC<{ at?: number; scale?: number; y?: number; spin?: number; tilt?: number }> = ({ at = 0, scale = 1, y = 0, spin = 0, tilt = 0 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  const geo = useMemo(() => {
    const tile = new THREE.ExtrudeGeometry(roundedRect(40, 40, 12), { depth: 5, bevelEnabled: true, bevelThickness: 1.6, bevelSize: 1.6, bevelSegments: 6, curveSegments: 24 });
    tile.translate(0, 0, -5);
    const mark = new THREE.ExtrudeGeometry(markShapes(), { depth: 2.2, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.35, bevelSegments: 3, curveSegments: 32 });
    mark.translate(0, 0, 1.4);
    return { tile, mark };
  }, []);
  const mats = useMemo(
    () => ({
      tile: new THREE.MeshPhysicalMaterial({ color: "#C6FF33", roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08, emissive: "#4a6a00", emissiveIntensity: 0.25 }),
      mark: new THREE.MeshPhysicalMaterial({ color: "#11160A", roughness: 0.3, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.1 }),
    }),
    [],
  );
  const inP = p01(t, 0, 22, backOut);
  const ry = map(t, [0, 26], [-2.4, 0], expoOut) + Math.sin(t / 40) * 0.18 + spin * t;
  const rx = map(t, [0, 26], [0.6, 0], expoOut) + Math.sin(t / 55) * 0.08 + tilt;
  const sweep = ((t % 90) / 90) * 40 - 20;
  return (
    <Canvas fov={30} z={190}>
      <Studio rim="#7C4DFF" fill="#C6FF33" envIntensity={0.8} />
      <pointLight position={[sweep * 3, 30, 60]} intensity={9000} distance={300} color="#ffffff" />
      <group position={[0, y, 0]} scale={scale * inP} rotation={[rx, ry, 0]}>
        <mesh geometry={geo.tile} material={mats.tile} />
        <mesh geometry={geo.mark} material={mats.mark} />
      </group>
    </Canvas>
  );
};

// ---------- 3D game cards ----------
const texCache = new Map<string, THREE.Texture>();
const cardBack = () => {
  if (texCache.has("back")) return texCache.get("back")!;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 640;
  const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 512, 640);
  gr.addColorStop(0, "#3A1F8F");
  gr.addColorStop(1, "#160F33");
  g.fillStyle = gr;
  g.fillRect(0, 0, 512, 640);
  g.save();
  g.translate(256, 320);
  for (let i = 0; i < 36; i++) {
    g.rotate((Math.PI * 2) / 36);
    g.fillStyle = "rgba(198,255,51,.07)";
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(-14, -500);
    g.lineTo(14, -500);
    g.fill();
  }
  g.restore();
  g.strokeStyle = "rgba(198,255,51,.5)";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(256, 320, 150, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#C6FF33";
  g.beginPath();
  (g as CanvasRenderingContext2D).roundRect(186, 250, 140, 140, 40);
  g.fill();
  g.strokeStyle = "#11160A";
  g.lineWidth = 12;
  g.beginPath();
  g.arc(256, 320, 48, 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 15;
  g.lineCap = "round";
  g.beginPath();
  g.arc(256, 320, 24, (45 * Math.PI) / 180, (315 * Math.PI) / 180, false);
  g.stroke();
  g.strokeStyle = "rgba(198,255,51,.6)";
  g.lineWidth = 6;
  g.strokeRect(8, 8, 496, 624);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  texCache.set("back", t);
  return t;
};
const cardFace = (label: string, good: boolean) => {
  const key = `f${label}${good}`;
  if (texCache.has(key)) return texCache.get(key)!;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 640;
  const g = c.getContext("2d")!;
  const gr = g.createLinearGradient(0, 0, 0, 640);
  gr.addColorStop(0, "#2A2350");
  gr.addColorStop(1, "#15122A");
  g.fillStyle = gr;
  g.fillRect(0, 0, 512, 640);
  g.strokeStyle = good ? "#C6FF33" : "rgba(255,255,255,.15)";
  g.lineWidth = good ? 18 : 6;
  g.strokeRect(10, 10, 492, 620);
  g.fillStyle = "#F4F2FB";
  g.font = "900 200px Unbounded, 'Arial Black', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(label, 256, 335);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  texCache.set(key, t);
  return t;
};

const cardGeo = new RoundedBoxGeometry(2.0, 2.5, 0.06, 4, 0.14);

const Card3D: React.FC<{ label: string; good: boolean; position: [number, number, number]; flip: number; lift: number; dim: number; glow: number }> = ({ label, good, position, flip, lift, dim, glow }) => {
  const mats = useMemo(() => {
    const edge = new THREE.MeshPhysicalMaterial({ color: "#2b2156", roughness: 0.4 });
    return [edge, edge, edge, edge, new THREE.MeshPhysicalMaterial({ map: cardFace(label, good), roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1 }), new THREE.MeshPhysicalMaterial({ map: cardBack(), roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.1 })];
  }, [label, good]);
  mats[4].color = new THREE.Color().setScalar(1 - dim * 0.65);
  mats[4].emissive = new THREE.Color(good ? "#C6FF33" : "#000000");
  mats[4].emissiveIntensity = glow * 0.25;
  return <mesh geometry={cardGeo} material={mats} position={[position[0], position[1], position[2] + lift]} rotation={[0, Math.PI * (1 - flip), 0]} />;
};

/**
 * Four cards in space: they fly in, flip in a stagger, then the right one lifts and glows.
 * Frames are local: `flipAt` and `pickAt`.
 */
export const Cards3D: React.FC<{ labels: string[]; good: number; flipAt?: number; pickAt?: number; orbit?: number }> = ({ labels, good, flipAt = 10, pickAt = 34, orbit = 1 }) => {
  const f = useCurrentFrame();
  const pos: [number, number, number][] = [
    [-1.12, 1.4, 0],
    [1.12, 1.4, 0],
    [-1.12, -1.4, 0],
    [1.12, -1.4, 0],
  ];
  const camAng = map(f, [0, 60], [-0.5, 0.25], inOutCubic) * orbit;
  const camZ = map(f, [0, 60], [13.5, 10.6], inOutCubic);
  return (
    <Canvas fov={42} z={0}>
      <group position={[0, 0, -camZ]} rotation={[0.08 + Math.sin(f / 30) * 0.03, camAng, 0]}>
        <Studio rim="#7C4DFF" fill="#C6FF33" envIntensity={0.7} />
        {f >= pickAt && <pointLight position={[pos[good][0], pos[good][1], 2]} intensity={map(f, [pickAt, pickAt + 8], [0, 40])} distance={8} color="#C6FF33" />}
        {labels.map((l, i) => {
          const fly = p01(f, i * 2, i * 2 + 14, expoOut);
          const fl = p01(f, flipAt + i * 3, flipAt + i * 3 + 10, backOut);
          const isGood = i === good;
          const lift = isGood ? map(f, [pickAt, pickAt + 10], [0, 1.6], backOut) : 0;
          const dim = !isGood ? p01(f, pickAt, pickAt + 8) : 0;
          const p: [number, number, number] = [pos[i][0] * (0.6 + 0.4 * fly), pos[i][1] * (0.6 + 0.4 * fly), (1 - fly) * -14];
          return <Card3D key={i} label={l} good={isGood} position={p} flip={fl} lift={lift} dim={dim} glow={isGood ? p01(f, pickAt, pickAt + 8) : 0} />;
        })}
      </group>
    </Canvas>
  );
};

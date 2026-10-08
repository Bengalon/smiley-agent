import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, ChipColor, Coin3D, Die3D, Studio } from "./Chips3D";
import { backOut, ease, prog, range, rnd } from "../anim";

const Canvas: React.FC<{ children: React.ReactNode; fov?: number; camZ?: number; camY?: number; style?: React.CSSProperties }> = ({
  children,
  fov = 35,
  camZ = 14,
  camY = 0,
  style,
}) => {
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      style={{ position: "absolute", inset: 0, ...style }}
      camera={{ fov, position: [0, camY, camZ], near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    >
      {children}
    </ThreeCanvas>
  );
};

const TOWER: ChipColor[] = ["black", "lime", "violet", "white", "black", "lime", "violet", "black", "white", "lime", "black", "violet"];

/** The hero prop: a glossy chip tower with dice, floating chips and a coin. */
export const HeroTower: React.FC<{ at?: number; y?: number; scale?: number; spin?: number; chips?: number; dice?: boolean; float?: boolean; grey?: boolean }> = ({
  at = 0,
  y = 0,
  scale = 1,
  spin = 0.012,
  chips = 10,
  dice = true,
  float = true,
}) => {
  const f = useCurrentFrame();
  const t = f - at;
  return (
    <Canvas>
      <Studio />
      <group position={[0, y, 0]} scale={scale} rotation={[0.38, t * spin, 0]}>
        {range(chips).map((i) => {
          const d = prog(t, i * 2, i * 2 + 14, backOut);
          return (
            <Chip
              key={i}
              color={TOWER[i % TOWER.length]}
              label={i === chips - 1 ? "100" : ""}
              position={[Math.sin(i * 1.7) * 0.05, -1.6 + i * 0.2 + (1 - d) * 9, Math.cos(i * 2.1) * 0.05]}
              rotation={[0, i * 0.7, 0]}
            />
          );
        })}
        {dice && (
          <>
            <Die3D red position={[-2.3, -1.15 + Math.sin(t / 22) * 0.12, 1.1]} rotation={[0.5 + t * 0.01, 0.7 + t * 0.013, 0.2]} scale={0.62 * prog(t, 10, 26, backOut)} />
            <Die3D position={[2.1, -1.2 + Math.cos(t / 25) * 0.12, 1.3]} rotation={[0.2, -0.5 - t * 0.012, 0.4 + t * 0.008]} scale={0.55 * prog(t, 14, 30, backOut)} />
          </>
        )}
        {float &&
          range(5).map((i) => {
            const a = (i / 5) * Math.PI * 2 + t * 0.02;
            const r = 3 + (i % 2) * 0.6;
            const p = prog(t, 18 + i * 3, 34 + i * 3, backOut);
            return i === 2 ? (
              <Coin3D key={i} position={[Math.cos(a) * r, 0.8 + Math.sin(t / 15 + i) * 0.4, Math.sin(a) * r * 0.6]} rotation={[t * 0.05, 0, t * 0.03 + i]} scale={0.5 * p} />
            ) : (
              <Chip
                key={i}
                color={(["violet", "lime", "black", "white", "red"] as ChipColor[])[i]}
                position={[Math.cos(a) * r, 0.3 + Math.sin(t / 18 + i) * 0.5 + i * 0.2, Math.sin(a) * r * 0.6]}
                rotation={[1.1 + Math.sin(t / 30 + i) * 0.4, t * 0.03, 0.4 * i]}
                scale={0.55 * p}
              />
            );
          })}
      </group>
    </Canvas>
  );
};

/** Chips and coins raining from the top (the result screen win effect). */
export const ChipRain: React.FC<{ at: number; count?: number; seed?: string }> = ({ at, count = 34, seed = "rain" }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0) return null;
  const cols: ChipColor[] = ["black", "lime", "violet", "white", "red", "blue", "green"];
  return (
    <Canvas fov={40} camZ={18}>
      <Studio />
      {range(count).map((i) => {
        const delay = rnd(`${seed}d${i}`) * 40;
        const tt = Math.max(0, t - delay) / 30;
        const x = (rnd(`${seed}x${i}`) - 0.5) * 14;
        const z = (rnd(`${seed}z${i}`) - 0.5) * 8;
        const y0 = 10 + rnd(`${seed}y${i}`) * 4;
        const y = y0 - (4 + rnd(`${seed}v${i}`) * 3) * tt - 6 * tt * tt;
        const rot: [number, number, number] = [tt * (2 + rnd(`${seed}a${i}`) * 4), tt * 3, tt * (1 + rnd(`${seed}b${i}`) * 3)];
        if (t < delay) return null;
        return i % 5 === 0 ? (
          <Coin3D key={i} position={[x, y, z]} rotation={rot} scale={0.55} />
        ) : (
          <Chip key={i} color={cols[i % cols.length]} position={[x, y, z]} rotation={rot} scale={0.7} />
        );
      })}
    </Canvas>
  );
};

/** Chips exploding outward toward the camera (logo slam). */
export const ChipBurst: React.FC<{ at: number; count?: number; seed?: string }> = ({ at, count = 22, seed = "burst" }) => {
  const f = useCurrentFrame();
  const t = (f - at) / 30;
  if (t < 0 || t > 2.2) return null;
  const cols: ChipColor[] = ["black", "lime", "violet", "white", "lime", "black"];
  return (
    <Canvas fov={45} camZ={16}>
      <Studio />
      {range(count).map((i) => {
        const a = rnd(`${seed}a${i}`) * Math.PI * 2;
        const el = (rnd(`${seed}e${i}`) - 0.5) * 1.6;
        const sp = 7 + rnd(`${seed}s${i}`) * 9;
        const k = 1 - Math.exp(-t * 2.4);
        const pos: [number, number, number] = [Math.cos(a) * sp * k, Math.sin(a) * sp * k * 0.9 + el - 2 * t * t, (4 + rnd(`${seed}z${i}`) * 8) * k];
        return i % 6 === 3 ? (
          <Coin3D key={i} position={pos} rotation={[t * 6 + i, t * 3, i]} scale={0.6} />
        ) : (
          <Chip key={i} color={cols[i % cols.length]} position={pos} rotation={[t * (4 + i % 3), t * 2, i]} scale={0.75} />
        );
      })}
    </Canvas>
  );
};

/** Grey, joyless luck props for the "luck" opener: tumbling dice. */
export const DiceTumble: React.FC<{ at: number; grey?: boolean }> = ({ at, grey = true }) => {
  const f = useCurrentFrame();
  const t = (f - at) / 30;
  return (
    <Canvas fov={38} camZ={12}>
      <Studio rim={grey ? "#666677" : "#7C4DFF"} fill={grey ? "#999999" : "#C6FF33"} envIntensity={0.6} />
      {range(3).map((i) => {
        const x = -5 + i * 2.6 + t * 3.2;
        const bounce = Math.abs(Math.sin(t * 4 + i)) * Math.exp(-t * 0.8) * 2.2;
        return <Die3D key={i} grey={grey} red={!grey && i === 1} position={[x - 1, -1.2 + bounce + i * 0.6, -i]} rotation={[t * 5 + i, t * 3.5 + i * 2, t * 2]} scale={0.9} />;
      })}
    </Canvas>
  );
};

/** A roulette wheel spinning, tinted grey (luck). */
export const Roulette: React.FC<{ at: number; grey?: boolean }> = ({ at, grey = true }) => {
  const f = useCurrentFrame();
  const t = (f - at) / 30;
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 1024;
    const g = c.getContext("2d")!;
    const n = 37;
    for (let i = 0; i < n; i++) {
      g.beginPath();
      g.moveTo(512, 512);
      g.arc(512, 512, 512, (i / n) * Math.PI * 2, ((i + 1) / n) * Math.PI * 2);
      g.fillStyle = i === 0 ? (grey ? "#777" : "#17B26A") : i % 2 ? (grey ? "#3a3a44" : "#C8102E") : grey ? "#1a1a20" : "#111";
      g.fill();
    }
    g.fillStyle = grey ? "#55555f" : "#7a5a20";
    g.beginPath();
    g.arc(512, 512, 300, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = grey ? "#2a2a30" : "#3a2a10";
    g.beginPath();
    g.arc(512, 512, 120, 0, Math.PI * 2);
    g.fill();
    const tx = new THREE.CanvasTexture(c);
    tx.colorSpace = THREE.SRGBColorSpace;
    return tx;
  }, [grey]);
  const rot = t * 4.2 * Math.exp(-t * 0.15);
  return (
    <Canvas fov={36} camZ={21} camY={7}>
      <Studio rim="#666677" fill="#888888" envIntensity={0.6} />
      <group rotation={[0.85, 0, 0]} position={[0, -0.6, 0]}>
        <mesh rotation={[Math.PI / 2, rot, 0]}>
          <cylinderGeometry args={[4, 4.2, 0.5, 74]} />
          <meshPhysicalMaterial attach="material-0" color="#2a2a30" metalness={0.6} roughness={0.3} />
          <meshPhysicalMaterial attach="material-1" map={tex} roughness={0.35} clearcoat={1} />
          <meshPhysicalMaterial attach="material-2" color="#2a2a30" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[4.25, 0.25, 16, 80]} />
          <meshStandardMaterial color={grey ? "#666" : "#b8892d"} metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[Math.cos(-rot * 1.6) * 3.5, Math.sin(-rot * 1.6) * 3.5, 0.45]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.3} roughness={0.2} />
        </mesh>
      </group>
    </Canvas>
  );
};

export const lerp3 = (f: number, a: number, b: number, from: number, to: number) => interpolate(f, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

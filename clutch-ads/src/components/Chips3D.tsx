import React, { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/** Chip palette by name: [base, accent, ink] (from the site's CHIPSTYLE) */
export const CHIP = {
  black: ["#16121F", "#C6FF33", "#C6FF33"],
  lime: ["#C6FF33", "#16121F", "#11160A"],
  violet: ["#6D35F2", "#C6FF33", "#FFFFFF"],
  white: ["#EEEBF7", "#6D35F2", "#16121F"],
  red: ["#FF3B5C", "#FFFFFF", "#FFFFFF"],
  blue: ["#3D7BFF", "#FFFFFF", "#FFFFFF"],
  green: ["#17B26A", "#FFFFFF", "#FFFFFF"],
  gold: ["#E8B83A", "#FFF1B8", "#5A3A00"],
} as const;
export type ChipColor = keyof typeof CHIP;

const texCache = new Map<string, THREE.Texture[]>();

function chipTextures(color: ChipColor, label: string) {
  const key = `${color}:${label}`;
  if (texCache.has(key)) return texCache.get(key)!;
  const [base, accent, ink] = CHIP[color];
  // top
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  g.save();
  g.translate(256, 256);
  for (let i = 0; i < 8; i++) {
    g.rotate(Math.PI / 4);
    g.fillStyle = accent;
    g.fillRect(-34, -256, 68, 62);
  }
  g.restore();
  g.strokeStyle = accent;
  g.lineWidth = 10;
  g.setLineDash([22, 16]);
  g.beginPath();
  g.arc(256, 256, 160, 0, Math.PI * 2);
  g.stroke();
  g.setLineDash([]);
  g.fillStyle = base;
  g.beginPath();
  g.arc(256, 256, 140, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = ink;
  g.font = "900 120px Unbounded, Arial Black, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(label, 256, 262);
  const top = new THREE.CanvasTexture(c);
  top.colorSpace = THREE.SRGBColorSpace;
  top.anisotropy = 8;
  // edge stripes
  const e = document.createElement("canvas");
  e.width = 1024;
  e.height = 64;
  const h = e.getContext("2d")!;
  h.fillStyle = base;
  h.fillRect(0, 0, 1024, 64);
  for (let i = 0; i < 8; i++) {
    h.fillStyle = accent;
    h.fillRect(i * 128 + 20, 0, 52, 64);
  }
  const side = new THREE.CanvasTexture(e);
  side.colorSpace = THREE.SRGBColorSpace;
  const out = [side, top];
  texCache.set(key, out);
  return out;
}

const chipGeo = new THREE.CylinderGeometry(1, 1, 0.19, 64, 1);
const ringGeo = new THREE.TorusGeometry(0.97, 0.025, 12, 64);

export const Chip: React.FC<{
  color?: ChipColor;
  label?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({ color = "black", label = "", position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const [side, top] = useMemo(() => chipTextures(color, label), [color, label]);
  const mats = useMemo(() => {
    const common = { roughness: 0.38, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08 };
    return [
      new THREE.MeshPhysicalMaterial({ map: side, ...common }),
      new THREE.MeshPhysicalMaterial({ map: top, ...common }),
      new THREE.MeshPhysicalMaterial({ map: top, ...common }),
    ];
  }, [side, top]);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh geometry={chipGeo} material={mats} />
      <mesh geometry={ringGeo} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#d8d8e8" metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
};

const coinGeo = new THREE.CylinderGeometry(1, 1, 0.14, 48);
export const Coin3D: React.FC<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => (
  <mesh geometry={coinGeo} position={position} rotation={rotation} scale={scale}>
    <meshStandardMaterial color="#FFC94D" metalness={1} roughness={0.22} />
  </mesh>
);

const dieTexCache = new Map<string, THREE.Texture>();
function dieFace(n: number, base: string, pip: string) {
  const key = `${n}${base}${pip}`;
  if (dieTexCache.has(key)) return dieTexCache.get(key)!;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  const P: Record<number, [number, number][]> = {
    1: [[128, 128]], 2: [[70, 70], [186, 186]], 3: [[66, 66], [128, 128], [190, 190]],
    4: [[72, 72], [184, 72], [72, 184], [184, 184]], 5: [[68, 68], [188, 68], [128, 128], [68, 188], [188, 188]],
    6: [[72, 62], [184, 62], [72, 128], [184, 128], [72, 194], [184, 194]],
  };
  g.fillStyle = pip;
  for (const [x, y] of P[n]) {
    g.beginPath();
    g.arc(x, y, 24, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  dieTexCache.set(key, t);
  return t;
}

const dieGeo = new RoundedBoxGeometry(1.4, 1.4, 1.4, 5, 0.22);
export const Die3D: React.FC<{ position?: [number, number, number]; rotation?: [number, number, number]; scale?: number; red?: boolean; grey?: boolean }> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  red = false,
  grey = false,
}) => {
  const base = grey ? "#9A98A6" : red ? "#FF3B5C" : "#F4F2FB";
  const pip = red ? "#FFFFFF" : "#16121F";
  const mats = useMemo(
    () => [1, 6, 2, 5, 3, 4].map((n) => new THREE.MeshPhysicalMaterial({ map: dieFace(n, base, pip), roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 })),
    [base, pip],
  );
  return <mesh geometry={dieGeo} material={mats} position={position} rotation={rotation} scale={scale} />;
};

/** Studio lighting: PMREM room environment + key, violet rim and lime point lights (PRD 15.5). */
export const Studio: React.FC<{ rim?: string; fill?: string; envIntensity?: number }> = ({ rim = "#7C4DFF", fill = "#C6FF33", envIntensity = 0.55 }) => {
  const { gl, scene } = useThree();
  useMemo(() => {
    gl.toneMapping = THREE.NeutralToneMapping;
    gl.toneMappingExposure = 0.95;
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = envIntensity;
  }, [gl, scene, envIntensity]);
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 8, 6]} intensity={2.2} />
      <directionalLight position={[-6, 2, -4]} intensity={2.4} color={rim} />
      <pointLight position={[3, -2, 4]} intensity={30} distance={14} color={fill} />
    </>
  );
};

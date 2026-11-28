import React, { useMemo } from "react";
import * as THREE from "three";

export const COL = {
  ink: "#0a0f2c",
  navy: "#101a4a",
  teal: "#35b6c8",
  tealDark: "#1b7f95",
  cream: "#fff1d6",
  pink: "#ff8fa8",
  pinkDark: "#e0607f",
  blue: "#58a8ff",
  orange: "#ff9a3c",
  yellow: "#ffd84a",
  white: "#ffffff",
  skin: "#f0b48a",
  wood: "#b9814f",
  grey: "#8d99ae",
  dark: "#2b2f45",
  green: "#59d68c",
  purple: "#9b7bff",
};

export const rnd = (i: number, salt = 0) => {
  const s = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
export const range = (t: number, a: number, b: number) => smooth((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const backOut = (x: number) => {
  const c = clamp01(x);
  const s = 1.70158;
  return 1 + (s + 1) * Math.pow(c - 1, 3) + s * Math.pow(c - 1, 2);
};

type FlatProps = {
  color: string;
  emissive?: string;
  ei?: number;
  opacity?: number;
  rough?: number;
};
export const Flat: React.FC<FlatProps> = ({ color, emissive = "#000000", ei = 0, opacity = 1, rough = 0.85 }) => (
  <meshStandardMaterial color={color} flatShading emissive={emissive} emissiveIntensity={ei} transparent={opacity < 1} opacity={opacity} roughness={rough} metalness={0.05} />
);

export const Lights: React.FC<{ warm?: number; key?: string }> = ({ warm = 0 }) => (
  <>
    <ambientLight intensity={0.9} color={warm > 0 ? "#ffe6c8" : "#cfe0ff"} />
    <directionalLight position={[4, 7, 6]} intensity={2.0} color={warm > 0 ? "#fff0d8" : "#ffffff"} />
    <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#7fb2ff" />
  </>
);

/* ---------------- brain (3 colourable regions) ---------------- */
function buildBrain() {
  const src = new THREE.IcosahedronGeometry(1, 3).toNonIndexed();
  const pos = src.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const n = Math.sin(x * 7.1 + y * 4.3) * Math.cos(z * 6.2 + x * 3.1) * 0.07 + Math.sin(z * 11.3 + y * 8.1) * Math.sin(x * 9.7) * 0.05;
    const l = Math.hypot(x, y, z);
    const k = (l + n) / l;
    x *= k; y *= k; z *= k;
    x *= 1.38; y *= 0.95; z *= 1.05;
    if (Math.abs(z) < 0.14 && y > 0) y -= 0.16 * (1 - Math.abs(z) / 0.14);
    pos.setXYZ(i, x, y, z);
  }
  const groups: Record<string, number[]> = { base: [], pre: [], dmn: [] };
  for (let f = 0; f < pos.count; f += 3) {
    const cx = (pos.getX(f) + pos.getX(f + 1) + pos.getX(f + 2)) / 3;
    const cy = (pos.getY(f) + pos.getY(f + 1) + pos.getY(f + 2)) / 3;
    const cz = (pos.getZ(f) + pos.getZ(f + 1) + pos.getZ(f + 2)) / 3;
    const key = cx < -0.55 && cy > -0.45 ? "pre" : cx > -0.35 && cx < 0.75 && cy > 0.32 && Math.abs(cz) < 0.78 ? "dmn" : "base";
    for (let v = 0; v < 3; v++) groups[key].push(pos.getX(f + v), pos.getY(f + v), pos.getZ(f + v));
  }
  const mk = (arr: number[]) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    g.computeVertexNormals();
    return g;
  };
  return { base: mk(groups.base), pre: mk(groups.pre), dmn: mk(groups.dmn) };
}
let brainCache: ReturnType<typeof buildBrain> | null = null;
const getBrain = () => (brainCache ??= buildBrain());

export const BRAIN_BASE = '#ff9bb0';
export const Brain: React.FC<{ base?: string; pre?: string; dmn?: string; preEi?: number; dmnEi?: number; baseEi?: number; emissive?: string }> = ({ base = '#ff9bb0', pre = '#ffb0c0', dmn = '#ff8da4', preEi = 0, dmnEi = 0, baseEi = 0, emissive = "#ff9a3c" }) => {
  const g = useMemo(getBrain, []);
  return (
    <group>
      <mesh geometry={g.base}><Flat color={base} emissive={emissive} ei={baseEi} /></mesh>
      <mesh geometry={g.pre}><Flat color={pre} emissive={emissive} ei={preEi} /></mesh>
      <mesh geometry={g.dmn}><Flat color={dmn} emissive={emissive} ei={dmnEi} /></mesh>
      <mesh position={[0.05, -1.0, -0.1]} scale={[0.5, 0.22, 0.3]}><icosahedronGeometry args={[1, 1]} /><Flat color={base} emissive={emissive} ei={baseEi} /></mesh>
    </group>
  );
};

/* ---------------- person ---------------- */
export type Pose = { armL?: number; armR?: number; legL?: number; legR?: number; lean?: number; headX?: number; headZ?: number; armLz?: number; armRz?: number };
export const Person: React.FC<{ shirt?: string; pants?: string; hair?: string; skin?: string; pose?: Pose; sit?: boolean; mouth?: number }> = ({ shirt = COL.orange, pants = COL.dark, hair = "#2a1d1a", skin = COL.skin, pose = {}, sit = false, mouth = 0 }) => {
  const { armL = 0, armR = 0, legL = 0, legR = 0, lean = 0, headX = 0, headZ = 0, armLz = 0.12, armRz = 0.12 } = pose;
  return (
    <group rotation={[lean, 0, 0]}>
      <mesh position={[0, 1.25, 0]}><boxGeometry args={[0.95, 1.2, 0.55]} /><Flat color={shirt} /></mesh>
      <mesh position={[0, 0.62, 0]}><boxGeometry args={[0.95, 0.35, 0.55]} /><Flat color={pants} /></mesh>
      <group position={[0, 1.95, 0]} rotation={[headX, 0, headZ]}>
        <mesh position={[0, 0.34, 0]}><icosahedronGeometry args={[0.46, 1]} /><Flat color={skin} /></mesh>
        <mesh position={[0, 0.5, -0.02]} scale={[1, 0.78, 1]}><sphereGeometry args={[0.5, 7, 5, 0, Math.PI * 2, 0, Math.PI * 0.55]} /><Flat color={hair} /></mesh>
        <mesh position={[-0.16, 0.36, 0.41]}><sphereGeometry args={[0.055, 6, 5]} /><meshStandardMaterial color="#14141c" /></mesh>
        <mesh position={[0.16, 0.36, 0.41]}><sphereGeometry args={[0.055, 6, 5]} /><meshStandardMaterial color="#14141c" /></mesh>
        <mesh position={[0, 0.19, 0.43]} scale={[1, 0.25 + mouth, 0.5]}><sphereGeometry args={[0.1, 6, 5]} /><meshStandardMaterial color="#8a2f3b" /></mesh>
      </group>
      {[1, -1].map((s) => (
        <group key={`a${s}`} position={[s * 0.62, 1.78, 0]} rotation={[s > 0 ? armL : armR, 0, s * (s > 0 ? armLz : armRz)]}>
          <mesh position={[0, -0.42, 0]}><boxGeometry args={[0.26, 0.9, 0.26]} /><Flat color={shirt} /></mesh>
          <mesh position={[0, -0.95, 0]}><icosahedronGeometry args={[0.15, 0]} /><Flat color={skin} /></mesh>
        </group>
      ))}
      {[1, -1].map((s) => (
        <group key={`l${s}`} position={[s * 0.26, 0.5, 0]} rotation={[sit ? -Math.PI / 2 : s > 0 ? legL : legR, 0, 0]}>
          <mesh position={[0, -0.45, 0]}><boxGeometry args={[0.34, 0.95, 0.34]} /><Flat color={pants} /></mesh>
          <mesh position={[0, -0.97, 0.1]}><boxGeometry args={[0.36, 0.14, 0.5]} /><Flat color="#f4f4f4" /></mesh>
        </group>
      ))}
    </group>
  );
};

/* ---------------- props ---------------- */
export const Bulb: React.FC<{ glow?: number; scale?: number }> = ({ glow = 1, scale = 1 }) => (
  <group scale={scale}>
    <mesh position={[0, 0.2, 0]}><icosahedronGeometry args={[0.55, 2]} /><Flat color={glow > 0.05 ? COL.yellow : "#cfd6e6"} emissive={COL.yellow} ei={glow * 1.4} rough={0.4} /></mesh>
    <mesh position={[0, -0.5, 0]}><cylinderGeometry args={[0.24, 0.2, 0.26, 8]} /><Flat color="#9aa3b5" /></mesh>
    <mesh position={[0, -0.72, 0]}><cylinderGeometry args={[0.18, 0.12, 0.2, 8]} /><Flat color="#6f778a" /></mesh>
    {glow > 0.02 && (
      <mesh position={[0, 0.2, 0]} scale={1.9 + 0.3 * glow}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshBasicMaterial color="#ffe27a" transparent opacity={0.16 * glow} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    )}
  </group>
);

export const Stars: React.FC<{ t: number; n?: number; spread?: [number, number, number]; z?: number }> = ({ t, n = 90, spread = [14, 20, 6], z = -6 }) => (
  <group>
    {Array.from({ length: n }, (_, i) => {
      const tw = 0.6 + 0.4 * Math.sin(t * 2 + i * 1.7);
      return (
        <mesh key={i} position={[(rnd(i, 1) - 0.5) * spread[0], (rnd(i, 2) - 0.5) * spread[1], z - rnd(i, 3) * spread[2]]} scale={(0.04 + rnd(i, 4) * 0.09) * tw}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color={i % 5 === 0 ? "#9fd0ff" : "#ffffff"} />
        </mesh>
      );
    })}
  </group>
);

export const Drops: React.FC<{ t: number; n?: number; height?: number; spread?: number; speed?: number; origin?: [number, number, number]; opacity?: number }> = ({ t, n = 70, height = 4.4, spread = 1.4, speed = 1.6, origin = [0, 0, 0], opacity = 1 }) => (
  <group position={origin}>
    {Array.from({ length: n }, (_, i) => {
      const ph = (t * speed + rnd(i, 5)) % 1;
      const w = 0.25 + ph;
      return (
        <mesh key={i} position={[(rnd(i, 6) - 0.5) * spread * w, -ph * height, (rnd(i, 7) - 0.5) * spread * w]} scale={[0.6, 1.6, 0.6]}>
          <icosahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial color="#a8eaff" emissive="#4cc3f0" emissiveIntensity={0.7} flatShading transparent opacity={0.9 * opacity * (1 - Math.pow(ph, 6))} />
        </mesh>
      );
    })}
  </group>
);

export const ShowerHead: React.FC = () => (
  <group>
    <mesh position={[0, 0.9, -0.4]}><cylinderGeometry args={[0.07, 0.07, 1.8, 6]} /><Flat color="#c9d2e0" rough={0.3} /></mesh>
    <mesh position={[0, 1.78, 0.1]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 1.0, 6]} /><Flat color="#c9d2e0" rough={0.3} /></mesh>
    <mesh position={[0, 1.7, 0.7]} rotation={[0.25, 0, 0]}><cylinderGeometry args={[0.2, 0.62, 0.22, 10]} /><Flat color="#dfe6f1" rough={0.3} /></mesh>
    <mesh position={[0, 1.58, 0.72]}><cylinderGeometry args={[0.6, 0.6, 0.04, 10]} /><Flat color="#b7c2d3" rough={0.3} /></mesh>
  </group>
);

export const TileWall: React.FC<{ w?: number; h?: number; color?: string; z?: number }> = ({ w = 14, h = 12, color = COL.teal, z = -2 }) => (
  <group position={[0, 0, z]}>
    <mesh><boxGeometry args={[w, h, 0.2]} /><Flat color={color} rough={0.5} /></mesh>
    {Array.from({ length: Math.round(w / 1.4) }, (_, i) => (
      <mesh key={`v${i}`} position={[-w / 2 + 0.7 + i * 1.4, 0, 0.12]}><boxGeometry args={[0.05, h, 0.04]} /><Flat color={COL.tealDark} /></mesh>
    ))}
    {Array.from({ length: Math.round(h / 1.4) }, (_, i) => (
      <mesh key={`h${i}`} position={[0, -h / 2 + 0.7 + i * 1.4, 0.12]}><boxGeometry args={[w, 0.05, 0.04]} /><Flat color={COL.tealDark} /></mesh>
    ))}
  </group>
);

export const Desk: React.FC<{ screen?: number }> = ({ screen = 1 }) => (
  <group>
    <mesh position={[0, 1.2, 0]}><boxGeometry args={[3.2, 0.14, 1.5]} /><Flat color={COL.wood} /></mesh>
    {[[-1.5, -0.65], [1.5, -0.65], [-1.5, 0.65], [1.5, 0.65]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.6, z]}><boxGeometry args={[0.14, 1.2, 0.14]} /><Flat color="#8c5d36" /></mesh>
    ))}
    <mesh position={[0.2, 1.3, -0.2]}><boxGeometry args={[1.3, 0.06, 0.9]} /><Flat color="#c9ced9" /></mesh>
    <mesh position={[0.2, 1.8, -0.62]} rotation={[-0.18, 0, 0]}><boxGeometry args={[1.3, 0.85, 0.05]} /><Flat color="#aeb4c2" /></mesh>
    <mesh position={[0.2, 1.8, -0.58]} rotation={[-0.18, 0, 0]}><boxGeometry args={[1.15, 0.7, 0.03]} /><Flat color="#6fb6ff" emissive="#6fb6ff" ei={0.5 * screen} /></mesh>
    <mesh position={[-1.1, 1.38, 0.2]}><cylinderGeometry args={[0.16, 0.14, 0.26, 8]} /><Flat color="#ffffff" /></mesh>
  </group>
);

export const Chair: React.FC = () => (
  <group>
    <mesh position={[0, 0.7, 0]}><boxGeometry args={[1.1, 0.16, 1.0]} /><Flat color="#4a5370" /></mesh>
    <mesh position={[0, 1.45, -0.5]}><boxGeometry args={[1.0, 1.3, 0.14]} /><Flat color="#4a5370" /></mesh>
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.08, 0.08, 0.7, 6]} /><Flat color="#2f3550" /></mesh>
    <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[0.6, 0.6, 0.06, 6]} /><Flat color="#2f3550" /></mesh>
  </group>
);

export const WallClock: React.FC<{ hour: number; minute: number }> = ({ hour, minute }) => (
  <group>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.85, 0.85, 0.14, 14]} /><Flat color="#fdfdfd" /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.02]}><cylinderGeometry args={[0.95, 0.95, 0.12, 14]} /><Flat color={COL.dark} /></mesh>
    {Array.from({ length: 12 }, (_, i) => (
      <mesh key={i} position={[Math.sin((i / 12) * 6.283) * 0.68, Math.cos((i / 12) * 6.283) * 0.68, 0.09]} scale={[0.04, i % 3 === 0 ? 0.12 : 0.07, 0.02]}><boxGeometry args={[1, 1, 1]} /><Flat color={COL.dark} /></mesh>
    ))}
    <group position={[0, 0, 0.1]} rotation={[0, 0, -hour]}><mesh position={[0, 0.2, 0]}><boxGeometry args={[0.1, 0.5, 0.04]} /><Flat color={COL.dark} /></mesh></group>
    <group position={[0, 0, 0.13]} rotation={[0, 0, -minute]}><mesh position={[0, 0.3, 0]}><boxGeometry args={[0.07, 0.72, 0.04]} /><Flat color="#e0405a" /></mesh></group>
  </group>
);

export const Papers: React.FC<{ count: number; t?: number }> = ({ count }) => (
  <group>
    {Array.from({ length: Math.floor(count) }, (_, i) => {
      const a = rnd(i, 9) * 6.283, d = 0.5 + rnd(i, 10) * 1.6;
      const drop = Math.min(1, Math.max(0, (count - i) * 3));
      return (
        <mesh key={i} position={[Math.cos(a) * d, 0.16 + (1 - drop) * 2.4, Math.sin(a) * d * 0.7]} rotation={[rnd(i, 11) * 3, rnd(i, 12) * 3, 0]} scale={0.2 + rnd(i, 13) * 0.08}>
          <icosahedronGeometry args={[1, 0]} />
          <Flat color={i % 3 ? "#f6f1e4" : "#e9e2cc"} />
        </mesh>
      );
    })}
  </group>
);

export const Phone: React.FC = () => (
  <group>
    <mesh><boxGeometry args={[0.7, 1.3, 0.08]} /><Flat color="#222638" /></mesh>
    <mesh position={[0, 0, 0.05]}><boxGeometry args={[0.58, 1.1, 0.02]} /><Flat color="#7ec8ff" emissive="#7ec8ff" ei={0.6} /></mesh>
  </group>
);
export const Car: React.FC = () => (
  <group>
    <mesh position={[0, 0.3, 0]}><boxGeometry args={[1.9, 0.5, 0.9]} /><Flat color="#e5484d" /></mesh>
    <mesh position={[-0.1, 0.72, 0]}><boxGeometry args={[1.0, 0.4, 0.8]} /><Flat color="#c93b40" /></mesh>
    {[[-0.6, 0.45], [0.6, 0.45], [-0.6, -0.45], [0.6, -0.45]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.22, 0.22, 0.16, 8]} /><Flat color="#1c1f2e" /></mesh>
    ))}
  </group>
);
export const Mic: React.FC = () => (
  <group>
    <mesh position={[0, 0.35, 0]}><icosahedronGeometry args={[0.3, 1]} /><Flat color="#d9dee8" rough={0.3} /></mesh>
    <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.1, 0.13, 0.7, 6]} /><Flat color="#2b2f45" /></mesh>
  </group>
);

export const Stick: React.FC<{ from: [number, number, number]; to: [number, number, number]; r?: number; color?: string }> = ({ from, to, r = 0.03, color = "#ffd9a8" }) => {
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a);
  const len = dir.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return (
    <mesh position={mid.toArray()} quaternion={q} scale={[1, len, 1]}><cylinderGeometry args={[r, r, 1, 5]} /><Flat color={color} /></mesh>
  );
};
export const Molecule: React.FC<{ color?: string }> = ({ color = COL.orange }) => {
  const sats: [number, number, number][] = [[0.42, 0.2, 0], [-0.3, 0.38, 0.2], [-0.1, -0.4, -0.3], [0.1, 0.0, 0.46]];
  return (
    <group>
      <mesh><icosahedronGeometry args={[0.2, 1]} /><Flat color={color} emissive={color} ei={0.45} /></mesh>
      {sats.map((s, i) => (
        <group key={i}>
          <Stick from={[0, 0, 0]} to={s} />
          <mesh position={s}><icosahedronGeometry args={[0.1, 0]} /><Flat color={i % 2 ? "#ffe0b0" : "#ff6b6b"} emissive={color} ei={0.3} /></mesh>
        </group>
      ))}
    </group>
  );
};

export const Notepad: React.FC<{ bag?: boolean }> = ({ bag = true }) => (
  <group>
    <mesh><boxGeometry args={[1.0, 1.4, 0.12]} /><Flat color="#ffd84a" /></mesh>
    <mesh position={[0, -0.02, 0.07]}><boxGeometry args={[0.86, 1.2, 0.03]} /><Flat color="#fffaf0" /></mesh>
    {[0.35, 0.15, -0.05, -0.25, -0.45].map((y, i) => (
      <mesh key={i} position={[0, y, 0.09]}><boxGeometry args={[0.62, 0.025, 0.01]} /><Flat color="#9bb7e8" /></mesh>
    ))}
    {Array.from({ length: 6 }, (_, i) => (
      <mesh key={i} position={[-0.3 + i * 0.12, 0.74, 0.02]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.07, 0.015, 5, 8]} /><Flat color="#6f778a" /></mesh>
    ))}
    {bag && (
      <mesh position={[0, 0, 0.03]}><boxGeometry args={[1.2, 1.7, 0.3]} /><meshStandardMaterial color="#cfeeff" transparent opacity={0.22} roughness={0.2} flatShading /></mesh>
    )}
  </group>
);
export const Pencil: React.FC = () => (
  <group>
    <mesh><cylinderGeometry args={[0.05, 0.05, 1.0, 6]} /><Flat color="#ff6b6b" /></mesh>
    <mesh position={[0, -0.58, 0]} rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.05, 0.16, 6]} /><Flat color="#f2d3a3" /></mesh>
    <mesh position={[0, 0.52, 0]}><cylinderGeometry args={[0.052, 0.052, 0.08, 6]} /><Flat color="#c9ced9" /></mesh>
  </group>
);
export const Planet: React.FC<{ color: string; r?: number; ring?: string }> = ({ color, r = 0.4, ring }) => (
  <group>
    <mesh><icosahedronGeometry args={[r, 1]} /><Flat color={color} /></mesh>
    {ring && (
      <mesh rotation={[1.2, 0.2, 0]}><ringGeometry args={[r * 1.35, r * 1.9, 18]} /><meshStandardMaterial color={ring} flatShading side={THREE.DoubleSide} /></mesh>
    )}
  </group>
);
export const Padlock: React.FC<{ open: number }> = ({ open }) => (
  <group>
    <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.9, 0.7, 0.35]} /><Flat color="#ffc93c" emissive="#ffb300" ei={0.15} rough={0.4} /></mesh>
    <mesh position={[0, -0.12, 0.19]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.07, 0.07, 0.03, 6]} /><Flat color="#6b4a00" /></mesh>
    <group position={[-0.28, 0.25, 0]} rotation={[0, 0, open * 0.0]}>
      <group rotation={[0, open * Math.PI, 0]}>
        <mesh position={[0.28, 0.12, 0]}><torusGeometry args={[0.28, 0.07, 6, 10, Math.PI]} /><Flat color="#d9dee8" rough={0.3} /></mesh>
      </group>
    </group>
  </group>
);
export const Flask: React.FC<{ t: number; fill?: number }> = ({ t, fill = 1 }) => (
  <group>
    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.22, 0.85, 1.1, 9]} /><meshStandardMaterial color="#dff6ff" transparent opacity={0.3} flatShading roughness={0.2} /></mesh>
    <mesh position={[0, 1.3, 0]}><cylinderGeometry args={[0.22, 0.22, 0.6, 9]} /><meshStandardMaterial color="#dff6ff" transparent opacity={0.3} flatShading roughness={0.2} /></mesh>
    <mesh position={[0, 0.3 * fill + 0.05, 0]} scale={[1, fill, 1]}><cylinderGeometry args={[0.25, 0.72, 0.6, 9]} /><Flat color={COL.pink} emissive={COL.pink} ei={0.35} /></mesh>
    {Array.from({ length: 7 }, (_, i) => {
      const ph = (t * 0.7 + rnd(i, 20)) % 1;
      return <mesh key={i} position={[(rnd(i, 21) - 0.5) * 0.7 * (1 - ph * 0.6), 0.3 + ph * 1.8, 0]} scale={0.07 + rnd(i, 22) * 0.08}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#ffd0e0" emissive="#ff8fa8" emissiveIntensity={0.5} flatShading transparent opacity={0.9 * (1 - ph)} /></mesh>;
    })}
  </group>
);

export const Rig: React.FC<{ x?: number; y?: number; z?: number; ry?: number; rx?: number; children: React.ReactNode }> = ({ x = 0, y = 0, z = 0, ry = 0, rx = 0, children }) => (
  <group position={[x, y, z]} rotation={[rx, ry, 0]}>{children}</group>
);

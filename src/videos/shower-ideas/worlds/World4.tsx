import React from "react";
import { Brain, Flask, Lights, COL, range, backOut, lerp, Rig, Molecule, Phone, Car, Mic, Stars, Bulb, Drops, Notepad, Pencil, TileWall, rnd, Stick } from "./parts";

const Wand: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <mesh rotation={[0, 0, Math.PI / 4]}><cylinderGeometry args={[0.06, 0.06, 1.6, 6]} /><meshStandardMaterial color="#3a2f55" flatShading /></mesh>
    <mesh position={[0.62, 0.62, 0]} scale={0.22 + 0.04 * Math.sin(t * 10)}><octahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#ffd84a" emissive="#ffb300" emissiveIntensity={0.8} flatShading /></mesh>
    {Array.from({ length: 8 }, (_, i) => {
      const ph = (t * 1.3 + i / 8) % 1;
      return <mesh key={i} position={[0.62 + Math.cos(i * 2.4) * ph * 0.7, 0.62 + Math.sin(i * 2.4) * ph * 0.7, 0]} scale={0.06 * (1 - ph)}><octahedronGeometry args={[1, 0]} /><meshBasicMaterial color="#fff2a8" /></mesh>;
    })}
  </group>
);

/* 4. It's not magic, it's brain chemistry */
export const World4: React.FC<{ t: number }> = ({ t }) => {
  const wandOut = range(t, 1.0, 1.6);
  const xIn = range(t, 0.9, 1.15) * (1 - range(t, 1.5, 1.8));
  const flaskIn = range(t, 1.7, 2.2);
  const glow = range(t, 2.4, 3.2);
  return (
    <>
      <color attach="background" args={[COL.navy]} />
      <fog attach="fog" args={[COL.navy, 14, 30]} />
      <Lights />
      <Stars t={t} n={50} />
      <Rig y={0.4}>
        <group position={[lerp(0, -4, wandOut), 0.9, 0]} scale={1.9 * (1 - wandOut * 0.3)} rotation={[0, 0, t * 0.8 * (1 - wandOut)]}>
          <Wand t={t} />
        </group>
        {xIn > 0 && (
          <group position={[0, 0.9, 0.6]} scale={xIn * 0.9}>
            <mesh rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[2.2, 0.22, 0.12]} /><meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={0.5} flatShading /></mesh>
            <mesh rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[2.2, 0.22, 0.12]} /><meshStandardMaterial color="#ff4d6d" emissive="#ff4d6d" emissiveIntensity={0.5} flatShading /></mesh>
          </group>
        )}
        <group position={[0, -1.1, 0]} scale={1.3 * backOut(flaskIn)}><Flask t={t} /></group>
        <group position={[0, 1.7 + 0.1 * Math.sin(t * 2), 0]} scale={0.6 * backOut(flaskIn)} rotation={[0.1, t * 0.5, 0]}>
          <Brain baseEi={0.4 * glow} preEi={0.4 * glow} dmnEi={0.4 * glow} emissive="#ff8fa8" />
        </group>
      </Rig>
    </>
  );
};

/* 5. Warm water, dopamine, creativity */
export const World5: React.FC<{ t: number }> = ({ t }) => {
  const heat = range(t, 0.6, 3.2);
  const burst = range(t, 2.8, 3.8);
  const orbs = range(t, 5.9, 6.6);
  return (
    <>
      <color attach="background" args={["#241036"]} />
      <fog attach="fog" args={["#241036", 14, 30]} />
      <Lights warm={1} />
      <Stars t={t} n={50} />
      <Rig y={0.2}>
        <group position={[0, -0.15 + 0.06 * Math.sin(t * 2), 0]} rotation={[0.05, Math.sin(t * 0.6) * 0.4, 0]} scale={1.0}>
          <Brain base={`#ff9bb0`} baseEi={0.55 * heat} preEi={0.55 * heat} dmnEi={0.55 * heat} emissive="#ff9a3c" />
        </group>
        <Drops t={t} origin={[0, 2.9, 0.4]} height={2.9} spread={1.6} n={46} opacity={range(t, 0.1, 0.5) * (1 - range(t, 3.4, 4.0))} />
        {Array.from({ length: 6 }, (_, i) => {
          const a = i * 1.047 + t * 0.7;
          const r = 1.0 + burst * 0.7 + 0.1 * Math.sin(t * 2 + i);
          return (
            <group key={i} position={[Math.cos(a) * r * 1.15, -0.4 + Math.sin(i * 2.1 + t) * 0.7 + 0.4, Math.sin(a) * r * 0.6 + 0.6]} scale={backOut(burst) * 0.9} rotation={[t + i, t * 0.7, 0]}>
              <Molecule />
            </group>
          );
        })}
        {[[COL.pink, -1.2, 2.2], [COL.blue, 0.0, 2.6], [COL.yellow, 1.2, 2.1]].map(([c, x, y], i) => (
          <mesh key={i} position={[x as number, (y as number) + 0.1 * Math.sin(t * 3 + i), 0.6]} scale={backOut(orbs) * 0.28}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={c as string} emissive={c as string} emissiveIntensity={0.8} flatShading />
          </mesh>
        ))}
      </Rig>
    </>
  );
};

/* 6. Phone and traffic fade, prefrontal cortex relaxes, DMN gets the mic */
export const World6: React.FC<{ t: number }> = ({ t }) => {
  const away = range(t, 0.9, 3.4);
  const calm = range(t, 4.0, 5.6);
  const hand = range(t, 6.0, 7.0);
  const mx = lerp(-1.25, 0.15, hand), my = lerp(0.4, 1.65, hand) + Math.sin(hand * 3.14) * 0.7;
  const preColor = calm < 0.5 ? "#4da3ff" : "#7be0d0";
  return (
    <>
      <color attach="background" args={[COL.ink]} />
      <fog attach="fog" args={[COL.ink, 14, 30]} />
      <Lights />
      <Stars t={t} n={50} />
      <Rig y={0.1}>
        <group position={[0, 0.0, 0]} rotation={[0, 0.0, 0]} scale={1.05}>
          <Brain base="#ff9bb0" pre={preColor} dmn={hand > 0.6 ? "#ffb04a" : "#ff8da4"} preEi={calm < 0.5 ? 0.35 : 0.1} dmnEi={0.7 * hand} emissive={hand > 0.3 ? "#ff9a3c" : "#4da3ff"} />
        </group>
        <group position={[lerp(-1.3, -3.4, away), 2.3 + away * 0.8, 0.5]} scale={1.2 * (1 - away)} rotation={[0, t * 3 * away, 0.2]}><Phone /></group>
        <group position={[lerp(1.2, 3.6, away), 2.2 + away * 0.8, 0.5]} scale={1.0 * (1 - away)} rotation={[0, 0.5 + t * 2 * away, 0]}><Car /></group>
        {hand > 0 && hand < 1.001 && (
          <group position={[mx, my - 0.5, 0.9]} scale={0.9} rotation={[0, 0, -0.4 + hand * 0.8]}><Mic /></group>
        )}
        {hand >= 1 && (
          <group position={[0.15, 1.05, 0.9]} scale={0.9}><Mic /></group>
        )}
      </Rig>
    </>
  );
};

/* 7. Wandering thoughts connect into an aha */
const NODES = Array.from({ length: 14 }, (_, i) => ({ x: (rnd(i, 31) - 0.5) * 3.2, y: (rnd(i, 32) - 0.5) * 3.2 + 0.7, z: (rnd(i, 33) - 0.5) * 1.2, k: i % 4, c: [COL.pink, COL.blue, COL.yellow, COL.green, COL.purple][i % 5], sp: 0.4 + rnd(i, 34) * 0.7 }));
export const World7: React.FC<{ t: number }> = ({ t }) => {
  const link = range(t, 2.2, 5.0);
  const conv = range(t, 5.4, 6.1);
  const flash = range(t, 6.1, 6.25) * (1 - range(t, 6.25, 6.9));
  const bulb = range(t, 6.1, 6.6);
  const pos = (i: number) => {
    const n = NODES[i];
    const wx = n.x + Math.sin(t * n.sp + i) * 0.35, wy = n.y + Math.cos(t * n.sp * 0.8 + i * 2) * 0.35;
    return [lerp(wx, 0, conv), lerp(wy, 0.8, conv), n.z * (1 - conv)] as [number, number, number];
  };
  return (
    <>
      <color attach="background" args={["#14123a"]} />
      <fog attach="fog" args={["#14123a", 14, 30]} />
      <Lights />
      <Stars t={t} n={60} />
      <Rig y={0.2}>
        {NODES.map((n, i) => {
          const p = pos(i);
          const s = 0.2 * (1 - conv * 0.9);
          return (
            <mesh key={i} position={p} rotation={[t * n.sp, t * 0.6, 0]} scale={s * (n.k === 1 ? 1.1 : 1)}>
              {n.k === 0 ? <boxGeometry args={[1, 1, 1]} /> : n.k === 1 ? <icosahedronGeometry args={[1, 0]} /> : n.k === 2 ? <tetrahedronGeometry args={[1.2, 0]} /> : <octahedronGeometry args={[1.1, 0]} />}
              <meshStandardMaterial color={n.c} emissive={n.c} emissiveIntensity={0.35} flatShading />
            </mesh>
          );
        })}
        {NODES.slice(0, 13).map((_, i) => {
          const k = range(link, i / 14, (i + 1.6) / 14);
          if (k <= 0 || conv > 0.95) return null;
          const a = pos(i), b = pos(i + 1);
          const e: [number, number, number] = [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
          return <Stick key={i} from={a} to={e} r={0.022} color="#9fd0ff" />;
        })}
        {bulb > 0 && (
          <group position={[0, 0.8, 0.2]} scale={backOut(bulb) * 1.3}><Bulb glow={1} /></group>
        )}
        {flash > 0 && (
          <mesh position={[0, 0.8, 0.6]} scale={2.5 + flash * 4}><icosahedronGeometry args={[1, 1]} /><meshBasicMaterial color="#fff6c8" transparent opacity={0.55 * flash} depthWrite={false} /></mesh>
        )}
      </Rig>
    </>
  );
};

/* 9. Waterproof notepad */
export const World9: React.FC<{ t: number }> = ({ t }) => {
  const swing = Math.sin(t * 1.6) * 0.06;
  return (
    <>
      <color attach="background" args={[COL.teal]} />
      <Lights warm={1} />
      <TileWall w={16} h={14} z={-1.2} />
      <Rig z={Math.min(1, t / 3.1) * 1.0} y={0.2}>
        <group position={[0, 2.6, -0.8]}><mesh><boxGeometry args={[0.5, 0.12, 0.3]} /><meshStandardMaterial color="#c9d2e0" flatShading /></mesh></group>
        <Stick from={[0, 2.55, -0.7]} to={[0, 1.65, 0]} r={0.03} color="#c9d2e0" />
        <group position={[0, 0.5, 0]} rotation={[0, 0.2 * Math.sin(t * 1.2), swing]} scale={1.6}>
          <Notepad bag />
          <group position={[0.75, 0.3, 0.25]} rotation={[0, 0, -0.5]}><Pencil /></group>
        </group>
        <Drops t={t} origin={[0.2, 3.1, 0.9]} height={5.6} spread={3.4} n={40} speed={1.1} opacity={0.7} />
      </Rig>
    </>
  );
};

/* 10. Outro: the bulb stays on */
export const World10: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={[COL.ink]} />
    <fog attach="fog" args={[COL.ink, 14, 30]} />
    <Lights warm={1} />
    <Stars t={t} n={70} />
    <Rig y={0.4}>
      <group position={[0, 0.5 + 0.1 * Math.sin(t * 1.8), 0]} scale={backOut(Math.min(1, t / 0.6)) * (1.7 + 0.04 * Math.sin(t * 3))}>
        <Bulb glow={0.85 + 0.15 * Math.sin(t * 3)} />
      </group>
      <Drops t={t} origin={[0, 3.6, 0]} height={6.2} spread={3.8} n={26} speed={0.7} opacity={0.35} />
    </Rig>
  </>
);

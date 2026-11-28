import React from "react";
import { Brain, Padlock, Planet, Stars, Lights, COL, range, backOut, lerp, Rig, Drops, ShowerHead, TileWall, Person, Desk, Chair, WallClock, Papers, Bulb, rnd } from "./parts";

/* 1. Brain in the universe: the lock opens */
export const World1: React.FC<{ t: number }> = ({ t }) => {
  const open = range(t, 3.0, 3.9);
  const burst = range(t, 3.9, 5.0);
  const lockIn = range(t, 2.7, 3.2) * (1 - range(t, 4.2, 4.7));
  const dolly = lerp(0, 1.4, Math.min(1, t / 7.2));
  return (
    <>
      <color attach="background" args={[COL.ink]} />
      <fog attach="fog" args={[COL.ink, 14, 30]} />
      <Lights />
      <Stars t={t} />
      <Rig z={dolly} y={0.5}>
        <group position={[0, 0.15 + 0.08 * Math.sin(t * 1.6), 0]} rotation={[0.1, Math.sin(t * 0.5) * 0.5, 0]} scale={1.0}>
          <Brain preEi={0.15} dmnEi={0.15} baseEi={0.1 + 0.15 * open} />
        </group>
        <group position={[0, 1.35, 0.4]} scale={lockIn * 0.9} rotation={[0, 0.3 * Math.sin(t * 2), 0]}>
          <Padlock open={open} />
        </group>
        {[
          { c: COL.blue, r: 0.3, orbit: 1.5, sp: 0.55, ph: 0.0, ring: undefined as string | undefined, y: 0.9 },
          { c: COL.orange, r: 0.26, orbit: 1.7, sp: 0.4, ph: 2.1, ring: undefined as string | undefined, y: -1.0 },
          { c: COL.purple, r: 0.34, orbit: 1.6, sp: 0.3, ph: 4.0, ring: "#e8d8ff", y: 2.0 },
        ].map((p, i) => {
          const a = t * p.sp + p.ph;
          return (
            <group key={i} position={[Math.cos(a) * p.orbit, p.y + Math.sin(a * 1.3) * 0.2, Math.sin(a) * 1.6]} scale={backOut(burst) * (1 - 0.0)}>
              <Planet color={p.c} r={p.r} ring={p.ring} />
            </group>
          );
        })}
      </Rig>
    </>
  );
};

/* 2. Hot water hits your head */
export const World2: React.FC<{ t: number }> = ({ t }) => (
  <>
    <color attach="background" args={[COL.teal]} />
    <Lights warm={1} />
    <TileWall w={16} h={14} z={-2.2} />
    <Rig y={-0.7} z={Math.min(1, t / 1.8) * 0.8}>
      <group position={[0, 0.9, 0]}><ShowerHead /></group>
      <group position={[0, -2.3, 0.2]} scale={1.5}>
        <Person shirt={COL.orange} pose={{ armL: 0.1, armR: 0.1 }} mouth={0.2} />
      </group>
      <Drops t={t} origin={[0, 2.5, 1.1]} height={3.3} spread={1.7} n={70} />
      {Array.from({ length: 6 }, (_, i) => {
        const ph = (t * 0.5 + i / 6) % 1;
        return (
          <mesh key={i} position={[(rnd(i, 3) - 0.5) * 2.2, 0.2 + ph * 2.6, -0.6]} scale={0.35 + ph * 0.6}>
            <icosahedronGeometry args={[1, 1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2 * (1 - ph)} depthWrite={false} />
          </mesh>
        );
      })}
    </Rig>
  </>
);


/* shared: stuck at the desk, then walk to the shower */
export const DeskShower: React.FC<{ t: number; papersFrom?: number; papersTo?: number; standAt: number; walkA: number; walkB: number; boomAt?: number; calm?: number }> = ({ t, papersFrom = 0.3, papersTo = 3.0, standAt, walkA, walkB, boomAt, calm = 0 }) => {
  const papers = range(t, papersFrom, papersTo) * 9;
  const spin = range(t, papersFrom + 0.2, papersTo - 0.1);
  const walk = range(t, walkA, walkB);
  const standing = t >= standAt;
  const px = lerp(-3.8, 3.6, walk);
  const S = 0.85;
  const pan = lerp(-3.9, 3.6, walk);
  const swing = walk > 0 && walk < 1 ? Math.sin(t * 11) * 0.7 : 0;
  const boom = boomAt === undefined ? 0 : range(t, boomAt, boomAt + 0.4);
  const glow = boomAt === undefined ? 0 : range(t, boomAt + 0.05, boomAt + 0.55);
  const inShower = walk >= 1;
  return (
    <>
      <color attach="background" args={[COL.cream]} />
      <Lights warm={1} />
      <Rig x={-pan * S} y={0.75}>
      <group scale={S}>
        <mesh position={[-4, 0.5, -2.2]}><boxGeometry args={[8, 13, 0.2]} /><meshStandardMaterial color="#ffe3b3" flatShading /></mesh>
        <group position={[4, 0, 0]}><TileWall w={8} h={13} z={-2.2} /></group>
        <mesh position={[0, -5.6, 0]}><boxGeometry args={[24, 6, 9]} /><meshStandardMaterial color="#d9b88a" flatShading /></mesh>
        <group position={[-4.3, 2.4, -2]}><WallClock hour={spin * Math.PI * 0.5} minute={spin * Math.PI * 6} /></group>
        <group position={[-3.9, -2.45, 0.2]}>
          <group position={[0, 0, -0.3]}><Chair /></group>
          <group position={[0, 0, 0.7]}><Desk /></group>
          <group position={[1.9, 0, 0.9]}><Papers count={papers} t={t} /></group>
        </group>
        <group position={[4, 0, 0]}>
          <group position={[0, 0.2, 0]}><ShowerHead /></group>
          <Drops t={t} origin={[0, 1.85, 0.9]} height={4.1} spread={1.5} n={55} opacity={range(t, walkB - 0.6, walkB)} />
        </group>
        <group position={[standing ? px : -3.9, -2.45, standing ? 0.3 : -0.25]}>
          <Person
            shirt={COL.orange}
            sit={!standing}
            pose={standing ? (inShower ? { armL: 0.3, armR: 0.3, headX: -0.15 } : { legL: swing, legR: -swing, armL: -swing * 0.8, armR: swing * 0.8 }) : { armR: -1.9 + 0.5 * Math.sin(t * 7), armL: -0.7, headX: 0.35 + 0.1 * Math.sin(t * 3), headZ: 0.12 }}
            mouth={standing ? 0.2 : 0}
          />
        </group>
        {boom > 0 && (
          <group position={[3.6, 2.2, 0.8]} scale={backOut(boom)}><Bulb glow={glow} /></group>
        )}
        {boomAt !== undefined && boom > 0 &&
          [0, 1, 2].map((i) => {
            const k = Math.min(1, Math.max(0, (t - boomAt - i * 0.12) / 0.8));
            return (
              <mesh key={i} position={[3.6, 2.4, 0.5]} scale={0.3 + k * 3.4}>
                <ringGeometry args={[0.9, 1.0, 20]} />
                <meshBasicMaterial color="#ffe27a" transparent opacity={0.85 * (1 - k)} depthWrite={false} />
              </mesh>
            );
          })}
        {calm > 0 && inShower && (
          <group position={[3.6, 2.2, 0.8]} scale={0.55 * calm}><Bulb glow={0.5 + 0.2 * Math.sin(t * 3)} /></group>
        )}
      </group>
      </Rig>
    </>
  );
};
export const World3: React.FC<{ t: number }> = ({ t }) => <DeskShower t={t} standAt={3.2} walkA={3.3} walkB={4.9} boomAt={5.05} />;
export const World8: React.FC<{ t: number }> = ({ t }) => <DeskShower t={t} papersFrom={0.0} papersTo={1.6} standAt={1.9} walkA={2.0} walkB={3.2} calm={range(t, 3.4, 4.0)} />;

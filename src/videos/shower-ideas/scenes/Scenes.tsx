import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { FPS, HEIGHT, WIDTH } from "../config";
import { Chip, HookTitle, Vignette } from "../components/Overlay";
import { World1, World2, World3, World8 } from "../worlds/World1";
import { World4, World5, World6, World7, World9, World10 } from "../worlds/World4";

export type SceneProps = { lead: number };

/** One 3D scene. `lead` = seconds of the scene that are hidden inside the incoming transition. */
const SceneShell: React.FC<{ lead: number; World: React.FC<{ t: number }>; overlay?: (t: number) => React.ReactNode; name: string }> = ({ lead, World, overlay, name }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame / FPS - lead);
  return (
    <AbsoluteFill name={name} style={{ backgroundColor: "#0a0f2c" }}>
      <ThreeCanvas width={WIDTH} height={HEIGHT} camera={{ position: [0, 0, 10], fov: 40, near: 0.1, far: 100 }}>
        <World t={t} />
      </ThreeCanvas>
      <Vignette />
      {overlay ? overlay(t) : null}
    </AbsoluteFill>
  );
};

export const IntroScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Intro" lead={lead} World={World1} overlay={(t) => <HookTitle t={t} />} />;
export const HitScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Hot water" lead={lead} World={World2} />;
export const DeskScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Desk to shower" lead={lead} World={World3} />;
export const ChemScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Brain chemistry" lead={lead} World={World4} />;
export const DopamineScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Dopamine" lead={lead} World={World5} overlay={(t) => <Chip t={t} from={3.5} to={6.2} text="DOPAMINE" />} />;
export const NetworkScene: React.FC<SceneProps> = ({ lead }) => (
  <SceneShell
    name="Default mode network"
    lead={lead}
    World={World6}
    overlay={(t) => (
      <>
        <Chip t={t} from={4.0} to={6.2} text={"PREFRONTAL\nCORTEX"} />
        <Chip t={t} from={6.9} to={8.2} text={"DEFAULT MODE\nNETWORK"} />
      </>
    )}
  />
);
export const AhaScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Aha moment" lead={lead} World={World7} overlay={(t) => <Chip t={t} from={6.2} to={7.6} text="AHA!" />} />;
export const StuckScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Stuck then shower" lead={lead} World={World8} />;
export const NotepadScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Waterproof notepad" lead={lead} World={World9} />;
export const OutroScene: React.FC<SceneProps> = ({ lead }) => <SceneShell name="Outro" lead={lead} World={World10} overlay={(t) => <Chip t={t} from={0.5} to={2.6} text={"SHOWER\nTHOUGHTS"} />} />;

export const SCENES: { id: string; Component: React.FC<SceneProps> }[] = [
  { id: "Intro", Component: IntroScene },
  { id: "Hit", Component: HitScene },
  { id: "Desk", Component: DeskScene },
  { id: "Chem", Component: ChemScene },
  { id: "Dopamine", Component: DopamineScene },
  { id: "Network", Component: NetworkScene },
  { id: "Aha", Component: AhaScene },
  { id: "Stuck", Component: StuckScene },
  { id: "Notepad", Component: NotepadScene },
  { id: "Outro", Component: OutroScene },
];

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  Badge,
  C,
  FONT,
  FactLines,
  FlagPole,
  Penguin,
  Rowboat,
  Snowfall,
  YearBig,
} from "../components/shared";

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const boatX = interpolate(frame, [20, 140], [-230, 380], {
    extrapolateRight: "clamp",
  });
  const penguinOpacity = interpolate(frame, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.skyTop }}>
      <Backdrop variant="shore" />
      <Rowboat x={boatX} y={500} scale={1} />
      <FlagPole x={880} y={420} color={C.teal} startFrame={130} height={150} />
      <div style={{ position: "absolute", left: 70, top: 36 }}>
        <YearBig year="1895" startFrame={10} fontSize={168} />
      </div>
      <div style={{ position: "absolute", left: 620, top: 230 }}>
        <FactLines
          startFrame={80}
          gap={11}
          lines={[
            { text: "24 Januari 1895 · Cape Adare", size: 38, weight: 900 },
            { text: "kapal Antarctic · ekspedisi Henryk Bull", size: 28, color: C.iceDeep },
            { text: "Borchgrevink · Kristensen · Tunzelmann", size: 28, color: C.amber, weight: 800 },
            { text: "rombongan 6–7 orang", size: 26, color: C.iceDeep },
          ]}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: penguinOpacity }}>
        <Penguin x={990} y={548} scale={0.9} hopDelay={0} />
        <Penguin x={1085} y={566} scale={0.75} hopDelay={22} />
        <Penguin x={1160} y={556} scale={0.85} hopDelay={44} />
      </div>
      <div style={{ position: "absolute", left: 70, bottom: 44 }}>
        <Badge
          text="pendaratan pertama yang terkonfirmasi"
          bg={C.teal}
          startFrame={220}
        />
      </div>
      <Snowfall count={70} />
    </AbsoluteFill>
  );
};

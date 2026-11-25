import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Backdrop,
  Badge,
  C,
  FONT,
  FactLines,
  Footprints,
  Ship,
  Snowfall,
  YearBig,
} from "../components/shared";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const qScale = spring({
    frame: frame - 150,
    fps,
    config: { damping: 11, stiffness: 160 },
  });
  const pulse = 1 + Math.sin(frame / 14) * 0.05;
  const qOpacity = interpolate(frame, [150, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.skyTop }}>
      <Backdrop variant="shore" />
      <Ship x={60} y={470} scale={0.72} />
      <Footprints x={430} y={540} count={6} startFrame={60} />
      <div style={{ position: "absolute", left: 70, top: 36 }}>
        <YearBig year="1821" startFrame={10} fontSize={168} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 235 }}>
        <FactLines
          startFrame={70}
          gap={12}
          lines={[
            { text: "7 Februari 1821", size: 44, weight: 900 },
            { text: "Kapten John Davis", size: 36, weight: 800 },
            { text: "kapal Cecilia · Hughes Bay", size: 30, color: C.iceDeep },
          ]}
        />
      </div>
      {/* tanda tanya besar */}
      <div
        style={{
          position: "absolute",
          right: 220,
          top: 90,
          width: 132,
          height: 132,
          borderRadius: "50%",
          background: C.coral,
          border: `5px solid ${C.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: qOpacity,
          transform: `scale(${qScale * pulse})`,
          boxShadow: "0 14px 30px rgba(3,12,24,0.5)",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 92,
            fontWeight: 900,
            color: "#fff",
            lineHeight: 1,
          }}
        >
          ?
        </span>
      </div>
      <div style={{ position: "absolute", left: 70, bottom: 44 }}>
        <Badge
          text="klaim pertama — masih diperdebatkan"
          bg={C.coral}
          startFrame={200}
        />
      </div>
      <Snowfall count={70} />
    </AbsoluteFill>
  );
};

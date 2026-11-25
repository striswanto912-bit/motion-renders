import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Backdrop,
  CaptionCard,
  C,
  FONT,
  Iceberg,
  KineticWords,
  Ship,
  Snowfall,
} from "../components/shared";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const shipX = interpolate(frame, [0, 200], [-280, 760], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.skyTop }}>
      <Backdrop variant="sea" />
      <Iceberg x={1000} y={330} scale={1.2} />
      <Iceberg x={40} y={440} scale={0.65} flip />
      <Ship x={shipX} y={430} scale={1} />
      <div style={{ position: "absolute", left: 70, top: 56, width: 900 }}>
        <KineticWords
          lines={[
            "SIAPA MANUSIA PERTAMA",
            "YANG MENGINJAKKAN KAKI",
            "DI ANTARTIKA?",
          ]}
          startFrame={50}
          fontSize={56}
          highlightWords={["PERTAMA", "ANTARTIKA?"]}
        />
      </div>
      <div style={{ position: "absolute", left: 70, bottom: 46, width: 660 }}>
        <CaptionCard
          title="1820 · benua Antartika pertama kali terlihat"
          sub="Bellingshausen · Bransfield · Palmer"
          startFrame={170}
        />
      </div>
      <Snowfall count={70} />
    </AbsoluteFill>
  );
};

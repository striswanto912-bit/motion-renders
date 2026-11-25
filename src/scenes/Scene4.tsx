import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Backdrop,
  C,
  CaptionCard,
  FONT,
  KineticWords,
  Snowfall,
} from "../components/shared";

const NODES = [
  { year: "1820", x: 190, title: "benua terlihat", sub: "Bellingshausen dkk." },
  { year: "1821", x: 500, title: "Davis — klaim pertama", sub: "diperdebatkan" },
  { year: "1895", x: 810, title: "pendaratan terkonfirmasi", sub: "Cape Adare" },
  { year: "1911", x: 1120, title: "Amundsen", sub: "Kutub Selatan" },
];

const LINE_Y = 372;
const LINE_X0 = 110;
const LINE_X1 = 1170;

const TimelineNode: React.FC<{
  node: (typeof NODES)[number];
  index: number;
}> = ({ node, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 60 + index * 40;
  const s = spring({
    frame: frame - start,
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  const cardIn = spring({
    frame: frame - start - 12,
    fps,
    config: { damping: 100, stiffness: 180 },
  });
  return (
    <div style={{ position: "absolute", left: node.x, top: 0, opacity: s > 0 ? 1 : 0 }}>
      {/* tahun di atas titik */}
      <div
        style={{
          position: "absolute",
          left: -60,
          top: LINE_Y - 62,
          width: 120,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 36,
          fontWeight: 900,
          color: C.amber,
          textShadow: "0 3px 0 rgba(7,24,40,0.9), 0 8px 18px rgba(3,12,24,0.5)",
          opacity: s,
        }}
      >
        {node.year}
      </div>
      {/* titik */}
      <div
        style={{
          position: "absolute",
          left: -15,
          top: LINE_Y - 15,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: C.amber,
          border: `4px solid ${C.ink}`,
          transform: `scale(${Math.max(s, 0)})`,
          boxShadow: "0 6px 16px rgba(3,12,24,0.5)",
        }}
      />
      {/* kartu di bawah titik */}
      <div
        style={{
          position: "absolute",
          left: -115,
          top: LINE_Y + 34,
          width: 230,
          background: "rgba(7,24,40,0.78)",
          border: "3px solid rgba(234,246,255,0.35)",
          borderRadius: 16,
          padding: "12px 14px",
          textAlign: "center",
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [20, 0])}px)`,
          boxShadow: "0 10px 22px rgba(3,12,24,0.45)",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 22,
            fontWeight: 800,
            color: C.white,
            lineHeight: 1.2,
          }}
        >
          {node.title}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 20,
            fontWeight: 600,
            color: C.iceDeep,
            marginTop: 3,
          }}
        >
          {node.sub}
        </div>
      </div>
    </div>
  );
};

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const lineW = interpolate(frame, [40, 160], [0, LINE_X1 - LINE_X0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.skyTop }}>
      <Backdrop variant="sea" />
      <div style={{ position: "absolute", left: 70, top: 52 }}>
        <KineticWords
          lines={["JADI, SIAPA YANG PERTAMA?"]}
          startFrame={20}
          fontSize={52}
          highlightWords={["PERTAMA?"]}
        />
      </div>
      {/* garis timeline */}
      <div
        style={{
          position: "absolute",
          left: LINE_X0,
          top: LINE_Y - 4,
          width: lineW,
          height: 8,
          background: C.ice,
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(3,12,24,0.4)",
        }}
      />
      {NODES.map((n, i) => (
        <TimelineNode key={n.year} node={n} index={i} />
      ))}
      <div style={{ position: "absolute", left: 70, bottom: 40, width: 1140 }}>
        <CaptionCard
          title="Davis 1821 = klaim pertama · 1895 = pendaratan terkonfirmasi"
          sub="14 Desember 1911 — Roald Amundsen mencapai Kutub Selatan"
          startFrame={220}
        />
      </div>
      <Snowfall count={70} />
    </AbsoluteFill>
  );
};

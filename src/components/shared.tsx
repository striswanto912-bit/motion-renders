import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const FONT = "'Noto Sans Display','Liberation Sans',sans-serif";

export const C = {
  skyTop: "#071828",
  skyMid: "#0d3355",
  skyBot: "#1b6285",
  ice: "#eaf6ff",
  iceDeep: "#cfe7f5",
  ink: "#071828",
  amber: "#ffb703",
  coral: "#ff5964",
  teal: "#2ec4b6",
  white: "#ffffff",
};

/* ---------- salju turun, posisi deterministik per indeks ---------- */
export const Snowfall: React.FC<{ count?: number }> = ({ count = 70 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const flakes = [];
  for (let i = 0; i < count; i++) {
    const x0 = (i * 197.3) % width;
    const y0 = (i * 131.7) % (height + 40);
    const speed = 1.1 + (i % 4) * 0.8;
    const size = 2 + (i % 3) * 1.8;
    const sway = Math.sin(frame / 25 + i * 1.7) * 12;
    const y = ((y0 + frame * speed) % (height + 40)) - 20;
    const x = (((x0 + sway) % width) + width) % width;
    flakes.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#fff",
          opacity: 0.45 + (i % 3) * 0.2,
        }}
      />,
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {flakes}
    </div>
  );
};

/* ---------- latar: langit gradien, bintang, bulan, pegunungan, laut ---------- */
export const Backdrop: React.FC<{ variant?: "sea" | "shore" }> = ({
  variant = "sea",
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const stars = [];
  for (let i = 0; i < 60; i++) {
    const x = (i * 211.7) % width;
    const y = (i * 97.3) % 280;
    const tw = 0.35 + 0.6 * Math.abs(Math.sin(frame / 40 + i));
    const s = 1 + (i % 3);
    stars.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: s,
          height: s,
          borderRadius: "50%",
          background: "#fff",
          opacity: tw * 0.85,
        }}
      />,
    );
  }
  const drift = interpolate(frame, [0, 300], [0, -24]);
  const seaH = variant === "sea" ? 170 : 120;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${C.skyTop} 0%, ${C.skyMid} 48%, ${C.skyBot} 100%)`,
      }}
    >
      {stars}
      {/* bulan */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 56,
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: "#fdf6d8",
          boxShadow: "0 0 60px rgba(253,246,216,0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 122,
          top: 78,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "rgba(7,24,40,0.08)",
        }}
      />
      {/* pegunungan belakang */}
      <svg
        style={{
          position: "absolute",
          left: drift,
          bottom: seaH - 10,
          width: width + 48,
          height: 250,
        }}
        viewBox={`0 0 ${width + 48} 250`}
      >
        <polygon
          points={`0,250 180,60 330,195 520,30 700,185 900,70 1080,205 ${width + 48},115 ${width + 48},250`}
          fill="#0a2438"
        />
        <polygon points="180,60 215,95 145,95" fill="#eaf6ff" opacity={0.95} />
        <polygon points="520,30 555,60 485,60" fill="#eaf6ff" opacity={0.95} />
        <polygon points="900,70 940,95 860,95" fill="#eaf6ff" opacity={0.95} />
      </svg>
      {/* laut */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: seaH,
          background: "linear-gradient(180deg,#1e7fa3,#0d4a6b)",
          borderTop: "4px solid rgba(234,246,255,0.45)",
        }}
      />
      {/* bongkahan es mengapung */}
      {[0, 1, 2].map((k) => {
        const baseX = [180, 620, 1020][k];
        const x = (((baseX - frame * (0.25 + k * 0.15)) % (width + 200)) + width + 200) % (width + 200) - 100;
        const bob = Math.sin(frame / 22 + k * 2) * 4;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x,
              bottom: 26 + k * 38,
              width: 150 - k * 22,
              height: 26,
              borderRadius: "50%",
              background: C.ice,
              opacity: 0.85,
              transform: `translateY(${bob}px)`,
              boxShadow: "0 6px 14px rgba(3,12,24,0.35)",
            }}
          />
        );
      })}
      {/* daratan es untuk varian shore */}
      {variant === "shore" ? (
        <div
          style={{
            position: "absolute",
            left: "-10%",
            bottom: -60,
            width: "120%",
            height: 220,
            background: `linear-gradient(180deg, ${C.ice} 0%, ${C.iceDeep} 100%)`,
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            boxShadow: "0 -8px 30px rgba(3,12,24,0.35)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------- gunung es ---------- */
export const Iceberg: React.FC<{
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}> = ({ x, y, scale = 1, flip = false }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 26) * 3;
  return (
    <svg
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: 240 * scale,
        height: 150 * scale,
        transform: flip ? "scaleX(-1)" : undefined,
        filter: "drop-shadow(0 12px 18px rgba(3,12,24,0.4))",
      }}
      viewBox="0 0 240 150"
    >
      <polygon
        points="8,150 52,52 96,100 142,18 196,84 232,150"
        fill={C.ice}
        stroke={C.ink}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <polygon points="142,18 168,62 150,62 176,96 118,96 132,62 122,62" fill="#ffffff" />
      <polygon points="52,52 78,88 64,88 88,118 30,118 40,88 30,88" fill="#ffffff" opacity={0.85} />
      <polygon points="8,150 232,150 220,122 20,122" fill={C.iceDeep} opacity={0.7} />
    </svg>
  );
};

/* ---------- kapal layar kartun ---------- */
export const Ship: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 20) * 4;
  const tilt = Math.sin(frame / 28) * 1.5;
  return (
    <svg
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: 300 * scale,
        height: 200 * scale,
        transform: `rotate(${tilt}deg)`,
        filter: "drop-shadow(0 12px 16px rgba(3,12,24,0.45))",
      }}
      viewBox="0 0 300 200"
    >
      {/* lambung */}
      <path
        d="M28 128 L272 128 L246 168 Q150 184 54 168 Z"
        fill="#8a5a2b"
        stroke={C.ink}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <path d="M28 128 L272 128 L264 142 L36 142 Z" fill="#a9743c" />
      <circle cx={90} cy={152} r={7} fill={C.ice} stroke={C.ink} strokeWidth={3} />
      <circle cx={150} cy={156} r={7} fill={C.ice} stroke={C.ink} strokeWidth={3} />
      <circle cx={210} cy={152} r={7} fill={C.ice} stroke={C.ink} strokeWidth={3} />
      {/* tiang */}
      <rect x={146} y={18} width={8} height={112} fill="#5d3a17" stroke={C.ink} strokeWidth={3} />
      <rect x={96} y={52} width={6} height={78} fill="#5d3a17" stroke={C.ink} strokeWidth={3} />
      {/* layar */}
      <polygon points="158,26 158,116 232,116" fill="#ffffff" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <polygon points="142,26 142,116 78,116" fill={C.iceDeep} stroke={C.ink} strokeWidth={5} strokeLinejoin="round" />
      <polygon points="100,58 100,116 148,116" fill="#ffffff" stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      {/* bendera */}
      <polygon points="154,18 196,28 154,40" fill={C.coral} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
};

/* ---------- perahu kecil pendarat ---------- */
export const Rowboat: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 18) * 3;
  return (
    <svg
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        width: 220 * scale,
        height: 110 * scale,
        filter: "drop-shadow(0 10px 14px rgba(3,12,24,0.45))",
      }}
      viewBox="0 0 220 110"
    >
      <path
        d="M14 62 L206 62 L182 92 Q110 102 38 92 Z"
        fill="#8a5a2b"
        stroke={C.ink}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <circle cx={80} cy={42} r={14} fill="#f2c29b" stroke={C.ink} strokeWidth={4} />
      <path d="M62 62 Q80 34 98 62 Z" fill={C.amber} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={140} cy={42} r={14} fill="#f2c29b" stroke={C.ink} strokeWidth={4} />
      <path d="M122 62 Q140 34 158 62 Z" fill={C.teal} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
      <line x1={60} y1={58} x2={22} y2={28} stroke="#5d3a17" strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};

/* ---------- penguin kartun ---------- */
export const Penguin: React.FC<{
  x: number;
  y: number;
  scale?: number;
  hopDelay?: number;
}> = ({ x, y, scale = 1, hopDelay = 0 }) => {
  const frame = useCurrentFrame();
  const hop = Math.max(0, Math.sin((frame - hopDelay) / 9)) * -14;
  const waddle = Math.sin((frame - hopDelay) / 9) * 4;
  return (
    <svg
      style={{
        position: "absolute",
        left: x,
        top: y + hop,
        width: 84 * scale,
        height: 116 * scale,
        transform: `rotate(${waddle}deg)`,
        filter: "drop-shadow(0 8px 10px rgba(3,12,24,0.4))",
      }}
      viewBox="0 0 84 116"
    >
      <ellipse cx={42} cy={62} rx={32} ry={46} fill="#1b2733" stroke={C.ink} strokeWidth={4} />
      <ellipse cx={42} cy={76} rx={19} ry={28} fill="#ffffff" />
      <ellipse cx={14} cy={62} rx={8} ry={20} fill="#1b2733" stroke={C.ink} strokeWidth={3} transform="rotate(18 14 62)" />
      <ellipse cx={70} cy={62} rx={8} ry={20} fill="#1b2733" stroke={C.ink} strokeWidth={3} transform="rotate(-18 70 62)" />
      <circle cx={33} cy={42} r={7} fill="#ffffff" />
      <circle cx={51} cy={42} r={7} fill="#ffffff" />
      <circle cx={34} cy={43} r={3.4} fill={C.ink} />
      <circle cx={50} cy={43} r={3.4} fill={C.ink} />
      <polygon points="42,50 34,58 50,58" fill="#ff9f1c" stroke={C.ink} strokeWidth={2.5} strokeLinejoin="round" />
      <ellipse cx={30} cy={108} rx={10} ry={5} fill="#ff9f1c" stroke={C.ink} strokeWidth={3} />
      <ellipse cx={54} cy={108} rx={10} ry={5} fill="#ff9f1c" stroke={C.ink} strokeWidth={3} />
    </svg>
  );
};

/* ---------- tiang bendera ---------- */
export const FlagPole: React.FC<{
  x: number;
  y: number;
  color?: string;
  startFrame?: number;
  height?: number;
}> = ({ x, y, color = C.coral, startFrame = 0, height = 150 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = spring({ frame: frame - startFrame, fps, config: { damping: 100, stiffness: 160 } });
  const wave = Math.sin(frame / 7) * 4;
  const flagScale = spring({
    frame: frame - startFrame - 18,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: grow > 0 ? 1 : 0 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 8,
          height: height * Math.max(grow, 0),
          background: "#e8e0cf",
          borderRadius: 4,
          border: `2px solid ${C.ink}`,
          transformOrigin: "bottom",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 4,
          width: 86,
          height: 54,
          background: color,
          border: `3px solid ${C.ink}`,
          borderRadius: 6,
          transform: `scaleX(${Math.max(flagScale, 0)}) skewY(${wave}deg)`,
          transformOrigin: "left center",
          boxShadow: "0 6px 14px rgba(3,12,24,0.4)",
        }}
      />
    </div>
  );
};

/* ---------- jejak kaki di es ---------- */
export const Footprints: React.FC<{
  x: number;
  y: number;
  count?: number;
  startFrame?: number;
}> = ({ x, y, count = 6, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const prints = [];
  for (let i = 0; i < count; i++) {
    const px = x + i * 52;
    const py = y + Math.sin(i * 0.9) * 14;
    const side = i % 2 === 0 ? -12 : 12;
    const o = interpolate(frame, [startFrame + i * 14, startFrame + i * 14 + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    prints.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: px,
          top: py + side,
          width: 26,
          height: 40,
          borderRadius: "50%",
          background: "rgba(7,24,40,0.28)",
          opacity: o,
          transform: "rotate(12deg)",
        }}
      />,
    );
  }
  return <div style={{ position: "absolute", inset: 0 }}>{prints}</div>;
};

/* ---------- teks kinetik per kata ---------- */
export const KineticWords: React.FC<{
  lines: string[];
  startFrame?: number;
  fontSize?: number;
  color?: string;
  highlightWords?: string[];
  lineGap?: number;
}> = ({
  lines,
  startFrame = 0,
  fontSize = 56,
  color = C.white,
  highlightWords = [],
  lineGap = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: lineGap }}>
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: Math.round(fontSize * 0.32),
          }}
        >
          {line.split(" ").map((word) => {
            const idx = wordIndex++;
            const s = spring({
              frame: frame - startFrame - idx * 5,
              fps,
              config: { damping: 14, stiffness: 220, mass: 0.6 },
            });
            const hot = highlightWords.includes(word);
            return (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  fontFamily: FONT,
                  fontSize,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: hot ? C.amber : color,
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${interpolate(s, [0, 1], [0.7, 1])})`,
                  textShadow: "0 4px 0 rgba(7,24,40,0.85), 0 12px 26px rgba(3,12,24,0.6)",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/* ---------- angka tahun besar ---------- */
export const YearBig: React.FC<{
  year: string;
  startFrame?: number;
  fontSize?: number;
}> = ({ year, startFrame = 0, fontSize = 168 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 13, stiffness: 170, mass: 0.8 },
  });
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize,
        fontWeight: 900,
        lineHeight: 0.95,
        color: C.amber,
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        textShadow: "0 6px 0 rgba(7,24,40,0.9), 0 16px 34px rgba(3,12,24,0.65)",
        transformOrigin: "left center",
      }}
    >
      {year}
    </div>
  );
};

/* ---------- baris fakta yang muncul berurutan ---------- */
export const FactLines: React.FC<{
  lines: { text: string; size?: number; color?: string; weight?: number }[];
  startFrame?: number;
  gap?: number;
}> = ({ lines, startFrame = 0, gap = 10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {lines.map((l, i) => {
        const s = spring({
          frame: frame - startFrame - i * 18,
          fps,
          config: { damping: 100, stiffness: 200 },
        });
        return (
          <div
            key={i}
            style={{
              fontFamily: FONT,
              fontSize: l.size ?? 30,
              fontWeight: l.weight ?? 700,
              color: l.color ?? C.white,
              opacity: s,
              transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`,
              textShadow: "0 3px 0 rgba(7,24,40,0.8), 0 8px 18px rgba(3,12,24,0.5)",
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- lencana pil ---------- */
export const Badge: React.FC<{
  text: string;
  bg?: string;
  startFrame?: number;
  fontSize?: number;
}> = ({ text, bg = C.coral, startFrame = 0, fontSize = 28 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12, stiffness: 180 },
  });
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: FONT,
        fontSize,
        fontWeight: 800,
        color: "#fff",
        background: bg,
        border: `3px solid ${C.ink}`,
        borderRadius: 999,
        padding: "12px 26px",
        opacity: s,
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
        boxShadow: "0 10px 24px rgba(3,12,24,0.45)",
      }}
    >
      {text}
    </div>
  );
};

/* ---------- kartu keterangan bawah ---------- */
export const CaptionCard: React.FC<{
  title: string;
  sub?: string;
  startFrame?: number;
}> = ({ title, sub, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 100, stiffness: 160 },
  });
  return (
    <div
      style={{
        background: "rgba(7,24,40,0.72)",
        border: "3px solid rgba(234,246,255,0.35)",
        borderRadius: 20,
        padding: "16px 26px",
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
        boxShadow: "0 12px 28px rgba(3,12,24,0.5)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 800,
          color: C.white,
          lineHeight: 1.25,
        }}
      >
        {title}
      </div>
      {sub ? (
        <div
          style={{
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 600,
            color: C.iceDeep,
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

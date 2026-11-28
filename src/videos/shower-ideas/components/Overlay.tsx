import React from "react";
import { AbsoluteFill, Interactive, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, SAFE } from "../config";
import { fontFamily } from "../fonts";

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(5,8,25,0.55) 100%)", pointerEvents: "none" }} />
);

/** Big hook title: 4 short lines inside the top safe area. `t` = seconds from the start of the video. */
export const HookTitle: React.FC<{ t: number }> = ({ t }) => {
  const { fps } = useVideoConfig();
  const lines = ["WHY DO YOUR", "BEST IDEAS", "HAPPEN IN", "THE SHOWER?"];
  // visible from the very first frame (good for the cover / thumbnail), fades out before the lock opens
  const opacity = interpolate(t, [0, 2.3, 2.75], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top, opacity }}>
      {lines.map((l, i) => {
        const s = spring({ frame: Math.max(0, Math.round(t * fps) + 10 - i * 4), fps, config: { damping: 14, stiffness: 160 } });
        return (
          <Interactive.Div
            key={i}
            name={`Hook line ${i + 1}`}
            style={{ fontFamily, fontWeight: 900, fontSize: 104, lineHeight: 1.04, color: i === 3 ? COLORS.yellow : COLORS.white, textShadow: "0 6px 0 rgba(10,15,44,0.85), 0 0 30px rgba(10,15,44,0.8)", transform: `translateY(${(1 - s) * 40}px) scale(${0.9 + 0.1 * s})`, opacity: s }}
          >
            {l}
          </Interactive.Div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Small label chip near the top of the safe area. */
export const Chip: React.FC<{ t: number; from: number; to: number; text: string }> = ({ t, from, to, text }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: Math.max(0, Math.round((t - from) * fps)), fps, config: { damping: 16, stiffness: 180 } });
  const out = interpolate(t, [to - 0.25, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t < from || t > to) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top }}>
      <Interactive.Div
        name="Label"
        style={{ fontFamily, fontWeight: 900, fontSize: 72, color: COLORS.white, background: "rgba(10,15,44,0.62)", border: "4px solid rgba(255,255,255,0.85)", borderRadius: 28, padding: "14px 34px", textAlign: "center", whiteSpace: "pre-line", opacity: s * out, transform: `scale(${0.85 + 0.15 * s})` }}
      >
        {text}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

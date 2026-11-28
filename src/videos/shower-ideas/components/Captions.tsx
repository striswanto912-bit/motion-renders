import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import type { Caption } from "@remotion/captions";
import captionsJson from "../captions.json";
import { COLORS, FPS, SAFE } from "../config";
import { fontFamily } from "../fonts";

type Page = { startMs: number; endMs: number; words: Caption[] };

// Group the word-level captions into short pages (max 4 words / 24 characters), break after punctuation.
const buildPages = (caps: Caption[]): Page[] => {
  const pages: Page[] = [];
  let cur: Caption[] = [];
  const flush = () => {
    if (cur.length) pages.push({ startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs, words: cur });
    cur = [];
  };
  caps.forEach((c, i) => {
    const text = cur.map((w) => w.text.trim()).join(" ");
    const prev = caps[i - 1];
    const bigGap = prev ? c.startMs - prev.endMs > 350 : false;
    if (cur.length && (cur.length >= 4 || text.length + c.text.trim().length > 24 || bigGap || (cur.length >= 2 && /[,.?!;]$/.test(prev.text.trim())))) flush();
    cur.push(c);
  });
  flush();
  return pages;
};

const CaptionPage: React.FC<{ page: Page; fromFrame: number }> = ({ page, fromFrame }) => {
  const frame = useCurrentFrame();
  const ms = ((frame + fromFrame) / FPS) * 1000;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: SAFE.bottom + 60, paddingLeft: SAFE.left, paddingRight: SAFE.right }}>
      <div style={{ fontFamily, fontWeight: 800, fontSize: 78, lineHeight: 1.12, textAlign: "center", textTransform: "uppercase", color: COLORS.white, letterSpacing: 1, textShadow: "0 4px 0 rgba(10,15,44,0.9), 0 0 24px rgba(10,15,44,0.9)" }}>
        {page.words.map((w, i) => {
          const active = ms >= w.startMs && ms < w.endMs + 40;
          return (
            <span key={i} style={{ color: active ? COLORS.yellow : COLORS.white, display: "inline-block", transform: active ? "scale(1.08)" : "scale(1)", marginRight: 16 }}>
              {w.text.trim()}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  const pages = useMemo(() => buildPages(captionsJson as unknown as Caption[]), []);
  return (
    <>
      {pages.map((p, i) => {
        const startMs = p.startMs - 60;
        const from = Math.max(0, Math.round((startMs / 1000) * FPS));
        const nextStart = pages[i + 1] ? pages[i + 1].startMs - 80 : p.endMs + 300;
        const end = Math.min(p.endMs + 260, nextStart);
        const dur = Math.max(2, Math.round(((end - startMs) / 1000) * FPS));
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`Caption ${i + 1}`}>
            <CaptionPage page={p} fromFrame={from} />
          </Sequence>
        );
      })}
    </>
  );
};

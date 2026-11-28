import { CUTS } from "./config";

// Sound effects (seconds in the narration). Volumes are clamped to SFX_MAX_VOLUME, always below the voice.
export const SFX: { at: number; file: string; vol: number }[] = [
  { at: 0.12, file: "sparkle", vol: 0.35 },
  { at: 3.35, file: "click", vol: 0.4 },
  { at: 3.95, file: "sparkle", vol: 0.4 },
  { at: 7.3, file: "splash", vol: 0.4 },
  ...Array.from({ length: 11 }, (_, i) => ({ at: 9.5 + i * 0.25, file: "tick", vol: 0.3 })),
  { at: 12.3, file: "whoosh_c", vol: 0.3 },
  { at: 14.1, file: "pop", vol: 0.5 },
  { at: 14.15, file: "ding", vol: 0.35 },
  { at: 16.95, file: "whoosh_a", vol: 0.3 },
  { at: 17.7, file: "pop", vol: 0.35 },
  ...Array.from({ length: 6 }, (_, i) => ({ at: 17.8 + i * 0.22, file: "bubble", vol: 0.25 })),
  ...Array.from({ length: 7 }, (_, i) => ({ at: 19.6 + i * 0.42, file: "drip", vol: 0.22 })),
  { at: 21.9, file: "pop", vol: 0.3 },
  { at: 22.2, file: "pop", vol: 0.3 },
  { at: 22.5, file: "pop", vol: 0.3 },
  { at: 25.9, file: "sparkle", vol: 0.35 },
  { at: 27.1, file: "whoosh_b", vol: 0.3 },
  { at: 27.8, file: "whoosh_b", vol: 0.25 },
  { at: 30.2, file: "whoosh_c", vol: 0.2 },
  { at: 32.0, file: "pop", vol: 0.3 },
  { at: 32.9, file: "sparkle", vol: 0.35 },
  ...Array.from({ length: 12 }, (_, i) => ({ at: 36.4 + i * 0.2, file: "tick", vol: 0.22 })),
  { at: 40.3, file: "whoosh_c", vol: 0.35 },
  { at: 40.35, file: "ding", vol: 0.4 },
  { at: 43.5, file: "click", vol: 0.3 },
  { at: 44.8, file: "splash", vol: 0.3 },
  { at: 47.4, file: "drip", vol: 0.25 },
  { at: 49.3, file: "sparkle", vol: 0.3 },
  { at: 50.2, file: "ding", vol: 0.25 },
  // transition whooshes, a little before each cut
  ...CUTS.slice(1).map((c, i) => ({ at: c - 0.2, file: i % 2 ? "whoosh_a" : "whoosh_b", vol: 0.25 })),
];


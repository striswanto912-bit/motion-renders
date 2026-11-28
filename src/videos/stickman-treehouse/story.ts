// Timeline of the treehouse build (Clinct post 3, 3D remake): 6 shots timed to the voice words
// (~/workspace/motion-studio/projects/stickman-treehouse-3d/words.json), the treehouse physics
// (platform heights, collapses, scoreboard) and the camera grammar measured in the reference study:
// continuous slow push-ins; symmetric ease-in-out moves ~23 f (10 in / 10 out), peak ~15 px/f at 720p;
// big reframes are cuts; impacts are 7-frame kicks that flip sign every frame; no hand-held float.
// The world is the bridge town, reused wholesale: the deck (y = D0, z -30..+30, 5 m wide) IS the building
// site. Two trees stand on the deck at z = +20 (blue's at x = -1.2, brown's at x = +1.2); each level adds
// a platform higher up the trunk. Blue's tower collapses (L1, L3, L4 total); brown's treehouse stands.
// Score: L1 brown (1-0), L2 blue (1-1), L3 brown (2-1), L4 brown (3-1).
export const FPS = 30;
export const TOTAL = 1603; // 53.44 s (53.44 x 30 = 1603.2; last frame covers 53.40-53.43 s)
export const D0 = 6.0; // bank top + deck height (m)
export const HALF = 27; // towers at z = +-27, span 54 m
export const FILES = [-1.65, -0.55, 0.55, 1.65];
export const ROW_GAP = 1.3;
export const COUNT = 74;
export const PARK: V3 = [70, D0, -75]; // swing pivot base (x, ground y, z)
export type V3 = [number, number, number];

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => { const u = clamp01(x); return u * u * (3 - 2 * u); };
export const easeOut = (u: number) => 1 - (1 - clamp01(u)) ** 4;
const lin = (pts: [number, number][], x: number) => {
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
};

// ---------------- treehouse physics (t = story time in seconds = video time) ----------------
export const BLUE_TREE: V3 = [-1.2, D0, 20];
export const BROWN_TREE: V3 = [1.2, D0, 20];
export const BLUE_X = -1.2, BROWN_X = 1.2, DOG_X = 0;
export const TREE_Z = 20;
export const START_Z = 18, FINISH_Z = -18; // kept for the bridge code's ground marks (unused here)
// platform heights above the deck, one per level
export const PLAT_H = [1.2, 2.6, 4.0, 5.4];
// when each level's platform appears (word anchors in words.json)
export const BLUE_APPEAR = [4.88, 13.10, 20.84, 27.98]; // "Level one" / "Blue goes higher" / "giant roof" / "Blue bets everything"
export const BROWN_APPEAR = [4.88, 15.86, 24.82, 35.48]; // both start L1 / "adds a foundation" / "One nail at a time" / "Finished."
// when blue's platforms collapse ("it fell down" 9.42 / "The roof came down" 22.8 / "it did not stand" 34.5)
export const BLUE_FALL = [9.42, Infinity, 22.80, 34.50];
export const L2_FALL = 34.50; // total collapse at L4 takes the L2 platform down too
export const HOUSE_DONE = 35.48; // "Finished. Small. But it stands." — brown's roof + walls appear
export const SCORE_RAISE = 38.56; // "The dog lifts the scoreboard."
export const COLLAPSE_DUR = 0.7; // a platform takes 0.7 s to fall and settle
/** beat boundaries from the real transcript: L1 0-12.08 / L2 12.08-20.02 / L3 20.02-26.63 / L4 26.63-38.56 / result 38.56-46.86 / ending 46.86-53.44 */
export const BEATS = [0, 12.08, 20.02, 26.63, 38.56, 46.86, 53.44];
export const levelAt = (t: number) => (t < 12.08 ? 1 : t < 20.02 ? 2 : t < 26.63 ? 3 : 4);
/** score [blue, brown] so far: L1 brown (9.42), L2 blue (17.64 "One-one"), L3 brown (22.8), L4 brown (34.5) */
export const scoreAt = (t: number): [number, number] =>
  t < 9.42 ? [0, 0] : t < 17.64 ? [0, 1] : t < 22.80 ? [1, 1] : t < 34.50 ? [1, 2] : [1, 3];

/** one platform's state: visible, height above deck, tilt (rad, + = topples outward), sideways slide (m), scale (build-in) */
export type Plat = { vis: boolean; y: number; tilt: number; dx: number; s: number };
const FALL_SET = (fallT: number, h: number, out: number, t: number): Plat => {
  if (t < fallT) return { vis: true, y: h, tilt: 0, dx: 0, s: 1 };
  const u = clamp01((t - fallT) / COLLAPSE_DUR);
  // tilts up mid-fall, settles nearly flat on the deck, slid outward
  return { vis: true, y: h + (0.09 - h) * smooth(u), tilt: Math.sin(Math.PI * Math.min(1, u * 0.9)) * 0.9 + 0.12 * smooth(u), dx: out * smooth(u), s: 1 };
};
/** blue's platform for level lv (1-4): appears, wobbles on L2 ("It wobbles" 14.6-17.6), falls at its collapse time */
export const bluePlat = (lv: number, t: number): Plat => {
  const h = PLAT_H[lv - 1], ap = BLUE_APPEAR[lv - 1];
  if (t < ap) return { vis: false, y: h, tilt: 0, dx: 0, s: 0 };
  const s = 0.25 + 0.75 * smooth((t - ap) / 0.4); // built in 0.4 s
  const fallT = lv === 2 ? L2_FALL : BLUE_FALL[lv - 1];
  const p = FALL_SET(fallT, h, -0.9, t);
  if (lv === 2 && t >= 14.60 && t < 17.64 && t < L2_FALL) p.tilt = 0.06 * Math.sin((t - 14.6) * Math.PI * 2 * 2); // L2 wobble
  return { ...p, s };
};
/** brown's platform for level lv (1-4): appears and never falls (his treehouse stands) */
export const brownPlat = (lv: number, t: number): Plat => {
  const h = PLAT_H[lv - 1], ap = BROWN_APPEAR[lv - 1];
  if (t < ap) return { vis: false, y: h, tilt: 0, dx: 0, s: 0 };
  return { vis: true, y: h, tilt: 0, dx: 0, s: 0.25 + 0.75 * smooth((t - ap) / 0.4) };
};
/** brown's little house (walls + pitched roof) on the L4 platform: scales in 35.48-35.9 s */
export const houseK = (t: number) => smooth((t - HOUSE_DONE) / 0.4);
/** the dog's scoreboard rising: 0 hidden -> 1 fully raised (38.56-39.0 s) */
export const scoreK = (t: number) => smooth((t - SCORE_RAISE) / 0.45);

// builders' ground positions (z = the trees; the deck is the building site)
export const blueZ = (t: number) => TREE_Z;
export const brownZ = (t: number) => TREE_Z;
export const dogZ = (t: number) => lin([[0, 22], [35.5, 22], [38.0, 22], [53.44, 22]], t);
export const midZ = (t: number) => (blueZ(t) + brownZ(t)) / 2;
export const front = (tau: number) => midZ(tau); // z of the builders' midpoint
export const marchPhase = (tau: number) => ((tau % 1) + 1) % 1; // 1 Hz cycle = 2 steps/s, footfalls at 0 and 0.5
/** per-character walk-cycle phase: rate in cycles/s (hammering ~2, walk 1, dog trot 2) */
export const phase = (t: number, rate: number) => ((t * rate) % 1 + 1) % 1;
export const SNAP = 34.50; // L4 total collapse (kept for the bridge code's creak/snap hooks; the deck never moves)
export const DROP0 = 34.50, DROP1 = 35.20;
export const amp = (tau: number) => 0;
export const stomp = (tau: number) => 1; // flat deck, no stomp-driven bounce in this film
export const shapeZ = (z: number) => (Math.abs(z) < HALF ? Math.cos((Math.PI * z) / (2 * HALF)) : 0);
export const dropW = (z: number) => smooth((20 - z) / 26); // 1 on the near half, 0 at the far tower
export const dropU = (tau: number) => (tau < DROP0 ? 0 : Math.min(1, ((tau - DROP0) / (DROP1 - DROP0)) ** 2));
export const DROP_H = 6.6;

export type BridgeState = { bounce: number; drop: number; snap: number; collapsed: boolean };
export const deckY = (z: number, b: BridgeState) => D0 + b.bounce * shapeZ(z) - b.drop * DROP_H * dropW(z);

// ---------------- shots ----------------
export type Light = "day" | "golden";
export type Crowd = "march" | "fall" | "water" | "bank" | "tourists" | "none";
export type ShotDef = { id: number; a: number; b: number; light: Light; crowd: Crowd; tau: (t: number) => number; towns?: boolean };
export const SHOTS: ShotDef[] = [
  { id: 1, a: 0, b: 363, light: "day", crowd: "none", tau: (t) => t }, // 0-12.08 s LEVEL 1
  { id: 2, a: 363, b: 601, light: "day", crowd: "none", tau: (t) => t }, // 12.08-20.02 s LEVEL 2
  { id: 3, a: 601, b: 799, light: "day", crowd: "none", tau: (t) => t }, // 20.02-26.63 s LEVEL 3
  { id: 4, a: 799, b: 1157, light: "day", crowd: "none", tau: (t) => t }, // 26.63-38.56 s LEVEL 4
  { id: 5, a: 1157, b: 1406, light: "day", crowd: "none", tau: (t) => t }, // 38.56-46.86 s result
  { id: 6, a: 1406, b: 1603, light: "day", crowd: "none", tau: (t) => t }, // 46.86-53.44 s ending
];
/** no crossfades in this film: every beat change is a hard cut */
export const XFADE: Record<number, number> = {};
export const FLASH_AT = TOTAL + 100; // no white flash in this film

export const shotAt = (f: number) => SHOTS.find((s) => f >= s.a && f < s.b) ?? SHOTS[SHOTS.length - 1];
/** layers to draw at frame f: base shot, plus the next shot fading in during a crossfade */
export const layersAt = (f: number): { id: number; alpha: number }[] => {
  for (const s of SHOTS) {
    const x = XFADE[s.id];
    if (x && f >= s.a - x / 2 && f < s.a + x / 2) return [{ id: s.id - 1, alpha: 1 }, { id: s.id, alpha: (f - (s.a - x / 2) + 1) / (x + 1) }];
  }
  return [{ id: shotAt(f).id, alpha: 1 }];
};

/** the bridge never moves in this film: flat deck, intact chains, no collapse */
export const bridgeState = (id: number, t: number): BridgeState => ({ bounce: 0, drop: 0, snap: 0, collapsed: false });

// ---------------- camera ----------------
// Grammar (motion.md): every move is a symmetric smootherstep glide of 18-40 f (peak speed = 1.875 x distance / dur,
// so dur >= 0.075 x the move in 720p px keeps the peak near the reference 14-25 px/f); a reframe bigger than about
// half a frame width or 40 % zoom is a hard cut on its key frame. Glides are centred on the old key frame (the
// whoosh in the sound mix peaks there), so a glide key starts dur/2 earlier. Holds push in (dolly toward the look
// point or a fov zoom near walls/towers): 0.15-0.35 %/f, ~0.6 %/f for ~35 f on the punch words. Rolls of 4-8 deg
// over >= 18 f on emphasis beats, held tilt <= 0.07 rad.
export type Cam = { pos: V3; look: V3; fov: number; roll: number };
type Shot = Partial<Cam> & { pos: V3; look: V3 };
type Key = { f: number; dur?: number; cut?: boolean; s: (f: number) => Shot };
/** reference camera ease: symmetric smootherstep (attack = release, ~10 f each on a 23 f move) */
export const glide = (u: number) => { const x = clamp01(u); return x * x * x * (x * (6 * x - 15) + 10); };
const mix = (a: Cam, b: Cam, k: number): Cam => ({
  pos: a.pos.map((v, i) => v + (b.pos[i] - v) * k) as V3, look: a.look.map((v, i) => v + (b.look[i] - v) * k) as V3,
  fov: a.fov + (b.fov - a.fov) * k, roll: a.roll + (b.roll - a.roll) * k,
});
const full = (c: Shot): Cam => ({ fov: 40, roll: 0, ...c });
const run = (keys: Key[], f: number) => {
  let cur = full(keys[0].s(f));
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    if (f < k.f) break;
    cur = k.cut ? full(k.s(f)) : mix(cur, full(k.s(f)), glide((f - k.f) / (k.dur ?? 24)));
  }
  return cur;
};
const T = (f: number) => f / FPS;
/** push-in factor since f0: the subject grows ~rate per frame; `punch` raises it (with 8 f soft edges) for the first n frames */
const pushK = (f: number, f0: number, rate: number, punch = 0, n = 35) => {
  const x = Math.max(0, f - f0);
  let s = rate * x;
  if (punch > rate) for (let i = 0; i < Math.min(x, n); i++) s += (punch - rate) * Math.max(0, Math.min(1, (i + 0.5) / 8, (n - i - 0.5) / 8));
  return Math.exp(-s);
};
/** dolly push: camera slides toward the look point by factor k */
const dolly = (pos: V3, look: V3, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos: [look[0] + (pos[0] - look[0]) * k, look[1] + (pos[1] - look[1]) * k, look[2] + (pos[2] - look[2]) * k], look, ...rest });
/** zoom push (camera stays put, for lenses next to towers / houses): tan(fov/2) shrinks by k */
const zoom = (pos: V3, look: V3, fov: number, k: number, rest: Partial<Cam> = {}): Shot =>
  ({ pos, look, fov: (360 / Math.PI) * Math.atan(Math.tan((fov * Math.PI) / 360) * k), ...rest });
/** a roll-only move on top of an existing framing */
const rolled = (s: (f: number) => Shot, roll: number) => (f: number): Shot => ({ ...s(f), roll });

// near-left anchorage (kept for world.ts: the bridge is intact, so the bolt never moves)
export const ANCHOR: V3 = [-2.7, D0 + 0.62, -37];
export const snapEnd = (snap: number): V3 => {
  const u = easeOut(snap);
  return [ANCHOR[0] - 0.6 * u, ANCHOR[1] + 5.5 * u - 2.0 * u * u, ANCHOR[2] + 4.5 * u];
};

// ---- framings (f -> camera); each pushes in from the frame its key starts ----
// All cameras stand on the start side of the deck (z +24..+28) and look at the trees (z 20-21).
// shot 1 (LEVEL 1, building site): wide 3/4 front -> MS blue hammering -> MS brown hammering
const S1a = (f: number) => dolly([8, D0 + 2.6, 26.5], [0, D0 + 2.0, 20.5], pushK(f, 0, 0.0025), { fov: 50 });
const S1b = (f: number) => dolly([2.5, D0 + 2.2, 25], [-1.2, D0 + 1.8, 20.5], pushK(f, 115, 0.002), { fov: 42 });
const S1c = (f: number) => dolly([4.5, D0 + 2.2, 24.5], [1.2, D0 + 1.8, 20.5], pushK(f, 300, 0.002), { fov: 42, roll: 0.03 });
// shot 2 (LEVEL 2): wide of both trees at 2.6 m -> close on blue's wobbling platform -> brown's foundation
const S2a = (f: number) => dolly([7, D0 + 3.0, 25.5], [0, D0 + 2.6, 20.5], pushK(f, 363, 0.0025), { fov: 46 });
const S2b = (f: number) => dolly([4, D0 + 3.4, 24.5], [-1.2, D0 + 3.0, 20.5], pushK(f, 438, 0.0015, 0.006, 35), { fov: 40 });
const S2c = (f: number) => dolly([5, D0 + 3.2, 25], [1.2, D0 + 2.8, 20.5], pushK(f, 510, 0.002), { fov: 42 });
// shot 3 (LEVEL 3): wide of the roof level -> close on blue's giant roof as it crashes
//   -> hard cut to the deck aftermath (blue dazed, brown still hammering) once the roof is down
const S3a = (f: number) => dolly([7, D0 + 3.6, 25], [0, D0 + 3.6, 20.5], pushK(f, 601, 0.0025), { fov: 46 });
const S3b = (f: number) => dolly([3, D0 + 3.4, 24.5], [-1.2, D0 + 3.8, 20.5], pushK(f, 664, 0.0015, 0.006, 35), { fov: 40 });
const S3c = (f: number) => dolly([6, D0 + 2.6, 26], [0, D0 + 1.0, 21], pushK(f, 700, 0.002), { fov: 50 });
// shot 4 (LEVEL 4): wide of the tall tower -> hard cut to the deck aftermath right after the total collapse
//   (blue dazed, brown finishing) -> close on brown's finished treehouse
const S4a = (f: number) => dolly([8, D0 + 4.0, 26], [0, D0 + 4.2, 20.5], pushK(f, 799, 0.0025), { fov: 50 });
const S4a2 = (f: number) => dolly([6, D0 + 2.6, 26], [0, D0 + 1.0, 21], pushK(f, 1045, 0.002), { fov: 50 });
const S4b = (f: number) => dolly([3.5, D0 + 5.0, 26.5], [1.2, D0 + 5.6, 20.9], pushK(f, 1060, 0.002), { fov: 46 });
// shot 5 (result): front wide of the three on the deck -> closer on the dog + scoreboard
const S5a = (f: number) => dolly([6, D0 + 2.4, 26], [0, D0 + 1.4, 21.5], pushK(f, 1157, 0.0025), { fov: 48 });
const S5b = (f: number) => dolly([3.5, D0 + 2.0, 25], [0, D0 + 1.6, 21.5], pushK(f, 1240, 0.002), { fov: 40 });
// shot 6 (ending): the three sitting in brown's treehouse, slow push-in to the last word
const S6a = (f: number) => dolly([5, D0 + 5.6, 26.5], [1.2, D0 + 6.0, 20.9], pushK(f, 1406, 0.0025), { fov: 46 });
const S6b = (f: number) => dolly([4, D0 + 5.4, 25.5], [1.2, D0 + 5.9, 20.9], pushK(f, 1500, 0.001), { fov: 42 });

const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: S1a },
    { f: 115, dur: 37, s: S1b }, // centred on 133 ("Watch this!")
    { f: 300, dur: 32, s: S1c }, // centred on 316 ("Slow and steady" 300)
  ],
  2: [
    { f: 363, s: S2a },
    { f: 438, dur: 35, s: S2b }, // centred on 455 ("It wobbles" 438)
    { f: 510, dur: 30, s: S2c }, // centred on 525 ("Brown adds a foundation" 476)
  ],
  3: [
    { f: 601, s: S3a }, // cut (L2 -> L3)
    { f: 664, dur: 35, s: S3b }, // centred on 681 ("The roof came down" 664)
    { f: 700, cut: true, s: S3c }, // aftermath on the deck: blue dazed, brown hammering
  ],
  4: [
    { f: 799, s: S4a }, // cut (L3 -> L4)
    { f: 1045, cut: true, s: S4a2 }, // aftermath on the deck right after the total collapse (34.5 s)
    { f: 1060, dur: 30, s: S4b }, // centred on 1075 ("Finished. Small. But it stands." 1064)
  ],
  5: [
    { f: 1157, s: S5a }, // cut (L4 -> result)
    { f: 1240, dur: 30, s: S5b }, // centred on 1255 ("Three-one. Brown wins." 1211)
  ],
  6: [
    { f: 1406, s: S6a }, // cut (result -> ending)
    { f: 1500, dur: 30, s: S6b }, // centred on 1515 ("Comment BLUE or BROWN" 1520)
  ],
};

// impact kicks (reference v14): the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
// L1 platform collapse (9.42 s), L3 roof crash (22.8 s), L4 total collapse (34.5 s).
const KICKS: [number, number][] = [[9.42, 0.8], [22.80, 1.0], [34.50, 1.2]];
export const kickAt = (t: number) => {
  let a = 0;
  for (const [t0, g] of KICKS) {
    const n = Math.floor((t - t0) * FPS + 1e-6);
    if (n >= 0 && n < 7) a += g * (n % 2 ? -1 : 1) * (1 - n / 7) ** 1.5;
  }
  return a;
};
export const camAt = (id: number, f: number): Cam => {
  const c = run(CAMS[id], f), a = kickAt(T(f));
  if (!a) return c;
  const d: V3 = [c.look[0] - c.pos[0], c.look[1] - c.pos[1], c.look[2] - c.pos[2]];
  const L = Math.hypot(...d), h = Math.hypot(d[0], d[2]) || 1;
  const m = (3 / 640) * Math.tan((c.fov * Math.PI) / 360) * L * a; // metres at the look distance for 3 px x a
  return { ...c, look: [c.look[0] - (d[2] / h) * m, c.look[1] + 0.6 * m, c.look[2] + (d[0] / h) * m], roll: c.roll + a * 0.004 };
};
/** frame at which the current key's move has finished (for picking billboard views per key, not per frame) */
export const keyEnd = (id: number, f: number) => {
  let e = 0;
  for (const k of CAMS[id]) if (f >= k.f) e = k.f + (k.cut ? 0 : k.dur ?? 24);
  return Math.max(f, e);
};

// ---------------- lens: depth of field + foreground framing ----------------
/** Lens blur per shot (thin lens). cInf = blur-disc radius in px at 1080x1920 for things at infinity; 0 = all sharp.
 *  Reference: DOF on in ~1/3 of shots; when on, background sigma720 CU 4.2, MS 4.0, FS 2.7, WS 1.9,
 *  foreground objects 4-8 (disc radius at 1080p = 3 x sigma720). Establishing/wide/most full shots stay sharp.
 *  Entries switch on cuts (no dur) or ramp with the camera glide they share f/dur with. focus = world point (else the
 *  camera look point). */
export type Dof = { f: number; dur?: number; cInf: number; focus?: (f: number) => V3 };
export const DOF: Dof[] = [
  { f: 0, cInf: 12, focus: () => [0, D0 + 2.0, 20.5] }, // shot 1 wide: builders sharp, town soft
  { f: 115, dur: 37, cInf: 14, focus: () => [BLUE_X, D0 + 1.8, 20.5] }, // blue MS (hammering)
  { f: 300, dur: 32, cInf: 14, focus: () => [BROWN_X, D0 + 1.8, 20.5] }, // brown MS (calm)
  { f: 363, cInf: 10, focus: () => [0, D0 + 2.6, 20.5] }, // L2 wide
  { f: 438, dur: 35, cInf: 8, focus: () => [BLUE_X, D0 + 3.0, 20.5] }, // wobble close on blue
  { f: 510, dur: 30, cInf: 8, focus: () => [BROWN_X, D0 + 2.8, 20.5] }, // brown's foundation
  { f: 601, cInf: 0 }, // L3 wide: all sharp
  { f: 664, dur: 35, cInf: 8, focus: () => [BLUE_X, D0 + 3.8, 20.5] }, // roof crash close
  { f: 700, cInf: 8, focus: () => [0, D0 + 1.2, 20.5] }, // aftermath on the deck
  { f: 799, cInf: 0 }, // L4 wide
  { f: 1045, cInf: 8, focus: () => [0, D0 + 1.2, 20.5] }, // aftermath on the deck after the total collapse
  { f: 1060, dur: 30, cInf: 10, focus: () => [BROWN_X, D0 + 5.6, 20.9] }, // finished treehouse
  { f: 1157, cInf: 0 }, // result wide
  { f: 1240, dur: 30, cInf: 12, focus: () => [DOG_X, D0 + 1.6, 22] }, // scoreboard close
  { f: 1406, cInf: 12, focus: () => [BROWN_X, D0 + 6.0, 20.9] }, // ending: the three in the treehouse
];
export const dofAt = (f: number) => {
  let i = 0; while (i + 1 < DOF.length && f >= DOF[i + 1].f) i++;
  const d = DOF[i], p = DOF[Math.max(0, i - 1)];
  const k = d.dur ? Math.min(1, (f - d.f) / d.dur) : 1;
  return { cInf: p.cInf + (d.cInf - p.cInf) * k, focus: d.focus };
};
/** what the lens focuses on (DOF): the DOF table's focus point, else the camera look point */
export const focusAt = (id: number, f: number): V3 => {
  const d = dofAt(f);
  return d.focus ? d.focus(f) : camAt(id, f).look;
};

/** near framing objects: visible while a <= f < b; kit = a GLB name accepted by build.ts prop() */
// pos = base point (prop()'s x, y, z: the model's base sits on y), s = height in metres (prop()'s h), yaw in radians.
// They sit at 0.3-0.5 x the focus distance and cover 10-25 % of one frame edge, never a face; they are meant to be
// in front of the lens, so build them outside prop()'s sight-line test.
export type Fg = { a: number; b: number; kit: string; pos: V3; s?: number; yaw?: number };
export const FOREGROUND: Fg[] = [
  // shot 1 wide (S1a, focus ~11 m): a bush in the bottom-left corner at ~7 m from the lens, clear of the faces
  { a: 0, b: 363, kit: "plant_bushDetailed", pos: [2.0, D0, 23.5], s: 1.0, yaw: 0.4 },
];

// Timeline of the stickman race (Clinct post 2, 3D remake): 6 shots timed to the voice words
// (~/workspace/motion-studio/projects/stickman-race-3d/words.json), story physics (racer positions,
// dog stroll, finish mat) and the camera grammar measured in the reference study: continuous slow
// push-ins; symmetric ease-in-out moves ~23 f (10 in / 10 out), peak ~15 px/f at 720p; big reframes
// are cuts; impacts are 7-frame kicks that flip sign every frame; no hand-held float.
// The world is the bridge town, reused wholesale: the deck (y = D0, z -30..+30, 5 m wide) IS the
// race track. Start line z = +18, finish mat z = -18. The bridge never collapses here.
export const FPS = 30;
export const TOTAL = 1488; // 49.6 s
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

// ---------------- race physics (t = story time in seconds = video time) ----------------
export const START_Z = 18, FINISH_Z = -18;
export const BLUE_X = -1.2, BROWN_X = 1.2, DOG_X = 0;
// Blue: sprints 3.0 m/s 15-21 s (cartwheels ~17.5 / ~19.5), tires to 0.5 m/s, nearly stops;
// after the cut to the finish (34 s) he staggers in from z -12.5 and collapses on the mat ~37 s.
export const blueZ = (t: number) => {
  if (t < 34) return lin([[0, 18], [15, 18], [21, 0], [27.5, -3.25], [34, -5.2]], t);
  return lin([[34, -12.5], [38, -16.5], [49.6, -16.5]], t);
};
// Brown: steady 1.3 m/s the whole race, never breaks stride; staggers in after the cut, collapses ~38 s.
export const brownZ = (t: number) => {
  if (t < 34) return lin([[0, 18], [15, 18], [27.5, 1.75], [34, -6.7]], t);
  return lin([[34, -13.5], [38, -18.5], [49.6, -18.5]], t);
};
// Dog: watches from the side until 27.5 s, then strolls 2.5 m/s, passes both ~30.5 s, sits on the mat ~35.5 s.
export const dogZ = (t: number) => lin([[0, 2], [27.5, 2], [35.5, -18], [49.6, -18]], t);
export const midZ = (t: number) => (blueZ(t) + brownZ(t)) / 2;
export const front = (tau: number) => midZ(tau); // z of the racers' midpoint, running toward -z
export const marchPhase = (tau: number) => ((tau % 1) + 1) % 1; // 1 Hz cycle = 2 steps/s, footfalls at 0 and 0.5
/** per-character walk-cycle phase: rate in cycles/s (blue sprint ~1.5, brown walk 1, dog trot 2) */
export const phase = (t: number, rate: number) => ((t * rate) % 1 + 1) % 1;
export const SNAP = 34.62, DROP0 = 36.35, DROP1 = 36.95;
export const amp = (tau: number) =>
  lin([[14.85, 0], [17.8, 0.07], [21.4, 0.13], [27.4, 0.26], [33.0, 0.46], [SNAP, 0.55], [SNAP + 0.35, 0.0]], tau);
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
  { id: 1, a: 0, b: 291, light: "day", crowd: "none", tau: (t) => t }, // 0-9.7 s mockery
  { id: 2, a: 291, b: 450, light: "day", crowd: "none", tau: (t) => t }, // 9.7-15 s start line
  { id: 3, a: 450, b: 825, light: "day", crowd: "none", tau: (t) => t }, // 15-27.5 s race
  { id: 4, a: 825, b: 1020, light: "day", crowd: "none", tau: (t) => t }, // 27.5-34 s dog
  { id: 5, a: 1020, b: 1278, light: "day", crowd: "none", tau: (t) => t }, // 34-42.6 s finish
  { id: 6, a: 1278, b: 1488, light: "day", crowd: "none", tau: (t) => t }, // 42.6-49.6 s laugh + CTA
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
const Fz = (id: number, f: number) => front(SHOTS[id - 1].tau(T(f)));
const Dz = (f: number) => dogZ(T(f));
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
// shot 1 (mockery, at the start line z=18): wide 3/4 front -> MS blue laughing -> MS brown calm
const S1a = (f: number) => dolly([8, D0 + 2.6, 26], [0, D0 + 1.6, 18], pushK(f, 0, 0.0025), { fov: 50 });
const S1b = (f: number) => dolly([2.5, D0 + 2.0, 24], [-1.2, D0 + 1.7, 18], pushK(f, 78, 0.002), { fov: 42 });
const S1c = (f: number) => dolly([4.5, D0 + 2.0, 23.5], [1.2, D0 + 1.7, 18], pushK(f, 170, 0.002), { fov: 42, roll: 0.03 });
// shot 2 (start line): 3/4 front views from the start side, ABOVE the railing (the old low side
// views at y=0.9-1.2 put the railing bar across the racers' chests and hid their legs; the
// pure-side S2b also lined blue up behind brown, hiding him on "Blue... or Brown?")
const S2a = (f: number) => dolly([6, D0 + 2.6, 24.5], [0, D0 + 1.4, 18], pushK(f, 291, 0.0025), { fov: 44 });
const S2b = (f: number) => dolly([5, D0 + 2.4, 25], [0, D0 + 1.5, 18], pushK(f, 380, 0.002), { fov: 44 });
// shot 3 (race): the pack separates fast (blue sprints, brown walks), and a portrait side camera only spans
// ~2 m of width — so each key tracks ONE racer, never the midpoint: blue for the sprint + showboat,
// then brown as he steadily closes in. (Midpoint tracking lost both racers off-frame past f~540.)
// Cameras are HIGH (y>=3.0) so the railing bars cross at ankle level, not chest level (look-check f583).
const S3a = (f: number) => { const B = blueZ(T(f)); return dolly([9, D0 + 3.2, B + 1], [-0.6, D0 + 1.2, B], pushK(f, 450, 0.002), { fov: 46 }); };
const S3b = (f: number) => { const B = blueZ(T(f)); return dolly([7, D0 + 3.0, B + 1], [-1.2, D0 + 1.3, B], pushK(f, 565, 0.0015, 0.006, 35), { fov: 40 }); };
const S3c = (f: number) => { const R = brownZ(T(f)); return dolly([7, D0 + 3.2, R + 2], [1.2, D0 + 1.2, R], pushK(f, 700, 0.002), { fov: 46 }); };
// shot 4 (dog): head-on from beyond the finish, looking back up the track — portrait stages along depth,
// not width: the dog trots TOWARD the lens with both bent-over racers behind him in the same frame.
// (Side tracking lost the racers off-frame once the dog ran >4 m ahead of them.)
const S4a = (f: number) => dolly([2.5, D0 + 1.6, -15.5], [0, D0 + 0.9, -2], pushK(f, 825, 0.002), { fov: 44 });
const S4b = (f: number) => { const D = Dz(f); return dolly([2, D0 + 1.4, -20.5], [0, D0 + 0.8, D], pushK(f, 920, 0.0015), { fov: 40, roll: -0.03 }); };
// shot 5 (finish mat): side views from far out so blue + dog fit the narrow portrait window
// together (the old S5a looked at the mat from z=-12 and put blue 24 deg off-axis — out of
// frame, f1051; the old S5b at y=1.8 put the railing across the dog and blue 14 deg out, f1201).
// S5a centres on blue+dog (brown is 11 m back and cleanly OUT of frame, not half-cropped);
// S5b frames both collapsed racers + dog + stars. Cameras high (y>=3.0) for ankle-level rails.
const S5a = (f: number) => dolly([13, D0 + 3.0, -15.5], [0, D0 + 1.0, -15.5], pushK(f, 1020, 0.002), { fov: 52 });
const S5b = (f: number) => dolly([12, D0 + 4.0, -17.5], [0, D0 + 1.0, -17.5], pushK(f, 1100, 0.002), { fov: 46 }); // y=4.0: sitting racers are only ~1.2 m tall, so y=3.2 still put the 1.1 m rail across their chests (h1200)
// shot 6 (laugh + CTA): front view of the three at the mat, slow push-in to the last word
// (S6b push halved and camera pulled back 1.5 m: the old push cropped brown's face at the
// left edge by f1401)
const S6a = (f: number) => dolly([3, D0 + 2.0, -25.5], [0, D0 + 1.4, -18], pushK(f, 1278, 0.0025), { fov: 44 });
const S6b = (f: number) => dolly([3.5, D0 + 2.0, -25], [0, D0 + 1.4, -18], pushK(f, 1380, 0.001), { fov: 42 });

const CAMS: Record<number, Key[]> = {
  1: [
    { f: 0, s: S1a },
    { f: 78, dur: 37, s: S1b }, // centred on 96 ("Look at him!")
    { f: 170, dur: 32, s: S1c }, // centred on 186 ("Slow and steady")
  ],
  2: [
    { f: 291, s: S2a },
    { f: 380, dur: 30, s: S2b }, // centred on 395, just before "Blue... or Brown?" (402)
  ],
  3: [
    { f: 450, s: S3a }, // cut (start line -> race)
    { f: 565, dur: 35, s: S3b }, // centred on 582 ("Too easy!")
    { f: 700, dur: 30, cut: true, s: S3c }, // CUT centred on 715 (glide would cross 8 m of empty deck)
  ],
  4: [
    { f: 825, s: S4a }, // cut (race -> dog)
    { f: 920, dur: 30, s: S4b }, // centred on 935, just after "strolled past them both" (909)
  ],
  5: [
    { f: 1020, s: S5a }, // cut (dog -> finish mat)
    { f: 1100, dur: 29, s: S5b }, // centred on 1114 ("I can't feel my legs" 1095, collapse ~1116)
  ],
  6: [
    { f: 1278, s: S6a }, // cut (finish -> laugh)
    { f: 1380, dur: 30, s: S6b }, // centred on 1395 ("comment BLUE or BROWN" 1386)
  ],
};

// impact kicks (reference v14): the image offset flips sign every frame (~3 px at 720p per unit), decays to 0 in
// 7 f, roll +-0.23 deg per unit; they start on the first frame at/after the event. No hand-held float.
// Cartwheel landings (~18.1 s, ~20.1 s) and the collapse on the mat (~37.2 s).
const KICKS: [number, number][] = [[18.1, 0.7], [20.1, 0.7], [37.2, 1.0]];
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
  { f: 0, cInf: 12, focus: () => [0, D0 + 1.6, 18] }, // shot 1 wide: racers sharp, town soft
  { f: 78, dur: 37, cInf: 14, focus: () => [BLUE_X, D0 + 1.7, 18] }, // blue MS (laughing)
  { f: 170, dur: 32, cInf: 14, focus: () => [BROWN_X, D0 + 1.7, 18] }, // brown MS (calm)
  { f: 291, cInf: 10, focus: () => [0, D0 + 1.0, 18] }, // start line
  { f: 450, cInf: 0 }, // race tracking wide: all sharp
  { f: 565, dur: 35, cInf: 8, focus: (f) => [BLUE_X, D0 + 1.3, blueZ(T(f))] }, // showboat close on blue
  { f: 700, cInf: 0 }, // race wide again
  { f: 825, cInf: 10, focus: (f) => [DOG_X, D0 + 0.9, dogZ(T(f))] }, // dog tracking
  { f: 920, dur: 30, cInf: 12, focus: (f) => [DOG_X, D0 + 0.8, dogZ(T(f))] }, // dog close
  { f: 1020, cInf: 0 }, // finish wide
  { f: 1100, dur: 29, cInf: 10, focus: () => [0, D0 + 0.8, FINISH_Z] }, // collapse on the mat
  { f: 1278, cInf: 12, focus: () => [0, D0 + 1.4, FINISH_Z] }, // laugh: faces at the mat
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
  { a: 0, b: 291, kit: "plant_bushDetailed", pos: [2.0, D0, 22], s: 1.0, yaw: 0.4 },
];

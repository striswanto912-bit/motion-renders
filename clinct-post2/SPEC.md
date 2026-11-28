# SPEC.md — Clinct Post 2: "Pick Your Stickman. The Dog Wins Anyway."

Director's brief for the HyperFrames build. Storyline already picked by Wazz (trend-validated);
storyboard v2 approved; VO generated (single-take, Eleven v4, voice Josh). No new storyline round.

## GOAL
Viewer picks BLUE or BROWN in the comments before the ending, then re-watches to check
they were wrong. One sentence: the dog wins, and the viewer comments their pick.

## OUTPUT
HyperFrames, 1080 x 1920 vertical (9:16), 30 fps.
Duration: 49.6 s (VO length) = 1488 frames. VO-led; VO-only in v1 — a music bed + SFX
were attempted via media-use resolve (see AUDIO) and are blocked pending HeyGen CLI auth /
HyperFrames Pro; do not hold the render for them.

## SOURCE FILES
- VO audio: `assets/vo-post2.mp3` (49.6 s, Eleven v4, voice Josh, 1073 credits).
- VO script: `~/workspace/clinct/vo-script-post2.md`
- Word timings: `assets/transcript.json` (Parakeet, 112 words); caption groups derived:
  `assets/caption-groups.json` (41 groups, 2–5 words, sentence/pause breaks).
- Storyboard v2: `~/workspace/imagine_media/media-generation-clinct-stickman-race-storyboar-0-9f5ef50a-d375-431b-b166-dac35c1a1444.webp`
- Trend brief + captions/hashtags: `~/workspace/clinct/trend-brief-2026-11-28.md`
- Reel 1 reference (same characters, same style): IG https://www.instagram.com/reel/DgQ0WUVhvx4/ ,
  FB https://web.facebook.com/reel/2213766282682171

## WHY THIS HOOK (from reel 1 data, 28 Nov 2026)
- Reel 1: IG 144 views, avg watch 12.8 s / 44 s; FB 137 views, avg watch 6 s, most FB viewers
  gone by second 2. Total 281 views, 5 likes, 0 comments.
- Fix, non-negotiable: the text "CHOOSE A STICKMAN — BLUE or BROWN?" is on screen from
  FRAME 0 (second 0), not after a setup beat. Frame 0 is the thumbnail and the hook.
- Burned-in captions throughout (many watch muted); picture must carry the hook without sound.

## LOOK
- Same world as reel 1: flat 2D stickmen (blue, brown) + dog, plain light ground, no dark void.
- Ground: flat warm light paper #F5EFE0, no gradient. Ink: near-black #1A1A1A outlines.
  Accent 1: stickman blue #2B6CF5 (only on blue + the word BLUE). Accent 2: brown #8A5A2B
  (only on brown + the word BROWN). Dog: warm tan #D9A05B, ears/patch #B07A3A.
- Display face: Poppins 800 (bundled). Hook: two lines at 60 px (right edge ~870 < 888).
  Captions: base 64 px, fitted per group to max 640 px inside the rail safe box (min 28 px).
  Max 5 English words per caption line.
- Medium: flat cartoon, thick ink outlines, squash-and-stretch on characters (damping ~0.5),
  line-boil via finite stepped rotation wobble (±0.5°, 0.08 s steps) on held heads only.
  No glow, no neon, no particles, no purple/blue gradient, no glass cards, no logo in a corner.
- Safe zone (1080x1920): 288–1248 px down, 120–888 px across, NARROWING to x 120–780 below
  y 840 where TikTok's action rail widens (vertical.md). All readable text inside it:
  hook (y 291–380, above the rail), CTA pill (two lines, right edge ~771), captions in the
  120–780 box with bottom edge y ~1240. START/FINISH ground labels sit on the ground
  (y ~1440, outside the zone by design) and are marked data-layout-allow-safe-zone.
  Nothing else meant to be read outside the zone.
- Ground line y 1500; characters' feet on y 1500; soft shadow ellipses under feet.

## SHOTS (timed to the REAL VO transcript — scene boundaries = VO sentence boundaries)
1. 0–9.7 s (f 0–291) — BLUE MOCKS BROWN. Frame 0: hook "CHOOSE A STICKMAN — BLUE or BROWN?"
   already up (hook sub-composition overlay, holds through beat 2). Blue points and laughs at brown walking
   slowly; brown calm, smug; dog sits watching from the side. VO: "Blue thinks he's the
   fastest stickman alive." / blue laughs "walks like my grandma!" / brown "slow and steady."
   Hero move: blue's pointing laugh; dog's head turn is the secondary move.
2. 9.7–15.0 s (f 291–450) — START LINE. Both crouch at the START line; hook text holds.
   VO: "so they lined up... Blue... or Brown?" (shouted). Both lean forward at the end
   (anticipation into the race).
3. 15.0–27.5 s (f 450–825) — RACE. Blue sprints, showboating somersaults; brown just keeps
   walking steadily. Ground scrolls; speed lines + dust puffs at blue's feet. Two punch-ins
   (wrapper scale 1 → 1.12): ~19 s on blue "Too easy!", ~22 s on brown "just keeps walking."
   VO fast-paced, blue "Too easy!", narrator deadpan "Brown just... keeps walking."
4. 27.5–34.0 s (f 825–1020) — THE DOG. Dog strolls past both, unbothered. Both stickmen bent
   over at the waist (upper body only; legs stay planted, feet on the ground), then freeze
   in shock, heads following the dog. VO: narrator surprised whisper "Wait... who is THAT?"
   [short pause], amused "the dog just strolled past them both." Hold the reaction — let it
   land slowly.
5. 34.0–42.6 s (f 1020–1278) — FINISH. Dog sits proudly on the checkered FINISH mat; blue and
   brown collapse flat behind it, exhausted. VO: blue out of breath "the DOG?!", brown
   "I can't feel my legs.", narrator triumphant "the winner is... the dog. Obviously."
6. 42.6–49.6 s (f 1278–1488) — LAUGH + CTA. All three sit together laughing, sharing fries;
   dog with a bone. On-screen pill "comment / BLUE or BROWN" (two lines, CTA sub-composition
   overlay, y ~700–830, in the empty band above the characters' heads so it never covers
   their faces).
   VO: cheerful "they laughed, shared their fries..." + playful CTA "comment BLUE or BROWN
   before you watch it again!" Last 1.5 s holds still for the loop back to frame 0.

## MOTION
- Eases: enter = back.out(1.4) (characters), move = power2.inOut, exit = power3.in (6–8 frames).
- Springs on squash/stretch only, damping 0.45–0.6, never on opacity/colour.
- Head leads, arms follow (offset 100–200 ms); never move both arms/eyes in unison.
- Feet stay on the ground; contact sells every step and stumble.
- Seams between the 6 scenes are hard cuts (the reference reels cut hard); inside scene 3,
  two punch-ins carry the rhythm.

## CAPTIONS / TEXT ON SCREEN
- Burned-in captions = the VO lines, 41 groups from assets/caption-groups.json, max 5 words,
  in the 120–780 rail safe box, bottom edge y ~1240. Per-word OPACITY fades (0.12 s in, dim to 0.45 at
  word end, group fades out at its end); Poppins 800; ink text on light ground; the word BLUE
  in blue, BROWN in brown. The registry component `caption-clip-wipe` was installed and
  evaluated, then REJECTED: lint's heavy-overlay field warning says ~40 clip-path elements can
  capture solid-black for the first half of a render, and this track has 116 words — opacity
  reveals carry zero heavy-overlay elements and the same timing. Two standalone em-dash
  tokens were dropped from the groups (punctuation, not spoken words).
- Persistent from 0 s: hook "CHOOSE A STICKMAN — BLUE or BROWN?" (top of safe zone, beats 1–2),
  then CTA pill "comment BLUE or BROWN" (beats 6). Both are sub-compositions (hook.html,
  cta.html) mounted from the root, per the lint nested-structure rule.

## AUDIO
- One voice track: assets/vo-post2.mp3, <audio id="vo">, data-start 0, data-duration 49.6,
  data-volume 1, own lane.
- Music bed + SFX: BLOCKED, attempted 28 Nov 2026 ~09:30 WIB, VO-only in v1.
  `media-use resolve` needs the `heygen` CLI binary: installed v0.13.0 to ~/.local/bin
  (official installer, checksum-verified) but it is NOT authenticated — the HyperFrames CLI
  sign-in (striswanto912@gmail.com, verified) does NOT transfer to the heygen CLI.
  Its auth paths all need a human/browser from here: `heygen auth login --device` fails
  ("oauth device authorization failed: invalid_request"); `heygen auth login --oauth` opens a
  browser (no live browser in this session); API-key path needs a HeyGen API key.
  Fallback `media-use generate --type music` also blocked: Pro feature on the Free plan
  (80 credits / $0.09 per 60 s track, --plan verified; nothing charged).
- RE-ATTEMPT 28 Nov 2026 (after steer: "HeyGen now signed in via device-code login"):
  `heygen auth status` in this shell still returns auth_error "no API key found"; ~/.heygen/
  holds no credential file (only telemetry/update files); direct catalog search
  `heygen audio sounds list --query ... --type music` fails with the same auth_error — the
  sign-in did NOT land in this environment. Separately, `media-use resolve --type bgm` and
  `--type sfx` now fail with "Media download blocked: host resolves to a non-public address"
  (after fixing PATH so the CLI finds ~/.local/bin/heygen — it is NOT on PATH by default);
  `--candidates` finds nothing cached. So music/SFX stay OUT of v1; film is VO-only.
  UNBLOCK (parent's call): redo the device-code login in THIS shell (or copy the credential),
  or supply a music/SFX mp3 directly; if the download-block persists, the sandbox egress is
  the blocker, not auth.
  If music is added later, place it as a second <audio> at data-volume ~0.3, ducked under VO.

## BANNED
Black/dark void ground; glow, bloom, neon, lens flare; purple/blue gradients; glass cards;
everything centred + fading in at once; text drifting while read; corner logo; three-card grids;
hook text arriving late (after second 0); Adam/Rachel voices (ElevenLabs retires default voices
31 Dec 2026 — VO already uses Josh, keep it that way).

## QA (frames to check before render)
- Frame 0: hook text readable, blue + brown + dog all visible, not black, not a logo.
- ~2 s: a viewer who swipes at 2 s has still seen the choice (reel 1's drop-off point).
- Beat 4 (~27–34 s): dog passing reads without sound (captions + action alone).
- Final frame: CTA readable inside the safe zone; loop cut back to frame 0 feels clean.
- `npx hyperframes check --json` clean; snapshot review per the HyperFrames work loop;
  render only after Wazz approves the preview (or says no stops).

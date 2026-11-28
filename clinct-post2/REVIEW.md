# REVIEW — Clinct post 2: "Pick Your Stickman. The Dog Wins Anyway."

Date: 2026-11-28. Project: `~/workspace/clinct/post2/`. Status: build complete, `check` passes
(0 errors, 1 warning kept on purpose — see below). No full render done (parent runs GitHub
Actions). VO-only in v1: music/SFX re-attempted after the "HeyGen now signed in" steer and
still blocked — see AUDIO below.

## Creative calls

- One static wide shot, same ground line (y=1500) and same left/right order (blue left,
  brown right) across all 6 beats; the story is told by pose + face + caption changes, not
  camera moves. Matches reel 1's flat 2D stickman language.
- Hook ("CHOOSE A STICKMAN — BLUE or BROWN?") is a persistent overlay from frame 0, not a
  timed-in title: it must be readable on the thumbnail/first frame. Its pop-in is
  scale-only (opacity stays 1) for the same reason.
- Captions are word-level groups (41 groups, 2–5 words, from the Parakeet transcript) with
  opacity fades, not clip-path wipes: zero clip-path elements left, so no heavy-overlay
  black-capture risk in render.
- CTA ("comment / BLUE or BROWN") is a two-line pill floating at y ~700–830 in the empty
  band above the characters' heads — it never covers a face.
- The dog is the only character that changes scale between beats (0.8 when watching from
  the side in s1/s2/s6, 1.0 when it owns the frame in s4/s5). Deliberate: the dog reads
  small and unthreatening until it wins.
- s3 blue gets a full somersault (the showboat payoff); s5 both racers collapse flat on the
  checkered FINISH mat with dizzy stars — the joke lands in the still frames, not just the VO.

## Storylines not built

The 3-storylines step was skipped on purpose: the story was already chosen and storyboarded
by the user (storyboard v2, trend-informed). No alternative storylines were developed.

## What was measured

- `npm run check` (lint + runtime + layout + motion + contrast): 0 errors, 1 warning
  (`timeline_track_too_dense`, captions.html 41 timed elements), 0 infos. Report
  `75522233-1ec9-425b-b53a-40a2903a471f`, revision `23fee918-8766-4a9e-b119-3a5b88af74ab`.
- Contrast: 23/23 pass (after removing 2 standalone em-dash caption tokens).
- `snapshot --review`: beats sheet (13 settled frames), phone sheet (360 px), seam strips.
  Read all three. Hook, CTA and every caption line are readable at 360 px.
- Snapshot midpoints of every scene, read as PNGs, before and after each fix (see fixes).

## What was only looked at / nobody checked

- The sound was NOT heard by anyone. The VO file exists (`assets/vo-post2.mp3`, 49.6 s,
  Eleven v4, voice Josh) and is referenced as the film's audio track from 0 s, but no
  rendered file was produced, so `hyperframes audio <video>` was never run and no one
  verified VO sync, loudness, or that the audio actually lands in the render. The chunk
  render test (0–3 s draft) is the first audio check — see the render report.
- Motion between beats was judged from stills + the seam strips, not from a moving preview.
  The somersault (s3) and the dog's stroll (s4) are the two moves most at risk of reading
  differently in motion than in stills.

## Fixes made in this review pass (all verified by re-snapshot)

- P0 · t=0 s · hook invisible on frame 0 (fade-in from opacity 0) → pop-in is now scale-only,
  hook fully readable at frame 0. Verified in frame-00-at-0s.png.
- P0 · t=42.6–49.6 s · CTA pill at y 980 covered both laugh faces → moved to y 700–830
  (empty band above heads). Verified at 46.1 s.
- P0 · s1/s6 · dog cropped at the right edge (head/snout past 1080) → dog repositioned
  (s1: translate 880 scale 0.8; s6: translate 880 scale 0.8), fully in frame. Verified at
  0 s, 4.85 s, 46.1 s.
- P0 · s4 · whole-figure bend rotated legs + shadow off the ground (feet floating) →
  only the upper body now bends (#s4-blue-upper / #s4-brown-upper); legs stay planted,
  feet on the ground, shadow unmoved. Verified at 30.75 s.
- P1 · s4 · at 46° the bent arms' tips exited the left frame edge → bend reduced to 30°
  (24°→30° settle) and blue moved 350→450; all limbs in frame. Verified at 30.75 s.

## Open notes (kept, not fixed)

- P1 · s1/s2 captions cross the characters: "SO THE" (10 s) and "HAD TO" (12.35 s) sit
  over blue's face; "SLOW AND STEADY, MY FRIEND" (7.5 s) spans both torsos. Each group is
  on screen ~0.5–1 s and stays legible; the caption rail is fixed inside the vertical safe
  zone (120–780 px) and moving it would push text out of the safe zone or into the hook.
  Accepted as a property of word-level captions over a single wide shot.
- P1 · s4 is the weakest shot. The bend is a 30° lean, not doubled-over: it reads as
  "tired lean" and the collapse payoff is deferred to s5 (flat on the mat), so the story
  still lands, but s4 alone is the least funny frame. With more time: re-rig the arms as
  their own group so the torso can bend 45°+ with hands hanging toward the knees instead
  of swinging out past the frame edge.
- P2 · s3 somersault mid (21.25 s): blue's limbs reach the left edge mid-flip. Dynamic
  moment, accepted.
- P2 · s4 "WAIT..." (27.8 s) over blue's face; s6 "AND LEARNED THEIR LESSON." (46.1 s)
  across the fries boxes. Transient, readable, accepted.
- P2 · The dog is scale 0.8 in s1/s2/s6 and 1.0 in s4/s5 — a sharp-eyed viewer may notice
  the size change between s2 and s4. Accepted: each beat frames the dog for its role.

## Warnings kept on purpose

- `timeline_track_too_dense` (captions.html, 41 timed elements): the caption track is dense
  because captions are word-level groups synced to the VO. Splitting it would complicate
  the sync and gain nothing — the render reads the groups, not the track count. Kept.

## AUDIO (music/SFX re-attempt, 28 Nov)

- Re-attempted after the steer that HeyGen is now signed in (device-code login, verified
  via `auth status`): in this shell `heygen auth status` still returns auth_error
  "no API key found"; `~/.heygen/` holds no credential file; direct catalog search
  (`heygen audio sounds list --type music`) fails with the same auth_error. The sign-in
  did NOT land in this environment.
- `media-use resolve --type bgm` and `--type sfx` both fail with "Media download blocked:
  host resolves to a non-public address" (after adding ~/.local/bin to PATH — the heygen
  binary is NOT on PATH by default). `--candidates` finds nothing cached.
- Film stays VO-only in v1. Unblock is the parent's call: redo the device-code login in
  this shell (or copy the credential), or supply a music/SFX mp3 directly. If the
  download-block persists after auth, the sandbox egress is the blocker, not auth.
  Second <audio> at data-volume ~0.3, ducked under VO, if music is added later.

## Next turn

Read this before changing anything. Do NOT re-offer a re-render of s4 at 46° (it breaks the
frame). If music/SFX land later, add the second <audio>, re-run `check`, and re-snapshot
only 0 s, 30.75 s, 46.1 s.

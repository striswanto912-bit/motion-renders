// Central timing + layout config. All times are in seconds of the narration (public/voice.mp3).
export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// TikTok / YouTube Shorts / Reels UI covers the top, the bottom (caption + buttons) and the right edge.
// Keep every text and key element inside this box.
export const SAFE = { top: 230, bottom: 480, left: 130, right: 130 };

export const TRANSITION_FRAMES = 18; // 0.3 s overlap between scenes
export const END_SEC = 51.3; // narration ends at 49.08 s, the rest is the outro

// Scene cut points (seconds) taken from the narration, in order of the 10 scenes.
export const CUTS = [0, 7.2, 9.0, 15.8, 19.0, 26.0, 34.2, 41.6, 46.0, 49.08];

export const COLORS = {
  ink: "#0a0f2c",
  yellow: "#ffd84a",
  cyan: "#7be0ff",
  white: "#ffffff",
};

export const SFX_MAX_VOLUME = 0.5; // sound effects never go above half volume; the files are also normalised to about -12 dBFS
export const VOICE_VOLUME = 1;

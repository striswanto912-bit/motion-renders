import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, springTiming, type TransitionPresentation } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { CUTS, END_SEC, FPS, HEIGHT, SFX_MAX_VOLUME, TRANSITION_FRAMES, VOICE_VOLUME, WIDTH } from "./config";
import { SCENES } from "./scenes/Scenes";
import { SFX } from "./sfx";
import { Captions } from "./components/Captions";
import "./fonts";

/** Frame length of every scene so that scene i is fully visible starting at CUTS[i] (the transitions overlap the cuts). */
export const sceneDurations = (): number[] => {
  const T = TRANSITION_FRAMES;
  return CUTS.map((cut, i) => {
    const next = i < CUTS.length - 1 ? CUTS[i + 1] : END_SEC;
    const len = Math.round((next - cut) * FPS);
    if (i === 0) return len + T / 2;
    if (i === CUTS.length - 1) return len + T / 2;
    return len + T;
  });
};
export const TOTAL_FRAMES = Math.round(END_SEC * FPS);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const presentations: TransitionPresentation<any>[] = [
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-left" }),
  fade(),
  slide({ direction: "from-right" }),
  wipe({ direction: "from-bottom" }),
  fade(),
  clockWipe({ width: WIDTH, height: HEIGHT }),
  slide({ direction: "from-top" }),
  fade(),
];

const EndFade: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const o = interpolate(frame, [durationInFrames - 36, durationInFrames - 1], [0, 1], { extrapolateLeft: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#0a0f2c", opacity: o }} />;
};

export const ShowerIdeas: React.FC = () => {
  const durations = sceneDurations();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0f2c" }}>
      <TransitionSeries>
        {SCENES.map(({ id, Component }, i) => (
          <React.Fragment key={id}>
            <TransitionSeries.Sequence durationInFrames={durations[i]} name={id}>
              <Component lead={i === 0 ? 0 : TRANSITION_FRAMES / 2 / FPS} />
            </TransitionSeries.Sequence>
            {i < SCENES.length - 1 ? <TransitionSeries.Transition presentation={presentations[i]} timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })} /> : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Captions />
      <Audio src={staticFile("voice.mp3")} volume={VOICE_VOLUME} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={Math.round(1.2 * FPS)} name={`SFX ${s.file}`}>
          <Audio src={staticFile(`sfx/${s.file}.wav`)} volume={Math.min(s.vol, SFX_MAX_VOLUME)} />
        </Sequence>
      ))}
      <Sequence from={TOTAL_FRAMES - 36}>
        <EndFade />
      </Sequence>
    </AbsoluteFill>
  );
};

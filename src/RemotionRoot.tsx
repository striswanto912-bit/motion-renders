import React from "react";
import { Composition } from "remotion";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AntarcticaScene1"
        component={Scene1}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AntarcticaScene2"
        component={Scene2}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AntarcticaScene3"
        component={Scene3}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AntarcticaScene4"
        component={Scene4}
        durationInFrames={300}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="BridgeShort"
        component={BridgeShort}
        durationInFrames={BRIDGE_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

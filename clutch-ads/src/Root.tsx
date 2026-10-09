import React from "react";
import { Composition, Folder } from "remotion";
import { AdManifesto, MANIFESTO_FRAMES } from "./v2/AdManifesto";
import { AdShort, SHORT_FRAMES } from "./v2/AdShort";
import { AdTwoPlayers, TWO_FRAMES } from "./v2/AdTwoPlayers";
import { AdStory, STORY_FRAMES } from "./v2/AdStory";
import { AdChallenge, CHALLENGE_FRAMES } from "./v2/AdChallenge";

const V = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => (
  <Folder name="Ads">
    <Composition id="Clutch-Short-14s" component={AdShort} durationInFrames={SHORT_FRAMES} {...V} />
    <Composition id="Clutch-TwoPlayers-20s" component={AdTwoPlayers} durationInFrames={TWO_FRAMES} {...V} />
    <Composition id="Clutch-Challenge-20s" component={AdChallenge} durationInFrames={CHALLENGE_FRAMES} {...V} />
    <Composition id="Clutch-Manifesto-33s" component={AdManifesto} durationInFrames={MANIFESTO_FRAMES} {...V} />
    <Composition id="Clutch-Story-44s" component={AdStory} durationInFrames={STORY_FRAMES} {...V} />
  </Folder>
);

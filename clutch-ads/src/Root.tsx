import React from "react";
import { Composition, Folder } from "remotion";
import { Ad1Hype, AD1_FRAMES } from "./ads/Ad1Hype";
import { Ad5Challenge, AD5_FRAMES } from "./ads/Ad5Challenge";
import { Ad2NotLuck, AD2_FRAMES } from "./ads/Ad2NotLuck";
import { Ad3HowItWorks, AD3_FRAMES } from "./ads/Ad3HowItWorks";
import { Ad4ClutchMoment, AD4_FRAMES } from "./ads/Ad4ClutchMoment";

const V = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Ads">
      <Composition id="Ad1-Hype-15s" component={Ad1Hype} durationInFrames={AD1_FRAMES} {...V} />
      <Composition id="Ad2-NotLuck-36s" component={Ad2NotLuck} durationInFrames={AD2_FRAMES} {...V} />
      <Composition id="Ad3-HowItWorks-54s" component={Ad3HowItWorks} durationInFrames={AD3_FRAMES} {...V} />
      <Composition id="Ad4-ClutchMoment-56s" component={Ad4ClutchMoment} durationInFrames={AD4_FRAMES} {...V} />
      <Composition id="Ad5-Challenge-23s" component={Ad5Challenge} durationInFrames={AD5_FRAMES} {...V} />
    </Folder>
  </>
);

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { HeroTower } from "./components/Scenes3D";
import { Round, nums } from "./components/Round";
import { HUD } from "./components/HUD";

export const Test: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Sequence durationInFrames={60}>
      <HeroTower />
    </Sequence>
    <Sequence from={60}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 110 }}>
        <HUD me={100} opp={54} round="Round 1 of 10" pill="Up to 100" track={[{ s: "won" }, { s: "now" }, ...Array(6).fill({ s: "todo" }), { s: "todo", mult: 2 }, { s: "todo", mult: 3 }]} meFirst />
      </AbsoluteFill>
      <Round
        spec={{ ins: "Pick the largest number", he: "בחר את המספר הגדול", faces: nums(62, 92, 94, 39), ans: 2, me: { pick: 2, at: 40 }, opp: { pick: 2, at: 52 }, flip: 22, reveal: 56, banner: { title: "+100", sub: "You were faster by 0.31 s. mira.v +69", tone: "win" }, coinsTo: [250, 190] }}
      />
    </Sequence>
  </AbsoluteFill>
);

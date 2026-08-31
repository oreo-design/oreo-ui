import type { ComponentType } from "react";

/** One storyline at its three wait-tier sizes. */
export type StoryDef = {
  name: string;
  /** 30s+ — a playable minigame. */
  Long: ComponentType;
  /** 5–30s — a small ambient loop, no input. */
  Medium: ComponentType;
  /** <5s — the story's smallest symbol, looping. */
  Short: ComponentType;
};

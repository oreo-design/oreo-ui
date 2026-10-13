import { cn } from "@/lib/cn";
import type { StoryDef } from "./story";
import { snakeStory } from "./stories/snake";
import { breakoutStory } from "./stories/breakout";
import { runnerStory } from "./stories/runner";
import { fishingStory } from "./stories/fishing";
import { orbitStory } from "./stories/orbit";
import { kitchenStory } from "./stories/kitchen";
import "./page-loader.css";

/* ----------------------------------------------------------------------------
 * Page Loader — story-driven loading, sized to the wait.
 *
 * One storyline plays at three scales, keyed to the estimated duration:
 *   short  (<5s)   the story's smallest symbol, looping
 *   medium (5–30s) a small ambient scene — watchable, not steerable
 *   long   (30s+)  the full playable minigame, because a wait that long
 *                  deserves something to do
 *
 * Pick a tier directly, or pass estimateMs and let tierForEstimate map it.
 * -------------------------------------------------------------------------- */

export const LOADER_STORIES = {
  snake: snakeStory,
  breakout: breakoutStory,
  runner: runnerStory,
  fishing: fishingStory,
  orbit: orbitStory,
  kitchen: kitchenStory,
} satisfies Record<string, StoryDef>;

export type LoaderStory = keyof typeof LOADER_STORIES;
export type LoaderTier = "short" | "medium" | "long";

/** Map an estimated wait to a tier: <5s → short, <30s → medium, else long. */
export function tierForEstimate(ms: number): LoaderTier {
  if (ms < 5_000) return "short";
  if (ms < 30_000) return "medium";
  return "long";
}

export type PageLoaderProps = {
  /** Which storyline to tell. Pick one per product and stay with it. */
  story?: LoaderStory;
  /** Explicit tier — wins over estimateMs. */
  tier?: LoaderTier;
  /** Estimated wait in milliseconds; mapped via tierForEstimate. */
  estimateMs?: number;
  /** Optional caption under the stage ("Indexing your workspace…"). */
  label?: string;
  className?: string;
};

export function PageLoader({ story = "snake", tier, estimateMs, label, className }: PageLoaderProps) {
  const resolved: LoaderTier = tier ?? (estimateMs != null ? tierForEstimate(estimateMs) : "medium");
  const def = LOADER_STORIES[story];
  const Stage = resolved === "long" ? def.Long : resolved === "medium" ? def.Medium : def.Short;
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <Stage />
      {label && <p className="m-0 text-[13px] text-[var(--color-text-secondary)]">{label}</p>}
    </div>
  );
}

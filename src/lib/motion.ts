import { useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Shared motion values — the JS half of the curves declared in `index.css`.
 *
 * Motion's tween default is `easeInOut`, which starts slow; entrances and exits
 * pass `ease: easeOut` so the first frames move. Keep these in sync with the
 * `--ease-*` tokens so CSS- and JS-driven motion match.
 */

/** Strong ease-out. Mirrors `--ease-out`. Entrances, exits, and swaps. */
export const easeOut = [0.23, 1, 0.32, 1] as const;

/** Press feedback. Buttons expose `bounce`/`duration` so docs can tune it live. */
export const pressSpring = { type: "spring", bounce: 0.4, duration: 0.3 } as const;

/** iOS-like curve for size changes. Mirrors `--ease-drawer`. */
export const easeDrawer = [0.32, 0.72, 0, 1] as const;

/**
 * The hidden keyframe an element enters from and exits to.
 *
 * Under `prefers-reduced-motion` the movement is dropped and only the fade
 * survives — reduced motion means gentler, not none, and the fade is what
 * tells you something arrived. Motion defaults to `reducedMotion: "never"`,
 * and a copy-paste library can't assume the app wraps it in `<MotionConfig>`,
 * so each component opts in here.
 *
 *   const hidden = useHidden({ transform: "translateY(4px)" });
 *   <motion.li initial={hidden} animate={{ opacity: 1, transform: "translateY(0px)" }} />
 *
 * Animate to an explicit identity transform, never `"none"` — Motion mixes the
 * numbers inside two matching transform strings, and `"none"` isn't one.
 *
 * Prefer a full `transform` string over Motion's `x`/`y`/`scale` shorthands on
 * anything that animates while the page is busy: the shorthands run on the
 * main thread and drop frames under load.
 */
export function useHidden<T extends Record<string, unknown>>(movement: T) {
  const reduce = useReducedMotion();
  return reduce ? { opacity: 0 } : { opacity: 0, ...movement };
}

/* ----------------------------------------------------------------------------
 * Streamed reveal — how one row of agent output arrives.
 * -------------------------------------------------------------------------- */

/**
 * A row that animates its own height reads as a hard clip: the last line of
 * text is sliced by the overflow edge as the box grows. `--reveal-fade` drives
 * a bottom mask that starts soft and resolves to nothing, so the text emerges
 * through a fade instead of a cut. It is animated *slightly* slower than the
 * height so the softness outlives the growth.
 */
const REVEAL_MASK =
  "linear-gradient(to bottom, #000 calc(100% - var(--reveal-fade, 0px)), transparent calc(100% + 1px))";

const revealHidden = {
  opacity: 0,
  height: 0,
  transform: "translateY(4px)",
  filter: "blur(6px)",
  "--reveal-fade": "22px",
} as const;

const revealShown = {
  opacity: 1,
  height: "auto",
  transform: "translateY(0px)",
  filter: "blur(0px)",
  "--reveal-fade": "0px",
} as const;

const revealTransition = {
  height: { duration: 0.38, ease: easeOut },
  opacity: { duration: 0.42, ease: easeOut },
  transform: { duration: 0.42, ease: easeOut },
  filter: { duration: 0.42, ease: easeOut },
  "--reveal-fade": { duration: 0.44, ease: easeOut },
} as const;

/**
 * Spread onto a `motion.*` element that appears as part of a stream — a
 * reasoning row, a step, a log line. Grows its own height with a blur, a lift
 * and a softened bottom edge.
 *
 *   const reveal = useRevealUnit();
 *   <motion.li {...reveal}>…</motion.li>
 *
 * The clip and the mask are both dropped once the entrance finishes: the height
 * is `auto` by then so neither has a job left, and a permanent clip would eat
 * the shadow of anything card-shaped inside. Under reduced motion only the fade
 * survives.
 */
export function useRevealUnit() {
  const reduce = useReducedMotion();
  const [masked, setMasked] = useState(!reduce);
  return {
    initial: reduce ? { opacity: 0 } : revealHidden,
    animate: reduce ? { opacity: 1 } : revealShown,
    transition: revealTransition,
    style: masked
      ? ({ overflow: "hidden", WebkitMaskImage: REVEAL_MASK, maskImage: REVEAL_MASK } as const)
      : undefined,
    onAnimationComplete: () => setMasked(false),
  };
}

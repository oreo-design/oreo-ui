import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeDrawer } from "@/lib/motion";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";

export type HeightClampProps = {
  /** Absolute floor for the clamp height. */
  minPx?: number;
  /** Viewport share the clamp may grow to: `max(minPx, vh * vhRatio)`. */
  vhRatio?: number;
  /**
   * Only clamp when content overshoots the limit by more than this — hiding
   * 30px behind a "Show more" is worse than showing them.
   */
  slack?: number;
  className?: string;
  children: React.ReactNode;
};

/** How much of the clipped bottom fades out under the collapsed mask. */
const FADE_PX = 56;
const CLAMP_MASK = `linear-gradient(to bottom, #000 calc(100% - ${FADE_PX}px), transparent 100%)`;

/**
 * Clamps tall card content: collapsed it holds the limit height with a
 * bottom fade and a floating "Show more"; expanded it grows to auto with an
 * in-flow "Show less" at the foot (reachable after scrolling).
 *
 * Coexistence with CardTransition: both animate height, but on *different
 * elements* — the transition owns the card's outer box, the clamp owns this
 * inner wrapper — so Motion never fights itself over one node. The first
 * collapse is applied with a zero-duration transition inside the initial
 * layout pass, so an entering card samples its final (clamped) height and a
 * mounting page never flashes the full content.
 *
 * The mask fades everything inside the wrapper — keep rings/shadows on the
 * card shell outside it. The floating button reads above the fade because it
 * is opaque and elevated, not because it escapes the mask (it does: it's a
 * sibling of the masked element).
 */
export function HeightClamp({
  minPx = 320,
  vhRatio = 0.7,
  slack = 96,
  className,
  children,
}: HeightClampProps) {
  const reduce = useReducedMotion();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [limit, setLimit] = React.useState<number | null>(null);
  const [contentH, setContentH] = React.useState<number | null>(null);
  const [expanded, setExpanded] = React.useState(false);
  // Animation is held off until after the first paint: the initial collapse
  // happens inside the mount's layout pass (measure → set state → re-render,
  // all pre-paint) and must land instantly, not play as motion. State, not a
  // ref — the pre-paint re-render must still see `false`.
  const [hasPainted, setHasPainted] = React.useState(false);
  React.useEffect(() => setHasPainted(true), []);

  React.useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const measureLimit = () =>
      setLimit(Math.max(minPx, document.documentElement.clientHeight * vhRatio));
    measureLimit();

    const observer = new ResizeObserver(() => setContentH(inner.offsetHeight));
    observer.observe(inner);
    setContentH(inner.offsetHeight);

    window.addEventListener("resize", measureLimit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureLimit);
    };
  }, [minPx, vhRatio]);

  const clamped =
    limit != null && contentH != null && !expanded && contentH > limit + slack;
  // Content that shrinks back under the limit un-clamps by itself; the
  // expanded flag is also dropped so a later regrowth starts collapsed again.
  const overshoots = limit != null && contentH != null && contentH > limit + slack;
  React.useEffect(() => {
    if (!overshoots && expanded) setExpanded(false);
  }, [overshoots, expanded]);

  const instant = reduce || !hasPainted;

  return (
    <div className={cn("relative min-w-0", className)}>
      <motion.div
        initial={false}
        animate={{ height: clamped && limit != null ? limit : "auto" }}
        transition={instant ? { duration: 0 } : { duration: 0.4, ease: easeDrawer }}
        className="min-w-0 overflow-hidden"
        style={
          clamped
            ? { WebkitMaskImage: CLAMP_MASK, maskImage: CLAMP_MASK }
            : undefined
        }
      >
        <div ref={innerRef} className="min-w-0">
          {children}
        </div>
      </motion.div>
      {clamped && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <Button
            type="secondary"
            size="sm"
            className="shadow-[var(--shadow-default)]"
            leadingIcon={<Icon name="chevron-down" size="sm" />}
            aria-expanded={false}
            onClick={() => setExpanded(true)}
          >
            Show more
          </Button>
        </div>
      )}
      {overshoots && expanded && (
        <div className="mt-3 flex justify-center">
          <Button
            type="tertiary"
            size="sm"
            leadingIcon={<Icon name="chevron-up" size="sm" />}
            aria-expanded
            onClick={() => setExpanded(false)}
          >
            Show less
          </Button>
        </div>
      )}
    </div>
  );
}

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { CARD_GAP } from "./stream.variants";

export type CardTransitionProps = {
  /**
   * The parent flex column's gap in px. The exit animates `marginTop` to its
   * negative so the removed card gives back exactly (own height + one gap) —
   * the collapse end-frame equals the post-unmount layout for the first,
   * middle, last and only card alike. Defaults to the card list's CARD_GAP.
   */
  gap?: number;
  /**
   * False for the seed render: the card mounts already expanded instead of
   * animating `height: auto ↔ px` on first paint. Pass the page's
   * `hasPainted` flag.
   */
  animateIn?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * The per-card presence unit — layer C of the stream's motion contract.
 *
 * Must be a *direct keyed child* of an `AnimatePresence`; wrapping it in a
 * plain element silently disables exit tracking. Enter and exit are exact
 * inverses (unlike `useRevealUnit`, which is one-way and doesn't cancel the
 * column gap), so list removal heals without an end-of-animation jump.
 *
 * Opacity resolves slightly before height: the card is visually gone before
 * its space closes — dismiss first, then the list heals.
 *
 * `overflow-hidden` stays on permanently (where `useRevealUnit` drops its
 * clip to protect inner shadows): stream cards draw an inset ring and no
 * outer shadow, so there is nothing outside the border box to eat.
 */
export function CardTransition({
  gap = CARD_GAP,
  animateIn = true,
  className,
  children,
}: CardTransitionProps) {
  const reduce = useReducedMotion();
  // Reduced motion keeps the fade and drops the collapse — the layout snap
  // happens at unmount, which is exactly the "less movement" being asked for.
  const hidden = reduce ? { opacity: 0 } : { height: 0, opacity: 0, marginTop: -gap };
  const shown = reduce ? { opacity: 1 } : { height: "auto", opacity: 1, marginTop: 0 };

  return (
    <motion.div
      initial={animateIn ? hidden : false}
      animate={shown}
      exit={hidden}
      transition={{
        height: { duration: 0.32, ease: easeOut },
        marginTop: { duration: 0.32, ease: easeOut },
        opacity: { duration: 0.26, ease: easeOut },
      }}
      className={cn("min-w-0 overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}

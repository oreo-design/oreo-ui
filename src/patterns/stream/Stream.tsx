import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { CardTransition } from "./CardTransition";
import { FilterChips } from "./FilterChips";
import { HeightClamp } from "./HeightClamp";
import { StreamSkeleton } from "./Skeletons";
import { StreamCard } from "./StreamCard";
import { CARD_GAP, TIER_GAP, stream, streamEmpty } from "./stream.variants";
import type { UseStreamResult } from "./useStream";
import type { StreamItem } from "./types";

export type StreamProps = {
  state: UseStreamResult;
  /** Fires from a card's header open-target. Omit to render inert headers. */
  onOpen?: (item: StreamItem) => void;
  className?: string;
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: easeOut },
} as const;

/**
 * The stream assembly — and the home of the three-layer motion contract:
 *
 *   A. page state (skeleton ↔ feed ↔ empty): one `mode="wait"` presence,
 *      opacity only, all branches in the SAME tree;
 *   B. tier blocks: each tier collapses as a frozen unit, `marginTop`
 *      animating to −TIER_GAP so the end-frame equals post-unmount layout;
 *   C. cards: `CardTransition` per item, same trick at −CARD_GAP.
 *
 * Never early-return around layer A — a `return <Empty/>` above the presence
 * unmounts the exiting feed instantly and the last card's exit never plays.
 *
 * Known nested-presence behavior, all by design (don't "fix"):
 * - when a whole tier exits, the cards inside don't run their own exits — the
 *   tier collapses as one block;
 * - when the last card overall is dismissed, layer A's fade supersedes the
 *   card's height exit.
 *
 * No `layout` prop, no `layoutId`, no stagger — every layout change here is
 * an explicit height animation, so it stays predictable and interruptible.
 */
export function Stream({ state, onOpen, className }: StreamProps) {
  const slots = stream();
  const reduce = useReducedMotion();

  // First-paint gate: the seed render mounts in its final state. Without it,
  // every card and tier would play a `height: auto ↔ px` entrance on load.
  const [hasPainted, setHasPainted] = useState(false);
  useEffect(() => setHasPainted(true), []);

  // Reduced motion keeps fades, drops collapses (snap at unmount instead).
  const tierHidden = reduce
    ? { opacity: 0 }
    : { height: 0, opacity: 0, marginTop: -TIER_GAP };
  const tierShown = reduce ? { opacity: 1 } : { height: "auto", opacity: 1, marginTop: 0 };
  // The heading sits inside the tier column, so it exits with the card gap.
  const headingHidden = reduce
    ? { opacity: 0 }
    : { height: 0, opacity: 0, marginTop: -CARD_GAP };
  const headingShown = tierShown;
  const blockTransition = { duration: 0.32, ease: easeOut } as const;

  const renderCard = (item: StreamItem) => (
    <StreamCard
      source={item.source}
      onOpen={onOpen && (() => onOpen(item))}
      onDismiss={() => state.markRead(item.id)}
    >
      {item.clamp ? (
        <HeightClamp {...(typeof item.clamp === "object" ? item.clamp : undefined)}>
          {item.content}
        </HeightClamp>
      ) : (
        item.content
      )}
    </StreamCard>
  );

  return (
    <div className={cn(slots.root(), className)}>
      <AnimatePresence mode="wait" initial={false}>
        {state.loading ? (
          <motion.div key="skeleton" {...fade}>
            <StreamSkeleton />
          </motion.div>
        ) : state.isEmpty ? (
          <motion.div key="empty" {...fade}>
            <EmptyState onReset={state.reset} />
          </motion.div>
        ) : (
          <motion.div key="feed" {...fade}>
            <FilterChips
              chips={state.chips}
              active={state.filter}
              onChange={state.setFilter}
              className={slots.filters()}
            />
            <div className={slots.feed()}>
              <AnimatePresence initial={false}>
                {state.visible.attention.length > 0 && (
                  <motion.section
                    key="tier-attention"
                    initial={hasPainted ? tierHidden : false}
                    animate={tierShown}
                    exit={tierHidden}
                    transition={blockTransition}
                    className={slots.tier()}
                  >
                    <AnimatePresence initial={false}>
                      {state.visible.attention.map((item) => (
                        <CardTransition key={item.id} animateIn={hasPainted}>
                          {renderCard(item)}
                        </CardTransition>
                      ))}
                    </AnimatePresence>
                  </motion.section>
                )}
              </AnimatePresence>
              <AnimatePresence initial={false}>
                {state.visible.rest.length > 0 && (
                  <motion.section
                    key="tier-rest"
                    initial={hasPainted ? tierHidden : false}
                    animate={tierShown}
                    exit={tierHidden}
                    transition={blockTransition}
                    className={slots.tier()}
                  >
                    {/* The heading only earns its place while the attention
                        tier exists — when everything is "everything else",
                        the label is noise. */}
                    <AnimatePresence initial={false}>
                      {state.visible.attention.length > 0 && (
                        <motion.h2
                          key="rest-heading"
                          initial={hasPainted ? headingHidden : false}
                          animate={headingShown}
                          exit={headingHidden}
                          transition={blockTransition}
                          className={slots.tierHeading()}
                        >
                          Everything else
                        </motion.h2>
                      )}
                    </AnimatePresence>
                    <AnimatePresence initial={false}>
                      {state.visible.rest.map((item) => (
                        <CardTransition key={item.id} animateIn={hasPainted}>
                          {renderCard(item)}
                        </CardTransition>
                      ))}
                    </AnimatePresence>
                  </motion.section>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const slots = streamEmpty();
  return (
    <div className={slots.root()}>
      <span className={slots.icon()}>
        <Icon name="checks" />
      </span>
      <p className={slots.title()}>All clear</p>
      <p className={slots.caption()}>New activity lands here as cards. Enjoy the quiet.</p>
      <Button type="tertiary" size="sm" className="mt-2" onClick={onReset}>
        Reset demo
      </Button>
    </div>
  );
}

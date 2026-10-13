import { tv } from "@/lib/tv";

/**
 * Inbox stream styles — `tv()` + tokens, same approach as the Oreo components,
 * so the whole pattern re-skins for dark mode with zero extra work.
 */

/**
 * The column gaps and the exit animations are one system: a leaving block
 * animates `marginTop` to the negative of its column's gap so the collapse
 * end-frame is pixel-identical to the post-unmount layout — no jump when
 * React finally removes the node. Change a gap class and its constant
 * together, or removals will land with a visible snap.
 */
export const TIER_GAP = 40; // ↔ `gap-10` on the feed column
export const CARD_GAP = 14; // ↔ `gap-3.5` on each tier column

export const stream = tv({
  slots: {
    /** The stream column. Width is the whole responsive story for now. */
    root: "mx-auto w-full min-w-0 max-w-2xl",
    /** Tier stack. `gap-10` pairs with TIER_GAP. */
    feed: "flex min-w-0 flex-col gap-10",
    /**
     * One tier. `gap-3.5` pairs with CARD_GAP. `overflow-hidden` clips the
     * block while its height animates — safe because cards draw an inset
     * ring, never an outer shadow.
     */
    tier: "flex min-w-0 flex-col gap-3.5 overflow-hidden",
    /** The lower tier's heading. Exits with the tier's card gap (−CARD_GAP). */
    tierHeading:
      "overflow-hidden text-[13px] font-medium leading-5 text-[var(--color-text-secondary)]",
    filters: "mb-6",
    /**
     * Trailing count inside a filter chip. Opacity, not a color token — the
     * selected chip inverts its fill and the count must dim on both grounds.
     */
    filterCount: "ml-1 opacity-55",
  },
});

export const streamCard = tv({
  slots: {
    /**
     * The generic card shell. `group/stream-card` is the card-level hover
     * scope that reveals the dismiss accessory; it lives on the surface so
     * grafted host content participates without knowing it's in an inbox.
     */
    root: [
      "group/stream-card relative flex min-w-0 flex-col gap-3 rounded-xl p-4 text-left",
      "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
    ],
    header: "flex min-w-0 items-center gap-2",
    headerIcon: [
      "grid size-6 shrink-0 place-items-center rounded-lg",
      "text-[var(--color-text-secondary)]",
    ],
    /**
     * The open target wraps icon + title + arrow only — never the whole
     * header — so the dismiss accessory can't be swallowed by the link.
     */
    headerOpen: [
      "flex min-w-0 items-center gap-2 rounded-lg text-left",
      "transition-colors duration-150 hover:text-[var(--color-text-secondary)]",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-default)]",
    ],
    title: "min-w-0 truncate text-[14px] font-medium leading-5",
    /** Truncation eats the title, never the arrow. */
    titleArrow: "shrink-0 text-[var(--color-text-disabled)]",
    meta: "min-w-0 truncate text-[12px] leading-4 text-[var(--color-text-disabled)]",
    /**
     * Dismiss accessory: invisible at rest, revealed by the card-level hover
     * scope or by keyboard focus landing anywhere in the card. Clicks are
     * stopped in the shell so they never bubble into the open target.
     */
    accessory: [
      "ml-auto shrink-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none",
      "group-hover/stream-card:opacity-100 group-focus-within/stream-card:opacity-100",
    ],
    body: "min-w-0 text-[13px] leading-5 text-[var(--color-text-primary)]",
  },
});

export const streamEmpty = tv({
  slots: {
    root: [
      "flex flex-col items-center gap-1.5 rounded-xl px-6 py-14 text-center",
      "ring-1 ring-inset ring-[var(--color-border-subtle)]",
    ],
    icon: [
      "mb-2.5 grid size-10 place-items-center rounded-full",
      "bg-[var(--color-state-hover)] text-[var(--color-text-secondary)]",
    ],
    title: "text-[15px] font-medium leading-5",
    caption: "text-[13px] leading-5 text-[var(--color-text-secondary)]",
  },
});

export const streamSkeleton = tv({
  slots: {
    /** Same surface, radius and padding as the real card — no swap jump. */
    card: [
      "flex min-w-0 flex-col gap-3 rounded-xl p-4",
      "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
    ],
    header: "flex items-center gap-2",
    /**
     * A shimmering block. Reuses the `oreo-shimmer` keyframe from index.css
     * (a background-position sweep); the `.oreo-shimmer` *class* is
     * text-clipped and only works on labels, so blocks carry their own
     * gradient overlay instead.
     */
    block: [
      "rounded-md bg-[var(--color-state-press)]",
      "bg-[linear-gradient(90deg,transparent_42%,var(--color-state-hover)_50%,transparent_58%)]",
      "bg-[length:200%_100%] animate-[oreo-shimmer_2.2s_linear_infinite] motion-reduce:animate-none",
    ],
  },
});

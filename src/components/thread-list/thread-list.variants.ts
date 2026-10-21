import { tv } from "@/lib/tv";

/**
 * Oreo UI Thread List.
 *
 * Sidebar conversation history: section labels, a new-thread action, and
 * items whose meta (time, unread dot) swaps to icon actions on hover.
 */
export const threadList = tv({
  slots: {
    root: "flex w-full flex-col gap-0.5",
    section: "px-2.5 pt-3 pb-1 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-text-disabled)] first:pt-0",
    item: [
      "group/thread flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-[13px]",
      "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    ],
    title: "min-w-0 flex-1 truncate",
    meta: "flex shrink-0 items-center gap-1.5 font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)] tabular-nums",
    actions: "hidden shrink-0 items-center gap-0.5 group-hover/thread:flex group-focus-within/thread:flex",
    unread: "size-1.5 rounded-full bg-[var(--color-text-primary)]",
  },
  variants: {
    active: {
      true: {
        item: "bg-[var(--color-state-press)] font-medium text-[var(--color-text-primary)]",
      },
      false: {
        item: "text-[var(--color-text-secondary)] hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]",
      },
    },
  },
  defaultVariants: { active: false },
});

export type ThreadListVariants = Parameters<typeof threadList>[0];

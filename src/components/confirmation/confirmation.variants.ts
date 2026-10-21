import { tv } from "@/lib/tv";

/**
 * Oreo UI Confirmation.
 *
 * Human-in-the-loop approval card: title, explanation, an optional detail
 * slot (command, diff, payload), and a deny/approve footer that swaps to a
 * resolution line once decided. `danger` shifts the approve action to the
 * destructive palette.
 */
export const confirmation = tv({
  slots: {
    root: [
      "oreo-paper-card w-full overflow-hidden rounded-2xl",
      "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
      "shadow-[var(--shadow-panel)]",
    ],
    body: "oreo-notice-body flex flex-col gap-1 px-4 pt-3.5",
    title: "oreo-card-title text-[14px] font-medium text-[var(--color-text-primary)]",
    description: "oreo-technical text-[13px] leading-relaxed text-[var(--color-text-secondary)]",
    detail: "px-4 pt-3",
    footer: "oreo-notice-footer flex min-h-12 items-center justify-end gap-2 px-4 py-3",
    resolution: "flex items-center gap-1.5 text-[13px] font-medium",
  },
  variants: {
    state: {
      pending: {},
      approved: { resolution: "text-[var(--color-palette-mint-text)]" },
      denied: { resolution: "text-[var(--color-text-secondary)]" },
    },
  },
  defaultVariants: { state: "pending" },
});

export type ConfirmationVariants = Parameters<typeof confirmation>[0];

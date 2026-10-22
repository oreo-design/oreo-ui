import { tv } from "@/lib/tv";

/**
 * Oreo UI Context Bar — the status surface that docks onto a Prompt Box.
 *
 * The bar is an elevated-background card with only the outer corners rounded;
 * the flat edge tucks 16px underneath the Prompt Box (the box pulls it in via
 * its `header`/`footer` slots), leaving 12px of visible padding — exactly the
 * Figma "Prompt Status" geometry (12px padding + 28px on the tucked side).
 */
export const contextBar = tv({
  slots: {
    bar: [
      "oreo-context-bar flex w-full max-w-[800px] flex-col items-start gap-[var(--space-x4)]",
      "bg-[var(--color-bg-elevated)] shadow-[var(--shadow-default)]",
      "ring-[0.5px] ring-inset ring-[var(--color-border-subtle)]",
    ],
    row: "flex w-full items-center gap-3",
    content: "flex min-w-0 flex-1 items-center gap-[var(--space-x3)]",
    leadingIcon: "grid size-5 shrink-0 place-items-center [&_svg]:size-4",
    label: "min-w-0 flex-1 text-[14px] leading-5 font-normal text-[var(--color-text-primary)]",
    trailing: "flex shrink-0 items-center gap-3",
    trailingIcons: "flex items-center gap-1",
  },
  variants: {
    position: {
      header: {
        bar: "rounded-t-[var(--radius-card-medium)] px-[var(--space-x6)] pt-[var(--space-x6)] pb-7",
      },
      footer: {
        bar: "rounded-b-[var(--radius-card-medium)] px-[var(--space-x6)] pt-7 pb-[var(--space-x6)]",
      },
      detached: {
        bar: "rounded-[var(--radius-card-medium)] p-[var(--space-x6)]",
      },
    },
    status: {
      default: {},
      avatar: {},
      progress: { leadingIcon: "text-[var(--color-text-primary)]" },
      loading: { leadingIcon: "text-[var(--color-text-waiting)]" },
      waiting: { leadingIcon: "text-[var(--color-text-waiting)]" },
      done: {
        leadingIcon: "text-[var(--color-text-disabled)]",
        label: "text-[var(--color-text-disabled)] line-through decoration-[1px]",
      },
      queue: { leadingIcon: "text-[var(--color-text-waiting)]" },
    },
    muted: {
      true: { label: "text-[var(--color-text-tertiary)]" },
      false: {},
    },
  },
  defaultVariants: { position: "header", status: "default", muted: false },
});

export type ContextBarVariants = Parameters<typeof contextBar>[0];

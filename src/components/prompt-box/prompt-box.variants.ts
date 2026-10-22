import { tv } from "@/lib/tv";

/**
 * Oreo UI Prompt Box — the multi-state composer card for agent conversations.
 *
 * Geometry from the Figma `_Prompt Box` master: a `--radius-card-medium` card
 * with smooth corners on the base background, a hairline border and Shadow/Default
 * elevation; 16px inline inset, a 40px minimum input region, and a 16px content/action gap.
 * When a Context Bar is attached the bar tucks 16px underneath the card
 * (`headerSlot` / `footerSlot` pull margins) and the card paints above it.
 */
export const promptBox = tv({
  slots: {
    stack: "relative isolate flex w-full max-w-[800px] flex-col",
    headerSlot: "z-[1] -mb-4 w-full",
    footerSlot: "z-[1] -mt-4 w-full",
    card: [
      "oreo-composer oreo-squircle [--squircle-radius:var(--radius-card-medium)] z-[2] flex w-full max-w-[800px] flex-col items-start gap-[var(--space-x8)]",
      "rounded-[var(--radius-card-medium)] bg-[var(--color-bg-base)] px-[var(--space-x8)] pt-[var(--space-x10)] pb-[var(--space-x7)] [border-width:0]",
      // Keep the inside stroke independent of theme-owned elevation shadows.
      "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:[corner-shape:inherit] after:ring-[0.5px] after:ring-inset after:ring-[var(--color-border-default)]",
      "shadow-[var(--shadow-default)]",
    ],
    content: "flex w-full flex-col items-start gap-[var(--space-x4)]",
    inputWrap: "relative flex min-h-[calc(var(--spacing)*10)] w-full flex-col items-start",
    textarea: [
      "oreo-prompt-input min-h-[calc(var(--spacing)*10)] w-full resize-none bg-transparent text-base leading-6 text-[var(--color-text-primary)]",
      "outline-none placeholder:text-transparent",
    ],
    placeholder: [
      "oreo-technical pointer-events-none absolute top-0 left-0 flex items-center gap-[var(--space-x3)]",
      "text-base leading-6 whitespace-nowrap text-[var(--color-text-placeholder)]",
    ],
    tags: "absolute -top-[2px] left-0 z-[1] flex items-center gap-[var(--space-x4)]",
    actions: "flex w-full items-center justify-between",
    actionCluster: "flex items-center gap-[var(--space-x4)]",
  },
  variants: {
    inset: {
      true: { headerSlot: "px-[var(--space-x6)]", footerSlot: "px-[var(--space-x6)]" },
      false: {},
    },
  },
  defaultVariants: { inset: false },
});

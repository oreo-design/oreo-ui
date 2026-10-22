import { tv } from "@/lib/tv";

/**
 * Oreo UI Prompt Box — the multi-state composer card for agent conversations.
 *
 * Geometry from the Figma `_Prompt Box` master: a `--radius-card-medium` card
 * on the base background with a hairline border and the Shadow/Default
 * elevation; 12px padding, 16px between the content area and the action row.
 * When a Context Bar is attached the bar tucks 16px underneath the card
 * (`headerSlot` / `footerSlot` pull margins) and the card paints above it.
 */
export const promptBox = tv({
  slots: {
    stack: "relative isolate flex w-full max-w-[800px] flex-col",
    headerSlot: "z-[1] -mb-4 w-full",
    footerSlot: "z-[1] -mt-4 w-full",
    card: [
      "oreo-composer z-[2] flex w-full max-w-[800px] flex-col items-start gap-[var(--space-x8)]",
      "rounded-[var(--radius-card-medium)] bg-[var(--color-bg-base)] p-[var(--space-x6)] [border-width:0] ring-[0.5px] ring-inset ring-[var(--color-border-default)]",
      "shadow-[var(--shadow-default)]",
    ],
    content: "flex w-full flex-col items-start gap-[var(--space-x4)]",
    inputWrap: "relative flex min-h-[60px] w-full flex-col items-start",
    textarea: [
      "w-full resize-none bg-transparent text-[14px] leading-[normal] text-[var(--color-text-primary)]",
      "outline-none placeholder:text-transparent",
    ],
    placeholder: [
      "oreo-technical pointer-events-none absolute top-0 left-0 flex items-center gap-[var(--space-x3)]",
      "text-[14px] leading-[normal] whitespace-nowrap text-[var(--color-text-placeholder)]",
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

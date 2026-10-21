import { tv } from "@/lib/tv";

/**
 * Oreo UI Tool Call.
 *
 * A quiet, collapsible line in the transcript: chevron + activity label +
 * optional argument badge, with a soft detail panel for request/result.
 * The header stays text-weight — tool calls narrate, they don't shout.
 */
export const toolCall = tv({
  slots: {
    root: "w-full",
    trigger: [
      "group/trigger flex w-full items-center gap-2 rounded-lg py-1 text-[13.5px]",
      "text-[var(--color-text-secondary)] outline-none transition-colors",
      "hover:text-[var(--color-text-primary)]",
      "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    ],
    chevron: [
      "size-3.5 shrink-0 opacity-60",
      "transition-transform duration-200 ease-drawer motion-reduce:transition-none",
      "group-data-[panel-open]/trigger:rotate-90",
    ],
    badge: [
      "max-w-[45%] truncate rounded-md px-1.5 py-0.5",
      "bg-[var(--color-state-press)] font-mono text-[11px] tracking-tight",
      "text-[var(--color-text-secondary)]",
    ],
    status: "ms-auto flex w-4 shrink-0 items-center justify-end",
    panel: [
      "h-[var(--collapsible-panel-height)] overflow-hidden",
      "transition-[height] duration-200 ease-drawer motion-reduce:transition-none",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
    ],
    body: "mt-2 overflow-hidden rounded-xl bg-[var(--color-state-hover)] text-[12.5px] ring-1 ring-inset ring-[var(--color-border-subtle)]",
    row: "px-3.5 py-2.5",
    rowLabel: "mb-1 font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)]",
    divider: "mx-3.5 h-px bg-[var(--color-border-subtle)]",
  },
  variants: {
    state: {
      running: {},
      complete: {},
      error: { trigger: "text-[var(--color-status-error)] hover:text-[var(--color-status-error)]" },
    },
  },
  defaultVariants: { state: "complete" },
});

export type ToolCallVariants = Parameters<typeof toolCall>[0];

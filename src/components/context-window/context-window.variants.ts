import { tv } from "@/lib/tv";

/** Oreo card, Context Bar footer, Menu row rhythm and existing semantic colors. */
export const contextWindow = tv({
  slots: {
    root: "@container/context min-w-0 w-full max-w-md rounded-card-medium bg-bg-elevated p-1 text-text-primary",
    card: "rounded-card-medium bg-bg-surface p-4 shadow-[var(--shadow-default)]",
    header: "flex flex-wrap items-center justify-between gap-2 text-sm font-medium",
    summary: "my-4 flex flex-wrap min-h-9 items-baseline gap-2",
    number: "text-3xl font-semibold tracking-tight tabular-nums",
    caption: "@max-2xs/context:order-3 @max-2xs/context:basis-full min-w-0 flex-1 truncate text-sm text-text-tertiary",
    grid: "grid gap-[var(--space-x1)]",
    cell: "aspect-square rounded-control-tiny transition-opacity duration-150 ease-out motion-reduce:transition-none",
    row: "flex flex-wrap min-w-0 items-center gap-2 rounded-control-large px-2 transition-colors duration-150 data-[active=true]:bg-state-hover",
    label: "flex min-h-10 min-w-0 flex-1 items-center gap-3 rounded-control text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-accent",
    dot: "size-2 shrink-0 rounded-control-tiny",
    count: "ml-auto shrink-0 text-sm tabular-nums text-text-secondary",
    file: "flex min-w-0 items-center gap-2 py-1 pl-7 pr-2 text-sm",
    panel: "h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-200 ease-drawer data-[starting-style]:h-0 data-[ending-style]:h-0 motion-reduce:transition-none",
    footer: "flex min-h-12 flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs text-text-secondary",
  },
});

import { tv } from "@/lib/tv";

/**
 * Oreo UI Sources.
 *
 * Citation disclosure: a soft pill trigger with the source count, expanding
 * into a two-column grid of link cards (favicon letter, domain, title).
 */
export const sources = tv({
  slots: {
    root: "w-full",
    trigger: [
      "group/trigger inline-flex w-fit items-center gap-1.5 rounded-[var(--radius-capsule)] px-3.5 py-2",
      "bg-[var(--color-state-hover)] text-[12px] text-[var(--color-text-secondary)]",
      "outline-none transition-colors hover:bg-[var(--color-state-press)] hover:text-[var(--color-text-primary)]",
      "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    ],
    count: "font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)] tabular-nums",
    chevron: [
      "size-3 opacity-60",
      "transition-transform duration-200 ease-drawer motion-reduce:transition-none",
      "group-data-[panel-open]/trigger:rotate-180",
    ],
    panel: [
      "h-[var(--collapsible-panel-height)] overflow-hidden",
      "transition-[height] duration-200 ease-drawer motion-reduce:transition-none",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
    ],
    grid: "grid grid-cols-1 gap-2 pt-2.5 sm:grid-cols-2",
    card: [
      "flex flex-col gap-1.5 rounded-xl p-3",
      "bg-[var(--color-bg-base)] ring-1 ring-inset ring-[var(--color-border-subtle)]",
      "transition-transform hover:-translate-y-px motion-reduce:transition-none",
      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    ],
    cardHeader: "flex items-center gap-1.5",
    favicon: [
      "flex size-4 shrink-0 items-center justify-center rounded-[var(--radius-control-tiny)]",
      "bg-[var(--color-state-press)] text-[9px] font-medium text-[var(--color-text-secondary)]",
    ],
    domain: "truncate font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)]",
    title: "line-clamp-2 text-[13px] font-medium leading-snug text-[var(--color-text-primary)]",
  },
});

export type SourcesVariants = Parameters<typeof sources>[0];

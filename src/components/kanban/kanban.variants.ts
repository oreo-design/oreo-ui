import { tv } from "@/lib/tv";

export const kanbanCard = tv({
  base: "oreo-kanban-card group relative rounded-card-medium border border-border-subtle bg-bg-base p-3 text-left text-text-primary shadow-[var(--shadow-default)] outline-none focus-visible:ring-2 focus-visible:ring-status-progress",
  variants: {
    dragging: { true: "border-dashed border-palette-orange-text/20 bg-palette-orange-bg/20 shadow-none", false: "" },
    overlay: { true: "cursor-grabbing border-border-default shadow-[var(--shadow-overlay)]", false: "cursor-grab" },
  },
});
export const kanbanCell = tv({
  base: "flex min-w-0 flex-col gap-2 rounded-card-medium bg-bg-elevated p-2 transition-colors duration-150",
  variants: {
    overLimit: { true: "bg-palette-orange-bg/30", false: "" },
    over: { true: "ring-1 ring-inset ring-border-default", false: "" },
    compact: { true: "min-h-36", false: "min-h-[32rem]" },
  },
});

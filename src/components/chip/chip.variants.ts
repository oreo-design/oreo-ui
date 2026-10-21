import { tv } from "@/lib/tv";

/**
 * Oreo UI Chip — a compact, tappable suggestion pill.
 *
 * Two emphasis levels via `selected`: unselected mirrors the secondary button
 * surface (base bg + hairline border), selected fills with the inverse palette.
 * Hover/press use the same Material-style `::after` state-layer as Button, so
 * the overlay reads correctly on both surfaces. 36px tall at the default size.
 */
export const chip = tv({
  base: [
    "relative isolate inline-flex items-center justify-center select-none",
    "gap-[var(--space-x3)] rounded-[var(--radius-control)] whitespace-nowrap",
    "font-medium leading-[20px] outline-none transition-[box-shadow,color] duration-150",
    "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-accent)]",
    // state layer
    "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit]",
    "after:bg-transparent after:transition-colors after:duration-150",
    "disabled:pointer-events-none disabled:after:bg-transparent",
  ],
  variants: {
    size: {
      sm: "h-8 px-3 text-[13px] [&_svg]:size-4",
      md: "h-9 px-3 text-[14px] [&_svg]:size-4",
    },
    selected: {
      false: [
        "bg-[var(--color-bg-base)] text-[var(--color-text-secondary)]",
        "border-[0.5px] border-[var(--color-border-default)]",
        "hover:after:bg-[var(--color-state-hover)]",
        "active:after:bg-[var(--color-state-press)]",
      ],
      true: [
        "bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]",
        "hover:after:bg-[var(--color-state-hover-inverse)]",
        "active:after:bg-[var(--color-state-press-inverse)]",
      ],
    },
    disabled: { true: "", false: "" },
  },
  compoundVariants: [
    {
      selected: false,
      disabled: true,
      class: "bg-[var(--color-bg-elevated)] border-[var(--color-border-subtle)] text-[var(--color-text-disabled)]",
    },
    {
      selected: true,
      disabled: true,
      class: "bg-[color-mix(in_srgb,var(--color-bg-inverse)_12%,transparent)] text-[var(--color-text-disabled)]",
    },
  ],
  defaultVariants: { size: "md", selected: false, disabled: false },
});

export type ChipVariants = Parameters<typeof chip>[0];

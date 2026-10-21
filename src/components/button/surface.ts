/**
 * Shared button "surface": the bits that are identical between Button and
 * IconButton — base interaction behavior, the Material-style state-layer
 * (`::after` overlay), the per-type palettes, and the danger/disabled
 * compound rules. Both components compose these into their own `tv()`.
 */

export const surfaceBase = [
  "relative isolate inline-flex items-center justify-center select-none",
  "outline-none transition-[box-shadow,color] duration-150",
  "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-accent)]",
  // the state layer
  "after:absolute after:inset-0 after:-z-10 after:rounded-[inherit]",
  "after:bg-transparent after:transition-colors after:duration-150",
  "disabled:pointer-events-none disabled:after:bg-transparent",
];

export const typeVariants = {
  primary: [
    "bg-[var(--color-bg-inverse)] text-[var(--color-text-on-inverse)]",
    "hover:after:bg-[var(--color-state-hover-inverse)]",
    "active:after:bg-[var(--color-state-press-inverse)]",
  ],
  secondary: [
    "bg-[var(--color-bg-base)] text-[var(--color-text-primary)]",
    "ring-1 ring-inset ring-[var(--color-border-default)]",
    "hover:after:bg-[var(--color-state-hover)]",
    "active:after:bg-[var(--color-state-press)]",
  ],
  tertiary: [
    "bg-transparent text-[var(--color-text-secondary)]",
    "hover:after:bg-[var(--color-state-hover)]",
    "active:after:bg-[var(--color-state-press)]",
  ],
} as const;

export const dangerCompounds = [
  { type: "primary", danger: true, class: "bg-[var(--color-status-error)] text-white" },
  {
    type: "secondary",
    danger: true,
    class: "text-[var(--color-status-error)] ring-[color-mix(in_srgb,var(--color-status-error)_30%,transparent)]",
  },
  { type: "tertiary", danger: true, class: "text-[var(--color-status-error)]" },
] as const;

export const disabledCompounds = [
  {
    type: "primary",
    disabled: true,
    class: "bg-[color-mix(in_srgb,var(--color-bg-inverse)_12%,transparent)] text-[var(--color-text-disabled)]",
  },
  {
    type: "secondary",
    disabled: true,
    class: "bg-[var(--color-bg-elevated)] ring-[var(--color-border-subtle)]",
  },
  {
    type: "primary",
    danger: true,
    disabled: true,
    class: "bg-[color-mix(in_srgb,var(--color-status-error)_20%,transparent)] text-white/70",
  },
] as const;

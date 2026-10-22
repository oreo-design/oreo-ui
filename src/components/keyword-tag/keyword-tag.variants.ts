import { tv } from "@/lib/tv";

/**
 * Oreo UI Keyword Tag — the compact 24px chip from the Figma kit that names
 * models, integrations, referenced content, and agent actions.
 *
 * Geometry from the `Keyword Tag` master: 24px tall, `--radius-control`
 * corners, 4px/8px padding, a 16px leading slot, 12px semibold label.
 * `surface` is the bordered white look; palette tones drop the border.
 * Hovering a removable tag tints the chip and swaps the leading slot for an
 * × in place (Figma `Hover=True`).
 */
export const keywordTag = tv({
  slots: {
    root: [
      "oreo-legacy-label group/tag relative inline-flex h-6 min-w-6 items-center justify-center gap-[var(--space-x1)]",
      "rounded-[var(--radius-control)] py-[var(--space-x1)] pr-[var(--space-x4)] pl-[var(--space-x2)]",
      "text-[12px] leading-4 font-semibold whitespace-nowrap",
      // Material-style state layer for the removable hover tint
      "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit]",
      "after:bg-transparent after:transition-colors after:duration-150",
    ],
    /** The 16px leading slot the icon, thumbnail, and hover × share. */
    leading: "relative grid size-4 shrink-0 place-items-center",
    /** Wrapper sizing whatever glyph the caller passes. */
    icon: "grid place-items-center [&_img]:size-4 [&_svg]:size-4",
    /** 16px thumbnail for the referenced-image form. */
    thumb: [
      "size-4 overflow-clip rounded-[var(--radius-control-tiny)]",
      "border-[0.5px] border-[var(--color-border-subtle)]",
      "[&_img]:size-full [&_img]:object-cover",
    ],
    /** The hover ×: replaces the leading content in place. */
    ghost: [
      "absolute inset-0 grid place-items-center rounded-[var(--radius-capsule)]",
      "opacity-0 transition-opacity duration-150",
      "group-hover/tag:opacity-100 focus-visible:opacity-100",
      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    ],
  },
  variants: {
    color: {
      surface: {
        root: [
          "bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]",
          "border-[0.5px] border-[var(--color-border-default)]",
        ],
      },
      purple: { root: "bg-[var(--color-palette-purple-bg)] text-[var(--color-palette-purple-text)]" },
      mint: { root: "bg-[var(--color-palette-mint-bg)] text-[var(--color-palette-mint-text)]" },
      pink: { root: "bg-[var(--color-palette-pink-bg)] text-[var(--color-palette-pink-text)]" },
      blue: { root: "bg-[var(--color-palette-blue-bg)] text-[var(--color-palette-blue-text)]" },
      orange: { root: "bg-[var(--color-palette-orange-bg)] text-[var(--color-palette-orange-text)]" },
    },
    /** The referenced-image form widens the gap to 4px (Figma `Case=Image`). */
    media: { true: { root: "gap-[var(--space-x2)]" }, false: {} },
    removable: {
      true: {
        root: "select-none hover:after:bg-[var(--color-state-hover)]",
        icon: "transition-opacity duration-150 group-hover/tag:opacity-0 group-focus-within/tag:opacity-0",
        thumb: "transition-opacity duration-150 group-hover/tag:opacity-0 group-focus-within/tag:opacity-0",
      },
      false: {},
    },
  },
  defaultVariants: { color: "surface", media: false, removable: false },
});

export type KeywordTagVariants = Parameters<typeof keywordTag>[0];

import { tv } from "@/lib/tv";

/**
 * Oreo UI Attachment — the File Chip from the Figma kit.
 *
 * Two forms: an icon-only 36px square (image/video thumbnail fills the chip,
 * file types get a paper icon on a plain square), and a labeled chip with a
 * 20px leading icon/thumb plus the filename. Removal affordances follow the
 * design: the square grows a floating × badge on hover; the labeled chip
 * swaps its leading icon for an × in place.
 */
export const attachment = tv({
  slots: {
    root: [
      "oreo-legacy-label group/attachment relative w-fit shrink-0 select-none",
      "oreo-squircle [--squircle-radius:var(--radius-control)] ring-[0.5px] ring-inset ring-[var(--color-border-default)]",
      "bg-[var(--color-bg-base)]",
      // Material-style state layer for the hover tint
      "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:[corner-shape:inherit]",
      "after:bg-transparent after:transition-colors after:duration-150",
    ],
    /** Icon-only form: thumbnail filling the whole square. */
    fill: "pointer-events-none absolute inset-0 overflow-clip rounded-[inherit] bg-[var(--color-bg-elevated)]",
    image: "size-full object-cover",
    /** Labeled form: the 20px leading slot everything swaps inside. */
    leading: "relative grid size-5 shrink-0 place-items-center",
    /** 20px rounded thumbnail in the labeled form. */
    thumb: [
      "relative size-5 overflow-clip rounded-[var(--radius-control-tiny)]",
      "border-[0.5px] border-[var(--color-border-default)] bg-[var(--color-bg-elevated)]",
      "shadow-[var(--shadow-active)]",
    ],
    typeIcon: "size-5",
    spinner: "size-4 animate-[spin_0.8s_steps(8)_infinite] text-[var(--color-text-waiting)] motion-reduce:animate-none",
    label: "max-w-48 truncate text-[12px] leading-4 font-semibold text-[var(--color-text-primary)]",
    /** Labeled form ×: replaces the leading icon in place on hover. */
    ghost: [
      "absolute inset-0 grid place-items-center rounded-[var(--radius-capsule)] text-[var(--color-text-primary)]",
      "opacity-0 transition-opacity duration-150",
      "group-hover/attachment:opacity-100 focus-visible:opacity-100",
      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    ],
    /** Icon-only form ×: floating badge off the top-right corner. */
    badge: [
      "absolute -top-[4.5px] -right-[3.5px] grid size-[14px] place-items-center",
      "rounded-[var(--radius-capsule)] bg-[var(--color-border-focus)] text-[var(--color-text-on-inverse)]",
      "opacity-0 transition-opacity duration-150",
      "group-hover/attachment:opacity-100 focus-visible:opacity-100",
      "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
    ],
  },
  variants: {
    withLabel: {
      true: { root: "flex items-center gap-[var(--space-x3)]" },
      false: { root: "grid size-9 place-items-center" },
    },
    /** sm only compacts the labeled form (28px tall); the square stays 36. */
    size: { md: {}, sm: {} },
    removable: { true: {}, false: {} },
    media: { true: { thumb: "oreo-squircle [--squircle-radius:var(--radius-media-thumb,var(--radius-control-tiny))]" }, false: {} },
  },
  compoundVariants: [
    // Only a full-bleed media tile owns the media frame. A labeled file chip
    // remains a structural control; its thumbnail keeps its intrinsic role.
    { media: true, withLabel: false, class: {
      root: "oreo-squircle [--squircle-radius:var(--radius-media,var(--radius-control))]",
      fill: "oreo-media-fill oreo-squircle",
    } },
    // Explicit heights so the hairline border stays inside the 36/28 box,
    // matching Figma's inner strokes.
    { withLabel: true, size: "md", class: { root: "h-9 px-[var(--space-x4)]" } },
    { withLabel: true, size: "sm", class: { root: "h-7 pr-[var(--space-x3)] pl-[var(--space-x2)]" } },
    // Hover tint everywhere except the full-bleed thumbnail square, and only
    // when there is something to hover for.
    { removable: true, withLabel: true, class: { root: "hover:after:bg-[var(--color-state-hover)]" } },
    {
      removable: true,
      withLabel: false,
      media: false,
      class: { root: "hover:after:bg-[var(--color-state-hover)]" },
    },
    // Labeled + removable: leading content yields to the × on hover/focus.
    {
      removable: true,
      withLabel: true,
      class: {
        thumb: "transition-opacity duration-150 group-hover/attachment:opacity-0 group-focus-within/attachment:opacity-0",
        typeIcon: "transition-opacity duration-150 group-hover/attachment:opacity-0 group-focus-within/attachment:opacity-0",
        spinner: "transition-opacity duration-150 group-hover/attachment:opacity-0 group-focus-within/attachment:opacity-0",
      },
    },
  ],
  defaultVariants: { withLabel: false, size: "md", removable: false, media: false },
});

export type AttachmentVariants = Parameters<typeof attachment>[0];

import { tv } from "@/lib/tv";

/**
 * Oreo UI Shortcut key-cap.
 *
 * A single `<kbd>` "cap" — subtle surface, hairline border, tiny radius. Sizes
 * map to Figma's 20px (sm) and 24px (md) caps. `min-w` keeps single glyphs
 * square while letting text keys (ESC, Tab, ⌘A) grow.
 */
export const shortcutCap = tv({
  base: [
    "inline-flex items-center justify-center shrink-0",
    "bg-[var(--color-bg-base)] text-[var(--color-text-secondary)]",
    "border-[0.5px] border-[var(--color-border-subtle)]",
    "oreo-keycap oreo-squircle font-medium leading-none whitespace-nowrap select-none",
  ],
  variants: {
    size: {
      sm: "h-5 min-w-5 px-1 text-[12px] gap-0.5 [&_svg]:size-3.5",
      md: "h-6 min-w-6 px-1.5 text-[13px] gap-0.5 [&_svg]:size-4",
    },
  },
  defaultVariants: { size: "sm" },
});

export type ShortcutVariants = Parameters<typeof shortcutCap>[0];

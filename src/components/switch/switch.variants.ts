import { tv } from "@/lib/tv";

/**
 * Oreo UI Switch — the boolean control for settings rows.
 *
 * Same metrics as the docs `.toggle` (34×20 track, 16px thumb) so the two read
 * as one control; the resting track is the border tone and the on state is the
 * inverse surface, which keeps the switch legible in both skins without an
 * accent color. The thumb lands with a slight overshoot — the one playful beat
 * a settings page gets — while the track color change stays a plain ease.
 */
export const switchStyles = tv({
  slots: {
    root: [
      "relative inline-flex h-5 w-[calc(var(--spacing)*8.5)] shrink-0 cursor-pointer rounded-[var(--radius-capsule)] p-0.5",
      "bg-[var(--color-border-default)] transition-colors duration-150 ease-out",
      "data-[checked]:bg-[var(--color-bg-inverse)]",
      "oreo-focus",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    ],
    thumb: [
      "block size-4 rounded-[var(--radius-capsule)] bg-[var(--color-bg-base)] shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
      "transition-transform duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
      "data-[checked]:translate-x-[calc(var(--spacing)*3.5)] data-[checked]:bg-[var(--color-text-on-inverse)]",
      "motion-reduce:transition-none",
    ],
  },
});

/**
 * The Oreo icon vocabulary.
 *
 * Names describe *meaning*, not any one library's naming scheme — Phosphor
 * calls it `CaretDown`, Lucide calls it `ChevronDown`, we call it
 * `chevron-down`. Call sites reference these names so the whole system can be
 * repointed at a different icon set without touching a single component.
 *
 * Adding an icon means adding it here plus in both glyph maps; the maps are
 * typed `Record<IconName, IconGlyph>`, so TypeScript fails the build until
 * every library has an answer for the new name.
 */
export const ICON_NAMES = [
  "align-left",
  "apple-logo",
  "arrow-down",
  "arrow-out",
  "arrow-up",
  "arrow-up-right",
  "at",
  "bell",
  "brain",
  "calendar",
  "camera",
  "chart-line",
  "chat",
  "check",
  "checks",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "chevron-up",
  "circle-dashed",
  "copy",
  "corner-down-right",
  "ellipsis",
  "expand",
  "folder",
  "gauge",
  "gear",
  "github-logo",
  "globe",
  "grip-vertical",
  "keyboard",
  "list",
  "hash",
  "list-checks",
  "mic",
  "moon",
  "paintbrush",
  "paperclip",
  "paper-plane",
  "pencil",
  "plane",
  "plug",
  "plus",
  "prohibit",
  "refresh",
  "reset",
  "search",
  "sliders",
  "smiley",
  "sparkle",
  "spinner",
  "star",
  "sun",
  "thumbs-down",
  "thumbs-up",
  "trash",
  "warning-circle",
  "x",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

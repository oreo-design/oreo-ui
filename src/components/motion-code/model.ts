/** Pure timeline math shared by the scrubber and the explanatory preview. */
export function clampProgress(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

export function sheetFrame(value: number) {
  const progress = clampProgress(value);
  // These keyframes are visible in the supplied video. This is a seekable
  // illustration of that overshoot, not an animation applied to real content.
  return {
    translate: progress <= 60 ? 100 - 104 * progress / 60 : -4 + 4 * (progress - 60) / 40,
    opacity: Math.min(1, progress / 60),
  };
}

/** Keyframe rows 2, 6 and 10 of the example correspond to 0%, 60%, 100%. */
export function progressForFocus(focus: number) {
  const row = clampProgress(focus) / 100 * 17;
  return row <= 2 ? 0 : row <= 6 ? (row - 2) * 15 : row <= 10 ? 60 + (row - 6) * 10 : 100;
}
export function focusForProgress(progress: number) {
  const p = clampProgress(progress);
  return (p <= 60 ? 2 + p / 15 : 6 + (p - 60) / 10) / 17 * 100;
}

const glyphs = "abcdefghijklmnopqrstuvwxyz{}[];:=<>";
/** Stable noise preserves spaces and character widths; no perpetual timer. */
export function scrambleLine(line: string, row: number, seed = 0) {
  return [...line].map((char, column) => /\s/.test(char) ? char : glyphs[(row * 17 + column * 13 + seed * 7) % glyphs.length]).join("");
}

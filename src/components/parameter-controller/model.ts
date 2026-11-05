export type Point = { x: number; y: number };
export type ShadowLayer = {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
};
export function bounded(value: number, min: number, max: number, step = 1) {
  if (!Number.isFinite(value)) return min;
  const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
  return Number(
    Math.max(
      min,
      Math.min(max, min + Math.round((value - min) / safeStep) * safeStep),
    ).toFixed(6),
  );
}
export function validHex(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}
export function shadowCSS(layers: readonly ShadowLayer[]) {
  return (
    layers
      .map(
        (l) =>
          `${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}${Math.round(
            bounded(l.opacity, 0, 100) * 2.55,
          )
            .toString(16)
            .padStart(2, "0")}`,
      )
      .join(", ") || "none"
  );
}
export type History<T> = { past: T[]; present: T; future: T[] };
export function record<T>(state: History<T>, next: T): History<T> {
  return JSON.stringify(state.present) === JSON.stringify(next)
    ? state
    : {
        past: [...state.past, state.present].slice(-50),
        present: next,
        future: [],
      };
}
export function travel<T>(
  state: History<T>,
  direction: "undo" | "redo",
): History<T> {
  if (direction === "undo")
    return state.past.length
      ? {
          past: state.past.slice(0, -1),
          present: state.past.at(-1)!,
          future: [state.present, ...state.future],
        }
      : state;
  return state.future.length
    ? {
        past: [...state.past, state.present].slice(-50),
        present: state.future[0],
        future: state.future.slice(1),
      }
    : state;
}
export const DEFAULT_SHADOWS: ShadowLayer[] = [
  {
    id: "shadow-1",
    x: 0,
    y: 24,
    blur: 72,
    spread: -4,
    color: "#000000",
    opacity: 12,
  },
];

import type { ComponentPropsWithRef } from "react";

export type GradientMaskDirection = "top" | "right" | "bottom" | "left";
export type GradientMaskEasing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

export type GradientMaskOptions = {
  /** Edge the content fades toward. */
  direction?: GradientMaskDirection;
  /** Opacity curve, sampled into CSS gradient stops. */
  easing?: GradientMaskEasing;
  /** Percentage along the direction where fading starts (0–100). */
  start?: number;
  /** Percentage where fading finishes (start–100). */
  end?: number;
  /** Amount removed at the faded edge: 0 keeps everything, 1 is transparent. */
  strength?: number;
};

const clamp = (value: number, min: number, max: number, fallback: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

const curves: Record<GradientMaskEasing, (t: number) => number> = {
  linear: (t) => t,
  "ease-in": (t) => t * t,
  "ease-out": (t) => 1 - (1 - t) ** 2,
  "ease-in-out": (t) => t * t * (3 - 2 * t),
};

/** Pure CSS output, also usable without the wrapper (e.g. on an <img>). */
export function gradientMaskImage({
  direction = "bottom",
  easing = "ease-in-out",
  start = 0,
  end = 100,
  strength = 1,
}: GradientMaskOptions = {}): string {
  const from = clamp(start, 0, 100, 0);
  const to = clamp(end, from, 100, 100);
  const amount = clamp(strength, 0, 1, 1);
  // Sixteen intervals approximate the curve without requiring CSS easing support.
  const stops = Array.from({ length: 17 }, (_, i) => {
    const t = i / 16;
    const alpha = Number((1 - curves[easing](t) * amount).toFixed(4));
    const position = Number((from + (to - from) * t).toFixed(3));
    return `rgb(0 0 0 / ${alpha}) ${position}%`;
  });
  return `linear-gradient(to ${direction}, ${stops.join(", ")})`;
}

export type GradientMaskProps = ComponentPropsWithRef<"div"> & GradientMaskOptions;

/**
 * Fades its children into whatever is behind them, without adding a color.
 * Keep captions and interactive controls outside the mask so they stay visible.
 * Static by design: no timers, observers, animation loop, or motion dependency.
 */
export function GradientMask({
  direction,
  easing,
  start,
  end,
  strength,
  style,
  children,
  ...props
}: GradientMaskProps) {
  const maskImage = gradientMaskImage({ direction, easing, start, end, strength });
  return (
    <div
      {...props}
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
        maskMode: "alpha",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

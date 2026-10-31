import { useReducedMotion } from "motion/react";
import { pressSpring } from "@/lib/motion";

/** Press-spring controls shared by the native Button and IconButton renderers. */
export type ButtonPressOptions = {
  disabled?: boolean;
  bounce?: number;
  duration?: number;
  tapScale?: number;
};

export function useButtonPress({
  disabled,
  bounce = pressSpring.bounce,
  duration = pressSpring.duration,
  tapScale = 0.96,
}: ButtonPressOptions) {
  const reducedMotion = useReducedMotion();

  return {
    // The surface's active state layer still provides immediate feedback.
    whileTap: disabled || reducedMotion || tapScale === 1 ? undefined : { scale: tapScale },
    transition: { ...pressSpring, bounce, duration },
  };
}

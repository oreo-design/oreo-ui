import { useEffect, useId, useSyncExternalStore, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import "./subscription.css";

// Match the reactive preference pattern used by Oreo StatusIcon. Motion 11's
// hook snapshots the preference on mount; this scene also responds to changes.
const reducedQuery = "(prefers-reduced-motion: reduce)";
const readReducedMotion = () => window.matchMedia(reducedQuery).matches;
const serverReducedMotion = () => true;
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export type LayeredProductCardProps = {
  title: string;
  description: string;
  mark: ReactNode;
  background: ReactNode;
  foreground: ReactNode;
  /** Maximum foreground travel in CSS pixels (clamped to 0–8). */
  travel?: number;
  motionEnabled?: boolean;
  className?: string;
};

/** A decorative two-plane scene. Its caption and product mark never move. */
export function LayeredProductCard({ title, description, mark, background, foreground, travel = 4, motionEnabled = true, className }: LayeredProductCardProps) {
  const id = useId();
  const reduce = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, serverReducedMotion);
  const spring = { duration: 0.5, bounce: 0.2 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const backX = useTransform(x, value => value * 0.35);
  const backY = useTransform(y, value => value * 0.35);
  const frontTransform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;
  const backTransform = useMotionTemplate`translate3d(${backX}px, ${backY}px, 0)`;
  const enabled = motionEnabled && !reduce;
  const distance = Number.isFinite(travel) ? Math.min(8, Math.max(0, travel)) : 4;

  useEffect(() => { if (!enabled) { x.jump(0); y.jump(0); } }, [enabled, x, y]);
  function reset() { x.set(0); y.set(0); }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)) * distance);
    y.set(Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)) * distance);
  }
  return <figure aria-labelledby={id} className={cn("min-w-0", className)}>
    <div aria-hidden="true" className="oreo-product-scene" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <span className="absolute left-4 top-4 z-10 text-text-primary">{mark}</span>
      <motion.div className="oreo-product-back" style={{ transform: enabled ? backTransform : "none" }}>{background}</motion.div>
      <motion.div className="oreo-product-front" style={{ transform: enabled ? frontTransform : "none" }}>{foreground}</motion.div>
    </div>
    <figcaption id={id} className="mt-3 px-1 text-center text-xs leading-5 text-text-secondary"><span className="sr-only">{title}: </span>{description}</figcaption>
  </figure>;
}

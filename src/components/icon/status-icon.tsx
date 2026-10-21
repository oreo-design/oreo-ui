import { useEffect, useId, useRef, useSyncExternalStore, type SVGProps } from "react";
import { animate, motion, useMotionValue, useTransform, type AnimationPlaybackControls } from "motion/react";
import { cn } from "@/lib/cn";
import { statusIcon } from "../status-icon/status-icon.variants";
import "../status-icon/status-icon.css";

export const STATUS_ICON_STATES = ["backlog", "planned", "todo", "in-progress", "done", "blocked", "canceled"] as const;
export const STATUS_ICON_PROGRESS = ["quarter", "half", "three-quarters"] as const;
export type StatusIconState = typeof STATUS_ICON_STATES[number];
export type StatusIconProgress = typeof STATUS_ICON_PROGRESS[number];
export type StatusIconProps = Omit<SVGProps<SVGSVGElement>, "children" | "color"> & {
  status?: StatusIconState;
  progress?: StatusIconProgress;
  size?: "sm" | "md" | "lg" | "xl";
  monochrome?: boolean;
  animated?: boolean;
};

const outline = "M12 3C19 3 21 5 21 12S19 21 12 21 3 19 3 12 5 3 12 3Z";
const inner = "M12 5.5C17.5 5.5 18.5 6.5 18.5 12S17.5 18.5 12 18.5 5.5 17.5 5.5 12 6.5 5.5 12 5.5Z";
const fractions = { quarter: .25, half: .5, "three-quarters": .75 };
const dot = "M12 12L12 12M12 12L12 12";
const marks = {
  done: "M8.5 12.3L10.8 14.6M10.8 14.6L15.7 9.6",
  canceled: "M9 9L15 15M9 15L15 9",
  blocked: "M12 12L12 12M5.7 18.3L18.3 5.7",
};
const markFor = (status: StatusIconState) => status in marks ? marks[status as keyof typeof marks] : dot;
// The same eight dash pairs persist. Alternate gaps close for Planned; the
// remaining gaps close for To do. Offset carries the segments around the ring.
const dashes = {
  backlog: Array(8).fill("6 6.5").join(" "),
  planned: Array(4).fill("6 0 12.5 6.5").join(" "),
  solid: Array(8).fill("12.5 0").join(" "),
};
const dashFor = (status: StatusIconState) => dashes[status === "backlog" || status === "planned" ? status : "solid"];
const offsetFor = (status: StatusIconState) => status === "backlog" ? -3.25 : status === "planned" ? -28.25 : -53.25;
const tones = {
  backlog: "text-text-tertiary", planned: "text-text-tertiary", todo: "text-text-secondary",
  "in-progress": "", done: "text-status-progress", blocked: "text-status-error", canceled: "text-text-secondary",
};
// Oreo has no yellow status token; use its Tailwind amber scale for that tone.
const progressTones = { quarter: "text-amber-400", half: "text-palette-orange-text", "three-quarters": "text-status-success" };
const morphEase = [.77, 0, .175, 1] as const;
const outEase = [.23, 1, .32, 1] as const;
const reducedQuery = "(prefers-reduced-motion: reduce)";
const readReducedMotion = () => window.matchMedia(reducedQuery).matches;
const serverReducedMotion = () => false;
function subscribeReducedMotion(notify: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

/** A clockwise radial sweep clipped to the inner squircle, not three fills. */
function sector(fraction: number) {
  const value = Math.min(1, Math.max(0, fraction));
  if (value === 0) return "M12 12Z";
  if (value === 1) return "M12 12L12 -8A20 20 0 1 1 12 32A20 20 0 1 1 12 -8Z";
  const angle = value * Math.PI * 2;
  return `M12 12L12 -8A20 20 0 ${value > .5 ? 1 : 0} 1 ${12 + 20 * Math.sin(angle)} ${12 - 20 * Math.cos(angle)}Z`;
}

/** Display-only glyph. Supply aria-label when it stands alone. */
export function StatusIcon({ status = "todo", progress = "half", size = "md", monochrome = false, animated = true, className, "aria-label": label, "aria-labelledby": labelledBy, "aria-hidden": hidden, ...props }: StatusIconProps) {
  const clipId = useId();
  const reduced = useSyncExternalStore(subscribeReducedMotion, readReducedMotion, serverReducedMotion);
  const previous = useRef(status);
  const fraction = useMotionValue(status === "in-progress" ? fractions[progress] : 0);
  const fillOpacity = useMotionValue(status === "in-progress" ? 1 : 0);
  const fillPath = useTransform(fraction, sector);
  const dashArray = useMotionValue(dashFor(status));
  const dashOffset = useMotionValue(offsetFor(status));
  const markPath = useMotionValue(markFor(status));
  const markOpacity = useMotionValue(status in marks ? 1 : 0);
  const markLength = useMotionValue(1);

  useEffect(() => {
    const before = previous.current;
    previous.current = status;
    const targetFraction = status === "in-progress" ? fractions[progress] : 0;
    const targetMark = markFor(status);
    if (!animated || reduced) {
      fraction.set(targetFraction); fillOpacity.set(status === "in-progress" ? 1 : 0);
      dashArray.set(dashFor(status)); dashOffset.set(offsetFor(status));
      markPath.set(targetMark); markOpacity.set(status in marks ? 1 : 0); markLength.set(1);
      return;
    }
    const running: AnimationPlaybackControls[] = [];
    const morph = { duration: .35, ease: morphEase };
    running.push(animate(dashArray, dashFor(status), morph), animate(dashOffset, offsetFor(status), morph));
    const completing = status === "done" && before === "in-progress";
    if (completing) {
      // Source ~8.15 s: finish the sweep, clear the fill, then write the check.
      running.push(animate(fraction, 1, { duration: .26, ease: morphEase }));
      running.push(animate(fillOpacity, 0, { delay: .2, duration: .16, ease: outEase }));
    } else {
      if (status === "in-progress") fillOpacity.set(1);
      else running.push(animate(fillOpacity, 0, { duration: .12, ease: outEase }));
      running.push(animate(fraction, targetFraction, morph));
    }
    if (status in marks) {
      if (before in marks && before !== status) {
        markLength.set(1);
        // Check → cross folds through the center. Cross → slash extends the
        // existing diagonal as its other stroke contracts into the center.
        running.push(animate(markPath, status === "canceled" ? [markPath.get(), dot, targetMark] : targetMark,
          { duration: .3, ease: morphEase }));
        running.push(animate(markOpacity, 1, { duration: .06 }));
      } else if (before !== status) {
        markPath.set(targetMark); markLength.set(0); markOpacity.set(0);
        const delay = completing ? .22 : 0;
        running.push(animate(markOpacity, 1, { delay, duration: .04 }));
        running.push(animate(markLength, 1, { delay, duration: .24, ease: outEase }));
      } else {
        running.push(animate(markPath, targetMark, { duration: .18, ease: outEase }));
        running.push(animate(markLength, 1, { duration: .18, ease: outEase }));
        running.push(animate(markOpacity, 1, { duration: .08 }));
      }
    } else {
      running.push(animate(markOpacity, 0, { duration: .1 }));
      running.push(animate(markPath, dot, { duration: .18, ease: outEase }));
    }
    // A new state retargets the current geometry, including delayed check draws.
    return () => running.forEach(animation => animation.stop());
  }, [status, progress, animated, reduced, fraction, fillOpacity, dashArray, dashOffset, markPath, markOpacity, markLength]);

  const accessible = Boolean(label || labelledBy);
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    role={accessible ? "img" : undefined} aria-label={label} aria-labelledby={labelledBy} aria-hidden={hidden ?? !accessible} focusable="false"
    data-status={status} data-animated={animated}
    className={cn(statusIcon({ size }), !monochrome && (status === "in-progress" ? progressTones[progress] : tones[status]), className)}>
    <defs><clipPath id={clipId}><path d={inner} /></clipPath></defs>
    <motion.path d={outline} pathLength="100" style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset }} />
    <g clipPath={`url(#${clipId})`}><motion.path d={fillPath} fill="currentColor" stroke="none" style={{ opacity: fillOpacity }} /></g>
    <motion.path d={markPath} pathLength={markLength} style={{ opacity: markOpacity }} />
  </svg>;
}

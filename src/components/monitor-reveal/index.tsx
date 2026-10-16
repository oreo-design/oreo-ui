import { useLayoutEffect, useRef, type ReactNode } from "react";
/** A nonblocking introduction. Changing play to a positive number replays;
 * zero cancels immediately without remounting children or changing their data. */
export function MonitorReveal({
  children,
  play = 0,
  delay = 0,
  variant = "rise",
  className = "",
}: {
  children: ReactNode;
  play?: number;
  delay?: number;
  variant?: "rise" | "wipe";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || play <= 0 || document.hidden) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = media.matches;
    const frames: Keyframe[] = reduced
      ? [{ opacity: 0.5 }, { opacity: 1 }]
      : variant === "wipe"
        ? [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }]
        : [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "translateY(0)" },
          ];
    const animation = node.animate(frames, {
      duration: reduced ? 150 : variant === "wipe" ? 260 : 200,
      delay: reduced
        ? 0
        : Math.min(400, Math.max(0, Number.isFinite(delay) ? delay : 0)),
      easing:
        getComputedStyle(node).getPropertyValue("--ease-out").trim() ||
        "cubic-bezier(0.23, 1, 0.32, 1)",
      fill: "backwards",
    });
    const stop = () => animation.cancel();
    const visibility = () => {
      if (document.hidden) stop();
    };
    media.addEventListener("change", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      stop();
      media.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [play, delay, variant]);
  return (
    <div
      ref={ref}
      data-monitor-reveal
      className={className}
      onPointerDownCapture={() =>
        ref.current?.getAnimations().forEach((a) => a.cancel())
      }
      onKeyDownCapture={() =>
        ref.current?.getAnimations().forEach((a) => a.cancel())
      }
    >
      {children}
    </div>
  );
}

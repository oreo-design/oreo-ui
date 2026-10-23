import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { easeOut } from "@/lib/motion";

export const promptTransition = { duration: 0.22, ease: easeOut };

/** Accordion geometry avoids stretching text while the composer grows. */
function Reveal({ children, edge }: { children: ReactNode; edge?: "header" | "footer" }) {
  const reduce = useReducedMotion();
  const present = useIsPresent();
  // Animate the overlap fraction; CSS resolves the current theme's spacing on
  // every frame, including density edits while this surface remains mounted.
  const overlap = { "--prompt-overlap": 1 };
  const closedOverlap = { "--prompt-overlap": 0 };
  return <motion.div
    inert={!present}
    className={edge ? "relative z-[1] w-full" : "w-full"}
    initial={{ opacity: 0, height: reduce ? "auto" : 0, ...closedOverlap }}
    animate={{ opacity: 1, height: "auto", ...overlap }}
    exit={{ opacity: 0, height: reduce ? "auto" : 0, ...(reduce ? overlap : closedOverlap) }}
    transition={{ ...promptTransition, ...(reduce ? { height: { duration: 0 }, "--prompt-overlap": { duration: 0 } } : {}) }}
    style={{
      overflow: "clip",
      marginTop: edge === "footer" ? "calc(-1 * var(--space-x8) * var(--prompt-overlap, 1))" : undefined,
      marginBottom: edge === "header" ? "calc(-1 * var(--space-x8) * var(--prompt-overlap, 1))" : undefined,
    }}
  >{children}</motion.div>;
}

export function PromptReveal({ children, edge }: { children: ReactNode; edge?: "header" | "footer" }) {
  return <AnimatePresence initial={false}>{children != null && children !== false && <Reveal key="content" edge={edge}>{children}</Reveal>}</AnimatePresence>;
}

export function PromptPresenceContent({ children }: { children: ReactNode }) {
  const present = useIsPresent();
  return <span inert={!present} className="contents">{children}</span>;
}

function SwapControl({ children, onMeasure }: { children: ReactNode; onMeasure: (width: number) => void }) {
  const present = useIsPresent();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!present || !ref.current) return;
    const el = ref.current;
    const measure = () => onMeasure(el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [present, onMeasure]);
  return <motion.div ref={ref}
    initial={{ opacity: 0, transform: reduce ? "scale(1)" : "scale(0.95)" }}
    animate={{ opacity: 1, transform: "scale(1)" }}
    exit={{ opacity: 0, transform: reduce ? "scale(1)" : "scale(0.95)" }}
    transition={promptTransition} inert={!present} className="flex h-8 w-max shrink-0 items-center"
    style={{ position: present ? "relative" : "absolute", right: 0, top: 0, transformOrigin: "right center" }}>
    {children}
  </motion.div>;
}

/** Measure the real controls and interpolate their slot, never scale glyphs.
 * Both faces remain right-aligned as the slot makes room for a wider pill. */
export function PromptSwap({ state, children }: { state: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const [width, setWidth] = useState<number | undefined>();
  const [resizing, setResizing] = useState(false);
  return <motion.div initial={false} animate={{ width: width ?? "auto" }}
    transition={reduce ? { duration: 0 } : promptTransition}
    onAnimationStart={() => setResizing(true)} onAnimationComplete={() => setResizing(false)}
    style={{ overflow: resizing ? "clip" : "visible" }}
    className="relative flex h-8 shrink-0 items-center justify-end">
    <AnimatePresence initial={false}>
      <SwapControl key={state} onMeasure={setWidth}>{children}</SwapControl>
    </AnimatePresence>
  </motion.div>;
}

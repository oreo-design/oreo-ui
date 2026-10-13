import { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icon";
import { easeOut } from "@/lib/motion";

/** A result-derived activity ring, not a claim about server completion. */
export function WebSearchProgress({ searching, count, progress }: { searching: boolean; count: number; progress?: number }) {
  const reduced = useReducedMotion();
  const fill = useMotionValue(searching ? 0 : 1);
  const target = searching ? Math.min(.95, Math.max(0, progress != null && Number.isFinite(progress) ? progress : .1 + .8 * count / (count + 3))) : 1;
  useEffect(() => {
    if (reduced) { fill.jump(target); return; }
    let active = true;
    let drift: ReturnType<typeof animate> | undefined;
    const settle = animate(fill, target, { duration: .25, ease: easeOut });
    void settle.then(() => {
      if (active && searching && progress === undefined) drift = animate(fill, Math.min(.98, target + .05), { duration: 4, ease: "linear" });
    });
    return () => { active = false; settle.stop(); drift?.stop(); };
  }, [fill, target, searching, progress, reduced]);
  return <span aria-hidden className="relative flex size-7 shrink-0 items-center justify-center rounded-capsule bg-bg-surface text-text-secondary shadow-[var(--shadow-default)]">
    <Icon name="globe" size="sm" />
    <motion.svg viewBox="0 0 28 28" className="absolute inset-0 size-full -rotate-90 text-text-primary" initial={false}
      animate={{ opacity: searching ? 1 : 0 }} transition={{ duration: .2, delay: searching || reduced ? 0 : .3 }}>
      <circle cx="14" cy="14" r="13" fill="none" stroke="var(--color-border-default)" strokeWidth="1.5" />
      <motion.circle cx="14" cy="14" r="13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: fill }} />
    </motion.svg>
  </span>;
}

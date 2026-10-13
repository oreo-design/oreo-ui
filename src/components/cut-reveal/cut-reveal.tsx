import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import "./cut-reveal.css";

export type CutRevealProps = {
  children: ReactNode;
  /** Decorative artwork shown on the upper sheet. Keep it non-interactive. */
  wordmark: ReactNode;
  /** Total presentation time in milliseconds, clamped to 1–12 seconds. */
  duration?: number;
  skipLabel?: string;
  className?: string;
  style?: CSSProperties;
  onReveal?: () => void;
};

function Scissors() {
  return <svg viewBox="0 0 36 30" fill="none" aria-hidden="true">
    <g className="cut-reveal__blade cut-reveal__blade--upper"><circle cx="9" cy="7" r="4" /><path d="m12 10 20 14" /></g>
    <g className="cut-reveal__blade cut-reveal__blade--lower"><circle cx="9" cy="23" r="4" /><path d="M12 20 32 6" /></g>
    <circle cx="19" cy="15" r="1.5" fill="currentColor" stroke="none" />
  </svg>;
}

/** A decorative opening sequence, not a network-loading indicator.
 * Remount with a new key to replay. Children stay mounted through the reveal.
 */
export function CutReveal({ children, wordmark, duration = 5200, skipLabel = "Skip intro", className, style, onReveal }: CutRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const complete = useRef(false);
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;
  const total = Number.isFinite(duration) ? Math.min(12000, Math.max(1000, duration)) : 5200;

  const finish = (focus = false) => {
    if (complete.current) return;
    complete.current = true;
    setRevealed(true);
    onRevealRef.current?.();
    if (focus) requestAnimationFrame(() => content.current?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    if (revealed) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let timeout = 0;
    const start = performance.now();
    const done = () => {
      if (complete.current) return;
      complete.current = true;
      setRevealed(true);
      onRevealRef.current?.();
    };
    const tick = (now: number) => {
      if (counter.current) counter.current.textContent = String(Math.min(100, Math.floor((now - start) / (total * 0.62) * 100))).padStart(3, "0");
      frame = requestAnimationFrame(tick);
    };
    const updatePreference = () => { if (preference.matches) done(); };
    if (preference.matches) timeout = window.setTimeout(done, 120);
    else {
      frame = requestAnimationFrame(tick);
      // The timer also completes in a background tab where animation events may pause.
      timeout = window.setTimeout(done, total);
    }
    preference.addEventListener("change", updatePreference);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      preference.removeEventListener("change", updatePreference);
    };
  }, [revealed, total]);

  return <div className={cn("cut-reveal", className)} data-revealed={revealed} style={{ ...style, "--cut-duration": `${total}ms` } as CSSProperties}>
    <div ref={content} className="cut-reveal__content" inert={!revealed} tabIndex={-1}>{children}</div>
    {!revealed && <>
      <div className="cut-reveal__curtain" aria-hidden="true">
        <div className="cut-reveal__sheet cut-reveal__sheet--top"><div className="cut-reveal__wordmark">{wordmark}</div></div>
        <div className="cut-reveal__sheet cut-reveal__sheet--bottom">
          <div className="cut-reveal__shapes"><i /><i /><i /><i /><i /></div>
        </div>
        <div className="cut-reveal__seam">
          <div className="cut-reveal__dashes" />
          <div className="cut-reveal__cut" />
          <span ref={counter} className="cut-reveal__counter">000</span>
          <span className="cut-reveal__instruction">Cut along line <b>▸▸▸</b></span>
          <div className="cut-reveal__scissors-track"><span className="cut-reveal__scissors"><Scissors /></span></div>
        </div>
      </div>
      <span className="sr-only" role="status">Opening presentation</span>
      <button className="cut-reveal__skip" onClick={() => finish(true)}>{skipLabel} ↗</button>
    </>}
  </div>;
}

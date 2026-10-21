import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { clampProgress, scrambleLine } from "./model";
import "./motion-code.css";

export type CodeFocusProps = {
  code: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  focusLines?: number;
  scramble?: boolean;
  disabled?: boolean;
  label?: string;
  className?: string;
};

function Highlight({ text }: { text: string }) {
  return text.split(/(-?\d+(?:\.\d+)?(?:%|ms)?|@keyframes|transform|opacity|animation)/g).map((part, index) =>
    <span key={index} className={/^-?\d/.test(part) ? "oreo-code-focus__number" : /^(?:@keyframes|transform|opacity|animation)$/.test(part) ? "oreo-code-focus__property" : undefined}>{part}</span>);
}

/** A bounded vertical slider with a visual code lens. Not a text editor. */
export function CodeFocus({ code, value, defaultValue = 36, onValueChange, focusLines = 5, scramble = true, disabled = false, label = "Code focus", className }: CodeFocusProps) {
  const lines = useMemo(() => code ? code.replace(/\r\n/g, "\n").split("\n") : [], [code]);
  const [internal, setInternal] = useState(defaultValue);
  const [keyboard, setKeyboard] = useState(false);
  const [settled, setSettled] = useState(true);
  const [seed, setSeed] = useState(0);
  const progress = clampProgress(value ?? internal);
  const count = lines.length;
  const selected = progress / 100 * Math.max(0, count - 1);
  const band = Math.min(count, Math.max(1, Number.isFinite(focusLines) ? Math.round(focusLines) : 5));
  const reduce = useReducedMotion();
  const gesture = useRef<{ id: number; start: number } | null>(null);
  const hint = useId();
  const inactive = disabled || !count;
  const start = Math.max(0, Math.min(count - band, selected - (band - 1) / 2));
  const signature = `${Math.round(selected)}:${code}:${band}:${scramble}:${reduce}:${keyboard}`;

  useEffect(() => {
    if (reduce || keyboard || !scramble || inactive) { setSettled(true); return; }
    setSettled(false);
    // Three short text updates only when the focused row changes. No idle loop.
    setSeed(1);
    const a = setTimeout(() => setSeed(2), 40);
    const b = setTimeout(() => setSeed(3), 80);
    const end = setTimeout(() => setSettled(true), 120);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(end); };
  }, [signature, reduce, keyboard, scramble, inactive]);

  useEffect(() => { if (inactive) gesture.current = null; }, [inactive]);
  const change = (next: number) => {
    if (inactive) return;
    const bounded = clampProgress(next);
    if (value === undefined) setInternal(bounded);
    onValueChange?.(bounded);
  };
  const position = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    // The padded content, not the outer chrome, owns the timeline.
    const padding = parseFloat(getComputedStyle(event.currentTarget).paddingTop);
    change((event.clientY - box.top - padding - (box.height - padding * 2) / count / 2) / Math.max(1, (box.height - padding * 2) * (count - 1) / count) * 100);
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (inactive || !event.isPrimary || event.button !== 0 || gesture.current) return;
    setKeyboard(false);
    gesture.current = { id: event.pointerId, start: progress };
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    position(event);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (inactive || !event.isPrimary) return;
    if (gesture.current ? gesture.current.id !== event.pointerId : event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setKeyboard(false);
    position(event);
  };
  const end = (event: PointerEvent<HTMLDivElement>, cancel = false) => {
    const active = gesture.current;
    if (active?.id !== event.pointerId) return;
    gesture.current = null;
    if (cancel) change(active.start);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    if (inactive || event.altKey || event.ctrlKey || event.metaKey) return;
    const step = 100 / Math.max(1, count - 1);
    const next = event.key === "Home" ? 0 : event.key === "End" ? 100 : ["ArrowDown", "ArrowRight"].includes(event.key) ? progress + step : ["ArrowUp", "ArrowLeft"].includes(event.key) ? progress - step : event.key === "PageDown" ? progress + step * band : event.key === "PageUp" ? progress - step * band : undefined;
    if (next === undefined) return;
    event.preventDefault(); setKeyboard(true); change(next);
  };

  return <div className={cn("oreo-code-focus", className)} data-instant={keyboard || reduce || undefined} data-disabled={inactive || undefined} style={{ "--focus-rows": Math.max(1, count), "--focus-band": band } as CSSProperties}>
    <div role={count ? "slider" : undefined} aria-label={label} aria-orientation={count ? "vertical" : undefined} aria-valuemin={count ? 0 : undefined} aria-valuemax={count ? 100 : undefined} aria-valuenow={count ? Math.round(progress) : undefined} aria-valuetext={count ? `Line ${Math.round(selected) + 1} of ${count}` : undefined} aria-disabled={inactive || undefined} aria-describedby={hint} tabIndex={inactive ? -1 : 0}
      className="oreo-code-focus__input" onPointerDown={down} onPointerMove={move} onPointerUp={event => end(event)} onPointerCancel={event => end(event, true)} onLostPointerCapture={event => end(event, true)} onKeyDown={key}>
      <span id={hint} className="sr-only">Move vertically to explore. On touch, drag. Arrow keys change lines; Home and End jump to the edges. The complete source follows this control.</span>
      {count ? <>
        <div aria-hidden="true" className="oreo-code-focus__lines">
          {lines.map((line, row) => {
            const active = row + .5 >= start && row < start + band;
            const noise = scramble && !reduce ? scrambleLine(line, row, active && !settled ? seed : 0) : line;
            return <div key={row} className="oreo-code-focus__line" data-active={active || undefined}>
              <span className="oreo-code-focus__gutter">{row + 1}</span>
              <span className="oreo-code-focus__text"><span className="oreo-code-focus__noise" style={{ opacity: active && settled ? 0 : 1 }}>{noise || " "}</span><span className="oreo-code-focus__real" style={{ opacity: active || !scramble || reduce ? settled || reduce || keyboard ? 1 : .35 : 0 }}><Highlight text={line || " "} /></span></span>
            </div>;
          })}
          <div className="oreo-code-focus__band" style={{ transform: `translateY(${start / band * 100}%)` }} />
        </div>
      </> : <div className="oreo-code-focus__empty">No code to explore</div>}
    </div>
    <pre className="sr-only" aria-label="Complete source code"><code>{code || "No source provided."}</code></pre>
  </div>;
}

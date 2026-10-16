import { useCallback, useEffect, useId, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/cn";
import "./word-roller.css";

export type WordRollerProps = {
  /** Ordered labels. Empty labels and duplicates are ignored. */
  words: readonly string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (word: string) => void;
  /** Stationary text next to the moving words. */
  suffix?: string;
  loop?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  visibleWords?: 5 | 7 | 9;
  "aria-label"?: string;
  className?: string;
};

const wrap = (n: number, length: number) => ((n % length) + length) % length;
const clamp = (n: number, length: number) => Math.max(0, Math.min(length - 1, n));

function RollerWord({ word, index, position }: { word: string; index: number; position: MotionValue<number> }) {
  // The emphasis follows the actual position, including the middle of a drag.
  const opacity = useTransform(position, p => .22 + .78 * Math.max(0, 1 - Math.abs(index - p)) ** 2);
  return <motion.div className="oreo-word-roller__word" style={{ opacity }}>{word}</motion.div>;
}

/** A draggable, wheel-driven listbox with a stationary phrase and snap points. */
export function WordRoller({ words, value, defaultValue, onValueChange, suffix = "for every season", loop = true, disabled = false, size = "md", visibleWords = 9, "aria-label": label = "Choose a word", className }: WordRollerProps) {
  const items = useMemo(() => [...new Set(words.filter(word => word.trim().length > 0))], [words]);
  const signature = JSON.stringify(items);
  const [internal, setInternal] = useState(defaultValue ?? items[0]);
  const selected = Math.max(0, items.indexOf(value ?? internal));
  const count = items.length;
  const canLoop = loop && count > 1;
  const inactive = disabled || count < 2;
  const reduce = useReducedMotion();
  const id = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const position = useMotionValue(selected);
  const transform = useTransform(position, p => `translateY(${-p * 1.25}em)`);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const drag = useRef<{ id: number; startY: number; lastY: number; moved: boolean } | null>(null);
  const keyboard = useRef(false);
  const search = useRef({ text: "", at: 0 });
  const normalize = useCallback((n: number) => count ? canLoop ? wrap(n, count) : clamp(n, count) : 0, [count, canLoop]);

  const stop = useCallback(() => {
    animation.current?.stop();
    clearTimeout(wheelTimer.current);
  }, []);

  const moveTo = useCallback((index: number, instant = false) => {
    stop();
    let target = index;
    if (canLoop) target += Math.round((position.get() - index) / count) * count;
    if (instant || reduce) position.set(index);
    else animation.current = animate(position, target, {
      type: "spring", duration: .5, bounce: .2,
      onComplete: () => position.set(index),
    });
  }, [canLoop, count, position, reduce, stop]);

  const commit = useCallback((raw: number, instant = false) => {
    if (!count) return;
    const next = normalize(Math.round(raw));
    keyboard.current = instant;
    if (value === undefined) setInternal(items[next]);
    onValueChange?.(items[next]);
    // A controlled value remains authoritative when a host rejects a change.
    moveTo(value === undefined ? next : selected, instant);
  }, [count, normalize, items, value, onValueChange, moveTo, selected]);

  useEffect(() => {
    moveTo(selected, keyboard.current);
    keyboard.current = false;
  }, [selected, moveTo]);

  useEffect(() => {
    stop();
    drag.current = null;
    position.set(selected);
    // Reset only for structural changes, not for each newly selected word.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, disabled, loop, visibleWords, stop, position]);
  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || inactive) return;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) return;
      const row = element.clientHeight / visibleWords;
      const delta = event.deltaY * (event.deltaMode === 1 ? row : event.deltaMode === 2 ? element.clientHeight : 1) / row;
      const current = position.get();
      if (!canLoop && ((current <= 0 && delta < 0) || (current >= count - 1 && delta > 0))) return;
      event.preventDefault();
      stop();
      position.set(normalize(current + Math.max(-3, Math.min(3, delta))));
      wheelTimer.current = setTimeout(() => commit(position.get(), Boolean(reduce)), 120);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [inactive, visibleWords, canLoop, count, position, stop, normalize, commit, reduce]);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (inactive || event.button !== 0) return;
    stop();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, startY: event.clientY, lastY: event.clientY, moved: false };
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    gesture.moved ||= Math.abs(event.clientY - gesture.startY) > 3;
    const row = event.currentTarget.clientHeight / visibleWords;
    position.set(normalize(position.get() + (gesture.lastY - event.clientY) / row));
    gesture.lastY = event.clientY;
  };
  const pointerEnd = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (cancelled) { moveTo(selected); return; }
    const box = event.currentTarget.getBoundingClientRect();
    const clickedOffset = gesture.moved ? 0 : (event.clientY - box.top - box.height / 2) / (box.height / visibleWords);
    commit(position.get() + clickedOffset);
  };
  const keyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (inactive || event.altKey || event.ctrlKey || event.metaKey) return;
    let next: number | undefined;
    if (event.key === "ArrowDown") next = selected + 1;
    if (event.key === "ArrowUp") next = selected - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = count - 1;
    if (event.key.length === 1 && event.key.trim()) {
      const now = performance.now();
      search.current.text = now - search.current.at > 700 ? event.key : search.current.text + event.key;
      search.current.at = now;
      const matches = (word: string) => word.toLocaleLowerCase().startsWith(search.current.text.toLocaleLowerCase());
      next = items.findIndex(matches);
      if (next < 0) next = undefined;
    }
    if (next === undefined) return;
    event.preventDefault();
    commit(next, true);
  };

  const padding = canLoop ? visibleWords : 0;
  const visualWords = Array.from({ length: count ? count + padding * 2 : 0 }, (_, offset) => {
    const index = offset - padding;
    return <RollerWord key={index} word={items[wrap(index, count)]} index={index} position={position} />;
  });

  return <div className={cn("oreo-word-roller", className)} data-size={size} data-has-suffix={Boolean(suffix) || undefined} data-disabled={disabled || undefined}>
    <div ref={viewport} role="listbox" tabIndex={disabled || !count ? -1 : 0} aria-label={label} aria-orientation="vertical" aria-disabled={disabled || !count || undefined}
      aria-describedby={`${id}-hint`} aria-activedescendant={count ? `${id}-word-${selected}` : undefined}
      className="oreo-word-roller__viewport" style={{ height: `${visibleWords * 1.25}em`, touchAction: inactive ? "auto" : "pan-x pinch-zoom" } as CSSProperties}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={event => pointerEnd(event, true)} onLostPointerCapture={event => pointerEnd(event, true)} onKeyDown={keyDown}>
      <span id={`${id}-hint`} className="sr-only">{suffix ? `${suffix}. ` : ""}Scroll or drag to choose. Use Up and Down arrows, Home, End, or type a word.</span>
      {items.map((word, index) => <span key={word} id={`${id}-word-${index}`} role="option" aria-selected={index === selected} className="sr-only">{word}</span>)}
      <div className="oreo-word-roller__measure" aria-hidden="true">{(count ? items : ["No words"]).map(word => <span key={word}>{word}</span>)}</div>
      <div className="oreo-word-roller__mask" aria-hidden="true">
        {count ? <motion.div className="oreo-word-roller__track" style={{ transform, marginTop: `${(-padding - .5) * 1.25}em` }}>{visualWords}</motion.div> : <span className="oreo-word-roller__empty">No words</span>}
      </div>
    </div>
    {suffix && <span className="oreo-word-roller__suffix" aria-hidden="true">{suffix}</span>}
  </div>;
}

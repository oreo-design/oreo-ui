import { Fragment, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { WebSearchCitation } from "./search-citation";
import type { WebSource } from "./source";

export type WebSearchAnswerPart = { text: string; source?: WebSource; index?: number };
export type WebSearchAnswerProps = {
  /** Text segments with optional atomic citations. Append parts during streaming. */
  parts: WebSearchAnswerPart[];
  play?: boolean;
  /** Characters per second; invalid or zero values use the default. */
  speed?: number;
  /** Change this key when starting a different answer. */
  replayKey?: string | number;
  onComplete?: () => void;
  className?: string;
};

export function WebSearchAnswer({ parts, play = true, speed = 65, replayKey = 0, onComplete, className }: WebSearchAnswerProps) {
  const reduced = useReducedMotion();
  const total = parts.reduce((sum, part) => sum + Array.from(part.text).length, 0);
  const [cursor, setCursor] = useState({ key: replayKey, count: 0 });
  const count = cursor.key === replayKey ? cursor.count : 0;
  const callback = useRef(onComplete);
  callback.current = onComplete;
  const completion = useRef<string | number | null>(null);
  useEffect(() => {
    if (!play || reduced || count >= total) return;
    const rate = Number.isFinite(speed) && speed > 0 ? speed : 65;
    const timer = window.setTimeout(() => setCursor(current => ({ key: replayKey, count: Math.min(total, (current.key === replayKey ? current.count : 0) + Math.max(1, Math.round(rate / 30))) })), 1000 / 30);
    return () => window.clearTimeout(timer);
  }, [count, total, play, speed, reduced, replayKey]);
  const visible = reduced && play ? total : Math.min(count, total);
  const done = play && total > 0 && visible >= total;
  useEffect(() => {
    if (!done) { completion.current = null; return; }
    if (completion.current !== replayKey) { completion.current = replayKey; callback.current?.(); }
  }, [done, replayKey]);
  let remaining = visible;
  return <div className={cn("text-sm leading-7 text-text-secondary", className)} aria-busy={play && !done}>
    {parts.map((part, index) => {
      const characters = Array.from(part.text);
      const shown = Math.max(0, Math.min(remaining, characters.length));
      remaining -= characters.length;
      if (!shown) return null;
      const text = characters.slice(0, shown).join("");
      // Keep a citation beside the preceding word, without preventing paragraph wrapping.
      if (shown === characters.length && part.source) {
        const split = text.lastIndexOf(" ");
        return <Fragment key={index}>{split >= 0 ? text.slice(0, split + 1) : ""}<span className="inline whitespace-nowrap">{split >= 0 ? text.slice(split + 1) : text}{" "}<WebSearchCitation source={part.source} index={part.index} /></span>{" "}</Fragment>;
      }
      return <Fragment key={index}>{text}</Fragment>;
    })}
    {play && !done && <span aria-hidden className="oreo-search-caret ml-1 inline-block size-1.5 rounded-capsule bg-text-tertiary align-middle" />}
  </div>;
}

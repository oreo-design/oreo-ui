import { LoadingMark } from "@/components/icon";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import "./loading-sequence.css";

export const LOADING_SEQUENCE_VARIANTS = ["typography", "aperture", "wordmark", "curtain"] as const;
export type LoadingSequenceVariant = typeof LOADING_SEQUENCE_VARIANTS[number];
export type LoadingSequenceProps = {
  variant?: LoadingSequenceVariant;
  /** Seconds for the complete introductory sequence, not a network timeout. */
  duration?: number;
  playing?: boolean;
  /** Change this value to restart from the first frame. */
  replayKey?: string | number;
  brand?: string;
  headline?: string;
  logo?: ReactNode;
  /** Optional artwork behind the loading mark, e.g. an image or muted video. */
  backdrop?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
};

const durations: Record<LoadingSequenceVariant, number> = { typography: 3.2, aperture: 4.6, wordmark: 8.7, curtain: 4.5 };



/** A decorative page intro. Content stays mounted and becomes interactive only
 * after the reveal. Data fetching and readiness belong to the consuming app. */
export function LoadingSequence({ variant = "typography", duration, replayKey = 0, ...props }: LoadingSequenceProps) {
  const seconds = duration !== undefined && Number.isFinite(duration) ? Math.min(30, Math.max(.5, duration)) : durations[variant];
  // Remount only the timeline on replay/variant changes; pause keeps its position.
  return <SequenceRun key={`${variant}:${replayKey}:${seconds}`} {...props} variant={variant} seconds={seconds} />;
}

function SequenceRun({ variant, seconds, playing = true, brand = "OREO", headline = "Crafting Websites\nthat Feel Good", logo, backdrop, children, className, style, onComplete }: Omit<LoadingSequenceProps, "variant" | "duration" | "replayKey"> & { variant: LoadingSequenceVariant; seconds: number }) {
  const [complete, setComplete] = useState(false);
  const completed = useRef(false);
  const lines = headline.split("\n");
  const words = lines.map(line => line.split(/\s+/).filter(Boolean));
  const wordCount = Math.max(1, words.flat().length);
  let wordIndex = 0;
  return <div className={cn("oreo-loading-sequence", className)} data-variant={variant} data-playing={playing} data-complete={complete}
    style={{ "--loading-duration": `${seconds}s`, ...style } as CSSProperties}>
    <span className="sr-only" role="status">{complete ? "Content ready" : "Introducing content"}</span>
    <div className="ols-content" inert={!complete} aria-hidden={!complete}>{children}</div>
    <div className="ols-intro" aria-hidden="true">
      <div className="ols-backdrop">{backdrop}</div>
      {variant === "typography" && <div className="ols-heading"><div>{words.map((line, l) => <div key={l} className="ols-line">{line.map((word, w) => {
        const index = wordIndex++;
        return <span className="ols-word" key={`${l}-${w}`} style={{ "--word-delay": `${index / wordCount * seconds * .13}s` } as CSSProperties}>{word}{w < line.length - 1 ? "\u00a0" : ""}</span>;
      })}</div>)}</div></div>}
      {variant === "aperture" && <div className="ols-loader"><span className="ols-spinner" /><span className="ols-loading-label">Loading</span></div>}
      {variant === "wordmark" && <div className="ols-brand" aria-label={brand}>{Array.from(brand).map((letter, i, letters) => <span key={i} style={{ "--letter-delay": `${i / Math.max(1, letters.length) * seconds * .16}s` } as CSSProperties}>{letter === " " ? "\u00a0" : letter}</span>)}</div>}
      {variant === "curtain" && <div className="ols-curtain"><div className="ols-mark">{logo ?? <LoadingMark />}</div></div>}
    </div>
    <span className="ols-clock" aria-hidden="true" onAnimationEnd={event => {
      if (event.target !== event.currentTarget || event.animationName !== "ols-clock" || completed.current) return;
      completed.current = true;
      setComplete(true);
      onComplete?.();
    }} />
  </div>;
}

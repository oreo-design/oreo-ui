import { type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { clampProgress, sheetFrame } from "./model";
import "./motion-code.css";
export type SheetTimelineProps = { progress?: number; guides?: boolean; className?: string; label?: string };

/** Decorative diagram; the host's scrubber owns input and progress semantics. */
export function SheetTimeline({ progress = 60, guides = true, className, label = "Bottom sheet motion preview" }: SheetTimelineProps) {
  const bounded = clampProgress(progress);
  const frame = sheetFrame(bounded);
  return <figure className={cn("oreo-sheet-timeline", className)} aria-label={`${label}: ${Math.round(bounded)} percent`}>
    <div className="oreo-sheet-timeline__drawing" aria-hidden="true">
      {guides && <div className="oreo-sheet-timeline__axis"><i style={{ transform: `translateY(${bounded / 100 * 252}px)` }} /></div>}
      <div className="oreo-sheet-timeline__phone oreo-squircle">
        <div className="oreo-sheet-timeline__content">{[1, 1, .65, 1, 1, .65].map((width, index) => <i key={index} style={{ width: `${width * 100}%` }} />)}</div>
        {guides && <div className="oreo-sheet-timeline__rest" />}
        <div className="oreo-sheet-timeline__sheet oreo-squircle" style={{ transform: `translateY(${frame.translate}%)`, opacity: frame.opacity, "--sheet-opacity": frame.opacity } as CSSProperties}>
          <i className="oreo-sheet-timeline__handle" /><div className="oreo-sheet-timeline__copy"><i /><i /><i /></div>
        </div>
      </div>
      {guides && <i className="oreo-sheet-timeline__tick" style={{ transform: `translateY(${252 + frame.translate * 2.52}px)`, opacity: frame.opacity }} />}
    </div>
    <figcaption className="sr-only">Illustration only. At 0% the sheet is below the viewport; at 60% it overshoots by 4%; at 100% it rests in place.</figcaption>
  </figure>;
}

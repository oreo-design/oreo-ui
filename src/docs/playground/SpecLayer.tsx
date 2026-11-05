import type { CSSProperties } from "react";
import type { Callout } from "./spec";
import type { Prediction, ToneStatus } from "./PreviewStage";

/**
 * Spacing redlines drawn over the preview: a hatched band for each measured
 * distance, dashed guides at its edges, a dimension bracket and a value badge.
 * Positions follow the live layout every frame; only tone, lane and entrance animate.
 */
export function SpecLayer({ subject, callouts, predicted }: {
  subject: string;
  callouts: (Callout & { status: ToneStatus; side: "start" | "end" | "inside" })[];
  predicted: Prediction | null;
}) {
  return <div className="pg-spec-layer" aria-hidden="true">
    {callouts.map(c => {
      // While a transition runs, tone and badge lane already target its end state.
      const destination = predicted?.[c.id];
      const status = destination?.status ?? c.status;
      const along = c.axis === "x" ? c.band.top : c.band.left;
      const style = {
        left: c.band.left,
        top: c.band.top,
        width: c.band.right - c.band.left,
        height: c.band.bottom - c.band.top,
        "--lane": destination?.lane ?? c.lane,
        "--focus-start": `${Math.max(0, c.focus[0] - along)}px`,
        "--focus-size": `${Math.max(0, c.focus[1] - c.focus[0])}px`,
      } as CSSProperties;
      return <div key={`${subject}:${c.id}`} className="pg-spec-callout" data-axis={c.axis} data-side={c.side} data-scale={status} style={style}>
        <span className="pg-spec-fill" />
        <span className="pg-spec-focus" />
        <span className="pg-spec-guides" />
        <span className="pg-spec-bracket" />
        <span className="pg-spec-badge">{Math.round(c.value)}</span>
      </div>;
    })}
  </div>;
}

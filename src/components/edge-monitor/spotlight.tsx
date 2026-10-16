import { useId } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import type { EdgeRegion, LatencySample } from "./index";
const compact = (n: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
export function RegionSpotlight({
  region,
  samples = [],
}: {
  region: EdgeRegion;
  samples?: LatencySample[];
}) {
  const id = useId();
  const points = samples.filter((p) => Number.isFinite(p.p95) && p.p95 >= 0);
  const max = Math.max(1, ...points.map((p) => p.p95));
  const path = points
    .map(
      (p, i) =>
        `${i ? "L" : "M"}${8 + (i / Math.max(1, points.length - 1)) * 224},${52 - (p.p95 / max) * 42}`,
    )
    .join(" ");
  return (
    <section
      className="edge-region-detail edge-spotlight"
      aria-live="polite"
      aria-label={`${region.city} region details`}
    >
      <header>
        <span
          className="edge-health"
          data-elevated={region.latency >= 80 || undefined}
        />
        <strong>{region.city}</strong>
        <span className="edge-spotlight-code">{region.id} · p95</span>
      </header>
      {points.length > 1 && (
        <svg viewBox="0 0 240 60" role="img" aria-labelledby={id}>
          <title id={id}>
            {region.city} p95 sample trend; peak {max} milliseconds
          </title>
          <path
            d={path}
            fill="none"
            stroke={
              region.latency >= 80
                ? "var(--color-status-error)"
                : "var(--color-text-secondary)"
            }
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <dl>
        <div>
          <dt>p95 latency</dt>
          <dd data-elevated={region.latency >= 80 || undefined}>
            {region.latency}
            <small> ms</small>
          </dd>
        </div>
        <div>
          <dt>Requests / s</dt>
          <dd>{compact(region.requests)}</dd>
        </div>
        <div>
          <dt>5xx errors</dt>
          <dd>
            {region.errors.toFixed(2)}
            <small>%</small>
          </dd>
        </div>
      </dl>
    </section>
  );
}
export function IncidentRecommendation({
  source,
  baseline,
  target,
  headroom,
  share = 30,
  onReview,
  onTrace,
}: {
  source: EdgeRegion;
  baseline: number;
  target: EdgeRegion;
  headroom: number;
  share?: number;
  onReview?: () => void;
  onTrace?: () => void;
}) {
  const baselineValid = Number.isFinite(baseline) && baseline > 0;
  return (
    <section className="edge-advice" aria-label="Incident recommendation">
      <h3>
        <Icon name="warning-circle" size="sm" />
        {source.id} p95{" "}
        {baselineValid
          ? `is ${(source.latency / baseline).toFixed(1)}× its baseline`
          : "is elevated"}
      </h3>
      <p>
        {source.city} · {source.latency} ms. {target.id} has {headroom}% sample
        headroom. Review capacity before changing routing.
      </p>
      <div>
        {onReview && (
          <Button size="sm" type="secondary" tapScale={1} onClick={onReview}>
            Review {share}% shift to {target.id}
          </Button>
        )}
        {onTrace && (
          <Button size="sm" type="tertiary" tapScale={1} onClick={onTrace}>
            Open trace
          </Button>
        )}
      </div>
    </section>
  );
}

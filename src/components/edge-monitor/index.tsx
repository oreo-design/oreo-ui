import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";
import { ActivityBars, type ActivityBar } from "@/components/activity";
import { Avatar } from "@/components/avatar";
import { AgentWorkspaceState } from "@/components/automation";
import "./edge-monitor.css";
import { MonitorReveal } from "@/components/monitor-reveal";
import { RegionSpotlight } from "./spotlight";
export { RegionSpotlight, IncidentRecommendation } from "./spotlight";

export type EdgeRegion = {
  id: string;
  city: string;
  x: number;
  y: number;
  requests: number;
  latency: number;
  errors: number;
};
export type LatencySample = {
  label: string;
  p50: number;
  p95: number;
  p99: number;
};
export type DeploymentEntry = {
  id: string;
  title: string;
  hash: string;
  author: string;
  time: string;
  status: "ready" | "attention";
};
export const compactNumber = (n: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
export function MonitorPanel({
  title,
  icon,
  detail,
  action,
  children,
  className = "",
}: {
  title: string;
  icon: IconName;
  detail?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section className={`edge-panel ${className}`} aria-labelledby={id}>
      <header className="edge-panel-header">
        <span className="edge-panel-icon">
          <Icon name={icon} size="sm" />
        </span>
        <h2 id={id}>{title}</h2>
        {detail && <span className="edge-panel-detail">{detail}</span>}
        <div className="ml-auto">{action}</div>
      </header>
      {children}
    </section>
  );
}
export function EdgeMetric({
  label,
  value,
  unit,
  detail,
  warning,
  icon,
  bars,
}: {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  warning?: boolean;
  icon: IconName;
  bars: ActivityBar[];
}) {
  return (
    <div className="edge-metric">
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Icon name={icon} size="sm" />
        {label}
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
        <span className="ml-0.5 text-sm font-normal text-text-tertiary">
          {unit}
        </span>
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p
          className={`text-xs ${warning ? "text-status-error" : "text-text-secondary"}`}
        >
          {detail}
        </p>
        <div className="edge-sparkbars">
          <ActivityBars values={bars} label={`${label} trend`} tone="neutral" />
        </div>
      </div>
    </div>
  );
}

// Original schematic continent silhouettes, not a geographic boundary dataset.
const LAND =
  "M55 77L82 48L124 36L150 53L179 48L206 72L188 99L165 110L150 140L120 147L105 174L85 156L82 129L60 112Z M145 169L170 172L188 199L212 215L200 246L184 272L165 286L157 256L145 231L138 199Z M205 35L229 23L255 30L249 57L226 67L210 53Z M290 82L307 65L330 69L340 88L329 110L307 115L291 102Z M298 119L333 113L357 135L369 164L352 187L341 222L318 230L301 202L283 174L282 145Z M337 72L367 48L407 41L445 53L475 47L513 67L542 80L527 105L500 113L481 141L463 150L456 176L439 168L428 145L407 153L395 137L378 129L362 105L341 99Z M442 180L453 184L461 200L479 210L465 220L452 210Z M477 227L504 213L531 222L550 246L538 269L505 274L481 254Z M550 283L558 275L566 292L558 309Z";
export function RegionTrafficMap({
  regions,
  selected,
  onSelect,
  detailPlacement = "below",
  samples,
  reveal = 0,
}: {
  regions: EdgeRegion[];
  selected?: string;
  onSelect: (id: string) => void;
  detailPlacement?: "below" | "overlay";
  samples?: LatencySample[];
  reveal?: number;
}) {
  const id = useId().replace(/:/g, "");
  const region = regions.find((r) => r.id === selected);
  if (!regions.length)
    return (
      <AgentWorkspaceState
        title="No regions connected"
        description="Add a region to see its traffic and latency here."
      />
    );
  return (
    <div className="edge-map-block" data-placement={detailPlacement}>
      <MonitorReveal play={reveal} delay={50}>
        <div className="edge-map" role="group" aria-label="Traffic region map">
          <svg viewBox="0 0 600 330" aria-hidden="true">
            <defs>
              <pattern
                id={`${id}-dots`}
                width="5"
                height="5"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="2.5"
                  cy="2.5"
                  r=".9"
                  fill="var(--color-text-tertiary)"
                />
              </pattern>
            </defs>
            <path d={LAND} fill={`url(#${id}-dots)`} opacity=".5" />
            {regions
              .filter((r) => r.id !== (selected ?? regions[0].id))
              .map((r) => {
                const start = region ?? regions[0];
                return (
                  <path
                    key={r.id}
                    d={`M${start.x * 6},${start.y * 3.3} Q${(start.x + r.x) * 3},${Math.min(start.y, r.y) * 3.3 - 45} ${r.x * 6},${r.y * 3.3}`}
                    stroke="var(--color-border-default)"
                    strokeWidth="1"
                    fill="none"
                  />
                );
              })}
          </svg>
          {regions.map((r) => (
            <button
              key={r.id}
              type="button"
              className="edge-map-point"
              data-elevated={r.latency >= 80 || undefined}
              aria-label={`${r.city}, ${r.id}, ${r.latency} milliseconds${r.latency >= 80 ? ", elevated" : ""}`}
              aria-pressed={selected === r.id}
              onClick={() => onSelect(r.id)}
              style={{
                left: `${Math.max(4, Math.min(96, r.x))}%`,
                top: `${Math.max(5, Math.min(95, r.y))}%`,
              }}
            >
              <span className="edge-map-dot" />
              <span className="edge-map-tag">
                <b>{r.id}</b> {compactNumber(r.requests)}
              </span>
            </button>
          ))}
        </div>
      </MonitorReveal>
      {region ? (
        <MonitorReveal
          play={reveal}
          delay={150}
          className="edge-spotlight-slot"
        >
          <RegionSpotlight region={region} samples={samples} />
        </MonitorReveal>
      ) : (
        <p className="edge-map-hint">
          Select a region to inspect its traffic. Locations are schematic.
        </p>
      )}
    </div>
  );
}
export function RegionHealthList({
  regions,
  selected,
  onSelect,
}: {
  regions: EdgeRegion[];
  selected?: string;
  onSelect: (id: string) => void;
}) {
  if (!regions.length)
    return (
      <AgentWorkspaceState
        title="No regional data"
        description="Regional health will appear when traffic is available."
      />
    );
  const highest = Math.max(1, ...regions.map((r) => r.requests));
  return (
    <ul className="edge-region-list">
      {regions.map((r) => (
        <li key={r.id}>
          <button
            type="button"
            onClick={() => onSelect(r.id)}
            aria-pressed={selected === r.id}
            data-elevated={r.latency >= 80 || undefined}
          >
            <span className="font-mono text-xs text-text-tertiary">{r.id}</span>
            <span className="min-w-0 truncate">{r.city}</span>
            <span className="edge-region-volume" aria-hidden="true">
              <i style={{ width: `${(r.requests / highest) * 100}%` }} />
            </span>
            <span className="text-right tabular-nums">
              {r.latency}
              <small className="ml-1 text-text-tertiary">ms</small>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
export function LatencyChart({
  samples,
  label = "All regions",
  reveal = 0,
}: {
  samples: LatencySample[];
  label?: string;
  reveal?: number;
}) {
  const id = useId().replace(/:/g, "");
  const data = samples.filter((p) =>
    [p.p50, p.p95, p.p99].every((v) => Number.isFinite(v) && v >= 0),
  );
  const [cursor, setCursor] = useState<number | null>(null);
  const figure = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(900);
  useEffect(() => {
    if (!figure.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(280, entry.contentRect.width)),
    );
    observer.observe(figure.current);
    return () => observer.disconnect();
  }, [data.length]);
  if (!data.length)
    return (
      <AgentWorkspaceState
        title="No latency samples"
        description="Choose a period with recorded requests to inspect latency."
      />
    );
  const selected = Math.min(cursor ?? data.length - 1, data.length - 1),
    point = data[selected];
  const max = Math.max(
    50,
    Math.ceil(
      Math.max(...data.map((p) => Math.max(p.p50, p.p95, p.p99))) / 50,
    ) * 50,
  );
  const x = (i: number) =>
    20 + (i / Math.max(1, data.length - 1)) * (width - 65);
  const y = (n: number) => 170 - (n / max) * 140;
  const path = (key: "p50" | "p95" | "p99") =>
    data.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[key])}`).join(" ");
  const peakIndex = data.reduce(
    (best, p, i) => (p.p95 > data[best].p95 ? i : best),
    0,
  );
  return (
    <figure ref={figure} className="edge-latency">
      <MonitorReveal play={reveal} delay={100} variant="wipe">
        <svg
          viewBox={`0 0 ${width} 205`}
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
        >
          <title id={`${id}-title`}>{label} latency</title>
          <desc id={`${id}-desc`}>
            p50, p95 and p99 latency in milliseconds. Highest p95:{" "}
            {data[peakIndex].p95} ms at {data[peakIndex].label}.
          </desc>
          <defs>
            <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="var(--color-status-error)" stopOpacity=".18" />
              <stop
                offset="1"
                stopColor="var(--color-status-error)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          {[0, 0.5, 1].map((n) => (
            <g key={n}>
              <line
                x1="20"
                x2={width - 45}
                y1={y(max * n)}
                y2={y(max * n)}
                stroke="var(--color-border-subtle)"
              />
              <text x={width - 32} y={y(max * n) + 4}>
                {max * n}
              </text>
            </g>
          ))}
          {data[peakIndex].p95 >= 80 && (
            <rect
              x={Math.max(20, x(peakIndex) - 32)}
              y="25"
              width="64"
              height="145"
              fill="var(--color-status-error)"
              opacity=".06"
            />
          )}
          <path
            d={`${path("p95")} L${x(data.length - 1)},170 L20,170 Z`}
            fill={`url(#${id}-fill)`}
          />
          <path
            d={path("p99")}
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeDasharray="3 4"
          />
          <path
            d={path("p50")}
            fill="none"
            stroke="var(--color-text-tertiary)"
          />
          <path
            d={path("p95")}
            fill="none"
            stroke={
              data[peakIndex].p95 >= 80
                ? "var(--color-status-error)"
                : "var(--color-text-primary)"
            }
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1={x(selected)}
            x2={x(selected)}
            y1="25"
            y2="170"
            stroke="var(--color-border-default)"
            strokeDasharray="2 4"
          />
          <circle
            cx={x(selected)}
            cy={y(point.p95)}
            r="3"
            fill="var(--color-text-primary)"
          />
          {[0, Math.floor((data.length - 1) / 2), data.length - 1]
            .filter((n, i, a) => a.indexOf(n) === i)
            .map((i) => (
              <text
                key={i}
                x={x(i)}
                y="196"
                textAnchor={
                  i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
                }
              >
                {data[i].label}
              </text>
            ))}
        </svg>
      </MonitorReveal>
      <figcaption>
        <label>
          <span className="sr-only">Inspect latency sample</span>
          <input
            type="range"
            min="0"
            max={data.length - 1}
            value={selected}
            onChange={(e) => setCursor(Number(e.target.value))}
            aria-valuetext={`${point.label}, p95 ${point.p95} milliseconds`}
          />
          <output>{point.label}</output>
        </label>
        <span className="edge-latency-values">
          <span>
            p50 <b>{point.p50} ms</b>
          </span>
          <span>
            p95 <b>{point.p95} ms</b>
          </span>
          <span>
            p99 <b>{point.p99} ms</b>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
export function DeploymentFeed({
  entries,
  onSelect,
}: {
  entries: DeploymentEntry[];
  onSelect?: (entry: DeploymentEntry) => void;
}) {
  if (!entries.length)
    return (
      <AgentWorkspaceState
        title="No deployments yet"
        description="Deployments will appear here when your project has a release."
      />
    );
  return (
    <ul className="edge-deployments">
      {entries.map((entry) => (
        <li key={entry.id}>
          {onSelect ? (
            <button type="button" onClick={() => onSelect(entry)}>
              <DeploymentContent entry={entry} />
            </button>
          ) : (
            <div>
              <DeploymentContent entry={entry} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
function DeploymentContent({ entry }: { entry: DeploymentEntry }) {
  return (
    <>
      <span
        className="edge-health"
        data-elevated={entry.status === "attention" || undefined}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-5">{entry.title}</p>
        <p className="mt-1 font-mono text-xs text-text-tertiary">
          #{entry.id} · main · {entry.hash}
          <span className="sr-only"> · {entry.status}</span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Avatar name={entry.author} size="xs" />
        <span className="text-xs text-text-tertiary">{entry.time}</span>
      </div>
    </>
  );
}

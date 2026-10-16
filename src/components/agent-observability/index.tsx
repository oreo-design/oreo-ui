import { useId, useRef, useState, type CSSProperties } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { AgentWorkspaceState } from "@/components/automation";
import {
  successRate,
  validTelemetry,
  type AgentTelemetry,
  type HealthSort,
  type InferencePoint,
  type TrafficRegion,
} from "./model";
import "./observability.css";
export * from "./model";
const count = (value: number) => value.toLocaleString("en-US");
export function PixelMeter({
  value,
  max = 100,
  label = "Usage",
  tone = "success",
  showValue = true,
}: {
  value: number;
  max?: number;
  label?: string;
  tone?: "success" | "warning" | "neutral";
  showValue?: boolean;
}) {
  const valid =
      Number.isFinite(value) && value >= 0 && Number.isFinite(max) && max > 0,
    ratio = valid ? Math.min(value / max, 1) : 0,
    percent = valid ? `${((value / max) * 100).toFixed(1)}%` : "Unknown";
  return (
    <span className="ao-pixel-meter" data-tone={tone}>
      <svg
        viewBox="0 0 200 18"
        role={valid ? "meter" : "img"}
        aria-label={valid ? label : `${label}: Unknown`}
        aria-valuemin={valid ? 0 : undefined}
        aria-valuemax={valid ? max : undefined}
        aria-valuenow={valid ? Math.min(value, max) : undefined}
        aria-valuetext={
          valid
            ? `${count(value)} of ${count(max)} · ${percent}${value > max ? " · Over limit" : ""}`
            : "Unknown"
        }
      >
        <title>
          {label}: {percent}
        </title>
        {Array.from({ length: 160 }, (_, i) => (
          <rect
            key={i}
            x={Math.floor(i / 4) * 5}
            y={(i % 4) * 4.5}
            width="3"
            height="3"
            fill={
              i < Math.round(ratio * 160)
                ? "currentColor"
                : "var(--color-border-subtle)"
            }
          />
        ))}
      </svg>
      {showValue && <span className="ao-meter-number">{percent}</span>}
    </span>
  );
}
export function InferenceChart({
  points,
  label = "Inference calls",
  loading = false,
  error,
  onRetry,
}: {
  points: InferencePoint[];
  label?: string;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  const id = useId(),
    [index, setIndex] = useState(0);
  const selected = Math.min(index, Math.max(0, points.length - 1)),
    valid = points.every((p) => Number.isSafeInteger(p.value) && p.value >= 0),
    max = Math.max(1, ...points.map((p) => p.value)),
    ceiling = Math.max(
      4,
      Math.ceil(max / 4 / 10 ** Math.floor(Math.log10(max / 4))) *
        4 *
        10 ** Math.floor(Math.log10(max / 4)),
    );
  const x = (i: number) => 40 + (i / Math.max(1, points.length - 1)) * 500,
    y = (v: number) => 206 - (v / ceiling) * 184;
  if (error || !valid)
    return (
      <AgentWorkspaceState
        error
        title="Inference data unavailable"
        description={
          error ?? "Each bucket needs a finite, non-negative integer count."
        }
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  if (loading && !points.length)
    return (
      <div
        className="ao-chart-skeleton"
        aria-busy="true"
        aria-label="Loading inference calls"
      />
    );
  if (!points.length)
    return (
      <AgentWorkspaceState
        title="No inference calls"
        description="Choose a period with recorded traffic."
        actionLabel="Reset period"
        onAction={onRetry}
      />
    );
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(" "),
    point = points[selected];
  const dots = [];
  for (let c = 0; c < (points.length > 1 ? 100 : 0); c++) {
    const pos = (c / 99) * (points.length - 1),
      a = Math.floor(pos),
      b = Math.min(points.length - 1, a + 1),
      height =
        points[a].value + (points[b].value - points[a].value) * (pos - a);
    for (let r = 0; r < 36; r++) {
      const py = 204 - r * 5;
      if (py >= y(height) && (c * 17 + r * 13) % 19 < 8 + r / 3)
        dots.push(
          <rect key={`${c}-${r}`} x={40 + c * 5} y={py} width="3" height="3" />,
        );
    }
  }
  return (
    <figure
      className="ao-inference"
      aria-labelledby={id}
      aria-busy={loading || undefined}
    >
      <figcaption id={id} className="sr-only">
        {label}
      </figcaption>
      <svg
        viewBox="0 0 560 240"
        role="img"
        aria-label={`${label}; ${count(points.reduce((s, p) => s + p.value, 0))} total. Zero baseline. Exact bucket values below.`}
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          setIndex(
            Math.max(
              0,
              Math.min(
                points.length - 1,
                Math.round(
                  ((((e.clientX - box.left) / box.width) * 560 - 40) / 500) *
                    (points.length - 1),
                ),
              ),
            ),
          );
        }}
      >
        <g className="ao-axis">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line x1="40" x2="540" y1={y(ceiling * t)} y2={y(ceiling * t)} />
              <text x="32" y={y(ceiling * t) + 3} textAnchor="end">
                {new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(ceiling * t)}
              </text>
            </g>
          ))}
        </g>
        <g className="ao-chart-dots">{dots}</g>
        <polyline
          points={line}
          fill="none"
          stroke="var(--color-status-success)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={x(selected)}
          x2={x(selected)}
          y1="16"
          y2="206"
          stroke="var(--color-border-default)"
          strokeDasharray="3 4"
        />
        <circle
          cx={x(selected)}
          cy={y(point.value)}
          r="4"
          fill="var(--color-bg-base)"
          stroke="var(--color-status-success)"
          strokeWidth="2"
        />
        <g className="ao-axis">
          {points
            .filter(
              (_, i) =>
                i === 0 ||
                i === points.length - 1 ||
                i === Math.floor(points.length / 2),
            )
            .map((p) => (
              <text
                key={p.label}
                x={x(points.indexOf(p))}
                y="230"
                textAnchor="middle"
              >
                {p.label}
              </text>
            ))}
        </g>
      </svg>
      <div className="ao-chart-inspector">
        <label htmlFor={`${id}-bucket`} className="sr-only">
          Inspect inference bucket
        </label>
        <select
          id={`${id}-bucket`}
          value={selected}
          onChange={(e) => setIndex(Number(e.target.value))}
        >
          {points.map((p, i) => (
            <option key={`${p.label}-${i}`} value={i}>
              {p.label}
            </option>
          ))}
        </select>
        <output>
          {count(point.value)} <span>calls</span>
        </output>
      </div>
      <details className="ao-data">
        <summary>View exact values</summary>
        <table>
          <caption className="sr-only">{label} by bucket</caption>
          <thead>
            <tr>
              <th>Bucket</th>
              <th>Calls</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={i}>
                <th scope="row">{p.label}</th>
                <td>{count(p.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
// Schematic continent silhouettes. Marker locations are illustrative, never routing or boundary data.
const LAND = [
  [
    [5, 17],
    [13, 9],
    [25, 11],
    [32, 18],
    [34, 28],
    [29, 34],
    [30, 43],
    [24, 48],
    [22, 56],
    [18, 48],
    [15, 36],
    [9, 34],
  ],
  [
    [30, 52],
    [38, 55],
    [42, 65],
    [38, 76],
    [33, 91],
    [29, 84],
    [29, 69],
    [25, 58],
  ],
  [
    [39, 7],
    [46, 6],
    [44, 17],
    [38, 20],
  ],
  [
    [46, 22],
    [52, 16],
    [59, 20],
    [58, 30],
    [51, 35],
    [45, 30],
  ],
  [
    [46, 36],
    [57, 35],
    [62, 45],
    [58, 62],
    [52, 73],
    [47, 59],
    [43, 46],
  ],
  [
    [57, 18],
    [67, 10],
    [85, 12],
    [94, 21],
    [90, 33],
    [82, 35],
    [78, 46],
    [72, 51],
    [67, 39],
    [61, 35],
  ],
  [
    [76, 55],
    [82, 59],
    [86, 63],
    [79, 65],
  ],
  [
    [81, 70],
    [89, 65],
    [96, 75],
    [93, 85],
    [83, 85],
    [79, 78],
  ],
  [
    [64, 65],
    [65, 71],
    [63, 76],
    [62, 70],
  ],
];
function inside(x: number, y: number, poly: number[][]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i],
      [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      hit = !hit;
  }
  return hit;
}
const WORLD = Array.from({ length: 2400 }, (_, i) => ({
  x: (i % 80) * 1.25,
  y: Math.floor(i / 80) * 3,
})).filter((p) => LAND.some((poly) => inside(p.x, p.y, poly)));
export function RegionalTraffic({
  regions,
  value,
  onValueChange,
}: {
  regions: TrafficRegion[];
  value?: string;
  onValueChange?: (id: string) => void;
}) {
  const id = useId(),
    selected = regions.find((r) => r.id === value),
    valid = regions.every(
      (r) =>
        Number.isSafeInteger(r.requests) &&
        r.requests >= 0 &&
        Number.isFinite(r.latency) &&
        r.latency >= 0 &&
        Number.isFinite(r.x) &&
        r.x >= 0 &&
        r.x <= 100 &&
        Number.isFinite(r.y) &&
        r.y >= 0 &&
        r.y <= 100,
    );
  if (!valid)
    return (
      <AgentWorkspaceState
        error
        title="Regional data unavailable"
        description="Check counts, latency and marker coordinates."
      />
    );
  if (!regions.length)
    return (
      <AgentWorkspaceState
        title="No regional traffic"
        description="Regions will appear when traffic is available."
      />
    );
  return (
    <div className="ao-regional">
      <div className="ao-world">
        <svg viewBox="0 0 500 260" aria-hidden="true">
          {WORLD.map((p, i) => (
            <rect
              key={i}
              x={p.x * 5}
              y={p.y * 2.6}
              width="3"
              height="3"
              fill="currentColor"
            />
          ))}
        </svg>
        {regions.map((r) => (
          <button
            key={r.id}
            type="button"
            className="ao-region-point"
            style={{ left: `${r.x}%`, top: `${r.y}%` } as CSSProperties}
            aria-label={`${r.label}: ${count(r.requests)} calls, ${r.latency} ms mean agent p95`}
            aria-pressed={r.id === value}
            disabled={!onValueChange}
            onClick={() => onValueChange?.(r.id === value ? "all" : r.id)}
          >
            <span />
          </button>
        ))}
      </div>
      <div className="ao-region-caption" id={id}>
        <span>{selected ? `${selected.label} selected` : "All regions"}</span>
        <span>Schematic locations</span>
      </div>
      <div className="ao-region-list">
        {regions.map((r) => (
          <button
            type="button"
            key={r.id}
            disabled={!onValueChange}
            aria-pressed={r.id === value}
            onClick={() => onValueChange?.(r.id === value ? "all" : r.id)}
          >
            <span>{r.id}</span>
            <strong>{count(r.requests)}</strong>
            <span>{r.latency} ms</span>
          </button>
        ))}
      </div>
    </div>
  );
}
const statusTone = {
  Healthy: "mint",
  Paused: "default",
  Deploying: "blue",
  Degraded: "orange",
} as const;
export function AgentHealthTable({
  agents,
  sort,
  onSort,
  onOpen,
  onToggle,
  loading = false,
  error,
  filtered = false,
  onReset,
}: {
  agents: AgentTelemetry[];
  sort?: HealthSort;
  onSort?: (sort: HealthSort) => void;
  onOpen?: (agent: AgentTelemetry) => void;
  onToggle?: (agent: AgentTelemetry) => void;
  loading?: boolean;
  error?: string;
  filtered?: boolean;
  onReset?: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  if (error || agents.some((a) => !validTelemetry(a)))
    return (
      <AgentWorkspaceState
        error
        title="Agent health unavailable"
        description={
          error ?? "Check request counts, successes, costs and latency."
        }
        actionLabel="Try again"
        onAction={onReset}
      />
    );
  if (loading && !agents.length)
    return (
      <div
        className="ao-table-skeleton"
        aria-busy="true"
        aria-label="Loading agent health"
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} />
        ))}
      </div>
    );
  if (!agents.length)
    return (
      <AgentWorkspaceState
        title={filtered ? "No matching agents" : "No agents yet"}
        description={
          filtered
            ? "Try a different name, status or region."
            : "Agent health appears here once agents report traffic."
        }
        actionLabel={filtered ? "Clear filters" : undefined}
        onAction={filtered ? onReset : undefined}
      />
    );
  const th = (title: string, key: HealthSort["key"]) => (
    <th
      scope="col"
      aria-sort={
        sort?.key === key
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      {onSort ? (
        <Button
          type="tertiary"
          size="sm"
          tapScale={1}
          onClick={() =>
            onSort({
              key,
              direction:
                sort?.key === key && sort.direction === "asc" ? "desc" : "asc",
            })
          }
        >
          {title}
          {sort?.key === key ? (
            <span aria-hidden>{sort.direction === "asc" ? " ↑" : " ↓"}</span>
          ) : null}
        </Button>
      ) : (
        title
      )}
    </th>
  );
  return (
    <div
      ref={root}
      className="ao-health-scroll"
      role="region"
      aria-label="Agent health table"
      tabIndex={0}
      aria-busy={loading || undefined}
    >
      <table className="ao-health-table">
        <caption className="sr-only">
          Agent telemetry. Success is successful requests divided by requests;
          costs are USD per 1,000 calls; latency is the agent p95 in
          milliseconds.
        </caption>
        <thead>
          <tr>
            {th("Agent", "name")}
            <th scope="col">Role / Region</th>
            {th("Status", "status")}
            {th("Success", "success")}
            {th("Cost / 1K", "costPer1k")}
            {th("p95", "p95ms")}
            {(onOpen || onToggle) && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.id}>
              <th scope="row">
                {onOpen ? (
                  <button className="ao-agent-name" onClick={() => onOpen(a)}>
                    <Avatar name={a.name} size="xs" aria-hidden />
                    <span>{a.name}</span>
                  </button>
                ) : (
                  <span className="ao-agent-name">
                    <Avatar name={a.name} size="xs" aria-hidden />
                    {a.name}
                  </span>
                )}
              </th>
              <td>
                {a.role}
                <small>{a.region}</small>
              </td>
              <td>
                <Tag color={statusTone[a.status]}>{a.status}</Tag>
              </td>
              <td>
                <PixelMeter
                  value={a.requests ? successRate(a) : NaN}
                  label={`${a.name} success`}
                  tone={successRate(a) < 90 ? "warning" : "success"}
                />
              </td>
              <td className="font-mono">${a.costPer1k.toFixed(4)}</td>
              <td className="font-mono">{count(a.p95ms)} ms</td>
              {(onOpen || onToggle) && (
                <td>
                  <Menu>
                    <MenuTrigger
                      render={
                        <IconButton
                          type="tertiary"
                          size="sm"
                          icon={<Icon name="ellipsis" />}
                          aria-label={`Actions for ${a.name}`}
                        />
                      }
                    />
                    <MenuPopup align="end" container={root}>
                      {onOpen && (
                        <MenuItem
                          icon={<Icon name="info" />}
                          onClick={() => onOpen(a)}
                        >
                          View details
                        </MenuItem>
                      )}
                      {onToggle && (
                        <MenuItem
                          icon={
                            <Icon
                              name={
                                a.status === "Paused" ? "refresh" : "prohibit"
                              }
                            />
                          }
                          onClick={() => onToggle(a)}
                        >
                          {a.status === "Paused"
                            ? "Resume agent"
                            : "Pause agent"}
                        </MenuItem>
                      )}
                    </MenuPopup>
                  </Menu>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

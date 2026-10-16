import { useId, useState, type ReactNode } from "react";
import { Icon } from "@/components/icon";
import { BalanceSparkBars } from "@/components/finance-overview";
import { PixelMeter } from "@/components/agent-observability";
import { AgentWorkspaceState } from "@/components/automation";
import {
  validSeries,
  chartCeiling,
  metricNumber,
  type ChartPoint,
  type Channel,
} from "./model";
import "./dashboard-suite.css";
export * from "./model";
export function DashboardStatCard({
  label,
  value,
  change,
  comparison = "vs previous period",
  variant = "footer",
  trend,
  icon,
}: {
  label: string;
  value: string;
  change: number | null;
  comparison?: string;
  variant?: "footer" | "header" | "plain";
  trend?: number[];
  icon?: ReactNode;
}) {
  const valid = change !== null && Number.isFinite(change);
  return (
    <article className="ds-stat" data-variant={variant}>
      <header>
        {icon}
        <h3>{label}</h3>
      </header>
      <div className="ds-stat-value">
        <strong>{value}</strong>
        {trend && <BalanceSparkBars values={trend} label={`${label} trend`} />}
      </div>
      <p>
        <span
          data-direction={
            !valid
              ? "unknown"
              : change! > 0
                ? "up"
                : change! < 0
                  ? "down"
                  : "flat"
          }
        >
          {valid ? (
            <>
              {change !== 0 && (
                <Icon
                  name={change! < 0 ? "arrow-down" : "arrow-up"}
                  size="sm"
                />
              )}
              {Math.abs(change!).toFixed(1)}%
            </>
          ) : (
            "—"
          )}
        </span>{" "}
        {valid ? comparison : "No prior comparison"}
      </p>
    </article>
  );
}
function DataTable({
  points,
  series,
  unit,
}: {
  points: ChartPoint[];
  series: string[];
  unit: string;
}) {
  return (
    <details className="ds-exact">
      <summary>View exact values</summary>
      <div tabIndex={0} role="region" aria-label="Chart data">
        <table>
          <caption>Values in {unit}</caption>
          <thead>
            <tr>
              <th scope="col">Period</th>
              {series.map((s) => (
                <th scope="col" key={s}>
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {points.map((p, i) => (
              <tr key={i}>
                <th scope="row">{p.label}</th>
                {p.values.map((v, j) => (
                  <td key={j}>{metricNumber(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
function ChartFallback({
  invalid,
  empty,
}: {
  invalid: boolean;
  empty: boolean;
}) {
  return invalid ? (
    <AgentWorkspaceState
      error
      title="Chart unavailable"
      description="Provide matching series with finite, non-negative values."
    />
  ) : empty ? (
    <AgentWorkspaceState
      title="No observations"
      description="Choose a period with recorded activity."
    />
  ) : null;
}
export function ComparisonBarChart({
  points,
  series = ["Current", "Previous"],
  mode = "stacked",
  label = "Comparison",
  unit = "USD",
}: {
  points: ChartPoint[];
  series?: string[];
  mode?: "stacked" | "grouped";
  label?: string;
  unit?: string;
}) {
  const id = useId(),
    [selected, setSelected] = useState(0),
    index = Math.min(selected, Math.max(0, points.length - 1));
  const valid = validSeries(points, series.length) && series.length <= 3,
    ceiling = chartCeiling(points, mode === "stacked");
  if (!valid || !points.length)
    return <ChartFallback invalid={!valid} empty={!points.length} />;
  const width = Math.max(560, points.length * 24),
    left = 46,
    plot = width - 62,
    col = plot / points.length,
    y = (v: number) => 218 - (v / ceiling) * 188;
  return (
    <figure className="ds-chart" aria-labelledby={id}>
      <figcaption id={id} className="ds-legend">
        {series.map((s, i) => (
          <span key={s}>
            <i data-series={i} />
            {s}
          </span>
        ))}
      </figcaption>
      <div
        className="ds-chart-scroll"
        role="region"
        aria-label={`${label} chart`}
        tabIndex={0}
      >
        <svg
          viewBox={`0 0 ${width} 252`}
          role="img"
          aria-label={`${label}; ${mode} series, zero baseline. Exact values below.`}
        >
          <g className="ds-axis">
            {[0, 0.5, 1].map((t) => (
              <g key={t}>
                <line
                  x1={left}
                  x2={width - 16}
                  y1={y(t * ceiling)}
                  y2={y(t * ceiling)}
                />
                <text x={left - 8} y={y(t * ceiling) + 4} textAnchor="end">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(t * ceiling)}
                </text>
              </g>
            ))}
          </g>
          {points.map((p, i) => (
            <g key={i} onPointerEnter={() => setSelected(i)}>
              {p.values.map((v, j) => {
                const below =
                    mode === "stacked"
                      ? p.values.slice(0, j).reduce((a, b) => a + b, 0)
                      : 0,
                  w =
                    mode === "stacked"
                      ? col * 0.68
                      : (col * 0.72) / series.length;
                return (
                  <rect
                    key={j}
                    data-series={j}
                    x={
                      left +
                      i * col +
                      col * 0.14 +
                      (mode === "grouped" ? j * w : 0)
                    }
                    y={y(v + below)}
                    width={Math.max(1, w - (mode === "grouped" ? 2 : 0))}
                    height={(v / ceiling) * 188}
                    rx={mode === "grouped" ? 3 : 0}
                  />
                );
              })}
              {(i === 0 ||
                i === points.length - 1 ||
                i === Math.floor(points.length / 2)) && (
                <text
                  className="ds-axis"
                  x={left + (i + 0.5) * col}
                  y="242"
                  textAnchor="middle"
                >
                  {p.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="ds-readout">
        <label>
          Inspect period
          <select
            value={index}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            {points.map((p, i) => (
              <option key={i} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <output>
          {points[index].values
            .map((v, j) => `${series[j]}: ${metricNumber(v)} ${unit}`)
            .join(" · ")}
        </output>
      </div>
      <DataTable points={points} series={series} unit={unit} />
    </figure>
  );
}
export function TrendAreaChart({
  points,
  label = "Revenue",
  unit = "USD",
}: {
  points: ChartPoint[];
  label?: string;
  unit?: string;
}) {
  const id = useId(),
    gradient = useId().replaceAll(":", ""),
    [selected, setSelected] = useState(0),
    index = Math.min(selected, Math.max(0, points.length - 1));
  if (!validSeries(points, 1) || !points.length)
    return (
      <ChartFallback invalid={!validSeries(points, 1)} empty={!points.length} />
    );
  const ceiling = chartCeiling(points),
    x = (i: number) =>
      46 + (points.length === 1 ? 250 : (i / (points.length - 1)) * 500),
    y = (v: number) => 218 - (v / ceiling) * 188,
    line = points.map((p, i) => `${x(i)},${y(p.values[0])}`).join(" "),
    p = points[index];
  return (
    <figure className="ds-chart" aria-labelledby={id}>
      <figcaption id={id} className="sr-only">
        {label}
      </figcaption>
      <div
        className="ds-chart-scroll"
        role="region"
        aria-label={`${label} chart`}
        tabIndex={0}
      >
        <svg
          className="ds-area"
          viewBox="0 0 570 252"
          role="img"
          aria-label={`${label}, zero baseline; exact values below.`}
          onPointerMove={(e) => {
            const b = e.currentTarget.getBoundingClientRect();
            setSelected(
              Math.max(
                0,
                Math.min(
                  points.length - 1,
                  Math.round(
                    ((((e.clientX - b.left) / b.width) * 570 - 46) / 500) *
                      (points.length - 1),
                  ),
                ),
              ),
            );
          }}
        >
          <defs>
            <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity=".2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g className="ds-axis">
            {[0, 0.5, 1].map((t) => (
              <g key={t}>
                <line
                  x1="46"
                  x2="546"
                  y1={y(t * ceiling)}
                  y2={y(t * ceiling)}
                />
                <text x="38" y={y(t * ceiling) + 4} textAnchor="end">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                  }).format(t * ceiling)}
                </text>
              </g>
            ))}
          </g>
          <polygon
            points={`${x(0)},218 ${line} ${x(points.length - 1)},218`}
            fill={`url(#${gradient})`}
          />
          <polyline
            points={line}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {[
            ...new Set([0, Math.floor(points.length / 2), points.length - 1]),
          ].map((i) => (
            <text
              key={i}
              className="ds-axis"
              x={x(i)}
              y="242"
              textAnchor="middle"
            >
              {points[i].label}
            </text>
          ))}
          <line
            className="ds-cursor"
            x1={x(index)}
            x2={x(index)}
            y1="30"
            y2="218"
          />
          <circle cx={x(index)} cy={y(p.values[0])} r="4" fill="currentColor" />
        </svg>
      </div>
      <div className="ds-readout">
        <label>
          Inspect period
          <select
            value={index}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            {points.map((p, i) => (
              <option key={i} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <output>
          {p.label} · {metricNumber(p.values[0])} {unit}
        </output>
      </div>
      <DataTable points={points} series={[label]} unit={unit} />
    </figure>
  );
}
export function ChannelBreakdown({
  channels,
  selected,
  onSelect,
  label = "Traffic sources",
}: {
  channels: Channel[];
  selected?: string;
  onSelect?: (id: string) => void;
  label?: string;
}) {
  const id = useId(),
    valid = channels.every((c) => Number.isFinite(c.value) && c.value >= 0),
    total = channels.reduce((s, c) => s + c.value, 0);
  if (!valid || !Number.isFinite(total))
    return (
      <AgentWorkspaceState
        error
        title="Sources unavailable"
        description="Channel values must be finite and non-negative."
      />
    );
  if (!channels.length)
    return (
      <AgentWorkspaceState
        title="No sources yet"
        description="Recorded traffic sources will appear here."
      />
    );
  return (
    <section className="ds-channels" aria-labelledby={id}>
      <h3 id={id}>{label}</h3>
      <ul>
        {channels.map((c) => {
          const content = (
            <>
              <span>
                {c.label}
                <strong>{metricNumber(c.value)}</strong>
              </span>
              <PixelMeter
                value={c.value}
                max={total || 1}
                tone="neutral"
                showValue={false}
                label={`${c.label} share`}
              />
              <small>
                {total ? `${((c.value / total) * 100).toFixed(1)}%` : "0%"} of
                total
              </small>
            </>
          );
          return (
            <li key={c.id}>
              {onSelect ? (
                <button
                  type="button"
                  aria-pressed={selected === c.id}
                  onClick={() => onSelect(selected === c.id ? "" : c.id)}
                >
                  {content}
                </button>
              ) : (
                <div>{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

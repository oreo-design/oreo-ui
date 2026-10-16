import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  aggregateUsage,
  validUsage,
  metricValue,
  compact,
  type UsageDay,
  type UsageMetric,
  type UsageModel,
} from "./model";
import "./usage.css";
export * from "./model";
export function ModelTrendChart({
  days,
  models,
  metric = "costCents",
  highlighted,
  onHighlight,
  loading = false,
  error,
  onRetry,
}: {
  days: UsageDay[];
  models: UsageModel[];
  metric?: UsageMetric;
  highlighted?: string;
  onHighlight?: (id: string) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}) {
  const id = useId(),
    host = useRef<HTMLElement>(null),
    [width, setWidth] = useState(640),
    [day, setDay] = useState(2);
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver(([e]) =>
      setWidth(Math.max(280, e.contentRect.width)),
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const valid = validUsage(days, models),
    index = Math.max(0, Math.min(day, days.length - 1)),
    point = days[index];
  const max = valid
    ? Math.max(
        1,
        ...days.flatMap((d) => models.map((m) => d.models[m.id][metric])),
      )
    : 1;
  const ceiling =
    Math.ceil(max / 4 / 10 ** Math.floor(Math.log10(max / 4))) *
    4 *
    10 ** Math.floor(Math.log10(max / 4));
  const tickStep = Math.max(
    1,
    Math.ceil(days.length / Math.max(2, Math.floor(width / 75))),
  );
  const x = (i: number) =>
      52 + (i / Math.max(1, days.length - 1)) * (width - 70),
    y = (v: number) => 218 - (v / ceiling) * 184;
  return (
    <figure className="mu-trend" ref={host} aria-busy={loading || undefined}>
      {error || !valid ? (
        <AgentWorkspaceState
          title="Usage unavailable"
          description={error ?? "Check model IDs and nonnegative counts."}
          error
          actionLabel={onRetry ? "Try again" : undefined}
          onAction={onRetry}
        />
      ) : loading && !days.length ? (
        <div className="mu-chart-skeleton" aria-label="Loading model usage" />
      ) : !days.length ? (
        <AgentWorkspaceState
          title="No usage in this period"
          description="Choose a period with sample requests."
          actionLabel={onRetry ? "Reset filters" : undefined}
          onAction={onRetry}
        />
      ) : (
        <>
          <div className="mu-legend">
            {models.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => onHighlight?.(m.id === highlighted ? "" : m.id)}
                aria-pressed={m.id === highlighted}
                disabled={!onHighlight}
                style={
                  {
                    "--mu-color": `var(--color-palette-${m.tone}-text)`,
                  } as CSSProperties
                }
              >
                <i />
                {m.name}
              </button>
            ))}
          </div>
          <svg
            viewBox={`0 0 ${width} 250`}
            role="img"
            aria-labelledby={`${id}-title ${id}-desc`}
          >
            <title id={`${id}-title`}>
              Model {metric === "costCents" ? "cost" : metric} by day
            </title>
            <desc id={`${id}-desc`}>
              {point.label}.{" "}
              {models
                .map(
                  (m) =>
                    `${m.name}: ${metricValue(point.models[m.id][metric], metric)}`,
                )
                .join(". ")}
              . Use the day slider or data table for exact values.
            </desc>
            {[0, 1, 2, 3, 4].map((n) => (
              <g key={n}>
                <line
                  x1="52"
                  x2={width - 18}
                  y1={y((ceiling * n) / 4)}
                  y2={y((ceiling * n) / 4)}
                  stroke="var(--color-border-subtle)"
                  strokeDasharray="4 5"
                />
                <text x="43" y={y((ceiling * n) / 4) + 4} textAnchor="end">
                  {metric === "costCents"
                    ? `$${compact((ceiling * n) / 400)}`
                    : compact((ceiling * n) / 4)}
                </text>
              </g>
            ))}
            <line
              x1={x(index)}
              x2={x(index)}
              y1="28"
              y2="218"
              stroke="var(--color-border-default)"
            />
            {models.map((m) => (
              <g
                key={m.id}
                opacity={!highlighted || highlighted === m.id ? 1 : 0.22}
              >
                <path
                  d={days
                    .map(
                      (d, i) =>
                        `${i ? "L" : "M"}${x(i)},${y(d.models[m.id][metric])}`,
                    )
                    .join(" ")}
                  stroke={`var(--color-palette-${m.tone}-text)`}
                  strokeWidth="2"
                  fill="none"
                />
                {days.length === 1 && (
                  <circle
                    cx={x(0)}
                    cy={y(point.models[m.id][metric])}
                    r="3"
                    fill={`var(--color-palette-${m.tone}-text)`}
                  />
                )}
                <circle
                  cx={x(index)}
                  cy={y(point.models[m.id][metric])}
                  r="4"
                  fill="var(--color-bg-base)"
                  stroke={`var(--color-palette-${m.tone}-text)`}
                  strokeWidth="2"
                />
              </g>
            ))}
            {days.map((d, i) =>
              i === 0 ||
              i === days.length - 1 ||
              (i % tickStep === 0 && i < days.length - tickStep) ? (
                <text
                  key={d.id}
                  x={x(i)}
                  y="243"
                  textAnchor={
                    i === 0 ? "start" : i === days.length - 1 ? "end" : "middle"
                  }
                >
                  {d.label}
                </text>
              ) : null,
            )}
          </svg>
          <figcaption>
            <label>
              Inspect day
              <input
                type="range"
                min={0}
                max={days.length - 1}
                value={index}
                onChange={(e) => setDay(Number(e.target.value))}
                aria-valuetext={point.label}
              />
            </label>
            <strong>{point.label}</strong>
            <div className="mu-point-values">
              {models.map((m) => (
                <span key={m.id}>
                  <i
                    style={{
                      background: `var(--color-palette-${m.tone}-text)`,
                    }}
                  />
                  {m.name}
                  <b>{metricValue(point.models[m.id][metric], metric)}</b>
                </span>
              ))}
            </div>
          </figcaption>
          <details className="mu-data">
            <summary>View data table</summary>
            <div>
              <table>
                <caption className="sr-only">Exact model usage values</caption>
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    {models.map((m) => (
                      <th key={m.id} scope="col">
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((d) => (
                    <tr key={d.id}>
                      <th scope="row">{d.label}</th>
                      {models.map((m) => (
                        <td key={m.id}>
                          {metric === "costCents"
                            ? metricValue(d.models[m.id][metric], metric)
                            : d.models[m.id][metric].toLocaleString("en-US")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </figure>
  );
}
export function ModelUsageRing({
  days,
  models,
  value,
  onValueChange,
}: {
  days: UsageDay[];
  models: UsageModel[];
  value?: string;
  onValueChange?: (id: string) => void;
}) {
  if (!validUsage(days, models))
    return (
      <AgentWorkspaceState
        title="Usage unavailable"
        description="Check the supplied model counts."
        error
      />
    );
  const { rows, total } = aggregateUsage(days, models);
  let offset = 0;
  if (total.requests === 0)
    return (
      <AgentWorkspaceState
        title="No model requests"
        description="Model shares appear when requests are available."
      />
    );
  return (
    <div className="mu-distribution">
      <div className="mu-ring-wrap">
        <svg viewBox="0 0 160 160" aria-hidden="true">
          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="var(--color-border-subtle)"
            strokeWidth="22"
          />
          {rows.map((m) => {
            const start = offset,
              share = (m.requests / total.requests) * 100;
            offset += share;
            return (
              <circle
                key={m.id}
                cx="80"
                cy="80"
                r="62"
                pathLength="100"
                fill="none"
                stroke={`var(--color-palette-${m.tone}-text)`}
                strokeWidth={value === m.id ? 25 : 22}
                strokeDasharray={`${share} ${100 - share}`}
                strokeDashoffset={-start}
                transform="rotate(-90 80 80)"
                opacity={!value || value === m.id ? 1 : 0.3}
              />
            );
          })}
        </svg>
        <div>
          <strong>{compact(total.requests)}</strong>
          <span>Requests</span>
        </div>
      </div>
      <div className="mu-token-total">
        <span>Tokens processed</span>
        <strong>{compact(total.tokens)}</strong>
        <small>{models.length} models</small>
      </div>
      <ul>
        {rows.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              disabled={!onValueChange}
              aria-pressed={value === m.id}
              onClick={() => onValueChange?.(value === m.id ? "" : m.id)}
            >
              <i
                style={{ background: `var(--color-palette-${m.tone}-text)` }}
              />
              <span>{m.name}</span>
              <b>{m.requests.toLocaleString("en-US")}</b>
              <strong>
                {((m.requests / total.requests) * 100).toFixed(1)}%
              </strong>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export function AgentUsageRow({
  title,
  description,
  model,
  tokens,
  costCents,
  status = "active",
  time,
  onOpen,
  onRun,
}: {
  title: string;
  description: string;
  model: string;
  tokens: number;
  costCents: number;
  status?: "active" | "paused" | "complete";
  time: string;
  onOpen?: () => void;
  onRun?: () => void;
}) {
  return (
    <article className="mu-agent-row">
      <span className="mu-agent-icon">
        <Icon name={status === "complete" ? "check" : "assistant"} />
      </span>
      <div>
        <div className="mu-agent-title">
          {onOpen ? (
            <button type="button" onClick={onOpen}>
              {title}
            </button>
          ) : (
            <strong>{title}</strong>
          )}
          <Tag size="sm" color={status === "active" ? "mint" : "default"}>
            {status}
          </Tag>
        </div>
        <p>{description}</p>
        <small>
          {model} · {compact(tokens)} tokens ·{" "}
          {metricValue(costCents, "costCents")}
        </small>
      </div>
      <div className="mu-agent-actions">
        <time>{time}</time>
        {onRun && (
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            disabled={status === "paused"}
            onClick={onRun}
          >
            Run sample
          </Button>
        )}
      </div>
    </article>
  );
}

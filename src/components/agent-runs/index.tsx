import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  count,
  fillWeek,
  hourLabel,
  intensity,
  METRICS,
  summarizeRuns,
  validBuckets,
  WEEKDAYS,
  type HourBucket,
  type RunMetric,
} from "./model";
import "./runs.css";
export * from "./model";
export type WeeklyHeatmapProps = {
  data: HourBucket[];
  metric?: RunMetric;
  value?: number;
  onValueChange?: (slot: number) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
};
export function WeeklyHeatmap({
  data,
  metric = "runs",
  value = 82,
  onValueChange,
  loading = false,
  error,
  onRetry,
}: WeeklyHeatmapProps) {
  const id = useId(),
    refs = useRef<(HTMLButtonElement | null)[]>([]),
    [focus, setFocus] = useState(Math.max(0, Math.min(167, value))),
    [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    if (hover === null) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHover(null);
    };
    window.addEventListener("keydown", dismiss);
    return () => window.removeEventListener("keydown", dismiss);
  }, [hover]);
  const valid = validBuckets(data),
    slots = valid ? fillWeek(data) : [],
    max = Math.max(1, ...slots.map((b) => b[metric])),
    selected = slots[value],
    point = hover === null ? undefined : slots[hover];
  function move(index: number) {
    const next = Math.max(0, Math.min(167, index));
    setFocus(next);
    refs.current[next]?.focus();
  }
  return (
    <figure
      className="ar-heatmap"
      aria-busy={loading || undefined}
      data-metric={metric}
    >
      {error || !valid ? (
        <AgentWorkspaceState
          title="Activity unavailable"
          description={
            error || "Check the hour coordinates and nonnegative counts."
          }
          error
          actionLabel={onRetry ? "Try again" : undefined}
          onAction={onRetry}
        />
      ) : loading && !data.length ? (
        <div className="ar-skeleton" aria-label="Loading hourly activity">
          {Array.from({ length: 168 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      ) : !data.length ? (
        <AgentWorkspaceState
          title="No runs in this period"
          description="Choose another agent or week to see activity."
          actionLabel={onRetry ? "Reset filters" : undefined}
          onAction={onRetry}
        />
      ) : (
        <>
          <div className="ar-scroll" onMouseLeave={() => setHover(null)}>
            <div className="ar-grid-wrap">
              <div
                className="ar-week"
                role="grid"
                aria-label={`${METRICS.find((m) => m.value === metric)?.label} by weekday and hour, UTC. Use arrow keys to inspect; Enter selects.`}
              >
                {WEEKDAYS.map((day, d) => (
                  <div className="ar-day" role="row" key={day}>
                    <span role="rowheader">{day}</span>
                    {slots.slice(d * 24, d * 24 + 24).map((b) => {
                      const i = b.day * 24 + b.hour;
                      return (
                        <div
                          role="gridcell"
                          key={i}
                          aria-selected={value === i}
                        >
                          <button
                            type="button"
                            ref={(el) => {
                              refs.current[i] = el;
                            }}
                            tabIndex={focus === i ? 0 : -1}
                            aria-label={`${day}, ${hourLabel(b.hour)} UTC: ${count(b.runs)} runs, ${count(b.credits)} credits, ${count(b.failures)} failures`}
                            aria-describedby={
                              hover === i ? `${id}-tip` : undefined
                            }
                            data-level={intensity(b[metric], max)}
                            data-selected={value === i || undefined}
                            onMouseEnter={() => setHover(i)}
                            onFocus={() => {
                              setFocus(i);
                              setHover(i);
                            }}
                            onBlur={() => setHover(null)}
                            onClick={() => onValueChange?.(i)}
                            onKeyDown={(e) => {
                              const keys: Record<string, number> = {
                                ArrowLeft: i - 1,
                                ArrowRight: i + 1,
                                ArrowUp: i - 24,
                                ArrowDown: i + 24,
                                Home: e.ctrlKey ? 0 : d * 24,
                                End: e.ctrlKey ? 167 : d * 24 + 23,
                              };
                              if (e.key in keys) {
                                e.preventDefault();
                                move(keys[e.key]);
                              }
                              if (e.key === "Escape") setHover(null);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="ar-hours" aria-hidden>
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
              </div>
              {point && (
                <div
                  id={`${id}-tip`}
                  role="tooltip"
                  className="ar-tooltip"
                  style={
                    {
                      "--ar-tip-x": `clamp(100px, ${((point.hour + 0.5) / 24) * 100}%, calc(100% - 100px))`,
                      "--ar-tip-y": `${point.day * 32 + (point.day < 3 ? 36 : 0)}px`,
                      "--ar-tip-shift": point.day < 3 ? "0%" : "-100%",
                    } as CSSProperties
                  }
                >
                  <strong>
                    {WEEKDAYS[point.day]}, {hourLabel(point.hour)} UTC
                  </strong>
                  <span>
                    Runs <b>{count(point.runs)}</b>
                  </span>
                  <span>
                    Credits <b>{count(point.credits)}</b>
                  </span>
                  <span>
                    Failed <b>{count(point.failures)}</b>
                  </span>
                </div>
              )}
            </div>
          </div>
          <figcaption className="ar-chart-caption">
            <span className="ar-scale">
              Fewer{" "}
              {[0, 1, 2, 3, 4].map((n) => (
                <i data-level={n} key={n} />
              ))}{" "}
              More
            </span>
            <span>
              {selected
                ? `${WEEKDAYS[selected.day]}, ${hourLabel(selected.hour)} · ${count(selected[metric])} ${metric}`
                : "Select an hour to inspect"}
            </span>
          </figcaption>
        </>
      )}
    </figure>
  );
}
export type AgentRunsCardProps = WeeklyHeatmapProps & {
  previousData?: HourBucket[];
  title?: string;
  description?: string;
  onMetricChange?: (metric: RunMetric) => void;
};
export function AgentRunsCard({
  data,
  previousData,
  title = "Agent runs",
  description = "All agents · Oct 5–11, 2026 · UTC",
  metric = "runs",
  onMetricChange,
  ...props
}: AgentRunsCardProps) {
  const valid = validBuckets(data),
    available = valid && data.length > 0 && !props.error,
    summary = summarizeRuns(valid ? data : [], metric),
    previous =
      previousData && validBuckets(previousData)
        ? summarizeRuns(previousData, metric).total[metric]
        : null;
  const total = summary.total[metric],
    delta = previous ? ((total - previous) / previous) * 100 : null;
  return (
    <section className="ar-card">
      <header>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="ar-metrics" role="group" aria-label="Activity metric">
          {METRICS.map((m) => (
            <Button
              key={m.value}
              size="sm"
              type={m.value === metric ? "secondary" : "tertiary"}
              tapScale={1}
              aria-pressed={m.value === metric}
              disabled={!onMetricChange}
              onClick={() => onMetricChange?.(m.value)}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </header>
      <div className="ar-summary">
        <div className="ar-total">
          <div>
            <strong>{available ? count(total) : "—"}</strong>
            {available && delta !== null && (
              <Tag color="default">
                {delta >= 0 ? "+" : ""}
                {delta.toFixed(1)}%
              </Tag>
            )}
          </div>
          <p>
            {available && previous !== null
              ? `${METRICS.find((m) => m.value === metric)?.label} this week, from ${count(previous)} last week`
              : "Weekly activity"}
          </p>
        </div>
        <dl>
          <div>
            <dt>Peak {metric === "runs" ? "hour" : metric}</dt>
            <dd>
              {available && summary.peak
                ? `${WEEKDAYS[summary.peak.day]}, ${hourLabel(summary.peak.hour)}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt>Average run</dt>
            <dd>
              {available && summary.average !== null
                ? `${Math.round(summary.average)}s`
                : "—"}
            </dd>
          </div>
          <div>
            <dt>Failed</dt>
            <dd>
              {available && summary.failureRate !== null
                ? `${summary.failureRate.toFixed(1)}%`
                : "—"}
            </dd>
          </div>
        </dl>
      </div>
      <WeeklyHeatmap {...props} data={data} metric={metric} />
      {available && (
        <footer>
          <Icon name="sparkle" size="sm" />
          <span>
            {summary.morningShare === null
              ? "No activity for this metric."
              : `Weekday mornings carry ${summary.morningShare.toFixed(0)}% of all ${metric}.`}
          </span>
          <small>6 AM–12 PM UTC</small>
        </footer>
      )}
    </section>
  );
}

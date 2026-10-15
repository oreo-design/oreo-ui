import { useId } from "react";
import { AgentWorkspaceState } from "@/components/automation";
import {
  DAY,
  forecastDate,
  forecastDay,
  forecastLabel,
  forecastPercent,
  type UsageForecast,
} from "./model";
import "./usage-forecast.css";
export * from "./model";
function ForecastUnavailable({ forecast: f }: { forecast: UsageForecast }) {
  return (
    <AgentWorkspaceState
      error={f.status === "invalid"}
      title={
        f.status === "disconnected"
          ? "History disconnected"
          : "Forecast unavailable"
      }
      description={f.reason}
    />
  );
}
export function ForecastTimeline({
  forecasts,
  selectedId,
  onSelect,
  days = 7,
}: {
  forecasts: UsageForecast[];
  selectedId?: string;
  onSelect: (id: string) => void;
  days?: number;
}) {
  const horizon = Number.isFinite(days)
    ? Math.min(14, Math.max(1, Math.round(days)))
    : 7;
  if (!forecasts.length)
    return (
      <AgentWorkspaceState
        title="No accounts match"
        description="Try another name or change the account filter."
      />
    );
  const now = forecasts[0].now,
    count = horizon * 4;
  return (
    <div className="uf-timeline">
      <div
        className="uf-timeline-scroll"
        tabIndex={0}
        role="region"
        aria-label={`${horizon}-day account forecast, scroll horizontally`}
      >
        <div className="uf-timeline-inner">
          <div className="uf-axis">
            <span>Account</span>
            <div>
              {Array.from({ length: horizon }, (_, i) => (
                <span key={i}>
                  {i === 0 ? "Now" : forecastDay(now + i * DAY)}
                </span>
              ))}
            </div>
            <span>Outlook · UTC</span>
          </div>
          {forecasts.map((f) => (
            <button
              type="button"
              key={f.account.id}
              className="uf-timeline-row"
              aria-pressed={f.account.id === selectedId}
              onClick={() => onSelect(f.account.id)}
              aria-label={`${f.account.name}, ${f.account.plan}. ${forecastLabel(f)}. Select account`}
            >
              <span className="uf-account-label">
                <span className="uf-monogram" aria-hidden>
                  {f.account.name.slice(0, 1)}
                </span>
                <span>
                  {f.account.name}
                  <small>{f.account.plan}</small>
                </span>
              </span>
              <span
                className="uf-cells"
                style={{
                  gridTemplateColumns: `repeat(${count},minmax(0,1fr))`,
                }}
                aria-hidden
              >
                {Array.from({ length: count }, (_, i) => {
                  const at = now + (((i + 0.5) * horizon) / count) * DAY;
                  const value = f.used + (f.rate * (at - now)) / DAY;
                  const state =
                    f.status !== "ready" || at >= f.account.resetAt
                      ? "future"
                      : value >= 100
                        ? "locked"
                        : "used";
                  return (
                    <i
                      key={i}
                      data-state={state}
                      style={{
                        opacity:
                          state === "used"
                            ? 0.25 + (Math.min(100, value) / 100) * 0.65
                            : undefined,
                      }}
                    />
                  );
                })}
                {f.status === "ready" &&
                  f.account.resetAt <= now + horizon * DAY && (
                    <b
                      className="uf-reset-marker"
                      style={{
                        left: `${((f.account.resetAt - now) / (horizon * DAY)) * 100}%`,
                      }}
                    />
                  )}
                {f.atRisk && f.runsOutAt! <= now + horizon * DAY && (
                  <b
                    className="uf-out-marker"
                    style={{
                      left: `${((f.runsOutAt! - now) / (horizon * DAY)) * 100}%`,
                    }}
                  />
                )}
              </span>
              <span
                className="uf-row-outlook"
                data-risk={f.atRisk || undefined}
              >
                {forecastLabel(f)}
                <small>
                  {f.status === "ready"
                    ? `Resets ${forecastDate(f.account.resetAt)}`
                    : f.status === "disconnected"
                      ? "Load sample history to forecast"
                      : "Check the observation data"}
                </small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="uf-legend">
        <span>
          <i className="uf-key-used" /> Projected use
        </span>
        <span>
          <i className="uf-key-locked" /> Exhausted until reset
        </span>
        <span>
          <i className="uf-key-reset" /> Reset
        </span>
        <span>
          <i className="uf-key-future" /> No forecast after reset
        </span>
      </div>
      <p className="uf-footnote">
        Assumes the recent pace holds. Select an account for details.
      </p>
    </div>
  );
}
export function UsageProjection({ forecast: f }: { forecast: UsageForecast }) {
  const id = useId().replaceAll(":", "");
  if (f.status !== "ready") return <ForecastUnavailable forecast={f} />;
  const points = f.account.observations,
    start = points[0].at,
    end = f.account.resetAt;
  const x = (at: number) => 42 + ((at - start) / (end - start)) * 398,
    y = (v: number) => 190 - Math.min(100, Math.max(0, v)) * 1.55;
  const history = points
    .map((p, i) => `${i ? "L" : "M"}${x(p.at)},${y(p.used)}`)
    .join(" ");
  const endpoint = f.atRisk ? f.runsOutAt! : end;
  return (
    <figure className="uf-projection">
      <figcaption>
        Usage projection{" "}
        <span>
          {forecastPercent(f.used)} used ·{" "}
          {Math.round(
            ((f.now - f.account.windowStart) / (end - f.account.windowStart)) *
              100,
          )}
          % of window elapsed
        </span>
      </figcaption>
      <svg
        viewBox="0 0 460 232"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <title id={`${id}-title`}>{f.account.name} usage forecast</title>
        <desc id={`${id}-description`}>
          {forecastLabel(f)}. Recent pace {f.rate.toFixed(1)} percentage points
          per day.{" "}
          {f.atRisk
            ? `${f.lockedHours.toFixed(1)} hours exhausted before reset.`
            : "Within allowance at reset."}{" "}
          Dashed line assumes the scenario pace continues. Exact observations
          follow.
        </desc>
        <defs>
          <pattern
            id={`${id}-hatch`}
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="7"
              stroke="var(--color-status-error)"
              strokeWidth="2"
            />
          </pattern>
        </defs>
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <text x="33" y={y(v) + 4} textAnchor="end">
              {v}%
            </text>
            <line
              className="uf-gridline"
              x1="42"
              y1={y(v)}
              x2="440"
              y2={y(v)}
            />
          </g>
        ))}
        {f.atRisk && (
          <rect
            x={x(endpoint)}
            y="35"
            width={Math.max(0, x(end) - x(endpoint))}
            height="155"
            fill={`url(#${id}-hatch)`}
            opacity=".35"
          />
        )}
        <path
          className="uf-area"
          d={`${history} L${x(points.at(-1)!.at)},190 L42,190 Z`}
        />
        <path className="uf-history" d={history} />
        <path
          className="uf-even"
          d={`M${x(f.now)},${y(f.used)} L${x(end)},35`}
        />
        <path
          className="uf-prediction"
          d={`M${x(f.now)},${y(f.used)} L${x(endpoint)},${y(f.used + (f.rate * (endpoint - f.now)) / DAY)}`}
        />
        <line
          className="uf-now-line"
          x1={x(f.now)}
          y1="30"
          x2={x(f.now)}
          y2="190"
        />
        <circle
          cx={x(f.now)}
          cy={y(f.used)}
          r="4"
          fill="var(--color-text-primary)"
        />
        {f.atRisk && (
          <circle
            cx={x(endpoint)}
            cy="35"
            r="5"
            fill="var(--color-status-error)"
          />
        )}
        <text x="42" y="214">
          {new Date(start).toLocaleDateString("en-US", {
            timeZone: "UTC",
            month: "short",
            day: "numeric",
          })}
        </text>
        <text x="440" y="214" textAnchor="end">
          Reset {forecastDate(end)}
        </text>
      </svg>
      <div className="uf-legend">
        <span>
          <i className="uf-key-line" /> Observed
        </span>
        <span>
          <i className="uf-key-dash" /> Scenario pace
        </span>
        <span>
          <i className="uf-key-dots" /> Even pace to reset
        </span>
      </div>
      <details className="uf-data">
        <summary>View observations</summary>
        <table>
          <thead>
            <tr>
              <th>Observed UTC</th>
              <th>Used</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.at}>
                <td>{forecastDate(p.at)}</td>
                <td>{p.used.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
export function DailyUsagePace({ forecast: f }: { forecast: UsageForecast }) {
  const id = useId();
  if (f.status !== "ready") return <ForecastUnavailable forecast={f} />;
  const points = f.account.observations;
  const bars = points
    .slice(1)
    .map((p, i) => ({
      at: p.at,
      value: (p.used - points[i].used) / ((p.at - points[i].at) / DAY),
    }));
  const ceiling = Math.max(...bars.map((b) => b.value), f.allowed, 1) * 1.2;
  return (
    <figure className="uf-pace" aria-labelledby={id}>
      <figcaption id={id}>
        Recent pace <span>Percentage points per day</span>
      </figcaption>
      <p className="uf-footnote">
        Remaining allowance: {f.allowed.toFixed(1)} pp/day until reset
      </p>
      <div className="uf-pace-bars">
        <span
          className="uf-allowance"
          style={{ bottom: `${(f.allowed / ceiling) * 100}%` }}
          aria-hidden
        />
        {bars.map((b, i) => (
          <div key={b.at} className="uf-pace-column">
            <span
              className="uf-pace-bar"
              data-over={b.value > f.allowed || undefined}
              style={{ height: `${(b.value / ceiling) * 100}%` }}
            >
              <b>{b.value.toFixed(0)}</b>
            </span>
            <span className="uf-pace-day">
              {i === bars.length - 1 ? "Latest" : forecastDay(b.at)}
            </span>
          </div>
        ))}
      </div>
      <div className="uf-legend">
        <span>
          <i className="uf-key-used" /> Within allowance
        </span>
        <span>
          <i className="uf-key-over" /> Over
        </span>
        <span>
          <i className="uf-key-dash" /> Allowed per day
        </span>
      </div>
      <details className="uf-data">
        <summary>View daily values</summary>
        <table>
          <thead>
            <tr>
              <th>Interval ending UTC</th>
              <th>pp/day</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.at}>
                <td>{forecastDate(b.at)}</td>
                <td>{b.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

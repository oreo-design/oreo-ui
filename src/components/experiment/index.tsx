import { useId, useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import {
  conversionRate,
  formatRate,
  signed,
  summarizeExperiment,
  type ExperimentDay,
  type ExperimentCount,
} from "./stats";
import "./experiment.css";
export * from "./stats";
const count = (n: number) => new Intl.NumberFormat("en-US").format(n);
export function VariantResults({
  a,
  b,
  labels = ["Design that ships.", "Interfaces people get at a glance."],
}: {
  a: ExperimentCount;
  b: ExperimentCount;
  labels?: [string, string];
}) {
  return (
    <dl className="experiment-variants" aria-label="Variant results">
      {([a, b] as const).map((v, i) => (
        <div key={i}>
          <dt>
            <span className="experiment-letter" data-variant={i ? "b" : "a"}>
              {i ? "B" : "A"}
            </span>
            <span>{labels[i]}</span>
          </dt>
          <dd>
            <span>
              {count(v.conversions)} / {count(v.visitors)}
            </span>
            <strong>{formatRate(conversionRate(v))}</strong>
          </dd>
        </div>
      ))}
    </dl>
  );
}
export function ExperimentDecision({
  state,
  confidence,
  threshold = 95,
  onDecide,
  onUndo,
}: {
  state: "ready" | "collecting" | "decided";
  confidence: number | null;
  threshold?: number;
  onDecide?: () => void;
  onUndo?: () => void;
}) {
  return (
    <div className="experiment-decision">
      <div>
        <strong data-ready={state !== "collecting"}>
          <Icon
            name={
              state === "decided"
                ? "check"
                : state === "ready"
                  ? "check"
                  : "clock-history"
            }
            size="sm"
          />
          {state === "decided"
            ? "B selected for this demo"
            : state === "ready"
              ? "Ready to review B"
              : "Keep collecting evidence"}
        </strong>
        <p>
          {confidence === null
            ? "No confidence estimate supplied"
            : `${confidence}% supplied confidence · gate ${threshold}%`}
        </p>
      </div>
      {state === "decided" ? (
        onUndo && (
          <Button type="secondary" size="sm" tapScale={1} onClick={onUndo}>
            Undo decision
          </Button>
        )
      ) : state === "ready" && onDecide ? (
        <Button
          size="sm"
          tapScale={1}
          onClick={onDecide}
          trailingIcon={<Icon name="arrow-up-right" size="sm" />}
        >
          Review B
        </Button>
      ) : null}
    </div>
  );
}
export function ExperimentChart({
  days,
  mode = "cumulative",
  label = "Headline A/B test",
  selectedIndex,
  onSelectedIndexChange,
}: {
  days: ExperimentDay[];
  mode?: "cumulative" | "daily";
  label?: string;
  selectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
}) {
  const id = useId();
  const [local, setLocal] = useState<number | null>(null);
  const summary = summarizeExperiment(days);
  const data = mode === "cumulative" ? summary.cumulative : summary.data;
  if (!data.length)
    return (
      <AgentWorkspaceState
        title="No observations yet"
        description="Add daily visitor and conversion counts to compare the two variants."
      />
    );
  const index = Math.max(
    0,
    Math.min(selectedIndex ?? local ?? data.length - 1, data.length - 1),
  );
  const select = (n: number) => {
    setLocal(n);
    onSelectedIndexChange?.(n);
  };
  const active = data[index],
    ar = conversionRate(active.a),
    br = conversionRate(active.b);
  const rates = data
    .flatMap((d) => [conversionRate(d.a), conversionRate(d.b)])
    .filter((n): n is number => n !== null);
  const low = Math.max(0, Math.min(...rates, 0)),
    high = Math.max(1, ...rates) * 1.15;
  const x = (i: number) =>
    data.length === 1 ? 250 : 24 + (i / (data.length - 1)) * 450;
  const y = (n: number) => 214 - ((n - low) / (high - low)) * 190;
  const path = (key: "a" | "b") => {
    let drawing = false;
    return data
      .map((d, i) => {
        const r = conversionRate(d[key]);
        if (r === null) {
          drawing = false;
          return "";
        }
        const part = `${drawing ? "L" : "M"}${x(i)},${y(r)}`;
        drawing = true;
        return part;
      })
      .join(" ");
  };
  const end = data[data.length - 1];
  return (
    <figure className="experiment-chart" aria-label={`${label} ${mode}`}>
      <div
        className="experiment-plot"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const coordinate = ((e.clientX - rect.left) / rect.width) * 600;
          select(
            Math.max(
              0,
              Math.min(
                data.length - 1,
                Math.round(((coordinate - 24) / 450) * (data.length - 1)),
              ),
            ),
          );
        }}
      >
        <svg
          viewBox="0 0 600 250"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
        >
          <title id={`${id}-title`}>
            {label}:{" "}
            {mode === "daily"
              ? "daily conversion rates"
              : "cumulative conversion rates"}
          </title>
          <desc id={`${id}-desc`}>
            Shared scale from 0 to {high.toFixed(1)} percent. {active.date}: A{" "}
            {formatRate(ar)}, B {formatRate(br)}. Use Inspect day or the data
            table for every observation.
          </desc>
          {[0, 0.5, 1].map((n) => (
            <line
              key={n}
              x1="24"
              x2="474"
              y1={y(high * n)}
              y2={y(high * n)}
              stroke="var(--color-border-subtle)"
              strokeDasharray="3 5"
            />
          ))}
          <line
            x1={x(index)}
            x2={x(index)}
            y1="12"
            y2="220"
            stroke="var(--color-border-default)"
          />
          {mode === "daily"
            ? data.map((d, i) => {
                const a = conversionRate(d.a),
                  b = conversionRate(d.b);
                return (
                  <g key={`${d.date}-${i}`} opacity={i === index ? 1 : 0.35}>
                    {a !== null && b !== null && (
                      <line
                        x1={x(i)}
                        x2={x(i)}
                        y1={y(a)}
                        y2={y(b)}
                        stroke="var(--color-text-tertiary)"
                      />
                    )}
                    {a !== null && (
                      <circle
                        cx={x(i)}
                        cy={y(a)}
                        r="4"
                        fill="var(--color-text-tertiary)"
                      />
                    )}
                    {b !== null && (
                      <circle
                        cx={x(i)}
                        cy={y(b)}
                        r="4"
                        fill="var(--color-text-primary)"
                      />
                    )}
                  </g>
                );
              })
            : (["a", "b"] as const).map((key) => (
                <path
                  key={key}
                  d={path(key)}
                  fill="none"
                  stroke={
                    key === "b"
                      ? "var(--color-text-primary)"
                      : "var(--color-text-tertiary)"
                  }
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              ))}
          {(["a", "b"] as const).map((key) => {
            const rate = conversionRate(active[key]),
              last = conversionRate(end[key]);
            return (
              <g key={key}>
                {rate !== null && (
                  <circle
                    cx={x(index)}
                    cy={y(rate)}
                    r="5"
                    fill={
                      key === "b"
                        ? "var(--color-text-primary)"
                        : "var(--color-text-tertiary)"
                    }
                    stroke="var(--color-bg-base)"
                    strokeWidth="2"
                  />
                )}
                {last !== null && (
                  <text
                    x="492"
                    y={key === "b" ? 34 : 55}
                    className="experiment-svg-label"
                    fill={
                      key === "b"
                        ? "var(--color-text-primary)"
                        : "var(--color-text-tertiary)"
                    }
                  >
                    {key.toUpperCase()} {formatRate(last)}
                  </text>
                )}
              </g>
            );
          })}
          <text
            x="24"
            y="245"
            className="experiment-svg-label"
            fill="var(--color-text-tertiary)"
          >
            {data[0].date}
          </text>
          <text
            x="474"
            y="245"
            textAnchor="end"
            className="experiment-svg-label"
            fill="var(--color-text-tertiary)"
          >
            {end.date}
          </text>
        </svg>
        <div
          className="experiment-tooltip"
          style={{
            left: `clamp(0.5rem, ${Math.min(55, Math.max(3, x(index) / 6 - 15))}%, max(0.5rem, calc(100% - 14.5rem)))`,
          }}
          aria-hidden="true"
        >
          <span>
            {active.date} · {mode === "daily" ? `day ${index + 1}` : "so far"}
          </span>
          <p>
            <b>● B {formatRate(br)}</b>
            <span>
              {count(active.b.conversions)} / {count(active.b.visitors)}
            </span>
          </p>
          <p>
            <b>● A {formatRate(ar)}</b>
            <span>
              {count(active.a.conversions)} / {count(active.a.visitors)}
            </span>
          </p>
          <strong>
            {ar === null || br === null
              ? "Awaiting both variants"
              : `B ${br >= ar ? "ahead" : "behind"} by ${Math.abs(br - ar).toFixed(2)} pts`}
          </strong>
        </div>
      </div>
      <figcaption>
        <label className="experiment-scrubber">
          <span>
            Inspect day <b>{active.date}</b>
          </span>
          <input
            aria-label={`Inspect day — ${mode}`}
            type="range"
            min="0"
            max={data.length - 1}
            value={index}
            disabled={data.length === 1}
            onChange={(e) => select(Number(e.target.value))}
            aria-valuetext={`${active.date}. A ${formatRate(ar)}. B ${formatRate(br)}.`}
          />
        </label>
        <p className="experiment-reading">
          {active.date} · A {formatRate(ar)} · B {formatRate(br)}
          {ar !== null && br !== null
            ? ` · ${signed(br - ar)} percentage points`
            : ""}
        </p>
      </figcaption>
      <details className="experiment-data">
        <summary>View {mode} data</summary>
        <div>
          <table>
            <caption className="sr-only">
              {label} — {mode} counts
            </caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">A converted / visitors</th>
                <th scope="col">B converted / visitors</th>
                <th scope="col">A rate</th>
                <th scope="col">B rate</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={`${d.date}-${i}`}>
                  <th scope="row">{d.date}</th>
                  <td>
                    {d.a.conversions} / {d.a.visitors}
                  </td>
                  <td>
                    {d.b.conversions} / {d.b.visitors}
                  </td>
                  <td>{formatRate(conversionRate(d.a))}</td>
                  <td>{formatRate(conversionRate(d.b))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

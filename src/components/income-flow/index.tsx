import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "@/components/icon";
import { StatusView } from "@/components/status-view";
import {
  incomeBand,
  incomeChange,
  incomeIndex,
  incomeMoney,
  validIncome,
  type IncomePoint,
  type IncomeTone,
} from "./model";
import "./income-flow.css";
export * from "./model";
export function IncomeComparison({
  current,
  previous,
  previousLabel,
}: {
  current: number;
  previous?: number;
  previousLabel?: string;
}) {
  const prior =
    previous !== undefined && Number.isSafeInteger(previous) && previous >= 0
      ? previous
      : undefined;
  const change = incomeChange(current, prior),
    valid = Number.isSafeInteger(current) && current >= 0;
  return (
    <div className="if-comparison">
      <p>
        {!valid ? (
          "Income unavailable"
        ) : prior === undefined ? (
          "No previous period"
        ) : (
          <>
            Compared to <strong>{incomeMoney(prior!)}</strong>
            {previousLabel && <> in {previousLabel}</>}
          </>
        )}
      </p>
      <span
        className="if-change"
        aria-label={
          change === null
            ? "Percentage comparison unavailable"
            : `${change > 0 ? "Increase" : change < 0 ? "Decrease" : "No change"}: ${Math.abs(change).toFixed(1)} percent`
        }
      >
        {change === null ? (
          "—"
        ) : (
          <>
            {change !== 0 && (
              <Icon name={change > 0 ? "arrow-up" : "arrow-down"} size="sm" />
            )}
            {Math.abs(change).toFixed(1)}%
          </>
        )}
      </span>
    </div>
  );
}
export function IncomeFlowChart({
  points,
  value,
  onValueChange,
  onPreviewChange,
  tone = "orange",
  label = "Income",
  disabled = false,
}: {
  points: IncomePoint[];
  value: number;
  onValueChange: (index: number) => void;
  onPreviewChange?: (index: number | null) => void;
  tone?: IncomeTone;
  label?: string;
  disabled?: boolean;
}) {
  const clip = useId().replaceAll(":", ""),
    [keyboard, setKeyboard] = useState(false),
    [inspecting, setInspecting] = useState(false),
    index = incomeIndex(value, points.length),
    valid = validIncome(points);
  if (!points.length || !valid)
    return (
      <StatusView
        title={valid ? "No income history" : "Income unavailable"}
        description={
          valid
            ? "Add a period to see its income flow."
            : "This income history contains incomplete or invalid values."
        }
        error={!valid}
      />
    );
  const getIndex = (e: PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    return incomeIndex(
      Math.floor(((e.clientX - box.left) / box.width) * points.length),
      points.length,
    );
  };
  const choose = (next: number) => {
    if (disabled) return;
    onPreviewChange?.(null);
    onValueChange(next);
  };
  const key = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next =
      e.key === "ArrowRight"
        ? Math.min(points.length - 1, i + 1)
        : e.key === "ArrowLeft"
          ? Math.max(0, i - 1)
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? points.length - 1
              : e.key === "Escape"
                ? points.length - 1
                : null;
    if (next === null) return;
    e.preventDefault();
    choose(next);
    (
      e.currentTarget.parentElement?.children[next] as HTMLButtonElement
    )?.focus();
  };
  return (
    <div
      className="if-chart"
      data-tone={tone}
      data-keyboard={keyboard}
      data-disabled={disabled || undefined}
      onFocusCapture={(e) => {
        setInspecting(true);
        if (
          e.target instanceof HTMLElement &&
          e.target.matches(":focus-visible")
        )
          setKeyboard(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setInspecting(false);
      }}
      onKeyDownCapture={() => setKeyboard(true)}
      onPointerDownCapture={() => setKeyboard(false)}
    >
      <div
        className="if-plot"
        onPointerMove={(e) => {
          if (!disabled && e.pointerType !== "touch") {
            setKeyboard(false);
            setInspecting(true);
            onPreviewChange?.(getIndex(e));
          }
        }}
        onPointerLeave={() => {
          setInspecting(false);
          onPreviewChange?.(null);
        }}
        onPointerCancel={() => {
          setInspecting(false);
          onPreviewChange?.(null);
        }}
        onPointerUp={(e) => {
          if (e.button === 0) choose(getIndex(e));
        }}
      >
        <svg
          viewBox="0 0 400 160"
          role="img"
          aria-label={`${label} trend. ${points[index].label}: ${incomeMoney(points[index].amount)}. Use the month buttons to inspect exact values.`}
          preserveAspectRatio="none"
        >
          <defs>
            <clipPath id={clip}>
              <path d={incomeBand(points)} />
            </clipPath>
          </defs>
          <path
            className="if-glow"
            d={incomeBand(points, 0.8)}
            fill="currentColor"
          />
          {[1, 0.78, 0.56, 0.3].map((layer, i) => (
            <path
              key={layer}
              d={incomeBand(points, layer)}
              fill="currentColor"
              fillOpacity={[0.18, 0.28, 0.42, 1][i]}
            />
          ))}
          {points.every((p) => p.amount === 0) && (
            <path d="M0,80H400" stroke="currentColor" strokeWidth="1" />
          )}
          {!disabled && (
            <g clipPath={`url(#${clip})`}>
              <rect
                className="if-marker"
                x="0"
                y="0"
                width={400 / points.length}
                height="160"
                fill="var(--color-text-primary)"
                fillOpacity=".08"
                style={{
                  transform: `translateX(${(index * 400) / points.length}px)`,
                  opacity: inspecting ? 1 : 0,
                }}
              />
            </g>
          )}
        </svg>
      </div>
      <div
        className="if-months"
        role="group"
        aria-label={`${label} periods`}
        style={{
          gridTemplateColumns: `repeat(${points.length},minmax(0,1fr))`,
        }}
      >
        {points.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className="oreo-state-layer oreo-focus"
            aria-label={`Inspect ${p.label}: ${incomeMoney(p.amount)}`}
            aria-pressed={i === index}
            disabled={disabled}
            onClick={() => choose(i)}
            onKeyDown={(e) => key(e, i)}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
export function IncomeFlowCard({
  points,
  label = "Income",
  tone = "orange",
  value,
  onValueChange,
  disabled = false,
}: {
  points: IncomePoint[];
  label?: string;
  tone?: IncomeTone;
  value?: number;
  onValueChange?: (index: number) => void;
  disabled?: boolean;
}) {
  const title = useId(),
    [internal, setInternal] = useState<number | undefined>(),
    [preview, setPreview] = useState<{
      points: IncomePoint[];
      index: number;
    } | null>(null);
  const selected = incomeIndex(value ?? internal, points.length),
    index = incomeIndex(
      !disabled && preview?.points === points ? preview.index : selected,
      points.length,
    ),
    point = points[index],
    valid = validIncome(points),
    previous = points[index - 1];
  return (
    <section className="if-card oreo-squircle" aria-labelledby={title}>
      <header>
        <h3 id={title}>{label}</h3>
        <p className="if-amount">
          {valid && point ? incomeMoney(point.amount) : "—"}
        </p>
      </header>
      <IncomeFlowChart
        points={points}
        value={index}
        tone={tone}
        label={label}
        disabled={disabled}
        onValueChange={(i) => {
          if (value === undefined) setInternal(i);
          onValueChange?.(i);
        }}
        onPreviewChange={(i) =>
          setPreview((old) =>
            i === null
              ? null
              : old?.points === points && old.index === i
                ? old
                : { points, index: i },
          )
        }
      />
      {valid && point && (
        <IncomeComparison
          current={point.amount}
          previous={previous?.amount}
          previousLabel={previous?.label}
        />
      )}
    </section>
  );
}

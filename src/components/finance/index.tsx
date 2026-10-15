import { useEffect, useId, useRef, useState } from "react";
import { AgentWorkspaceState } from "@/components/automation";
import { formatMoney } from "@/components/activity";
import { Icon } from "@/components/icon";
import "./finance.css";

export type FinanceTone =
  "purple" | "mint" | "blue" | "orange" | "pink" | "neutral";
export type BalancePoint = {
  label: string;
  income: number;
  expenses: number;
  savings: number;
};
export type Allocation = {
  id: string;
  label: string;
  amount: number;
  tone: FinanceTone;
};
const SERIES = [
  { key: "savings", label: "Savings", tone: "blue" },
  { key: "income", label: "Income", tone: "purple" },
  { key: "expenses", label: "Expenses", tone: "mint" },
] as const;
const safeAmount = (n: number) => (Number.isFinite(n) && n >= 0 ? n : 0);
export const allocationTotal = (items: Allocation[]) =>
  items.reduce((sum, item) => sum + safeAmount(item.amount), 0);

/** Finite, nonnegative snapshots. The caller owns aggregation and currency. */
export function BalanceChart({
  points,
  label = "Balance overview",
}: {
  points: BalancePoint[];
  label?: string;
}) {
  const id = useId();
  const [selected, setSelected] = useState<number | null>(null);
  const data = points.filter((p) =>
    [p.income, p.expenses, p.savings].every(
      (v) => Number.isFinite(v) && v >= 0,
    ),
  );
  const figure = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(710);
  useEffect(() => {
    if (!figure.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.max(240, entry.contentRect.width)),
    );
    observer.observe(figure.current);
    return () => observer.disconnect();
  }, [data.length]);
  if (!data.length)
    return (
      <AgentWorkspaceState
        title="No balance history"
        description="Add account snapshots to see income, expenses and savings together."
      />
    );
  const max = Math.max(
    1,
    ...data.flatMap((p) => [p.income, p.expenses, p.savings]),
  );
  const ceiling = Math.ceil(max / 1000) * 1000;
  const index = Math.max(
    0,
    Math.min(selected ?? Math.floor(data.length / 2), data.length - 1),
  );
  const active = data[index];
  const right = width - 16;
  const x = (i: number) =>
    data.length === 1
      ? (55 + right) / 2
      : 55 + (i / (data.length - 1)) * (right - 55);
  const y = (v: number) => 225 - (v / ceiling) * 190;
  return (
    <figure ref={figure} className="finance-chart">
      <div className="finance-legend">
        {SERIES.map((s) => (
          <span key={s.key}>
            <i data-finance-tone={s.tone} />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} 255`}
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
      >
        <title id={`${id}-title`}>{label}</title>
        <desc id={`${id}-desc`}>
          {active.label}.{" "}
          {SERIES.map((s) => `${s.label}: ${formatMoney(active[s.key])}`).join(
            ". ",
          )}
          . Use the range control or data table to inspect every point.
        </desc>
        <defs>
          <pattern
            id={`${id}-hatch`}
            width="10"
            height="10"
            patternTransform="rotate(40)"
            patternUnits="userSpaceOnUse"
          >
            <rect width="4" height="10" fill="var(--color-state-press)" />
          </pattern>
        </defs>
        {[0, 1, 2, 3].map((n) => (
          <g key={n}>
            <line
              x1="55"
              x2={right}
              y1={y((ceiling * n) / 3)}
              y2={y((ceiling * n) / 3)}
              stroke="var(--color-border-subtle)"
              strokeDasharray="4 5"
            />
            <text
              x="44"
              y={y((ceiling * n) / 3) + 4}
              textAnchor="end"
              className="finance-axis"
            >
              $
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format((ceiling * n) / 3)}
            </text>
          </g>
        ))}
        <rect
          x={x(index) - 20}
          y="25"
          width="40"
          height="200"
          fill={`url(#${id}-hatch)`}
        />
        <line
          x1={x(index)}
          x2={x(index)}
          y1="25"
          y2="225"
          stroke="var(--color-palette-purple-text)"
          strokeDasharray="4 5"
        />
        {SERIES.map((s) => (
          <g key={s.key} data-finance-tone={s.tone}>
            <path
              d={data
                .map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[s.key])}`)
                .join(" ")}
              stroke="currentColor"
              strokeWidth="2.5"
              fill="none"
              strokeLinejoin="round"
            />
            <circle
              cx={x(index)}
              cy={y(active[s.key])}
              r="4.5"
              fill="currentColor"
              stroke="var(--color-bg-surface)"
              strokeWidth="2"
            />
          </g>
        ))}
        <text x="55" y="250" className="finance-axis">
          {data[0].label}
        </text>
        <text x={right} y="250" textAnchor="end" className="finance-axis">
          {data[data.length - 1].label}
        </text>
      </svg>
      <figcaption>
        <div className="finance-readout">
          <strong>{active.label}</strong>
          {SERIES.map((s) => (
            <span key={s.key}>
              <i data-finance-tone={s.tone} />
              {s.label} <b>{formatMoney(active[s.key])}</b>
            </span>
          ))}
        </div>
        <label className="finance-scrubber">
          <span>Inspect date</span>
          <input
            type="range"
            min="0"
            max={data.length - 1}
            value={index}
            disabled={data.length === 1}
            onChange={(e) => setSelected(Number(e.target.value))}
            aria-valuetext={`${active.label}; ${SERIES.map((s) => `${s.label} ${formatMoney(active[s.key])}`).join(", ")}`}
          />
        </label>
      </figcaption>
      <details className="finance-data">
        <summary>View data table</summary>
        <div className="overflow-x-auto">
          <table>
            <caption className="sr-only">{label} in US dollars</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                {SERIES.map((s) => (
                  <th scope="col" key={s.key}>
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((p, i) => (
                <tr key={`${p.label}-${i}`}>
                  <th scope="row">{p.label}</th>
                  {SERIES.map((s) => (
                    <td key={s.key}>{formatMoney(p[s.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

export function AllocationBar({
  items,
  label = "Savings allocation",
}: {
  items: Allocation[];
  label?: string;
}) {
  const total = allocationTotal(items);
  if (!total)
    return (
      <AgentWorkspaceState
        title="No savings allocated"
        description="Add a positive amount to start building your savings plan."
      />
    );
  return (
    <div className="finance-allocation">
      <div
        className="finance-segments"
        role="img"
        aria-label={`${label}: ${items.map((i) => `${i.label} ${formatMoney(safeAmount(i.amount))}`).join(", ")}`}
      >
        {items
          .filter((i) => safeAmount(i.amount) > 0)
          .map((i) => (
            <span
              key={i.id}
              data-finance-tone={i.tone}
              style={{ flexGrow: safeAmount(i.amount) / total }}
            />
          ))}
      </div>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <span>
              <i data-finance-tone={i.tone} />
              {i.label}
            </span>
            <strong>{formatMoney(safeAmount(i.amount))}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpendingGauge({
  items,
  limit,
  label = "Monthly spending",
}: {
  items: Allocation[];
  limit: number;
  label?: string;
}) {
  const total = allocationTotal(items);
  const valid = Number.isFinite(limit) && limit > 0;
  const denominator = Math.max(total, valid ? limit : 0, 1);
  let offset = 0;
  return (
    <div className="finance-spending">
      <div
        className="finance-gauge"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={valid ? limit : Math.max(total, 1)}
        aria-valuenow={valid ? Math.min(total, limit) : total}
        aria-valuetext={
          valid
            ? `${formatMoney(total)} of ${formatMoney(limit)}; ${Math.round((total / limit) * 100)} percent spent${total > limit ? "; over budget" : ""}`
            : `${formatMoney(total)} spent; no budget set`
        }
      >
        <svg viewBox="0 0 260 155" aria-hidden="true">
          <path
            d="M25 130 A105 105 0 0 1 235 130"
            fill="none"
            stroke="var(--color-state-press)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {items.map((i) => {
            const size = (safeAmount(i.amount) / denominator) * 100;
            const start = offset;
            offset += size;
            return (
              size > 0 && (
                <path
                  key={i.id}
                  data-finance-tone={i.tone}
                  d="M25 130 A105 105 0 0 1 235 130"
                  pathLength="100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="22"
                  strokeDasharray={`${Math.max(0, size - 0.7)} 100`}
                  strokeDashoffset={-start}
                />
              )
            );
          })}
        </svg>
        <div aria-hidden="true">
          <span>Total spent</span>
          <strong>{formatMoney(total)}</strong>
        </div>
      </div>
      <ul className="finance-gauge-legend">
        {items.map((i) => (
          <li key={i.id}>
            <i data-finance-tone={i.tone} />
            <span>{i.label}</span>
            <strong>{formatMoney(safeAmount(i.amount))}</strong>
          </li>
        ))}
      </ul>
      <p className={total > limit && valid ? "finance-over" : ""}>
        {valid
          ? total > limit
            ? `${formatMoney(total - limit)} over your ${formatMoney(limit)} budget`
            : `${formatMoney(limit - total)} left of your ${formatMoney(limit)} budget`
          : "Set a positive budget to track remaining spend."}
      </p>
    </div>
  );
}

/** Display-only card. Never accepts or reveals a full card number. */
export function PaymentCard({
  holder,
  lastFour,
  label = "Everyday card",
  frozen = false,
}: {
  holder: string;
  lastFour: string;
  label?: string;
  frozen?: boolean;
}) {
  const digits = /^\d{4}$/.test(lastFour) ? lastFour : "••••";
  return (
    <article
      className="finance-payment-card"
      aria-label={`${label}, ${frozen ? "frozen" : "active"}, ending ${digits}, ${holder}`}
      data-frozen={frozen || undefined}
    >
      <header>
        <span className="finance-card-mark">
          <Icon name="sparkle" size="lg" />
        </span>
        <span>{frozen ? "Frozen" : label}</span>
      </header>
      <div>
        <p>Card number</p>
        <strong className="finance-card-number">•••• •••• •••• {digits}</strong>
      </div>
      <footer>
        <span>{holder}</span>
        <Icon name={frozen ? "lock" : "checks"} />
      </footer>
    </article>
  );
}

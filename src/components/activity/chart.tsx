import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import "./activity.css";

export type UsagePoint = { label: string; value: number };
export const formatMoney = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

/** Geometry is in SVG units; all visible colors come from Oreo tokens. */
export function UsageChart({ points, forecast, limit, endLabel, className }: {
  points: UsagePoint[]; forecast?: number; limit?: number; endLabel: string; className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const [selection, setSelection] = useState<number | null>(null);
  const data = points.filter(p => Number.isFinite(p.value) && p.value >= 0);
  const figure = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(900);
  useEffect(() => {
    if (!figure.current) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(figure.current);
    return () => observer.disconnect();
  }, [data.length]);
  if (!data.length) return <div className="activity-empty" role="status">No usage data for this period.</div>;
  const last = data[data.length - 1];
  const projected = forecast != null && Number.isFinite(forecast) && forecast >= 0 ? forecast : undefined;
  const budget = limit != null && Number.isFinite(limit) && limit > 0 ? limit : undefined;
  const highest = Math.max(...data.map(p => p.value), projected ?? 0, budget ?? 0, 1);
  const magnitude = 10 ** Math.floor(Math.log10(highest / 3));
  const step = [1, 2, 5, 10].map(n => n * magnitude).find(n => n >= highest / 3) ?? magnitude * 10;
  const max = step * 3;
  const right = width - 14;
  const xEnd = projected == null ? right : 48 + (right - 48) * .61;
  const x = (i: number) => 48 + (i / Math.max(1, data.length - 1)) * (xEnd - 48);
  const y = (value: number) => 246 - value / max * 222;
  const line = data.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const selected = Math.min(selection ?? data.length - 1, data.length - 1);
  const point = data[selected];
  return <figure ref={figure} className={cn("activity-chart", className)}>
    <svg viewBox={`0 0 ${width} 282`} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>Cumulative workspace usage</title>
      <desc id={`${id}-desc`}>{last.label}: {formatMoney(last.value)}.{projected != null ? ` Forecast for ${endLabel}: ${formatMoney(projected)}.` : ""}{budget ? ` Workspace limit: ${formatMoney(budget)}.` : ""}</desc>
      <defs>
        <linearGradient id={`${id}-area`} x1="0" x2="0" y1="0" y2="1"><stop stopColor="var(--activity-usage)" stopOpacity=".12" /><stop offset="1" stopColor="var(--activity-usage)" stopOpacity="0" /></linearGradient>
        <pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="var(--activity-forecast)" strokeOpacity=".07" strokeWidth="3" /></pattern>
        <filter id={`${id}-glow`} x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      {[0, 1, 2, 3].map(n => <g key={n}><line x1="48" x2={right} y1={y(max * n / 3)} y2={y(max * n / 3)} stroke="var(--color-border-subtle)" /><text x="38" y={y(max * n / 3) + 4} textAnchor="end" className="activity-axis">{n ? `$${new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(max * n / 3)}` : "$0"}</text></g>)}
      <path d={`${line} L${xEnd},246 L48,246 Z`} fill={`url(#${id}-area)`} />
      {projected != null && <><path d={`M${xEnd},${y(last.value)} L${right},${y(projected)} L${right},246 L${xEnd},246 Z`} fill={`url(#${id}-hatch)`} /><path d={`M${xEnd},${y(last.value)} L${right},${y(projected)}`} stroke="var(--activity-forecast)" fill="none" strokeWidth="1.8" /><circle cx={right} cy={y(projected)} r="9" fill="var(--activity-forecast)" opacity=".45" filter={`url(#${id}-glow)`} /><circle cx={right} cy={y(projected)} r="3.5" fill="var(--color-bg-base)" stroke="var(--activity-forecast)" strokeWidth="2" /><text x={right} y={y(projected) - 14} textAnchor="end" className="activity-forecast-label">{formatMoney(projected)}</text></>}
      {budget && <line x1="48" x2={right} y1={y(budget)} y2={y(budget)} stroke="var(--color-text-tertiary)" strokeDasharray="3 4" />}
      <path d={line} stroke="var(--activity-usage)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <line x1={x(selected)} x2={x(selected)} y1="24" y2="246" stroke="var(--color-border-default)" strokeDasharray="3 4" />
      <circle cx={x(selected)} cy={y(point.value)} r="9" fill="var(--activity-usage)" opacity=".35" filter={`url(#${id}-glow)`} /><circle cx={x(selected)} cy={y(point.value)} r="3.5" stroke="var(--activity-usage)" strokeWidth="2" fill="var(--color-bg-base)" />
      <text x="48" y="274" className="activity-axis">{data[0].label}</text><text x={xEnd} y="274" textAnchor={projected == null ? "end" : "middle"} className="activity-axis">{last.label}</text>{projected != null && <text x={right} y="274" textAnchor="end" className="activity-axis">{endLabel}</text>}
    </svg>
    <figcaption className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary"><label className="flex items-center gap-3"><span className="sr-only">Inspect usage day</span><input type="range" min="0" max={data.length - 1} value={selected} onChange={e => setSelection(Number(e.target.value))} aria-valuetext={`${point.label}, ${formatMoney(point.value)}`} className="w-20 accent-[var(--activity-usage)]" /><output className="tabular-nums">{point.label} · {formatMoney(point.value)}</output></label><span className="flex flex-wrap gap-4"><span><i className="activity-legend bg-[var(--activity-usage)]" />Usage</span>{projected != null && <span><i className="activity-legend bg-[var(--activity-forecast)]" />Forecast</span>}{budget && <span><i className="activity-legend bg-text-tertiary" />Limit</span>}</span></figcaption>
  </figure>;
}

export type ActivityBar = { value: number; failed?: boolean };
export function ActivityBars({ values, label, tone = "usage" }: { values: ActivityBar[]; label: string; tone?: "usage" | "neutral" }) {
  return <div className="activity-bars" role="img" aria-label={label}>{values.map((bar, i) => <span key={i} className="activity-bar"><span data-failed={bar.failed || undefined} data-tone={tone} style={{ height: `${Math.min(100, Math.max(0, Number.isFinite(bar.value) ? bar.value : 0))}%` }} /></span>)}</div>;
}

import { useId, type ReactNode } from "react";
import { Button, IconButton, type ButtonProps } from "@/components/button";
import { Avatar, type AvatarColor } from "@/components/avatar";
import { Icon, type IconName } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { cn } from "@/lib/cn";
import "./prospecting.css";

export function MiniBarChart({ values = [12, 72, 86, 91, 100, 87], label = "Trend over the selected period" }: { values?: number[]; label?: string }) {
  const safe = values.map(value => Number.isFinite(value) ? Math.max(0, value) : 0);
  const max = Math.max(1, ...safe);
  return <span role="img" aria-label={label} className="prospect-bars">{safe.map((value, i) => <span key={i} style={{ height: `${Math.max(6, value / max * 100)}%` }} />)}</span>;
}

export type ProspectMetricProps = { label: string; value: string; change: string; description: string; trend?: "up" | "down"; sentiment?: "positive" | "negative"; bars?: number[]; className?: string };
export function ProspectMetric({ label, value, change, description, trend = "up", sentiment, bars, className }: ProspectMetricProps) {
  return <article className={cn("prospect-metric", className)}><p className="text-sm text-text-secondary">{label}</p><div className="mt-3 flex items-end justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-baseline gap-x-2 gap-y-1"><strong className="text-4xl font-semibold tracking-tight tabular-nums">{value}</strong><span className={cn("inline-flex items-center gap-1 text-sm font-medium", (sentiment ?? (trend === "up" ? "positive" : "negative")) === "positive" ? "prospect-positive" : "text-status-error")}><Icon name={trend === "up" ? "arrow-up-right" : "arrow-down"} size="sm" />{change}</span></div><p className="mt-2 text-xs text-text-tertiary">{description}</p></div><MiniBarChart values={bars} label={`${label} trend`} /></div></article>;
}

export function ScoreMeter({ value, label = "AI score", className }: { value: number; label?: string; className?: string }) {
  const score = Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
  return <span role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} className={cn("prospect-score", className)} data-qualified={score >= 75}><span aria-hidden="true" className="flex gap-1">{Array.from({ length: 10 }, (_, i) => <span key={i} data-filled={i < Math.round(score / 10)} className="prospect-score-segment" />)}</span><span aria-hidden="true" className="w-7 text-sm font-medium tabular-nums">{score}</span></span>;
}

export const SIGNAL_TYPES = ["funding", "role", "launch", "expansion", "intent", "growth"] as const;
export type SignalType = typeof SIGNAL_TYPES[number];
const signals: Record<SignalType, { icon: IconName; color: string }> = {
  funding: { icon: "gauge", color: "text-palette-pink-text" }, role: { icon: "smiley", color: "text-palette-orange-text" },
  launch: { icon: "plane", color: "text-status-progress" }, expansion: { icon: "globe", color: "prospect-positive" },
  intent: { icon: "arrow-up-right", color: "text-palette-purple-text" }, growth: { icon: "chart-line", color: "text-palette-pink-text" },
};
export function BuyingSignal({ type, children }: { type: SignalType; children: ReactNode }) {
  return <span className="inline-flex items-center gap-2.5 text-sm"><Icon name={signals[type].icon} size="sm" className={cn("shrink-0", signals[type].color)} /><span>{children}</span></span>;
}

export function ProspectAction({ className, children = "Find prospects", ...props }: Omit<ButtonProps, "class">) {
  return <Button {...props} tapScale={1} leadingIcon={<Icon name="sparkle" />} className={cn("prospect-action", className)}>{children}</Button>;
}

export function ProspectPanel({ title, description, icon, tone = "blue", action, children, className }: { title: string; description?: string; icon: IconName; tone?: "blue" | "mint"; action?: ReactNode; children: ReactNode; className?: string }) {
  const id = useId();
  return <section aria-labelledby={id} className={cn("prospect-panel", className)}><header className="flex flex-wrap items-center justify-between gap-3 p-5"><div className="flex min-w-0 items-center gap-3"><span className="prospect-panel-icon" data-tone={tone}><Icon name={icon} /></span><div className="min-w-0"><h2 id={id} className="text-base font-semibold tracking-tight">{title}</h2>{description && <p className="mt-1 text-xs leading-5 text-text-tertiary">{description}</p>}</div></div>{action}</header><div className="prospect-panel-content">{children}</div></section>;
}

export type Prospect = { id: string; name: string; role: string; company: string; color?: AvatarColor; signal: string; signalType: SignalType; score: number };
export function ProspectTable({ prospects, savedIds, onToggleSave, onDismiss, ascending, onSort, footer, empty }: { prospects: Prospect[]; savedIds: readonly string[]; onToggleSave: (id: string) => void; onDismiss?: (id: string) => void; ascending: boolean; onSort: () => void; footer?: ReactNode; empty?: ReactNode }) {
  return <><div className="relative overflow-x-auto"><table className="prospect-table"><caption className="sr-only">Recommended prospects, buying signals and AI scores</caption><thead><tr><th scope="col">Prospect</th><th scope="col">Why now</th><th scope="col" aria-sort={ascending ? "ascending" : "descending"}><button type="button" onClick={onSort} className="inline-flex items-center gap-2 rounded-control focus-visible:outline-2 focus-visible:outline-status-progress">AI score <Icon name={ascending ? "arrow-up" : "arrow-down"} size="sm" /></button></th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>{prospects.map(prospect => {
    const saved = savedIds.includes(prospect.id);
    return <tr key={prospect.id}><th scope="row"><div className="flex items-center gap-3"><Avatar name={prospect.name} color={prospect.color ?? "default"} size="md" /><span className="min-w-0"><span className="block text-sm font-medium">{prospect.name}</span><span className="mt-1 block max-w-56 truncate text-xs font-normal text-text-secondary" title={`${prospect.role} · ${prospect.company}`}>{prospect.role} · {prospect.company}</span></span></div></th><td><BuyingSignal type={prospect.signalType}>{prospect.signal}</BuyingSignal></td><td><ScoreMeter value={prospect.score} label={`${prospect.name} AI score`} /></td><td><div className="flex gap-1"><IconButton aria-label={`${saved ? "Unsave" : "Save"} ${prospect.name}`} aria-pressed={saved} type="tertiary" size="md" tapScale={1} icon={<Icon name={saved ? "check" : "plus"} />} onClick={() => onToggleSave(prospect.id)} />{onDismiss && <Menu><MenuTrigger render={<IconButton type="tertiary" tapScale={1} aria-label={`More actions for ${prospect.name}`} icon={<Icon name="ellipsis" />} />} /><MenuPopup align="end"><MenuItem onClick={() => onToggleSave(prospect.id)} icon={<Icon name={saved ? "check" : "plus"} />}>{saved ? "Remove from saved" : "Save prospect"}</MenuItem><MenuItem onClick={() => onDismiss(prospect.id)} icon={<Icon name="x" />}>Dismiss recommendation</MenuItem></MenuPopup></Menu>}</div></td></tr>;
  })}</tbody></table>{prospects.length === 0 && <div className="p-10 text-center">{empty ?? <p className="text-sm text-text-secondary">No prospects to show.</p>}</div>}</div>{footer && <footer className="border-t border-border-subtle px-5 py-3.5 text-xs text-text-secondary">{footer}</footer>}</>;
}

export type ProspectActivity = { id: string; title: string; detail: string; icon: IconName; tone?: "mint" | "purple" | "neutral" };
export function ActivityTimeline({ items, empty = "No activity yet." }: { items: ProspectActivity[]; empty?: string }) {
  return items.length ? <ol className="prospect-timeline">{items.map(item => <li key={item.id}><span className={cn("prospect-timeline-icon", item.tone === "mint" ? "prospect-positive" : item.tone === "purple" ? "text-palette-purple-text" : "text-text-secondary")}><Icon name={item.icon} size="sm" /></span><div className="pb-7"><p className="text-sm leading-6">{item.title}</p><p className="mt-1.5 text-xs leading-5 text-text-tertiary">{item.detail}</p></div></li>)}</ol> : <p className="p-8 text-center text-sm text-text-secondary">{empty}</p>;
}

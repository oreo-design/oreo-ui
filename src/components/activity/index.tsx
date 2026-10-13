import { useId, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/cn";
import { formatMoney } from "./chart";
import "./activity.css";
export { UsageChart, ActivityBars, formatMoney, type UsagePoint, type ActivityBar } from "./chart";

export function ActivityCard({ title, description, onOpen, children, className }: { title: string; description?: string; onOpen?: () => void; children: ReactNode; className?: string }) {
  const id = useId();
  return <section className={cn("activity-card", className)} aria-labelledby={id}><header className="mb-6 flex items-start justify-between gap-2"><div><h2 id={id} className="text-base font-medium">{title}</h2>{description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}</div>{onOpen && <IconButton type="tertiary" size="sm" tapScale={1} aria-label={`Open ${title}`} onClick={onOpen} icon={<Icon name="chevron-right" size="sm" />} />}</header>{children}</section>;
}

export function BudgetMeter({ used, limit, label = "Workspace limit", onEdit }: { used: number; limit: number; label?: string; onEdit?: () => void }) {
  const valid = Number.isFinite(used) && used >= 0 && Number.isFinite(limit) && limit > 0;
  const percent = valid ? used / limit * 100 : 0;
  return <div className="activity-budget"><div className="mb-3 flex items-center justify-between gap-2"><span className="text-sm">{label}<span className="ml-2 text-text-secondary">{valid ? `${Math.round(percent)}%` : "Not set"}</span></span>{onEdit && <IconButton aria-label={`Edit ${label.toLowerCase()}`} type="tertiary" size="sm" tapScale={1} onClick={onEdit} icon={<Icon name="sliders" size="sm" />} />}</div><div className="activity-meter" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={valid ? limit : 1} aria-valuenow={valid ? Math.min(used, limit) : 0} aria-valuetext={valid ? `${formatMoney(used)} of ${formatMoney(limit)}; ${Math.round(percent)} percent used` : "Budget not set"}><span data-exceeded={percent > 100 || undefined} style={{ width: `${Math.min(100, percent)}%` }} /></div><p className="mt-3 text-xs text-text-secondary">{valid ? <>{formatMoney(used)} of {formatMoney(limit)} / mo{percent > 100 && <span className="ml-2 text-status-error">Over budget</span>}</> : "Set a positive monthly limit to track your budget."}</p></div>;
}

export type RankedMember = { id: string; name: string; amount: number };
export function SpendLeaderboard({ members }: { members: RankedMember[] }) {
  const sorted = [...members].sort((a, b) => b.amount - a.amount);
  if (!sorted.length) return <p className="activity-empty">No member usage yet.</p>;
  return <ol className="activity-ranking">{sorted.map((member, i) => <li key={member.id}><span className="relative"><Avatar name={member.name} size="sm" /><span className="activity-rank" data-rank={i + 1}>{i + 1}</span></span><span className="min-w-0 flex-1 truncate">{member.name}</span><span className="text-sm tabular-nums">{formatMoney(member.amount)}</span></li>)}</ol>;
}

export type RequestEntry = { id: string; model: string; actor: string; status: number; time: string; tokens: string; cost: string };
export function RequestLog({ entries, onSelect, empty }: { entries: RequestEntry[]; onSelect?: (entry: RequestEntry) => void; empty?: ReactNode }) {
  if (!entries.length) return <div className="activity-empty" role="status">{empty ?? "No requests match your filters."}</div>;
  return <ul className="activity-requests">{entries.map(entry => <li key={entry.id}>{onSelect ? <button type="button" onClick={() => onSelect(entry)} aria-label={`${entry.model}, ${entry.status}, ${entry.actor}, ${entry.time}`}><RequestContent entry={entry} /></button> : <div><RequestContent entry={entry} /></div>}</li>)}</ul>;
}
function RequestContent({ entry }: { entry: RequestEntry }) { return <><span className="activity-status" data-failed={entry.status >= 400 || undefined}>{entry.status}</span><span className="min-w-0 flex-1 truncate">{entry.model}<span className="text-text-secondary"> · {entry.actor}</span></span><span className="shrink-0 text-xs text-text-secondary">{entry.time}</span></>; }

export type AuditEntry = { id: string; title: string; actor: string; time: string; highlighted?: boolean };
export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) return <p className="activity-empty">No workspace changes yet.</p>;
  return <ol className="activity-timeline">{entries.map(entry => <li key={entry.id} data-highlighted={entry.highlighted || undefined}><span className="activity-timeline-dot" aria-hidden /><div className="min-w-0"><div className="flex flex-wrap justify-between gap-x-3 gap-y-1 text-sm"><span>{entry.title}</span><span className="text-xs text-text-secondary">{entry.time}</span></div><div className="mt-2 flex items-center gap-2 text-xs text-text-secondary"><Avatar name={entry.actor} size="xs" /><span className="truncate">{entry.actor}</span></div></div></li>)}</ol>;
}

export function ActivityWorkspaceShell({ header, navigation, children }: { header: ReactNode; navigation: ReactNode; children: ReactNode }) {
  return <div className="activity-root min-h-dvh bg-bg-base px-2 pb-2 text-text-primary sm:px-3 sm:pb-3"><header className="mx-auto flex min-h-14 max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-3 py-3 text-sm">{header}</header><div className="mx-auto min-h-[calc(100dvh-4.25rem)] max-w-screen-2xl rounded-card-medium border border-border-subtle bg-bg-elevated"><div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 sm:px-7">{navigation}</div><main className="px-4 py-7 sm:px-8 sm:py-10 xl:px-16 xl:py-14">{children}</main></div></div>;
}

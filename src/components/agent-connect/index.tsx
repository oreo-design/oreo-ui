import { useId, type ReactNode, type CSSProperties } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { cn } from "@/lib/cn";
import "./agent-connect.css";

export type AgentClient = { id: string; name: string; description: string; mark?: ReactNode; disabled?: boolean };

/** Decorative identities only. The adjacent title and CTA explain the action. */
export function AgentConnectCard({ title = "Your workspace, in your AI.", description = "Connect your favorite tools with Oreo MCP.", marks, actionLabel = "Set up agents", onAction, className }: { title?: string; description?: string; marks: ReactNode[]; actionLabel?: string; onAction: () => void; className?: string }) {
  const id = useId();
  const visible = marks.slice(0, 5);
  return <section aria-labelledby={id} className={cn("agent-connect-card", className)}>
    <div className="agent-connect-orbit" aria-hidden="true"><div className="agent-connect-horizon" />{visible.map((mark, i) => {
      const offset = i - (visible.length - 1) / 2;
      return <span key={i} className="agent-connect-orb" style={{ "--orbit-x": `${offset * 24}%`, "--orbit-y": `${offset * offset * 10}px`, "--orbit-size": Math.abs(offset) < .6 ? "3.75rem" : "3rem" } as CSSProperties}>{mark}</span>;
    })}</div>
    <div className="agent-connect-copy"><h2 id={id}>{title}</h2><p>{description}</p><Button tapScale={1} onClick={onAction} trailingIcon={<Icon name="arrow-up-right" size="sm" />}>{actionLabel}</Button></div>
  </section>;
}

/** Displays actual usage even over quota; the visual ring is clamped. Invalid usage is unknown. */
export function QuotaUsage({ label, used, limit, className }: { label: string; used: number; limit?: number; className?: string }) {
  const validUsed = Number.isFinite(used) && used >= 0;
  const validLimit = limit !== undefined && Number.isFinite(limit) && limit > 0;
  const ratio = validUsed && validLimit ? Math.min(used / limit, 1) : 0;
  const format = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const value = validUsed ? format(used) : "Unknown";
  const maximum = validLimit ? format(limit) : "No limit set";
  return <div className={cn("agent-quota", className)}>
    <svg viewBox="0 0 32 32" className="agent-quota-ring" role={validUsed && validLimit ? "meter" : "img"} aria-label={label} aria-valuemin={validUsed && validLimit ? 0 : undefined} aria-valuemax={validUsed && validLimit ? limit : undefined} aria-valuenow={validUsed && validLimit ? Math.min(used, limit) : undefined} aria-valuetext={validUsed && validLimit ? `${value} used · ${maximum}${used > limit ? " · Over limit" : ""}` : undefined}><title>{label}: {value} used · {maximum}</title><circle cx="16" cy="16" r="12" fill="none" stroke="var(--color-border-default)" strokeWidth="3" /><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="3" pathLength="100" strokeDasharray={`${ratio * 100} 100`} transform="rotate(-90 16 16)" /></svg>
    <div><p><strong>{value}</strong><span> / {maximum}</span></p><p className="agent-quota-label">{label}{validUsed && validLimit && used > limit && <span className="text-status-error"> · Over limit</span>}</p></div>
  </div>;
}

/** Native radio semantics include arrow-key navigation and a single Tab stop. */
export function AgentClientPicker({ clients, value, onValueChange, label = "Choose your client" }: { clients: AgentClient[]; value: string; onValueChange: (id: string) => void; label?: string }) {
  const name = useId();
  return <fieldset className="agent-client-fieldset"><legend>{label}</legend>{clients.length ? <div className="agent-client-grid">{clients.map(client => <label className="agent-client" key={client.id} data-disabled={client.disabled || undefined}>
    <input type="radio" name={name} value={client.id} checked={value === client.id} disabled={client.disabled} onChange={() => onValueChange(client.id)} />
    <span className="agent-client-mark" aria-hidden="true">{client.mark ?? client.name.slice(0, 1)}</span><span className="min-w-0"><strong>{client.name}</strong><span className="agent-client-description">{client.description}</span></span><span className="agent-client-check" aria-hidden="true"><Icon name="check" size="sm" /></span>
  </label>)}</div> : <AgentWorkspaceState title="No clients available" description="Add a supported client to begin setting up a connection." />}</fieldset>;
}

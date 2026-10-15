import { useId, type ReactNode } from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { Tabs } from "@base-ui-components/react/tabs";
import { Button } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { cn } from "@/lib/cn";
import "./automation.css";

export type WorkspaceNavGroup = { label: string; items: { label: string; href: string; icon: IconName; active?: boolean }[] };

/** Link destinations and active state belong to the host, not this navigation. */
export function AgentWorkspaceNav({ brand, groups, footer }: { brand: ReactNode; groups: WorkspaceNavGroup[]; footer?: ReactNode }) {
  return <nav aria-label="Studio navigation" className="agent-nav">
    <div className="agent-nav-brand">{brand}</div>
    <div className="agent-nav-groups">{groups.map(group => <section key={group.label} aria-label={group.label}>
      <h2>{group.label}</h2><ul>{group.items.map(item => <li key={item.href}><a href={item.href} aria-current={item.active ? "page" : undefined}><Icon name={item.icon} /><span>{item.label}</span></a></li>)}</ul>
    </section>)}</div>
    {footer && <div className="agent-nav-footer">{footer}</div>}
  </nav>;
}

/** Responsive composition only; no hidden mobile panels or application state. */
export function AgentWorkspaceShell({ navigation, assistant, workspace }: { navigation: ReactNode; assistant: ReactNode; workspace: ReactNode }) {
  return <div className="agent-shell">{navigation}<div className="agent-shell-assistant">{assistant}</div><div className="agent-shell-workspace">{workspace}</div></div>;
}

export function AgentWorkspacePanel({ title, icon, actions, footer, children, className }: { title: string; icon?: IconName; actions?: ReactNode; footer?: ReactNode; children: ReactNode; className?: string }) {
  const id = useId();
  return <section aria-labelledby={id} className={cn("agent-panel", className)}>
    <header className="agent-panel-header"><h2 id={id}>{icon && <Icon name={icon} />}{title}</h2><div className="flex items-center gap-1">{actions}</div></header>
    <div className="agent-panel-body">{children}</div>
    {footer && <footer className="agent-panel-footer">{footer}</footer>}
  </section>;
}

export type AgentResultState = "ready" | "running" | "error";
const stateLabel: Record<AgentResultState, string> = { ready: "Ready to review", running: "In progress", error: "Needs attention" };

/** Controlled or uncontrolled disclosure. Status is conveyed by text as well as color. */
export function AgentResultCard({ title, icon = "folder", status = "ready", open, onOpenChange, children }: { title: string; icon?: IconName; status?: AgentResultState; open?: boolean; onOpenChange?: (open: boolean) => void; children: ReactNode }) {
  return <Collapsible.Root open={open} onOpenChange={onOpenChange} className="agent-result" data-status={status}>
    <Collapsible.Trigger className="agent-result-trigger"><span className="agent-result-mark"><Icon name={icon} /></span><span className="min-w-0 flex-1 text-left [overflow-wrap:anywhere]">{title}</span><span className="agent-result-dot" aria-label={stateLabel[status]} role="img" /><Icon name="chevron-down" size="sm" className="text-text-tertiary" /></Collapsible.Trigger>
    <Collapsible.Panel className="agent-result-detail"><p className="mb-3 text-xs text-text-secondary">{stateLabel[status]}</p>{children}</Collapsible.Panel>
  </Collapsible.Root>;
}

export type AgentSummaryStep = { title: string; description: string };
export function AgentRunSummary({ duration, title = "Done! Here's what was built:", result, steps }: { duration: string; title?: string; result?: ReactNode; steps: AgentSummaryStep[] }) {
  return <section aria-label="Agent run summary" className="agent-summary"><p className="agent-summary-duration">Worked for {duration}</p><h3>{title}</h3>{result}<ol>{steps.map((step, index) => <li key={`${index}-${step.title}`}><span className="font-medium">{step.title}</span><span> — {step.description}</span></li>)}</ol></section>;
}

export type AutomationView = "build" | "canvas";
/** Both views represent the same host-owned workflow. Tabs handle keyboard navigation. */
export function AutomationViews({ value, onValueChange, build, canvas, actions }: { value: AutomationView; onValueChange: (value: AutomationView) => void; build: ReactNode; canvas: ReactNode; actions?: ReactNode }) {
  return <Tabs.Root value={value} onValueChange={value => { if (value === "build" || value === "canvas") onValueChange(value); }} className="agent-views">
    <div className="agent-view-toolbar"><Tabs.List aria-label="Automation view" activateOnFocus className="agent-view-tabs">{(["build", "canvas"] as const).map(view => <Tabs.Tab value={view} key={view}>{view === "build" ? "Build" : "Canvas"}</Tabs.Tab>)}</Tabs.List>{actions}</div>
    <Tabs.Panel value="build" className="agent-view-content">{build}</Tabs.Panel>
    <Tabs.Panel value="canvas" className="agent-view-content preview-grid">{canvas}</Tabs.Panel>
  </Tabs.Root>;
}

export type AutomationStep = { id: string; title: string; description: string; icon: IconName; kind: "Trigger" | "Condition" | "Action" };
export function AutomationStepCard({ step, selected = false, onSelect }: { step: AutomationStep; selected?: boolean; onSelect: (id: string) => void }) {
  return <button type="button" className="agent-step" aria-pressed={selected} onClick={() => onSelect(step.id)}><span className="agent-step-icon"><Icon name={step.icon} /></span><span className="min-w-0"><span className="mb-1 block text-xs text-text-tertiary">{step.kind}</span><span className="block text-sm font-medium">{step.title}</span><span className="mt-1 block text-xs leading-5 text-text-secondary">{step.description}</span></span><Icon name="chevron-right" size="sm" className="shrink-0 text-text-tertiary" /></button>;
}

/** One empty/error owner for the assistant and its associated workspace. */
export function AgentWorkspaceState({ title, description, error = false, actionLabel, onAction }: { title: string; description: string; error?: boolean; actionLabel?: string; onAction?: () => void }) {
  return <div className="agent-workspace-state" role={error ? "alert" : undefined}><Icon name={error ? "warning-circle" : "sparkle"} size="lg" className={error ? "text-status-error" : "text-text-tertiary"} /><h3 className="text-base font-medium">{title}</h3><p className="max-w-xs text-sm leading-6 text-text-secondary">{description}</p>{actionLabel && onAction && <Button type="secondary" tapScale={1} onClick={onAction}>{actionLabel}</Button>}</div>;
}

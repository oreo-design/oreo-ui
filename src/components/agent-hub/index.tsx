import { useId, useRef, useImperativeHandle, type Ref, type MouseEvent } from "react";
import { Icon, type IconName } from "@/components/icon";
import { IconButton } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import "./agent-hub.css";

export function HubSearchHero({ value, onValueChange, title = "Agent hub", description = "Discover agents and integrations built for your team.", inputRef, shortcut = false }: {
  value: string; onValueChange: (value: string) => void; title?: string; description?: string; inputRef?: Ref<HTMLInputElement>; shortcut?: boolean;
}) {
  const id = useId();
  const internalRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(inputRef, () => internalRef.current!);
  return <section className="hub-search-hero" aria-labelledby={id}>
    <h1 id={id}>{title}</h1><p>{description}</p>
    <label className="hub-search-field"><Icon name="search" size="sm"/><span className="sr-only">Search agents and integrations</span>
      <input ref={internalRef} aria-label="Search agents and integrations" type="search" value={value} onChange={e => onValueChange(e.target.value)} placeholder="Search agents by name, category or tag…" maxLength={100}/>
      {value ? <IconButton type="tertiary" size="sm" tapScale={1} aria-label="Clear search" onClick={() => { onValueChange(""); internalRef.current?.focus(); }} icon={<Icon name="x" size="sm"/>}/> : shortcut && <kbd aria-label="Slash to focus search">/</kbd>}
    </label>
  </section>;
}

export type AgentCategory = { id: string; name: string; description: string; icon: IconName; count: number };
export function AgentCategoryGrid({ items, selectedId, onSelect, label = "Agent categories" }: {
  items: AgentCategory[]; selectedId?: string; onSelect: (id: string) => void; label?: string;
}) {
  if (!items.length) return <AgentWorkspaceState title="No categories yet" description="Add categories to organize the work your agents do."/>;
  return <div className="hub-category-grid" role="group" aria-label={label}>{items.map(item => <button type="button" key={item.id} className="hub-category" aria-pressed={item.id === selectedId} onClick={() => onSelect(item.id)}>
    <span className="hub-category-icon" aria-hidden="true"><Icon name={item.icon}/></span>
    <span className="hub-tile-copy"><strong>{item.name}</strong><span>{item.description}</span></span>
    <span className="hub-count">{item.count}<span className="sr-only"> {item.count===1?"agent":"agents"}</span></span><Icon name="chevron-right" size="sm" className="text-text-tertiary"/>
  </button>)}</div>;
}

export type HubIntegration = { id: string; name: string; description: string; icon: IconName; tone: "mint" | "purple" | "orange" | "blue" | "neutral" };
export function IntegrationTile({ integration, connected, agentCount = 0, onOpen }: {
  integration: HubIntegration; connected: boolean; agentCount?: number; onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return <button type="button" className="hub-integration-tile" onClick={onOpen} aria-label={`${integration.name}, ${connected ? "connected" : "not connected"}, ${agentCount} ${agentCount===1?"agent":"agents"}. View integration`}>
    <span className="hub-integration-icon" data-tone={integration.tone} aria-hidden="true"><Icon name={integration.icon}/></span>
    <span className="hub-tile-copy"><strong>{integration.name}</strong><span>{integration.description}</span></span>
    <span className="hub-integration-state" data-connected={connected}><i aria-hidden="true"/>{connected ? `${agentCount} ${agentCount===1?"agent":"agents"}` : "Connect"}</span><Icon name="chevron-right" size="sm" className="text-text-tertiary"/>
  </button>;
}

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Switch } from "@/components/switch";
import { SettingsCard, SettingsPageHeader, SettingsRow, SettingsSelect, SettingsEditor } from "@/patterns/settings";
import { SettingsGroup } from "@/patterns/settings/language/SettingsGroup";
import { AdaptiveRow, SettingsFlow } from "@/patterns/settings/language/AdaptiveRow";

export type Recipe = "preferences" | "workspace" | "integrations" | "export";
export type Connection = "connected" | "disconnected" | "connecting" | "error";
export type Service = { id: string; name: string; icon: IconName; description: string; account: string };
export const SERVICES: Service[] = [
  { id: "github", name: "GitHub", icon: "github-logo", description: "Bring issues, pull requests and project context into your workspace.", account: "aster-studio" },
  { id: "calendar", name: "Calendar", icon: "calendar", description: "Make room for focused work around your team's schedule.", account: "design@aster.studio" },
  { id: "drive", name: "Documents", icon: "folder", description: "Find the right document, without leaving the conversation.", account: "Aster design team" },
];
export type ProductState = {
  notifications: boolean; digest: string; language: string; privateWorkspace: boolean;
  connections: Record<string, Connection>; instructions: string; saved: string;
};
export const INITIAL_STATE: ProductState = {
  notifications: true, digest: "Every morning", language: "English", privateWorkspace: true,
  connections: { github: "connected", calendar: "error", drive: "disconnected" },
  instructions: "Keep decisions close to the work. Share a little context with every update.",
  saved: "Keep decisions close to the work. Share a little context with every update.",
};
export type RecipeProps = {
  inherited: boolean; stress: boolean; fail: boolean; state: ProductState;
  setState: React.Dispatch<React.SetStateAction<ProductState>>;
};

function Row({ inherited, ...props }: { inherited: boolean; title: ReactNode; description?: ReactNode; control?: ReactNode }) {
  return inherited ? <AdaptiveRow {...props} /> : <SettingsRow {...props} />;
}

function StableLabel({ value, labels }: { value: string; labels: string[] }) {
  return <span className="settings-stable-label">{labels.map(label => <span key={label} aria-hidden={label !== value}>{label}</span>)}</span>;
}

export function Preferences({ inherited, stress, state, setState }: RecipeProps) {
  return <SettingsFlow>
    <SettingsPageHeader title={stress ? "Notifications / 通知偏好" : "Notifications"} description="A little less noise. Stay close to what matters." />
    <SettingsGroup label="Activity">
      <SettingsCard>
        <Row inherited={inherited} title="Direct messages" description={stress ? "有人给你发送消息，或者在跨团队项目中提到你时接收通知。即使描述变长，也应保留文字层级、完整内容和清晰的操作位置。" : "Get a notification when someone reaches out to you."} control={<Switch aria-label="Direct messages" checked={state.notifications} onCheckedChange={notifications => setState(s => ({ ...s, notifications }))} />} />
        <Row inherited={inherited} title="Email digest" description="A quiet recap of the work you follow." control={<SettingsSelect responsive={inherited} aria-label="Email digest" value={state.digest} options={["Every morning", "Once a week", "Never"]} onChange={digest => setState(s => ({ ...s, digest }))} />} />
        <Row inherited={inherited} title="Language" description="Used for notifications and email updates." control={<SettingsSelect responsive={inherited} aria-label="Notification language" value={state.language} options={["English", "简体中文", "Deutsch — Benachrichtigungen und Zusammenfassungen"]} onChange={language => setState(s => ({ ...s, language }))} />} />
      </SettingsCard>
    </SettingsGroup>
    <SettingsGroup label="Your attention, protected">
      <SettingsCard><Row inherited={inherited} title="Workspace defaults" description="These preferences only apply to you." control={<span className="text-[13px] text-text-secondary">Personal</span>} /></SettingsCard>
    </SettingsGroup>
  </SettingsFlow>;
}

export function Workspace({ inherited, stress, state, setState }: RecipeProps) {
  const dirty = state.instructions !== state.saved;
  const [savedNow, setSavedNow] = useState(false);
  return <SettingsFlow>
    <SettingsPageHeader title="Workspace" description="A shared space, with your team's way of working." />
    <SettingsGroup label="Working together" actions={<Button size="sm" type="secondary" disabled={!dirty} onClick={() => { setState(s => ({ ...s, saved: s.instructions })); setSavedNow(true); }}>Save changes</Button>}>
      <SettingsEditor aria-label="Workspace instructions" value={state.instructions} rows={4} onChange={instructions => { setSavedNow(false); setState(s => ({ ...s, instructions })); }} />
      <p className="text-[13px] text-text-secondary" role="status">{dirty ? "You have unsaved changes." : savedNow ? "Changes saved in this preview." : "A short note to help everyone start on the same page."}</p>
    </SettingsGroup>
    <SettingsGroup label="Access">
      <SettingsCard>
        <Row inherited={inherited} title="Private workspace" description={stress ? "Only invited teammates can discover this workspace, view shared conversations, and access project documents. External collaborators keep access only to the projects you have explicitly shared with them." : "Only invited teammates can see your workspace."} control={<Switch aria-label="Private workspace" checked={state.privateWorkspace} onCheckedChange={privateWorkspace => setState(s => ({ ...s, privateWorkspace }))} />} />
        <Row inherited={inherited} title="Workspace owner" description={stress ? "alexandra.montgomery@international-design-collective.example" : "alex@aster.studio"} control={<span className="text-[13px] text-text-secondary">Alex Morgan</span>} />
      </SettingsCard>
    </SettingsGroup>
  </SettingsFlow>;
}

function IntegrationRow({ service, inherited, stress, fail, state, setState }: RecipeProps & { service: Service }) {
  const [expanded, setExpanded] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notice, setNotice] = useState("");
  const operation = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const detailsId = useId();
  const status = state.connections[service.id];
  useEffect(() => () => {
    if (operation.current) {
      clearTimeout(operation.current);
      // Navigating away cancels the simulated request instead of stranding a spinner.
      setState(s => ({ ...s, connections: { ...s.connections, [service.id]: s.connections[service.id] === "connecting" ? "disconnected" : s.connections[service.id] } }));
    }
  }, [service.id, setState]);
  function openDisconnectConfirmation() {
    setConfirm(true);
    requestAnimationFrame(() => {
      const actions = root.current?.querySelector<HTMLElement>("[data-confirm-actions]");
      const scroller = root.current?.closest("main");
      if (!actions || !scroller) return;
      actions.querySelector<HTMLButtonElement>("[data-confirm-keep]")?.focus({ preventScroll: true });
      // Reveal the new actions inside the product, without moving the lab page.
      const inset = parseFloat(getComputedStyle(scroller).getPropertyValue("--space-x8"));
      const below = actions.getBoundingClientRect().bottom - scroller.getBoundingClientRect().bottom + inset;
      if (below > 0) scroller.scrollTop += below;
    });
  }
  function connect() {
    if (operation.current || status === "connecting") return;
    setNotice("");
    setState(s => ({ ...s, connections: { ...s.connections, [service.id]: "connecting" } }));
    operation.current = setTimeout(() => {
      operation.current = null;
      setState(s => ({ ...s, connections: { ...s.connections, [service.id]: fail ? "error" : "connected" } }));
      setNotice(fail ? "Connection failed. Your existing documents are safe. Try again when you're ready." : `${service.name} is connected.`);
    }, 900);
  }
  const statusLabel = { connected: "Connected", disconnected: "Not connected", connecting: "Connecting…", error: "Needs attention" }[status];
  const action = status === "connecting" ? "Connecting…" : status === "error" ? "Reconnect" : "Connect";
  const media = <span className="flex size-8 items-center justify-center rounded-control bg-bg-elevated text-text-primary"><Icon name={service.icon} weight="light" /></span>;
  const controls = <>
    <span className={`lab-connection-status ${status === "error" ? "text-palette-orange-text" : "text-text-secondary"}`}>
      <span className={`size-1.5 shrink-0 rounded-full ${status === "connected" ? "bg-status-success" : status === "error" ? "bg-palette-orange-text" : "bg-text-placeholder"}`} aria-hidden />{statusLabel}
    </span>
    {status === "connected" ? <Button data-primary-action size="sm" type="secondary" aria-expanded={expanded} aria-controls={expanded ? detailsId : undefined} onClick={() => { setExpanded(v => !v); setConfirm(false); }}>Manage</Button> :
      <Button data-primary-action size="sm" type="secondary" aria-label={`${action} ${service.name}`} aria-busy={status === "connecting"} disabled={status === "connecting"} onClick={connect}>
        <StableLabel value={action} labels={["Connect", "Reconnect", "Connecting…"]} />
      </Button>}
  </>;
  const details = <>
    {status === "error" && <p role="alert" className="text-palette-orange-text">{notice || "Your session has expired. Reconnect to resume syncing."}</p>}
    {expanded && status === "connected" && <div id={detailsId} className="lab-connection-detail">
      <div><p className="font-medium text-text-primary">{service.account}</p><p className="mt-1">Read-only access · Issues and documents</p></div>
      {confirm ? <div className="space-y-3">
        <p>Disconnect {service.name}? New content will stop syncing. Existing documents will stay in your workspace.</p>
        <div data-confirm-actions className="flex flex-wrap gap-2"><Button data-confirm-keep size="sm" type="secondary" onClick={() => { setConfirm(false); requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('[data-primary-action]')?.focus()); }}>Keep connected</Button><Button size="sm" type="secondary" danger onClick={() => { setState(s => ({ ...s, connections: { ...s.connections, [service.id]: "disconnected" } })); setConfirm(false); setExpanded(false); setNotice(`${service.name} disconnected.`); requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('[data-primary-action]')?.focus()); }}>Disconnect {service.name}</Button></div>
      </div> : <Button size="sm" type="tertiary" danger onClick={openDisconnectConfirmation}>Disconnect…</Button>}
    </div>}
  </>;
  const description = stress ? `${service.description} 与跨团队协作者同步上下文，并保留完整的权限说明，不截断关键内容。` : service.description;
  return <div ref={root} data-service={service.id} data-connection={status} className="lab-service">
    <span className="sr-only" role="status">{status === "error" ? "" : notice}</span>
    {inherited ? <AdaptiveRow title={service.name} description={description} media={media} control={controls} detail={status === "error" || (expanded && status === "connected") ? details : undefined} /> :
      <SettingsRow title={<span className="flex items-center gap-4">{media}{service.name}</span>} description={<>{description}{details}</>} control={<div className="flex items-center gap-2">{controls}</div>} />}
  </div>;
}

export function Integrations(props: RecipeProps) {
  return <SettingsFlow>
    <SettingsPageHeader title="Integrations" description="Your tools, a little closer. Bring the context you need into Aster." />
    <SettingsGroup label="Your connections">
      <SettingsCard>{SERVICES.map(service => <IntegrationRow key={service.id} service={service} {...props} />)}</SettingsCard>
    </SettingsGroup>
    <SettingsGroup label="Made to work together">
      <SettingsCard><Row inherited={props.inherited} title="A little peace of mind" description="Your tools stay yours. Aster never changes your source documents." control={<Icon name="check" size="sm" className="text-text-tertiary" />} /></SettingsCard>
    </SettingsGroup>
  </SettingsFlow>;
}

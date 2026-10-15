import { useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import { AgentWorkspaceState } from "@/components/automation";
import { AgentConnectCard, AgentClientPicker, QuotaUsage } from "@/components/agent-connect";
import { AGENT_CLIENTS, AGENT_MARKS, AGENT_TOOLS, DEMO_ENDPOINT } from "./data";
import "./agent-connections.css";

type SavedConnection = { client: string; scopes: string[] };
export function AgentConnections() {
  const [dark, setDark] = useState(false);
  const [client, setClient] = useState("desktop"), [scopes, setScopes] = useState(["balances", "transactions"]);
  const [connections, setConnections] = useState<SavedConnection[]>([]);
  const [query, setQuery] = useState(""), [error, setError] = useState(""), [notice, setNotice] = useState("");
  const setup = useRef<HTMLHeadingElement>(null), scopeGroup = useRef<HTMLFieldSetElement>(null);
  const current = AGENT_CLIENTS.find(c => c.id === client)!;
  const saved = connections.find(c => c.client === client);
  const tools = AGENT_TOOLS.filter(t => `${t.name} ${t.tool}`.toLowerCase().includes(query.trim().toLowerCase()));
  // Illustrative JSON, never sent to a server. Access choices are local connection metadata.
  const config = JSON.stringify({ mcpServers: { oreo: { url: DEMO_ENDPOINT } } }, null, 2);
  function selectClient(id: string) {
    setClient(id); setError(""); setNotice("");
    setScopes(connections.find(c => c.client === id)?.scopes ?? ["balances", "transactions"]);
  }
  function save() {
    if (!scopes.length) { setError("Choose at least one tool to connect this client."); scopeGroup.current?.focus(); return; }
    setConnections(items => [...items.filter(item => item.client !== client), {client, scopes:[...scopes]}]);
    setError(""); setNotice(`${current.name}: ${saved ? "access updated" : "demo connection added"}. ${scopes.length} read-only ${scopes.length === 1 ? "tool" : "tools"} enabled.`);
  }
  async function copyConfig() {
    try { await navigator.clipboard.writeText(config); setNotice("Example configuration copied. Replace the placeholder URL with your own server."); }
    catch { setNotice("Copy is unavailable. Select and copy the configuration below."); }
  }
  return <div className={dark ? "theme-dark" : ""}><div className="agent-connections-root">
    <header className="agent-connections-header"><a href="/agent-connect-card" className="flex items-center gap-3"><OreoLogo className="h-5 w-8"/><span className="text-text-tertiary">/</span><span>Oreo workspace</span></a><div className="flex items-center gap-3"><span className="text-xs text-text-secondary">Local demo</span><IconButton type="tertiary" tapScale={1} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} icon={<Icon name={dark ? "sun" : "moon"}/>} onClick={()=>setDark(!dark)}/></div></header>
    <div className="agent-connections-layout"><aside className="agent-connections-sidebar">
      <div><p className="agent-eyebrow">Workspace</p><nav aria-label="Workspace sections"><a href="#setup" aria-current="page"><Icon name="plug" size="sm"/> Agent connections <span>MCP</span></a><a href="#connected"><Icon name="checks" size="sm"/> Connected clients <span>{connections.length}</span></a><a href="#usage"><Icon name="gauge" size="sm"/> Usage & limits</a></nav></div>
      <div className="agent-sidebar-bottom"><AgentConnectCard marks={AGENT_MARKS} onAction={()=>{setup.current?.focus(); setup.current?.scrollIntoView({block:"start"});}}/>
        <section id="usage" aria-label="Workspace usage" className="agent-sidebar-usage"><QuotaUsage label="Automations this month" used={54} limit={3000}/><QuotaUsage label="Transactions this month" used={4488} limit={100000}/><p>Illustrative usage · Resets November 1</p></section>
        <a className="agent-library-link" href="/agent-connect-card"><Icon name="book-open" size="sm"/> Explore the components <Icon name="arrow-up-right" size="sm"/></a>
      </div>
    </aside>
    <main className="agent-connections-main"><header className="agent-page-intro"><span className="agent-eyebrow">Made for your workflow</span><h1>Bring your workspace<br className="hidden sm:block"/> to your favorite AI.</h1><p>Give your assistant the context it needs. Choose a client, decide what it can read, and keep every connection in one place.</p><span className="agent-readonly"><Icon name="lock" size="sm"/> Read-only access. Always in your control.</span></header>
    <div className="agent-setup-columns"><section id="setup" className="agent-setup-panel" aria-labelledby="agent-setup-title"><div className="agent-panel-heading"><h2 id="agent-setup-title" tabIndex={-1} ref={setup}>Set up a connection</h2><span>01 — 03</span></div>
      <div className="agent-setup-section"><AgentClientPicker label="01 / Choose your client" clients={AGENT_CLIENTS} value={client} onValueChange={selectClient}/></div>
      <fieldset className="agent-setup-section agent-permissions" ref={scopeGroup} tabIndex={-1} aria-invalid={!!error} aria-describedby={error ? "agent-scope-error" : undefined}><legend>02 / Choose what it can read</legend><p>Enable only the context this client needs.</p><label className="agent-tool-search"><Icon name="search" size="sm"/><span className="sr-only">Search tools</span><input type="search" placeholder="Search available tools…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
        {tools.length ? <div className="agent-tool-list">{tools.map(tool=><label key={tool.id} className="agent-tool"><span className="agent-tool-icon" aria-hidden="true"><Icon name={tool.icon}/></span><span className="min-w-0"><strong>{tool.name}</strong><span>{tool.description}</span></span><input type="checkbox" checked={scopes.includes(tool.id)} onChange={e=>{setScopes(s=>e.target.checked?[...s,tool.id]:s.filter(id=>id!==tool.id)); setError("");}}/></label>)}</div> : <AgentWorkspaceState title="No matching tools" description="Try a different name or clear your search." actionLabel="Clear search" onAction={()=>setQuery("")}/>}
        <p className="agent-scope-count">{scopes.length} of {AGENT_TOOLS.length} tools selected · No write permissions</p>{error && <p id="agent-scope-error" role="alert" className="text-sm text-status-error">{error}</p>}
      </fieldset>
      <section className="agent-setup-section"><h3>03 / Review & connect</h3><p className="mt-2 text-sm leading-6 text-text-secondary">{saved ? "Update the saved access for" : "Create a demo connection for"} <strong className="font-medium text-text-primary">{current.name}</strong>. This preview stays in your browser and resets on reload.</p>
        <details className="agent-config"><summary>Example server configuration</summary><p>Use your own server URL in a compatible client. This placeholder will not connect.</p><pre tabIndex={0} aria-label="Example MCP server configuration">{config}</pre><Button type="secondary" size="sm" tapScale={1} leadingIcon={<Icon name="copy" size="sm"/>} onClick={copyConfig}>Copy example</Button></details>
        <Button tapScale={1} onClick={save} leadingIcon={<Icon name={saved ? "check" : "plug"} size="sm"/>}>{saved ? "Save access" : "Connect demo client"}</Button><p className="agent-notice" role="status" aria-live="polite">{notice}</p>
      </section>
    </section>
    <aside className="agent-context"><section id="connected" className="agent-connected" aria-labelledby="connected-title"><header><h2 id="connected-title">Connected clients</h2><span>{connections.length}</span></header>
      {connections.length ? <ul>{connections.map(item=>{const identity=AGENT_CLIENTS.find(c=>c.id===item.client)!; return <li key={item.client}><div className="flex items-center gap-3"><span className="agent-client-mark" aria-hidden="true">{identity.mark}</span><div><strong>{identity.name}</strong><p>{item.scopes.length} read-only {item.scopes.length === 1 ? "tool" : "tools"} · Demo</p></div></div><div className="mt-3 flex gap-2"><Button type="secondary" size="sm" tapScale={1} onClick={()=>{selectClient(item.client); setup.current?.focus();}}>Manage</Button><Button type="tertiary" size="sm" tapScale={1} danger aria-label={`Disconnect ${identity.name}`} onClick={()=>{setConnections(items=>items.filter(c=>c.client!==item.client)); setNotice(`${identity.name} disconnected. You can reconnect it at any time.`); setup.current?.focus();}}>Disconnect</Button></div></li>;})}</ul> : <AgentWorkspaceState title="A fresh start" description="Your connected clients will appear here. Set up your first one to get started."/>}
    </section><section className="agent-how-it-works"><span className="agent-tool-icon"><Icon name="sparkle"/></span><h2>A little context.<br/>A lot more possibility.</h2><p>Ask about recent transactions, summarize your cash flow, or find the numbers behind a decision.</p><blockquote>“What changed in our spending this month?”</blockquote><p className="text-xs">A sample prompt for your own connected assistant.</p></section></aside>
    </div><footer className="agent-connections-footer"><span>Local preview · No credentials or live connections</span><a href="/changelog">What’s new ↗</a></footer>
    </main></div>
  </div></div>;
}

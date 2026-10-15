import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { HubSearchHero, AgentCategoryGrid, IntegrationTile, type HubIntegration } from "@/components/agent-hub";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { OreoLogo } from "@/docs/OreoLogo";
import { HUB_AGENTS, HUB_CATEGORIES, HUB_INTEGRATIONS, categoryName, matchesHubQuery, type HubAgent } from "./data";
import "./agent-hub.css";

type View = "explore" | "agents" | "integrations";
type Detail = { kind:"agent"; id:string } | { kind:"integration"; id:string } | { kind:"create" };
const views: { id:View; label:string; icon:IconName }[] = [{id:"explore",label:"Explore",icon:"globe"},{id:"agents",label:"Agents",icon:"assistant"},{id:"integrations",label:"Integrations",icon:"plug"}];

export function AgentHub() {
  const [dark,setDark] = useState(true);
  const [view,setView] = useState<View>("explore");
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState("all");
  const [agents,setAgents] = useState<HubAgent[]>(HUB_AGENTS);
  const [saved,setSaved] = useState(["triage","release","handoff"]);
  const [onlySaved,setOnlySaved] = useState(false);
  const [connected,setConnected] = useState(["zendesk","slack","intercom"]);
  const [detail,setDetail] = useState<Detail|null>(null);
  const [notice,setNotice] = useState("");
  const [name,setName] = useState("");
  const [draftCategory,setDraftCategory] = useState("support");
  const [description,setDescription] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement|null>(null);
  const navRef = useRef<HTMLButtonElement|null>(null);
  useEffect(() => {
    const onKey = (e:KeyboardEvent) => {
      const target=e.target as HTMLElement;
      if (e.key!=="/" || e.metaKey || e.ctrlKey || e.altKey || detail || target.closest("input,textarea,select,[contenteditable=true]")) return;
      e.preventDefault(); searchRef.current?.focus();
    };
    window.addEventListener("keydown",onKey);
    return () => window.removeEventListener("keydown",onKey);
  },[detail]);
  const categories=HUB_CATEGORIES.map(c=>({...c,count:agents.filter(a=>a.category===c.id).length}));
  const filtered=agents.filter(a=>(category==="all"||a.category===category)&&(!onlySaved||saved.includes(a.id))&&matchesHubQuery(`${a.name} ${a.description} ${categoryName(a.category)} ${a.tags.join(" ")}`,query));
  const integrations=HUB_INTEGRATIONS.filter(i=>matchesHubQuery(`${i.name} ${i.description}`,query));
  const selectedAgent=detail?.kind==="agent"?agents.find(a=>a.id===detail.id):undefined;
  const selectedIntegration=detail?.kind==="integration"?HUB_INTEGRATIONS.find(i=>i.id===detail.id):undefined;
  function navigate(next:View) { setView(next);setQuery("");setCategory("all");setOnlySaved(false);setNotice("");window.scrollTo({top:0,behavior:"auto"}); }
  function open(next:Detail,event:MouseEvent<HTMLButtonElement>) { openerRef.current=event.currentTarget;setNotice("");setDetail(next); }
  function create(e:FormEvent) {
    e.preventDefault(); if(!name.trim()||!description.trim())return;
    const agent:HubAgent={id:crypto.randomUUID(),name:name.trim(),description:description.trim(),category:draftCategory,integrations:[],tags:["draft"],instructions:"Add instructions and review this draft before connecting a real agent runtime.",draft:true};
    setAgents(items=>[agent,...items]);setSaved(ids=>[...ids,agent.id]);navigate("agents");setDetail(null);setName("");setDescription("");setNotice(`“${agent.name}” created as a local draft.`);
  }
  function resetFilters() {setQuery("");setCategory("all");setOnlySaved(false);searchRef.current?.focus();}
  function integrationTile(integration:HubIntegration) {
    return <IntegrationTile key={integration.id} integration={integration} connected={connected.includes(integration.id)} agentCount={agents.filter(a=>a.integrations.includes(integration.id)).length} onOpen={e=>open({kind:"integration",id:integration.id},e)}/>;
  }
  function agentList() {
    return <section className="hub-section" aria-labelledby="hub-agent-heading"><div className="hub-section-heading"><div><h2 id="hub-agent-heading">{category==="all"?"Agents":categoryName(category)}</h2><p role="status">{filtered.length} {filtered.length===1?"agent":"agents"}{onlySaved?" in your workspace":" to explore"}</p></div><div className="hub-agent-filters"><label><span className="sr-only">Filter by category</span><select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">All categories</option>{HUB_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><Button tapScale={1} type={onlySaved?"primary":"secondary"} aria-pressed={onlySaved} onClick={()=>setOnlySaved(!onlySaved)}>My agents ({saved.length})</Button></div></div>
      {filtered.length?<div className="hub-agent-grid">{filtered.map(agent=><button type="button" key={agent.id} className="hub-agent-card" onClick={e=>open({kind:"agent",id:agent.id},e)}>
        <div className="hub-agent-top"><Icon name={HUB_CATEGORIES.find(c=>c.id===agent.category)?.icon??"assistant"}/><span>{agent.draft?"Draft":saved.includes(agent.id)?"In your workspace":categoryName(agent.category)}</span><Icon name="arrow-up-right" size="sm"/></div>
        <h3>{agent.name}</h3><p>{agent.description}</p><div className="hub-agent-tags">{agent.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
      </button>)}</div>:<AgentWorkspaceState title="No agents found" description="Try another search or category, or add an agent to your workspace." actionLabel="Clear filters" onAction={resetFilters}/>}
    </section>;
  }
  return <div className={dark?"theme-dark":""}><div className="hub-root">
    <aside className="hub-rail" aria-label="Workspace shortcuts"><a href="/" aria-label="Oreo UI components"><OreoLogo className="h-5 w-7"/></a><span className="hub-rail-divider"/><IconButton type="tertiary" tapScale={1} aria-label="Explore agent hub" aria-pressed={view==="explore"} onClick={()=>navigate("explore")} icon={<Icon name="columns"/>}/><IconButton type="tertiary" tapScale={1} aria-label="Browse agents" aria-pressed={view==="agents"} onClick={()=>navigate("agents")} icon={<Icon name="assistant"/>}/><IconButton type="tertiary" tapScale={1} aria-label="Browse integrations" aria-pressed={view==="integrations"} onClick={()=>navigate("integrations")} icon={<Icon name="plug"/>}/><a className="hub-rail-bottom" href="/hub-search-hero" aria-label="Agent hub component documentation"><Icon name="book-open"/></a></aside>
    <aside className="hub-sidebar"><div className="hub-workspace"><span className="hub-workspace-avatar">O</span><span>Oreo’s Workspace</span><span className="hub-workspace-label">Demo</span></div><div className="hub-nav-label"><i/> Agent hub</div><nav aria-label="Agent hub navigation">{views.map(item=><button ref={item.id===view?navRef:undefined} type="button" key={item.id} aria-current={view===item.id?"page":undefined} onClick={()=>navigate(item.id)}><Icon name={item.icon} size="sm"/>{item.label}</button>)}</nav><div className="hub-sidebar-note"><Icon name="info" size="sm"/><p>A local workspace to explore.<br/>Changes reset on reload.</p></div></aside>
    <div className="hub-content"><header className="hub-topbar"><span>{views.find(v=>v.id===view)?.label}</span><div className="flex items-center gap-2"><IconButton type="tertiary" tapScale={1} aria-label={dark?"Switch to light theme":"Switch to dark theme"} onClick={()=>setDark(!dark)} icon={<Icon name={dark?"sun":"moon"} size="sm"/>}/><Button type="secondary" tapScale={1} leadingIcon={<Icon name="plus" size="sm"/>} onClick={e=>open({kind:"create"},e)}>Create agent</Button></div></header>
      <main className="hub-main"><HubSearchHero value={query} onValueChange={setQuery} inputRef={searchRef} shortcut title={view==="explore"?"Agent hub":view==="agents"?"Your next teammate.":"Connected possibilities."} description={view==="explore"?"Discover agents and integrations built for your team.":view==="agents"?"Find a little help for the work that matters.":"Bring your tools together in one place."}/>
        {notice&&<p className="hub-notice" role="status">{notice}</p>}
        {view==="explore"&&!query.trim()&&<section className="hub-section" aria-labelledby="hub-categories-heading"><div className="hub-section-heading"><div><h2 id="hub-categories-heading">Categories</h2><p>Agents grouped by the work they do.</p></div></div><AgentCategoryGrid items={categories} onSelect={id=>{setView("agents");setCategory(id);setQuery("");setOnlySaved(false);searchRef.current?.focus();}}/></section>}
        {(view==="agents"||view==="explore"&&query.trim())&&agentList()}
        {view!=="agents"&&<section className="hub-section" aria-labelledby="hub-integrations-heading"><div className="hub-section-heading"><div><h2 id="hub-integrations-heading">Integrations</h2><p>Apps and tools your agents can connect to.</p></div>{view==="explore"&&<Button type="secondary" tapScale={1} onClick={()=>navigate("integrations")}>View all</Button>}</div>
          {integrations.length?<>{[{label:"Connected in this demo",items:integrations.filter(i=>connected.includes(i.id))},{label:"Available to explore",items:integrations.filter(i=>!connected.includes(i.id))}].map(group=>group.items.length>0&&<div className="hub-integration-group" key={group.label}><h3>{group.label} <span>{group.items.length}</span></h3><div className="hub-integration-grid">{group.items.map(integrationTile)}</div></div>)}</>:<AgentWorkspaceState title="No integrations found" description="Try the name of a tool, such as Slack or GitHub." actionLabel="Clear search" onAction={()=>{setQuery("");searchRef.current?.focus();}}/>}
        </section>}
        <footer className="hub-footer"><span>Illustrative agents · No external accounts connected</span><a href="/hub-search-hero">Explore the components ↗</a></footer>
      </main>
    </div>
    <Dialog.Root open={detail!==null} onOpenChange={isOpen=>{if(!isOpen)setDetail(null);}}><Dialog.Portal><div className={dark?"theme-dark":""}><Dialog.Backdrop className="hub-dialog-backdrop"/><Dialog.Popup className="hub-dialog" finalFocus={()=>openerRef.current?.isConnected?openerRef.current:navRef.current}>
      <div className="hub-dialog-heading"><Dialog.Title>{detail?.kind==="create"?"Create an agent":selectedAgent?.name??selectedIntegration?.name}</Dialog.Title><Dialog.Close render={<IconButton type="tertiary" tapScale={1} aria-label="Close details" icon={<Icon name="x"/>}/>}/></div>
      <Dialog.Description>{detail?.kind==="create"?"Start a local draft. Nothing is published or connected to a service.":selectedAgent?.description??selectedIntegration?.description}</Dialog.Description>
      {detail?.kind==="create"?<form className="hub-create-form" onSubmit={create}><label>Agent name<input autoFocus required maxLength={60} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Weekly team digest"/></label><label>Category<select value={draftCategory} onChange={e=>setDraftCategory(e.target.value)}>{HUB_CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>What will it help with?<textarea required maxLength={240} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the work this agent will do."/></label><div className="hub-dialog-actions"><Dialog.Close render={<Button type="secondary" tapScale={1}/>}>Cancel</Dialog.Close><Button tapScale={1} render={<button type="submit"/>} disabled={!name.trim()||!description.trim()}>Create draft</Button></div></form>:
        selectedAgent?<><div className="hub-detail-section"><h3>Suggested instructions</h3><p>{selectedAgent.instructions}</p></div><div className="hub-detail-section"><h3>Tools</h3><p>{selectedAgent.integrations.length?selectedAgent.integrations.map(id=>HUB_INTEGRATIONS.find(i=>i.id===id)?.name).join(" · "):"No tools attached to this draft."}</p></div><p className="hub-demo-note">Catalog preview only. No agent runs and no data is sent.</p><div className="hub-dialog-actions"><Button type="secondary" tapScale={1} aria-pressed={saved.includes(selectedAgent.id)} onClick={()=>{setSaved(ids=>ids.includes(selectedAgent.id)?ids.filter(id=>id!==selectedAgent.id):[...ids,selectedAgent.id]);}}>{saved.includes(selectedAgent.id)?"Remove from my agents":"Add to my agents"}</Button></div></>:
        selectedIntegration?<><div className="hub-detail-section"><h3>Agents using this integration</h3>{agents.filter(a=>a.integrations.includes(selectedIntegration.id)).map(a=><p key={a.id}>{a.name}</p>)}</div><p className="hub-demo-note">This changes the demo connection state only. No sign-in, permissions or external access is requested.</p><div className="hub-dialog-actions"><span role="status">{connected.includes(selectedIntegration.id)?"Connected in demo":"Not connected"}</span><Button type="secondary" tapScale={1} onClick={()=>setConnected(ids=>ids.includes(selectedIntegration.id)?ids.filter(id=>id!==selectedIntegration.id):[...ids,selectedIntegration.id])}>{connected.includes(selectedIntegration.id)?"Disconnect demo":"Connect demo"}</Button></div></>:null}
    </Dialog.Popup></div></Dialog.Portal></Dialog.Root>
  </div></div>;
}

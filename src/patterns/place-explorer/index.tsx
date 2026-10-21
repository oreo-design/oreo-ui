import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useState, useRef, type FormEvent } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Message, MessageContent } from "@/components/message";
import { OreoLogo } from "@/docs/OreoLogo";
import { AgentWorkspaceState } from "@/components/automation";
import { PlaceMap, PlaceDetailCard, MapStylePicker, type MapStyle } from "@/components/place-map";
import { SAMPLE_PLACES, PLACE_FILTERS, placeMatches, itineraryText, type PlaceFilter } from "./data";
import "./place-explorer.css";

export function PlaceExplorer(){
  const savedFilter=useRef<HTMLButtonElement>(null);
  const [dark,setDark]=useThemeMode(false), [style,setStyle]=useState<MapStyle>("meadow");
  const [selected,setSelected]=useState("lakehouse"), [instant,setInstant]=useState(true);
  const [filter,setFilter]=useState<PlaceFilter>("all"), [saved,setSaved]=useState<string[]>([]);
  const [draft,setDraft]=useState(""), [query,setQuery]=useState("");
  const [copied,setCopied]=useState(""), [copyError,setCopyError]=useState("");
  const places=SAMPLE_PLACES.filter(p=>(filter==="all"||filter==="saved"&&saved.includes(p.id)||filter==="quiet"&&["lakehouse","northlight"].includes(p.id)||filter==="wifi"&&p.id==="northlight")&&placeMatches(p,query));
  const current=places.find(p=>p.id===selected)??places[0];
  const index=current?places.findIndex(p=>p.id===current.id):0;
  const activeFilter=PLACE_FILTERS.find(f=>f.id===filter)!;
  function choose(id:string,keyboard:boolean){setSelected(id);setInstant(keyboard);setCopied("");setCopyError("");}
  function setMode(mode:PlaceFilter){setFilter(mode);setInstant(true);setCopied("");setCopyError("");}
  function search(e:FormEvent){e.preventDefault();setQuery(draft.trim());setInstant(true);setCopied("");setCopyError("");}
  async function copy(){if(!current)return; const id=current.id;try{await navigator.clipboard.writeText(itineraryText(current));setCopied(id);setCopyError("");}catch{setCopyError(itineraryText(current));}}
  return <div className={dark?"theme-dark":""}><div className="place-explorer-root">
    <header className="place-explorer-header"><a href="/place-map" className="flex items-center gap-3"><OreoLogo className="h-5 w-8"/><span className="text-text-tertiary">/</span><span>Explore</span></a><div className="flex items-center gap-3"><span className="text-xs text-text-secondary">Willow Park · Demo city</span><IconButton type="tertiary" tapScale={1} aria-label={dark?"Switch to light theme":"Switch to dark theme"} onClick={()=>setDark(!dark)} icon={<Icon name={dark?"sun":"moon"}/>}/></div></header>
    <main className="place-explorer-main"><div className="place-explorer-intro"><div className="place-explorer-kicker"><Icon name="sparkle" size="sm"/> A little local knowledge</div><h1>Find your next favorite spot.</h1><p>Good coffee. A fresh perspective. Somewhere to stay a while.</p></div>
      <nav className="place-explorer-filters" aria-label="Place filters">{PLACE_FILTERS.map(item=><Button key={item.id} render={item.id==="saved"?<button type="button" ref={savedFilter}/>:undefined} type={filter===item.id?"primary":"tertiary"} tapScale={1} aria-pressed={filter===item.id} onClick={()=>setMode(item.id)}>{item.label}{item.id==="saved"?` (${saved.length})`:""}</Button>)}</nav>
      <div className="place-conversation" aria-label="Place discovery conversation">
        <Message role="user"><MessageContent className="bg-bg-elevated">{query?`Find “${query}” in ${activeFilter.label.toLowerCase()}.`:activeFilter.prompt}</MessageContent></Message>
        <Message role="assistant"><MessageContent className="w-full">
          {current?<><p className="place-assistant-intro">{places.length===1?"Here’s a spot":"Here are a few spots"} around <strong>Willow Park</strong>. {filter==="saved"?"Your saved places, ready when you are.":<>Take a look at <strong>{current.name}</strong>, a {current.minutes}-minute walk from the sample starting point.</>}</p>
            <PlaceMap places={places} selectedId={current.id} mapStyle={style} onSelect={choose} toolbar={<MapStylePicker value={style} onValueChange={setStyle}/>} footer={<PlaceDetailCard place={current} index={index} total={places.length} onPrevious={e=>choose(places[(index-1+places.length)%places.length].id,e.detail===0)} onNext={e=>choose(places[(index+1)%places.length].id,e.detail===0)} onCopy={copy} copyLabel={copied===current.id?"Copied":"Copy itinerary"} saved={saved.includes(current.id)} onSave={()=>{if(filter==="saved")savedFilter.current?.focus();setSaved(items=>items.includes(current.id)?items.filter(id=>id!==current.id):[...items,current.id]);setInstant(true);}} instant={instant}/>}/>
            <div className="place-selection-summary"><p>{current.description}</p><span>{current.address} · {current.rating} rating · Sample venue</span></div>
            <p role="status" className="place-copy-notice">{copied===current.id?`Itinerary for ${current.name} copied. Paste it into your notes or a message.`:""}</p>
            {copyError&&<div className="place-copy-fallback" role="alert"><p>Clipboard access is unavailable. Select and copy your itinerary below.</p><textarea aria-label="Itinerary to copy" readOnly value={copyError} onFocus={e=>e.target.select()}/></div>}
          </>:<div className="place-explorer-empty"><AgentWorkspaceState title={filter==="saved"&&!query?"Your next adventure starts here":"No matching places"} description={filter==="saved"&&!query?"Save a place from its detail card to keep it in this collection.":"Try a shorter search or explore all three sample places."} actionLabel="Show all places" onAction={()=>{setMode("all");setQuery("");setDraft("");}}/></div>}
        </MessageContent></Message>
      </div>
      <form className="place-explorer-search" onSubmit={search}><label><span className="sr-only">Search sample places</span><Icon name="search"/><input type="search" maxLength={100} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Search a name, amenity, or neighborhood…"/></label><Button tapScale={1} render={<button type="submit"/>} trailingIcon={<Icon name="arrow-up-right" size="sm"/>}>Explore</Button></form>
      <footer className="place-explorer-footer"><span>Three illustrative venues · Saved places reset on reload</span><a href="/place-map">Explore the components ↗</a></footer>
    </main>
  </div></div>;
}

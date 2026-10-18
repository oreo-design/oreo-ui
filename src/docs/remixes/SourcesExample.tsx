import { useId, useState } from "react";
import { Sources, Source } from "@/components/sources";
import { Action, Status, type ExampleProps } from "./shared";
import { evidence, filterEvidence } from "./model";

export function SourcesExample({ mode, stress }: ExampleProps) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>(evidence[0].id);
  const [included, setIncluded] = useState<string[]>([evidence[0].id]);
  const [showQuote, setShowQuote] = useState(false);
  const filtered = filterEvidence(query);
  const item = evidence.find(e => e.id === active)!;
  const capability = mode === "capability";
  return <div className="remix-stack">
    {mode === "style" && <><p className="remix-eyebrow">Grounded in your context</p><h3 className="remix-editorial">Follow the evidence.</h3><p className="remix-prose">A worked example may help people take the first step. These sample sources explain why.</p></>}
    {capability && <label className="remix-search">Find evidence<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title or quote…" /></label>}
    <Sources label={mode === "style" ? "View sources" : "Sources"} defaultOpen className="remix-sources" count={filtered.length}>
      {filtered.map(source => <Source key={source.id} title={stress ? `${source.title} — onboarding, accessibility and international research synthesis` : source.title} domain={source.domain} href={`#${id}-quote`} target="_self" aria-current={active === source.id && showQuote ? "true" : undefined} onClick={e => { e.preventDefault(); setActive(source.id); setShowQuote(mode !== "original"); }} />)}
    </Sources>
    {!filtered.length && <div className="remix-empty"><strong>No matching evidence</strong><p>Try “onboarding” or clear your search.</p><Action onClick={() => setQuery("")}>Clear search</Action></div>}
    {(capability || showQuote) && <section id={`${id}-quote`} className="remix-quote" aria-label="Evidence excerpt">
      <p className="remix-eyebrow">{item.title}</p><blockquote>“{item.quote}”</blockquote><p className="remix-help">{item.note}</p>
      {capability && <label className="remix-check"><input type="checkbox" checked={included.includes(item.id)} onChange={e => setIncluded(current => e.target.checked ? [...current, item.id] : current.filter(value => value !== item.id))} />Include this source</label>}
    </section>}
    {capability && <section className="remix-callout" aria-label="Selected evidence"><strong>Evidence to carry forward</strong>{included.length ? <ol>{evidence.filter(e => included.includes(e.id)).map(e => <li key={e.id}>{e.quote} <span className="remix-muted">[{e.title}]</span></li>)}</ol> : <p>No sources selected. Open a source and check “Include this source”.</p>}</section>}
    <Status>{capability ? `${included.length} of 3 sources included. Selection survives filtering.` : mode === "original" ? `Demo link target: ${item.title}. No external navigation.` : "Synthetic sources · links open local excerpts, never an external site."}</Status>
  </div>;
}

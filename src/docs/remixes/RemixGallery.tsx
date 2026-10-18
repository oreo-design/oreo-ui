import { useState } from "react";
import { Sidebar } from "@/docs/Sidebar";
import type { DocsNav } from "@/docs/DocsPage";
import { briefs } from "./briefs";
import { remixSlugs } from "./model";
import "./remixes.css";

export function RemixGallery({ nav }: { nav: DocsNav }) {
  const [dark, setDark] = useState(() => new URLSearchParams(window.location.search).has("dark"));
  const theme = dark ? "&dark" : "";
  return <div className={dark ? "theme-dark" : ""}><div className="remix-layout">
    <Sidebar nav={nav} />
    <div className="remix-main">
      <header className="remix-header"><div><p className="remix-eyebrow">OREO UI / EXPERIMENTS</p><h1>AI remixes<span>01—05</span></h1></div><label className="remix-gallery-theme"><input type="checkbox" checked={dark} onChange={event => setDark(event.target.checked)} />Dark</label></header>
      <main className="remix-gallery">
        <div className="remix-intro"><p className="remix-eyebrow">5 COMPONENTS · 10 WORKING ADAPTATIONS</p><h2>Beyond the original.</h2><p>Give a component a new job. Then make it feel at home in a different product. Explore the original alongside each working adaptation.</p></div>
        <div className="remix-gallery-legend"><p><strong>01 / New capability</strong>New state and behavior beyond the component’s existing props.</p><p><strong>02 / Claude-inspired</strong>An independent visual interpretation of public references. Not official Claude UI or a partnership.</p></div>
        <div className="remix-gallery-grid">{remixSlugs.map((slug, index) => {
          const brief = briefs[slug];
          return <article className="remix-gallery-card" key={slug} aria-label={`${brief.title} experiments`}>
            <div className="remix-gallery-card-heading"><span className="remix-eyebrow">{String(index + 1).padStart(2, "0")}</span><h3>{brief.title}</h3><p>{brief.level}</p></div>
            <p className="remix-gallery-baseline">{brief.baseline}</p>
            <div className="remix-gallery-links"><a href={`/${slug}?view=docs`}>Original component <span aria-hidden="true">↗</span></a><a href={`/${slug}?view=remixes&remix=capability${theme}`}><small>01 / NEW CAPABILITY</small><strong>{brief.capability.title}</strong><span aria-hidden="true">→</span></a><a href={`/${slug}?view=remixes&remix=style${theme}`}><small>02 / CLAUDE-INSPIRED</small><strong>{brief.style.title}</strong><span aria-hidden="true">→</span></a></div>
          </article>;
        })}</div>
        <footer className="remix-footer"><p>Demo data. Browser-local state. No model calls, uploads or real business actions.</p><p>Each experiment includes the actual brief, an interactive original and adaptation, and what changed or stayed.</p></footer>
      </main>
    </div>
  </div></div>;
}

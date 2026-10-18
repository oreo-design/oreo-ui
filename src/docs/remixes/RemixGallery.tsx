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
      <header className="remix-header"><div><h1>AI remixes</h1></div><label className="remix-gallery-theme"><input type="checkbox" checked={dark} onChange={event => setDark(event.target.checked)} />Dark</label></header>
      <main className="remix-gallery">
        <div className="remix-intro"><p>Five components with functional and visual adaptations.</p></div>
        <div className="remix-gallery-legend"><p><strong>New capability</strong>New state and behavior beyond the component’s existing props.</p><p><strong>Claude-inspired</strong>An independent visual interpretation of public references. Not official Claude UI or a partnership.</p></div>
        <div className="remix-gallery-grid">{remixSlugs.map((slug) => {
          const brief = briefs[slug];
          return <article className="remix-gallery-card" key={slug} aria-label={`${brief.title} experiments`}>
            <div className="remix-gallery-card-heading"><h3>{brief.title}</h3></div>
            <p className="remix-gallery-baseline">{brief.baseline}</p>
            <div className="remix-gallery-links"><a href={`/${slug}?view=docs`}>Original component <span aria-hidden="true">↗</span></a><a href={`/${slug}?view=remixes&remix=capability${theme}`}><small>New capability</small><strong>{brief.capability.title}</strong><span aria-hidden="true">→</span></a><a href={`/${slug}?view=remixes&remix=style${theme}`}><small>Claude-inspired</small><strong>{brief.style.title}</strong><span aria-hidden="true">→</span></a></div>
          </article>;
        })}</div>
        <footer className="remix-footer"><p>Demo data. Browser-local state. No model calls, uploads or real business actions.</p></footer>
      </main>
    </div>
  </div></div>;
}

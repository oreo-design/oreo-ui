import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { OreoLogo } from "./OreoLogo";
import type { DocsNav } from "./DocsPage";

import { CATALOG_NAV, searchCatalog } from "@/lib/catalog";

// Compatibility export for existing callers; pure data lives in lib/catalog.
export const NAV = CATALOG_NAV;

function Directory({ nav, onNavigate }: { nav: DocsNav; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const list = useRef<HTMLElement>(null);
  const groups = searchCatalog(query);
  useEffect(() => {
    list.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [nav.active]);
  return <>
    <div className="site-directory-search"><label className="sr-only" htmlFor={onNavigate ? "mobile-page-search" : "page-search"}>Find a page</label><input id={onNavigate ? "mobile-page-search" : "page-search"} type="search" placeholder="Find a page…" value={query} onChange={event => setQuery(event.target.value)} /></div>
    <nav ref={list} className="site-directory" aria-label="Site navigation">
      {groups.map(group => <section key={group.title}><h2>{group.title}</h2><ul>{group.items.map(item => <li key={item.page}><a href={`/${item.page}`} aria-current={nav.active === item.page ? "page" : undefined} className={cn("site-directory-link", nav.active === item.page && "is-active")} onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault(); nav.onNavigate(item.page!); onNavigate?.();
      }}>{item.label}</a></li>)}</ul></section>)}
      {!groups.length && <div className="site-directory-empty" role="status"><Icon name="search" /><p>No matching pages</p><button type="button" className="site-action" onClick={() => setQuery("")}>Clear search</button></div>}
    </nav>
  </>;
}

function Brand() {
  return <a href="/" className="site-brand" aria-label="Oreo UI home"><OreoLogo className="h-4 w-auto" /><span>Oreo UI</span></a>;
}

export function Sidebar({ nav }: { nav: DocsNav }) {
  return <aside className="site-sidebar"><Brand /><Directory nav={nav} /></aside>;
}

/** The same directory is available on every route, including standalone templates. */
export function MobileNavigation({ nav }: { nav: DocsNav }) {
  const shell = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (media.matches) dialog.current?.close(); };
    media.addEventListener("change", closeOnDesktop);
    return () => { document.body.style.overflow = previous; media.removeEventListener("change", closeOnDesktop); };
  }, [open]);
  return <div ref={shell} className="site-mobile-nav">
    <div className="site-mobile-bar"><Brand /><button type="button" className="site-action" aria-haspopup="dialog" aria-expanded={open} onClick={() => { dialog.current?.showModal(); setOpen(true); }}>Browse pages</button></div>
    <dialog ref={dialog} className="site-navigation-dialog" aria-label="Browse pages" onClose={() => setOpen(false)}>
      <div className="site-mobile-bar"><span className="text-sm font-medium">Browse pages</span><button type="button" className="site-action" onClick={() => dialog.current?.close()}>Close</button></div>
      {open && <Directory nav={nav} onNavigate={() => dialog.current?.close()} />}
    </dialog>
  </div>;
}

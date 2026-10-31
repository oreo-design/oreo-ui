import { useEffect, useState } from "react";
import { ComponentPickerProvider } from "@/docs/playground/ComponentPicker";
import { DocsFrame } from "@/docs/DocsFrame";
import { MobileNavigation } from "@/docs/Sidebar";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { routeLoaders, documentationFrameRoutes } from "@/docs/route-loaders";
import { RoutePending } from "@/docs/RoutePending";
import { useAsyncContent } from "@/docs/useAsyncContent";
import { routeView, type DocsView } from "@/docs/route-view";
import { CATALOG, catalogHref } from "@/lib/catalog";
import { DEFAULT_PAGE, isPageSlug, metaForRoute, type PageSlug } from "@/lib/site";
import { applyRouteMeta } from "@/lib/head";
import "@/docs/site.css";

type Route = { page: PageSlug; home: boolean; search: string; hash: string };
function routeFromPath(): Route {
  const slug = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (isPageSlug(slug)) return { page: slug, home: false, search: window.location.search, hash: window.location.hash };
  if (slug) window.history.replaceState(null, "", "/");
  return { page: DEFAULT_PAGE, home: true, search: window.location.search, hash: window.location.hash };
}

export default function App() {
  const [route, setRoute] = useState(routeFromPath);
  const { page, home } = route;
  const entry = CATALOG[page];
  const view = routeView(entry, route.search, route.hash);
  useEffect(() => {
    const sync = () => setRoute(routeFromPath());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);
  useEffect(() => { applyRouteMeta(metaForRoute(page, home)); }, [page, home]);
  const changeView = (next: DocsView) => {
    const url = new URL(window.location.href);
    url.hash = "";
    if (next === "playground") url.searchParams.delete("view");
    else url.searchParams.set("view", next);
    window.history.replaceState(null, "", url);
    setRoute(routeFromPath());
    window.scrollTo({ top: 0 });
  };
  const nav: DocsNav = {
    active: page,
    // Hashes locate content inside the current page; only query changes reset
    // URL-backed examples/configuration. A TOC click must preserve local state.
    locationKey: route.search,
    onViewChange: changeView,
    onNavigate: (id, requestedView) => {
      if (!isPageSlug(id)) return;
      const target = catalogHref(id, requestedView);
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (id !== page || home || (requestedView && current !== target)) window.history.pushState(null, "", target);
      setRoute(routeFromPath());
      window.scrollTo({ top: 0 });
    },
  };
  return <ComponentPickerProvider nav={nav}><MobileNavigation nav={nav} />{view === "playground" || view === "remixes" ?
    <DocsPage key={page} nav={nav} breadcrumb={[entry.nav.group, entry.title]} toc={[]}>{() => null}</DocsPage> :
    <DocsRoute nav={nav} page={page} view={view} hash={route.hash} />}</ComponentPickerProvider>;
}

function DocsRoute(props: { nav: DocsNav; page: PageSlug; view: string; hash: string }) {
  const content = <AsyncPage {...props} />;
  return documentationFrameRoutes.has(props.page) ? <DocsFrame nav={props.nav}>{content}</DocsFrame> : content;
}

function AsyncPage({ nav, page, view, hash }: { nav: DocsNav; page: PageSlug; view: string; hash: string }) {
  const result = useAsyncContent(routeLoaders[page]);
  const [settingsActive, setSettingsActive] = useState(false);
  useEffect(() => {
    if (result.status !== "ready" || !hash) return;
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [result.status, hash]);
  if (result.status !== "ready" || settingsActive) return <RoutePending nav={nav} view={view} error={result.status === "error"} onRetry={result.retry} onViewChange={nav.onViewChange} onInteractionChange={setSettingsActive} />;
  const Page = result.value;
  return <Page key={`${page}:${nav.locationKey ?? ""}`} nav={nav} />;
}

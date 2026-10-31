import { useVariation, patchTheme } from "./playground/useVariation";
import { useState, useEffect } from "react";
import { useDocsFrame } from "./DocsFrame";
import { DocsLayout } from "./DocsLayout";
import { CustomizePanel } from "./CustomizePanel";
import { ComponentPlayground } from "./playground/ComponentPlayground";
import { useAsyncContent } from "./useAsyncContent";
import { RoutePending } from "./RoutePending";
import { routeView, type DocsView } from "./route-view";
import { CATALOG, type CatalogSlug, type CatalogView } from "@/lib/catalog";
import { hasRemix } from "./remixes/model";
import { playgroundLoaders } from "./playground/loaders";
import { PageViews } from "./PageViews";
import type { TocItem } from "./OnThisPage";
import { ICON_WEIGHTS, IconLibraryProvider, type IconLibrary, type IconWeight } from "@/components/icon";

export type SpringProps = { bounce: number; duration: number; tapScale: number };
export type IconControls = { library: IconLibrary; weight: IconWeight };
export type DocsControls = { spring: SpringProps; icon: IconControls; radius: number; dark: boolean };

export type DocsNav = { active: string; onNavigate: (id: string, view?: CatalogView) => void; onViewChange?: (view: DocsView) => void; /** Query identity for restoring URL configuration; never includes an anchor. */ locationKey?: string };

/**
 * Reusable component-docs shell. Owns the live controls (theme / radius /
 * press-spring), renders the three-column layout + the collapsible appearance panel, and hands the live control values to the page body via a
 * render prop so every preview can stay in sync.
 */
export function DocsPage({
  toc,
  breadcrumb,
  nav,
  children,
}: {
  toc: TocItem[];
  breadcrumb: string[];
  nav: DocsNav;
  children: (controls: DocsControls) => React.ReactNode;
}) {
  const framed = useDocsFrame();
  const hasPlayground = Boolean(playgroundLoaders[nav.active]);
  const readView = (): DocsView => {
    const value = routeView(CATALOG[nav.active as CatalogSlug], window.location.search, window.location.hash);
    return value === "remixes" ? "remixes" : value === "playground" && hasPlayground ? "playground" : "docs";
  };
  const [localView, setView] = useState<DocsView>(readView);
  const view = nav.onViewChange ? readView() : localView;
  useEffect(() => {
    const sync = () => setView(readView());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, [nav.active]);
  const changeView = (next: DocsView) => {
    if (nav.onViewChange) { nav.onViewChange(next); return; }
    setView(next);
    const url = new URL(window.location.href);
    url.hash = "";
    if (next !== "playground") url.searchParams.set("view", next);
    else url.searchParams.delete("view");
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
  };
  const { theme } = useVariation();
  const { dark, radius, library } = theme;
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "remixes" && params.has("dark")) patchTheme({ dark: true });
  }, []);
  const setDark = (dark: boolean) => patchTheme({ dark });
  const setRadius = (radius: number) => patchTheme({ radius });
  const setLibrary = (library: IconLibrary) => patchTheme({ library });
  const [bounce, setBounce] = useState(0.4);
  const [duration, setDuration] = useState(0.3);
  const [tapScale, setTapScale] = useState(0.96);
  const [weight, setWeight] = useState<IconWeight>("regular");

  // Not every weight survives a library swap — Lucide can't draw `fill`. Fall
  // back for rendering only, so the original pick returns when Phosphor does.
  const effectiveWeight = ICON_WEIGHTS[library].includes(weight) ? weight : "regular";

  const controls: DocsControls = {
    spring: { bounce, duration, tapScale },
    icon: { library, weight: effectiveWeight },
    radius,
    dark,
  };

  return (
    <IconLibraryProvider library={library}>
      <div className={framed && view === "docs" ? "contents" : dark ? "theme-dark min-h-screen bg-[var(--color-bg-elevated)]" : "min-h-screen"}>
        {view === "remixes" && hasRemix(nav.active) ? <AsyncRemixes slug={nav.active} nav={nav} dark={dark} setDark={setDark} changeView={changeView} /> : hasPlayground && view === "playground" ? <AsyncPlayground nav={nav} breadcrumb={breadcrumb} changeView={changeView} /> : <>
        <DocsLayout toc={toc} breadcrumb={breadcrumb} nav={nav} views={(hasPlayground || hasRemix(nav.active)) ? <PageViews slug={nav.active} active="docs" onPlayground={hasPlayground ? () => changeView("playground") : undefined} onRemixes={hasRemix(nav.active) ? () => changeView("remixes") : undefined} /> : undefined}>
          {children(controls)}
        </DocsLayout>

        <CustomizePanel
          dark={dark}
          setDark={setDark}
          radius={radius}
          setRadius={setRadius}
          bounce={bounce}
          setBounce={setBounce}
          duration={duration}
          setDuration={setDuration}
          tapScale={tapScale}
          setTapScale={setTapScale}
          library={library}
          setLibrary={setLibrary}
          weight={effectiveWeight}
          setWeight={setWeight}
        />
        </>}
      </div>
    </IconLibraryProvider>
  );
}


function AsyncPlayground({ nav, breadcrumb, changeView }: { nav: DocsNav; breadcrumb: string[]; changeView: (view: DocsView) => void }) {
  const result = useAsyncContent(playgroundLoaders[nav.active]);
  const [settingsActive, setSettingsActive] = useState(false);
  if (result.status !== "ready" || settingsActive) return <RoutePending nav={nav} view="playground" error={result.status === "error"} onRetry={result.retry} onViewChange={changeView} onInteractionChange={setSettingsActive} />;
  return <ComponentPlayground key={`${nav.active}:${nav.locationKey ?? ""}`} spec={result.value} nav={nav} breadcrumb={breadcrumb} onDocumentation={() => changeView("docs")} onRemixes={hasRemix(nav.active) ? () => changeView("remixes") : undefined} />;
}
const loadRemixes = () => import("./remixes/RemixExamples").then(module => module.RemixExamples);
function AsyncRemixes({ slug, nav, dark, setDark, changeView }: { slug: import("./remixes/model").RemixSlug; nav: DocsNav; dark: boolean; setDark: (dark: boolean) => void; changeView: (view: DocsView) => void }) {
  const result = useAsyncContent(loadRemixes);
  const [settingsActive, setSettingsActive] = useState(false);
  if (result.status !== "ready" || settingsActive) return <RoutePending nav={nav} view="remixes" error={result.status === "error"} onRetry={result.retry} onViewChange={changeView} onInteractionChange={setSettingsActive} />;
  const Remixes = result.value;
  return <Remixes key={`${slug}:${nav.locationKey ?? ""}`} slug={slug} nav={nav} dark={dark} setDark={setDark} onPlayground={() => changeView("playground")} onDocumentation={() => changeView("docs")} />;
}

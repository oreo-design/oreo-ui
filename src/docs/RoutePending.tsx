import { useId, useState } from "react";
import { Tooltip } from "@base-ui-components/react/tooltip";
import { CATALOG, type CatalogSlug, type CatalogEntry } from "@/lib/catalog";
import { useDocsFrame } from "./DocsFrame";
import { DocsLayout } from "./DocsLayout";
import type { DocsNav } from "./DocsPage";
import { PageViews } from "./PageViews";
import { AsyncContentState } from "./AsyncContentState";
import { ComponentPicker } from "./playground/ComponentPicker";
import { ThemeChips } from "./playground/ThemeChips";
import { VariationPanel } from "./playground/VariationPanel";
import { Modal } from "./playground/Tools";
import { patchTheme, useVariation } from "./playground/useVariation";
import type { DocsView } from "./route-view";
import "./playground/playground.css";

/** Reuse the site's existing shells while a content module is unavailable. */
export function RoutePending({ nav, view, error, onRetry, onViewChange, onInteractionChange }: {
  nav: DocsNav; view: string; error?: boolean; onRetry: () => void; onViewChange?: (view: DocsView) => void; onInteractionChange?: (active: boolean) => void;
}) {
  const framed = useDocsFrame();
  const entry: CatalogEntry = CATALOG[nav.active as CatalogSlug];
  const [picker, setPicker] = useState(false);
  const [settings, setSettings] = useState(false);
  const changeSettings = (next: boolean) => { setSettings(next); onInteractionChange?.(next); };
  const themeId = useId();
  const { theme } = useVariation();
  const views = <PageViews slug={nav.active} active={view === "remixes" ? "remixes" : view === "playground" ? "playground" : "docs"}
    onPlayground={entry.views?.includes("playground") && onViewChange ? () => onViewChange("playground") : undefined}
    onDocumentation={entry.views?.includes("docs") && onViewChange ? () => onViewChange("docs") : undefined}
    onRemixes={entry.views?.includes("remixes") && onViewChange ? () => onViewChange("remixes") : undefined} />;
  if (framed) return <DocsLayout nav={nav} toc={[]} breadcrumb={[entry.nav.group, entry.title]} views={views}>
    <div className="flex items-center justify-between gap-4"><h1 className="text-3xl font-semibold tracking-tight">{entry.title}</h1><button className="site-action" type="button" aria-pressed={theme.dark} onClick={() => patchTheme({ dark: !theme.dark })}>Dark</button></div>
    <AsyncContentState title={entry.title} error={error} onRetry={onRetry} />
  </DocsLayout>;
  return <Tooltip.Provider delay={350}><div className="pg-shell">
    <header className="pg-header"><button className="pg-breadcrumb" onClick={() => setPicker(true)} aria-label={`${view === "playground" ? "Choose component" : "Choose page"}, current ${entry.title}`} aria-haspopup="dialog"><span className="pg-brand">Oreo UI</span><span>/</span><span className="pg-category">{entry.nav.group}</span><span>/</span><strong>{entry.title}</strong></button>{entry.views?.includes("docs") ? views : null}</header>
    <div className="pg-workspace"><main className="pg-main" aria-label={`${entry.title} ${view === "playground" ? "playground" : "page"}`}><div className="pg-content async-pending-region"><AsyncContentState title={entry.title} error={error} onRetry={onRetry} /></div><footer className="pg-theme-footer"><ThemeChips open={settings} onToggle={() => changeSettings(!settings)} panelId={themeId} triggerId={`${themeId}-trigger`} /></footer></main>
      {view === "playground" && <aside className="pg-inspector async-playground-inspector" aria-label="Properties" aria-busy={!error}><p className="pg-caption">Properties</p><div className="async-content-skeleton" aria-hidden="true"><i /><div /><i /><div /></div></aside>}
    </div>
    <ComponentPicker nav={nav} open={picker} setOpen={setPicker} />
    <Modal open={settings} onOpenChange={changeSettings} title="Theme settings" id={themeId}><VariationPanel onClose={() => changeSettings(false)} /></Modal>
  </div></Tooltip.Provider>;
}

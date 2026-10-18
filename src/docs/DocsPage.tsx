import { useState, type CSSProperties } from "react";
import { DocsLayout } from "./DocsLayout";
import { CustomizePanel } from "./CustomizePanel";
import { ComponentPlayground } from "./playground/ComponentPlayground";
import { RemixExamples } from "./remixes/RemixExamples";
import { hasRemix } from "./remixes/model";
import { playgrounds } from "./playground/registry";
import { PageViews } from "./PageViews";
import type { TocItem } from "./OnThisPage";
import { ICON_WEIGHTS, IconLibraryProvider, type IconLibrary, type IconWeight } from "@/components/icon";

export type SpringProps = { bounce: number; duration: number; tapScale: number };
export type IconControls = { library: IconLibrary; weight: IconWeight };
export type DocsControls = { spring: SpringProps; icon: IconControls; radius: number; dark: boolean };

export type DocsNav = { active: string; onNavigate: (id: string) => void };

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
  const spec = playgrounds[nav.active];
  const [view, setView] = useState<"playground" | "docs" | "remixes">(() => {
    const requested = new URLSearchParams(window.location.search).get("view");
    if (requested === "remixes" && hasRemix(nav.active)) return "remixes";
    return window.location.hash || requested === "docs" ? "docs" : "playground";
  });
  const changeView = (next: "playground" | "docs" | "remixes") => {
    setView(next);
    const url = new URL(window.location.href);
    url.hash = "";
    if (next !== "playground") url.searchParams.set("view", next);
    else url.searchParams.delete("view");
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
  };
  const [dark, setDark] = useState(() => new URLSearchParams(window.location.search).get("view") === "remixes" && new URLSearchParams(window.location.search).has("dark"));
  const [radius, setRadius] = useState(8);
  const [bounce, setBounce] = useState(0.4);
  const [duration, setDuration] = useState(0.3);
  const [tapScale, setTapScale] = useState(0.96);
  const [library, setLibrary] = useState<IconLibrary>("phosphor");
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
  const wrapStyle = { ["--radius-control" as string]: `${radius}px` } as CSSProperties;

  const appearance = { dark, setDark, radius, setRadius, bounce, setBounce, duration, setDuration, tapScale, setTapScale, library, setLibrary, weight: effectiveWeight, setWeight };

  return (
    <IconLibraryProvider library={library}>
      <div className={dark ? "theme-dark min-h-screen bg-[var(--color-bg-elevated)]" : "min-h-screen"} style={wrapStyle}>
        {view === "remixes" && hasRemix(nav.active) ? <RemixExamples slug={nav.active} nav={nav} dark={dark} setDark={setDark} onPlayground={() => changeView("playground")} onDocumentation={() => changeView("docs")} /> : spec && view === "playground" ? <ComponentPlayground spec={spec} nav={nav} breadcrumb={breadcrumb} appearance={appearance} onDocumentation={() => changeView("docs")} onRemixes={hasRemix(nav.active) ? () => changeView("remixes") : undefined} /> : <>
        <DocsLayout toc={toc} breadcrumb={breadcrumb} nav={nav} views={(spec || hasRemix(nav.active)) ? <PageViews slug={nav.active} active="docs" onPlayground={spec ? () => changeView("playground") : undefined} onRemixes={hasRemix(nav.active) ? () => changeView("remixes") : undefined} /> : undefined}>
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

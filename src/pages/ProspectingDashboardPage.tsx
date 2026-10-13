import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { OreoLogo } from "@/docs/OreoLogo";
import { ProspectingDashboard } from "@/patterns/prospecting-dashboard";

export function ProspectingDashboardPage(_: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.classList.contains("theme-dark");
    root.classList.toggle("theme-dark", dark);
    return () => { root.classList.toggle("theme-dark", previous); };
  }, [dark]);
  return <MotionConfig reducedMotion="user"><div className="min-h-dvh bg-bg-elevated text-text-primary"><header className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs sm:px-8"><a href="/prospecting-components?view=docs" className="flex items-center gap-2 text-text-secondary"><OreoLogo className="h-3 w-5" />Oreo UI <span className="text-text-tertiary">/ Templates /</span><span className="text-text-primary">Prospecting dashboard</span></a><a className="text-text-secondary underline-offset-4 hover:underline" href="/prospecting-components?view=docs">Explore components ↗</a></header><main className="mx-auto max-w-screen-2xl px-2 pb-8 sm:px-6"><ProspectingDashboard dark={dark} onToggleTheme={() => setDark(v => !v)} /></main></div></MotionConfig>;
}

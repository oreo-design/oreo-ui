import { useState } from "react";
import { MotionConfig } from "motion/react";
import { ReviewWorkspace } from "@/patterns/review-workspace";
import { OreoLogo } from "@/docs/OreoLogo";
import { Icon } from "@/components/icon";
import type { DocsNav } from "@/docs/DocsPage";

export function ReviewWorkspacePage({ nav }: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  return <MotionConfig reducedMotion="user"><div className={`${dark ? "theme-dark " : ""}flex h-dvh min-h-160 flex-col bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]`}>
    <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs sm:px-8">
      <a href="/review-components" onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); nav.onNavigate("review-components"); }} className="flex items-center gap-2 text-[var(--color-text-secondary)]"><OreoLogo className="h-3 w-5" /><span>Oreo UI</span><span className="px-1 opacity-40">/</span><span>Templates</span><span className="px-1 opacity-40">/</span><span className="text-[var(--color-text-primary)]">Review workspace</span></a>
      <a href="/review-components" className="flex items-center gap-1 text-[var(--color-text-secondary)]">Explore components <Icon name="arrow-out" size="sm" /></a>
    </header>
    <main className="min-h-0 flex-1 px-2 pb-2 sm:px-6 sm:pb-6"><ReviewWorkspace dark={dark} onToggleTheme={() => setDark(v => !v)} /></main>
  </div></MotionConfig>;
}

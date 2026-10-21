import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import { SkillsWorkspace } from "@/patterns/skills-workspace";
import { OreoLogo } from "@/docs/OreoLogo";
import type { DocsNav } from "@/docs/DocsPage";

export function SkillsWorkspacePage({ nav }: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return <MotionConfig reducedMotion="user"><div className={`${dark ? "theme-dark " : ""}flex min-h-dvh flex-col bg-bg-elevated text-text-primary`}>
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs sm:px-8">
      <a href="/skill-card" className="flex items-center gap-2 text-text-secondary"><OreoLogo className="h-3 w-5" /><span>Oreo UI</span><span className="opacity-40">/</span><span>Templates</span><span className="opacity-40">/</span><span className="text-text-primary">Skills workspace</span></a>
      <a href="/skill-card?view=docs" className="text-text-secondary underline-offset-4 hover:underline">Explore components ↗</a>
    </header>
    <main className="flex flex-1 px-2 pb-2 sm:px-6 sm:pb-6"><SkillsWorkspace dark={dark} onToggleTheme={() => setDark(v => !v)} onNavigate={nav.onNavigate} /></main>
  </div></MotionConfig>;
}

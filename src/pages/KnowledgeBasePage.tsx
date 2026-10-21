import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { OreoLogo } from "@/docs/OreoLogo";
import { KnowledgeBase } from "@/patterns/knowledge-base";
export function KnowledgeBasePage(_: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-bg-elevated text-text-primary">
        <header className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs sm:px-8">
          <a
            href="/knowledge-components?view=docs"
            className="flex items-center gap-2 text-text-secondary"
          >
            <OreoLogo className="h-3 w-5" />
            Oreo UI <span className="text-text-tertiary">/ Templates /</span>
            <span className="text-text-primary">Knowledge Base</span>
          </a>
          <a
            href="/knowledge-components?view=docs"
            className="text-text-secondary hover:underline"
          >
            Explore components ↗
          </a>
        </header>
        <div className="mx-auto max-w-screen-2xl px-2 pb-8 sm:px-6">
          <KnowledgeBase dark={dark} onToggleTheme={() => setDark((v) => !v)} />
        </div>
      </div>
    </MotionConfig>
  );
}

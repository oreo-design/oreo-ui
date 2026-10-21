import { useThemeMode } from "@/lib/theme/useThemeMode";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { OreoLogo } from "@/docs/OreoLogo";
import { DocumentWorkspace } from "@/patterns/document-workspace";
export function DocumentWorkspacePage(_: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(true);
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-bg-elevated p-3 text-text-primary sm:p-6">
        <header className="mx-auto mb-5 flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href="/document-activity?view=docs"
            className="flex items-center gap-2 text-text-secondary"
          >
            <OreoLogo className="h-3 w-5" />
            Oreo UI / Templates /{" "}
            <span className="text-text-primary">Document Workspace</span>
          </a>
          <a
            href="/document-activity?view=docs"
            className="text-text-secondary hover:underline"
          >
            Explore components ↗
          </a>
        </header>
        <div className="mx-auto max-w-screen-2xl">
          <DocumentWorkspace
            dark={dark}
            onToggleTheme={() => setDark((value) => !value)}
          />
        </div>
      </div>
    </MotionConfig>
  );
}

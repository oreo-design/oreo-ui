import { useEffect, useState } from "react";
import { MotionConfig } from "motion/react";
import type { DocsNav } from "@/docs/DocsPage";
import { OreoLogo } from "@/docs/OreoLogo";
import { CommentWorkspace } from "@/patterns/comment-workspace";
export function CommentWorkspacePage(_: { nav: DocsNav }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.classList.contains("theme-dark");
    root.classList.toggle("theme-dark", dark);
    return () => {
      root.classList.toggle("theme-dark", previous);
    };
  }, [dark]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-dvh bg-bg-elevated text-text-primary">
        <header className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs sm:px-8">
          <a
            href="/comment-thread?view=docs"
            className="flex items-center gap-2 text-text-secondary"
          >
            <OreoLogo className="h-3 w-5" />
            Oreo UI <span className="text-text-tertiary">/ Templates /</span>
            <span className="text-text-primary">Comment Workspace</span>
          </a>
          <a
            href="/comment-thread?view=docs"
            className="text-text-secondary hover:underline"
          >
            Explore components ↗
          </a>
        </header>
        <div className="mx-auto max-w-screen-2xl px-2 pb-8 sm:px-6">
          <CommentWorkspace
            dark={dark}
            onToggleTheme={() => setDark((v) => !v)}
          />
          <p className="mt-5 px-2 text-xs leading-5 text-text-tertiary">
            Interactive local demo · changes reset on reload. Thread interaction
            inspired by{" "}
            <a
              href="https://x.com/justvasi/status/2110388408061444136"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Vas
            </a>
            .
          </p>
        </div>
      </div>
    </MotionConfig>
  );
}

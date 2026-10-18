import { useState } from "react";
import { Sidebar } from "@/docs/Sidebar";
import { Board } from "@/patterns/board";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import type { DocsNav } from "@/docs/DocsPage";

/**
 * Onboarding board — a full-width "pattern" page (not a component doc, so it
 * skips the DocsPage shell). Keeps the Sidebar for in-site navigation and a
 * local dark toggle that reuses the global `.theme-dark` token skin.
 */
export function BoardPage({ nav }: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  // Bump this to force a fresh <Board> mount after resetting the board.
  const [resetKey, setResetKey] = useState(0);

  const reset = () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem("oreo-onboarding-board");
    setResetKey((k) => k + 1);
  };

  return (
    <div className={dark ? "theme-dark min-h-screen bg-[var(--color-bg-elevated)]" : "min-h-screen"}>
      <div className="mx-auto flex bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
        <Sidebar nav={nav} />
        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
          <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Onboarding Board</h1>
              <p className="mt-2 max-w-prose text-[14px] leading-6 text-[var(--color-text-secondary)]">
                Drag tasks, edit notes, and add cards. Changes are saved in this browser.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="tertiary"
                size="sm"
                leadingIcon={<Icon name="reset" size="sm" />}
                onClick={reset}
              >
                Reset
              </Button>
              <Button
                type="secondary"
                size="sm"
                leadingIcon={<Icon name={dark ? "sun" : "moon"} size="sm" />}
                onClick={() => setDark((d) => !d)}
              >
                {dark ? "Light" : "Dark"}
              </Button>
            </div>
          </header>

          <Board key={resetKey} />
        </main>
      </div>
    </div>
  );
}

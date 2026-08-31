import { useState } from "react";
import { Sidebar } from "@/docs/Sidebar";
import { Stream, useStream } from "@/patterns/stream";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import type { DocsNav } from "@/docs/DocsPage";

/**
 * Inbox stream — a full-width "pattern" page (like the board, it skips the
 * DocsPage shell). The header buttons drive the demo state so every layer of
 * the motion contract can be exercised live: inject a card (enter), hover a
 * card and mark it read (exit + gap heal), mark everything read (cards →
 * tier collapse → empty-state fade), toggle the skeleton.
 */
export function StreamPage({ nav }: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  const state = useStream();

  return (
    <div className={dark ? "theme-dark min-h-screen bg-[var(--color-bg-elevated)]" : "min-h-screen"}>
      <div className="mx-auto flex max-w-[1400px] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
        <Sidebar nav={nav} />
        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
          <header className="mb-10 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-semibold tracking-tight">Inbox Stream</h1>
              <p className="mt-2 max-w-prose text-[14px] leading-6 text-[var(--color-text-secondary)]">
                A feed of dismissable cards in two urgency tiers, with filter chips, a skeleton
                and an empty state. Cards are generic shells — any content grafts in. The point is
                the choreography: inject a card, mark one read, then mark everything read and
                watch the exits cascade.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
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

          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <Button
              type="secondary"
              size="sm"
              leadingIcon={<Icon name="plus" size="sm" />}
              onClick={() => state.injectCard()}
            >
              New card
            </Button>
            <Button
              type="secondary"
              size="sm"
              leadingIcon={<Icon name="checks" size="sm" />}
              onClick={state.markAllRead}
            >
              Mark all read
            </Button>
            <Button
              type="secondary"
              size="sm"
              leadingIcon={<Icon name="circle-dashed" size="sm" />}
              onClick={state.toggleLoading}
            >
              {state.loading ? "Loaded" : "Loading"}
            </Button>
            <Button
              type="tertiary"
              size="sm"
              leadingIcon={<Icon name="reset" size="sm" />}
              onClick={state.reset}
            >
              Reset
            </Button>
          </div>

          <Stream state={state} onOpen={() => {}} />
        </main>
      </div>
    </div>
  );
}

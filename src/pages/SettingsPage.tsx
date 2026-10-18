import * as React from "react";
import { Sidebar } from "@/docs/Sidebar";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { SettingsShell } from "@/patterns/settings";
import { DEFAULT_SETTINGS_APPEARANCE, type SettingsAppearance } from "@/patterns/settings";
import { DEMO_NAV, DEFAULT_DEMO_PAGE, type DemoPageId } from "@/patterns/settings/demo/nav";
import { DemoPage, type DemoFrame } from "@/patterns/settings/demo/pages";
import { ConfigPanel } from "@/patterns/settings/demo/ConfigPanel";
import type { DocsNav } from "@/docs/DocsPage";

const STORAGE_KEY = "oreo-settings-frame";

type FrameState = { appearance: SettingsAppearance; dark: boolean };

function loadFrameState(): FrameState {
  const fallback: FrameState = { appearance: DEFAULT_SETTINGS_APPEARANCE, dark: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<FrameState>;
    return {
      appearance: { ...DEFAULT_SETTINGS_APPEARANCE, ...parsed.appearance },
      dark: Boolean(parsed.dark),
    };
  } catch {
    return fallback;
  }
}

/**
 * Settings — a full-width "pattern" page (like the Onboarding Board): the
 * configurable settings framework in a framed viewport, with a floating panel
 * that flips its three appearance axes live.
 */
export function SettingsPage({ nav }: { nav: DocsNav }) {
  const [{ appearance, dark }, setFrame] = React.useState(loadFrameState);
  const [page, setPage] = React.useState<DemoPageId>(DEFAULT_DEMO_PAGE);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ appearance, dark }));
    } catch {
      /* storage may be unavailable; the frame still works */
    }
  }, [appearance, dark]);

  const setAppearance = (next: SettingsAppearance) => setFrame((s) => ({ ...s, appearance: next }));
  const setDark = (next: boolean) => setFrame((s) => ({ ...s, dark: next }));
  const frame: DemoFrame = { appearance, setAppearance, dark, setDark };

  return (
    <div className={dark ? "theme-dark min-h-screen bg-[var(--color-bg-elevated)]" : "min-h-screen"}>
      <div className="mx-auto flex bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
        <Sidebar nav={nav} />
        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
          <header className="mb-7 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
              <p className="mt-2 max-w-prose text-[14px] leading-6 text-[var(--color-text-secondary)]">
                Preview background, card, and navigation options.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="tertiary"
                size="sm"
                leadingIcon={<Icon name="reset" size="sm" />}
                onClick={() => setFrame({ appearance: DEFAULT_SETTINGS_APPEARANCE, dark: false })}
              >
                Reset
              </Button>
              <Button
                type="secondary"
                size="sm"
                leadingIcon={<Icon name={dark ? "sun" : "moon"} size="sm" />}
                onClick={() => setDark(!dark)}
              >
                {dark ? "Light" : "Dark"}
              </Button>
            </div>
          </header>

          <div className="h-[clamp(560px,calc(100dvh-280px),820px)] overflow-hidden rounded-2xl border-[0.5px] border-[var(--color-border-subtle)] shadow-[var(--shadow-default)]">
            <SettingsShell
              appearance={appearance}
              groups={DEMO_NAV}
              active={page}
              onNavigate={(id) => setPage(id as DemoPageId)}
              contentKey={page}
            >
              <DemoPage page={page} frame={frame} />
            </SettingsShell>
          </div>
        </main>
      </div>

      <ConfigPanel appearance={appearance} setAppearance={setAppearance} dark={dark} setDark={setDark} />
    </div>
  );
}

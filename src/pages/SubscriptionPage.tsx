import { useThemeMode } from "@/lib/theme/useThemeMode";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { SubscriptionWorkspace } from "@/patterns/subscription";
import { OreoLogo } from "@/docs/OreoLogo";
import type { DocsNav } from "@/docs/DocsPage";

export function SubscriptionPage({ nav: _nav }: { nav: DocsNav }) {
  const [dark, setDark] = useThemeMode(false);
  return <div className={`${dark ? "theme-dark " : ""}min-h-dvh bg-bg-elevated text-text-primary`}><header className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle bg-bg-base px-5 py-4 text-xs sm:px-8"><a href="/subscription-components" className="flex items-center gap-2 text-text-secondary"><OreoLogo className="h-3 w-5" />Oreo UI <span className="text-text-tertiary">/ Templates /</span><span className="text-text-primary">Subscription</span></a><div className="flex items-center gap-4"><a href="/subscription-components?view=docs" className="text-text-secondary hover:underline">Explore components ↗</a><Button type="tertiary" size="sm" tapScale={1} aria-label={dark ? "Use light theme" : "Use dark theme"} onClick={() => setDark(value => !value)} leadingIcon={<Icon name={dark ? "sun" : "moon"} />}>{dark ? "Light" : "Dark"}</Button></div></header><SubscriptionWorkspace dark={dark} /><footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-xs text-text-tertiary sm:px-8"><span>Interactive template · Local preview</span><a href="https://x.com/HamzaInstantly/status/2110392051074511159" target="_blank" rel="noreferrer" className="hover:underline">Reference via Hamza A. · Benji Taylor ↗</a></footer></div>;
}

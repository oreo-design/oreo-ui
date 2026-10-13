import { useState } from "react";
import { FeaturesShowcase } from "@/patterns/features-showcase";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import type { DocsNav } from "@/docs/DocsPage";

export function FeaturesShowcasePage({ nav: _nav }: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  return <div className={`${dark ? "theme-dark " : ""}min-h-dvh bg-bg-elevated text-text-primary`}>
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle px-6 py-4 text-xs sm:px-10">
      <a href="/feature-cards" className="flex items-center gap-2 text-text-secondary"><OreoLogo className="h-3 w-5" />Oreo UI <span className="text-text-tertiary">/ Templates /</span> <span className="text-text-primary">Features</span></a>
      <div className="flex items-center gap-4"><a href="/feature-cards?view=docs" className="text-text-secondary hover:underline">Explore components ↗</a><Button type="tertiary" size="sm" tapScale={1} aria-label={dark ? "Use light theme" : "Use dark theme"} onClick={() => setDark(v => !v)} leadingIcon={<Icon name={dark ? "sun" : "moon"} />}>{dark ? "Light" : "Dark"}</Button></div>
    </header>
    <main><h1 className="sr-only">Features showcase</h1><FeaturesShowcase /></main>
    <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-6 pb-8 text-xs text-text-tertiary sm:px-10"><span>Features / 04</span><a href="https://x.com/TailarkUI/status/2109456782389321994" target="_blank" rel="noreferrer" className="hover:underline">Inspired by Tailark ↗</a></footer>
  </div>;
}

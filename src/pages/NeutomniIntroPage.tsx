import { useState } from "react";
import { NeutomniIntro } from "@/patterns/neutomni-intro/NeutomniIntro";
import { OreoLogo } from "@/docs/OreoLogo";
import type { DocsNav } from "@/docs/DocsPage";

export function NeutomniIntroPage({ nav: _nav }: { nav: DocsNav }) {
  const [replay, setReplay] = useState(0);
  return <div className="min-h-dvh bg-bg-inverse text-text-on-inverse">
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs sm:px-8">
      <a href="/cut-reveal" className="flex items-center gap-2"><OreoLogo className="h-3 w-5" />Oreo UI<span className="opacity-40">/</span>Neutomni intro</a>
      <div className="flex items-center gap-4"><a href="/cut-reveal?view=docs" className="underline underline-offset-4">Component &amp; code ↗</a><button onClick={() => setReplay(value => value + 1)} className="cursor-pointer rounded-full border border-current/30 px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-4">Replay intro ↻</button></div>
    </header>
    <main className="mx-auto max-w-[1600px] px-3 pb-3 sm:px-12 sm:pb-8"><NeutomniIntro key={replay} /></main>
    <footer className="flex flex-wrap justify-between gap-2 px-4 pb-6 text-[11px] opacity-60 sm:px-12"><span>Independent interaction study · Neutomni × Oreo UI</span><a href="https://x.com/awwwards/status/2109917839805001781" target="_blank" rel="noreferrer" className="underline underline-offset-4">Watch the reference ↗</a></footer>
  </div>;
}

import { useState } from "react";
import { OrbitGallery } from "@/components/orbit-gallery";
import { orbitGalleryItems } from "@/patterns/orbit-gallery/items";
import { OreoLogo } from "@/docs/OreoLogo";
import type { DocsNav } from "@/docs/DocsPage";

export function OrbitGalleryShowcasePage({ nav: _nav }: { nav: DocsNav }) {
  const [dark, setDark] = useState(false);
  return <div className={dark ? "theme-dark min-h-dvh bg-bg-elevated text-text-primary" : "min-h-dvh bg-bg-elevated text-text-primary"}>
    <header className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4 text-xs sm:px-8"><a href="/orbit-gallery" className="flex shrink-0 items-center gap-2 whitespace-nowrap"><OreoLogo className="h-3 w-5" />Oreo UI <span className="hidden text-text-tertiary sm:inline">/ Orbit Gallery</span></a><div className="flex items-center gap-5"><a href="/orbit-gallery?view=docs" className="whitespace-nowrap underline underline-offset-4">Component &amp; code ↗</a><button type="button" aria-label="Dark mode" aria-pressed={dark} onClick={() => setDark(value => !value)} className="cursor-pointer rounded-full border border-border-default px-3 py-1.5">{dark ? "Light" : "Dark"}</button></div></header>
    <main className="mx-auto max-w-[1440px]"><OrbitGallery items={orbitGalleryItems} style={{ height: "calc(100svh - 112px)", minHeight: 480 }} /></main>
    <footer className="flex flex-wrap justify-between gap-2 px-5 pb-5 text-[10px] text-text-tertiary sm:px-8"><span>Interaction study · Awesome Design × Oreo UI</span><a href="https://www.pinterest.com/pin/211174979526687/" target="_blank" rel="noreferrer" className="underline underline-offset-4">Watch the reference ↗</a></footer>
  </div>;
}

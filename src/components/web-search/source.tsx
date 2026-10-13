import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut, pressSpring } from "@/lib/motion";
import type { PaletteColor } from "@/lib/palette";
import "./web-search.css";

export type WebSource = {
  id: string;
  title: string;
  url: string;
  /** Optional display name; otherwise uses the full hostname. */
  name?: string;
  snippet?: string;
  favicon?: string;
  icon?: ReactNode;
  color?: PaletteColor;
};

export function sourceHost(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ""); }
  catch { return url; }
}

/** Do not turn untrusted search-result URLs into executable links. */
export function sourceHref(url: string) {
  try { const parsed = new URL(url); return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : undefined; }
  catch { return undefined; }
}

export function WebSearchFavicon({ source, small = false }: { source: WebSource; small?: boolean }) {
  const [failed, setFailed] = useState<string>();
  return <span aria-hidden className={cn("inline-flex shrink-0 items-center justify-center overflow-hidden rounded-capsule text-xs font-semibold leading-none", small ? "size-4" : "size-5")}
    style={{ background: `var(--color-palette-${source.color ?? "default"}-bg)`, color: `var(--color-palette-${source.color ?? "default"}-text)` }}>
    {source.icon ?? (source.favicon && failed !== source.favicon
      ? <img src={source.favicon} alt="" draggable={false} className="size-full object-cover" onError={() => setFailed(source.favicon)} />
      : (source.name ?? sourceHost(source.url)).charAt(0).toUpperCase())}
  </span>;
}

/** Icons reserve their spread space: hover cannot resize the surrounding trigger. */
export function WebSearchSourceStack({ sources, className }: { sources: WebSource[]; className?: string }) {
  const reduced = useReducedMotion();
  return <span aria-hidden className={cn("oreo-search-stack inline-flex shrink-0 items-center pr-3", className)}>
    <AnimatePresence initial={false}>
      {sources.slice(0, 4).map((source, index) => <motion.span key={source.id}
        initial={{ opacity: 0, transform: reduced ? "scale(1)" : "scale(0.9)" }}
        animate={{ opacity: 1, transform: "scale(1)" }} exit={{ opacity: 0 }}
        transition={reduced ? { duration: .15 } : pressSpring}
        className="oreo-search-stack-item relative -ml-2 first:ml-0" style={{ zIndex: 4 - index }}>
        <span className="oreo-search-stack-plate block rounded-capsule border-2 border-bg-elevated bg-bg-elevated"><WebSearchFavicon source={source} /></span>
      </motion.span>)}
    </AnimatePresence>
  </span>;
}

export function WebSearchSourceCard({ source, index, className }: { source: WebSource; index?: number; className?: string }) {
  return <a href={sourceHref(source.url)} target="_blank" rel="noreferrer" title={source.title}
    className={cn("oreo-search-card flex min-h-24 flex-col justify-between gap-3 rounded-card-small bg-bg-elevated p-3 text-left text-text-primary", className)}>
    <span className="line-clamp-2 text-xs font-medium leading-4">{source.title}</span>
    <span className="flex min-w-0 items-center gap-1.5 text-xs text-text-secondary">
      <WebSearchFavicon source={source} small /><span className="min-w-0 flex-1 truncate">{source.name ?? sourceHost(source.url)}</span>
      {index != null && <span className="text-text-tertiary tabular-nums">{index}</span>}
    </span>
  </a>;
}

export function WebSearchCount({ count }: { count: number }) {
  const reduced = useReducedMotion();
  return <span className="relative inline-grid overflow-hidden align-bottom tabular-nums"><AnimatePresence initial={false} mode="popLayout">
    <motion.span key={count} initial={{ opacity: 0, transform: reduced ? "translateY(0%)" : "translateY(75%)" }}
      animate={{ opacity: 1, transform: "translateY(0%)" }} exit={{ opacity: 0, transform: reduced ? "translateY(0%)" : "translateY(-75%)" }}
      transition={{ duration: .2, ease: easeOut }}>{count}</motion.span>
  </AnimatePresence></span>;
}

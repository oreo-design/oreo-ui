import { useId, useState } from "react";
import { PreviewCard } from "@base-ui-components/react/preview-card";
import { cn } from "@/lib/cn";
import { sourceHost, sourceHref, WebSearchFavicon, type WebSource } from "./source";

export type WebSearchCitationProps = { source: WebSource; index?: number; className?: string };

/** Base UI owns hover intent, focus, Escape, pointer travel and edge collision. */
export function WebSearchCitation({ source, index, className }: WebSearchCitationProps) {
  const [host, setHost] = useState<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  return <span ref={setHost} className={cn("inline-flex align-baseline", className)}>
    <PreviewCard.Root open={open} onOpenChange={setOpen}>
      <PreviewCard.Trigger href={sourceHref(source.url)} target="_blank" rel="noreferrer" delay={300} closeDelay={150}
        aria-label={`${source.title}, ${sourceHost(source.url)}`} aria-describedby={open ? id : undefined}
        onFocus={() => setOpen(true)}
        className="oreo-search-citation inline-flex max-w-full items-center gap-1 rounded-capsule bg-bg-elevated px-1.5 py-0.5 text-xs leading-none text-text-secondary no-underline">
        <WebSearchFavicon source={source} small /><span className="max-w-32 truncate">{source.name ?? sourceHost(source.url)}</span>
        {index != null && <span className="text-text-tertiary tabular-nums">{index}</span>}
      </PreviewCard.Trigger>
      <PreviewCard.Portal container={host}>
        <PreviewCard.Positioner side="top" sideOffset={8} positionMethod="fixed" className="z-50">
          <PreviewCard.Popup id={id} className="oreo-search-preview whitespace-normal break-words w-72 max-w-[calc(100vw-2rem)] rounded-card-medium bg-bg-surface p-3 text-left text-text-primary shadow-[var(--shadow-overlay)]">
            <span className="flex items-center gap-1.5 text-xs text-text-secondary"><WebSearchFavicon source={source} /><span className="truncate">{sourceHost(source.url)}</span></span>
            <span className="mt-2 block text-sm font-medium leading-5">{source.title}</span>
            {source.snippet && <span className="mt-1 block text-xs leading-5 text-text-secondary">{source.snippet}</span>}
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </span>;
}

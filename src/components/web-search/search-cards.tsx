import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icon";
import { ActivityLabel } from "@/components/activity-label";
import { Button } from "@/components/button";
import { cn } from "@/lib/cn";
import { easeOut } from "@/lib/motion";
import { WebSearchCount, WebSearchSourceCard, WebSearchSourceStack, type WebSource } from "./source";
import { WebSearchProgress } from "./search-progress";

export type WebSearchCardsProps = {
  query: string;
  sources: WebSource[];
  searching?: boolean;
  summary?: ReactNode;
  progress?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  error?: string;
  onRetry?: () => void;
  className?: string;
};

/** Height measurement also covers later expansion and responsive reflow. */
function SourcePanel({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => setHeight(element.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <motion.div id={id} inert={!open} aria-hidden={!open} initial={false}
    animate={{ height: open ? height ?? "auto" : 0, opacity: open ? 1 : 0 }}
    transition={{ duration: reduced ? 0 : .25, ease: easeOut }} className="overflow-hidden">
    <div ref={ref} className="p-1">{children}</div>
  </motion.div>;
}

export function WebSearchCards({ query, sources, searching = false, summary, progress, open, defaultOpen = true, onOpenChange,
  expanded, defaultExpanded = false, onExpandedChange, error, onRetry, className }: WebSearchCardsProps) {
  const reduced = useReducedMotion();
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const [localOpen, setOpen] = useState(defaultOpen);
  const [localExpanded, setExpanded] = useState(defaultExpanded);
  const isOpen = open ?? localOpen;
  const isExpanded = expanded ?? localExpanded;
  const hasMore = sources.length >= 4;
  const shown = !isExpanded && hasMore ? sources.slice(0, 3) : sources;
  const hidden = sources.slice(3);
  const changeExpanded = (next: boolean) => {
    // Show-less disappears after the update: move focus before it unmounts.
    if (!next) trigger.current?.focus();
    if (expanded === undefined) setExpanded(next);
    onExpandedChange?.(next);
  };
  const complete = summary ?? (error ? "Search interrupted" : <>Searched <WebSearchCount count={sources.length} /> {sources.length === 1 ? "site" : "sites"}</>);
  return <div className={cn("oreo-search w-full max-w-xl text-text-primary", className)} data-searching={searching || undefined}>
    <button ref={trigger} type="button" className="oreo-search-trigger inline-flex max-w-full items-center gap-2 rounded-capsule bg-bg-elevated py-1.5 pr-3 pl-1.5 text-left text-sm font-medium"
      aria-expanded={isOpen} aria-controls={id} onClick={() => { if (open === undefined) setOpen(!isOpen); onOpenChange?.(!isOpen); }}>
      <WebSearchProgress searching={searching && !error} count={sources.length} progress={progress} />
      <span className="min-w-0 overflow-hidden" aria-live="polite"><ActivityLabel active={searching && !error} activeLabel={`Searching “${query}”`} label={complete} /></span>
      <WebSearchSourceStack sources={sources} />
      <span className="shrink-0 transition-transform duration-200 ease-out motion-reduce:transition-none" style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}><Icon name="chevron-down" size="sm" /></span>
    </button>
    <SourcePanel open={isOpen} id={id}>
      <ol aria-label="Search sources" className="oreo-search-grid gap-2 pt-2">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((source, index) => <motion.li key={source.id} layout={!reduced}
            initial={{ opacity: 0, transform: reduced ? "translateY(0px) scale(1)" : "translateY(8px) scale(.97)", filter: reduced ? "blur(0px)" : "blur(4px)" }}
            animate={{ opacity: 1, transform: "translateY(0px) scale(1)", filter: "blur(0px)" }} exit={{ opacity: 0 }}
            transition={{ duration: .25, ease: easeOut, delay: reduced ? 0 : Math.min(index, 3) * .04 }}>
            <WebSearchSourceCard source={source} index={index + 1} />
          </motion.li>)}
          {searching && !error && sources.length < 4 && Array.from({ length: 4 - sources.length }, (_, index) => <motion.li key={`waiting-${sources.length + index}`} aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .15 }}>
            <div className="oreo-search-skeleton relative flex min-h-24 flex-col justify-between overflow-hidden rounded-card-small bg-bg-elevated p-3">
              <span className="space-y-1.5"><span className="block h-2.5 w-5/6 rounded-capsule bg-state-press" /><span className="block h-2.5 w-2/3 rounded-capsule bg-state-press" /></span>
              <span className="block h-3 w-1/2 rounded-capsule bg-state-press" />
            </div>
          </motion.li>)}
        {hasMore && <motion.li key="more" layout={!reduced} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2, ease: easeOut }}><button type="button" onClick={() => changeExpanded(!isExpanded)} aria-expanded={isExpanded}
          aria-label={isExpanded ? "Show fewer sources" : `Show ${hidden.length} more sources`}
          className="oreo-search-card flex min-h-24 w-full flex-col justify-between gap-3 rounded-card-small bg-bg-elevated p-3 text-left text-xs font-medium">
          {isExpanded ? <Icon name="chevron-down" className="rotate-180" size="sm" /> : <WebSearchSourceStack sources={hidden} />}
          <span>{isExpanded ? "Show less" : <><WebSearchCount count={hidden.length} /> more {hidden.length === 1 ? "source" : "sources"}</>}</span>
        </button></motion.li>}
        </AnimatePresence>
      </ol>
      {error ? <div role="alert" className="mt-2 flex flex-wrap items-center gap-3 rounded-control bg-bg-elevated p-3 text-sm text-text-secondary"><span>{error}</span>{onRetry && <Button type="secondary" size="sm" onClick={onRetry}>Retry search</Button>}</div>
        : !searching && sources.length === 0 ? <p role="status" className="py-3 text-sm text-text-secondary">No sources found.</p> : null}
    </SourcePanel>
  </div>;
}

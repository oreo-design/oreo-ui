import * as React from "react";
import { WebSearchCards, type WebSearchCardsProps } from "./search-cards";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { easeOut, useHidden } from "@/lib/motion";
import { Icon } from "@/components/icon";
import { ActivityLabel } from "@/components/activity-label";

export type WebSearchListProps = {
  query: string;
  /** True while results stream in — shimmers the status line. */
  searching?: boolean;
  /** Resting status — "Read 3 sources". */
  summary?: React.ReactNode;
  /** WebSearchResult rows. */
  children?: React.ReactNode;
  className?: string;
};

/**
 * Oreo UI Web Search — a search tool run rendered richly.
 *
 * Query pill, shimmered "Searching" status that swaps to a summary, and a
 * result list that fades in row by row. For the generic collapsed variant,
 * use Tool Call instead.
 */
export type WebSearchProps = WebSearchListProps | WebSearchCardsProps;

/** Pass sources for the interactive card mode; children preserve the original list API. */
export function WebSearch(props: WebSearchProps) {
  if ("sources" in props) return <WebSearchCards {...props} />;
  return <WebSearchList {...props} />;
}

function WebSearchList({ query, searching = false, summary, children, className }: WebSearchListProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2.5", className)}>
      <span className="inline-flex w-fit max-w-full items-center gap-1.5 rounded-[var(--radius-capsule)] bg-[var(--color-state-hover)] px-3.5 py-2 text-[12px] text-[var(--color-text-primary)]">
        <Icon name="search" size="sm" className="shrink-0 text-[var(--color-text-disabled)]" />
        <span className="truncate">{query}</span>
      </span>
      <div className="text-[12px] text-[var(--color-text-secondary)]">
        <ActivityLabel active={searching} activeLabel="Searching" label={summary ?? "Done"} />
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

export type WebSearchResultProps = {
  domain: string;
  title: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"a">, "title">;

export function WebSearchResult({ domain, title, className, ...rest }: WebSearchResultProps) {
  // Results stream in as the search resolves — full transform string, not `y`.
  const hidden = useHidden({ transform: "translateY(4px)" });
  return (
    <motion.span
      initial={hidden}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.3, ease: easeOut }}
      className="block"
    >
      <a
        target="_blank"
        rel="noreferrer"
        className={cn(
          "-mx-2.5 flex items-center gap-2.5 rounded-xl px-2.5 py-1.5",
          "transition-colors hover:bg-[var(--color-state-hover)]",
          "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
          className,
        )}
        {...rest}
      >
        <span
          aria-hidden
          className="flex size-4 shrink-0 items-center justify-center rounded-[var(--radius-control-tiny)] bg-[var(--color-state-press)] text-[9px] font-medium text-[var(--color-text-secondary)]"
        >
          {domain.charAt(0).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13.5px] text-[var(--color-text-primary)]">{title}</span>
        <span className="shrink-0 font-mono text-[11px] tracking-tight text-[var(--color-text-disabled)]">{domain}</span>
      </a>
    </motion.span>
  );
}

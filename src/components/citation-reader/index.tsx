import { useId, useState, useEffect, useRef } from "react";
import { Popover } from "@base-ui-components/react/popover";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { StatusView } from "@/components/status-view";
import { SkeletonReveal } from "@/components/finance-overview";
import { ThemePortalTypography } from "@/lib/theme/ThemeScope";
import {
  sourceHost,
  sourceHref,
  WebSearchFavicon,
} from "@/components/web-search/source";
import {
  citationEntries,
  uniqueSources,
  matchedText,
  passageHref,
  type CitationSource,
  type CitationClaim,
  type CitationEvidence,
} from "./model";
import "./citation-reader.css";
export * from "./model";

export function CitationSourcePreview({
  source,
  evidence,
  index = 0,
  count = 1,
  onPrevious,
  onNext,
  onClose,
}: {
  source: CitationSource;
  evidence: CitationEvidence;
  index?: number;
  count?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onClose?: () => void;
}) {
  const href = passageHref(source, evidence);
  return (
    <div className="cr-preview oreo-squircle">
      <div className="cr-preview-body oreo-squircle">
        <div className="cr-source-meta">
          <WebSearchFavicon source={source} small />
          <span>{sourceHost(source.url)}</span>
          <span className="cr-evidence-kind">
            {evidence.exact
              ? "Exact quote"
              : source.kind === "article"
                ? "Article"
                : "Source note"}
          </span>
          {onClose && (
            <IconButton
              type="tertiary"
              size="sm"
              icon={<Icon name="x" />}
              aria-label="Close source preview"
              onClick={onClose}
            />
          )}
        </div>
        <h3>{source.title}</h3>
        <p>{evidence.excerpt || "No excerpt provided."}</p>
      </div>
      <footer>
        <div className="cr-pager">
          <IconButton
            type="tertiary"
            size="sm"
            icon={<Icon name="chevron-left" />}
            aria-label="Previous citation"
            disabled={!onPrevious || index <= 0}
            onClick={onPrevious}
          />
          <span aria-live="polite">
            {index + 1} / {count}
          </span>
          <IconButton
            type="tertiary"
            size="sm"
            icon={<Icon name="chevron-right" />}
            aria-label="Next citation"
            disabled={!onNext || index >= count - 1}
            onClick={onNext}
          />
        </div>
        {href ? (
          <a
            className="cr-destination oreo-state-layer oreo-focus"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {evidence.exact ? "Jump to passage" : "Read source"}
            <Icon name="arrow-up-right" size="sm" />
          </a>
        ) : (
          <span className="cr-unavailable">Link unavailable</span>
        )}
      </footer>
    </div>
  );
}

export function CitationSourceList({
  sources,
  activeId,
  onActiveChange,
  disabled = false,
}: {
  sources: CitationSource[];
  activeId?: string | null;
  onActiveChange?: (id: string | null) => void;
  disabled?: boolean;
}) {
  const items = uniqueSources(sources);
  return items.length ? (
    <ol
      className="cr-source-list"
      aria-label="Answer sources"
      onPointerLeave={() => onActiveChange?.(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          onActiveChange?.(null);
      }}
    >
      {items.map((source, i) => (
        <li key={source.id} data-active={source.id === activeId || undefined}>
          <button
            type="button"
            className="cr-source-row oreo-state-layer oreo-focus"
            disabled={disabled}
            aria-label={`Highlight sentences from ${source.title}`}
            aria-pressed={source.id === activeId}
            onPointerEnter={(e) => {
              if (!disabled && e.pointerType !== "touch")
                onActiveChange?.(source.id);
            }}
            onFocus={() => {
              if (!disabled) onActiveChange?.(source.id);
            }}
            onClick={() => onActiveChange?.(source.id)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                onActiveChange?.(null);
              }
            }}
          >
            <span className="cr-source-number">{i + 1}</span>
            <WebSearchFavicon source={source} />
            <span className="cr-source-title">{source.title}</span>
            <span className="cr-source-domain">
              {source.name ?? sourceHost(source.url)}
            </span>
          </button>
          {sourceHref(source.url) && (
            <a
              className="cr-source-open oreo-state-layer oreo-focus"
              aria-label={`Open ${source.title}`}
              href={sourceHref(source.url)}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="arrow-up-right" size="sm" />
            </a>
          )}
        </li>
      ))}
    </ol>
  ) : (
    <div className="cr-empty">
      <StatusView
        title="No sources"
        description="This answer has no linked sources."
      />
    </div>
  );
}

type Active = { anchor: string; index: number };
export function CitationAnswer({
  claims,
  sources,
  title = "Answer",
  sourceState = "ready",
  onRetry,
  disabled = false,
}: {
  claims: CitationClaim[];
  sources: CitationSource[];
  title?: string;
  sourceState?: "ready" | "loading" | "error";
  onRetry?: () => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [host, setHost] = useState<HTMLElement | null>(null),
    [active, setActive] = useState<Active | null>(null),
    [listSource, setListSource] = useState<string | null>(null),
    [expanded, setExpanded] = useState(false),
    [keyboard, setKeyboard] = useState(false);
  const datasetKey = JSON.stringify([
    claims,
    sources.map(({ id, title, url }) => [id, title, url]),
  ]);
  useEffect(() => {
    setActive(null);
    setListSource(null);
  }, [datasetKey]);
  const entries = citationEntries(claims, sources),
    items = uniqueSources(sources);
  const entry = active ? entries[active.index] : undefined;
  const retained = useRef<{ entry: typeof entry; index: number }>({
    entry: undefined,
    index: 0,
  });
  if (entry && active) retained.current = { entry, index: active.index };
  const preview = entry ?? retained.current.entry;
  useEffect(() => {
    if (sourceState !== "ready" || disabled) {
      setActive(null);
      setListSource(null);
    }
  }, [sourceState, disabled]);
  const inspecting = sourceState === "ready" && !disabled && entry;
  const highlightedSource =
    sourceState === "ready" && !disabled ? listSource : null;
  const focusedClaim = inspecting ? entry.claim.id : null;
  const selectable = sourceState === "ready" && !disabled;
  function close() {
    setActive(null);
  }
  return (
    <section
      ref={setHost}
      className="cr-answer oreo-squircle"
      aria-label={title}
      data-keyboard={keyboard || undefined}
      onKeyDownCapture={() => setKeyboard(true)}
      onPointerDownCapture={() => setKeyboard(false)}
    >
      <div
        className="cr-prose oreo-squircle"
        data-inspecting={Boolean(inspecting || highlightedSource)}
      >
        {claims.length ? (
          claims.map((claim, ci) => {
            const linked = entries
              .map((e, i) => ({ e, i }))
              .filter(({ e }) => e.claim === claim);
            const isActive =
              focusedClaim === claim.id ||
              Boolean(
                highlightedSource &&
                  linked.some(({ e }) => e.source.id === highlightedSource),
              );
            const matched = matchedText(
              claim.text,
              focusedClaim === claim.id ? entry?.evidence.match : undefined,
            );
            const anchor = `${id}-${ci}`;
            const first = linked[0];
            const open = Boolean(inspecting && active?.anchor === anchor);
            return (
              <span
                key={claim.id}
                className="cr-claim"
                data-dim={
                  ((inspecting || highlightedSource) && !isActive) || undefined
                }
              >
                <span className="cr-sentence">
                  {matched.before}
                  {matched.match && <mark>{matched.match}</mark>}
                  {matched.after}
                </span>{" "}
                {first && (
                  <Popover.Root
                    open={open}
                    onOpenChange={(next, details) => {
                      if (next && selectable) {
                        setListSource(null);
                        if (details.reason === "trigger-hover")
                          setKeyboard(false);
                        setActive({ anchor, index: first.i });
                      } else if (!next)
                        setActive((old) =>
                          old?.anchor === anchor ? null : old,
                        );
                    }}
                  >
                    <Popover.Trigger
                      id={anchor}
                      disabled={!selectable}
                      openOnHover
                      delay={125}
                      closeDelay={150}
                      className={`cr-citation oreo-state-layer oreo-focus${claim.linkLabel ? " cr-article-link" : ""}`}
                      aria-label={`Inspect source for sentence ${ci + 1}: ${first.e.source.title}`}
                    >
                      {claim.linkLabel ? (
                        <Icon name="file" size="sm" />
                      ) : (
                        <WebSearchFavicon source={first.e.source} small />
                      )}
                      <span>
                        {claim.linkLabel ??
                          first.e.source.name ??
                          sourceHost(first.e.source.url)}
                      </span>
                      {linked.length > 1 && <span>+{linked.length - 1}</span>}
                    </Popover.Trigger>
                    <Popover.Portal container={host}>
                      <ThemePortalTypography>
                        <Popover.Positioner
                          side="bottom"
                          align="start"
                          sideOffset={8}
                          positionMethod="fixed"
                          collisionPadding={12}
                          className="cr-positioner"
                        >
                          <Popover.Popup
                            aria-label="Citation source"
                            className="cr-popup oreo-focus"
                            initialFocus={false}
                          >
                            {preview && (
                              <CitationSourcePreview
                                source={preview.source}
                                evidence={preview.evidence}
                                index={active?.index ?? retained.current.index}
                                count={entries.length}
                                onPrevious={() =>
                                  setActive((old) =>
                                    old
                                      ? {
                                          ...old,
                                          index: Math.max(0, old.index - 1),
                                        }
                                      : old,
                                  )
                                }
                                onNext={() =>
                                  setActive((old) =>
                                    old
                                      ? {
                                          ...old,
                                          index: Math.min(
                                            entries.length - 1,
                                            old.index + 1,
                                          ),
                                        }
                                      : old,
                                  )
                                }
                                onClose={() => {
                                  close();
                                  document.getElementById(anchor)?.focus();
                                }}
                              />
                            )}
                          </Popover.Popup>
                        </Popover.Positioner>
                      </ThemePortalTypography>
                    </Popover.Portal>
                  </Popover.Root>
                )}{" "}
              </span>
            );
          })
        ) : (
          <div className="cr-empty">
            <StatusView
              title="No answer yet"
              description="Your answer will appear here."
            />
          </div>
        )}
      </div>
      <div className="cr-answer-footer">
        <button
          type="button"
          className="cr-source-toggle oreo-state-layer oreo-focus"
          aria-expanded={expanded}
          aria-controls={`${id}-sources`}
          onClick={() => {
            setExpanded(!expanded);
            close();
            setListSource(null);
          }}
        >
          <span className="cr-stack" aria-hidden>
            {items.slice(0, 3).map((s) => (
              <WebSearchFavicon key={s.id} source={s} small />
            ))}
          </span>
          {sourceState === "loading"
            ? "Finding sources"
            : sourceState === "error"
              ? "Sources unavailable"
              : `${items.length} ${items.length === 1 ? "source" : "sources"}`}
          <Icon name={expanded ? "chevron-up" : "chevron-down"} size="sm" />
        </button>
        <span className="cr-answer-note">
          {sourceState === "ready"
            ? "Source-linked answer"
            : "Answer remains available"}
        </span>
      </div>
      {expanded && (
        <div
          id={`${id}-sources`}
          className="cr-source-region"
          aria-label="Source details"
          role="region"
        >
          <SkeletonReveal
            loading={sourceState === "loading"}
            animate={false}
            label="Finding sources"
            skeleton={
              <div className="cr-skeleton" aria-hidden>
                <span />
                <span />
                <span />
              </div>
            }
          >
            {sourceState === "error" ? (
              <div className="cr-empty">
                <StatusView
                  title="Sources unavailable"
                  description="Try loading the sources again."
                  error
                  actionLabel={onRetry ? "Retry" : undefined}
                  onAction={onRetry}
                />
              </div>
            ) : (
              <CitationSourceList
                sources={items}
                activeId={highlightedSource}
                onActiveChange={setListSource}
                disabled={disabled}
              />
            )}
          </SkeletonReveal>
        </div>
      )}
    </section>
  );
}

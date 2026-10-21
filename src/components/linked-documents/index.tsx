import { useRef, useState, type ReactNode } from "react";
import { Popover } from "@base-ui-components/react/popover";
import { Tooltip } from "@base-ui-components/react/tooltip";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useIsPresent,
} from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { DocumentEmpty } from "@/components/document-activity";
import type { LinkedDocument } from "./model";
import "./linked-documents.css";
export type { LinkedDocument } from "./model";

export function LinkedDocumentRow({
  document,
  index,
  selected = false,
  onSelect,
  onUnlink,
  onInfo,
}: {
  document: LinkedDocument;
  index: number;
  selected?: boolean;
  onSelect: (id: string) => void;
  onUnlink: (id: string) => void;
  onInfo?: (id: string) => void;
}) {
  return (
    <div className="ldoc-row" data-selected={selected || undefined}>
      <span className="ldoc-number" aria-hidden>
        {index + 1}
      </span>
      <button
        className="ldoc-name"
        aria-pressed={selected}
        title={document.name}
        onClick={() => onSelect(document.id)}
      >
        {document.name}
      </button>
      <Tooltip.Provider delay={350}>
        <Tooltip.Root>
          <Tooltip.Trigger
            render={
              <IconButton
                type="tertiary"
                size="sm"
                tapScale={1}
                aria-label={`Unlink ${document.name}`}
                data-unlink={document.id}
                icon={<Icon name="unlink" />}
                onClick={() => onUnlink(document.id)}
              />
            }
          />
          <Tooltip.Portal>
            <Tooltip.Positioner side="top" sideOffset={6}>
              <Tooltip.Popup className="ldoc-tooltip">Unlink</Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
      {onInfo && (
        <IconButton
          type="tertiary"
          size="sm"
          tapScale={1}
          aria-label={`Details for ${document.name}`}
          title="Document details"
          icon={<Icon name="info" size="sm" />}
          onClick={() => onInfo(document.id)}
        />
      )}
    </div>
  );
}
function AnimatedDocumentRow({ children }: { children: ReactNode }) {
  const present = useIsPresent(),
    reduce = useReducedMotion();
  return (
    <motion.li
      inert={!present}
      aria-hidden={!present || undefined}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.li>
  );
}
export function LinkedDocumentsList({
  documents,
  selectedId,
  onSelect,
  onUnlink,
  onInfo,
  loading = false,
  error,
  onRetry,
  footer,
}: {
  documents: readonly LinkedDocument[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onUnlink: (id: string) => void;
  onInfo?: (id: string) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  footer?: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  function unlink(id: string) {
    const buttons = Array.from(
        root.current?.querySelectorAll<HTMLButtonElement>("[data-unlink]") ??
          [],
      ).filter((button) =>
        documents.some((document) => document.id === button.dataset.unlink),
      ),
      index = buttons.findIndex((b) => b.dataset.unlink === id),
      hadFocus = buttons[index] === window.document.activeElement;
    if (hadFocus)
      (buttons[index + 1] ?? buttons[index - 1] ?? root.current)?.focus();
    onUnlink(id);
  }
  return (
    <div
      className="ldoc-list"
      ref={root}
      tabIndex={-1}
      aria-label="Linked documents"
      aria-busy={loading}
    >
      {loading ? (
        <div role="status" className="ldoc-loading">
          <span>Loading linked documents…</span>
          {[1, 2, 3].map((n) => (
            <div key={n} className="ldoc-skeleton" />
          ))}
        </div>
      ) : error ? (
        <DocumentEmpty
          title="Documents unavailable"
          description={error}
          onReset={onRetry}
          actionLabel="Try again"
        />
      ) : !documents.length ? (
        <DocumentEmpty
          title="No linked documents"
          description="Unlinked files remain in your library."
        />
      ) : (
        <ol className="ldoc-rows">
          <AnimatePresence initial={false}>
            {documents.map((document, index) => (
              <AnimatedDocumentRow key={document.id}>
                <LinkedDocumentRow
                  document={document}
                  index={index}
                  selected={selectedId === document.id}
                  onSelect={onSelect}
                  onUnlink={unlink}
                  onInfo={onInfo}
                />
              </AnimatedDocumentRow>
            ))}
          </AnimatePresence>
        </ol>
      )}
      {footer && <div className="ldoc-list-footer">{footer}</div>}
    </div>
  );
}
export function LinkedDocumentsSelector(
  props: Parameters<typeof LinkedDocumentsList>[0],
) {
  const infoClose = useRef(false);
  const [open, setOpen] = useState(false),
    host = useRef<HTMLDivElement>(null),
    selected = props.documents.find((d) => d.id === props.selectedId),
    index = props.documents.findIndex((d) => d.id === props.selectedId);
  return (
    <div ref={host} className="ldoc-selector">
      <Popover.Root
        open={open}
        onOpenChange={(next) => {
          if (next) infoClose.current = false;
          setOpen(next);
        }}
      >
        <Popover.Trigger
          aria-label="Choose linked document"
          render={
            <Button type="secondary" tapScale={1} className="ldoc-trigger" />
          }
        >
          <Icon name="scan-text" size="sm" />
          <span className="ldoc-trigger-name">
            {selected?.name ?? "Linked documents"}
          </span>
          <span className="ldoc-count">
            {index < 0 ? 0 : index + 1} / {props.documents.length}
          </span>
          <Icon name={open ? "chevron-up" : "chevron-down"} size="sm" />
        </Popover.Trigger>
        <Popover.Portal container={host}>
          <Popover.Positioner
            side="bottom"
            align="end"
            sideOffset={8}
            collisionPadding={12}
            positionMethod="fixed"
            className="ldoc-positioner"
          >
            <Popover.Popup
              className="ldoc-popup"
              finalFocus={() => !infoClose.current}
            >
              <header>
                <Popover.Title>Linked documents</Popover.Title>
                <Popover.Close
                  render={
                    <IconButton
                      type="tertiary"
                      size="sm"
                      aria-label="Close linked documents"
                      icon={<Icon name="x" size="sm" />}
                    />
                  }
                />
              </header>
              <Popover.Description className="sr-only">
                Choose a document to preview, or unlink it from this review.
                Original files are kept.
              </Popover.Description>
              <LinkedDocumentsList
                {...props}
                onSelect={(id) => {
                  props.onSelect(id);
                  setOpen(false);
                }}
                onInfo={
                  props.onInfo
                    ? (id) => {
                        infoClose.current = true;
                        props.onInfo?.(id);
                        setOpen(false);
                      }
                    : undefined
                }
              />
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
export function LinkedDocumentDetails({
  document,
}: {
  document: LinkedDocument;
}) {
  return (
    <section className="ldoc-details" aria-label="Document details">
      <Icon name="scan-text" />
      <h3>{document.name}</h3>
      <dl>
        {[
          ["Type", document.kind],
          ["Size", document.size],
          ["Added", document.added],
          ["Uploaded by", document.owner],
        ].map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

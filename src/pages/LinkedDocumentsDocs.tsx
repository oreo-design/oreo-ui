import { useReducer, useState, useEffect } from "react";
import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PreviewTabs, PropsTable, CodeBlock } from "@/docs/primitives";
import { PAGE_META } from "@/lib/site";
import { Button } from "@/components/button";
import {
  LinkedDocumentsList,
  LinkedDocumentsSelector,
  LinkedDocumentRow,
  LinkedDocumentDetails,
} from "@/components/linked-documents";
import { linkReducer } from "@/components/linked-documents/model";
import { SAMPLE_DOCUMENTS } from "@/patterns/unlink-documents/data";
export function LinkedDocumentsExample({
  selector = false,
  scenario = "ready",
}: {
  selector?: boolean;
  scenario?: string;
}) {
  const [state, dispatch] = useReducer(linkReducer, {
      documents: SAMPLE_DOCUMENTS,
      selectedId: SAMPLE_DOCUMENTS[0].id,
      removed: [],
      notice: "",
    }),
    [recovered, setRecovered] = useState(false);
  useEffect(() => setRecovered(false), [scenario]);
  const Component = selector ? LinkedDocumentsSelector : LinkedDocumentsList;
  return (
    <div className="w-full max-w-md p-4">
      <Component
        documents={scenario === "empty" ? [] : state.documents}
        selectedId={state.selectedId}
        onSelect={(id) => dispatch({ type: "select", id })}
        onUnlink={(id) => dispatch({ type: "unlink", id })}
        loading={scenario === "loading"}
        error={
          scenario === "error" && !recovered
            ? "Sample connection interrupted."
            : undefined
        }
        onRetry={() => setRecovered(true)}
        footer={
          <>
            <span>Original files are kept</span>
            <Button
              type="tertiary"
              size="sm"
              onClick={() =>
                dispatch(
                  state.removed.length
                    ? { type: "undo" }
                    : { type: "reset", documents: SAMPLE_DOCUMENTS },
                )
              }
            >
              {state.removed.length ? "Undo unlink" : "Reset"}
            </Button>
          </>
        }
      />
      <p role="status" className="text-xs text-text-secondary mt-4 break-words">
        {state.notice}
      </p>
    </div>
  );
}
export function LinkedDocumentRowExample({
  name = "Bank-Statement_1026.pdf",
  selected = true,
}: {
  name?: string;
  selected?: boolean;
}) {
  const [linked, setLinked] = useState(true),
    [active, setActive] = useState(selected);
  useEffect(() => {
    setLinked(true);
    setActive(selected);
  }, [name, selected]);
  return (
    <div className="w-full max-w-md p-4">
      {linked ? (
        <LinkedDocumentRow
          document={{ ...SAMPLE_DOCUMENTS[0], name }}
          index={0}
          selected={active}
          onSelect={() => setActive(true)}
          onUnlink={() => setLinked(false)}
        />
      ) : (
        <div
          role="status"
          className="flex items-center justify-between gap-3 text-sm"
        >
          <span>Document unlinked.</span>
          <Button size="sm" type="secondary" onClick={() => setLinked(true)}>
            Undo unlink
          </Button>
        </div>
      )}
    </div>
  );
}
export function LinkedDocumentsDocs({ nav }: { nav: DocsNav }) {
  const title =
    PAGE_META[nav.active as keyof typeof PAGE_META]?.title ??
    "Linked Documents";
  const preview =
    nav.active === "linked-document-row" ? (
      <LinkedDocumentRowExample />
    ) : nav.active === "linked-document-details" ? (
      <LinkedDocumentDetails document={SAMPLE_DOCUMENTS[0]} />
    ) : (
      <LinkedDocumentsExample
        selector={nav.active === "linked-documents-selector"}
      />
    );
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "composition", label: "Composition" },
        { id: "api", label: "API" },
        { id: "states", label: "States & copy" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A numbered file list with independent preview, unlink and
              information actions, inspired by{" "}
              <a
                className="underline"
                href="https://x.com/kvnkld/status/2111826634902741219"
              >
                Kevin’s Unlink Documents
              </a>
              . Removing a link keeps the original file.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/unlink-documents-workspace"
            >
              Open the complete Document Review template →
            </a>
          </header>
          <Section id="composition" title="Composition">
            <PreviewTabs
              preview={<div className="w-full max-w-lg p-6">{preview}</div>}
              code={
                "<LinkedDocumentsSelector documents={documents} selectedId={selectedId}\n  onSelect={selectDocument} onUnlink={unlinkDocument} onInfo={showDetails} />"
              }
            />
            <CodeBlock
              lang="text"
              code="Copy src/components/linked-documents/ plus its Oreo imports: Button, IconButton, Icon, DocumentEmpty. Uses existing Base UI Popover/Tooltip and Motion. Copy the optional pure reducer for selection, reversible unlink and LIFO undo. No new packages."
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "LinkedDocumentRow: document / index / selected",
                  type: "LinkedDocument / number / boolean",
                  desc: "Unique stable ID, full filename and metadata. Zero-based index renders a one-based ordinal. Selection defaults false.",
                },
                {
                  prop: "onSelect / onUnlink / onInfo",
                  type: "(id: string) => void",
                  desc: "Independent host-owned actions. onInfo is optional. No file deletion or hidden persistence. List transfers focus to a neighboring unlink control before removal.",
                },
                {
                  prop: "LinkedDocumentsList: documents / selectedId / footer",
                  type: "readonly LinkedDocument[] / string | null / ReactNode",
                  desc: "Bounded scrolling list, animated height collapse and reindex. Footer stays outside row scrolling. Host owns state and undo affordance.",
                },
                {
                  prop: "loading / error / onRetry",
                  type: "boolean / string / callback",
                  desc: "Explicit initial loading, error and empty states. Loading takes precedence. Retry is shown only when supplied.",
                },
                {
                  prop: "LinkedDocumentsSelector",
                  type: "Same props as list",
                  desc: "Anchored Base UI popover, current filename and position/total. Selection and info close it; unlink leaves it open. Escape/outside dismiss; theme-local portal.",
                },
                {
                  prop: "LinkedDocumentDetails: document",
                  type: "LinkedDocument",
                  desc: "Full filename, kind, size, added date and owner. Strings are display-ready and localized by the host.",
                },
              ]}
            />
          </Section>
          <Section id="states" title="States, layout and integration">
            <p className="text-sm leading-7 text-text-secondary">
              The template is a local fixture. All eight documents can be
              unlinked and restored in reverse order. Removing the active
              document chooses the next row, then the previous; removing another
              keeps the active preview. Undo preserves the active document
              unless the list was empty. Repeated stale removals are ignored.
              Long filenames truncate in rows and remain available as full
              accessible names and in Details. Reduced motion removes collapse
              animation. Component labels are English defaults; hosts own
              localization, authorization, asynchronous persistence and rollback
              on network failure. The source demonstrates unlinking; undo,
              loading and error recovery extend the sample for reuse.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

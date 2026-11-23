import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function CitationReaderDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Citation Reader"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "properties", label: "Properties" },
        { id: "behavior", label: "Interaction & states" },
        { id: "composition", label: "Copy & composition" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold">Citation Reader</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Inline evidence that stays connected to the sentence it supports.
              Inspired by{" "}
              <a
                className="underline"
                href="https://x.com/shedsgns/status/2124766146377252944"
              >
                Juliette’s citation interaction
              </a>
              .
            </p>
            <a
              className="inline-block mt-4 underline"
              href="/citation-reader-workspace"
            >
              Open the complete reading workspace →
            </a>
          </header>
          <Section id="properties" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "CitationAnswer",
                  type: "claims, sources, title?, sourceState?, onRetry?, disabled?",
                  desc: "Claim IDs, text and citation evidence are supplied by the host. Source availability and interaction disabled state are independent.",
                },
                {
                  prop: "CitationSourcePreview",
                  type: "source, evidence, index?, count?, onPrevious?, onNext?, onClose?",
                  desc: "Source identity, title and excerpt with optional pagination. No callbacks means disabled navigation. External URLs allow http/https only.",
                },
                {
                  prop: "CitationSourceList",
                  type: "sources, activeId?, onActiveChange?, disabled?",
                  desc: "Source selection highlights host content; a separate external link opens the source. Duplicate IDs use their first occurrence.",
                },
                {
                  prop: "CitationEvidence",
                  type: "sourceId, excerpt, match?, exact?",
                  desc: "Match highlights the first exact substring in the claim. Missing matches retain readable text. Exact quote is explicit host metadata, not an automatic verification claim.",
                },
              ]}
            />
            <CodeBlock
              code={`<CitationAnswer
  claims={[{id:"a",text:"A supported statement.",citations:[{sourceId:"doc",excerpt:"A short supporting note.",match:"supported statement"}]}]}
  sources={[{id:"doc",title:"Documentation",url:"https://developer.mozilla.org/"}]}
/>`}
            />
          </Section>
          <Section id="behavior" title="Interaction and states">
            <div className="space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Hover a citation to preview its source and highlight the
                supported phrase. Click/tap or Enter/Space opens the same
                interactive popover. Move into it without losing the preview;
                use arrows to browse all citation occurrences, Escape/outside
                click or Close to dismiss. Expand the source list to emphasize
                all sentences linked to that source. Source links are separate
                from selection.
              </p>
              <p>
                Loading preserves the answer and source toggle while the
                expanded list shows a content-shaped SkeletonReveal. Error uses
                StatusView and an optional host retry. Empty, disabled and
                unavailable links stay explicit. Unknown source IDs do not
                produce broken citation controls. Data is host-owned: loading
                completion, retry requests, stream assembly and persistence are
                outside this component.
              </p>
              <p>
                Only a fine-pointer popup uses a 125ms transform/opacity
                transition with shared ease-out and trigger origin. Keyboard,
                touch and reduced motion skip movement. Sentence highlighting,
                source paging and disclosure geometry update immediately for
                reading.
              </p>
            </div>
          </Section>
          <Section id="composition" title="Copy and layout">
            <div className="space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Use concise source titles and short excerpts. Do not mark a
                paraphrase as an exact quote. Passage links use a text fragment
                only for an explicitly exact excerpt; browser/site support
                varies. Preserve source attribution and full readable text. The
                fixture uses MDN and WAI excerpts/notes, with no live AI
                generation.
              </p>
              <p>
                Answer, inline domain chip, article-link label, preview and
                numbered source list form one reading composition. Foundation
                values use Oreo tokens; existing WebSearch source identity and
                URL validation are reused. Base UI owns collision, pointer
                travel and dismissal. The list scrolls within a bounded region
                below its toggle; narrow previews wrap within the viewport.
                Source comparisons and actual baseline/after media live in the
                task review index.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

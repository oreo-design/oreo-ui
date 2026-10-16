import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const DOCS = {
  "escalation-card": {
    title: "Escalation Card",
    description:
      "A client question, evidence and the reason a human decision is needed. Expansion is controlled; review actions belong to the host.",
    code: "<EscalationCard item={caseRecord} open={open} onOpenChange={setOpen}\n  onReview={openReview} onApprove={reviewDraft} onReopen={reopenCase} />",
    rows: [
      {
        prop: "item",
        type: "Escalation",
        desc: "Client identity, question, advisor, impact, confidence, facts, draft and status.",
      },
      {
        prop: "open / onOpenChange",
        type: "boolean / callback",
        desc: "Controlled disclosure. Native button supports keyboard activation; actions are siblings, never nested.",
      },
      {
        prop: "onReview / onApprove / onReopen",
        type: "callback?",
        desc: "Optional host actions. Review advisor draft opens the review flow; it never silently approves or sends a response.",
      },
    ],
  },
  "source-conflict-card": {
    title: "Source Conflict Card",
    description:
      "Compare source claims side by side and record an explicit choice. Keep the decision with a human when either source could be appropriate.",
    code: "<SourceConflictCard conflict={conflict}\n  onResolve={choice => resolve(conflict.id, choice)} disabled={saving} />",
    rows: [
      {
        prop: "conflict",
        type: "SourceConflict",
        desc: "Unique source IDs, source titles and quoted sample claims. Optional resolution is a source ID or ask.",
      },
      {
        prop: "onResolve / disabled",
        type: "callback? / boolean",
        desc: "Receives a source ID or ask. Host owns persistence and source status changes.",
      },
    ],
  },
  "knowledge-source-table": {
    title: "Knowledge Source Table",
    description:
      "Document metadata, intended use, illustrative extraction counts and explicit review states. Conflict detection takes precedence over the source status.",
    code: "<KnowledgeSourceTable sources={filteredSources} conflicts={conflicts}\n  onReview={openSource} onRemove={archiveSource} onClear={clearFilters}\n  error={error} onRetry={retry} loading={loading} />",
    rows: [
      {
        prop: "sources / conflicts",
        type: "KnowledgeSource[] / SourceConflict[]",
        desc: "Unique record IDs and optional conflict references. The host filters and sorts records.",
      },
      {
        prop: "onReview / onRemove",
        type: "callback?",
        desc: "Optional review and archive actions. Unresolved conflicting sources cannot be archived.",
      },
      {
        prop: "loading / error / onRetry / onClear",
        type: "state and callbacks",
        desc: "Content-shaped initial skeleton; refresh retains content. Error and empty use AgentWorkspaceState with optional recovery.",
      },
    ],
  },
  "conversation-activity": {
    title: "Conversation Activity",
    description:
      "Two distinct daily counts show work answered by an advisor and work escalated to a person, with keyboard-accessible day selection.",
    code: '<ConversationActivity days={days} label="This week" />',
    rows: [
      {
        prop: "days",
        type: "ConversationDay[]",
        desc: "Unique IDs, readable labels and non-negative safe integer answered/escalated counts. Invalid or empty data has an explicit state.",
      },
      {
        prop: "label",
        type: "string",
        desc: "Accessible chart title. Defaults to This week. Each day exposes exact values independently of the visual bars.",
      },
    ],
  },
};
export function ConsultingDocs({ nav }: { nav: DocsNav }) {
  const doc = DOCS[nav.active as keyof typeof DOCS] ?? DOCS["escalation-card"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", doc.title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {doc.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {doc.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/consulting-workspace"
            >
              Open Consulting Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                "import { " +
                doc.title.replaceAll(" ", "") +
                ' } from "@/components/consulting";\n\n' +
                doc.code
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={doc.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template combines these components with shared Button,
              IconButton, Avatar, Tag, WorkspaceMetric, StepProgress and
              AgentWorkspaceState. Base UI Dialog owns focus and dismissal.
              Dashboard queues, local response review, archive recovery, source
              conflicts and advisor settings all use session-only sample data.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              resolveConflict marks the selected source approved and other
              versions duplicate, or records an ask-on-use policy while
              retaining both. sourceSummary counts only approved sources toward
              extracted knowledge, excluding unresolved conflicts and
              duplicates. Upload controls validate file names, non-empty size
              and a 50 MB limit; they store metadata without reading, uploading
              or analyzing contents. Imported records start unreviewed with zero
              findings. All advisor profiles share the clearly labeled practice
              library.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Semantic Oreo palette tokens replace the reference's raw brand
              colors. Orange marks escalation and conflict rather than restyling
              every primary action. The 880px source-table minimum width
              preserves dense columns; narrow screens scroll the table only. New
              disclosures and dialogs are immediate; this static reference adds
              no custom timed motion. The 128px chart track and 20px bars are
              deliberate chart geometry, and all exact values remain available
              as text.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/nizamdesign/status/2110792824627360225"
              target="_blank"
              rel="noreferrer"
            >
              Consulting workspace reference by Nizam ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PropsTable, CodeBlock } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "issue-row": {
    name: "IssueRow",
    description:
      "A compact selectable issue row with a readable title, status, labels and discussion count.",
    code: "<IssueRow issue={issue} selected={selected === issue.id}\n onSelect={setSelected} />",
    rows: [
      {
        prop: "issue",
        type: "Issue",
        desc: "Unique numeric id, title, author, open/closed state, labels, age, updated timestamp, description and comments.",
      },
      {
        prop: "selected / onSelect",
        type: "boolean / (id: number) => void",
        desc: "Controlled selection on a native button. Uses aria-pressed; no nested actions. Host owns navigation.",
      },
    ],
  },
  "issue-queue": {
    name: "IssueQueue",
    description:
      "A scrollable issue queue with content-shaped loading and recoverable empty/error states.",
    code: "<IssueQueue issues={visibleIssues} selectedId={selected}\n onSelect={setSelected} filtered={hasFilters} onClear={clearFilters}\n loading={loading} error={error} onRetry={reload} />",
    rows: [
      {
        prop: "issues / selectedId / onSelect",
        type: "Issue[] / number | null / callback",
        desc: "Pass the filtered and sorted list. Host controls selection, keyboard shortcuts and focus return.",
      },
      {
        prop: "loading / error / onRetry",
        type: "boolean / string / callback",
        desc: "Loading with no rows shows a shared skeleton; refresh preserves populated rows. Error takes precedence and offers retry.",
      },
      {
        prop: "filtered / onClear / footer",
        type: "boolean / callback / ReactNode",
        desc: "No matches offers Clear filters. Empty data has a distinct message. Footer sits outside scrolling rows.",
      },
    ],
  },
  "issue-reader": {
    name: "IssueReader",
    description:
      "A nonmodal issue inspector with markdown, metadata, comments and a pinned local reply composer.",
    code: '<IssueReader issue={issue} draft={drafts[issue.id] ?? ""}\n onDraftChange={saveDraft} onComment={addLocalComment}\n onClose={closeAndRestoreFocus} actions={actions} />',
    rows: [
      {
        prop: "issue / repository",
        type: "Issue / optional string",
        desc: "Read-only metadata and markdown. Markdown does not render raw HTML; external links use normal browser navigation.",
      },
      {
        prop: "draft / onDraftChange / onComment",
        type: "string / callback / callback",
        desc: "Host owns per-issue draft retention and persistence. Blank comments are disabled. Composer is outside the scrolling reader.",
      },
      {
        prop: "onClose / actions",
        type: "callback / ReactNode",
        desc: "Close button or unhandled Escape. Host restores focus. Heading receives focus on narrow layouts; desktop keeps the list available.",
      },
    ],
  },
};
export function IssueBrowserDocs({ nav }: { nav: DocsNav }) {
  const spec = specs[nav.active] ?? specs["issue-row"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", spec.name]}
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
              {spec.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {spec.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/issue-browser"
            >
              Open Issue Browser ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${spec.name} } from "@/components/issue-browser";\n\n${spec.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={spec.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template combines the shared navigation, searchable filters,
              buttons, avatars, skeleton and empty states. Search matches title,
              number, author and labels. Open/closed and label filters combine
              with updated/newest/comment-count sorting. Arrow keys or J/K
              browse the current queue without wrapping; / focuses search.
              Shortcuts do not intercept text fields. On narrow screens, details
              replace the list and Escape or Close returns focus. Comments and
              new issues are local fixtures, with drafts retained per issue and
              reset on reload. No GitHub API, notifications or real
              collaboration is connected.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/kapish_dima/status/2110801612520255802"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Kapish Dima ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

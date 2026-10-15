import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function AskAnalyticsDocs({ nav }: { nav: DocsNav }) {
  const sources = nav.active === "insight-sources";
  const title = sources ? "Insight Sources" : "Ask Analytics";
  const rows = sources
    ? [
        {
          prop: "sources",
          type: "InsightSource[]",
          desc: "Stable id, label and semantic Oreo icon. Empty arrays show an explicit empty state.",
        },
        {
          prop: "onSelect",
          type: "(id: string) => void",
          desc: "Host opens source details. Each source is a keyboard-accessible button; the host owns dialog focus restoration.",
        },
      ]
    : [
        {
          prop: "value / onValueChange",
          type: "string / (value: string) => void",
          desc: "Controlled question. Blank and whitespace-only submissions are disabled. Input is limited to 240 characters.",
        },
        {
          prop: "suggestions",
          type: "AnalyticsSuggestion[]",
          desc: "id, question and icon. Buttons submit their question immediately; an empty array displays a helpful empty message.",
        },
        {
          prop: "request",
          type: "AnalyticsRequest",
          desc: "Discriminated union: idle, loading, error, empty or success. Non-idle states include question; error adds message; success adds answer (title, body, sources).",
        },
        {
          prop: "onAsk / onReset",
          type: "callbacks",
          desc: "Host owns async work and cancellation. onAsk receives a trimmed question. onReset must cancel pending requests so stale results cannot return.",
        },
        {
          prop: "onSourceSelect",
          type: "(id: string) => void",
          desc: "Open a source in the host. Source labels never pretend to be external links.",
        },
        {
          prop: "defaultExpanded",
          type: "boolean",
          desc: "Initially show suggestions. Defaults to false; focus or Try asking expands the inline disclosure.",
        },
        {
          prop: "onSave / saved",
          type: "(() => void) / boolean",
          desc: "Optional controlled save action. Omit onSave to hide it.",
        },
      ];
  const code = sources
    ? "<InsightSources sources={answer.sources} onSelect={openSource} />"
    : "<AskAnalytics value={question} onValueChange={setQuestion}\n  suggestions={suggestions} request={request}\n  onAsk={ask} onReset={cancelAndReset}\n  onSourceSelect={openSource} defaultExpanded />";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", title]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {sources
                ? "Compact, actionable citations for dashboard answers. Labels wrap naturally and inherit the current theme."
                : "An inline question card with suggested prompts, cancellable loading, grounded answers and recovery states. Inspired by Anant’s analytics Ask AI interaction."}
            </p>
            <a
              href="/analytics-assistant"
              className="mt-4 inline-block text-sm underline"
            >
              Open Analytics Assistant ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${sources ? "InsightSources" : "AskAnalytics"} } from "@/components/ask-analytics";\n\n${code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={rows} />
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              The template uses deterministic, prewritten answers over a local
              sample dataset. It includes source dialogs, saved insights,
              unsupported questions and a recoverable connection-error
              simulation. Nothing persists and no AI service is called. A
              production host must supply authorization, data access and a real
              request lifecycle.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Input, keyboard and chart updates are immediate. Content enters
              with a 180 ms fade and 4 px translation; reduced motion removes
              translation. Source details use Base UI Dialog for focus trapping,
              Escape and return focus.
            </p>
            <a
              href="https://x.com/HeyAnantJ/status/2110408357488333059"
              className="mt-4 inline-block text-sm underline"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Anant ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

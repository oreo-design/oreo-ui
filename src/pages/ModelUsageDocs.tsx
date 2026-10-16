import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const docs = {
  "model-trend-chart": {
    title: "Model Trend Chart",
    description:
      "Aligned daily cost, token or request series with model highlighting and keyboard day inspection.",
    code: '<ModelTrendChart days={days} models={models} metric="costCents"\n  highlighted={modelId} onHighlight={setModelId} />',
    rows: [
      {
        prop: "days / models",
        type: "UsageDay[] / UsageModel[]",
        desc: "Unique IDs; every day supplies each model with integer nonnegative counts. Latencies are explicit sampled milliseconds.",
      },
      {
        prop: "metric / highlighted / onHighlight",
        type: "UsageMetric / string? / callback?",
        desc: "Cost cents, tokens or requests. Controlled highlighting leaves totals unchanged.",
      },
      {
        prop: "loading / error / onRetry",
        type: "state and callback",
        desc: "Chart-shaped loading, preserved data on refresh, explicit empty/error recovery. The data table exposes unrounded counts.",
      },
    ],
  },
  "model-usage-ring": {
    title: "Model Usage Ring",
    description:
      "Request shares and token totals with a selectable legend. Text exposes exact counts independently of ring geometry.",
    code: "<ModelUsageRing days={days} models={models}\n  value={modelId} onValueChange={setModelId} />",
    rows: [
      {
        prop: "days / models",
        type: "UsageDay[] / UsageModel[]",
        desc: "Shares derive from the same dataset as the trend. Empty or invalid datasets have explicit states.",
      },
      {
        prop: "value / onValueChange",
        type: "string? / callback?",
        desc: "Selected model ID. Choosing it again clears highlighting. Omit callback for a read-only legend.",
      },
    ],
  },
  "agent-usage-row": {
    title: "Agent Usage Row",
    description:
      "A compact agent or activity record with status, model, tokens, cost and optional inspect/run actions.",
    code: '<AgentUsageRow title="Support triage" description="Drafts replies."\n  model="GPT-4o" tokens={1842} costCents={5} time="09:42"\n  status="active" onOpen={inspect} onRun={runSample} />',
    rows: [
      {
        prop: "title / description / model / time",
        type: "string",
        desc: "Readable identity, purpose, model and display timestamp.",
      },
      {
        prop: "tokens / costCents / status",
        type: "number / number / active | paused | complete",
        desc: "Nonnegative host-owned counts. Paused status disables a supplied run action.",
      },
      {
        prop: "onOpen / onRun",
        type: "callbacks?",
        desc: "Optional independent actions. The component does not call an AI provider.",
      },
    ],
  },
};
export function ModelUsageDocs({ nav }: { nav: DocsNav }) {
  const doc =
    docs[nav.active as keyof typeof docs] ?? docs["model-trend-chart"];
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
              href="/model-costs"
            >
              Open Model Costs ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock code={doc.code} />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={doc.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Import from @/components/model-usage. The complete template reuses
              WorkspaceMetric, BudgetMeter, Button, IconButton, Avatar, Tag,
              AgentWorkspaceState and Base UI Dialog. Highlighting changes
              emphasis only; environment and date controls change all
              aggregates. Search filters agent and activity lists only.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Amounts are recorded integer cents. Sample p95 uses nearest-rank
              selection over explicit latency samples, not averages of daily
              percentiles. The model names and recorded spend are historical
              fixture labels, not pricing estimates. Run sample updates the
              selected environment's Sep 30 bucket and creates a local activity
              record; no network request is sent. CSV exports the selected
              environment and date range.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              The source is a static image. Trend inspection, pause/resume and
              local sample runs are implemented behaviors rather than claims
              about the source. Native slider, table and legend buttons expose
              the chart to keyboard and screen-reader users; no custom timed
              animation is added.
            </p>
            <a
              href="https://x.com/imimran04/status/2110703416976748572"
              className="mt-4 inline-block text-sm underline"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Imran ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

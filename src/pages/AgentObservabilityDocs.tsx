import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const SPECS: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "pixel-meter": {
    name: "Pixel Meter",
    description:
      "A 160-dot meter for compact success rates and budgets. The visual fill clamps at the limit while exact accessible values retain overflow.",
    code: 'import { PixelMeter } from "@/components/agent-observability";\n\n<PixelMeter value={92.6} max={100} label="Successful requests" />',
    rows: [
      {
        prop: "value / max",
        type: "number",
        desc: "Finite non-negative value and positive maximum (default 100). Invalid inputs show Unknown. Fill is rounded to the nearest dot; accessible text retains the exact ratio.",
      },
      {
        prop: "tone / label / showValue",
        type: "success | warning | neutral / string / boolean",
        desc: "Semantic color, accessible measurement label, and optional visible percentage (default true).",
      },
    ],
  },
  "inference-chart": {
    name: "Inference Chart",
    description:
      "A single-series zero-baseline count chart with deterministic dither, pointer inspection, a keyboard-accessible bucket selector and an exact values table.",
    code: 'import { InferenceChart } from "@/components/agent-observability";\n\n<InferenceChart points={[{label: "Oct 15", value: 320}, {label: "Oct 16", value: 480}]} />',
    rows: [
      {
        prop: "points / label",
        type: "InferencePoint[] / string",
        desc: "Ordered bucket labels and non-negative safe integer counts. Values are evenly spaced; supply pre-bucketed data, not irregular timestamp samples. One point and all-zero data are supported.",
      },
      {
        prop: "loading / error / onRetry",
        type: "boolean / string / callback",
        desc: "Loading without data shows a static skeleton. Explicit errors and invalid counts use the shared error state; an empty collection offers period reset. With existing data, loading preserves content and sets aria-busy.",
      },
    ],
  },
  "regional-traffic": {
    name: "Regional Traffic",
    description:
      "A schematic dotted world with region controls, exact call counts and explicitly labelled mean agent p95 latency. Geography is decorative.",
    code: 'import { RegionalTraffic } from "@/components/agent-observability";\n\n<RegionalTraffic regions={regions} value={region} onValueChange={setRegion} />',
    rows: [
      {
        prop: "regions",
        type: "TrafficRegion[]",
        desc: "Unique id, label, non-negative requests and latency (mean agent p95 in ms), x/y percentages from 0 to 100. Regions remain visible while one is selected.",
      },
      {
        prop: "value / onValueChange",
        type: "string / (id: string) => void",
        desc: 'Controlled selection. Clicking the selected marker or row emits "all". Omit the callback for a read-only display; exact labels remain accessible.',
      },
    ],
  },
  "agent-health-table": {
    name: "Agent Health Table",
    description:
      "Agent identity, role, region, status, success, cost and latency with bounded scrolling and opaque sticky headings. Optional host-owned details and status actions.",
    code: 'import { AgentHealthTable, healthRows } from "@/components/agent-observability";\n\n<AgentHealthTable agents={healthRows(agents, query, status, region, sort)}\n  sort={sort} onSort={setSort} onOpen={openDetails} onToggle={toggleStatus} />',
    rows: [
      {
        prop: "agents",
        type: "AgentTelemetry[]",
        desc: "Unique IDs, name, role, region, model, version, status, requests, successes, USD costPer1k and p95ms. Invalid counts render an error. Zero traffic shows an unknown success meter.",
      },
      {
        prop: "sort / onSort",
        type: "HealthSort / callback",
        desc: "Controlled name, status, success, costPer1k or p95ms sorting. The host applies healthRows; the table does not mutate input order.",
      },
      {
        prop: "onOpen / onToggle",
        type: "(agent: AgentTelemetry) => void",
        desc: "Optional detail and pause/resume requests. Host owns mutation and recovery. Without callbacks no action column is rendered.",
      },
      {
        prop: "loading / error / filtered / onReset",
        type: "state props / callback",
        desc: "Static skeleton, retry, first-use empty and filtered-empty states. Existing rows remain visible during refresh.",
      },
    ],
  },
};
export function AgentObservabilityDocs({ nav }: { nav: DocsNav }) {
  const spec = SPECS[nav.active] ?? SPECS["pixel-meter"];
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
              href="/agent-observatory"
            >
              Open Agent Observatory ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock code={spec.code} />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={spec.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The complete template shares region and period across metrics,
              inference buckets and agent telemetry. Search and status only
              filter the table; CSV exports those visible rows in current sort
              order. Request success is traffic-weighted. Median agent p95 and
              mean agent p95 are summaries of agent percentiles, never a fleet
              percentile. Counts are synthetic samples ending October 16, 2026
              (UTC); chart labels identify bucket starts. Pause/resume and
              one-step undo change local status, leaving historical traffic
              intact. Reload resets the demo.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/adeebrq/status/2110891362103267793"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Adeeb ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

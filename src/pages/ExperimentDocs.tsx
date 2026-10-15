import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "experiment-chart": {
    name: "Experiment Chart",
    description:
      "Two variants on one shared scale. Compare cumulative conversion rates or daily gaps with pointer inspection, a keyboard range control and a complete data table.",
    code: '<ExperimentChart days={observations} mode="cumulative" selectedIndex={day} onSelectedIndexChange={setDay} />',
    rows: [
      {
        prop: "days",
        type: "ExperimentDay[]",
        desc: "Ordered daily counts: date, a and b, each with visitors/conversions. Counts must be nonnegative safe integers with conversions ≤ visitors. Invalid rows are omitted. Zero-visitor rates are unavailable, not zero.",
      },
      {
        prop: "mode",
        type: '"cumulative" | "daily"',
        desc: "Default cumulative. Cumulative sums counts before dividing; daily displays independent paired rates. Both use one zero-based percentage scale.",
      },
      {
        prop: "label",
        type: "string",
        desc: "Accessible figure, SVG and table name.",
      },
      {
        prop: "selectedIndex / onSelectedIndexChange",
        type: "number / (index: number) => void",
        desc: "Optional host-controlled date. Otherwise internally selected. Pointer inspection and the native range share the same index. No interpolation or animation of observations.",
      },
    ],
  },
  "variant-results": {
    name: "Variant Results",
    description:
      "Readable A/B identities, conversion counts and observed conversion rates.",
    code: '<VariantResults a={{visitors:6120, conversions:251}} b={{visitors:6080, conversions:289}} labels={["Design that ships.", "Interfaces people get at a glance."]} />',
    rows: [
      {
        prop: "a / b",
        type: "ExperimentCount",
        desc: "Validated nonnegative visitors and conversions. Host owns count validation; the chart filters invalid rows. Rate is conversions / visitors × 100; no visitors displays an em dash.",
      },
      {
        prop: "labels",
        type: "[string, string]",
        desc: "Copy or description for A and B. Text wraps; identification is conveyed by letters as well as tone.",
      },
    ],
  },
  "experiment-decision": {
    name: "Experiment Decision",
    description:
      "An explicit experiment readiness or recorded-choice footer, with host-owned decision and undo actions.",
    code: '<ExperimentDecision state="ready" confidence={96} threshold={95} onDecide={openReview} />',
    rows: [
      {
        prop: "state",
        type: '"ready" | "collecting" | "decided"',
        desc: "Host-owned readiness. Only ready exposes the decision callback; decided exposes undo when supplied. This component does not estimate statistical confidence.",
      },
      {
        prop: "confidence / threshold",
        type: "number | null / number",
        desc: "Host-supplied percentage and gate. Missing estimate is explicit. Threshold defaults to 95.",
      },
      {
        prop: "onDecide / onUndo",
        type: "() => void",
        desc: "Optional actions. Omitted callbacks render a noninteractive status summary.",
      },
    ],
  },
};
export function ExperimentDocs({ nav }: { nav: DocsNav }) {
  const e =
    entries[nav.active as keyof typeof entries] ?? entries["experiment-chart"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", e.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{e.name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {e.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/experiment-workspace"
            >
              Open Experiment Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${e.name.replaceAll(" ", "")} } from "@/components/experiment";\n\n${e.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={e.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The full template synchronizes both chart cursors, lets you search
              and filter experiments, create a draft, edit copy, pause or
              resume, change the confidence gate and record or undo a local
              decision. Loading sample results explicitly attaches illustrative
              observations to a new draft. Data resets on reload.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Observed lift is calculated from aggregate conversion rates, not
              an average of daily percentages. The fixture reproduces 251 /
              6,120 for A and 289 / 6,080 for B: +15.9% relative lift, +0.65
              percentage points, and B ahead on 13 of 14 days. The 96%
              confidence is supplied demo metadata, not inferred from those
              observations. No statistical engine, live tracking or traffic
              deployment is connected.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/PostiauxCharles/status/2110321094301479197"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Charles Postiaux ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

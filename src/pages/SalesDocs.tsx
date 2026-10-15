import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "revenue-matrix": {
    name: "Revenue Matrix",
    description:
      "A zero-based pixel-column chart for dated revenue. Partial cells preserve amounts; a data disclosure exposes exact observations.",
    code: '<RevenueMatrix days={[{date:"Sep 1",value:12000},{date:"Sep 2",value:18000}]} label="Booked revenue" />',
    rows: [
      {
        prop: "days",
        type: "RevenueDay[]",
        desc: "Ordered date labels and non-negative, finite USD values. Empty and invalid datasets have explicit states. A shared zero baseline and rounded upper limit apply to every column. Keep datasets compact (7–60 observations).",
      },
      {
        prop: "label",
        type: "string",
        desc: "Accessible chart heading. Defaults to Booked revenue. Color is decorative; column height encodes value.",
      },
    ],
  },
  "pipeline-funnel": {
    name: "Pipeline Funnel",
    description:
      "A sculpted stage summary with numerical amounts and shares. The tier shapes communicate stage order, not amount or conversion rate.",
    code: '<PipelineFunnel stages={[{id:"early",label:"Early stage",value:120000},{id:"qualified",label:"Qualified",value:80000},{id:"negotiation",label:"Negotiation",value:50000}]} />',
    rows: [
      {
        prop: "stages",
        type: "PipelineStage[]",
        desc: "Ordered unique id, label and non-negative finite USD value. Values drive the legend and percentage of the total. Zero-total shares are 0%. Empty and invalid inputs show shared states. Use a small number of stages (typically three).",
      },
    ],
  },
  "deal-stage-badge": {
    name: "Deal Stage Badge",
    description:
      "Five sales stages mapped to Oreo’s canonical Tag palette, with readable text in both themes.",
    code: '<DealStageBadge stage="Negotiation" />',
    rows: [
      {
        prop: "stage",
        type: '"New" | "Contacted" | "Qualified" | "Negotiation" | "Won"',
        desc: "Text remains the primary status signal; the palette is supplementary.",
      },
    ],
  },
  "deal-table": {
    name: "Deal Table",
    description:
      "A sales-opportunity table with controlled selection, stage progress and optional editing. The host owns filtering, sorting, records and mutations.",
    code: "<DealTable deals={deals} selectedIds={selected} onSelectionChange={setSelected} onEdit={openEditor} onClear={clearFilters} />",
    rows: [
      {
        prop: "deals",
        type: "Deal[]",
        desc: "Unique id, lead, company, stage, source, USD value and next step. Progress is a fixed stage mapping, not win probability. Validate amounts at the host boundary; nonfinite/negative values render Unavailable.",
      },
      {
        prop: "selectedIds / onSelectionChange",
        type: "string[] / (ids:string[]) => void",
        desc: "Controlled selection. Header checkbox selects visible records and preserves selection outside the list. Omit the callback to hide selection controls.",
      },
      {
        prop: "onEdit / onClear",
        type: "(deal:Deal) => void / () => void",
        desc: "Host-owned actions. Omitting onEdit hides edit buttons; onClear adds a recovery action to the shared empty state.",
      },
    ],
  },
};
export function SalesDocs({ nav }: { nav: DocsNav }) {
  const e =
    entries[nav.active as keyof typeof entries] ?? entries["revenue-matrix"];
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
              href="/sales-workspace"
              className="mt-4 inline-block text-sm underline"
            >
              Open Sales Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${e.name.replaceAll(" ", "")} } from "@/components/sales";\n\n${e.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={e.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The complete template includes light/dark themes, responsive
              navigation, revenue periods, search, stage filters, sorting,
              selection, creation/editing, bulk win, undo and CSV export.
              Metrics and pipeline amounts derive from local deals. Historical
              bookings are a separate sample dataset. All edits reset on reload;
              no CRM, storage or network service is connected. A brief card
              entrance respects reduced motion; financial values and keyboard
              actions update immediately.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/Wuraoladesigns/status/2110621316835573992"
              target="_blank"
              rel="noreferrer"
            >
              Animation reference by Wuraola ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

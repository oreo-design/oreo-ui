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
  "dashboard-stat-card": {
    name: "Dashboard Stat Card",
    description:
      "A metric card with a tucked header, separated comparison footer or quiet filled surface.",
    code: '<DashboardStatCard label="Revenue" value="$42,800" change={12.4} variant="header" />',
    rows: [
      {
        prop: "label / value / icon",
        type: "string / string / ReactNode",
        desc: "Host formats the value and supplies an optional neutral icon.",
      },
      {
        prop: "change / comparison",
        type: "number | null / string",
        desc: "Signed percent comparison. Null or invalid values show no prior comparison; values are not inferred from the display string.",
      },
      {
        prop: "variant / trend",
        type: "footer | header | plain / number[]",
        desc: "Three structural variants. Optional trend reuses BalanceSparkBars; finite non-negative samples only.",
      },
    ],
  },
  "comparison-bar-chart": {
    name: "Comparison Bar Chart",
    description:
      "Neutral stacked or grouped series, with zero baseline, period inspection and an exact-data disclosure.",
    code: '<ComparisonBarChart points={[{label:"Oct 16",values:[120,80]}]}\n series={["New","Returning"]} mode="stacked" unit="USD" />',
    rows: [
      {
        prop: "points / series",
        type: "ChartPoint[] / string[]",
        desc: "Every point has label and one value per series. Supports 1–3 finite non-negative series. Invalid data and no observations have distinct states.",
      },
      {
        prop: "mode",
        type: "stacked | grouped",
        desc: "Stacked uses the sum for the ceiling; grouped uses the largest observation. Stacked segments should represent parts of one whole, not unrelated totals.",
      },
      {
        prop: "label / unit",
        type: "string",
        desc: "Accessible chart name and exact value unit. Selection is available through a native select and pointer inspection; the complete data table remains available.",
      },
    ],
  },
  "trend-area-chart": {
    name: "Trend Area Chart",
    description:
      "A restrained area chart with a selected observation and accessible exact values.",
    code: '<TrendAreaChart points={[{label:"Oct 15",values:[90]},\n {label:"Oct 16",values:[120]}]} label="Revenue" unit="USD" />',
    rows: [
      {
        prop: "points",
        type: "ChartPoint[]",
        desc: "Exactly one finite non-negative value per observation. Zero stays at baseline, single points render a marker, empty and invalid inputs show canonical states.",
      },
      {
        prop: "label / unit",
        type: "string",
        desc: "Accessible series name and unit. Pointer position and native select choose the readout. Values are connected linearly; no synthetic smoothing.",
      },
    ],
  },
  "channel-breakdown": {
    name: "Channel Breakdown",
    description:
      "Source labels and exact counts paired with existing neutral pixel meters.",
    code: '<ChannelBreakdown channels={[{id:"organic",label:"Organic",value:120}]}\n selected={source} onSelect={setSource} />',
    rows: [
      {
        prop: "channels",
        type: "Channel[]",
        desc: "Unique IDs, labels and finite non-negative counts. Shares use the sum of all channels, with explicit zero shares for all-zero data.",
      },
      {
        prop: "selected / onSelect",
        type: "string / callback",
        desc: "Optional controlled selection; pressing the selected channel clears it. Without a callback the rows are noninteractive.",
      },
      {
        prop: "label",
        type: "string",
        desc: "Section heading, defaults to Traffic sources. Empty and invalid input use shared workspace states.",
      },
    ],
  },
};
export function DashboardSuiteDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["dashboard-stat-card"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", s.name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{s.name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {s.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm underline">
              {[
                ["dashboard-suite", "Commerce"],
                ["campaign-dashboard", "Campaigns"],
                ["crm-dashboard", "CRM"],
                ["membership-dashboard", "Membership"],
              ].map(([url, label]) => (
                <a key={url} href={`/${url}`}>
                  {label} template ↗
                </a>
              ))}
            </div>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name.replaceAll(" ", "")} } from "@/components/dashboard-suite";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Four local templates share period selection, record search,
              source/status filters, validated record creation, detail/removal,
              one-step undo and CSV export. Historical chart fixtures are
              separate from editable records. Refresh retains data and failure
              exposes retry. Data resets on reload; no CRM, analytics, email or
              billing service is connected. Operations are immediate and do not
              animate chart values.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/efferdco/status/2110800367026118933"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Efferd ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

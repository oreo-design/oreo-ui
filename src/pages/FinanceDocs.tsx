import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const content: Record<
  string,
  {
    title: string;
    description: string;
    usage: string;
    rows: { prop: string; type: string; desc: string; def?: string }[];
  }
> = {
  "balance-chart": {
    title: "Balance Chart",
    description:
      "Three financial series, one shared scale. Inspect every snapshot with a keyboard-accessible range control or the data table.",
    usage:
      '<BalanceChart points={[\n  { label: "Monday", income: 1200, expenses: 800, savings: 400 },\n  { label: "Tuesday", income: 1800, expenses: 1000, savings: 800 },\n]} />',
    rows: [
      {
        prop: "points",
        type: "BalancePoint[]",
        desc: "Label, income, expenses and savings. Values are USD snapshots. Invalid or negative rows are omitted; order is preserved.",
      },
      {
        prop: "label",
        type: "string",
        def: "Balance overview",
        desc: "Accessible chart title and table caption.",
      },
    ],
  },
  "allocation-bar": {
    title: "Allocation Bar",
    description:
      "A compact, proportional breakdown with readable labels and amounts. Color adds a cue; the legend carries the data.",
    usage:
      '<AllocationBar items={[\n  { id: "holiday", label: "Holiday", amount: 3200, tone: "purple" },\n  { id: "home", label: "New home", amount: 5000, tone: "mint" },\n]} />',
    rows: [
      {
        prop: "items",
        type: "Allocation[]",
        desc: "Unique id, label, USD amount and semantic tone. Negative/nonfinite amounts become zero.",
      },
      {
        prop: "label",
        type: "string",
        def: "Savings allocation",
        desc: "Names the visual breakdown. An all-zero list shows the shared empty state.",
      },
    ],
  },
  "spending-gauge": {
    title: "Spending Gauge",
    description:
      "A half-ring budget comparison with category totals, remaining spend and an explicit over-budget state.",
    usage:
      '<SpendingGauge items={categories} limit={2000} label="Weekly spending" />',
    rows: [
      {
        prop: "items",
        type: "Allocation[]",
        desc: "The same category data used by AllocationBar. Each segment is proportional to the larger of the budget or total.",
      },
      {
        prop: "limit",
        type: "number",
        desc: "Positive USD budget. Over-budget values are stated in text; meter value is clamped to its maximum. Invalid limits show a not-set state.",
      },
      {
        prop: "label",
        type: "string",
        def: "Monthly spending",
        desc: "Accessible meter label. aria-valuetext includes actual spend, budget and percent.",
      },
    ],
  },
  "payment-card": {
    title: "Payment Card",
    description:
      "A display-only account card with a token-based gradient and a distinct frozen state. It only accepts the last four digits.",
    usage:
      '<PaymentCard holder="ALEX MORGAN" lastFour="1327" label="Everyday card" frozen={false} />',
    rows: [
      { prop: "holder", type: "string", desc: "Cardholder display name." },
      {
        prop: "lastFour",
        type: "string",
        desc: "Exactly four digits. Any other input renders a fully masked suffix; never pass a full card number.",
      },
      {
        prop: "label",
        type: "string",
        def: "Everyday card",
        desc: "Account label.",
      },
      {
        prop: "frozen",
        type: "boolean",
        def: "false",
        desc: "Neutral surface and explicit frozen label. Your application owns card actions.",
      },
    ],
  },
};
export function FinanceDocs({ nav }: { nav: DocsNav }) {
  const page = content[nav.active] ?? content["balance-chart"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", page.title]}
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
              {page.title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {page.description}
            </p>
            <a
              href="/finance-workspace"
              className="mt-4 inline-block text-sm underline"
            >
              Open Finance Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                "import { " +
                page.title.replaceAll(" ", "") +
                ' } from "@/components/finance";\n\n' +
                page.usage
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={page.rows} />
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              Tones: purple, mint, blue, orange, pink and neutral. Components
              use Oreo tokens in both themes. Figures and selection update
              instantly, keeping financial data stable under keyboard input and
              reduced motion. Finance Workspace uses illustrative local data; it
              has no bank connection or live pricing.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

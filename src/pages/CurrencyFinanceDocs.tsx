import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "currency-balance-card": {
    name: "Currency Balance Card",
    description:
      "A currency identity, balance and controlled account selection in a compact financial card.",
    code: '<CurrencyBalanceCard account={{currency: "GBP", balance: 3717472}}\n  selected={account === "GBP"} hidden={hidden} onSelect={setAccount} />',
    rows: [
      {
        prop: "account",
        type: "CurrencyAccount",
        desc: "Supported ISO currency and non-negative safe integer balance in minor units (100 per unit). GBP 3717472 means £37,174.72. Currency name and ISO code accompany the decorative flag.",
      },
      {
        prop: "selected / hidden / onSelect",
        type: "boolean / boolean / callback",
        desc: "Controlled selection and balance masking. Without onSelect, renders a read-only article. Hidden amounts are removed from visible and accessible card content; this is display privacy, not encryption.",
      },
    ],
  },
  "currency-balance-summary": {
    name: "Currency Balance Summary",
    description:
      "A combined balance with overlapping currency identities, explicit base currency and controlled visibility.",
    code: '<CurrencyBalanceSummary accounts={accounts} base="USD"\n  hidden={hidden} onVisibilityChange={setHidden} />',
    rows: [
      {
        prop: "accounts / base",
        type: "CurrencyAccount[] / Currency",
        desc: "Valid unique currency accounts; base defaults to USD. Empty accounts total zero. Uses this demo module’s fixed illustrative rational rates, not live market rates.",
      },
      {
        prop: "hidden / onVisibilityChange",
        type: "boolean / callback",
        desc: "Host owns visibility. Omitting the callback hides the toggle. The template masks both total and balance cards, while transactions remain visible.",
      },
    ],
  },
  "money-activity-list": {
    name: "Money Activity List",
    description:
      "Currency-aware incoming, outgoing, conversion and draft rows with optional detail actions and distinct loading, error and empty states.",
    code: "<MoneyActivityList entries={entries} onOpen={openDetails}\n  loading={loading} error={error} onRetry={retry} onReset={clearFilters} />",
    rows: [
      {
        prop: "entries",
        type: "MoneyEntry[]",
        desc: "Unique id, currency, positive integer minor-unit amount, kind, description, date and optional conversion destination/receipt. in/out are posted sample payments; request/scheduled are unexecuted drafts.",
      },
      {
        prop: "onOpen",
        type: "(entry: MoneyEntry) => void",
        desc: "Optional detail action. Without it rows are static. Host owns sorting/filtering and accounting.",
      },
      {
        prop: "loading / error / onRetry / onReset",
        type: "state props / callbacks",
        desc: "Static content skeleton on initial loading; preserve existing rows while refreshing with aria-busy. Explicit errors and empty collections reuse AgentWorkspaceState. Recovery controls only render with callbacks.",
      },
    ],
  },
  "cash-flow-bars": {
    name: "Cash Flow Bars",
    description:
      "Paired incoming and outgoing bars sharing a zero baseline, keyboard inspection and a precise amounts table.",
    code: '<CashFlowBars days={[{date:"2026-10-16", incoming:450000, outgoing:150000}]} />',
    rows: [
      {
        prop: "days",
        type: "CashFlowDay[]",
        desc: "Unique dates and non-negative safe integer USD cents. Same linear scale for both series; zero bars stay at zero. Empty and invalid data use explicit shared states.",
      },
      {
        prop: "label",
        type: "string",
        desc: "Accessible chart caption. The chart currently formats USD only. Use cashFlowDays to aggregate completed in/out entries to USD with the demo’s rates. Conversion and draft entries are excluded.",
      },
    ],
  },
};
export function CurrencyFinanceDocs({ nav }: { nav: DocsNav }) {
  const spec = specs[nav.active] ?? specs["currency-balance-card"];
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
              href="/cross-currency"
            >
              Open Cross-Currency ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${spec.name.replaceAll(" ", "")} } from "@/components/currency-finance";\n\n${spec.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={spec.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template uses fixed fictional rates and integer minor-unit
              balances. Conversion rounds half up once at the destination minor
              unit; combined totals round each account before summing. Local
              add, send and conversion operations update balances atomically.
              Requests and scheduled payments are drafts only: they do not
              reserve funds, execute automatically or notify anyone. One-step
              undo restores the previous complete wallet. All changes reset on
              reload.
            </p>
            <p className="mt-4 text-sm leading-7 text-text-secondary">
              Search filters activity only. Account and period filter both
              activity and cash flow. The cash-flow chart covers October 1–16 or
              October 10–16, 2026 and excludes conversions and drafts. “All
              activity” includes future scheduled drafts. JSON export contains
              the visible activity entries and their filter scope, not hidden
              transactions. Current balances are a fictional account snapshot,
              not the sum of this partial transaction history. No banking API or
              live exchange-rate service is used.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/heisjoss/status/2110675076677042291"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Efosa ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

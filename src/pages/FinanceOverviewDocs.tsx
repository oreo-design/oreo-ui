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
  "skeleton-reveal": {
    name: "Skeleton Reveal",
    description:
      "A shared slot that reveals ready content from a matched skeleton and keeps existing data readable during refresh.",
    code: '<SkeletonReveal loading={loading} hasData={!!data}\n  skeleton={<YourContentSkeleton />} label="Loading account">\n  <YourAccount data={data} />\n</SkeletonReveal>',
    rows: [
      {
        prop: "loading / hasData",
        type: "boolean",
        desc: "Only loading without prior data hides content. Refresh sets aria-busy while preserving readable content. Hidden content is inert and aria-hidden.",
      },
      {
        prop: "skeleton / children",
        type: "ReactNode",
        desc: "Both share a grid slot; the skeleton reserves a minimum size. Match skeleton geometry to your content. Skeleton must be decorative and contain no focus-dependent logic.",
      },
      {
        prop: "delay / animate / label",
        type: "number / boolean / string",
        desc: "Delay in milliseconds is clamped to 0–120; opacity/4px reveal lasts 180ms. Keyboard and reduced-motion changes are immediate. Supply a loading label. Host owns actual fetching, retries and request cancellation.",
      },
    ],
  },
  "balance-spark-bars": {
    name: "Balance Spark Bars",
    description:
      "A quiet bank-balance trend with a highlighted latest sample and a complete accessible numeric label.",
    code: '<BalanceSparkBars values={history} label="Operating balance in cents" />',
    rows: [
      {
        prop: "values",
        type: "number[]",
        desc: "Finite non-negative samples, normalized to the series maximum. Zero has no filled bar; empty or invalid series show No trend. No invented precision or smoothed data.",
      },
      {
        prop: "label",
        type: "string",
        desc: "Name and unit of the series. All values are included in the accessible label; the template also supplies an exact data table.",
      },
    ],
  },
  "finance-attention-list": {
    name: "Finance Attention List",
    description:
      "A compact list of financial reminders, with tinted identity marks, supporting detail and host-owned actions.",
    code: "<FinanceAttentionList items={notices} loading={loading}\n  hasData={loaded} onOpen={openReminder} />",
    rows: [
      {
        prop: "items / onOpen",
        type: "FinanceNotice[] / callback",
        desc: "Host filters resolved items. Each item has title, description, kind and action label. Opening is optional; nothing is approved or paid by the component.",
      },
      {
        prop: "loading / hasData / error / onRetry",
        type: "state props",
        desc: "Four matched skeleton rows for initial loading; preserves supplied data on refresh or refresh failure. Distinct centered empty/error states; retry delegated to host.",
      },
      {
        prop: "animate",
        type: "boolean",
        desc: "Disable initial reveal explicitly. Keyboard and reduced-motion preference are also respected.",
      },
    ],
  },
  "bank-account-list": {
    name: "Bank Account List",
    description:
      "Bank identities, masked account endings, balances and mini trends, composed with total, skeletons and an optional connection row.",
    code: "<BankAccountList accounts={accounts} loading={loading}\n  hasData={loaded} onOpen={openAccount} onConnect={addSample} />",
    rows: [
      {
        prop: "accounts",
        type: "BankAccount[]",
        desc: "Unique account IDs, four-digit endings, supported currency, non-negative safe-integer minor-unit balances and history. Total uses existing currency-finance fixed rational rates, not live FX. Currency-specific rows retain their original units.",
      },
      {
        prop: "onOpen / onConnect",
        type: "callbacks",
        desc: "Optional host actions. The component does not access bank APIs or credentials.",
      },
      {
        prop: "loading / hasData / error / onRetry",
        type: "state props",
        desc: "Five matched row skeletons plus optional connect skeleton. Existing accounts remain readable during refresh and refresh failure. Mutations are disabled while loading.",
      },
      {
        prop: "filtered / onClear / animate",
        type: "boolean / callback / boolean",
        desc: "No matches differs from no accounts; clear-search recovery is optional. Narrow screens wrap balances below identity. Reduced motion and keyboard changes skip reveal.",
      },
    ],
  },
};
export function FinanceOverviewDocs({ nav }: { nav: DocsNav }) {
  const s = specs[nav.active] ?? specs["bank-account-list"];
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
            <a
              className="mt-4 inline-block text-sm underline"
              href="/finance-overview"
            >
              Open Finance Overview ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${s.name.replaceAll(" ", "")} } from "@/components/finance-overview";\n\n${s.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={s.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              This template uses a cancellable 1.2-second simulated request.
              Refresh keeps previous data; replay shows initial placeholders and
              restores local edits. Failure retains data and exposes retry.
              Reminder review and sample-account creation support one-step undo.
              All changes reset on reload. No actual bills, bank accounts,
              financial advice or live exchange rates are involved. Final
              balances appear directly rather than counting through synthetic
              amounts.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/hakimhn_/status/2110770755713814650"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Hakim Haiman ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

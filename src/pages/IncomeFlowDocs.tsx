import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function IncomeFlowDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Income Flow"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "properties", label: "Properties" },
        { id: "rules", label: "States & composition" },
      ]}
    >
      {() => (
        <>
          <header id="overview">
            <h1 className="text-3xl font-semibold">Income Flow</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A compact income total with symmetric color bands and precise
              month inspection. Independently implemented from{" "}
              <a
                className="underline"
                href="https://x.com/cabralorenzo/status/2122727878395638129"
              >
                Lorenzo Cabra’s reference video
              </a>
              , using Oreo tokens and primitives.
            </p>
            <a
              className="inline-block mt-4 underline"
              href="/income-flow-workspace"
            >
              Open the complete workspace →
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                'const points = [\n  {id:"feb",label:"Feb",amount:7633000},\n  {id:"mar",label:"Mar",amount:8222900},\n];\n<IncomeFlowCard points={points} tone="orange" />'
              }
            />
          </Section>
          <Section id="properties" title="Independent properties">
            <PropsTable
              rows={[
                {
                  prop: "IncomeFlowCard",
                  type: "points, label?, tone?, value?, onValueChange?, disabled?",
                  desc: "Nonnegative integer USD cents and unique period IDs. Starts at latest. value optionally controls the committed index; pointer preview is transient. Tone is independent of data and positive/negative change.",
                },
                {
                  prop: "IncomeFlowChart",
                  type: "points, value, onValueChange, onPreviewChange?, label?, tone?, disabled?",
                  desc: "Controlled chart. onPreviewChange receives an index while hovering and null on leave/cancel. onValueChange commits a click or keyboard choice. A standalone host owns its readout and preview state.",
                },
                {
                  prop: "IncomeComparison",
                  type: "current, previous?, previousLabel?",
                  desc: "Amounts in cents. Missing or invalid prior data has no comparison; zero prior amount displays its real amount with an unavailable percentage. Decreases show a down arrow, flat changes show 0.0%.",
                },
              ]}
            />
          </Section>
          <Section id="rules" title="States, copy and layout">
            <div className="space-y-4 text-sm leading-7 text-text-secondary">
              <p>
                Each band is a scaled envelope of the same total. Bands are not
                categories, probability ranges or a stacked sum. The chart
                normalizes its largest sample to available height; exact amounts
                remain in the readout, accessible month labels and template
                ledger. Use the existing TrendAreaChart or BalanceChart when an
                axis or multiple financial series is required.
              </p>
              <p>
                Hover previews; pointer leave restores the committed month.
                Click or tap selects. Enter/Space selects a month; Left/Right,
                Home/End and Escape provide immediate keyboard navigation, with
                Escape returning to latest. Touch taps work without hijacking
                vertical scrolling. Disabled blocks chart and month interaction,
                leaving the data readable.
              </p>
              <p>
                Empty and invalid datasets use StatusView with distinct copy.
                Zero income draws a flat center line; a single period remains
                valid without a previous comparison. The component performs no
                requests and invents no loading. Hosts own asynchronous loading,
                retry and persistence; the template uses local data only.
              </p>
              <p>
                Amounts and comparison copy update immediately. Only the pointer
                marker interpolates its transform for 120ms using the shared
                easeOut; keyboard and reduced motion skip that interpolation.
                Shape changes are immediate so every visible curve belongs to
                one real dataset. There are no count-up delays or automatic
                dataset loops.
              </p>
              <p>
                Use short period labels and a concise metric title. Names and
                supporting copy wrap. Color is data identity, never a
                profit/loss command. Foundations reuse the Oreo palette, type,
                spacing, radii and focus/state layers; SVG coordinates, envelope
                ratios and a static 10px glow are chart-specific
                geometry/effects. The template adds explicit source/period
                controls and exact-value selection; the source video did not
                establish the dataset-switch trigger.
              </p>
            </div>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function TimeframeSelectorDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Timeframe Selector"]}
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
              Timeframe Selector
            </h1>
            <p className="mt-3 text-sm text-text-secondary leading-7">
              Two nearby durations, with the rest just one tap away. Expand
              inline, browse the cyclic list, then choose a horizon.
            </p>
            <p className="mt-3 text-sm">
              <a href="/position-studio" className="underline">
                Open Position Studio ↗
              </a>{" "}
              ·{" "}
              <a
                href="https://x.com/rndr_realm/status/2110457217451462693"
                className="underline"
              >
                Reference by Rndr Realm
              </a>
            </p>
          </header>
          <Section
            id="usage"
            title="Usage"
            description="Copy the timeframe-selector folder, Icon, and Oreo tokens. Selection is controlled; expansion is local."
          >
            <CodeBlock
              code={
                'import { TimeframeSelector } from "@/components/timeframe-selector";\n\n<TimeframeSelector value={timeframe} onValueChange={setTimeframe} />'
              }
            />
            <p className="mt-4 text-sm text-text-secondary">
              Tab visits the visible choices. Enter or Space selects; Escape
              closes and restores focus to More timeframes. Pointer transitions
              take 180ms; keyboard and reduced-motion changes are instant. Use
              unique values and at least one option.
            </p>
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "value",
                  type: "string",
                  desc: "Selected option value.",
                },
                {
                  prop: "onValueChange",
                  type: "(value: string) => void",
                  desc: "Selection callback; app owns persistence.",
                },
                {
                  prop: "options",
                  type: "TimeframeOption[]",
                  def: "1H, 4H, 24H, 3D, 1W",
                  desc: "Ordered cyclic choices with unique value and short label.",
                },
                {
                  prop: "label",
                  type: "string",
                  def: "Timeframe",
                  desc: "Accessible name for group and choices.",
                },
                {
                  prop: "disabled",
                  type: "boolean",
                  def: "false",
                  desc: "Disables selection and expansion.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}

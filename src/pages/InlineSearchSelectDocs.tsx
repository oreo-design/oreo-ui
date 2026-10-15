import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function InlineSearchSelectDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Inline Search Select"]}
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
              Inline Search Select
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A selected value becomes a search input in the same place. Base UI
              owns list navigation, selection, Escape and outside dismissal.
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
            description="Copy inline-search-select, Icon and AgentWorkspaceState with Oreo tokens. Requires the existing Base UI package."
          >
            <CodeBlock
              code={
                'import { InlineSearchSelect } from "@/components/inline-search-select";\n\n<InlineSearchSelect label="Token" value={token} onValueChange={setToken}\n  options={[{value:"eth", label:"ETH", description:"Ethereum"}]} />'
              }
            />
            <p className="mt-4 text-sm text-text-secondary">
              Open with Enter or Space, type to filter by label or description,
              use arrow keys and Enter to select. Escape returns focus to the
              trigger. Loading preserves the option-row shape; errors show an
              optional retry action. Empty results use Oreo’s shared state
              component. Data loading and persistence belong to the consumer.
            </p>
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "options",
                  type: "InlineSearchOption[]",
                  desc: "Unique value, label, optional description, meta and icon.",
                },
                {
                  prop: "value / onValueChange",
                  type: "string / (value: string) => void",
                  desc: "Controlled single selection.",
                },
                {
                  prop: "label / placeholder",
                  type: "string",
                  desc: "Accessible field name / search hint.",
                },
                {
                  prop: "disabled",
                  type: "boolean",
                  def: "false",
                  desc: "Disables the control.",
                },
                {
                  prop: "loading",
                  type: "boolean",
                  def: "false",
                  desc: "Five content-shaped skeleton rows.",
                },
                {
                  prop: "error / onRetry",
                  type: "string / () => void",
                  desc: "Error description and optional recovery callback. Error takes precedence over results.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}

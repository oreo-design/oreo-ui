import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function ProgressiveStepsDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Progressive Steps"]}
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
              Progressive Steps
            </h1>
            <p className="mt-3 text-sm text-text-secondary leading-7">
              A sculpted linear step indicator with expanded-label and
              compact-number variants. Completion and navigation remain
              controlled by your flow.
            </p>
            <a
              className="mt-4 inline-block underline text-sm"
              href="/progressive-checkout"
            >
              Open Progressive Checkout ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                '<ProgressiveSteps\n  steps={[{ id: "cart", label: "Cart" }, { id: "details", label: "Details" }]}\n  value={step} completed={completed} onValueChange={setStep}\n  variant="expanded"\n/>'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "steps",
                  type: "ProgressiveStep[]",
                  desc: "Unique IDs, labels and optional disabled flags. Long rails scroll within their own container; step names remain accessible.",
                },
                {
                  prop: "value / onValueChange",
                  type: "string / callback?",
                  desc: "Current step and navigation request. Omit callback for read-only display. The host validates transitions.",
                },
                {
                  prop: "completed",
                  type: "readonly string[]",
                  desc: "Explicit completion; visiting a previous step does not silently erase other checks. Supply all IDs and an empty value for a completed flow.",
                },
                {
                  prop: "variant / label / disabled",
                  type: '"expanded" | "compact" / string / boolean',
                  desc: "Expanded current label or compact numbered marker, accessible navigation name and global interaction lock.",
                },
              ]}
            />
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              Pointer transitions use the house ease-out curve at 240ms.
              Keyboard changes and reduced-motion preference remove movement.
              Future steps in the template stay locked until earlier data is
              confirmed; changing that data invalidates downstream completion.
              Forms and payment actions are local fixtures.
            </p>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

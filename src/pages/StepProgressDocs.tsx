import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function StepProgressDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Step Progress"]}
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
              Step Progress
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A compact, labeled progress track for completed checks. Uses the
              same semantic success color and restrained track as Oreo’s Plan,
              without requiring a visible task list.
            </p>
            <p className="mt-3 text-sm">
              <a href="/security-review" className="underline">
                Open Security Review ↗
              </a>
            </p>
          </header>
          <Section
            id="usage"
            title="Usage"
            description="Copy step-progress and Oreo tokens. The consumer owns the completed count."
          >
            <CodeBlock
              code={
                'import { StepProgress } from "@/components/step-progress";\n\n<StepProgress completed={3} total={18} label="Review progress" />'
              }
            />
            <p className="mt-4 text-sm text-text-secondary">
              Values are clamped to nonnegative integers. Zero total exposes “No
              checks” instead of an invalid progress range. Updates are
              immediate and do not imply background processing.
            </p>
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "completed",
                  type: "number",
                  desc: "Completed count, clamped between zero and total.",
                },
                {
                  prop: "total",
                  type: "number",
                  desc: "Available checks; negative or non-finite input becomes zero.",
                },
                {
                  prop: "label",
                  type: "string",
                  def: "Review progress",
                  desc: "Visible and accessible progress label.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}

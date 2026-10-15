import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function ProjectSummaryDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Project Summary"]}
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
              Project Summary
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A compact project card with a clear next destination,
              completed-task progress, delivery date and team. Uses Oreo Avatar,
              Tag and StepProgress.
            </p>
            <a
              className="mt-3 inline-block underline text-sm"
              href="/project-workspace"
            >
              Open Project Workspace ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={
                'import { ProjectSummary } from "@/components/project-summary";\n\n<ProjectSummary title="Website redesign" completed={3} total={12}\n  due="Oct 30" status="On track" onOpen={() => openProject()} />'
              }
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "title / description",
                  type: "string",
                  desc: "Project name and optional short purpose.",
                },
                {
                  prop: "completed / total",
                  type: "number",
                  desc: "Counts passed to StepProgress, which clamps invalid ranges.",
                },
                {
                  prop: "status",
                  type: '"On track" | "At risk" | "Planning"',
                  def: "On track",
                  desc: "Semantic project health badge.",
                },
                {
                  prop: "due / icon / people",
                  type: "string / ReactNode / Person[]",
                  desc: "Optional metadata. At most three avatars plus overflow count.",
                },
                {
                  prop: "onOpen",
                  type: "() => void",
                  desc: "Optional action on the title. Without it the title is plain text.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}

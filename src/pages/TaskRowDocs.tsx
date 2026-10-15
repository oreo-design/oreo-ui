import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
export function TaskRowDocs({ nav }: { nav: DocsNav }) {
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", "Task Row"]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Task Row</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              A task is two distinct actions: complete it, or open its details.
              Native checkbox and title button keep both keyboard-accessible
              without nested buttons. Optional metadata becomes quieter on
              narrow screens.
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
                'import { TaskRow } from "@/components/task-row";\n\n<TaskRow id="WEB-102" title="Finalize navigation" status="progress"\n  priority="High" due="Today" onOpen={() => openTask()}\n  onComplete={done => setStatus(done ? "done" : "todo")} />'
              }
            />
            <p className="mt-4 text-sm text-text-secondary">
              Reuse with Avatar, Tag, Icon and Oreo tokens. State and date
              formatting belong to the consumer. Completion is immediate; detail
              presentation belongs to the owning template.
            </p>
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={[
                {
                  prop: "id / title / project",
                  type: "string",
                  desc: "Task identity, title and optional project context.",
                },
                {
                  prop: "status",
                  type: '"backlog" | "todo" | "progress" | "review" | "done"',
                  desc: "Completion checkbox and semantic badge.",
                },
                {
                  prop: "priority / due / overdue",
                  type: "TaskPriority / string / boolean",
                  desc: "Optional priority and preformatted date; overdue uses error color only while incomplete.",
                },
                {
                  prop: "person",
                  type: "{name, color?}",
                  desc: "Optional Avatar data; empty displays an accessible unassigned marker.",
                },
                {
                  prop: "onOpen / onComplete",
                  type: "() => void / (done: boolean) => void",
                  desc: "Separate callbacks for navigation and completion.",
                },
                {
                  prop: "disabled",
                  type: "boolean",
                  def: "false",
                  desc: "Disables both task actions.",
                },
              ]}
            />
          </Section>
        </>
      )}
    </DocsPage>
  );
}

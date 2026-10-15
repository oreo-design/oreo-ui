import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "project-create-card": {
    name: "Project Create Card",
    description:
      "An illustrated project entry with a small, interruptible hover response on its floating card.",
    code: "<ProjectCreateCard onCreate={openEditor} animated />",
    rows: [
      {
        prop: "title / description / actionLabel",
        type: "string",
        desc: "Custom entry copy. Long text wraps.",
      },
      {
        prop: "onCreate",
        type: "() => void",
        desc: "Host-owned creation action. Without it, the illustration and copy remain informational.",
      },
      {
        prop: "animated",
        type: "boolean",
        desc: "Default true. Only the decorative card moves on fine-pointer button hover. 180ms enter, 120ms return, 100ms press; transform only. Reduced motion and keyboard focus never trigger movement.",
      },
    ],
  },
  "project-board-overview": {
    name: "Project Board Overview",
    description:
      "Four project stages with counts, an optional creation entry and canonical Project Summary cards.",
    code: "<ProjectBoardOverview projects={projects} people={people} onOpen={openProject} onCreate={createInStage} />",
    rows: [
      {
        prop: "projects",
        type: "BoardProject[]",
        desc: "id, title, description, stage, category, priority, due, completed, total, assigneeId. stage is todo, progress, review or done. Host owns domain validation; dates use ISO YYYY-MM-DD.",
      },
      {
        prop: "people",
        type: "BoardPerson[]",
        desc: "id/name directory for project owners. Missing owners display without an avatar.",
      },
      {
        prop: "onOpen / onCreate",
        type: "callbacks",
        desc: "Optional host actions receiving the project ID or destination stage. Read-only rendering omits action controls.",
      },
      {
        prop: "showCreate",
        type: "boolean",
        desc: "Default true. Shows the illustrated creation entry in To do. Board columns scroll horizontally in narrow containers.",
      },
    ],
  },
};
export function ProjectBoardDocs({ nav }: { nav: DocsNav }) {
  const entry =
    entries[nav.active as keyof typeof entries] ??
    entries["project-create-card"];
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", entry.name]}
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
              {entry.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {entry.description}
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="/project-board"
            >
              Open Project Board ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${entry.name.replaceAll(" ", "")} } from "@/components/project-board";\n\n${entry.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={entry.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              Project Board combines these components with ProjectSummary,
              StepProgress, Avatar, Tag, Button, IconButton, KanbanBoard, Base
              UI Dialog and the shared empty state. Overview, Board view and
              Grid view share one project dataset. Search, priority and category
              filters preserve hidden projects when visible cards move. Board
              view includes the existing keyboard and pointer drag controls and
              owner swimlanes. New inline Kanban cards become projects with ten
              tasks and a contextual category.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              Project details support editing, moving stages, assigning an
              owner, archiving and undoing the latest archive. Completed
              projects always have all tasks complete. The October 15, 2026
              fixture resets on reload; no client data is saved or shared
              externally. The reference’s native cursor and hover presentation
              inform the illustration, while the actual project lifecycle is a
              local template implementation.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/sterlynavneet/status/2110264347595583949"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Navneet ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, PropsTable, CodeBlock } from "@/docs/primitives";
const specs: Record<
  string,
  {
    name: string;
    description: string;
    code: string;
    rows: { prop: string; type: string; desc: string }[];
  }
> = {
  "task-properties": {
    name: "TaskProperties",
    description:
      "Dense, searchable task metadata that stays beside the board. Dates commit together after validation.",
    code: '<TaskProperties task={task} people={people} dependencies={tasks}\n projectName="Marketing Campaign" onChange={patch => updateTask(patch)} />',
    rows: [
      {
        prop: "task / people / dependencies",
        type: "TaskDetails / KanbanPerson[] / optional {id,title}[]",
        desc: "Controlled task and available assignees/dependencies. Dependency options omit the current task; host must validate cycles.",
      },
      {
        prop: "onChange",
        type: "(patch: Partial<TaskDetails>) => void",
        desc: "Immediate property patches. Dates use a temporary pair with Save and Cancel. No remote writes.",
      },
      {
        prop: "projectName / labelOptions",
        type: "optional string / string[]",
        desc: "Project display name and selectable labels. Repeat and estimate are metadata; the host implements scheduling.",
      },
    ],
  },
  "task-subtasks": {
    name: "TaskSubtasks",
    description:
      "A controlled checklist with derived completion, inline creation and accessible removal.",
    code: "<TaskSubtasks items={subtasks} onChange={setSubtasks} />",
    rows: [
      {
        prop: "items",
        type: "Subtask[]",
        desc: "Unique id, title and done. Count is derived from checked items.",
      },
      {
        prop: "onChange",
        type: "(items: Subtask[]) => void",
        desc: "Receives an immutable new list for add, toggle or remove. Blank titles are disabled. Host owns persistence and undo.",
      },
    ],
  },
  "task-detail-panel": {
    name: "TaskDetailPanel",
    description:
      "A nonmodal task inspector with a protected header, completion action and explicit return to the board.",
    code: '<TaskDetailPanel taskId={task.id} title={task.title}\n complete={task.status === "done"} onComplete={toggleComplete}\n onClose={closeAndRestoreFocus}>\n  <TaskProperties task={task} people={people} onChange={updateTask} />\n</TaskDetailPanel>',
    rows: [
      {
        prop: "taskId / title / complete",
        type: "string / string / boolean",
        desc: "Changing taskId focuses the named heading. Keep the panel outside any form.",
      },
      {
        prop: "onComplete / onClose",
        type: "() => void",
        desc: "Host owns state, layout and return focus. Escape closes unless consumed by an inner control; no dialog trap or backdrop.",
      },
      {
        prop: "children",
        type: "ReactNode",
        desc: "Compose properties, description, checklist, attachments or discussion in the independently scrolling body.",
      },
    ],
  },
};
export function TaskEditorDocs({ nav }: { nav: DocsNav }) {
  const spec = specs[nav.active] ?? specs["task-properties"];
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
              href="/task-board"
              className="mt-4 inline-block text-sm underline"
            >
              Open Task Board ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${spec.name} } from "@/components/task-editor";\n\n${spec.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={spec.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The complete template reuses KanbanBoard, TaskRow,
              InlineSearchSelect, Avatar and shared actions. Desktop keeps the
              board interactive; below 850px the inspector takes the content
              area with a close action that restores focus. Comment drafts
              survive task switches. Task edits have single-step undo. Local
              files can be downloaded and are released on unmount; attachment
              metadata, not bytes, is included in JSON export. Reload resets all
              sample data. No collaboration or scheduling service is connected.
            </p>
            <a
              href="https://x.com/zahragr8r/status/2110679274848154096"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm underline"
            >
              Reference by Zahra / Gr8r Studio ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

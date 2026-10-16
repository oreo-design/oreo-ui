import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const entries = {
  "task-status-group": {
    name: "Task Status Group",
    component: "TaskStatusGroup",
    description:
      "A controlled status disclosure with a task count and optional creation action.",
    code: '<TaskStatusGroup status="progress" count={3} open={open} onOpenChange={setOpen} onAdd={createTask}>\n  {children}\n</TaskStatusGroup>',
    rows: [
      {
        prop: "status / count",
        type: "TaskStatus / number",
        desc: "Canonical TaskRow statuses and a host-computed visible count. Progress uses the same blue palette as TaskRow.",
      },
      {
        prop: "open / onOpenChange",
        type: "boolean / (open: boolean) => void",
        desc: "Controlled Base UI Collapsible. The trigger supports keyboard disclosure; collapsed content is removed from navigation.",
      },
      {
        prop: "onAdd / children",
        type: "(() => void)? / ReactNode",
        desc: "Host-owned creation action and group contents.",
      },
    ],
  },
  "task-list-row": {
    name: "Task List Row",
    component: "TaskListRow",
    description:
      "A dense semantic table row for aligned task metadata and multiple assignees.",
    code: "<table><thead>{headers}</thead><tbody>\n  <TaskListRow task={task} people={people} onOpen={() => edit(task)} />\n</tbody></table>",
    rows: [
      {
        prop: "task",
        type: "GroupedTask",
        desc: "Unique id, title, TaskStatus, optional Low/Medium/High priority, list, tags, ISO date or empty string, and assigneeIds.",
      },
      {
        prop: "people",
        type: "TaskMember[]",
        desc: "id, name and optional Oreo palette color. All assignees are exposed in the accessible name; up to three avatars render.",
      },
      {
        prop: "onOpen",
        type: "() => void",
        desc: "The task-title button opens host-owned details. Render inside a table tbody with the six matching column headers.",
      },
    ],
  },
  "grouped-task-list": {
    name: "Grouped Task List",
    component: "GroupedTaskList",
    description:
      "Status groups composed with semantic tables, disclosure and centered empty states.",
    code: "<GroupedTaskList tasks={tasks} people={people}\n  collapsed={collapsed} onCollapsedChange={setCollapsed}\n  onTaskOpen={edit} onAdd={createInStatus} showEmpty />",
    rows: [
      {
        prop: "tasks / people",
        type: "GroupedTask[] / TaskMember[]",
        desc: "Already filtered and ordered host data. Counts describe visible tasks, not the complete collection.",
      },
      {
        prop: "collapsed / onCollapsedChange",
        type: "TaskStatus[] / (statuses: TaskStatus[]) => void",
        desc: "Controlled group disclosure, preserved while filtering.",
      },
      {
        prop: "onTaskOpen / onAdd",
        type: "(task: GroupedTask) => void / ((status: TaskStatus) => void)?",
        desc: "Open and creation callbacks are owned by the host.",
      },
      {
        prop: "showEmpty",
        type: "boolean",
        desc: "False by default. When true, all five canonical stages render with explicit empty groups. Empty overall content otherwise uses AgentWorkspaceState.",
      },
    ],
  },
};
export function GroupedTasksDocs({ nav }: { nav: DocsNav }) {
  const entry =
    entries[nav.active as keyof typeof entries] ?? entries["grouped-task-list"];
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
              href="/grouped-tasks"
            >
              Open Grouped Tasks ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${entry.component} } from "@/components/grouped-tasks";\n\n${entry.code}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable rows={entry.rows} />
            <p className="mt-6 text-sm leading-7 text-text-secondary">
              The template reuses Button, IconButton, Tag, AvatarGroup,
              WorkspaceRail, AgentWorkspaceState and KanbanBoard. Tabs, modal
              focus and disclosure use Base UI. It supports search, list and
              priority filters, sorting, group-specific creation, editing,
              archive and undo. All changes are local and reset on reload.
            </p>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              TaskRow remains the compact completion row for single-assignee
              lists. TaskListRow has six aligned columns and multiple assignees;
              it shares the canonical task statuses. On narrow screens, each
              table scrolls horizontally within a named keyboard-focusable
              region. Status colors, typography, spacing and radii map to Oreo
              tokens; the 960px minimum table width and 38% name column are
              intentional table geometry. No custom timed motion is added. Board
              cards show the first assignee, while the editor retains all
              members. Board order is manual; list sorting is presentation only.
              Moving a card between assignee lanes replaces the first assignee
              and preserves other members; the Unassigned lane clears all
              assignments.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              target="_blank"
              rel="noreferrer"
              href="https://x.com/startupvisuals/status/2110803178811990300"
            >
              Reference by Startup Visuals ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

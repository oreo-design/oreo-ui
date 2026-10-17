import { DocsPage, type DocsNav } from "@/docs/DocsPage";
import { Section, CodeBlock, PropsTable } from "@/docs/primitives";
const names: Record<string, string> = {
  "task-schedule-chip": "TaskScheduleChip",
  "task-calendar": "TaskCalendar",
  "task-timeline": "TaskTimeline",
};
export function TaskScheduleDocs({ nav }: { nav: DocsNav }) {
  const name = names[nav.active] ?? "TaskCalendar";
  return (
    <DocsPage
      nav={nav}
      breadcrumb={["Components", name]}
      toc={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "api", label: "API" },
      ]}
    >
      {() => (
        <>
          <header id="overview" className="pb-8">
            <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
            <p className="mt-3 text-sm leading-7 text-text-secondary">
              {name === "TaskScheduleChip"
                ? "A compact task identity for calendars and timelines, with project color, completion state and an optional assignee."
                : name === "TaskCalendar"
                  ? "A Monday-first deadline calendar with month/week ranges, per-date creation and expandable busy days."
                  : "A day-based project timeline with inclusive date bars, project deadline markers and protected task names."}
            </p>
            <a
              href="/project-workspace"
              className="mt-3 inline-block text-sm underline"
            >
              Open Project Workspace → All tasks → Calendar / Timeline ↗
            </a>
          </header>
          <Section id="usage" title="Usage">
            <CodeBlock
              code={`import { ${name} } from "@/components/task-schedule";\n\n${name === "TaskScheduleChip" ? "<TaskScheduleChip task={task} project={project} person={person}\n  onOpen={() => openTask(task)} />" : name === "TaskCalendar" ? '<TaskCalendar tasks={tasks} projects={projects} people={people}\n  date={date} mode={mode} today="2026-10-15"\n  onDateChange={setDate} onModeChange={setMode}\n  onOpen={openTask} onCreate={createOnDate} />' : '<TaskTimeline tasks={tasks} projects={projects} people={people}\n  date={date} days={days} today="2026-10-15"\n  onDateChange={setDate} onDaysChange={setDays} onOpen={openTask} />'}`}
            />
          </Section>
          <Section id="api" title="API">
            <PropsTable
              rows={
                name === "TaskScheduleChip"
                  ? [
                      {
                        prop: "task",
                        type: "ScheduleTask",
                        desc: "id, title, projectId, status and due; start and assigneeId are optional. Uses the existing TaskStatus union.",
                      },
                      {
                        prop: "project / person",
                        type: "ScheduleProject / SchedulePerson",
                        desc: "Optional project palette and Avatar identity. Full task title and status stay in the accessible name.",
                      },
                      {
                        prop: "onOpen / disabled",
                        type: "() => void / boolean",
                        desc: "One native button; detail presentation belongs to the host. Disabled prevents activation.",
                      },
                    ]
                  : [
                      {
                        prop: "tasks / projects / people",
                        type: "ScheduleTask[] / ScheduleProject[] / SchedulePerson[]",
                        desc: "Controlled data; the host owns filtering, edits and persistence. Project color is purple, blue, mint or orange; optional project due date appears as a timeline milestone.",
                      },
                      {
                        prop: "date / today",
                        type: "YYYY-MM-DD / optional YYYY-MM-DD",
                        desc: "Date-only values use UTC calendar arithmetic. Today is explicit, never tied to the viewer's clock. Invalid range date renders shared recovery content.",
                      },
                      {
                        prop:
                          name === "TaskCalendar"
                            ? "mode / onModeChange"
                            : "days / onDaysChange",
                        type:
                          name === "TaskCalendar"
                            ? '"month" | "week" / callback'
                            : "14 | 28 / callback",
                        desc:
                          name === "TaskCalendar"
                            ? "Month is a stable 42-cell Monday-first grid. Week shows seven days. Optional range callback exposes the switcher."
                            : "Two or four weeks. Bars clip at visible boundaries without changing the underlying dates. A missing start uses the due date; no estimated duration.",
                      },
                      {
                        prop: "onDateChange / onOpen",
                        type: "(date: string) => void / (task: ScheduleTask) => void",
                        desc: "Navigation and detail callbacks. Calendar arrows step one month/week; timeline arrows step the visible range.",
                      },
                      ...(name === "TaskCalendar"
                        ? [
                            {
                              prop: "onCreate",
                              type: "(date: string) => void",
                              desc: "Optional per-day add action. The template opens the existing editor with that due date prefilled.",
                            },
                          ]
                        : []),
                      {
                        prop: "Unscheduled / invalid dates",
                        type: "automatic tray",
                        desc: "Undated or inverted ranges remain reachable below the schedule. The template validates dates before saving. Empty periods are distinguished from an empty filtered task collection.",
                      },
                    ]
              }
            />
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              Reuse the existing TaskRow editor and date helpers. Both grids
              contain their own horizontal scroll on narrow screens; timeline
              date and task headers remain opaque and sticky. No new motion,
              drag system, automatic dependencies or backend. The sample
              workspace resets on reload.
            </p>
            <a
              className="mt-4 inline-block text-sm underline"
              href="https://x.com/zahragr8r/status/2110776888050524179"
              target="_blank"
              rel="noreferrer"
            >
              Reference: Zahra / Gr8r ↗
            </a>
          </Section>
        </>
      )}
    </DocsPage>
  );
}

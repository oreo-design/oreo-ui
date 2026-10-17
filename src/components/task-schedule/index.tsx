import { useState, type CSSProperties } from "react";
import { Avatar, type AvatarProps } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { TASK_STATUS, type TaskStatus } from "@/components/task-row";
import { dateLabel } from "@/components/color-calendar/model";
import {
  addDays,
  calendarDays,
  moveMonth,
  scheduleError,
  timelineSpan,
  validDate,
} from "./model";
import "./task-schedule.css";
export type ScheduleTask = {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  start?: string;
  due: string;
  assigneeId?: string;
};
export type ScheduleProject = {
  id: string;
  name: string;
  color?: "purple" | "blue" | "mint" | "orange";
  due?: string;
};
export type SchedulePerson = {
  id: string;
  name: string;
  color?: AvatarProps["color"];
};
type Shared = {
  tasks: ScheduleTask[];
  projects: ScheduleProject[];
  people?: SchedulePerson[];
  today?: string;
  onOpen: (task: ScheduleTask) => void;
};
function label(date: string) {
  return validDate(date)
    ? dateLabel(date, { month: "short", day: "numeric", year: "numeric" })
    : "No due date";
}
export function TaskScheduleChip({
  task,
  project,
  person,
  onOpen,
  disabled = false,
}: {
  task: ScheduleTask;
  project?: ScheduleProject;
  person?: SchedulePerson;
  onOpen: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="ts-chip"
      data-tone={project?.color ?? "purple"}
      data-done={task.status === "done" || undefined}
      onClick={onOpen}
      disabled={disabled}
      aria-label={`${task.title}, ${TASK_STATUS[task.status]}, ${project?.name ?? "Project"}, ${validDate(task.due) ? `due ${label(task.due)}` : "No due date"}`}
      title={`${task.title} · ${TASK_STATUS[task.status]} · ${person?.name ?? "Unassigned"}`}
    >
      <span className="ts-status" aria-hidden="true">
        {task.status === "done" ? <Icon name="check" size="sm" /> : <span />}
      </span>
      <span className="ts-chip-title">{task.title}</span>
      {person && (
        <span className="ts-chip-avatar">
          <Avatar name={person.name} color={person.color} size="xs" />
        </span>
      )}
    </button>
  );
}
function Unscheduled({ tasks, projects, people, onOpen }: Shared) {
  const pending = tasks.filter(
    (t) => !validDate(t.due) || !!scheduleError(t.start, t.due),
  );
  if (!pending.length) return null;
  return (
    <section className="ts-unscheduled" aria-label="Tasks needing dates">
      <header>
        <h3>
          Needs scheduling <span>{pending.length}</span>
        </h3>
        <p>Open a task to add or repair its dates.</p>
      </header>
      <div>
        {pending.map((t) => (
          <TaskScheduleChip
            key={t.id}
            task={t}
            project={projects.find((p) => p.id === t.projectId)}
            person={people?.find((p) => p.id === t.assigneeId)}
            onOpen={() => onOpen(t)}
          />
        ))}
      </div>
    </section>
  );
}
export function TaskCalendar({
  tasks,
  projects,
  people = [],
  today,
  date,
  mode = "month",
  onDateChange,
  onModeChange,
  onOpen,
  onCreate,
}: Shared & {
  date: string;
  mode?: "month" | "week";
  onDateChange: (date: string) => void;
  onModeChange?: (mode: "month" | "week") => void;
  onCreate?: (date: string) => void;
}) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const days = calendarDays(date, mode),
    current = validDate(date);
  if (!current)
    return (
      <AgentWorkspaceState
        title="Calendar date unavailable"
        description="Supply a valid calendar date to display the schedule."
      />
    );
  const shift = (direction: number) =>
    onDateChange(
      mode === "month"
        ? moveMonth(date, direction)
        : addDays(date, direction * 7),
    );
  const valid = tasks.filter(
    (t) => validDate(t.due) && !scheduleError(t.start, t.due),
  );
  const visibleCount = valid.filter((t) => days.includes(t.due)).length;
  return (
    <section className="task-schedule" aria-label="Task calendar">
      <header className="ts-toolbar">
        <div>
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={`Previous ${mode}`}
            icon={<Icon name="chevron-left" size="sm" />}
            onClick={() => shift(-1)}
          />
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={`Next ${mode}`}
            icon={<Icon name="chevron-right" size="sm" />}
            onClick={() => shift(1)}
          />
          <h2 aria-live="polite">
            {mode === "month"
              ? dateLabel(date, { month: "long", year: "numeric" })
              : `${label(days[0])} – ${label(days[6])}`}
          </h2>
          {today && validDate(today) && (
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              onClick={() => onDateChange(today)}
            >
              Today
            </Button>
          )}
        </div>
        <div role="group" aria-label="Calendar range">
          {onModeChange &&
            (["month", "week"] as const).map((m) => (
              <Button
                key={m}
                type={mode === m ? "secondary" : "tertiary"}
                size="sm"
                tapScale={1}
                aria-pressed={mode === m}
                onClick={() => onModeChange(m)}
              >
                {m === "month" ? "Month" : "Week"}
              </Button>
            ))}
        </div>
      </header>
      <div className="ts-legend">
        {projects.map((p) => (
          <span key={p.id} data-tone={p.color ?? "purple"}>
            <i />
            {p.name}
          </span>
        ))}
        <small>{visibleCount} deadlines in view</small>
      </div>
      <div
        className="ts-calendar-scroll"
        tabIndex={0}
        role="region"
        aria-label="Calendar days, scroll horizontally on small screens"
      >
        <div className="ts-month" data-mode={mode}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="ts-weekday">
              {d}
            </div>
          ))}
          {days.map((d) => {
            const items = valid.filter((t) => t.due === d);
            const showAll = expanded.includes(d);
            return (
              <section
                key={d}
                className="ts-day"
                data-outside={
                  (mode === "month" && d.slice(0, 7) !== date.slice(0, 7)) ||
                  undefined
                }
                aria-label={label(d)}
              >
                <header>
                  <time
                    dateTime={d}
                    aria-current={d === today ? "date" : undefined}
                  >
                    {Number(d.slice(-2))}
                  </time>
                  {onCreate && (
                    <button
                      type="button"
                      className="ts-add"
                      aria-label={`Add task on ${label(d)}`}
                      onClick={() => onCreate(d)}
                    >
                      <Icon name="plus" size="sm" />
                    </button>
                  )}
                </header>
                {(showAll ? items : items.slice(0, 3)).map((t) => (
                  <TaskScheduleChip
                    key={t.id}
                    task={t}
                    project={projects.find((p) => p.id === t.projectId)}
                    person={people.find((p) => p.id === t.assigneeId)}
                    onOpen={() => onOpen(t)}
                  />
                ))}
                {items.length > 3 && (
                  <button
                    type="button"
                    className="ts-more"
                    aria-expanded={showAll}
                    onClick={() =>
                      setExpanded((e) =>
                        showAll ? e.filter((v) => v !== d) : [...e, d],
                      )
                    }
                  >
                    {showAll ? "Show less" : `+${items.length - 3} more`}
                  </button>
                )}
              </section>
            );
          })}
        </div>
      </div>
      {!visibleCount && (
        <p className="ts-range-empty">
          No deadlines in this {mode}. Browse another period or add a task on a
          date.
        </p>
      )}
      <Unscheduled
        tasks={tasks}
        projects={projects}
        people={people}
        onOpen={onOpen}
      />
    </section>
  );
}
export function TaskTimeline({
  tasks,
  projects,
  people = [],
  today,
  date,
  days = 14,
  onDateChange,
  onDaysChange,
  onOpen,
}: Shared & {
  date: string;
  days?: 14 | 28;
  onDateChange: (date: string) => void;
  onDaysChange?: (days: 14 | 28) => void;
}) {
  if (!validDate(date))
    return (
      <AgentWorkspaceState
        title="Timeline date unavailable"
        description="Supply a valid start date to display the timeline."
      />
    );
  const dates = Array.from({ length: days }, (_, i) => addDays(date, i));
  const scheduled = tasks.filter((t) =>
    timelineSpan(t.start, t.due, date, days),
  );
  const ids = [...new Set(scheduled.map((t) => t.projectId))];
  const columns = {
    gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))`,
  } as CSSProperties;
  const dayCells = () =>
    dates.map((d, i) => (
      <span
        key={d}
        className="ts-track-day"
        data-today={d === today || undefined}
        data-weekend={
          [0, 6].includes(new Date(d + "T12:00:00Z").getUTCDay()) || undefined
        }
        style={{ gridColumn: i + 1, gridRow: 1 }}
      />
    ));
  return (
    <section className="task-schedule" aria-label="Task timeline">
      <header className="ts-toolbar">
        <div>
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label="Previous timeline period"
            icon={<Icon name="chevron-left" size="sm" />}
            onClick={() => onDateChange(addDays(date, -days))}
          />
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label="Next timeline period"
            icon={<Icon name="chevron-right" size="sm" />}
            onClick={() => onDateChange(addDays(date, days))}
          />
          <h2 aria-live="polite">
            {label(date)} – {label(dates[days - 1])}
          </h2>
          {today && validDate(today) && (
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              onClick={() => onDateChange(addDays(today, -3))}
            >
              Today
            </Button>
          )}
        </div>
        {onDaysChange && (
          <label className="ts-zoom">
            Range
            <select
              aria-label="Timeline range"
              value={days}
              onChange={(e) => onDaysChange(Number(e.target.value) as 14 | 28)}
            >
              <option value={14}>2 weeks</option>
              <option value={28}>4 weeks</option>
            </select>
          </label>
        )}
      </header>
      <p className="ts-timeline-summary">
        {scheduled.length} of {tasks.length} tasks in this period · Bars show
        start → due; a due-only task occupies one day.
      </p>
      {scheduled.length ? (
        <div
          className="ts-timeline-scroll"
          role="region"
          tabIndex={0}
          aria-label="Project task timeline, scroll to explore dates"
        >
          <div
            className="ts-timeline"
            style={{ minWidth: `${240 + days * 40}px` }}
          >
            <div className="ts-line ts-timeline-header">
              <div className="ts-name">Task / project</div>
              <div className="ts-track ts-date-head" style={columns}>
                {dates.map((d) => (
                  <div key={d} data-today={d === today || undefined}>
                    <small>
                      {d.endsWith("01") || d === date
                        ? dateLabel(d, { month: "short" })
                        : dateLabel(d, { weekday: "short" })}
                    </small>
                    <time dateTime={d}>{Number(d.slice(-2))}</time>
                  </div>
                ))}
              </div>
            </div>
            {ids.map((id) => {
              const project = projects.find((p) => p.id === id);
              const group = scheduled.filter((t) => t.projectId === id);
              const milestone =
                project?.due && validDate(project.due)
                  ? dates.indexOf(project.due)
                  : -1;
              return (
                <section key={id} aria-label={project?.name ?? id}>
                  <div className="ts-line ts-project-row">
                    <h3 className="ts-name">
                      {project?.name ?? id}
                      <span>{group.length}</span>
                    </h3>
                    <div className="ts-track" style={columns}>
                      {dayCells()}
                      {milestone >= 0 && (
                        <span
                          className="ts-milestone"
                          style={{ gridColumn: milestone + 1, gridRow: 1 }}
                          title={`${project?.name} project deadline: ${label(project!.due!)}`}
                          aria-label={`${project?.name} project deadline: ${label(project!.due!)}`}
                        >
                          ◆
                        </span>
                      )}
                    </div>
                  </div>
                  {group.map((t) => {
                    const span = timelineSpan(t.start, t.due, date, days)!;
                    return (
                      <div className="ts-line" key={t.id}>
                        <button
                          type="button"
                          className="ts-name ts-task-name"
                          onClick={() => onOpen(t)}
                        >
                          <span
                            className="ts-status"
                            data-done={t.status === "done" || undefined}
                          >
                            {t.status === "done" ? (
                              <Icon name="check" size="sm" />
                            ) : (
                              <span />
                            )}
                          </span>
                          <span>
                            {t.title}
                            <small>
                              {TASK_STATUS[t.status]} ·{" "}
                              {label(t.start || t.due)} → {label(t.due)}
                            </small>
                          </span>
                        </button>
                        <div className="ts-track" style={columns}>
                          {dayCells()}
                          <div
                            className="ts-bar"
                            data-before={span.continuesBefore || undefined}
                            data-after={span.continuesAfter || undefined}
                            style={{
                              gridColumn: `${span.from + 1} / ${span.to + 2}`,
                              gridRow: 1,
                            }}
                          >
                            <TaskScheduleChip
                              task={t}
                              project={project}
                              person={people.find((p) => p.id === t.assigneeId)}
                              onOpen={() => onOpen(t)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        </div>
      ) : (
        <AgentWorkspaceState
          title="No tasks in this period"
          description="Browse another period or add dates to an unscheduled task."
        />
      )}
      <Unscheduled
        tasks={tasks}
        projects={projects}
        people={people}
        onOpen={onOpen}
      />
    </section>
  );
}

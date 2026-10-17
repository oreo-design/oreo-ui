import {
  TaskCalendar,
  TaskTimeline,
  type ScheduleProject,
} from "@/components/task-schedule";
import { scheduleError, addDays } from "@/components/task-schedule/model";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { ProjectSummary } from "@/components/project-summary";
import {
  TaskRow,
  TASK_STATUS,
  type TaskStatus,
  type TaskPriority,
} from "@/components/task-row";
import { KanbanBoard, type KanbanCard } from "@/components/kanban";
import { AgentWorkspaceState } from "@/components/automation";
import {
  INITIAL_TASKS,
  PROJECTS,
  PEOPLE,
  SAMPLE_TODAY,
  dateLabel,
  type Task,
} from "./data";
import "./project-workspace.css";
const COLUMNS = Object.entries(TASK_STATUS).map(([id, title]) => ({
  id,
  title,
}));
export function ProjectWorkspace() {
  const [tasks, setTasks] = useState(INITIAL_TASKS),
    [screen, setScreen] = useState("home"),
    [view, setView] = useState<"list" | "board" | "calendar" | "timeline">(
      "list",
    );
  const [calendarDate, setCalendarDate] = useState(SAMPLE_TODAY),
    [calendarMode, setCalendarMode] = useState<"month" | "week">("month");
  const [timelineDate, setTimelineDate] = useState(addDays(SAMPLE_TODAY, -3)),
    [timelineDays, setTimelineDays] = useState<14 | 28>(14);
  const scheduleProjects: ScheduleProject[] = PROJECTS.map((p) => ({
    ...p,
    color: p.id === "website" ? "purple" : p.id === "mobile" ? "blue" : "mint",
  }));
  const [dark, setDark] = useState(false),
    [navOpen, setNavOpen] = useState(false),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("all"),
    [priority, setPriority] = useState("all"),
    [sort, setSort] = useState("manual");
  const [draft, setDraft] = useState<Task | null>(null),
    [error, setError] = useState(""),
    [dateError, setDateError] = useState(""),
    [subtask, setSubtask] = useState(""),
    [notice, setNotice] = useState(""),
    [archived, setArchived] = useState<Task | null>(null);
  const [activity, setActivity] = useState([
    "Sam moved Create homepage wireframes to In review.",
    "Jules completed Fix pricing page links.",
    "Maya shared the onboarding prototype.",
  ]);
  const projectSection = useRef<HTMLElement>(null);
  const newButton = useRef<HTMLButtonElement>(null),
    returnTo = useRef<HTMLElement | null>(null),
    titleInput = useRef<HTMLInputElement>(null),
    dueInput = useRef<HTMLInputElement>(null);
  const project = PROJECTS.find((p) => p.id === screen);
  const completed = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter(
    (t) => t.status !== "done" && t.due && t.due < SAMPLE_TODAY,
  );
  const mine = tasks.filter(
    (t) => t.assigneeId === "alex" && t.status !== "done",
  );
  const scoped = tasks.filter((t) =>
    screen === "mine"
      ? t.assigneeId === "alex"
      : project
        ? t.projectId === project.id
        : true,
  );
  const visible = scoped.filter(
    (t) =>
      (status === "all" ||
        (status === "open"
          ? t.status !== "done"
          : status === "overdue"
            ? t.status !== "done" && Boolean(t.due) && t.due < SAMPLE_TODAY
            : t.status === status)) &&
      (priority === "all" || t.priority === priority) &&
      `${t.title} ${t.id}`.toLowerCase().includes(query.toLowerCase().trim()),
  );
  if (sort === "due")
    visible.sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"));
  if (sort === "priority")
    visible.sort(
      (a, b) =>
        ["High", "Medium", "Low"].indexOf(a.priority) -
        ["High", "Medium", "Low"].indexOf(b.priority),
    );
  function announce(message: string) {
    setNotice(message);
    setActivity((a) => [message, ...a].slice(0, 6));
  }
  function navigate(next: string) {
    setScreen(next);
    setQuery("");
    setStatus("all");
    setPriority("all");
    setSort("manual");
    setNavOpen(false);
  }
  function open(task?: Task, due = "") {
    returnTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setDraft(
      task
        ? { ...task, subtasks: task.subtasks.map((s) => ({ ...s })) }
        : {
            id: `TASK-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
            title: "",
            projectId: project?.id ?? "website",
            status: "todo",
            priority: "Medium",
            assigneeId: "alex",
            due,
            start: "",
            description: "",
            subtasks: [],
          },
    );
    setError("");
    setDateError("");
    setSubtask("");
  }
  function complete(task: Task, done: boolean) {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === task.id ? { ...t, status: done ? "done" : "todo" } : t,
      ),
    );
    announce(`${task.title} ${done ? "completed" : "reopened"}.`);
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Give this task a title before saving.");
      titleInput.current?.focus();
      return;
    }
    const invalidDates = scheduleError(draft.start, draft.due);
    if (invalidDates) {
      setDateError(invalidDates);
      dueInput.current?.focus();
      return;
    }
    const next = { ...draft, title: draft.title.trim() };
    const exists = tasks.some((t) => t.id === next.id);
    setTasks((ts) =>
      exists ? ts.map((t) => (t.id === next.id ? next : t)) : [...ts, next],
    );
    announce(`${next.title} ${exists ? "updated" : "created"}.`);
    setDraft(null);
  }
  function archive() {
    const stored = tasks.find((t) => t.id === draft?.id);
    if (!stored) return;
    setArchived(stored);
    setTasks((ts) => ts.filter((t) => t.id !== stored.id));
    announce(`${stored.title} archived.`);
    setDraft(null);
  }
  function addSubtask() {
    if (!draft || !subtask.trim()) return;
    setDraft({
      ...draft,
      subtasks: [
        ...draft.subtasks,
        { id: crypto.randomUUID(), title: subtask.trim(), done: false },
      ],
    });
    setSubtask("");
  }
  function boardChange(cards: KanbanCard[]) {
    const ids = new Set(visible.map((t) => t.id));
    const updated = cards.map((c) => {
      const original = tasks.find((t) => t.id === c.id);
      return original
        ? {
            ...original,
            title: c.title,
            status: c.columnId as TaskStatus,
            assigneeId: c.assigneeId ?? "",
          }
        : {
            id: c.id,
            title: c.title,
            projectId: project?.id ?? "website",
            status: c.columnId as TaskStatus,
            assigneeId: c.assigneeId ?? (screen === "mine" ? "alex" : ""),
            priority: "Medium" as TaskPriority,
            due: "",
            description: "",
            subtasks: [],
          };
    });
    setTasks((ts) => [...ts.filter((t) => !ids.has(t.id)), ...updated]);
    announce("Board updated. Changes are kept in this page.");
  }
  function row(t: Task) {
    return (
      <TaskRow
        key={t.id}
        id={t.id}
        title={t.title}
        project={
          !project
            ? PROJECTS.find((p) => p.id === t.projectId)?.name
            : undefined
        }
        status={t.status}
        priority={t.priority}
        due={dateLabel(t.due)}
        overdue={Boolean(t.due && t.due < SAMPLE_TODAY)}
        person={PEOPLE.find((p) => p.id === t.assigneeId)}
        onOpen={() => open(t)}
        onComplete={(done) => complete(t, done)}
      />
    );
  }
  function clear() {
    setQuery("");
    setStatus("all");
    setPriority("all");
  }
  const cards: KanbanCard[] = visible.map((t) => ({
    id: t.id,
    title: t.title,
    columnId: t.status,
    assigneeId: t.assigneeId,
    date: t.due ? dateLabel(t.due) : undefined,
    label: {
      name: t.priority,
      color: t.priority === "High" ? "orange" : "purple",
    },
    checklist: {
      done: t.subtasks.filter((s) => s.done).length,
      total: t.subtasks.length,
    },
  }));
  const nav = (
    <>
      <a className="pw-brand" href="/project-summary">
        <span>
          <Icon name="columns" />
        </span>
        Oreo Studio
      </a>
      <p className="pw-nav-caption">WORKSPACE</p>
      {[
        { id: "home", label: "Overview", icon: "columns" as const },
        { id: "mine", label: "My tasks", icon: "list-checks" as const },
        { id: "all", label: "All tasks", icon: "list" as const },
      ].map((item) => (
        <button
          type="button"
          key={item.id}
          className="pw-nav-item"
          aria-current={screen === item.id ? "page" : undefined}
          onClick={() => navigate(item.id)}
        >
          <Icon name={item.icon} size="sm" />
          {item.label}
          {item.id === "mine" && <span>{mine.length}</span>}
        </button>
      ))}
      <p className="pw-nav-caption">
        PROJECTS <span>{PROJECTS.length}</span>
      </p>
      {PROJECTS.map((p) => (
        <button
          type="button"
          key={p.id}
          className="pw-nav-item"
          aria-current={screen === p.id ? "page" : undefined}
          onClick={() => navigate(p.id)}
        >
          <span className={`pw-project-dot pw-dot-${p.id}`} />
          {p.name}
        </button>
      ))}
      <div className="pw-nav-bottom">
        <p>Make room for great work.</p>
        <a href="/task-row">
          Explore components <Icon name="arrow-up-right" size="sm" />
        </a>
        <div className="pw-profile">
          <Avatar name="Alex Morgan" color="purple" size="sm" />
          <span>
            Alex Morgan<small>Oreo Studio · Sample workspace</small>
          </span>
        </div>
      </div>
    </>
  );
  return (
    <div className={`project-workspace ${dark ? "theme-dark" : ""}`}>
      <aside className="pw-sidebar" aria-label="Workspace navigation">
        {nav}
      </aside>
      <div className="pw-shell">
        <header className="pw-top">
          <button
            type="button"
            className="pw-mobile-nav"
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
            aria-controls="pw-mobile-navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            <Icon name="list" />
          </button>
          <span>
            Workspace <span className="pw-slash">/</span>{" "}
            <strong>
              {project?.name ??
                (screen === "home"
                  ? "Overview"
                  : screen === "mine"
                    ? "My tasks"
                    : "All tasks")}
            </strong>
          </span>
          <div className="pw-top-actions">
            <Tag>Local demo</Tag>
            <IconButton
              type="tertiary"
              tapScale={1}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark((v) => !v)}
            />
          </div>
        </header>
        {navOpen && (
          <nav
            id="pw-mobile-navigation"
            className="pw-mobile-panel"
            aria-label="Mobile workspace navigation"
          >
            {nav}
          </nav>
        )}
        <main className="pw-main">
          <div className="pw-page-heading">
            <div>
              <p className="pw-eyebrow">OREO STUDIO / WORK IN FOCUS</p>
              <h1>
                {project?.name ??
                  (screen === "home"
                    ? "Good afternoon, Alex"
                    : screen === "mine"
                      ? "Your work, at a glance"
                      : "Every task, one place")}
              </h1>
              <p>
                {project?.description ??
                  (screen === "home"
                    ? "Thursday, October 15 · A little clarity for the work ahead."
                    : "Keep the next step clear. Changes stay in this page.")}
              </p>
            </div>
            <Button
              render={<button type="button" ref={newButton} />}
              tapScale={1}
              leadingIcon={<Icon name="plus" size="sm" />}
              onClick={() => open()}
            >
              New task
            </Button>
          </div>
          <div className="pw-status" role="status">
            {notice}
            {archived && (
              <button
                type="button"
                onClick={() => {
                  setTasks((ts) => [...ts, archived]);
                  announce(`${archived.title} restored.`);
                  setArchived(null);
                }}
              >
                Undo archive
              </button>
            )}
          </div>
          {screen === "home" ? (
            <>
              <div className="pw-stats">
                {[
                  {
                    label: "Active projects",
                    value: PROJECTS.length,
                    note: "Across your workspace",
                    icon: "folder" as const,
                    onClick: () =>
                      projectSection.current?.scrollIntoView({
                        block: "start",
                      }),
                  },
                  {
                    label: "Open tasks",
                    value: tasks.length - completed,
                    note: `${mine.length} assigned to you`,
                    icon: "circle-dashed" as const,
                    onClick: () => {
                      navigate("all");
                      setStatus("open");
                    },
                  },
                  {
                    label: "Completed",
                    value: completed,
                    note: "Good work adds up",
                    icon: "checks" as const,
                    onClick: () => {
                      navigate("all");
                      setStatus("done");
                    },
                  },
                  {
                    label: "Overdue",
                    value: overdue.length,
                    note: "Need a little attention",
                    icon: "clock-history" as const,
                    onClick: () => {
                      navigate("all");
                      setStatus("overdue");
                      setSort("due");
                    },
                  },
                ].map((s) => (
                  <button type="button" key={s.label} onClick={s.onClick}>
                    <span>
                      <Icon name={s.icon} size="sm" />
                      {s.label}
                    </span>
                    <strong>{s.value}</strong>
                    <small>{s.note}</small>
                  </button>
                ))}
              </div>
              <div className="pw-dashboard">
                <div>
                  <section className="pw-panel">
                    <header>
                      <h2>
                        My tasks <span>{mine.length}</span>
                      </h2>
                      <button type="button" onClick={() => navigate("mine")}>
                        View all <Icon name="arrow-up-right" size="sm" />
                      </button>
                    </header>
                    {mine.length ? (
                      mine.slice(0, 5).map(row)
                    ) : (
                      <AgentWorkspaceState
                        title="All caught up"
                        description="Your assigned tasks are complete."
                      />
                    )}
                  </section>
                  <section className="pw-project-section" ref={projectSection}>
                    <div className="pw-section-heading">
                      <h2>Project progress</h2>
                      <span>{PROJECTS.length} projects in motion</span>
                    </div>
                    <div className="pw-project-grid">
                      {PROJECTS.map((p) => {
                        const own = tasks.filter((t) => t.projectId === p.id);
                        return (
                          <ProjectSummary
                            key={p.id}
                            title={p.name}
                            description={p.description}
                            total={own.length}
                            completed={
                              own.filter((t) => t.status === "done").length
                            }
                            due={dateLabel(p.due)}
                            status={p.status}
                            people={PEOPLE}
                            onOpen={() => navigate(p.id)}
                          />
                        );
                      })}
                    </div>
                  </section>
                </div>
                <div>
                  <section className="pw-panel">
                    <header>
                      <h2>Coming up next</h2>
                      <Icon name="calendar" size="sm" />
                    </header>
                    <div className="pw-deadlines">
                      {tasks
                        .filter((t) => t.status !== "done" && t.due)
                        .sort((a, b) => a.due.localeCompare(b.due))
                        .slice(0, 5)
                        .map((t) => (
                          <button
                            type="button"
                            key={t.id}
                            onClick={() => open(t)}
                          >
                            <span
                              className={`pw-date ${t.due < SAMPLE_TODAY ? "pw-late" : ""}`}
                            >
                              {dateLabel(t.due)}
                            </span>
                            <strong>{t.title}</strong>
                            <span>
                              {PROJECTS.find((p) => p.id === t.projectId)?.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  </section>
                  <section className="pw-panel pw-activity">
                    <header>
                      <h2>Recent activity</h2>
                      <Icon name="clock-history" size="sm" />
                    </header>
                    <ol>
                      {activity.map((a, i) => (
                        <li key={i}>
                          <span className="pw-activity-dot" />
                          <div>
                            {a}
                            <small>
                              {i === 0
                                ? "Latest update"
                                : "Earlier in this session"}
                            </small>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="pw-view-bar">
                <div role="group" aria-label="Task view">
                  {(["list", "board", "calendar", "timeline"] as const).map(
                    (v) => (
                      <button
                        type="button"
                        key={v}
                        aria-pressed={view === v}
                        onClick={() => setView(v)}
                      >
                        <Icon
                          name={
                            v === "list"
                              ? "list"
                              : v === "board"
                                ? "columns"
                                : v === "calendar"
                                  ? "calendar"
                                  : "chart-bar"
                          }
                          size="sm"
                        />
                        {v === "list"
                          ? "List"
                          : v === "board"
                            ? "Board"
                            : v === "calendar"
                              ? "Calendar"
                              : "Timeline"}
                      </button>
                    ),
                  )}
                </div>
                <span>
                  {scoped.length} tasks
                  {project && (
                    <>
                      {" "}
                      ·{" "}
                      <Tag
                        color={
                          project.status === "At risk"
                            ? "orange"
                            : project.status === "On track"
                              ? "mint"
                              : "default"
                        }
                      >
                        {project.status}
                      </Tag>
                    </>
                  )}
                </span>
              </div>
              <div className="pw-filters">
                <label className="pw-search">
                  <Icon name="search" size="sm" />
                  <input
                    aria-label="Search tasks"
                    placeholder="Search tasks…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label>
                  Status
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="open">Open tasks</option>
                    <option value="overdue">Overdue</option>
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Priority
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="all">All priorities</option>
                    {["High", "Medium", "Low"].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Sort
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="manual">Manual</option>
                    <option value="due">Due date</option>
                    <option value="priority">Priority</option>
                  </select>
                </label>
              </div>
              {!visible.length ? (
                <div className="pw-empty">
                  <AgentWorkspaceState
                    title="No tasks to show"
                    description={
                      query || status !== "all" || priority !== "all"
                        ? "Try a different search or clear your filters."
                        : "Add a task to give this project its next step."
                    }
                  />
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={
                      query || status !== "all" || priority !== "all"
                        ? clear
                        : () => open()
                    }
                  >
                    {query || status !== "all" || priority !== "all"
                      ? "Clear filters"
                      : "Create a task"}
                  </Button>
                </div>
              ) : view === "calendar" ? (
                <TaskCalendar
                  tasks={visible}
                  projects={
                    project
                      ? scheduleProjects.filter((p) => p.id === project.id)
                      : scheduleProjects
                  }
                  people={PEOPLE}
                  today={SAMPLE_TODAY}
                  date={calendarDate}
                  mode={calendarMode}
                  onDateChange={setCalendarDate}
                  onModeChange={setCalendarMode}
                  onOpen={(t) => open(tasks.find((item) => item.id === t.id))}
                  onCreate={(date) => open(undefined, date)}
                />
              ) : view === "timeline" ? (
                <TaskTimeline
                  tasks={visible}
                  projects={scheduleProjects}
                  people={PEOPLE}
                  today={SAMPLE_TODAY}
                  date={timelineDate}
                  days={timelineDays}
                  onDateChange={setTimelineDate}
                  onDaysChange={setTimelineDays}
                  onOpen={(t) => open(tasks.find((item) => item.id === t.id))}
                />
              ) : view === "list" ? (
                <div className="pw-task-groups">
                  {COLUMNS.filter((c) =>
                    visible.some((t) => t.status === c.id),
                  ).map((c) => (
                    <section key={c.id} className="pw-panel">
                      <header>
                        <h2>
                          <span className={`pw-state-dot pw-state-${c.id}`} />
                          {c.title}
                          <span>
                            {visible.filter((t) => t.status === c.id).length}
                          </span>
                        </h2>
                      </header>
                      {visible.filter((t) => t.status === c.id).map(row)}
                    </section>
                  ))}
                </div>
              ) : (
                <KanbanBoard
                  key={screen}
                  title={project?.name ?? "Workspace tasks"}
                  cards={cards}
                  columns={COLUMNS}
                  people={PEOPLE}
                  onCardsChange={boardChange}
                  onCardOpen={(c) => open(tasks.find((t) => t.id === c.id))}
                />
              )}
            </>
          )}
          <footer className="pw-footer">
            <span>
              Sample date: Oct 15, 2026 · Local demo · Resets on reload
            </span>
            <a
              href="https://x.com/zahragr8r/status/2110262138124320955"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Zahra / Gr8r ↗
            </a>
          </footer>
        </main>
      </div>
      <Dialog.Root
        open={Boolean(draft)}
        onOpenChange={(o) => {
          if (!o) setDraft(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="pw-backdrop" />
          <Dialog.Popup
            className={`pw-drawer ${dark ? "theme-dark" : ""}`}
            initialFocus={titleInput}
            finalFocus={() =>
              returnTo.current?.isConnected
                ? returnTo.current
                : newButton.current
            }
          >
            {draft && (
              <>
                <header className="pw-drawer-top">
                  <span>
                    {PROJECTS.find((p) => p.id === draft.projectId)?.name}{" "}
                    <span className="pw-slash">/</span>{" "}
                    {tasks.some((t) => t.id === draft.id)
                      ? draft.id
                      : "New task"}
                  </span>
                  <Dialog.Close
                    render={
                      <IconButton
                        type="tertiary"
                        tapScale={1}
                        aria-label="Close task"
                        icon={<Icon name="x" />}
                      />
                    }
                  />
                </header>
                <form onSubmit={save} noValidate className="pw-task-form">
                  <div className="pw-drawer-scroll">
                    <Dialog.Title>
                      {tasks.some((t) => t.id === draft.id)
                        ? "Task details"
                        : "Create a task"}
                    </Dialog.Title>
                    <Dialog.Description>
                      Keep the owner, outcome, and next step in one place.
                    </Dialog.Description>
                    <label className="pw-title-field">
                      Task title
                      <input
                        ref={titleInput}
                        value={draft.title}
                        maxLength={160}
                        onChange={(e) => {
                          setDraft({ ...draft, title: e.target.value });
                          setError("");
                        }}
                        placeholder="What needs to happen?"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? "pw-title-error" : undefined}
                      />
                    </label>
                    {error && (
                      <p role="alert" id="pw-title-error" className="pw-error">
                        {error}
                      </p>
                    )}
                    <div className="pw-detail-grid">
                      <label>
                        Status
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              status: e.target.value as TaskStatus,
                            })
                          }
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Priority
                        <select
                          value={draft.priority}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              priority: e.target.value as TaskPriority,
                            })
                          }
                        >
                          {["Low", "Medium", "High"].map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Assignee
                        <select
                          value={draft.assigneeId}
                          onChange={(e) =>
                            setDraft({ ...draft, assigneeId: e.target.value })
                          }
                        >
                          <option value="">Unassigned</option>
                          {PEOPLE.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Start date
                        <input
                          type="date"
                          value={draft.start ?? ""}
                          aria-invalid={Boolean(dateError)}
                          aria-describedby={
                            dateError ? "pw-date-error" : undefined
                          }
                          onChange={(e) => {
                            setDateError("");
                            setDraft({ ...draft, start: e.target.value });
                          }}
                        />
                      </label>
                      <label>
                        Due date
                        <input
                          type="date"
                          value={draft.due}
                          ref={dueInput}
                          aria-invalid={Boolean(dateError)}
                          aria-describedby={
                            dateError ? "pw-date-error" : undefined
                          }
                          onChange={(e) => {
                            setDateError("");
                            setDraft({ ...draft, due: e.target.value });
                          }}
                        />
                      </label>
                      <label>
                        Project
                        <select
                          value={draft.projectId}
                          onChange={(e) =>
                            setDraft({ ...draft, projectId: e.target.value })
                          }
                        >
                          {PROJECTS.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {dateError && (
                      <p id="pw-date-error" role="alert" className="pw-error">
                        {dateError}
                      </p>
                    )}
                    <label className="pw-description">
                      Description
                      <textarea
                        rows={4}
                        value={draft.description}
                        maxLength={4000}
                        onChange={(e) =>
                          setDraft({ ...draft, description: e.target.value })
                        }
                        placeholder="Add the context your team needs…"
                      />
                    </label>
                    <fieldset className="pw-subtasks">
                      <legend>
                        Subtasks{" "}
                        <span>
                          {draft.subtasks.filter((s) => s.done).length}/
                          {draft.subtasks.length}
                        </span>
                      </legend>
                      {draft.subtasks.map((s) => (
                        <label key={s.id}>
                          <input
                            type="checkbox"
                            checked={s.done}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                subtasks: draft.subtasks.map((item) =>
                                  item.id === s.id
                                    ? { ...item, done: e.target.checked }
                                    : item,
                                ),
                              })
                            }
                          />
                          <span>{s.title}</span>
                        </label>
                      ))}
                      <div className="pw-add-subtask">
                        <input
                          aria-label="New subtask"
                          placeholder="Add a small next step…"
                          value={subtask}
                          maxLength={120}
                          onChange={(e) => setSubtask(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSubtask();
                            }
                          }}
                        />
                        <Button
                          type="secondary"
                          tapScale={1}
                          disabled={!subtask.trim()}
                          onClick={addSubtask}
                        >
                          Add
                        </Button>
                      </div>
                    </fieldset>
                    <p className="pw-local-note">
                      Changes are applied when you save. Closing discards this
                      edit.
                    </p>
                  </div>
                  <footer className="pw-drawer-actions">
                    {tasks.some((t) => t.id === draft.id) && (
                      <Button
                        type="tertiary"
                        tapScale={1}
                        leadingIcon={<Icon name="trash" size="sm" />}
                        onClick={archive}
                      >
                        Archive
                      </Button>
                    )}
                    <span />
                    <Dialog.Close
                      render={<Button type="secondary" tapScale={1} />}
                    >
                      Cancel
                    </Dialog.Close>
                    <Button tapScale={1} render={<button type="submit" />}>
                      {tasks.some((t) => t.id === draft.id)
                        ? "Save changes"
                        : "Create task"}
                    </Button>
                  </footer>
                </form>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

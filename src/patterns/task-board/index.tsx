import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { KanbanBoard, type KanbanCard } from "@/components/kanban";
import { TaskRow, TASK_STATUS } from "@/components/task-row";
import {
  AgentWorkspaceState,
  AgentWorkspaceNav,
} from "@/components/automation";
import {
  TaskDetailPanel,
  TaskProperties,
  TaskSubtasks,
  applyTaskBoard,
  createTask,
  hasDependencyCycle,
  type TaskDetails,
} from "@/components/task-editor";
import { CAMPAIGN_TASKS, TASK_PEOPLE } from "./data";
import "./task-board.css";
type LocalFile = { id: string; name: string; size: number; url: string };
function Editor({
  task,
  tasks,
  onChange,
  onClose,
  files,
  onFiles,
  comment,
  setComment,
}: {
  task: TaskDetails;
  tasks: TaskDetails[];
  onChange: (patch: Partial<TaskDetails>, message: string) => void;
  onClose: () => void;
  files: LocalFile[];
  onFiles: (files: File[]) => string;
  comment: string;
  setComment: (value: string) => void;
}) {
  const [title, setTitle] = useState(task.title),
    [description, setDescription] = useState(task.description),
    [error, setError] = useState(""),
    [tab, setTab] = useState("comments"),
    [fileNotice, setFileNotice] = useState("");
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task.title, task.description]);
  const change = (patch: Partial<TaskDetails>) => {
    if (
      patch.blockedBy &&
      hasDependencyCycle(tasks, task.id, patch.blockedBy)
    ) {
      setError("This dependency would create a cycle. Choose another task.");
      return;
    }
    setError("");
    const labels: Record<string, string> = {
      assigneeId: "assignee",
      blockedBy: "dependency",
      start: "start date",
      due: "due date",
    };
    onChange(
      patch,
      `Updated ${Object.keys(patch)
        .map((key) => labels[key] ?? key)
        .join(" and ")}.`,
    );
  };
  return (
    <TaskDetailPanel
      taskId={task.id}
      title={task.title}
      complete={task.status === "done"}
      onComplete={() =>
        onChange(
          { status: task.status === "done" ? "todo" : "done" },
          task.status === "done" ? "Task reopened." : "Task completed.",
        )
      }
      onClose={onClose}
    >
      <label className="tb-edit-title">
        <span className="sr-only">Task title</span>
        <input
          aria-label="Task title"
          value={title}
          maxLength={160}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (!title.trim()) {
              setError("A task title is required.");
              return;
            }
            if (title.trim() !== task.title)
              onChange({ title: title.trim() }, "Renamed task.");
            setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </label>
      {error && (
        <p role="alert" className="te-error">
          {error}
        </p>
      )}
      <TaskProperties
        task={task}
        people={TASK_PEOPLE}
        dependencies={tasks}
        onChange={change}
      />
      <section className="te-section">
        <h3>
          <label htmlFor={`description-${task.id}`}>Description</label>
        </h3>
        <textarea
          id={`description-${task.id}`}
          rows={3}
          maxLength={4000}
          placeholder="Add a description…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            if (description !== task.description)
              onChange({ description }, "Updated description.");
          }}
        />
      </section>
      <TaskSubtasks
        items={task.subtasks}
        onChange={(subtasks) => onChange({ subtasks }, "Updated subtasks.")}
      />
      <section className="te-section">
        <h3>
          Attachments <span>{files.length}</span>
        </h3>
        <label
          className="tb-attach"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setFileNotice(onFiles(Array.from(e.dataTransfer.files)));
          }}
        >
          <Icon name="paperclip" size="sm" />
          Choose or drop files
          <input
            type="file"
            multiple
            aria-label="Attach local files"
            onChange={(e) => {
              setFileNotice(onFiles(Array.from(e.target.files ?? [])));
              e.target.value = "";
            }}
          />
        </label>
        {fileNotice && (
          <p role="status" className="te-hint">
            {fileNotice}
          </p>
        )}
        <p className="te-hint">
          Local files only · up to 10 MB each · 10 files per task
        </p>
        <ul className="tb-files">
          {files.map((f) => (
            <li key={f.id}>
              <Icon name="paperclip" size="sm" />
              <a href={f.url} download={f.name}>
                {f.name}
              </a>
              <small>{Math.max(1, Math.round(f.size / 1024))} KB</small>
            </li>
          ))}
        </ul>
      </section>
      <section className="te-section">
        <div className="tb-tabs" role="group" aria-label="Task discussion">
          {["comments", "activity"].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
            >
              {t === "comments"
                ? `Comments ${task.comments.length}`
                : `Activity ${task.activity.length}`}
            </button>
          ))}
        </div>
        {tab === "comments" ? (
          <>
            <div className="tb-comments">
              {task.comments.length ? (
                task.comments.map((c) => (
                  <article key={c.id}>
                    <Avatar name="Alex Morgan" color="purple" size="xs" />
                    <div>
                      <strong>
                        You{" "}
                        <time dateTime={c.at}>
                          {new Date(c.at).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </strong>
                      <p>{c.text}</p>
                    </div>
                  </article>
                ))
              ) : (
                <AgentWorkspaceState
                  title="No comments yet"
                  description="Start the conversation about this task."
                />
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (comment.trim()) {
                  onChange(
                    {
                      comments: [
                        ...task.comments,
                        {
                          id: crypto.randomUUID(),
                          text: comment.trim(),
                          at: new Date().toISOString(),
                        },
                      ],
                    },
                    "Added a comment.",
                  );
                  setComment("");
                }
              }}
            >
              <textarea
                aria-label="Leave a comment"
                placeholder="Leave a comment…"
                maxLength={2000}
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="tb-post">
                <span>Only visible in this local demo.</span>
                <Button
                  size="sm"
                  tapScale={1}
                  disabled={!comment.trim()}
                  onClick={(e) => e.currentTarget.form?.requestSubmit()}
                >
                  Post comment
                </Button>
              </div>
            </form>
          </>
        ) : (
          <ol className="tb-activity">
            {task.activity.map((line, i) => (
              <li key={`${i}-${line}`}>
                <Icon name="clock-history" size="sm" />
                {line}
              </li>
            ))}
          </ol>
        )}
      </section>
    </TaskDetailPanel>
  );
}
export function TaskBoardPage() {
  const [tasks, setTasks] = useState(CAMPAIGN_TASKS),
    [selected, setSelected] = useState<string | null>("MKT-109"),
    [dark, setDark] = useThemeMode(true),
    [view, setView] = useState("board"),
    [query, setQuery] = useState(""),
    [priority, setPriority] = useState("all"),
    [notice, setNotice] = useState(""),
    [undo, setUndo] = useState<TaskDetails[] | null>(null),
    [drafts, setDrafts] = useState<Record<string, string>>({}),
    [files, setFiles] = useState<Record<string, LocalFile[]>>({}),
    [favorite, setFavorite] = useState(false);
  const returnTo = useRef<HTMLElement | null>(null),
    root = useRef<HTMLDivElement>(null),
    newButton = useRef<HTMLDivElement>(null),
    urls = useRef<string[]>([]);
  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);
  const task = tasks.find((t) => t.id === selected),
    shown = tasks.filter(
      (t) =>
        (priority === "all" || t.priority === priority) &&
        `${t.title} ${t.id} ${t.labels.join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
  const commit = (next: TaskDetails[], message: string) => {
    setUndo(tasks);
    setTasks(next);
    setNotice(message);
  };
  const open = (id: string) => {
    returnTo.current = document.activeElement as HTMLElement;
    setSelected(id);
  };
  const close = () => {
    setSelected(null);
    requestAnimationFrame(() => {
      const target = returnTo.current;
      if (target?.isConnected && target.getClientRects().length) target.focus();
      else newButton.current?.querySelector("button")?.focus();
    });
  };
  const clear = () => {
    setQuery("");
    setPriority("all");
  };
  const cards: KanbanCard[] = shown.map((t) => ({
    id: t.id,
    title: t.title,
    columnId: t.status,
    assigneeId: t.assigneeId || undefined,
    label: t.labels.length
      ? {
          name: t.labels.join(" · "),
          color:
            t.labels[0] === "Design"
              ? "purple"
              : t.labels[0] === "Growth"
                ? "orange"
                : "pink",
        }
      : undefined,
    date: t.due
      ? new Date(t.due + "T00:00:00Z").toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })
      : undefined,
    checklist: t.subtasks.length
      ? {
          done: t.subtasks.filter((s) => s.done).length,
          total: t.subtasks.length,
        }
      : undefined,
  }));
  const exportData = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            tasks,
            attachments: Object.fromEntries(
              Object.entries(files).map(([id, list]) => [
                id,
                list.map(({ name, size }) => ({ name, size })),
              ]),
            ),
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-task-board.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      "Exported tasks and attachment metadata. Local file contents are not included.",
    );
  };
  return (
    <div
      ref={root}
      className={`task-board ${dark ? "theme-dark" : ""}`}
      data-details={Boolean(task) || undefined}
    >
      <aside className="tb-nav">
        <AgentWorkspaceNav
          brand={
            <>
              <Icon name="columns" />
              <strong>Oreo Studio</strong>
            </>
          }
          groups={[
            {
              label: "WORKSPACE",
              items: [
                { label: "Projects", href: "/project-board", icon: "folder" },
                {
                  label: "My tasks",
                  href: "/grouped-tasks",
                  icon: "list-checks",
                },
                {
                  label: "Activity",
                  href: "/project-feed",
                  icon: "clock-history",
                },
              ],
            },
            {
              label: "PROJECTS",
              items: [
                {
                  label: "Marketing Campaign",
                  href: "/task-board",
                  icon: "chart-bar",
                  active: true,
                },
                {
                  label: "Design system",
                  href: "/project-workspace",
                  icon: "paintbrush",
                },
              ],
            },
          ]}
          footer={
            <>
              <a href="/task-properties">
                Explore components <Icon name="arrow-up-right" size="sm" />
              </a>
              <div className="tb-user">
                <Avatar name="Alex Morgan" color="purple" size="sm" />
                <span>
                  Alex Morgan<small>Local sample workspace</small>
                </span>
              </div>
            </>
          }
        />
      </aside>
      <div className="tb-workspace">
        <header className="tb-top">
          <span>
            Oreo Studio <b>/</b> Projects <b>/</b> Marketing Campaign
          </span>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark((v) => !v)}
          />
        </header>
        <div className="tb-split">
          <main className="tb-main">
            <div className="tb-title">
              <div>
                <span className="tb-mark">
                  <Icon name="chart-bar" />
                </span>
                <h1>Marketing Campaign</h1>
                <IconButton
                  type="tertiary"
                  tapScale={1}
                  aria-label={favorite ? "Remove favorite" : "Favorite project"}
                  aria-pressed={favorite}
                  icon={<Icon name="star" />}
                  onClick={() => setFavorite((v) => !v)}
                />
              </div>
              <span className="tb-stage">● Planning</span>
            </div>
            <div className="tb-view">
              <div className="tb-tabs" role="group" aria-label="Project view">
                {["board", "list"].map((v) => (
                  <button
                    key={v}
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                  >
                    <Icon name={v === "board" ? "columns" : "list"} size="sm" />
                    {v === "board" ? "Board" : "List"}
                  </button>
                ))}
              </div>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={exportData}
              >
                Export
              </Button>
              <div ref={newButton}>
                <Button
                  size="sm"
                  tapScale={1}
                  leadingIcon={<Icon name="plus" size="sm" />}
                  onClick={() => {
                    const t = createTask(
                      `MKT-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
                      "Untitled task",
                    );
                    commit(
                      [...tasks, t],
                      "Task created. Edit its title in the detail panel.",
                    );
                    clear();
                    open(t.id);
                  }}
                >
                  New task
                </Button>
              </div>
            </div>
            <div className="tb-tools">
              <label>
                <Icon name="search" size="sm" />
                <input
                  aria-label="Search tasks"
                  placeholder="Search tasks…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <select
                aria-label="Filter priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="all">All priorities</option>
                {["High", "Medium", "Low"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <span>
                {shown.length} of {tasks.length}
              </span>
            </div>
            <div className="tb-notice" role="status">
              {notice || "Changes stay in this tab. Reload resets the sample."}
              {undo && (
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    setTasks(undo);
                    setUndo(null);
                    setNotice("Last task change undone.");
                  }}
                >
                  Undo
                </Button>
              )}
            </div>
            {!shown.length ? (
              <AgentWorkspaceState
                title="No matching tasks"
                description="Try another title, label or priority."
                actionLabel="Clear filters"
                onAction={clear}
              />
            ) : view === "board" ? (
              <KanbanBoard
                selectedCardId={selected ?? undefined}
                title="Campaign tasks"
                cards={cards}
                columns={Object.entries(TASK_STATUS).map(([id, title]) => ({
                  id,
                  title,
                }))}
                people={TASK_PEOPLE}
                onCardOpen={(c) => open(c.id)}
                onCardsChange={(next) =>
                  commit(applyTaskBoard(tasks, next), "Board updated.")
                }
              />
            ) : (
              <div className="tb-list">
                {shown.map((t) => (
                  <TaskRow
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    status={t.status}
                    priority={t.priority}
                    due={t.due || undefined}
                    person={TASK_PEOPLE.find((p) => p.id === t.assigneeId)}
                    onOpen={() => open(t.id)}
                    onComplete={(done) =>
                      commit(
                        tasks.map((x) =>
                          x.id === t.id
                            ? { ...x, status: done ? "done" : "todo" }
                            : x,
                        ),
                        "Task status updated.",
                      )
                    }
                  />
                ))}
              </div>
            )}
            <p className="tb-foot">
              Drag to move · Open a card to edit · Esc closes task details
            </p>
          </main>
          {task && (
            <Editor
              key={task.id}
              task={task}
              tasks={tasks}
              onClose={close}
              onChange={(patch, message) =>
                commit(
                  tasks.map((t) =>
                    t.id === task.id
                      ? { ...t, ...patch, activity: [message, ...t.activity] }
                      : t,
                  ),
                  message,
                )
              }
              comment={drafts[task.id] ?? ""}
              setComment={(text) =>
                setDrafts((old) => ({ ...old, [task.id]: text }))
              }
              files={files[task.id] ?? []}
              onFiles={(chosen) => {
                if (!chosen.length) return "";
                if (
                  chosen.some((f) => f.size > 10 * 1024 * 1024) ||
                  (files[task.id]?.length ?? 0) + chosen.length > 10
                ) {
                  return "Files were not added. Use up to 10 files per task, 10 MB each.";
                }
                const added = chosen.map((f) => {
                  const url = URL.createObjectURL(f);
                  urls.current.push(url);
                  return {
                    id: crypto.randomUUID(),
                    name: f.name,
                    size: f.size,
                    url,
                  };
                });
                setFiles((old) => ({
                  ...old,
                  [task.id]: [...(old[task.id] ?? []), ...added],
                }));
                return "Files attached locally. Select a filename to download it.";
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

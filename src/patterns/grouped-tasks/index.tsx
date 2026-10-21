import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Tabs } from "@base-ui-components/react/tabs";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { WorkspaceRail } from "@/components/review-workspace";
import { AgentWorkspaceState } from "@/components/automation";
import { KanbanBoard, type KanbanCard } from "@/components/kanban";
import {
  TASK_STATUS,
  type TaskStatus,
  type TaskPriority,
} from "@/components/task-row";
import {
  GroupedTaskList,
  TASK_STAGES,
  filterTasks,
  reconcileTaskCards,
  type GroupedTask,
  type TaskFilters,
} from "@/components/grouped-tasks";
import { MEMBERS, LISTS, SAMPLE_TASKS } from "./data";
import "./workspace.css";
const initialFilters: TaskFilters = {
  query: "",
  priority: "all",
  list: "all",
  scope: "all",
  sort: "manual",
};
export function GroupedTasksPage() {
  const root = useRef<HTMLDivElement>(null),
    returnTo = useRef<HTMLElement | null>(null),
    fallback = useRef<HTMLHeadingElement>(null);
  const [tasks, setTasks] = useState(SAMPLE_TASKS),
    [filters, setFilters] = useState(initialFilters),
    [tab, setTab] = useState("list"),
    [dark, setDark] = useThemeMode(false),
    [collapsed, setCollapsed] = useState<TaskStatus[]>([]),
    [showEmpty, setShowEmpty] = useState(false);
  const [draft, setDraft] = useState<GroupedTask | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [archived, setArchived] = useState<GroupedTask | null>(null),
    [boardVersion, setBoardVersion] = useState(0);
  const visible = filterTasks(
    tasks,
    tab === "board" ? { ...filters, sort: "manual" } : filters,
    "alex",
  );
  const field = (key: keyof TaskFilters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));
  const open = (task?: GroupedTask, status: TaskStatus = "backlog") => {
    returnTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setError("");
    setDraft(
      task
        ? { ...task, tags: [...task.tags], assigneeIds: [...task.assigneeIds] }
        : {
            id: `ORE-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
            title: "",
            status,
            priority: "Medium",
            list: filters.list === "all" ? "UI Design" : filters.list,
            tags: [],
            due: "",
            assigneeIds: filters.scope === "mine" ? ["alex"] : [],
          },
    );
  };
  const clear = () => setFilters(initialFilters);
  const save = () => {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Give this task a name before saving.");
      return;
    }
    const clean = {
      ...draft,
      title: draft.title.trim(),
      tags: [...new Set(draft.tags.map((t) => t.trim()).filter(Boolean))],
    };
    setTasks((prev) =>
      prev.some((t) => t.id === clean.id)
        ? prev.map((t) => (t.id === clean.id ? clean : t))
        : [...prev, clean],
    );
    const matches = filterTasks([clean], filters, "alex").length > 0;
    setNotice(
      `${clean.title} saved${matches ? "." : ". Hidden by the current filters."}`,
    );
    setDraft(null);
  };
  const updateBoard = (cards: KanbanCard[]) => {
    setTasks((prev) => reconcileTaskCards(prev, cards));
    setNotice("Board updated. List and board share the same tasks.");
  };
  return (
    <div ref={root} className={`gt-workspace ${dark ? "theme-dark" : ""}`}>
      <WorkspaceRail
        items={[
          { id: "all", label: "All tasks", icon: "list-checks" },
          { id: "mine", label: "Assigned to me", icon: "users" },
          { id: "done", label: "Completed tasks", icon: "check" },
        ]}
        activeId={filters.scope}
        onSelect={(scope) => field("scope", scope)}
        brand={
          <a href="/task-status-group" aria-label="Oreo UI components">
            <Icon name="circle-dashed" size="lg" />
          </a>
        }
        footer={
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        }
      />
      <main className="gt-main">
        <header className="gt-topbar">
          <div>
            <a href="/task-status-group">Tasks</a>
            <span>/</span>
            <span>
              {filters.scope === "mine"
                ? "Your tasks"
                : filters.scope === "done"
                  ? "Completed"
                  : "Workspace"}
            </span>
            <span>/</span>
            <strong>Product sprints</strong>
          </div>
          <span className="gt-local">Local demo</span>
        </header>
        <section className="gt-intro">
          <div>
            <p>OREO STUDIO / PRODUCT TEAM</p>
            <h1 ref={fallback} tabIndex={-1}>
              Product sprints
            </h1>
            <p>A little structure. More room to make progress.</p>
          </div>
          <AvatarGroup size="sm" max={4}>
            {MEMBERS.map((p) => (
              <Avatar key={p.id} name={p.name} color={p.color} size="sm" />
            ))}
          </AvatarGroup>
        </section>
        <Tabs.Root value={tab} onValueChange={(value) => setTab(String(value))}>
          <div className="gt-toolbar">
            <Tabs.List aria-label="Task view" className="gt-tabs">
              <Tabs.Tab value="list">
                <Icon name="list" size="sm" />
                List
              </Tabs.Tab>
              <Tabs.Tab value="board">
                <Icon name="columns" size="sm" />
                Kanban
              </Tabs.Tab>
            </Tabs.List>
            <div className="gt-toolbar-actions">
              <span className="gt-group-label">Grouped by status</span>
              <Button
                size="sm"
                tapScale={1}
                leadingIcon={<Icon name="plus" size="sm" />}
                onClick={() =>
                  open(undefined, filters.scope === "done" ? "done" : "backlog")
                }
              >
                New task
              </Button>
            </div>
          </div>
          <div className="gt-filters">
            <label className="gt-search">
              <Icon name="search" size="sm" />
              <input
                aria-label="Search tasks"
                placeholder="Search tasks…"
                value={filters.query}
                onChange={(e) => field("query", e.target.value)}
              />
            </label>
            <label>
              <span className="sr-only">Priority filter</span>
              <select
                aria-label="Priority filter"
                value={filters.priority}
                onChange={(e) => field("priority", e.target.value)}
              >
                <option value="all">All priorities</option>
                {["High", "Medium", "Low"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
                <option value="unset">Not set</option>
              </select>
            </label>
            <label>
              <span className="sr-only">List filter</span>
              <select
                aria-label="List filter"
                value={filters.list}
                onChange={(e) => field("list", e.target.value)}
              >
                <option value="all">All lists</option>
                {LISTS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
            {tab === "list" && (
              <>
                <label>
                  <span className="sr-only">Sort tasks</span>
                  <select
                    aria-label="Sort tasks"
                    value={filters.sort}
                    onChange={(e) => field("sort", e.target.value)}
                  >
                    <option value="manual">Manual order</option>
                    <option value="due">Due date</option>
                    <option value="priority">Priority</option>
                  </select>
                </label>
                <label className="gt-empty-toggle">
                  <input
                    type="checkbox"
                    checked={showEmpty}
                    onChange={(e) => setShowEmpty(e.target.checked)}
                  />
                  Empty groups
                </label>
              </>
            )}
            <span className="gt-result-count">
              {visible.length} of {tasks.length} tasks
            </span>
          </div>
          <div className="gt-notice" role="status">
            {notice}
          </div>
          <Tabs.Panel value="list" className="gt-content">
            {visible.length || showEmpty ? (
              <GroupedTaskList
                tasks={visible}
                people={MEMBERS}
                collapsed={collapsed}
                onCollapsedChange={setCollapsed}
                onTaskOpen={(task) => open(task)}
                onAdd={(status) => open(undefined, status)}
                showEmpty={showEmpty}
              />
            ) : (
              <AgentWorkspaceState
                title={
                  tasks.length
                    ? "No matching tasks"
                    : "Your next sprint starts here"
                }
                description={
                  tasks.length
                    ? "Try another search, list or priority to find your work."
                    : "Create a task and give it a place in the sprint."
                }
                actionLabel={tasks.length ? "Clear filters" : "New task"}
                onAction={tasks.length ? clear : () => open()}
              />
            )}
          </Tabs.Panel>
          <Tabs.Panel value="board" className="gt-content">
            {visible.length ? (
              <KanbanBoard
                key={boardVersion}
                title="Product sprints"
                columns={TASK_STAGES.map((id) => ({
                  id,
                  title: TASK_STATUS[id],
                }))}
                people={MEMBERS}
                cards={visible.map((t) => ({
                  id: t.id,
                  title: t.title,
                  columnId: t.status,
                  assigneeId: t.assigneeIds[0],
                  label: t.priority
                    ? {
                        name: t.priority,
                        color: t.priority === "High" ? "orange" : "blue",
                      }
                    : undefined,
                  date: t.due || undefined,
                }))}
                onCardOpen={(card) => open(tasks.find((t) => t.id === card.id))}
                onCardsChange={updateBoard}
              />
            ) : (
              <AgentWorkspaceState
                title="No matching tasks"
                description="Clear the filters or create a task to start your board."
                actionLabel={tasks.length ? "Clear filters" : "New task"}
                onAction={tasks.length ? clear : () => open()}
              />
            )}
            <p className="gt-board-note">
              Cards show the first assignee. Open a task to edit everyone
              assigned.
            </p>
          </Tabs.Panel>
        </Tabs.Root>
        <footer className="gt-footer">
          <span>Local sample workspace · Reload restores tasks</span>
          <div>
            {archived && (
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  setTasks((prev) => [...prev, archived]);
                  setNotice(`${archived.title} restored.`);
                  setArchived(null);
                }}
              >
                Undo archive
              </Button>
            )}
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              onClick={() => {
                setTasks(SAMPLE_TASKS);
                clear();
                setCollapsed([]);
                setShowEmpty(false);
                setArchived(null);
                setBoardVersion((v) => v + 1);
                setNotice("Sample workspace restored.");
              }}
            >
              Reset demo
            </Button>
            <a
              href="https://x.com/startupvisuals/status/2110803178811990300"
              target="_blank"
              rel="noreferrer"
            >
              Reference ↗
            </a>
          </div>
        </footer>
      </main>
      <Dialog.Root
        open={draft !== null}
        onOpenChange={(value) => {
          if (!value) setDraft(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="gt-backdrop" />
          <Dialog.Popup
            className="gt-dialog"
            finalFocus={() =>
              returnTo.current?.isConnected
                ? returnTo.current
                : fallback.current
            }
          >
            <Dialog.Title>
              {tasks.some((t) => t.id === draft?.id) ? "Edit task" : "New task"}
            </Dialog.Title>
            <Dialog.Description>
              Changes stay in this local sample workspace.
            </Dialog.Description>
            {draft && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  save();
                }}
                noValidate
              >
                <label>
                  Task name
                  <input
                    autoFocus
                    value={draft.title}
                    onChange={(e) =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                    aria-invalid={!!error}
                    aria-describedby={error ? "gt-task-error" : undefined}
                  />
                </label>
                <div className="gt-form-grid">
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
                      {TASK_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {TASK_STATUS[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Priority
                    <select
                      value={draft.priority ?? "unset"}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          priority:
                            e.target.value === "unset"
                              ? undefined
                              : (e.target.value as TaskPriority),
                        })
                      }
                    >
                      <option value="unset">Not set</option>
                      {["High", "Medium", "Low"].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    List
                    <select
                      value={draft.list}
                      onChange={(e) =>
                        setDraft({ ...draft, list: e.target.value })
                      }
                    >
                      {LISTS.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Due date
                    <input
                      type="date"
                      value={draft.due}
                      onChange={(e) =>
                        setDraft({ ...draft, due: e.target.value })
                      }
                    />
                  </label>
                </div>
                <label>
                  Tags (comma separated)
                  <input
                    value={draft.tags.join(",")}
                    onChange={(e) =>
                      setDraft({ ...draft, tags: e.target.value.split(",") })
                    }
                  />
                </label>
                <fieldset>
                  <legend>Assignees</legend>
                  <div className="gt-assignees">
                    {MEMBERS.map((p) => (
                      <label key={p.id}>
                        <input
                          type="checkbox"
                          checked={draft.assigneeIds.includes(p.id)}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              assigneeIds: e.target.checked
                                ? [...draft.assigneeIds, p.id]
                                : draft.assigneeIds.filter((id) => id !== p.id),
                            })
                          }
                        />
                        <Avatar
                          name={p.name}
                          color={p.color}
                          size="xs"
                          aria-hidden
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </fieldset>
                {error && (
                  <p id="gt-task-error" role="alert" className="gt-error">
                    {error}
                  </p>
                )}
                <div className="gt-dialog-actions">
                  {tasks.some((t) => t.id === draft.id) && (
                    <Button
                      type="tertiary"
                      size="sm"
                      tapScale={1}
                      onClick={() => {
                        setArchived(tasks.find((t) => t.id === draft.id)!);
                        setTasks((prev) =>
                          prev.filter((t) => t.id !== draft.id),
                        );
                        setNotice(
                          `${draft.title} archived. Undo is available in the footer.`,
                        );
                        setDraft(null);
                      }}
                    >
                      Archive task
                    </Button>
                  )}
                  <span />
                  <Button
                    type="secondary"
                    size="sm"
                    tapScale={1}
                    onClick={() => setDraft(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    tapScale={1}
                    render={<button type="submit" />}
                  >
                    Save task
                  </Button>
                </div>
              </form>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

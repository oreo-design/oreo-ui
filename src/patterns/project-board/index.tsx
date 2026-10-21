import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import { KanbanBoard } from "@/components/kanban";
import {
  ProjectCreateCard,
  ProjectBoardOverview,
  BoardProjectSummary,
  PROJECT_STAGES,
  type BoardProject,
  type ProjectStage,
} from "@/components/project-board";
import {
  BOARD_PEOPLE,
  BOARD_PROJECTS,
  CATEGORIES,
  asKanban,
  applyBoardChanges,
} from "./data";
import "./project-board-workspace.css";
export function ProjectBoardPage() {
  const [projects, setProjects] = useState(BOARD_PROJECTS),
    [view, setView] = useState("Overview"),
    [category, setCategory] = useState("All projects"),
    [query, setQuery] = useState(""),
    [priority, setPriority] = useState("All priorities"),
    [dark, setDark] = useThemeMode(false),
    [expanded, setExpanded] = useState(true);
  const [draft, setDraft] = useState<BoardProject | null>(null),
    [mode, setMode] = useState<"edit" | "archive" | "activity" | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [archived, setArchived] = useState<BoardProject | null>(null),
    [activity, setActivity] = useState(["Workspace opened · October 15, 2026"]);
  const root = useRef<HTMLDivElement>(null),
    origin = useRef<HTMLElement | null>(null),
    createButton = useRef<HTMLButtonElement>(null),
    titleRef = useRef<HTMLInputElement>(null);
  const visible = projects.filter(
    (p) =>
      (category === "All projects" || p.category === category) &&
      (priority === "All priorities" || p.priority === priority) &&
      `${p.title} ${p.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const record = (message: string) => {
    setNotice(message);
    setActivity((list) => [message, ...list]);
  };
  const open = (id?: string, stage: ProjectStage = "todo") => {
    origin.current = document.activeElement as HTMLElement;
    const p = projects.find((p) => p.id === id);
    setDraft(
      p
        ? { ...p }
        : {
            id: `PRJ-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            title: "",
            description: "",
            stage,
            category: category === "All projects" ? "Websites" : category,
            priority: "Medium",
            due: "",
            completed: stage === "done" ? 10 : 0,
            total: 10,
            assigneeId: "navneet",
          },
    );
    setError("");
    setMode("edit");
  };
  const navigate = (next: string) => {
    setCategory(next);
    setQuery("");
    setPriority("All priorities");
  };
  const save = (event: FormEvent) => {
    event.preventDefault();
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("Give your project a name.");
      return;
    }
    if (
      !Number.isInteger(draft.total) ||
      draft.total < 1 ||
      draft.total > 1000 ||
      !Number.isInteger(draft.completed) ||
      draft.completed < 0 ||
      draft.completed > draft.total
    ) {
      setError(
        "Completed tasks must be between zero and the total. Use a total from 1 to 1,000.",
      );
      return;
    }
    if (draft.due) {
      const date = new Date(`${draft.due}T00:00:00Z`);
      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString().slice(0, 10) !== draft.due
      ) {
        setError("Choose a valid due date.");
        return;
      }
    }
    const saved = {
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      completed: draft.stage === "done" ? draft.total : draft.completed,
    };
    const existing = projects.some((p) => p.id === saved.id);
    setProjects((list) =>
      existing
        ? list.map((p) => (p.id === saved.id ? saved : p))
        : [saved, ...list],
    );
    setMode(null);
    record(`${saved.title} ${existing ? "updated" : "created"}.`);
  };
  const archive = () => {
    if (!draft) return;
    const saved = projects.find((p) => p.id === draft.id);
    if (!saved) return;
    setProjects((list) => list.filter((p) => p.id !== saved.id));
    setArchived(saved);
    setMode(null);
    record(`${saved.title} archived. Undo is available below.`);
  };
  const clear = () => {
    setQuery("");
    setPriority("All priorities");
  };
  return (
    <div
      ref={root}
      className={`project-board-workspace ${dark ? "theme-dark" : ""}`}
    >
      <div className="pbw-shell">
        <aside className="pbw-rail">
          <a href="/project-board-overview" aria-label="Oreo UI components">
            <Icon name="columns" />
          </a>
          <span className="pbw-rail-line" />
          <IconButton
            type="secondary"
            tapScale={1}
            aria-label="Show all projects"
            icon={<Icon name="columns" />}
            onClick={() => navigate("All projects")}
          />
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label="Workspace activity"
            icon={<Icon name="clock-history" />}
            onClick={() => {
              origin.current = document.activeElement as HTMLElement;
              setMode("activity");
            }}
          />
          <a
            className="pbw-rail-bottom"
            href="/project-create-card"
            aria-label="Component documentation"
          >
            <Icon name="book-open" />
          </a>
        </aside>
        <aside className="pbw-sidebar">
          <div className="pbw-workspace">
            <span className="pbw-workspace-mark">
              <Icon name="columns" />
            </span>
            <div>
              <strong>Oreo’s workspace</strong>
              <small>Product design</small>
            </div>
            <Avatar name="Navneet Singh" size="xs" />
          </div>
          <label className="pbw-search">
            <Icon name="search" size="sm" />
            <input
              aria-label="Search projects"
              placeholder="Search projects…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <p className="pbw-section-label">WORKSPACE</p>
          <button
            className="pbw-nav"
            aria-current={category === "All projects" ? "page" : undefined}
            onClick={() => navigate("All projects")}
          >
            <Icon name="columns" size="sm" />
            All projects<span>{projects.length}</span>
          </button>
          <button
            className="pbw-nav pbw-parent"
            aria-expanded={expanded}
            aria-controls="pbw-categories"
            onClick={() => setExpanded((v) => !v)}
          >
            <Icon name="folder" size="sm" />
            Project board
            <Icon name={expanded ? "chevron-up" : "chevron-down"} size="sm" />
          </button>
          {expanded && (
            <nav
              id="pbw-categories"
              className="pbw-category"
              aria-label="Project categories"
            >
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  aria-current={category === item ? "page" : undefined}
                  onClick={() => navigate(item)}
                >
                  {item}
                  <span>
                    {projects.filter((p) => p.category === item).length}
                  </span>
                </button>
              ))}
            </nav>
          )}
          <button className="pbw-add-link" onClick={() => open()}>
            <Icon name="plus" size="sm" />
            Create a project
          </button>
          <div className="pbw-sidebar-foot">
            <div className="pbw-work-hours">
              <Icon name="clock-history" size="sm" />
              <div>
                <strong>Monday – Friday</strong>
                <span>09:00 – 17:00 · Sample hours</span>
              </div>
            </div>
            <Button
              tapScale={1}
              leadingIcon={<Icon name="plus" size="sm" />}
              onClick={() => open()}
            >
              Add new project
            </Button>
            <p>Local demo · resets on reload</p>
          </div>
        </aside>
        <main className="pbw-main">
          <header className="pbw-header">
            <div>
              <Icon name="columns" size="sm" />
              <span>Project board</span>
              <span className="pbw-divider">/</span>
              <strong>{category}</strong>
            </div>
            <div>
              <Tag>{visible.length} projects</Tag>
              <IconButton
                type="secondary"
                tapScale={1}
                render={<button ref={createButton} />}
                aria-label="New project"
                icon={<Icon name="plus" />}
                onClick={() => open()}
              />
              <IconButton
                type="tertiary"
                tapScale={1}
                aria-label={dark ? "Use light theme" : "Use dark theme"}
                icon={<Icon name={dark ? "sun" : "moon"} />}
                onClick={() => setDark((v) => !v)}
              />
              <Avatar name="Navneet Singh" size="sm" />
            </div>
          </header>
          <div className="pbw-content">
            <div className="pbw-toolbar">
              <div className="pbw-views" role="group" aria-label="Project view">
                {["Overview", "Board view", "Grid view"].map((item) => (
                  <button
                    key={item}
                    aria-pressed={view === item}
                    onClick={() => setView(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <select
                aria-label="Priority filter"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>All priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <span className="pbw-snapshot">
                October 15, 2026 <Icon name="calendar" size="sm" />
              </span>
            </div>
            <div className="pbw-notice" role="status" aria-live="polite">
              {notice ||
                "A clear view of what’s next, what’s moving, and what’s done."}
            </div>
            {archived && (
              <div className="pbw-undo">
                <span>{archived.title} is archived.</span>
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    setProjects((list) => [archived, ...list]);
                    record(`${archived.title} restored.`);
                    setArchived(null);
                  }}
                >
                  Undo archive
                </Button>
              </div>
            )}
            {visible.length === 0 ? (
              <div className="pbw-empty">
                <AgentWorkspaceState
                  title={
                    query || priority !== "All priorities"
                      ? "No matching projects"
                      : "A fresh space for your next project"
                  }
                  description={
                    query || priority !== "All priorities"
                      ? "Try another name or clear your filters."
                      : "Add a project to start planning with your team."
                  }
                  actionLabel={
                    query || priority !== "All priorities"
                      ? "Clear filters"
                      : "Add a project"
                  }
                  onAction={
                    query || priority !== "All priorities"
                      ? clear
                      : () => open()
                  }
                />
              </div>
            ) : view === "Overview" ? (
              <ProjectBoardOverview
                projects={visible}
                people={BOARD_PEOPLE}
                onOpen={(id) => open(id)}
                onCreate={(stage) => open(undefined, stage)}
              />
            ) : view === "Grid view" ? (
              <div className="pbw-grid">
                <ProjectCreateCard onCreate={() => open()} />
                {visible.map((project) => (
                  <BoardProjectSummary
                    key={project.id}
                    project={project}
                    people={BOARD_PEOPLE}
                    onOpen={(id) => open(id)}
                  />
                ))}
              </div>
            ) : (
              <KanbanBoard
                title={category}
                columns={[...PROJECT_STAGES]}
                cards={visible.map(asKanban)}
                people={BOARD_PEOPLE}
                onCardOpen={(card) => open(card.id)}
                onCardsChange={(cards) => {
                  setProjects((all) =>
                    applyBoardChanges(
                      all,
                      visible.map((p) => p.id),
                      cards,
                      category,
                    ),
                  );
                  record(
                    "Board updated. Project order, stage and owner are synced across views.",
                  );
                }}
                className="pbw-kanban"
              />
            )}
            <footer className="pbw-footer">
              <span>
                {projects.filter((p) => p.stage === "done").length} of{" "}
                {projects.length} projects completed across the workspace
              </span>
              <a
                href="https://x.com/sterlynavneet/status/2110264347595583949"
                target="_blank"
                rel="noreferrer"
              >
                Inspired by Navneet <Icon name="arrow-up-right" size="sm" />
              </a>
            </footer>
          </div>
        </main>
      </div>
      <Dialog.Root
        open={mode !== null}
        onOpenChange={(value) => {
          if (!value) setMode(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="pbw-backdrop" />
          <Dialog.Popup
            className="pbw-dialog"
            initialFocus={mode === "edit" ? titleRef : undefined}
            finalFocus={() =>
              origin.current?.isConnected
                ? origin.current
                : createButton.current
            }
          >
            <form onSubmit={save}>
              <header>
                <div>
                  <Dialog.Title>
                    {mode === "activity"
                      ? "Workspace activity"
                      : mode === "archive"
                        ? "Archive this project?"
                        : projects.some((p) => p.id === draft?.id)
                          ? "Project details"
                          : "Start something good."}
                  </Dialog.Title>
                  <Dialog.Description>
                    {mode === "activity"
                      ? "Changes made in this local demo, newest first."
                      : mode === "archive"
                        ? "Remove it from all views. You can undo the latest archive."
                        : "A name, a little context, and the right people."}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      aria-label="Close dialog"
                      icon={<Icon name="x" />}
                    />
                  }
                />
              </header>
              <div className="pbw-dialog-body">
                {mode === "activity" ? (
                  <ol className="pbw-activity">
                    {activity.map((a, i) => (
                      <li key={`${activity.length - i}-${a}`}>
                        <Icon name="check" size="sm" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                ) : mode === "archive" ? (
                  <p className="pbw-archive-name">
                    {projects.find((p) => p.id === draft?.id)?.title}
                  </p>
                ) : (
                  draft && (
                    <>
                      <label>
                        Project name
                        <input
                          ref={titleRef}
                          value={draft.title}
                          onChange={(e) =>
                            setDraft({ ...draft, title: e.target.value })
                          }
                          maxLength={100}
                          placeholder="Give your idea a name"
                        />
                      </label>
                      <label>
                        Brief
                        <textarea
                          value={draft.description}
                          onChange={(e) =>
                            setDraft({ ...draft, description: e.target.value })
                          }
                          rows={3}
                          maxLength={600}
                          placeholder="What are we making, and why?"
                        />
                      </label>
                      <div className="pbw-form-grid">
                        <label>
                          Stage
                          <select
                            value={draft.stage}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                stage: e.target.value as ProjectStage,
                                completed:
                                  e.target.value === "done"
                                    ? draft.total
                                    : draft.completed,
                              })
                            }
                          >
                            {PROJECT_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.title}
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
                                priority: e.target
                                  .value as BoardProject["priority"],
                              })
                            }
                          >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                          </select>
                        </label>
                        <label>
                          Category
                          <select
                            value={draft.category}
                            onChange={(e) =>
                              setDraft({ ...draft, category: e.target.value })
                            }
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Owner
                          <select
                            value={draft.assigneeId}
                            onChange={(e) =>
                              setDraft({ ...draft, assigneeId: e.target.value })
                            }
                          >
                            <option value="">Unassigned</option>
                            {BOARD_PEOPLE.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Due date
                          <input
                            type="date"
                            min="2020-01-01"
                            max="2099-12-31"
                            value={draft.due}
                            onChange={(e) =>
                              setDraft({ ...draft, due: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          Total tasks
                          <input
                            type="number"
                            min={1}
                            max={1000}
                            step={1}
                            value={draft.total}
                            onChange={(e) => {
                              const total = Number(e.target.value);
                              setDraft({
                                ...draft,
                                total,
                                completed:
                                  draft.stage === "done"
                                    ? total
                                    : draft.completed,
                              });
                            }}
                          />
                        </label>
                        <label>
                          Completed tasks
                          <input
                            type="number"
                            min={0}
                            max={draft.total}
                            step={1}
                            value={draft.completed}
                            readOnly={draft.stage === "done"}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                completed: Number(e.target.value),
                              })
                            }
                          />
                        </label>
                      </div>
                      {draft.stage === "done" && (
                        <p className="pbw-field-note">
                          Completed projects include all tasks.
                        </p>
                      )}
                      {error && (
                        <p className="pbw-error" role="alert">
                          {error}
                        </p>
                      )}
                    </>
                  )
                )}
              </div>
              <footer>
                {mode === "activity" ? (
                  <Button
                    tapScale={1}
                    type="secondary"
                    onClick={() => setMode(null)}
                  >
                    Done
                  </Button>
                ) : mode === "archive" ? (
                  <>
                    <Button
                      tapScale={1}
                      type="secondary"
                      onClick={() => setMode("edit")}
                    >
                      Keep project
                    </Button>
                    <Button tapScale={1} danger onClick={archive}>
                      Archive project
                    </Button>
                  </>
                ) : (
                  <>
                    {projects.some((p) => p.id === draft?.id) && (
                      <Button
                        tapScale={1}
                        type="tertiary"
                        danger
                        onClick={() => setMode("archive")}
                      >
                        Archive
                      </Button>
                    )}
                    <span />
                    <Button
                      tapScale={1}
                      type="secondary"
                      onClick={() => setMode(null)}
                    >
                      Cancel
                    </Button>
                    <Button tapScale={1} render={<button type="submit" />}>
                      Save project
                    </Button>
                  </>
                )}
              </footer>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

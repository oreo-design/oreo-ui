import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Avatar } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import {
  GroupedActivityFeed,
  ACTIVITY_FILTERS,
  actionVerb,
  appendComment,
  filterActivity,
  type ActivityFilter,
  type ActivityEvent,
} from "@/components/project-activity";
import { FEED_EVENTS, FEED_NOW, PEOPLE, PROJECTS, INITIAL_READ } from "./data";
import "./workspace.css";
export function ProjectFeedPage() {
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    returnTo = useRef<HTMLElement | null>(null);
  const [dark, setDark] = useState(true),
    [nav, setNav] = useState(false),
    [events, setEvents] = useState(FEED_EVENTS),
    [read, setRead] = useState(INITIAL_READ),
    [kind, setKind] = useState<ActivityFilter>("all"),
    [actor, setActor] = useState("all"),
    [project, setProject] = useState("all"),
    [query, setQuery] = useState(""),
    [unread, setUnread] = useState(false),
    [limit, setLimit] = useState(12),
    [mode, setMode] = useState("ready"),
    [selectedId, setSelectedId] = useState<string | null>(null),
    [comment, setComment] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [undoId, setUndoId] = useState<string | null>(null);
  const now = new Date(
    Math.max(Date.parse(FEED_NOW), ...events.map((e) => Date.parse(e.at))),
  ).toISOString();
  const current = events.find((e) => e.id === selectedId),
    filtered = filterActivity(events, {
      kind,
      actor,
      project,
      query,
      unreadOnly: unread,
      readIds: read,
    }),
    shown = mode === "ready" ? filtered.slice(0, limit) : [],
    comments = current
      ? filterActivity(events, { kind: "comments" }).filter(
          (e) =>
            e.subjectId === current.subjectId &&
            e.project.id === current.project.id,
        )
      : [];
  function reset() {
    setKind("all");
    setActor("all");
    setProject("all");
    setQuery("");
    setUnread(false);
    setMode("ready");
    setLimit(12);
  }
  function open(event: ActivityEvent) {
    returnTo.current = document.activeElement as HTMLElement;
    setSelectedId(event.id);
    setComment("");
    setError("");
    setRead((old) => (old.includes(event.id) ? old : [...old, event.id]));
  }
  function post(e: FormEvent) {
    e.preventDefault();
    if (!current) return;
    try {
      const id = crypto.randomUUID();
      setEvents(
        appendComment(
          events,
          current,
          comment,
          PEOPLE[0],
          new Date(Date.parse(now) + 1000).toISOString(),
          id,
        ),
      );
      setRead((old) => [...old, id]);
      setUndoId(id);
      setComment("");
      setError("");
      setNotice("Comment added to this local activity feed.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Comment could not be added.");
    }
  }
  function undo() {
    if (!undoId) return;
    setEvents((old) => old.filter((e) => e.id !== undoId));
    setRead((old) => old.filter((id) => id !== undoId));
    if (selectedId === undoId) setSelectedId(null);
    setUndoId(null);
    setNotice("Last local comment removed.");
  }
  function exportEvents() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(filtered, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-project-activity.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${filtered.length} matching activity records.`);
  }
  return (
    <div
      className={`paf-page${dark ? " theme-dark" : ""}`}
      ref={root}
      onKeyDown={(e) => {
        if (e.key === "Escape" && nav) {
          setNav(false);
          heading.current?.focus();
        }
      }}
    >
      <div className="paf-shell">
        <aside
          id="paf-navigation"
          className="paf-sidebar"
          data-open={nav || undefined}
        >
          <a className="paf-brand" href="/project-workspace">
            <Icon name="columns" />
            Oreo Studio
          </a>
          <span className="paf-nav-label">WORKSPACE</span>
          <nav aria-label="Workspace">
            <a href="/project-workspace">
              <Icon name="columns" size="sm" />
              Overview
            </a>
            <a href="/grouped-tasks">
              <Icon name="list-checks" size="sm" />
              Tasks
            </a>
            <a href="/meeting-planner">
              <Icon name="calendar" size="sm" />
              Calendar
            </a>
            <button
              type="button"
              aria-current="page"
              onClick={() => {
                reset();
                setNav(false);
                if (nav) heading.current?.focus();
              }}
            >
              <Icon name="clock-history" size="sm" />
              Activity{" "}
              <small>{events.filter((e) => !read.includes(e.id)).length}</small>
            </button>
          </nav>
          <span className="paf-nav-label">
            PROJECTS <small>{PROJECTS.length}</small>
          </span>
          <nav aria-label="Projects">
            <button
              type="button"
              aria-pressed={project === "all"}
              onClick={() => {
                setProject("all");
                setLimit(12);
                setNav(false);
                if (nav) heading.current?.focus();
              }}
            >
              <Icon name="folder" size="sm" />
              All projects
            </button>
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={project === p.id}
                onClick={() => {
                  setProject(p.id);
                  setLimit(12);
                  setNav(false);
                  if (nav) heading.current?.focus();
                }}
              >
                <span className={`paf-project-dot paf-tone-${i}`} />
                {p.name}
                <small>
                  {events.filter(
                    (e) => e.project.id === p.id && !read.includes(e.id),
                  ).length || ""}
                </small>
              </button>
            ))}
          </nav>
          <div className="paf-sidebar-bottom">
            <a href="/grouped-activity-feed">
              Explore components <Icon name="arrow-up-right" size="sm" />
            </a>
            <div>
              <Avatar name="Alex Morgan" color="purple" size="sm" />
              <span>
                Alex Morgan<small>Oreo Studio · Sample workspace</small>
              </span>
            </div>
          </div>
        </aside>
        <div className="paf-main-shell">
          <header className="paf-top">
            <IconButton
              aria-label={nav ? "Close navigation" : "Open navigation"}
              className="paf-mobile-nav"
              aria-expanded={nav}
              aria-controls="paf-navigation"
              type="tertiary"
              tapScale={1}
              icon={<Icon name={nav ? "x" : "list"} />}
              onClick={() => setNav((v) => !v)}
            />
            <span>
              Oreo Studio <span>/</span> <b>Activity</b>
            </span>
            <div>
              <Tag color="default">Local demo</Tag>
              <IconButton
                aria-label={dark ? "Light mode" : "Dark mode"}
                type="tertiary"
                tapScale={1}
                icon={<Icon name={dark ? "sun" : "moon"} />}
                onClick={() => setDark((v) => !v)}
              />
            </div>
          </header>
          <main className="paf-main">
            <div className="paf-heading">
              <div>
                <h1 tabIndex={-1} ref={heading}>
                  Activity
                </h1>
                <p>Everything that's changed across the workspace.</p>
              </div>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={exportEvents}
                disabled={mode !== "ready" || !filtered.length}
              >
                Export
              </Button>
            </div>
            <div className="paf-filters">
              <div className="paf-tabs" role="group" aria-label="Activity type">
                {ACTIVITY_FILTERS.map((f) => (
                  <Button
                    key={f.value}
                    type={kind === f.value ? "secondary" : "tertiary"}
                    size="sm"
                    tapScale={1}
                    aria-pressed={kind === f.value}
                    onClick={() => {
                      setKind(f.value);
                      setLimit(12);
                    }}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
              <label className="sr-only" htmlFor="paf-person">
                Activity by member
              </label>
              <select
                id="paf-person"
                value={actor}
                onChange={(e) => {
                  setActor(e.target.value);
                  setLimit(12);
                }}
              >
                <option value="all">Everyone</option>
                {PEOPLE.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id === "alex" ? "You" : p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="paf-searchbar">
              <label>
                <Icon name="search" size="sm" />
                <input
                  aria-label="Search activity"
                  placeholder="Search activity…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setLimit(12);
                  }}
                />
              </label>
              <label className="paf-unread-toggle">
                <input
                  type="checkbox"
                  checked={unread}
                  onChange={(e) => {
                    setUnread(e.target.checked);
                    setLimit(12);
                  }}
                />
                Unread only
              </label>
              <Button
                size="sm"
                type="tertiary"
                tapScale={1}
                disabled={
                  mode !== "ready" ||
                  !filtered.some((e) => !read.includes(e.id))
                }
                onClick={() => {
                  setRead((old) => [
                    ...new Set([...old, ...filtered.map((e) => e.id)]),
                  ]);
                  setNotice("Marked all matching events as read.");
                }}
              >
                Mark view as read
              </Button>
            </div>
            <div className="paf-scope">
              <span>
                {project === "all"
                  ? "All projects"
                  : PROJECTS.find((p) => p.id === project)?.name}{" "}
                · {mode === "ready" ? filtered.length : 0} updates
              </span>
              {(project !== "all" ||
                actor !== "all" ||
                kind !== "all" ||
                query ||
                unread) && (
                <button type="button" onClick={reset}>
                  Clear filters
                </button>
              )}
            </div>
            <GroupedActivityFeed
              events={shown}
              now={now}
              currentUserId="alex"
              readIds={read}
              selectedId={selectedId ?? undefined}
              onOpen={open}
              loading={mode === "loading"}
              error={
                mode === "error"
                  ? "Activity could not be loaded. Your local changes are still here."
                  : undefined
              }
              onReset={reset}
            />
            {mode === "ready" && limit < filtered.length && (
              <div className="paf-more">
                <Button
                  type="secondary"
                  tapScale={1}
                  onClick={() => setLimit((n) => n + 12)}
                >
                  Load more · {filtered.length - limit} remaining
                </Button>
              </div>
            )}
            <div className="paf-notice" role="status">
              {notice}
              {undoId && (
                <Button size="sm" type="tertiary" tapScale={1} onClick={undo}>
                  Undo comment
                </Button>
              )}
            </div>
            <footer className="paf-footer">
              <span>
                Sample clock: Oct 16, 12:00 UTC · Changes reset on reload
              </span>
              <a
                href="https://x.com/zahragr8r/status/2110632965361529237"
                target="_blank"
                rel="noreferrer"
              >
                Reference by Zahra ↗
              </a>
              <details>
                <summary>Demo states</summary>
                <div>
                  {["ready", "loading", "empty", "error"].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      tapScale={1}
                      type={mode === s ? "secondary" : "tertiary"}
                      onClick={() => setMode(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </details>
            </footer>
          </main>
        </div>
      </div>
      <Dialog.Root
        open={Boolean(current)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="paf-backdrop" />
          <Dialog.Popup
            className="paf-dialog"
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            {current && (
              <>
                <header>
                  <div>
                    <p>
                      {current.project.name} / {current.subjectId}
                    </p>
                    <Dialog.Title>{current.subject}</Dialog.Title>
                    <Dialog.Description>
                      Activity details and local discussion.
                    </Dialog.Description>
                  </div>
                  <IconButton
                    aria-label="Close activity"
                    type="tertiary"
                    tapScale={1}
                    icon={<Icon name="x" />}
                    onClick={() => setSelectedId(null)}
                  />
                </header>
                <div className="paf-dialog-body">
                  <div className="paf-actor">
                    <Avatar
                      name={current.actor.name}
                      color={current.actor.color}
                      size="sm"
                    />
                    <div>
                      <strong>{current.actor.name}</strong>
                      <p>
                        {actionVerb[current.action]} {current.subject}
                      </p>
                    </div>
                  </div>
                  <time dateTime={current.at}>
                    {new Date(current.at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "UTC",
                    })}{" "}
                    UTC
                  </time>
                  {current.previous && (
                    <div className="paf-change">
                      <span>{current.previous}</span>
                      <Icon name="chevron-right" size="sm" />
                      <strong>{current.next}</strong>
                    </div>
                  )}
                  {current.filename && (
                    <div className="paf-file">
                      <Icon name="paperclip" />
                      <span>
                        {current.filename}
                        <small>Sample attachment metadata</small>
                      </span>
                    </div>
                  )}
                  <Button
                    type="secondary"
                    size="sm"
                    tapScale={1}
                    onClick={() =>
                      setRead((old) =>
                        old.includes(current.id)
                          ? old.filter((id) => id !== current.id)
                          : [...old, current.id],
                      )
                    }
                  >
                    {read.includes(current.id) ? "Mark unread" : "Mark read"}
                  </Button>
                  <section className="paf-discussion">
                    <h3>
                      Discussion <span>{comments.length}</span>
                    </h3>
                    {comments.length ? (
                      <ol>
                        {[...comments].reverse().map((c) => (
                          <li key={c.id}>
                            <Avatar
                              name={c.actor.name}
                              color={c.actor.color}
                              size="xs"
                            />
                            <div>
                              <strong>{c.actor.name}</strong>
                              <p>{c.body}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="paf-no-comments">
                        No comments yet. Add context for your team.
                      </p>
                    )}
                  </section>
                </div>
                <footer>
                  <form onSubmit={post} noValidate>
                    <label htmlFor="paf-comment">Add a comment</label>
                    <textarea
                      id="paf-comment"
                      value={comment}
                      maxLength={500}
                      rows={3}
                      placeholder="Share an update…"
                      onChange={(e) => {
                        setComment(e.target.value);
                        setError("");
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "paf-comment-error" : undefined}
                    />
                    {error && (
                      <p role="alert" id="paf-comment-error">
                        {error}
                      </p>
                    )}
                    <div>
                      <span>{comment.length}/500 · Local only</span>
                      <Button
                        size="sm"
                        tapScale={1}
                        render={<button type="submit" />}
                      >
                        Post comment
                      </Button>
                    </div>
                  </form>
                  {undoId && (
                    <Button
                      size="sm"
                      type="tertiary"
                      tapScale={1}
                      onClick={undo}
                    >
                      Undo last comment
                    </Button>
                  )}
                </footer>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

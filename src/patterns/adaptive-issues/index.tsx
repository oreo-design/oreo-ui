import { useLayoutEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar, AvatarGroup } from "@/components/avatar";
import {
  AdaptiveIssueTable,
  ResizeFrame,
  PullRequestPill,
  ISSUE_STAGES,
  ISSUE_STAGE_LABELS,
  matchingIssues,
  type AdaptiveIssue,
  type IssueStage,
} from "@/components/adaptive-issues";
import { AgentWorkspaceState } from "@/components/automation";
import { ADAPTIVE_ISSUES } from "./data";
import "./workspace.css";
export function AdaptiveIssuesPage() {
  const workspace = useRef<HTMLDivElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const createButton = useRef<HTMLButtonElement>(null);
  const [issues, setIssues] = useState(ADAPTIVE_ISSUES),
    [width, setWidth] = useState(1120),
    [dark, setDark] = useState(true),
    [tab, setTab] = useState("Issues"),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<number>(),
    [creating, setCreating] = useState(false),
    [draft, setDraft] = useState(""),
    [events, setEvents] = useState<string[]>([]),
    [undo, setUndo] = useState<AdaptiveIssue[] | null>(null),
    [notice, setNotice] = useState(""),
    [scenario, setScenario] = useState("ready");
  useLayoutEffect(() => {
    if (selected !== undefined) detailHeading.current?.focus();
  }, [selected]);
  function openIssue(id: number) {
    returnTo.current = document.activeElement as HTMLElement;
    setSelected(id);
  }
  function closeIssue() {
    setSelected(undefined);
    if (returnTo.current?.isConnected) returnTo.current.focus();
    else
      (
        workspace.current?.querySelector<HTMLButtonElement>(
          `[data-adaptive-issue-id="${selected}"]`,
        ) ?? createButton.current
      )?.focus();
  }
  const shown = matchingIssues(issues, query),
    issue = issues.find((i) => i.id === selected);
  const record = (next: AdaptiveIssue[], message: string) => {
    setUndo(issues);
    setIssues(next);
    setEvents((e) => [message, ...e]);
    setNotice(message);
  };
  function create() {
    const title = draft.trim();
    if (!title) return;
    const next = {
      ...ADAPTIVE_ISSUES[0],
      id: Math.max(0, ...issues.map((i) => i.id)) + 1,
      title,
      status: "todo" as IssueStage,
      pullRequest: {
        number: Math.max(0, ...issues.map((i) => i.pullRequest.number)) + 1,
        state: "draft" as const,
      },
      category: "Feature",
      assignees: [],
    };
    record([...issues, next], `Created “${title}”.`);
    setCreating(false);
    setDraft("");
    setQuery("");
    returnTo.current = createButton.current;
    setSelected(next.id);
    setTab("Issues");
  }
  function reset() {
    setIssues(ADAPTIVE_ISSUES);
    setWidth(1120);
    setQuery("");
    setSelected(undefined);
    setCreating(false);
    setDraft("");
    setEvents([]);
    setUndo(null);
    setScenario("ready");
    setTab("Issues");
    setNotice("Sample workspace restored.");
  }
  return (
    <div
      ref={workspace}
      className={`adaptive-workspace ${dark ? "theme-dark" : ""}`}
    >
      <header className="adws-header">
        <a href="/" aria-label="Oreo UI home" className="adws-brand">
          o.
        </a>
        <span>
          Atlas <span className="adws-muted">/</span> Map experience
        </span>
        <div className="adws-header-actions">
          <a href="/adaptive-issue-table">Components</a>
          <IconButton
            size="sm"
            type="tertiary"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
          <Avatar name="Maya Wilson" size="sm" />
        </div>
      </header>
      <main className="adws-main">
        <div className="adws-intro">
          <div>
            <p className="adws-eyebrow">ATLAS / PRODUCT ENGINEERING</p>
            <h1>Make room for the details.</h1>
            <p>One issue list. A little more space, a little more context.</p>
          </div>
          <AvatarGroup size="sm">
            <Avatar name="Maya Wilson" size="sm" />
            <Avatar name="Alex Morgan" size="sm" />
            <Avatar name="Sam Chen" size="sm" />
          </AvatarGroup>
        </div>
        <div className="adws-tools">
          <label className="adws-search">
            <Icon name="search" size="sm" />
            <input
              aria-label="Search issues"
              placeholder="Search issues, people, PRs…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setTab("Issues");
              }}
            />
          </label>
          <div className="adws-presets" aria-label="Panel width presets">
            {[
              [640, "Compact"],
              [840, "Comfortable"],
              [1120, "Expanded"],
            ].map(([value, label]) => (
              <Button
                key={value}
                size="sm"
                type="tertiary"
                aria-pressed={width === value}
                onClick={() => setWidth(Number(value))}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button
            size="sm"
            leadingIcon={<Icon name="plus" size="sm" />}
            onClick={(event) => {
              createButton.current = event.currentTarget;
              setCreating(!creating);
              setTab("Issues");
            }}
          >
            New issue
          </Button>
        </div>
        {creating && (
          <form
            className="adws-create"
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
          >
            <label>
              Issue title
              <input
                autoFocus
                required
                maxLength={160}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="What needs to be done?"
              />
            </label>
            <Button
              size="sm"
              render={<button type="submit" />}
              disabled={!draft.trim()}
            >
              Create issue
            </Button>
            <Button
              size="sm"
              type="tertiary"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
          </form>
        )}
        {issue && (
          <section className="adws-detail" aria-label="Issue details">
            <div>
              <span className="adws-eyebrow">ISSUE #{issue.id}</span>
              <h2 ref={detailHeading} tabIndex={-1}>
                {issue.title}
              </h2>
              <PullRequestPill {...issue.pullRequest} />
              <span className="adws-detail-meta">
                {issue.category} · {issue.priority} priority · {issue.points}{" "}
                points · Due {issue.due} ·{" "}
                {issue.assignees.join(", ") || "Unassigned"}
              </span>
            </div>
            <label>
              Status
              <select
                value={issue.status}
                onChange={(e) =>
                  record(
                    issues.map((i) =>
                      i.id === issue.id
                        ? { ...i, status: e.target.value as IssueStage }
                        : i,
                    ),
                    `Moved “${issue.title}” to ${ISSUE_STAGE_LABELS[e.target.value as IssueStage]}.`,
                  )
                }
              >
                {ISSUE_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {ISSUE_STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <IconButton
              size="sm"
              type="tertiary"
              aria-label="Close issue details"
              icon={<Icon name="x" />}
              onClick={closeIssue}
            />
          </section>
        )}
        <ResizeFrame width={width} onWidthChange={setWidth}>
          <section className="adws-panel">
            <div className="adws-panel-head">
              <div role="tablist" aria-label="Project view">
                {["Overview", "Activity", "Issues"].map((name) => (
                  <button
                    type="button"
                    key={name}
                    role="tab"
                    id={`adws-tab-${name}`}
                    aria-controls={`adws-content-${name}`}
                    aria-selected={tab === name}
                    tabIndex={tab === name ? 0 : -1}
                    onClick={() => setTab(name)}
                    onKeyDown={(e) => {
                      const tabs = ["Overview", "Activity", "Issues"];
                      const index = tabs.indexOf(name);
                      const next =
                        e.key === "ArrowRight"
                          ? tabs[(index + 1) % 3]
                          : e.key === "ArrowLeft"
                            ? tabs[(index + 2) % 3]
                            : e.key === "Home"
                              ? tabs[0]
                              : e.key === "End"
                                ? tabs[2]
                                : null;
                      if (next) {
                        e.preventDefault();
                        setTab(next);
                        document.getElementById(`adws-tab-${next}`)?.focus();
                      }
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <span className="adws-count">{issues.length} issues</span>
            </div>
            <div
              className="adws-content"
              role="tabpanel"
              id={`adws-content-${tab}`}
              aria-labelledby={`adws-tab-${tab}`}
              tabIndex={0}
            >
              {tab === "Issues" ? (
                <AdaptiveIssueTable
                  issues={
                    scenario === "empty" || scenario === "loading" ? [] : shown
                  }
                  selectedId={selected}
                  onOpen={(i) => openIssue(i.id)}
                  loading={scenario === "loading"}
                  error={
                    scenario === "error"
                      ? "The sample connection was interrupted. Your local changes are safe."
                      : undefined
                  }
                  onRetry={() => setScenario("ready")}
                  onClear={query ? () => setQuery("") : undefined}
                />
              ) : tab === "Overview" ? (
                <div className="adws-overview">
                  <h2>A calmer way to find your way.</h2>
                  <p>
                    Improve offline maps, shared places and the small details
                    that make Atlas feel effortless.
                  </p>
                  <div className="adws-metrics">
                    {ISSUE_STAGES.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setTab("Issues")}
                      >
                        <strong>
                          {issues.filter((i) => i.status === s).length}
                        </strong>
                        <span>{ISSUE_STAGE_LABELS[s]}</span>
                      </button>
                    ))}
                  </div>
                  <h3>Milestone · October release</h3>
                  <progress
                    aria-label="Completed issues"
                    max={issues.length || 1}
                    value={issues.filter((i) => i.status === "done").length}
                  />
                  <p>
                    {issues.filter((i) => i.status === "done").length} of{" "}
                    {issues.length} issues completed
                  </p>
                </div>
              ) : events.length ? (
                <ol className="adws-activity">
                  {events.map((event, i) => (
                    <li key={`${event}-${i}`}>
                      <Icon name="clock-history" size="sm" />
                      <span>{event}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <AgentWorkspaceState
                  title="No activity yet"
                  description="Create an issue or update its status to start the project history."
                  actionLabel="View issues"
                  onAction={() => setTab("Issues")}
                />
              )}
            </div>
          </section>
        </ResizeFrame>
        <div className="adws-feedback" role="status">
          <span>{notice || "Drag the right edge to find your view."}</span>
          {undo && (
            <Button
              size="sm"
              type="tertiary"
              onClick={() => {
                setIssues(undo);
                setUndo(null);
                setEvents((e) => ["Undid the last change.", ...e]);
                setNotice("Last change undone.");
              }}
            >
              Undo
            </Button>
          )}
        </div>
        <footer className="adws-footer">
          <span>Local sample · changes reset on reload</span>
          <a href="https://x.com/componest/status/2112057747739172953">
            Reference ↗
          </a>
          <label>
            Demo state
            <select
              aria-label="Demo state"
              value={scenario}
              onChange={(e) => {
                setScenario(e.target.value);
                setTab("Issues");
              }}
            >
              {["ready", "loading", "empty", "error"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <Button size="sm" type="tertiary" onClick={reset}>
            Reset demo
          </Button>
        </footer>
      </main>
    </div>
  );
}

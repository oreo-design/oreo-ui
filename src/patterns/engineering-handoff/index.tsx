import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useReducer, useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { Avatar } from "@/components/avatar";
import {
  CommentItem,
  CommentComposer,
  type ThreadComment,
} from "@/components/comment-thread";
import { AgentWorkspaceState } from "@/components/automation";
import { TASK_STATUS, type TaskStatus } from "@/components/task-row";
import {
  AgentMentionComposer,
  AgentSessionCard,
  emptyRun,
  handoffReducer,
  cleanHandoff,
  busyRun,
} from "@/components/agent-handoff";
import { HANDOFF_AGENTS, SAMPLE_PATCH } from "./data";
import "./workspace.css";
export function EngineeringHandoffPage() {
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    returnTo = useRef<HTMLElement | null>(null);
  const [run, dispatch] = useReducer(handoffReducer, emptyRun),
    [agentId, setAgentId] = useState(""),
    [notes, setNotes] = useState<ThreadComment[]>([]),
    [dark, setDark] = useThemeMode(false),
    [filter, setFilter] = useState("all"),
    [connected, setConnected] = useState(true),
    [failNext, setFailNext] = useState(false),
    [opened, setOpened] = useState(false),
    [notice, setNotice] = useState(""),
    [priority, setPriority] = useState("High");
  const agents = HANDOFF_AGENTS.map((a) => ({
      ...a,
      available: a.available && connected,
    })),
    agent = agents.find((a) => a.id === run.agentId)?.name ?? "Agent";
  const status: TaskStatus =
    run.status === "completed"
      ? "done"
      : run.status === "review"
        ? "review"
        : run.status === "idle"
          ? "todo"
          : "progress";
  useEffect(() => {
    if (run.status !== "analyzing" && run.status !== "implementing") return;
    const timer = setTimeout(
      () => dispatch({ type: "tick", id: run.id, attempt: run.attempt }),
      1800,
    );
    return () => clearTimeout(timer);
  }, [run.status, run.id, run.attempt]);
  function send(text: string, id: string) {
    const body = cleanHandoff(text);
    if (id) {
      if (!agents.some((a) => a.id === id && a.available))
        throw new Error("Connect an available agent before delegating.");
      if (run.status !== "idle")
        throw new Error(
          "Finish or stop this session, then choose New session before delegating again.",
        );
      dispatch({
        type: "start",
        id: crypto.randomUUID(),
        agentId: id,
        body,
        fail: failNext,
      });
      setFailNext(false);
      setAgentId("");
      setFilter("all");
    } else {
      setNotes((n) => [
        ...n,
        {
          id: crypto.randomUUID(),
          author: { id: "jordan", name: "Jordan Lee" },
          body,
          time: "Just now · local",
        },
      ]);
      setFilter("all");
    }
  }
  function exportSession() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            demo: true,
            issue: {
              id: "CORE-128",
              title: "Dashboard export returns a 500",
              status: TASK_STATUS[status],
              priority,
            },
            comments: notes,
            session: run,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "core-128-handoff.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Local handoff exported.");
  }
  const messages: ThreadComment[] = run.messages.map((m, i) => ({
    id: m.id,
    author: {
      id: m.role === "agent" ? run.agentId : "jordan",
      name: m.role === "agent" ? agent : "Jordan Lee",
    },
    body: m.body,
    time: `Sample step ${i + 1}`,
  }));
  function review() {
    returnTo.current = document.activeElement as HTMLElement;
    setOpened(true);
  }
  return (
    <div ref={root} className={`eh-workspace ${dark ? "theme-dark" : ""}`}>
      <nav className="eh-rail" aria-label="Workspace">
        <a href="/" aria-label="Oreo UI" className="eh-brand">
          o.
        </a>
        <a href="/project-workspace" title="Work">
          <Icon name="columns" />
          <span>Work</span>
        </a>
        <a href="/grouped-tasks" title="Tasks">
          <Icon name="list" />
          <span>Tasks</span>
        </a>
        <a href="/agent-connections" title="Agents">
          <Icon name="assistant" />
          <span>Agents</span>
        </a>
        <a href="/agent-mention-composer" title="Component docs">
          <Icon name="gear" />
          <span>Docs</span>
        </a>
      </nav>
      <div className="eh-shell">
        <header className="eh-top">
          <div>
            <span className="eh-project-mark">
              <Icon name="columns" size="sm" />
            </span>
            <a href="/project-workspace">Core Platform</a>
            <span>/</span>
            <a href="/grouped-tasks">Work items</a>
            <span>/</span>
            <strong>CORE-128</strong>
          </div>
          <IconButton
            type="tertiary"
            icon={<Icon name={dark ? "sun" : "moon"} />}
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            onClick={() => setDark(!dark)}
          />
        </header>
        <div className="eh-layout">
          <main>
            <div className="eh-title-meta">
              <Tag>Bug</Tag>
              <span>CORE-128</span>
              <span className="eh-local">Local simulation</span>
            </div>
            <h1 ref={heading} tabIndex={-1}>
              Dashboard export returns a 500
            </h1>
            <div className="eh-metadata">
              <Tag
                color={
                  status === "done"
                    ? "mint"
                    : status === "review"
                      ? "purple"
                      : "blue"
                }
              >
                {TASK_STATUS[status]}
              </Tag>
              <span>
                <Icon name="warning-circle" size="sm" />
                {priority} priority
              </span>
              <span>
                <Avatar name="Jordan Lee" size="xs" />
                Jordan Lee
              </span>
              <span>
                <Icon name="calendar" size="sm" />
                Oct 20
              </span>
            </div>
            <section
              className="eh-description"
              aria-label="Work item description"
            >
              <p>
                Exporting a dashboard as CSV or PDF returns a 500 on larger
                workspaces. Small exports still work, but the request times out
                as the dataset grows.
              </p>
              <h2>Expected outcome</h2>
              <ul>
                <li>
                  Let people export their dashboard without blocking the
                  request.
                </li>
                <li>
                  Use the existing export queue and preserve CSV / PDF support.
                </li>
                <li>Keep changes scoped to the export service.</li>
              </ul>
              <div className="eh-context">
                <Icon name="github-logo" size="sm" />
                <span>
                  core-platform <span>/ services / exports</span>
                </span>
                <Tag>Context</Tag>
              </div>
            </section>
            <section className="eh-activity" aria-label="Work item activity">
              <header>
                <h2>Activity</h2>
                <div className="eh-filters" aria-label="Activity filters">
                  {["all", "comments", "sessions"].map((f) => (
                    <Button
                      key={f}
                      type="tertiary"
                      size="sm"
                      tapScale={1}
                      aria-pressed={filter === f}
                      onClick={() => setFilter(f)}
                    >
                      {f[0].toUpperCase() + f.slice(1)}
                    </Button>
                  ))}
                </div>
              </header>
              {filter === "all" && (
                <p className="eh-created">
                  <Avatar name="Jordan Lee" size="xs" />
                  <span>
                    <strong>Jordan Lee</strong> created this work item{" "}
                    <span>· Oct 16</span>
                  </span>
                </p>
              )}
              {filter !== "sessions" &&
                notes.map((n) => <CommentItem key={n.id} comment={n} />)}
              {run.status !== "idle" && filter !== "sessions" && (
                <CommentItem
                  comment={{
                    id: run.id,
                    author: { id: "jordan", name: "Jordan Lee" },
                    body: `@${agent} ${run.request}`,
                    time: "Local request",
                  }}
                />
              )}
              {filter !== "comments" && run.status !== "idle" && (
                <AgentSessionCard
                  agent={agent}
                  resultTitle="Export queue · sample result"
                  resultIcon="github-logo"
                  status={run.status}
                  messages={messages}
                  onStop={() => dispatch({ type: "stop" })}
                  onRetry={
                    connected ? () => dispatch({ type: "retry" }) : undefined
                  }
                  reply={
                    run.status === "awaiting" ? (
                      <CommentComposer
                        placeholder="Add direction for this session…"
                        onSend={(body) => {
                          dispatch({
                            type: "reply",
                            body: cleanHandoff(body, 4000),
                          });
                        }}
                      />
                    ) : undefined
                  }
                  result={
                    <div className="eh-result">
                      <p>
                        Move dashboard exports to the existing queue and return
                        a job reference.
                      </p>
                      <ul>
                        <li>CSV and PDF behavior retained in the sample.</li>
                        <li>
                          Queue failure and permission cases listed for review.
                        </li>
                      </ul>
                      <p className="eh-muted">
                        Illustrative patch only. No code was executed and no
                        pull request was created.
                      </p>
                      <Button
                        type="secondary"
                        size="sm"
                        tapScale={1}
                        leadingIcon={<Icon name="github-logo" size="sm" />}
                        onClick={review}
                      >
                        Review sample patch
                      </Button>
                    </div>
                  }
                />
              )}{" "}
              {filter === "sessions" && run.status === "idle" && (
                <AgentWorkspaceState
                  title="No sessions yet"
                  description="Mention an available agent in a comment to hand off this work."
                  actionLabel="Show all activity"
                  onAction={() => setFilter("all")}
                />
              )}{" "}
              {filter === "comments" &&
                !notes.length &&
                run.status === "idle" && (
                  <AgentWorkspaceState
                    title="No comments yet"
                    description="Add context below, or mention an agent to begin."
                  />
                )}
              <div className="eh-compose-wrap">
                <AgentMentionComposer
                  agents={agents}
                  agentId={agentId}
                  onAgentChange={setAgentId}
                  onSend={send}
                />
                <p className="eh-muted">
                  Try <strong>@Claude</strong> or <strong>@Codex</strong>. This
                  demo stays in your browser and resets on reload.
                </p>
              </div>
            </section>
          </main>
          <aside>
            <details open>
              <summary>Properties</summary>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{TASK_STATUS[status]}</dd>
                </div>
                <div>
                  <dt>Assignee</dt>
                  <dd>
                    <Avatar name="Jordan Lee" size="xs" />
                    Jordan Lee
                  </dd>
                </div>
                <div>
                  <dt>Priority</dt>
                  <dd>
                    <select
                      aria-label="Work item priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      {["High", "Medium", "Low"].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </dd>
                </div>
                <div>
                  <dt>Labels</dt>
                  <dd>
                    <Tag color="orange">Exports</Tag>
                  </dd>
                </div>
                <div>
                  <dt>Cycle</dt>
                  <dd>October · Week 3</dd>
                </div>
                <div>
                  <dt>Module</dt>
                  <dd>Dashboard</dd>
                </div>
                <div>
                  <dt>Estimate</dt>
                  <dd>3 points</dd>
                </div>
              </dl>
            </details>
            <section className="eh-demo">
              <h2>Agent connection</h2>
              <p>Sample agents, local workflow.</p>
              <label>
                <input
                  type="checkbox"
                  checked={connected}
                  onChange={(e) => {
                    setConnected(e.target.checked);
                    if (!e.target.checked && busyRun(run.status))
                      dispatch({ type: "stop" });
                  }}
                />
                Agents connected
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={failNext}
                  disabled={run.status !== "idle"}
                  onChange={(e) => setFailNext(e.target.checked)}
                />
                Fail next context load
              </label>
              {!connected && (
                <p role="status">
                  Reconnect to start or retry a session. You can still add
                  comments.
                </p>
              )}
              {["completed", "failed", "stopped"].includes(run.status) && (
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    dispatch({ type: "reset" });
                    setNotice(
                      "New local session ready. Previous session cleared.",
                    );
                  }}
                >
                  New session
                </Button>
              )}
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                leadingIcon={<Icon name="arrow-down" size="sm" />}
                onClick={exportSession}
              >
                Export handoff
              </Button>
              <p role="status">{notice}</p>
            </section>
            <a
              className="eh-source"
              href="https://x.com/planepowers/status/2110763968792780851"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Plane ↗
            </a>
          </aside>
        </div>
      </div>
      <Dialog.Root open={opened} onOpenChange={setOpened}>
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="eh-backdrop" />
          <Dialog.Popup
            className="eh-dialog"
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            <header>
              <div>
                <Dialog.Title>Export queue · sample patch</Dialog.Title>
                <Dialog.Description>
                  Review this illustrative change before completing the local
                  handoff.
                </Dialog.Description>
              </div>
              <Dialog.Close
                render={
                  <IconButton
                    icon={<Icon name="x" />}
                    type="tertiary"
                    tapScale={1}
                    aria-label="Close sample patch"
                  />
                }
              />
            </header>
            <div className="eh-dialog-scroll">
              <Tag>Fixture · not executed</Tag>
              <h3>services/exports/handler.ts</h3>
              <pre>{SAMPLE_PATCH}</pre>
              <h3>Review checklist</h3>
              <ul>
                <li>Queue accepts both CSV and PDF requests.</li>
                <li>Caller permissions are validated before enqueueing.</li>
                <li>Queue failures surface a recoverable error.</li>
                <li>Large exports return a job reference without waiting.</li>
              </ul>
              <p>
                These are suggested checks for a real implementation, not
                passing test results. This template does not connect to Claude,
                Codex, GitHub or a repository.
              </p>
            </div>
            <footer>
              {run.status === "review" ? (
                <>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => {
                      dispatch({ type: "revise" });
                      setOpened(false);
                    }}
                  >
                    Request changes
                  </Button>
                  <Button
                    tapScale={1}
                    onClick={() => {
                      dispatch({ type: "accept" });
                      setOpened(false);
                      setNotice(
                        "Sample result reviewed. Work item marked Done.",
                      );
                    }}
                  >
                    Mark reviewed
                  </Button>
                </>
              ) : (
                <Dialog.Close render={<Button type="secondary" tapScale={1} />}>
                  Close
                </Dialog.Close>
              )}
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

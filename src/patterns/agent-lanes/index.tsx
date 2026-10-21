import { useThemeMode } from "@/lib/theme/useThemeMode";
import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  AgentLanes,
  LANE_LABELS,
  elapsedLabel,
} from "@/components/agent-lanes";
import {
  AgentWorkspacePanel,
  AgentWorkspaceState,
} from "@/components/automation";
import { AgentRunActivity } from "@/components/agent-inbox";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { OreoLogo } from "@/docs/OreoLogo";
import { LANE_AGENTS, LANE_TASKS } from "./data";
import { laneDemoReducer } from "./model";
import "./workspace.css";
export function AgentLanesPage() {
  const [demo, dispatch] = useReducer(laneDemoReducer, {
    now: 0,
    playing: false,
    tasks: LANE_TASKS,
    approvedAt: null,
  });
  const [dark, setDark] = useThemeMode(false),
    [minutes, setMinutes] = useState(30),
    [query, setQuery] = useState(""),
    [selected, setSelected] = useState<string>(),
    [scenario, setScenario] = useState("ready"),
    [notice, setNotice] = useState("");
  const heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    range = useRef<HTMLSelectElement>(null);
  const task = demo.tasks.find((t) => t.id === selected),
    agent = LANE_AGENTS.find((a) => a.id === task?.agentId);
  const filtered = demo.tasks.filter((t) =>
    `${t.title} ${LANE_AGENTS.find((a) => a.id === t.agentId)?.name} ${t.tools.join(" ")} ${LANE_LABELS[t.status]}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  useEffect(() => {
    if (!demo.playing) return;
    const timer = setInterval(() => dispatch({ type: "tick" }), 1500);
    return () => clearInterval(timer);
  }, [demo.playing]);
  useLayoutEffect(() => {
    if (selected) heading.current?.focus();
  }, [selected]);
  function close() {
    setSelected(undefined);
    requestAnimationFrame(() => {
      if (trigger.current?.isConnected) trigger.current.focus();
      else range.current?.focus();
    });
  }
  function reset() {
    dispatch({ type: "reset", tasks: LANE_TASKS });
    setQuery("");
    setSelected(undefined);
    setScenario("ready");
    setNotice("Demo reset to the original snapshot.");
  }
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="al-page">
        <header className="al-sitebar">
          <a href="/agent-lanes">
            <OreoLogo className="h-5 w-8" />
            <span>
              Oreo UI <span>/ Templates</span>
            </span>
          </a>
          <IconButton
            type="tertiary"
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </header>
        <main className="al-main">
          <div className="al-intro">
            <div>
              <p>ORCHESTRATION, IN PERSPECTIVE</p>
              <h1>Every agent. One timeline.</h1>
              <span>
                Follow the work, see the handoffs, step in when you’re needed.
              </span>
            </div>
            <Tag>Local simulation</Tag>
          </div>
          <div className="al-workspace-tools">
            <label className="al-search">
              <Icon name="search" size="sm" />
              <input
                type="search"
                aria-label="Search timeline"
                placeholder="Search tasks, agents, tools…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <span className="al-clock">+{demo.now}m simulated</span>
            <Button
              type="secondary"
              size="sm"
              disabled={
                demo.now >= Math.max(18, (demo.approvedAt ?? 0) + 4) ||
                scenario !== "ready"
              }
              onClick={() => {
                dispatch({ type: demo.playing ? "pause" : "play" });
                setNotice(
                  demo.playing
                    ? "Playback paused."
                    : "Playback started. One simulated minute every 1.5 seconds.",
                );
              }}
            >
              {demo.playing ? "Pause playback" : "Play timeline"}
            </Button>
            <Button type="tertiary" size="sm" onClick={reset}>
              Reset demo
            </Button>
          </div>
          <AgentLanes
            agents={LANE_AGENTS}
            tasks={scenario === "loading" ? [] : filtered}
            now={demo.now}
            minutes={minutes}
            selectedId={selected}
            onSelect={(id) => {
              trigger.current = document.activeElement as HTMLElement;
              setSelected(id);
            }}
            loading={scenario === "loading"}
            error={
              scenario === "error"
                ? "The sample connection was interrupted. Your timeline is preserved."
                : undefined
            }
            onRetry={() => {
              setScenario("ready");
              setNotice("Connection restored. Your timeline is unchanged.");
            }}
            onClear={query ? () => setQuery("") : undefined}
            actions={
              <label className="al-range">
                <span className="sr-only">Time range</span>
                <select
                  ref={range}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                >
                  <option value={30}>Last 30m</option>
                  <option value={60}>Last 60m</option>
                </select>
              </label>
            }
          />
          <div className="al-below">
            <div
              className="al-detail"
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
              }}
            >
              <AgentWorkspacePanel
                title="Task details"
                icon="list-checks"
                actions={
                  task && (
                    <IconButton
                      type="tertiary"
                      size="sm"
                      aria-label="Close task details"
                      icon={<Icon name="x" />}
                      onClick={close}
                    />
                  )
                }
              >
                {task ? (
                  <div className="al-detail-body">
                    <div className="al-detail-title">
                      <h2 ref={heading} tabIndex={-1}>
                        {task.title}
                      </h2>
                      <Tag
                        color={
                          task.status === "waiting"
                            ? "orange"
                            : task.status === "running"
                              ? "blue"
                              : "default"
                        }
                      >
                        {LANE_LABELS[task.status]}
                      </Tag>
                    </div>
                    <p>
                      {agent?.name} · {agent?.model} ·{" "}
                      {elapsedLabel(task, demo.now)}
                    </p>
                    {task.dependsOn && (
                      <p>
                        Handoff from{" "}
                        <strong>
                          {demo.tasks.find((t) => t.id === task.dependsOn)
                            ?.title ?? task.dependsOn}
                        </strong>
                      </p>
                    )}
                    <AgentRunActivity
                      model={task.tools.join(" / ")}
                      items={task.notes.map((text, i) => ({
                        id: String(i),
                        text,
                        time: i === 0 ? "Context" : "Update",
                      }))}
                    />
                    {task.status === "waiting" && (
                      <div className="al-approval">
                        <p>
                          This demo only changes local sample data. No
                          credentials or services are modified.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => {
                            dispatch({ type: "approve" });
                            setNotice(
                              "Sample rotation approved. Play the timeline to follow its progress.",
                            );
                          }}
                        >
                          Approve sample rotation
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <AgentWorkspaceState
                    title="Follow a task"
                    description="Select a task to read its activity, inspect a handoff, or approve the sample rotation."
                  />
                )}
              </AgentWorkspacePanel>
            </div>
            <aside className="al-notes">
              <h2>Room for the work to flow.</h2>
              <p>
                Research becomes a draft. A finished draft lands with a
                reviewer. Keep the sequence in view without opening every
                conversation.
              </p>
              <div className="al-legend">
                {(["running", "waiting", "done", "failed"] as const).map(
                  (status) => (
                    <span key={status} data-status={status}>
                      <i />
                      {LANE_LABELS[status]}
                    </span>
                  ),
                )}
              </div>
              <label className="al-scenario">
                Preview state
                <select
                  aria-label="Preview state"
                  value={scenario}
                  onChange={(e) => {
                    setScenario(e.target.value);
                    dispatch({ type: "pause" });
                  }}
                >
                  <option value="ready">Ready</option>
                  <option value="loading">Loading</option>
                  <option value="error">Connection error</option>
                </select>
              </label>
              <p className="al-caption">
                Sample clock starts paused. Reset restores all tasks. No
                connected agents.
              </p>
            </aside>
          </div>
          <p role="status" className="al-notice">
            {notice ||
              "Hover or focus a task for a summary. Select it for details."}
          </p>
          <footer className="al-page-footer">
            <a href="/agent-lanes">Component API & playground →</a>
            <a
              href="https://x.com/flohoeller/status/2111405211478900836"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Flo (@flohoeller) ↗
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

import { useEffect, useReducer, useRef, useState } from "react";
import {
  AgentTaskQueue,
  QueuedRequestStack,
  TaskClarification,
  queueReducer,
  QUEUE_LABELS,
  type QueueTask,
} from "@/components/agent-task-queue";
import { AgentWorkspacePanel } from "@/components/automation";
import { PromptBox } from "@/components/prompt-box";
import { Attachment } from "@/components/attachment";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import { QUEUE_TASKS, newQueueTask } from "./data";
import "./workspace.css";
export function AgentQueueWorkspace() {
  const [state, dispatch] = useReducer(queueReducer, {
      tasks: QUEUE_TASKS,
      playing: false,
      epoch: 0,
      notice: "Start the sample session, or add another task.",
      removed: [],
    }),
    [dark, setDark] = useState(false),
    [expanded, setExpanded] = useState<string | null>(null),
    [stackOpen, setStackOpen] = useState(false),
    [draft, setDraft] = useState(""),
    [attached, setAttached] = useState(false),
    [scenario, setScenario] = useState("ready"),
    [validation, setValidation] = useState(""),
    [answers, setAnswers] = useState<Record<string, Record<string, string>>>(
      {},
    ),
    [steps, setSteps] = useState<Record<string, number>>({}),
    [contexts, setContexts] = useState<Record<string, string>>({});
  const root = useRef<HTMLDivElement>(null),
    counter = useRef(0),
    active = state.tasks.find((t) => t.status === "running"),
    needs = state.tasks.filter((t) => t.status === "needs-context"),
    done = state.tasks.filter((t) => t.status === "done"),
    ready = scenario === "ready";
  useEffect(() => {
    if (!state.playing || !active || !ready) return;
    const timer = window.setInterval(
      () => dispatch({ type: "tick", epoch: state.epoch }),
      1400,
    );
    return () => clearInterval(timer);
  }, [state.playing, state.epoch, active?.id, ready]);
  useEffect(() => {
    if (expanded && !state.tasks.some((t) => t.id === expanded))
      setExpanded(null);
  }, [state.tasks, expanded]);
  function reset() {
    dispatch({ type: "reset", tasks: QUEUE_TASKS });
    setExpanded(null);
    setStackOpen(false);
    setAnswers({});
    setSteps({});
    setContexts({});
    setDraft("");
    setAttached(false);
    setValidation("");
    setScenario("ready");
  }
  function submit(value: string) {
    if (!value.trim() || value.trim().length > 500) {
      setValidation("Write a task of 1–500 characters.");
      return;
    }
    dispatch({
      type: "add",
      task: newQueueTask(
        `custom-${++counter.current}`,
        value,
        attached ? "Use the local Project brief.md fixture." : "",
      ),
    });
    setDraft("");
    setAttached(false);
    setValidation("");
  }
  function detail(task: QueueTask) {
    return (
      <>
        {task.status === "needs-context" && task.questions && (
          <TaskClarification
            questions={task.questions}
            answers={answers[task.id] ?? task.answers}
            step={steps[task.id] ?? 0}
            onChange={(value) =>
              setAnswers((old) => ({ ...old, [task.id]: value }))
            }
            onStepChange={(step) =>
              setSteps((old) => ({ ...old, [task.id]: step }))
            }
            onSubmit={() => {
              dispatch({
                type: "answer",
                id: task.id,
                answers: answers[task.id] ?? task.answers,
              });
              const title = Array.from(
                root.current?.querySelectorAll<HTMLButtonElement>(
                  "[data-task-id]",
                ) ?? [],
              ).find((button) => button.dataset.taskId === task.id);
              title?.focus();
              setExpanded(null);
            }}
          />
        )}
        <form
          className="aq-context-editor"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({
              type: "context",
              id: task.id,
              value: contexts[task.id] ?? task.context,
            });
          }}
        >
          <label>
            Additional context
            <textarea
              rows={3}
              aria-label={`Additional context for ${task.title}`}
              value={contexts[task.id] ?? task.context}
              onChange={(e) =>
                setContexts((old) => ({ ...old, [task.id]: e.target.value }))
              }
              maxLength={2000}
              placeholder="Add more context for the agent…"
            />
          </label>
          <div>
            <span>{QUEUE_LABELS[task.status]}</span>
            <Button
              type="secondary"
              size="sm"
              render={<button type="submit" />}
            >
              Save context
            </Button>
          </div>
        </form>
      </>
    );
  }
  return (
    <div ref={root} className={dark ? "theme-dark" : ""}>
      <div className="aq-page">
        <header className="aq-sitebar">
          <a href="/agent-task-queue">
            <OreoLogo className="h-5 w-8" />
            Oreo UI<span>/ Agent queue</span>
          </a>
          <div>
            <span className="aq-local">Local demo</span>
            <IconButton
              type="tertiary"
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              onClick={() => setDark(!dark)}
            />
            <Button type="secondary" size="sm" onClick={reset}>
              Reset demo
            </Button>
          </div>
        </header>
        <main className="aq-workbench">
          <section className="aq-preview" aria-label="Project workspace">
            <header className="aq-project-heading">
              <div className="aq-project-mark">
                <Icon name="columns" />
              </div>
              <div>
                <p>WORKSPACE / PRODUCT</p>
                <h1>A quieter way to build.</h1>
              </div>
            </header>
            <div className="aq-project-toolbar">
              <span>
                <Icon name="cursor" size="sm" /> Product canvas
              </span>
              <span className="aq-preview-chip">Live sample</span>
            </div>
            <div className="aq-canvas">
              <div className="aq-canvas-window">
                <div className="aq-window-bar">
                  <span />
                  <span />
                  <span />
                  <p>Project / Overview</p>
                </div>
                <div className="aq-canvas-content">
                  <p className="aq-eyebrow">YOUR NEXT RELEASE</p>
                  <h2>
                    Good work.
                    <br />
                    One task at a time.
                  </h2>
                  <p className="aq-canvas-description">
                    Keep your ideas coming. The queue makes room for the next
                    one.
                  </p>
                  <div className="aq-progress-card">
                    <header>
                      <span>Session progress</span>
                      <strong>
                        {done.length} / {state.tasks.length}
                      </strong>
                    </header>
                    <progress
                      aria-label="Completed tasks"
                      value={done.length}
                      max={Math.max(1, state.tasks.length)}
                    />
                    <p>
                      {active
                        ? active.title
                        : needs.length
                          ? `${needs.length} request${needs.length === 1 ? "" : "s"} waiting for your input`
                          : "Ready for the next idea"}
                    </p>
                  </div>
                  <div className="aq-deliverables">
                    <h3>Completed in this session</h3>
                    {done.length ? (
                      <ul>
                        {done.map((task) => (
                          <li key={task.id}>
                            <Icon name="check" size="sm" />
                            <span>{task.title}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        Completed tasks will appear here as the sample agent
                        works.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <p className="aq-canvas-caption">
                Illustrative workspace · Task results are simulated locally.
              </p>
            </div>
            <footer className="aq-project-footer">
              <a href="/agent-task-queue">Components & API →</a>
              <a
                href="https://x.com/eyexayuh/status/2112042083536236933"
                target="_blank"
                rel="noreferrer"
              >
                Reference by Isaiah ↗
              </a>
            </footer>
          </section>
          <AgentWorkspacePanel
            title="Agent session"
            icon="sparkle"
            className="aq-agent"
            actions={
              <Button
                type="secondary"
                size="sm"
                onClick={() => {
                  setScenario("ready");
                  dispatch({ type: state.playing ? "pause-session" : "play" });
                }}
              >
                {state.playing ? "Pause session" : "Start session"}
              </Button>
            }
            footer={
              <div className="aq-composer">
                <PromptBox
                  value={draft}
                  onValueChange={(v) => {
                    setDraft(v);
                    setValidation("");
                  }}
                  onSubmit={submit}
                  placeholder="Ask the agent to do something"
                  onAttach={() => setAttached(!attached)}
                  onMention={() =>
                    setDraft(
                      (old) =>
                        old +
                        (old.endsWith(" ") || !old ? "" : " ") +
                        "@Project ",
                    )
                  }
                  attachments={
                    attached ? (
                      <Attachment
                        label="Project brief.md"
                        type="text"
                        onRemove={() => setAttached(false)}
                      />
                    ) : undefined
                  }
                  modelSelect={
                    <span className="aq-composer-mode">
                      <Icon name="sparkle" size="sm" />
                      Local agent
                    </span>
                  }
                />
                {validation && (
                  <p className="aq-error" role="alert">
                    {validation}
                  </p>
                )}
                <p className="aq-composer-note">
                  Keep adding tasks while the session runs.
                </p>
              </div>
            }
          >
            <div className="aq-session-toolbar">
              <span>
                <i
                  data-playing={
                    (state.playing && !!active && ready) || undefined
                  }
                />
                {state.playing
                  ? active
                    ? "Working through your queue"
                    : "Waiting for a runnable task"
                  : "Session paused"}
              </span>
              <label>
                <span className="sr-only">Preview state</span>
                <select
                  aria-label="Preview state"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                >
                  <option value="ready">Ready</option>
                  <option value="loading">Loading</option>
                  <option value="error">Connection error</option>
                </select>
              </label>
            </div>
            <div className="aq-queue-content">
              <QueuedRequestStack
                requests={state.tasks}
                expanded={stackOpen}
                onExpandedChange={setStackOpen}
              />
              <AgentTaskQueue
                tasks={scenario === "loading" ? [] : state.tasks}
                expandedId={expanded}
                onExpand={setExpanded}
                onMove={(id, over) => dispatch({ type: "move", id, over })}
                onPause={(id) => dispatch({ type: "pause-task", id })}
                onResume={(id) => dispatch({ type: "resume-task", id })}
                onRemove={(id) => dispatch({ type: "remove", id })}
                renderDetail={detail}
                suspended={!state.playing || !ready}
                loading={scenario === "loading"}
                error={
                  scenario === "error"
                    ? "The sample connection was interrupted. Your queue is preserved."
                    : undefined
                }
                onRetry={() => setScenario("ready")}
                onReset={reset}
              />
            </div>
            <div className="aq-notice">
              <p role="status">{state.notice}</p>
              {state.removed.length > 0 && (
                <Button
                  type="tertiary"
                  size="sm"
                  onClick={() => dispatch({ type: "undo" })}
                >
                  Undo removal
                </Button>
              )}
            </div>
          </AgentWorkspacePanel>
        </main>
      </div>
    </div>
  );
}

import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  ThinkingState,
  ThinkingTimeline,
  type ThinkingTone,
} from "@/components/thinking-state";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { PromptBox } from "@/components/prompt-box";
import { AgentWorkspaceState } from "@/components/automation";
import { BRIEFS, STEPS } from "./data";
import "./thinking-workspace.css";

import { initial, runReducer } from "./run-state";
export function ThinkingWorkspace() {
  const [dark, setDark] = useThemeMode(false),
    [draft, setDraft] = useState(""),
    [question, setQuestion] = useState("");
  const [run, dispatch] = useReducer(runReducer, initial);
  const [tone, setTone] = useState<ThinkingTone>("mint"),
    [shape, setShape] = useState<"square" | "circle">("square"),
    [speed, setSpeed] = useState(1),
    [fail, setFail] = useState(false);
  const [notice, setNotice] = useState(""),
    [saved, setSaved] = useState(false),
    [validation, setValidation] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const busy = run.status === "running" || run.status === "paused";
  const current =
    run.status === "error" ? 2 : Math.min(5, Math.floor(run.ticks / 3));
  const brief = BRIEFS.find((b) => b.prompt === question);
  const answer = brief?.answer ?? [
    "Define the outcome you want and who the work should help.",
    "List the essential constraints, then divide the work into a small first version and later improvements.",
    "Choose one concrete next step and review it with the people who will use the result.",
  ];
  useEffect(() => {
    if (run.status !== "running") return;
    const timer = window.setInterval(() => dispatch({ type: "tick" }), 500);
    return () => window.clearInterval(timer);
  }, [run.status]);
  function start(value: string, retry = false) {
    const clean = value.trim();
    if (!clean) {
      setValidation("Add a brief or choose a starter below.");
      return;
    }
    if (clean.length > 2000) {
      setValidation("Keep the brief under 2,000 characters.");
      return;
    }
    setQuestion(clean);
    setDraft("");
    setSaved(false);
    setNotice("");
    setValidation("");
    dispatch({ type: "start", fail: retry ? false : fail });
  }
  function stop() {
    dispatch({ type: "stop" });
    requestAnimationFrame(() => heading.current?.focus());
  }
  function reset() {
    dispatch({ type: "reset" });
    setQuestion("");
    setDraft("");
    setNotice("");
    setSaved(false);
    setValidation("");
    requestAnimationFrame(() => heading.current?.focus());
  }
  function choose(prompt: string) {
    setDraft(prompt);
    setValidation("");
    setNotice("Starter added to the composer. Send it when you’re ready.");
  }
  const summary =
    run.status === "running"
      ? STEPS[current].label
      : run.status === "paused"
        ? "Run paused"
        : run.status === "complete"
          ? "Outline ready"
          : run.status === "error"
            ? "Context unavailable"
            : run.status === "stopped"
              ? "Run stopped"
              : "Ready when you are";
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="thinking-workspace">
        <aside className="tw-sidebar">
          <a className="tw-brand" href="/thinking-state">
            <span>
              <Icon name="sparkle" />
            </span>
            oreo<span className="tw-brand-slash">/</span>
          </a>
          <Button
            type="secondary"
            tapScale={1}
            onClick={reset}
            leadingIcon={<Icon name="plus" />}
          >
            New brief
          </Button>
          <div className="tw-sidebar-label">STARTER BRIEFS</div>
          <nav aria-label="Starter briefs">
            {BRIEFS.map((b) => (
              <button
                key={b.id}
                type="button"
                disabled={busy}
                onClick={() => choose(b.prompt)}
              >
                <Icon name={b.icon} />
                <span>{b.title}</span>
              </button>
            ))}
          </nav>
          <div className="tw-sidebar-note">
            <ThinkingState
              active={false}
              tone="mint"
              label="A little space to think"
            />
            <p>
              Small steps. Clear signals.
              <br />A calmer way to work.
            </p>
          </div>
          <a className="tw-docs" href="/thinking-state">
            <Icon name="book-open" size="sm" /> Component documentation{" "}
            <Icon name="arrow-up-right" size="sm" />
          </a>
          <div className="tw-profile">
            <Avatar name="Alex Morgan" size="sm" />
            <span>
              Personal workspace<small>Local demo</small>
            </span>
          </div>
        </aside>
        <div className="tw-body">
          <header className="tw-topbar">
            <div>
              <span>Workspace</span>
              <Icon name="chevron-right" size="sm" />
              <strong>Thinking room</strong>
            </div>
            <div>
              <Tag>Interactive demo</Tag>
              <IconButton
                aria-label={dark ? "Use light theme" : "Use dark theme"}
                type="tertiary"
                tapScale={1}
                icon={<Icon name={dark ? "sun" : "moon"} />}
                onClick={() => setDark(!dark)}
              />
              <Button
                className="tw-mobile-new"
                size="sm"
                type="secondary"
                tapScale={1}
                onClick={reset}
              >
                New brief
              </Button>
            </div>
          </header>
          <div className="tw-layout">
            <main className="tw-conversation">
              <header className="tw-title">
                <span>THINKING WORKSPACE</span>
                <h1 ref={heading} tabIndex={-1}>
                  {question
                    ? "From a brief to a direction."
                    : "Make room for a clearer idea."}
                </h1>
                <p>
                  A small workspace for the moments between a question and an
                  answer.
                </p>
              </header>
              {notice && (
                <div className="tw-notice" role="status">
                  {notice}
                  <IconButton
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    aria-label="Dismiss notice"
                    icon={<Icon name="x" />}
                    onClick={() => setNotice("")}
                  />
                </div>
              )}
              {question ? (
                <div className="tw-thread">
                  <section className="tw-question">
                    <Avatar name="Alex Morgan" size="sm" />
                    <div>
                      <strong>You</strong>
                      <p>{question}</p>
                    </div>
                  </section>
                  <section
                    className="tw-response"
                    aria-label="Assistant response"
                  >
                    <div className="tw-assistant-mark">
                      <Icon name="sparkle" />
                    </div>
                    <div className="tw-response-content">
                      <header>
                        <strong>Oreo</strong>
                        <span>Sample assistant</span>
                      </header>
                      <div
                        className="tw-run-label"
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        <ThinkingState
                          phase={STEPS[current].id}
                          label={summary}
                          active={run.status === "running"}
                          shape={shape}
                          tone={tone}
                          speed={speed}
                          announce={false}
                        />
                      </div>
                      {busy && (
                        <>
                          <p className="tw-run-description">
                            {run.status === "paused"
                              ? "Everything stays here. Resume whenever you’re ready."
                              : STEPS[current].detail}
                          </p>
                          <div className="tw-run-actions">
                            <Button
                              size="sm"
                              type="secondary"
                              tapScale={1}
                              onClick={() =>
                                dispatch({
                                  type:
                                    run.status === "paused"
                                      ? "resume"
                                      : "pause",
                                })
                              }
                            >
                              {run.status === "paused"
                                ? "Resume run"
                                : "Pause run"}
                            </Button>
                            <Button
                              size="sm"
                              type="tertiary"
                              tapScale={1}
                              onClick={stop}
                            >
                              Stop run
                            </Button>
                          </div>
                        </>
                      )}
                      {run.status === "complete" && (
                        <>
                          <p className="tw-answer-intro">
                            {brief
                              ? "Here’s a starting point for your brief."
                              : "Here’s a general brief structure to adapt to your request."}
                          </p>
                          <ol className="tw-answer">
                            {answer.map((a, i) => (
                              <li key={a}>
                                <span>{String(i + 1).padStart(2, "0")}</span>
                                <p>{a}</p>
                              </li>
                            ))}
                          </ol>
                          <div className="tw-result-note">
                            <Icon name="info" size="sm" />
                            Prewritten local example · No AI or web search was
                            used.
                          </div>
                          <div className="tw-result-actions">
                            <Button
                              type="secondary"
                              size="sm"
                              tapScale={1}
                              leadingIcon={<Icon name="copy" size="sm" />}
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(
                                    question +
                                      "\n\n" +
                                      answer
                                        .map((a, i) => `${i + 1}. ${a}`)
                                        .join("\n\n"),
                                  );
                                  setNotice("Outline copied.");
                                } catch {
                                  setNotice(
                                    "Copy was unavailable. Select the outline text to copy it manually.",
                                  );
                                }
                              }}
                            >
                              Copy outline
                            </Button>
                            <Button
                              type="tertiary"
                              size="sm"
                              tapScale={1}
                              aria-pressed={saved}
                              leadingIcon={
                                <Icon
                                  name="star"
                                  size="sm"
                                  weight={saved ? "fill" : "regular"}
                                />
                              }
                              onClick={() => {
                                setSaved(!saved);
                                setNotice(
                                  saved
                                    ? "Outline removed from saved."
                                    : "Outline marked as saved.",
                                );
                              }}
                            >
                              {saved ? "Saved" : "Save outline"}
                            </Button>
                            <Button
                              type="tertiary"
                              size="sm"
                              tapScale={1}
                              onClick={() => start(question, true)}
                            >
                              Run again
                            </Button>
                          </div>
                        </>
                      )}
                      {run.status === "error" && (
                        <div role="alert">
                          <AgentWorkspaceState
                            title="The sample notes could not be opened"
                            description="This is the selected demo failure. Retry uses the available local notes and keeps your brief."
                            actionLabel="Retry with sample notes"
                            onAction={() => start(question, true)}
                          />
                        </div>
                      )}
                      {run.status === "stopped" && (
                        <AgentWorkspaceState
                          title="Stopped before finishing"
                          description="Your brief is still here. Start a fresh run when you’re ready."
                          actionLabel="Restart run"
                          onAction={() => start(question, true)}
                        />
                      )}
                    </div>
                  </section>
                </div>
              ) : (
                <div className="tw-welcome">
                  <div className="tw-welcome-symbol">
                    <ThinkingState active={false} label="" tone="mint" />
                  </div>
                  <h2>Start with a little curiosity.</h2>
                  <p>
                    Choose a brief, or bring your own. Watch each stage take
                    shape.
                  </p>
                  <div className="tw-starters">
                    {BRIEFS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => choose(b.prompt)}
                      >
                        <Icon name={b.icon} />
                        <span>{b.eyebrow}</span>
                        <strong>{b.title}</strong>
                        <Icon name="arrow-up-right" size="sm" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="tw-composer">
                <PromptBox
                  value={draft}
                  onValueChange={setDraft}
                  onSubmit={(value) => start(value)}
                  running={busy}
                  onStop={stop}
                  submitDisabled={busy}
                  tapScale={1}
                  placeholder="What would you like to explore?"
                  modelSelect={
                    <span className="tw-model">
                      <Icon name="sparkle" size="sm" />
                      Local sample
                    </span>
                  }
                />
                {validation && (
                  <p className="tw-validation" role="alert">
                    {validation}
                  </p>
                )}
                <p className="tw-composer-note">
                  Local demonstration · Runs use a fixed sequence · Changes
                  reset on reload
                </p>
              </div>
            </main>
            <aside className="tw-inspector" aria-label="Run details">
              <section className="tw-activity">
                <header>
                  <h2>Run activity</h2>
                  <span>
                    {run.status === "complete"
                      ? "6 / 6"
                      : run.status === "idle"
                        ? "—"
                        : `${current + 1} / 6`}
                  </span>
                </header>
                <p className="tw-panel-description">
                  A clear signal for every step.
                </p>
                <ThinkingTimeline
                  steps={STEPS}
                  current={current}
                  status={run.status}
                  tone={tone}
                  shape={shape}
                  speed={speed}
                />
              </section>
              <section className="tw-appearance">
                <h2>Make it yours</h2>
                <fieldset>
                  <legend>Pixel shape</legend>
                  {(["square", "circle"] as const).map((v) => (
                    <button
                      type="button"
                      key={v}
                      aria-pressed={shape === v}
                      onClick={() => setShape(v)}
                    >
                      {v === "square" ? "Square" : "Circle"}
                    </button>
                  ))}
                </fieldset>
                <fieldset className="tw-tones">
                  <legend>Signal color</legend>
                  {(["neutral", "mint", "purple", "orange"] as const).map(
                    (v) => (
                      <button
                        type="button"
                        data-tone={v}
                        key={v}
                        aria-label={`${v} signal`}
                        aria-pressed={tone === v}
                        onClick={() => setTone(v)}
                      >
                        <span />
                        {tone === v && <Icon name="check" size="sm" />}
                      </button>
                    ),
                  )}
                </fieldset>
                <label className="tw-speed">
                  Motion speed <span>{speed.toFixed(2)}×</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.25"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                  />
                </label>
                <p>Controls the pixels, not the run duration.</p>
              </section>
              <details className="tw-demo">
                <summary>Demo scenario</summary>
                <label>
                  <input
                    type="checkbox"
                    checked={fail}
                    disabled={busy}
                    onChange={(e) => setFail(e.target.checked)}
                  />{" "}
                  Stop with a context error
                </label>
                <p>
                  Applies to the next new run. Retry always uses the available
                  sample notes.
                </p>
              </details>
              <a
                className="tw-source"
                href="https://x.com/purpose_walker/status/2110382989414740308"
                target="_blank"
                rel="noreferrer"
              >
                Inspired by Purpose Walker{" "}
                <Icon name="arrow-up-right" size="sm" />
              </a>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

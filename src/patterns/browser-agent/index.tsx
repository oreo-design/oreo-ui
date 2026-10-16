import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { ThinkingState } from "@/components/thinking-state";
import { Plan, PlanStep } from "@/components/plan";
import { AgentWorkspaceState } from "@/components/automation";
import {
  BrowserSessionTabs,
  BrowserControlBar,
  advanceRun,
  INITIAL_RUN,
  ACTION_LABELS,
  type BrowserTab,
  type RunEvent,
} from "@/components/browser-session";
import { ARTICLES, SCENARIOS, type ScenarioId } from "./data";
import "./workspace.css";
export function BrowserAgentPage() {
  const [dark, setDark] = useState(true),
    [scenario, setScenario] = useState<ScenarioId>("research"),
    [run, setRun] = useState(INITIAL_RUN),
    [active, setActive] = useState("chat"),
    [openTabs, setOpenTabs] = useState(["guide"]),
    [auto, setAuto] = useState(false),
    [query, setQuery] = useState(""),
    [article, setArticle] = useState<keyof typeof ARTICLES>("overview"),
    [notes, setNotes] = useState(""),
    [notice, setNotice] = useState("");
  const model = SCENARIOS[scenario],
    step = model.steps[Math.min(run.completed, model.steps.length - 1)],
    live = ["running", "paused", "user", "error"].includes(run.status);
  const next = () =>
    setRun((r) => advanceRun(r, { type: "tick" }, model.steps.length));
  const send = (event: RunEvent) =>
    setRun((r) => advanceRun(r, event, model.steps.length));
  const reset = (id: ScenarioId = scenario) => {
    setScenario(id);
    setRun(INITIAL_RUN);
    setAuto(false);
    setActive("chat");
    setOpenTabs(["guide"]);
    setQuery("");
    setArticle("overview");
    setNotes("");
    setNotice("");
  };
  const start = () => {
    setActive("chat");
    setOpenTabs(["guide"]);
    setArticle("overview");
    setQuery("");
    setNotes("");
    setNotice("");
    send({ type: "start" });
  };
  // The host alone owns execution; visual indicators never advance the run.
  useEffect(() => {
    if (run.status !== "running" || !auto) return;
    const timer = window.setTimeout(
      () => setRun((r) => advanceRun(r, { type: "tick" }, model.steps.length)),
      2400,
    );
    return () => window.clearTimeout(timer);
  }, [run.status, run.completed, auto, model.steps.length]);
  const applied = useRef(0);
  useEffect(() => {
    if (run.completed === 0) {
      applied.current = 0;
      return;
    }
    if (applied.current >= run.completed) return;
    for (const done of model.steps.slice(applied.current, run.completed)) {
      if (done.tab === "notes")
        setOpenTabs((t) => (t.includes("notes") ? t : [...t, "notes"]));
      else setArticle(done.article);
      setQuery(done.query ?? "");
    }
    applied.current = run.completed;
    if (run.status === "complete")
      setNotice(
        "All six sample actions completed. Review the reading list in Notes.",
      );
  }, [run.completed, run.status, model.steps]);
  // Keep a pending target present before the step executes, without stealing selected-tab focus.
  useEffect(() => {
    if (live && step.tab === "notes")
      setOpenTabs((t) => (t.includes("notes") ? t : [...t, "notes"]));
  }, [live, step.tab]);
  const tabs: BrowserTab[] = [
    { id: "chat", title: model.title, icon: "chat", closable: false },
    ...openTabs.map((id) => ({
      id,
      title: id === "guide" ? ARTICLES[article].title : "Reading list",
      icon: "globe" as const,
      closable: !live,
      activity:
        live && step.tab === id
          ? { status: run.status, action: step.action }
          : undefined,
    })),
  ];
  const close = (id: string) => {
    setOpenTabs((t) => t.filter((x) => x !== id));
    if (active === id) setActive("chat");
  };
  const results = (Object.keys(ARTICLES) as (keyof typeof ARTICLES)[]).filter(
    (id) =>
      id !== "notes" &&
      [
        ARTICLES[id].title,
        ARTICLES[id].intro,
        ...ARTICLES[id].sections.flatMap((s) => [s.title, s.body]),
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const canEdit =
    run.status === "user" ||
    run.status === "ready" ||
    run.status === "complete" ||
    run.status === "stopped";
  const renderDocument = (tab: BrowserTab) => {
    const content = ARTICLES[tab.id === "notes" ? "notes" : article];
    return (
      <div className="ba-browser">
        <div className="ba-address">
          <Icon name="globe" size="sm" />
          <span>
            oreo.local / guides / {tab.id === "notes" ? "notes" : article}
          </span>
          <Tag>Sample page</Tag>
        </div>
        <div className="ba-browser-scroll">
          <div className="ba-doc-nav">
            <strong>
              oreo<span> / guides</span>
            </strong>
            <button
              onClick={() => {
                setArticle("overview");
                setQuery("");
              }}
              disabled={!canEdit || tab.id === "notes"}
            >
              Overview
            </button>
          </div>
          {tab.id === "guide" && (
            <div className="ba-doc-search">
              <label>
                <Icon name="search" size="sm" />
                <input
                  aria-label="Search sample documentation"
                  placeholder="Search the guides…"
                  value={query}
                  disabled={!canEdit}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              {!canEdit && <span>Take over to search this sample page.</span>}
            </div>
          )}
          {query && tab.id === "guide" ? (
            <section className="ba-results">
              <h2>Search results for “{query}”</h2>
              {results.length ? (
                results.map((id) => (
                  <button
                    key={id}
                    disabled={!canEdit}
                    onClick={() => {
                      setArticle(id);
                      setQuery("");
                    }}
                  >
                    <strong>{ARTICLES[id].title}</strong>
                    <span>{ARTICLES[id].intro}</span>
                    <Icon name="arrow-up-right" size="sm" />
                  </button>
                ))
              ) : (
                <AgentWorkspaceState
                  title="No guide found"
                  description="Try searching for memory, tools or control."
                  actionLabel="Clear search"
                  onAction={() => setQuery("")}
                />
              )}
            </section>
          ) : (
            <article className="ba-article">
              <p className="ba-eyebrow">{content.eyebrow}</p>
              <h1>{content.title}</h1>
              <p className="ba-lede">{content.intro}</p>
              <div className="ba-doc-graphic" aria-hidden>
                <div>
                  <Icon name="globe" size="xl" />
                </div>
                <span />
                <div>
                  <Icon name="cursor" size="xl" />
                </div>
                <span />
                <div>
                  <Icon name="check" size="xl" />
                </div>
              </div>
              {content.sections.map((s, i) => (
                <section key={s.title}>
                  <span className="ba-section-no">0{i + 1}</span>
                  <div>
                    <h2>{s.title}</h2>
                    <p>{s.body}</p>
                  </div>
                </section>
              ))}
              <label className="ba-notes">
                Your session notes
                <textarea
                  value={notes}
                  disabled={!canEdit}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take over to add a note…"
                  rows={3}
                />
              </label>
              <p className="ba-note-help">
                Notes stay in this local demo until you start a fresh run.
              </p>
            </article>
          )}
        </div>
      </div>
    );
  };
  return (
    <div className={`ba-workspace ${dark ? "theme-dark" : ""}`}>
      <aside className="ba-sidebar">
        <a className="ba-brand" href="/browser-session-tabs">
          <Icon name="circle-dashed" size="lg" />
          <strong>oreo studio</strong>
        </a>
        <Button
          type="secondary"
          size="sm"
          tapScale={1}
          leadingIcon={<Icon name="plus" size="sm" />}
          onClick={() => reset()}
        >
          New session
        </Button>
        <nav aria-label="Sample tasks">
          <p>WORKSPACE</p>
          <strong className="ba-project">Browser research</strong>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button
              key={id}
              aria-current={scenario === id ? "page" : undefined}
              onClick={() => reset(id)}
            >
              <Icon name="chat" size="sm" />
              <span>{SCENARIOS[id].title}</span>
              {scenario === id && run.status === "running" && (
                <span className="ba-side-indicator" aria-hidden>
                  <ThinkingState
                    shape="circle"
                    grid={false}
                    label=""
                    announce={false}
                  />
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="ba-side-note">
          <Icon name="globe" />
          <p>Your browser, in view.</p>
          <span>
            Keep track of every action.
            <br />
            Step in whenever you need.
          </span>
        </div>
        <footer>
          <a href="/browser-control-bar">Component docs ↗</a>
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </footer>
      </aside>
      <main className="ba-main">
        <header className="ba-header">
          <div>
            <span>Oreo Studio</span>
            <span>/</span>
            <strong>Browser session</strong>
          </div>
          <Tag>Local scripted demo</Tag>
        </header>
        <div className="ba-body">
          <div className="ba-session">
            <BrowserSessionTabs
              tabs={tabs}
              value={active}
              onValueChange={setActive}
              onClose={close}
              onAdd={
                openTabs.length < 2
                  ? () => {
                      setOpenTabs((t) =>
                        t.includes("guide") ? [...t, "notes"] : [...t, "guide"],
                      );
                      setActive(openTabs.includes("guide") ? "notes" : "guide");
                    }
                  : undefined
              }
              renderPanel={(tab) =>
                tab.id === "chat" ? (
                  <div className="ba-chat">
                    <div className="ba-chat-intro">
                      <span className="ba-eyebrow">BROWSER RESEARCH</span>
                      <h1>Stay close to the work.</h1>
                      <p>
                        A conversation, a few useful pages, and a clear view of
                        who is in control.
                      </p>
                    </div>
                    <div className="ba-user-message">
                      <span>You</span>
                      <p>{model.request}</p>
                    </div>
                    <div className="ba-agent-message">
                      <div className="ba-agent-avatar">
                        <Icon name="assistant" />
                      </div>
                      <div>
                        <strong>Oreo assistant</strong>
                        <p>
                          I’ll work through six local sample actions. You can
                          watch the tab signal, follow the activity, or take
                          over at any time.
                        </p>
                        <div className="ba-plan">
                          <Plan title="Browsing plan">
                            {model.steps.map((s, i) => (
                              <PlanStep
                                key={s.label}
                                status={
                                  i < run.completed
                                    ? "done"
                                    : i === run.completed &&
                                        run.status === "running"
                                      ? "active"
                                      : "pending"
                                }
                              >
                                {s.label}
                              </PlanStep>
                            ))}
                          </Plan>
                        </div>
                        {run.status === "complete" && (
                          <div className="ba-complete">
                            <Icon name="check" />
                            <div>
                              <strong>Reading list ready</strong>
                              <p>
                                Reviewed browser tools and handoff rules. The
                                notes tab contains three takeaways.
                              </p>
                              <Button
                                type="secondary"
                                size="sm"
                                tapScale={1}
                                onClick={() => {
                                  setOpenTabs((t) =>
                                    t.includes("notes") ? t : [...t, "notes"],
                                  );
                                  setActive("notes");
                                }}
                              >
                                Read the summary
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="ba-fixture-note">
                      This template operates on sample pages. It does not
                      control your real browser or send a prompt to an AI
                      service.
                    </p>
                  </div>
                ) : (
                  renderDocument(tab)
                )
              }
            />
          </div>
          <aside className="ba-activity">
            <header>
              <h2>Session activity</h2>
              <span>
                {run.completed} / {model.steps.length}
              </span>
            </header>
            <div className="ba-activity-body">
              <p className="ba-activity-caption">
                The working tab stays marked while you switch views.
              </p>
              <ol>
                {model.steps.map((s, i) => (
                  <li
                    key={s.label}
                    data-current={(i === run.completed && live) || undefined}
                    data-done={i < run.completed || undefined}
                  >
                    <span className="ba-step-mark">
                      {i < run.completed ? (
                        <Icon name="check" size="sm" />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <div>
                      <strong>{s.label}</strong>
                      <p>{s.detail}</p>
                      <span>
                        {i < run.completed
                          ? "Completed"
                          : i === run.completed && live
                            ? run.status === "running"
                              ? ACTION_LABELS[s.action]
                              : run.status === "user"
                                ? "Your turn"
                                : run.status === "error"
                                  ? "Failed"
                                  : "Paused"
                            : "Pending"}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <footer>
              <label>
                <input
                  type="checkbox"
                  checked={auto}
                  onChange={(e) => setAuto(e.target.checked)}
                />
                Auto-advance sample
              </label>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                disabled={run.status !== "running"}
                onClick={next}
              >
                Next action
              </Button>
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                disabled={run.status !== "running"}
                onClick={() =>
                  send({
                    type: "fail",
                    message:
                      "The sample page did not respond. Retry this step to continue.",
                  })
                }
              >
                Simulate error
              </Button>
            </footer>
          </aside>
        </div>
        <div className="ba-bottom">
          <BrowserControlBar
            status={run.status}
            action={step.action}
            target={
              step.tab === "guide" ? ARTICLES[article].title : "Reading list"
            }
            detail={run.status === "error" ? run.error : undefined}
            onStart={start}
            onPause={() => send({ type: "pause" })}
            onResume={() => send({ type: "resume" })}
            onTakeOver={() => {
              send({ type: "takeover" });
              setActive(step.tab);
            }}
            onReturnControl={() => send({ type: "return" })}
            onStop={() => send({ type: "stop" })}
            onRetry={() => send({ type: "retry" })}
          />
          <div className="ba-footer">
            <span role="status">
              {notice || "Local session · Step manually or enable auto-advance"}
            </span>
            <a
              href="https://x.com/yogesharc/status/2110796597454102593"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Yogesh ↗
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

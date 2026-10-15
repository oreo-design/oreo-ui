import { useEffect, useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import {
  AskAnalytics,
  InsightSources,
  type AnalyticsRequest,
} from "@/components/ask-analytics";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { OreoLogo } from "@/docs/OreoLogo";
import { ANALYTICS_SOURCES, SUGGESTIONS, TRIAL_DAYS, answerFor } from "./data";
import "./analytics-assistant.css";

type SavedInsight = Extract<AnalyticsRequest, { status: "success" }>;
export function AnalyticsAssistant() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<"overview" | "saved">("overview");
  const [value, setValue] = useState("");
  const [request, setRequest] = useState<AnalyticsRequest>({ status: "idle" });
  const [saved, setSaved] = useState<SavedInsight[]>([]);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [failNext, setFailNext] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const source = ANALYTICS_SOURCES.find((s) => s.id === sourceId);
  const sourceOpener = useRef<HTMLElement | null>(null);
  const savedRef = useRef<HTMLButtonElement>(null);
  const overviewRef = useRef<HTMLButtonElement>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setRequest({ status: "idle" });
  };
  function ask(question: string) {
    if (timer.current) clearTimeout(timer.current);
    setValue(question);
    setRequest({ status: "loading", question });
    const shouldFail = failNext;
    setFailNext(false);
    timer.current = setTimeout(() => {
      timer.current = null;
      if (shouldFail) {
        setRequest({
          status: "error",
          question,
          message:
            "The demo connection was interrupted. Your question is kept; try again to reconnect.",
        });
        return;
      }
      const answer = answerFor(question);
      setRequest(
        answer
          ? { status: "success", question, answer }
          : { status: "empty", question },
      );
    }, 1200);
  }
  function openSource(id: string) {
    sourceOpener.current = document.activeElement as HTMLElement;
    setSourceId(id);
    setSourceOpen(true);
  }
  const isSaved =
    request.status === "success" &&
    saved.some((s) => s.question === request.question);
  function toggleSave() {
    if (request.status !== "success") return;
    setSaved((items) =>
      isSaved
        ? items.filter((s) => s.question !== request.question)
        : [request, ...items],
    );
  }
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="analytics-root">
        <header className="analytics-topbar">
          <a href="/" aria-label="Oreo UI components">
            <OreoLogo className="h-5 w-7" />
            <span>
              Oreo <span className="analytics-wordmark">Analytics</span>
            </span>
          </a>
          <div className="analytics-workspace-label">
            Acme workspace <span>Demo</span>
          </div>
          <IconButton
            type="tertiary"
            tapScale={1}
            aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setDark(!dark)}
            icon={<Icon name={dark ? "sun" : "moon"} />}
          />
        </header>
        <main className="analytics-main">
          <div className="analytics-heading">
            <div>
              <p className="analytics-eyebrow">WORKSPACE OVERVIEW</p>
              <h1>A little clarity, every day.</h1>
              <p>Understand what changed. Find your next move.</p>
            </div>
            <span className="analytics-period">
              <Icon name="calendar" size="sm" /> Sep 15 – 21, 2026
            </span>
          </div>
          <nav className="analytics-tabs" aria-label="Analytics views">
            <button
              ref={overviewRef}
              type="button"
              aria-current={view === "overview" ? "page" : undefined}
              onClick={() => setView("overview")}
            >
              <Icon name="chart-line" size="sm" /> Overview
            </button>
            <button
              ref={savedRef}
              type="button"
              aria-current={view === "saved" ? "page" : undefined}
              onClick={() => setView("saved")}
            >
              <Icon name="book-open" size="sm" /> Saved insights{" "}
              <span>{saved.length}</span>
            </button>
            <span className="analytics-live">
              <i /> Sample data
            </span>
          </nav>
          {view === "overview" ? (
            <>
              <section
                className="analytics-metrics"
                aria-label="Weekly metrics"
              >
                {[
                  {
                    label: "Trial signups",
                    value: "1,279",
                    change: "−18.0%",
                    detail: "vs. 1,560 last week",
                    icon: "chart-line" as const,
                  },
                  {
                    label: "Website visits",
                    value: "18,400",
                    change: "",
                    detail: "All traffic sources",
                    icon: "globe" as const,
                  },
                  {
                    label: "Trial conversion",
                    value: "6.95%",
                    change: "",
                    detail: "Trial starts ÷ visits",
                    icon: "gauge" as const,
                  },
                  {
                    label: "Team invitations",
                    value: "192",
                    change: "",
                    detail: "Across 3 sample teams",
                    icon: "users" as const,
                  },
                ].map((metric) => (
                  <article key={metric.label} className="analytics-metric">
                    <div>
                      <span>{metric.label}</span>
                      <Icon name={metric.icon} size="sm" />
                    </div>
                    <strong>{metric.value}</strong>
                    <p>
                      {metric.change && <span>{metric.change}</span>}
                      {metric.detail}
                    </p>
                  </article>
                ))}
              </section>
              <div className="analytics-grid">
                <div className="analytics-data-column">
                  <section
                    className="analytics-chart"
                    aria-labelledby="trial-chart-title"
                  >
                    <div className="analytics-section-heading">
                      <div>
                        <h2 id="trial-chart-title">Trial signups</h2>
                        <p>A quieter week. Let’s find out why.</p>
                      </div>
                      <span className="analytics-trend">−18.0%</span>
                    </div>
                    <div className="analytics-legend">
                      <span>
                        <i />
                        This week
                      </span>
                      <span>
                        <i />
                        Previous week
                      </span>
                    </div>
                    <div
                      className="analytics-bars"
                      role="img"
                      aria-label="Trial starts: 1,279 this week versus 1,560 last week. Daily values are in the table below."
                    >
                      {TRIAL_DAYS.map((day) => (
                        <div className="analytics-bar-day" key={day.day}>
                          <div>
                            <i
                              style={{
                                height: `${(day.previous / 250) * 100}%`,
                              }}
                            />
                            <i
                              style={{ height: `${(day.value / 250) * 100}%` }}
                            />
                          </div>
                          <span>{day.day}</span>
                        </div>
                      ))}
                    </div>
                    <details className="analytics-data-table">
                      <summary>View daily data</summary>
                      <table>
                        <caption className="sr-only">
                          Daily trial starts
                        </caption>
                        <thead>
                          <tr>
                            <th scope="col">Day</th>
                            <th scope="col">Previous week</th>
                            <th scope="col">This week</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TRIAL_DAYS.map((day) => (
                            <tr key={day.day}>
                              <th scope="row">{day.day}</th>
                              <td>{day.previous}</td>
                              <td>{day.value}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th scope="row">Total</th>
                            <td>1,560</td>
                            <td>1,279</td>
                          </tr>
                        </tfoot>
                      </table>
                    </details>
                  </section>
                  <section
                    className="analytics-context"
                    aria-labelledby="context-title"
                  >
                    <div className="analytics-section-heading">
                      <h2 id="context-title">Behind the numbers</h2>
                      <span>3 signals</span>
                    </div>
                    {[
                      {
                        id: "deploy",
                        icon: "inline-code" as const,
                        title: "Pricing page updated",
                        detail: "Sep 14 · New hero and plan comparison",
                      },
                      {
                        id: "search",
                        icon: "globe" as const,
                        title: "Organic traffic declined",
                        detail: "31% fewer visits from search",
                      },
                      {
                        id: "teams",
                        icon: "users" as const,
                        title: "Design leads team invites",
                        detail: "86 invitations sent this week",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openSource(item.id)}
                      >
                        <span className="analytics-signal-icon">
                          <Icon name={item.icon} size="sm" />
                        </span>
                        <span>
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                        </span>
                        <Icon name="chevron-right" size="sm" />
                      </button>
                    ))}
                  </section>
                </div>
                <aside
                  className="analytics-assistant-column"
                  aria-label="Dashboard assistant"
                >
                  <div className="analytics-assistant-label">
                    <span>
                      <Icon name="sparkle" size="sm" /> A SECOND PAIR OF EYES
                    </span>
                    <span>Ask AI</span>
                  </div>
                  <AskAnalytics
                    value={value}
                    onValueChange={setValue}
                    suggestions={SUGGESTIONS}
                    request={request}
                    onAsk={ask}
                    onReset={reset}
                    onSourceSelect={openSource}
                    defaultExpanded
                    onSave={toggleSave}
                    saved={isSaved}
                  />
                  <p className="analytics-assistant-note">
                    Good questions lead to better decisions.
                    <br />
                    Start with a suggestion, or ask your own.
                  </p>
                  <div className="analytics-source-note">
                    <Icon name="lock" size="sm" />
                    <span>
                      Local demo · Prewritten sample answers.
                      <br />
                      No data leaves this page. Nothing persists.
                    </span>
                  </div>
                </aside>
              </div>
            </>
          ) : (
            <section className="analytics-saved" aria-labelledby="saved-title">
              <h2 id="saved-title">Saved insights</h2>
              {saved.length ? (
                <div className="analytics-saved-grid">
                  {saved.map((item) => (
                    <article key={item.question}>
                      <div>
                        <h3>{item.question}</h3>
                        <IconButton
                          type="tertiary"
                          tapScale={1}
                          aria-label={`Remove insight: ${item.question}`}
                          onClick={() => {
                            setSaved((items) =>
                              items.filter((s) => s.question !== item.question),
                            );
                            savedRef.current?.focus();
                          }}
                          icon={<Icon name="x" size="sm" />}
                        />
                      </div>
                      <p>{item.answer.body}</p>
                      <InsightSources
                        sources={item.answer.sources}
                        onSelect={openSource}
                      />
                    </article>
                  ))}
                </div>
              ) : (
                <AgentWorkspaceState
                  title="Your next insight starts with a question"
                  description="Save an answer from the overview to keep it here for this session."
                  actionLabel="Explore your dashboard"
                  onAction={() => {
                    setView("overview");
                    overviewRef.current?.focus();
                  }}
                />
              )}
            </section>
          )}
          <footer className="analytics-footer">
            <a href="/ask-analytics">Built with Oreo UI ↗</a>
            <div>
              <span role="status">
                {failNext
                  ? "Next question will simulate a connection error."
                  : "Illustrative workspace · September 2026"}
              </span>
              <button
                type="button"
                aria-pressed={failNext}
                onClick={() => setFailNext(!failNext)}
              >
                {failNext
                  ? "Cancel error simulation"
                  : "Simulate connection issue"}
              </button>
            </div>
          </footer>
        </main>
        <Dialog.Root open={sourceOpen} onOpenChange={setSourceOpen}>
          <Dialog.Portal>
            <div className={dark ? "theme-dark" : ""}>
              <Dialog.Backdrop className="analytics-dialog-backdrop" />
              <Dialog.Popup
                className="analytics-dialog"
                finalFocus={() =>
                  sourceOpener.current?.isConnected
                    ? sourceOpener.current
                    : overviewRef.current
                }
              >
                <div>
                  <Dialog.Title>{source?.label}</Dialog.Title>
                  <Dialog.Close
                    render={
                      <IconButton
                        type="tertiary"
                        tapScale={1}
                        aria-label="Close source"
                        icon={<Icon name="x" />}
                      />
                    }
                  />
                </div>
                <Dialog.Description>{source?.description}</Dialog.Description>
                <dl>
                  {source?.rows.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p>Sample source · No live connection</p>
              </Dialog.Popup>
            </div>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

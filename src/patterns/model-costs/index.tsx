import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { WorkspaceMetric } from "@/components/command-search";
import { BudgetMeter } from "@/components/activity";
import { AgentWorkspaceState } from "@/components/automation";
import {
  ModelTrendChart,
  ModelUsageRing,
  AgentUsageRow,
  aggregateUsage,
  compact,
  metricValue,
  recordSampleRun,
  usageCsv,
  type UsageMetric,
} from "@/components/model-usage";
import { MODELS, AGENTS, RUNS, sampleDays, type Run } from "./data";
import "./workspace.css";
export function ModelCostsPage() {
  const root = useRef<HTMLDivElement>(null),
    returnTo = useRef<HTMLElement | null>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const [dark, setDark] = useState(false),
    [env, setEnv] = useState<"production" | "staging">("production"),
    [period, setPeriod] = useState("7"),
    [metric, setMetric] = useState<UsageMetric>("costCents"),
    [highlighted, setHighlighted] = useState(""),
    [query, setQuery] = useState(""),
    [data, setData] = useState({
      production: sampleDays("production"),
      staging: sampleDays("staging"),
    }),
    [runs, setRuns] = useState(RUNS),
    [paused, setPaused] = useState<string[]>([]),
    [notice, setNotice] = useState(""),
    [failure, setFailure] = useState(false),
    [empty, setEmpty] = useState(false),
    [modal, setModal] = useState<
      | { kind: "agent"; id: string }
      | { kind: "run"; id: string }
      | { kind: "analysis" }
      | null
    >(null);
  const days = empty ? [] : data[env].slice(-Number(period)),
    summary = aggregateUsage(days, MODELS),
    agent =
      modal?.kind === "agent"
        ? AGENTS.find((a) => a.id === modal.id)
        : undefined,
    run =
      modal?.kind === "run" ? runs.find((r) => r.id === modal.id) : undefined;
  const agents = AGENTS.filter((a) =>
      `${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase()),
    ),
    recent = runs.filter(
      (r) =>
        r.environment === env &&
        `${r.title} ${r.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
  function open(value: typeof modal) {
    returnTo.current = document.activeElement as HTMLElement;
    setModal(value);
  }
  function launch(id: string) {
    const a = AGENTS.find((a) => a.id === id);
    if (!a || paused.includes(id) || empty || failure) return;
    setData((old) => ({ ...old, [env]: recordSampleRun(old[env], a.model) }));
    const r: Run = {
      id: crypto.randomUUID(),
      title: `${a.title} sample complete`,
      description: "A deterministic local example. No provider was called.",
      model: a.model,
      tokens: 1842,
      costCents: 5,
      time: "Sep 30 · Local run",
      environment: env,
    };
    setRuns((old) => [r, ...old]);
    setNotice(
      `${a.title}: added one sample request, 1,842 tokens and $0.05 to ${env}.`,
    );
  }
  function exportCsv() {
    const blob = new Blob([usageCsv(days, MODELS)], {
        type: "text/csv;charset=utf-8",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `oreo-${env}-${period}-days.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Exported the selected environment and date range as CSV.");
  }
  function reset() {
    setEmpty(false);
    setFailure(false);
    setPeriod("7");
    setQuery("");
    setHighlighted("");
  }
  return (
    <div ref={root} className={`mc-page${dark ? " theme-dark" : ""}`}>
      <div className="mc-window">
        <aside className="mc-sidebar">
          <a href="/model-trend-chart" className="mc-brand">
            <span>✳</span>Oreo Lens
          </a>
          <label className="mc-search">
            <Icon name="search" size="sm" />
            <span className="sr-only">Search agents and activity</span>
            <input
              placeholder="Search agents…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <p>GENERAL</p>
          <nav>
            <span aria-current="page">
              <Icon name="columns" />
              Overview
            </span>
            <a href="/trace-explorer">
              <Icon name="chart-line" />
              Traces
            </a>
            <a href="/agent-hub">
              <Icon name="assistant" />
              Agents
            </a>
            <a href="/experiment-workspace">
              <Icon name="sliders" />
              Evaluations
            </a>
          </nav>
          <p>TOOLS / RESOURCES</p>
          <nav>
            <a href="/prompt-box">
              <Icon name="chat" />
              Prompts
            </a>
            <a href="/model-trend-chart">
              <Icon name="keyboard" />
              Playground
            </a>
            <a href="/model-router">
              <Icon name="plug" />
              Gateway
            </a>
            <a href="/activity-workspace">
              <Icon name="gauge" />
              Cost & budget
            </a>
          </nav>
          <p>SETTINGS</p>
          <nav>
            <a href="/support-console">
              <Icon name="lock" />
              API keys
            </a>
            <a href="/access-workspace">
              <Icon name="users" />
              Team
            </a>
            <button onClick={() => setDark(!dark)}>
              <Icon name={dark ? "sun" : "moon"} />
              {dark ? "Light mode" : "Dark mode"}
            </button>
          </nav>
          <div className="mc-account">
            <Avatar name="Alex Morgan" size="sm" />
            <span>
              Alex Morgan<small>alex@example.com</small>
            </span>
          </div>
        </aside>
        <main>
          <header className="mc-top">
            <span>
              Dashboard <Icon name="chevron-right" size="sm" />
              <strong>Overview</strong>
            </span>
            <div>
              <Button
                size="sm"
                type="secondary"
                tapScale={1}
                leadingIcon={<Icon name="sparkle" size="sm" />}
                onClick={() => open({ kind: "analysis" })}
              >
                Explain usage
              </Button>
              <IconButton
                size="sm"
                type="secondary"
                tapScale={1}
                icon={<Icon name="refresh" size="sm" />}
                aria-label="Refresh sample view"
                onClick={() => {
                  setFailure(false);
                  setNotice("Sample view refreshed. Local runs are preserved.");
                }}
              />
              <Button
                size="sm"
                type="tertiary"
                tapScale={1}
                onClick={() => setDark(!dark)}
              >
                {dark ? "Light" : "Dark"}
              </Button>
            </div>
          </header>
          <div className="mc-body">
            <div className="mc-heading">
              <div>
                <h1 ref={heading} tabIndex={-1}>
                  Welcome back, Alex
                </h1>
                <p>
                  Oreo workspace / All projects{" "}
                  <Tag size="sm" color="default">
                    Sample data
                  </Tag>
                </p>
              </div>
              <div className="mc-filters">
                <div
                  role="group"
                  aria-label="Environment"
                  className="mc-segment"
                >
                  {(["production", "staging"] as const).map((e) => (
                    <button
                      key={e}
                      aria-pressed={env === e}
                      onClick={() => {
                        setEnv(e);
                        setNotice("");
                      }}
                    >
                      {e === "production" ? "Production" : "Staging"}
                    </button>
                  ))}
                </div>
                <label>
                  <span className="sr-only">Date range</span>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="7">Sep 24–30, 2026</option>
                    <option value="3">Sep 28–30, 2026</option>
                    <option value="1">Sep 30, 2026</option>
                  </select>
                </label>
              </div>
            </div>
            {notice && (
              <p className="mc-notice" role="status">
                {notice}
              </p>
            )}
            {failure ? (
              <AgentWorkspaceState
                title="Usage could not be loaded"
                description="The demo request failed. Your local data is preserved."
                error
                actionLabel="Try again"
                onAction={() => setFailure(false)}
              />
            ) : (
              <>
                <section className="mc-overview">
                  <div className="mc-banner">
                    <Icon name="sparkle" />
                    <p>
                      <strong>Your AI usage, under control.</strong> Trace every
                      request. Understand every dollar.
                    </p>
                    <Button
                      size="sm"
                      type="secondary"
                      tapScale={1}
                      onClick={() => open({ kind: "analysis" })}
                    >
                      See details
                    </Button>
                  </div>
                  <div className="mc-metrics">
                    <WorkspaceMetric
                      label="Total requests"
                      value={compact(summary.total.requests)}
                      detail={`${days.length} selected ${days.length === 1 ? "day" : "days"}`}
                      icon={<Icon name="arrow-out" />}
                    />
                    <WorkspaceMetric
                      label="Total tokens"
                      value={compact(summary.total.tokens)}
                      detail="Across 3 sample models"
                      icon={<Icon name="columns" />}
                    />
                    <WorkspaceMetric
                      label="Total cost"
                      value={metricValue(summary.total.costCents, "costCents")}
                      detail="Recorded sample spend"
                      icon={<Icon name="gauge" />}
                    />
                    <WorkspaceMetric
                      label="Sample latency p95"
                      value={
                        summary.p95 === null
                          ? "—"
                          : `${(summary.p95 / 1000).toFixed(2)}s`
                      }
                      detail={`${summary.sampleCount} measured sample calls`}
                      icon={<Icon name="clock-history" />}
                    />
                  </div>
                </section>
                <div className="mc-charts">
                  <section className="mc-panel">
                    <header>
                      <h2>
                        {metric === "costCents"
                          ? "Cost"
                          : metric === "tokens"
                            ? "Tokens"
                            : "Requests"}{" "}
                        over time
                      </h2>
                      <div
                        className="mc-segment"
                        role="group"
                        aria-label="Chart metric"
                      >
                        {(["costCents", "tokens", "requests"] as const).map(
                          (m) => (
                            <button
                              key={m}
                              aria-pressed={metric === m}
                              onClick={() => setMetric(m)}
                            >
                              {m === "costCents"
                                ? "Cost"
                                : m === "tokens"
                                  ? "Tokens"
                                  : "Requests"}
                            </button>
                          ),
                        )}
                      </div>
                    </header>
                    <div className="mc-chart-total">
                      <strong>
                        {metricValue(summary.total[metric], metric)}
                      </strong>
                      <span>{env} · selected period</span>
                    </div>
                    <ModelTrendChart
                      days={days}
                      models={MODELS}
                      metric={metric}
                      highlighted={highlighted}
                      onHighlight={setHighlighted}
                      onRetry={reset}
                    />
                  </section>
                  <section className="mc-panel">
                    <header>
                      <h2>Usage by model</h2>
                      {highlighted && (
                        <Button
                          size="sm"
                          type="tertiary"
                          tapScale={1}
                          onClick={() => setHighlighted("")}
                        >
                          Show all
                        </Button>
                      )}
                    </header>
                    <ModelUsageRing
                      days={days}
                      models={MODELS}
                      value={highlighted}
                      onValueChange={setHighlighted}
                    />
                    <p className="mc-hint">
                      Select a model to highlight it in both charts.
                    </p>
                  </section>
                </div>
                <div className="mc-lists">
                  <section className="mc-panel">
                    <header>
                      <h2>Quick launch agents</h2>
                      <span>{agents.length} agents</span>
                    </header>
                    {!agents.length ? (
                      <AgentWorkspaceState
                        title="No matching agents"
                        description="Try a different name or clear your search."
                        actionLabel="Clear search"
                        onAction={() => setQuery("")}
                      />
                    ) : (
                      agents.map((a) => {
                        const m = summary.rows.find((m) => m.id === a.model)!;
                        return (
                          <AgentUsageRow
                            key={a.id}
                            title={a.title}
                            description={a.description}
                            model={m.name}
                            tokens={m.tokens}
                            costCents={m.costCents}
                            status={paused.includes(a.id) ? "paused" : "active"}
                            time="Selected period"
                            onOpen={() => open({ kind: "agent", id: a.id })}
                            onRun={empty ? undefined : () => launch(a.id)}
                          />
                        );
                      })
                    )}
                  </section>
                  <section className="mc-panel">
                    <header>
                      <h2>Recent activity</h2>
                      <Button
                        size="sm"
                        type="tertiary"
                        tapScale={1}
                        onClick={exportCsv}
                        disabled={!days.length}
                      >
                        Export CSV
                      </Button>
                    </header>
                    {empty || !recent.length ? (
                      <AgentWorkspaceState
                        title="No recent activity"
                        description="Run a sample agent or clear your search to see activity."
                        actionLabel={query ? "Clear search" : undefined}
                        onAction={() => setQuery("")}
                      />
                    ) : (
                      recent
                        .slice(0, 5)
                        .map((r) => (
                          <AgentUsageRow
                            key={r.id}
                            title={r.title}
                            description={r.description}
                            model={MODELS.find((m) => m.id === r.model)!.name}
                            tokens={r.tokens}
                            costCents={r.costCents}
                            status="complete"
                            time={r.time}
                            onOpen={() => open({ kind: "run", id: r.id })}
                          />
                        ))
                    )}
                  </section>
                </div>
              </>
            )}
            <footer className="mc-footer">
              <span>
                Local fixtures · No provider calls · Changes reset on reload
              </span>
              <a
                href="https://x.com/imimran04/status/2110703416976748572"
                target="_blank"
                rel="noreferrer"
              >
                Reference by Imran ↗
              </a>
            </footer>
            <details className="mc-demo">
              <summary>Demo states</summary>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => setFailure(true)}
              >
                Show error
              </Button>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => setEmpty(!empty)}
              >
                {empty ? "Restore sample data" : "Show empty period"}
              </Button>
            </details>
          </div>
        </main>
      </div>
      <Dialog.Root
        open={modal !== null}
        onOpenChange={(v) => {
          if (!v) setModal(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="mc-backdrop" />
          <Dialog.Popup
            className="mc-dialog"
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            <header>
              <div>
                <Dialog.Title>
                  {agent
                    ? agent.title
                    : run
                      ? run.title
                      : "Your usage, explained"}
                </Dialog.Title>
                <Dialog.Description>
                  {agent
                    ? "Configure this local sample agent."
                    : run
                      ? "A sample activity record. No live request was made."
                      : "A deterministic summary of the selected data, not an AI response."}
                </Dialog.Description>
              </div>
              <IconButton
                size="sm"
                type="tertiary"
                tapScale={1}
                aria-label="Close details"
                icon={<Icon name="x" />}
                onClick={() => setModal(null)}
              />
            </header>
            <div className="mc-dialog-body">
              {agent ? (
                <>
                  <p>{agent.description}</p>
                  <dl>
                    <div>
                      <dt>Model</dt>
                      <dd>{MODELS.find((m) => m.id === agent.model)?.name}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>{paused.includes(agent.id) ? "Paused" : "Active"}</dd>
                    </div>
                  </dl>
                  <p className="mc-hint">
                    Each sample adds one request, 1,842 tokens and $0.05 to the
                    selected environment on Sep 30.
                  </p>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() =>
                      setPaused((old) =>
                        old.includes(agent.id)
                          ? old.filter((id) => id !== agent.id)
                          : [...old, agent.id],
                      )
                    }
                  >
                    {paused.includes(agent.id) ? "Resume agent" : "Pause agent"}
                  </Button>
                </>
              ) : run ? (
                <>
                  <p>{run.description}</p>
                  <dl>
                    {[
                      ["Environment", run.environment],
                      ["Model", MODELS.find((m) => m.id === run.model)?.name],
                      ["Tokens", run.tokens.toLocaleString("en-US")],
                      ["Cost", metricValue(run.costCents, "costCents")],
                      ["Time", run.time],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : (
                <>
                  <p>
                    {compact(summary.total.requests)} requests processed{" "}
                    {compact(summary.total.tokens)} tokens for{" "}
                    {metricValue(summary.total.costCents, "costCents")} in {env}
                    .
                  </p>
                  <p>
                    {summary.total.costCents > 0
                      ? `${summary.rows.slice().sort((a, b) => b.costCents - a.costCents)[0]?.name} has the largest recorded spend in this sample window.`
                      : "No spend is recorded in this sample window."}
                  </p>
                  <BudgetMeter
                    used={summary.total.costCents / 100}
                    limit={3000}
                    label="Sample monthly budget"
                  />
                  <p className="mc-hint">
                    The budget meter shows selected-period spend against a
                    $3,000 monthly ceiling; it is not a monthly forecast.
                    Latency uses the nearest-rank p95 of {summary.sampleCount}{" "}
                    sample calls, not an average of daily percentiles. Model
                    names and costs are fixture labels, not current provider
                    pricing.
                  </p>
                </>
              )}
            </div>
            <footer>
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => setModal(null)}
              >
                Done
              </Button>
              {agent && (
                <Button
                  tapScale={1}
                  disabled={paused.includes(agent.id) || empty || failure}
                  onClick={() => {
                    launch(agent.id);
                    setModal(null);
                  }}
                >
                  Run sample
                </Button>
              )}
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useState } from "react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  AgentRunsCard,
  count,
  fillWeek,
  heatmapCsv,
  hourLabel,
  WEEKDAYS,
  type RunMetric,
} from "@/components/agent-runs";
import { AGENTS, agentWeek, selectedWeek } from "./data";
import "./workspace.css";
export function AgentRunsPage() {
  const [dark, setDark] = useThemeMode(false),
    [agent, setAgent] = useState("all"),
    [previous, setPrevious] = useState(false),
    [metric, setMetric] = useState<RunMetric>("runs"),
    [slot, setSlot] = useState(82),
    [mode, setMode] = useState("ready"),
    [view, setView] = useState("summary"),
    [notice, setNotice] = useState("");
  const ready = mode === "ready",
    data = ready ? selectedWeek(agent, previous) : [],
    selected = fillWeek(data)[slot],
    label =
      agent === "all"
        ? "All agents"
        : (AGENTS.find((a) => a.id === agent)?.name ?? "All agents"),
    period = previous ? "Sep 28–Oct 4, 2026" : "Oct 5–11, 2026";
  function reset() {
    setMode("ready");
    setAgent("all");
    setPrevious(false);
    setNotice("Showing all agents for Oct 5–11.");
  }
  function exportCsv() {
    const url = URL.createObjectURL(
      new Blob([heatmapCsv(data)], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `agent-runs-${agent}-${previous ? "previous" : "current"}-UTC.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Exported 168 hourly buckets for the selected agent and week.");
  }
  return (
    <div className={`ar-page${dark ? " theme-dark" : ""}`}>
      <div className="ar-workspace">
        <header className="ar-top">
          <a href="/" className="ar-brand">
            <Icon name="assistant" /> Oreo Lens
          </a>
          <nav aria-label="Analytics navigation">
            <a href="/model-costs">Overview</a>
            <a href="/agent-runs" aria-current="page">
              Agent runs
            </a>
            <a href="/trace-explorer">Traces</a>
          </nav>
          <Button
            size="sm"
            type="tertiary"
            tapScale={1}
            onClick={() => setDark((v) => !v)}
          >
            {dark ? "Light mode" : "Dark mode"}
          </Button>
        </header>
        <main className="ar-main">
          <div className="ar-page-heading">
            <div>
              <div className="ar-eyebrow">WORKSPACE / OBSERVABILITY</div>
              <h1>Every run, in perspective.</h1>
              <p>Find the busy hours. See where your agents need attention.</p>
            </div>
            <Tag color="default">Sample data</Tag>
          </div>
          <div className="ar-toolbar">
            <div>
              <label>
                Agent
                <select
                  value={agent}
                  onChange={(e) => {
                    setAgent(e.target.value);
                    setNotice("");
                  }}
                >
                  <option value="all">All agents</option>
                  {AGENTS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Week
                <select
                  value={previous ? "previous" : "current"}
                  onChange={(e) => {
                    setPrevious(e.target.value === "previous");
                    setNotice("");
                  }}
                >
                  <option value="current">Oct 5–11, 2026</option>
                  <option value="previous">Sep 28–Oct 4, 2026</option>
                </select>
              </label>
            </div>
            <Button
              size="sm"
              type="secondary"
              tapScale={1}
              disabled={!ready}
              onClick={exportCsv}
            >
              Export CSV
            </Button>
          </div>
          <AgentRunsCard
            data={data}
            previousData={
              !previous && ready ? selectedWeek(agent, true) : undefined
            }
            description={`${label} · ${period} · UTC`}
            metric={metric}
            onMetricChange={setMetric}
            value={slot}
            onValueChange={setSlot}
            loading={mode === "loading"}
            error={
              mode === "error"
                ? "The sample activity could not be loaded. Try again to restore it."
                : undefined
            }
            onRetry={reset}
          />
          <section className="ar-detail" aria-label="Hour details">
            <header>
              <div>
                <span className="ar-eyebrow">SELECTED HOUR</span>
                <h2>
                  {WEEKDAYS[selected.day]}, {hourLabel(selected.hour)}{" "}
                  <small>UTC</small>
                </h2>
              </div>
              <div role="group" aria-label="Detail view">
                <Button
                  type={view === "summary" ? "secondary" : "tertiary"}
                  size="sm"
                  tapScale={1}
                  aria-pressed={view === "summary"}
                  onClick={() => setView("summary")}
                >
                  By agent
                </Button>
                <Button
                  type={view === "table" ? "secondary" : "tertiary"}
                  size="sm"
                  tapScale={1}
                  aria-pressed={view === "table"}
                  onClick={() => setView("table")}
                >
                  All hours
                </Button>
              </div>
            </header>
            {!ready ? (
              <AgentWorkspaceState
                title="No hour selected"
                description="Restore the activity view to inspect a time slot."
              />
            ) : view === "summary" ? (
              <>
                <div className="ar-detail-summary">
                  <span>
                    <b>{count(selected.runs)}</b> runs
                  </span>
                  <span>
                    <b>{count(selected.credits)}</b> credits
                  </span>
                  <span>
                    <b>{count(selected.failures)}</b> failed
                  </span>
                  <span>
                    <b>
                      {selected.runs
                        ? Math.round(selected.durationSeconds / selected.runs) +
                          "s"
                        : "—"}
                    </b>{" "}
                    average
                  </span>
                </div>
                <div className="ar-table-scroll">
                  <table>
                    <caption className="sr-only">
                      Agent breakdown for {WEEKDAYS[selected.day]}{" "}
                      {hourLabel(selected.hour)} UTC
                    </caption>
                    <thead>
                      <tr>
                        <th>Agent</th>
                        <th>Runs</th>
                        <th>Credits</th>
                        <th>Failed</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AGENTS.filter(
                        (a) => agent === "all" || a.id === agent,
                      ).map((a) => {
                        const b = agentWeek(a.id, previous)[slot];
                        return (
                          <tr key={a.id}>
                            <th scope="row">
                              <span>{a.name}</span>
                              <small>{a.description}</small>
                            </th>
                            <td>{count(b.runs)}</td>
                            <td>{count(b.credits)}</td>
                            <td>{count(b.failures)}</td>
                            <td>
                              {b.runs
                                ? Math.round(b.durationSeconds / b.runs) + "s"
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div
                className="ar-table-scroll ar-hour-table"
                tabIndex={0}
                aria-label="All hourly values"
              >
                <table>
                  <caption className="sr-only">
                    All hours for {label}, {period}, UTC
                  </caption>
                  <thead>
                    <tr>
                      <th>Day / hour</th>
                      <th>Runs</th>
                      <th>Credits</th>
                      <th>Failed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((b, i) => (
                      <tr key={i} data-selected={i === slot || undefined}>
                        <th scope="row">
                          <button
                            type="button"
                            onClick={() => {
                              setSlot(i);
                              setView("summary");
                            }}
                          >
                            {WEEKDAYS[b.day]}, {hourLabel(b.hour)}
                          </button>
                        </th>
                        <td>{count(b.runs)}</td>
                        <td>{count(b.credits)}</td>
                        <td>{count(b.failures)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <p role="status" className="ar-notice">
            {notice}
          </p>
          <footer className="ar-page-footer">
            <span>
              Local sample · Credits are usage units · No provider connection
            </span>
            <a href="/agent-runs-card">Component docs ↗</a>
            <a
              href="https://x.com/shokhnur_says/status/2110657757850263727"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Shokhnur ↗
            </a>
            <details>
              <summary>Demo states</summary>
              <div>
                {["ready", "loading", "empty", "error"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    type={mode === s ? "secondary" : "tertiary"}
                    tapScale={1}
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
  );
}

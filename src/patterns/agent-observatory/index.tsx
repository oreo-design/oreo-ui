import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { WorkspaceMetric } from "@/components/command-search";
import {
  PixelMeter,
  InferenceChart,
  RegionalTraffic,
  AgentHealthTable,
  healthRows,
  summarizeHealth,
  successRate,
  telemetryCSV,
  toggleAgent,
  type AgentTelemetry,
  type AgentHealthStatus,
  type HealthSort,
} from "@/components/agent-observability";
import {
  PERIODS,
  periodAgents,
  trafficRegions,
  inferenceSeries,
  type Period,
} from "./data";
import "./workspace.css";
const fmt = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 1 });
export function AgentObservatoryPage() {
  const [dark, setDark] = useState(false),
    [period, setPeriod] = useState<Period>("Last 30 days"),
    [region, setRegion] = useState("all"),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("All statuses"),
    [sort, setSort] = useState<HealthSort>({ key: "name", direction: "asc" }),
    [statuses, setStatuses] = useState<Record<string, AgentHealthStatus>>({}),
    [previous, setPrevious] = useState<Record<string, AgentHealthStatus>>({}),
    [undo, setUndo] = useState<{
      statuses: Record<string, AgentHealthStatus>;
      previous: Record<string, AgentHealthStatus>;
    } | null>(null),
    [detail, setDetail] = useState<string | null>(null),
    [notice, setNotice] = useState("");
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  const agents = periodAgents(period, statuses),
    regional = agents.filter((a) => region === "all" || a.region === region),
    metrics = summarizeHealth(regional),
    rows = healthRows(agents, query, status, region, sort),
    selected = agents.find((a) => a.id === detail);
  function clear() {
    setQuery("");
    setStatus("All statuses");
    setRegion("all");
  }
  function open(a: AgentTelemetry) {
    trigger.current = document.activeElement as HTMLElement;
    setDetail(a.id);
  }
  function toggle(a: AgentTelemetry) {
    setUndo({ statuses, previous });
    const next = toggleAgent(agents, a.id, previous[a.id])[
      agents.findIndex((item) => item.id === a.id)
    ].status;
    if (a.status !== "Paused") setPrevious({ ...previous, [a.id]: a.status });
    setStatuses({ ...statuses, [a.id]: next });
    setNotice(
      `${a.name} ${next === "Paused" ? "paused" : `resumed (${next.toLowerCase()})`} in this demo.`,
    );
  }
  function download() {
    const url = URL.createObjectURL(
        new Blob([telemetryCSV(rows)], { type: "text/csv;charset=utf-8" }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = `agent-health-${period.replaceAll(" ", "-").toLowerCase()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      `Exported ${rows.length} visible agents for ${period.toLowerCase()}.`,
    );
  }
  return (
    <div ref={root} className={`ao-workspace ${dark ? "theme-dark" : ""}`}>
      <aside className="ao-sidebar">
        <a className="ao-brand" href="/agent-observatory">
          <span>
            <Icon name="assistant" size="md" />
          </span>
          Observatory
        </a>
        <div className="ao-workspace-label">
          <span className="ao-workspace-avatar">O</span>
          <div>
            Oreo workspace<small>Development</small>
          </div>
          <span className="ao-online" title="Sample environment" />
        </div>
        <p className="ao-nav-label">MONITOR</p>
        <nav aria-label="Workspace">
          <button className="ao-nav-active" type="button" onClick={clear}>
            <Icon name="chart-line" />
            Overview
          </button>
          <a
            href="#agent-health"
            onClick={() => {
              setStatus("Degraded");
              setQuery("");
              setRegion("all");
            }}
          >
            <Icon name="gauge" />
            Needs attention
            <span>{agents.filter((a) => a.status === "Degraded").length}</span>
          </a>
          <a href="/trace-explorer">
            <Icon name="list" />
            Trace explorer
            <Icon name="arrow-up-right" />
          </a>
        </nav>
        <p className="ao-nav-label">LIBRARY</p>
        <nav aria-label="Library">
          <a href="/inference-chart">
            <Icon name="columns" />
            Components
          </a>
          <a href="/changelog">
            <Icon name="clock-history" />
            Changelog
          </a>
        </nav>
        <div className="ao-budget">
          <div>
            <span>Token budget</span>
            <span>61.2%</span>
          </div>
          <PixelMeter
            value={612000}
            max={1000000}
            label="Sample monthly token budget"
            showValue={false}
          />
          <p>612K of 1M tokens</p>
          <small>Sample workspace · October</small>
        </div>
        <a className="ao-library-link" href="/button">
          Oreo UI <Icon name="arrow-up-right" />
        </a>
      </aside>
      <div className="ao-content">
        <header className="ao-topbar">
          <span>
            Workspace <span className="text-text-tertiary">/</span> Overview
          </span>
          <div className="flex items-center gap-3">
            <span className="ao-sample-label">Sample data</span>
            <IconButton
              type="tertiary"
              icon={<Icon name={dark ? "sun" : "moon"} />}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark(!dark)}
            />
          </div>
        </header>
        <main className="ao-main">
          <div className="ao-intro">
            <div>
              <p className="ao-eyebrow">AGENT OPERATIONS</p>
              <h1 ref={heading} tabIndex={-1}>
                A clear view of every agent.
              </h1>
              <p>
                Monitor performance, spot friction, and keep your agents on
                track.
              </p>
            </div>
            <label className="ao-period">
              <span className="sr-only">Reporting period</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as Period)}
              >
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="ao-context">
            <span>
              {period === "Last 30 days"
                ? "Sep 17 – Oct 16"
                : period === "Last 7 days"
                  ? "Oct 10 – 16"
                  : "Oct 16 · 00:00 – 23:59"}
              , 2026 · UTC
            </span>
            <label>
              Region{" "}
              <select
                aria-label="Region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="all">All regions</option>
                {trafficRegions(agents).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <section className="ao-metrics" aria-label="Telemetry summary">
            <WorkspaceMetric
              label="Request success"
              value={`${metrics.success.toFixed(1)}%`}
              detail={`${fmt(metrics.successes)} successful requests`}
              icon={<Icon name="gauge" />}
            />
            <WorkspaceMetric
              label="Active agents"
              value={String(metrics.active).padStart(2, "0")}
              detail={`${regional.length} agents · paused excluded`}
              icon={<Icon name="assistant" />}
            />
            <WorkspaceMetric
              label="Inference calls"
              value={fmt(metrics.requests)}
              detail="All calls in this region and period"
              icon={<Icon name="chart-line" />}
            />
            <WorkspaceMetric
              label="Median agent p95"
              value={`${fmt(metrics.medianP95)} ms`}
              detail="Median across agents, not fleet p95"
              icon={<Icon name="clock-history" />}
            />
          </section>
          <div className="ao-chart-grid">
            <section className="ao-panel">
              <div className="ao-panel-heading">
                <div>
                  <h2>Inference calls</h2>
                  <p>Bucket totals · {period.toLowerCase()}</p>
                </div>
                <Icon name="chart-line" />
              </div>
              <InferenceChart
                points={inferenceSeries(metrics.requests, period)}
              />
            </section>
            <section className="ao-panel">
              <div className="ao-panel-heading">
                <div>
                  <h2>Regional traffic</h2>
                  <p>Calls and mean agent p95 · select a region</p>
                </div>
                <Icon name="globe" />
              </div>
              <RegionalTraffic
                regions={trafficRegions(agents)}
                value={region}
                onValueChange={setRegion}
              />
            </section>
          </div>
          <section className="ao-panel ao-health-panel" id="agent-health">
            <div className="ao-panel-heading">
              <div>
                <h2>
                  Agent health <span>{rows.length}</span>
                </h2>
                <p>
                  Search and status refine this table. Summary cards follow
                  region and period.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="secondary"
                  size="sm"
                  disabled={!undo}
                  leadingIcon={<Icon name="reset" />}
                  onClick={() => {
                    if (undo) {
                      setStatuses(undo.statuses);
                      setPrevious(undo.previous);
                      setUndo(null);
                      setNotice("Last status change undone.");
                    }
                  }}
                >
                  Undo
                </Button>
                <Button
                  type="secondary"
                  size="sm"
                  onClick={download}
                  disabled={!rows.length}
                  leadingIcon={<Icon name="arrow-down" />}
                >
                  Export CSV
                </Button>
              </div>
            </div>
            <div className="ao-table-toolbar">
              <label className="ao-search">
                <Icon name="search" />
                <input
                  aria-label="Search agents"
                  placeholder="Search agents, roles, models…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <select
                aria-label="Agent status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {[
                  "All statuses",
                  "Healthy",
                  "Paused",
                  "Deploying",
                  "Degraded",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {(query || status !== "All statuses" || region !== "all") && (
                <Button type="tertiary" size="sm" onClick={clear}>
                  Clear filters
                </Button>
              )}
            </div>
            <AgentHealthTable
              agents={rows}
              sort={sort}
              onSort={setSort}
              onOpen={open}
              onToggle={toggle}
              filtered={
                !!query || status !== "All statuses" || region !== "all"
              }
              onReset={clear}
            />
          </section>
          <p className="ao-notice" role="status">
            {notice ||
              "Local demo · Agent status changes reset on reload. Historical traffic stays unchanged."}
          </p>
          <footer className="ao-footer">
            <span>OBSERVATORY / OREO UI</span>
            <a
              href="https://x.com/adeebrq/status/2110891362103267793"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Adeeb ↗
            </a>
            <a href="/agent-health-table">Explore the components ↗</a>
          </footer>
        </main>
      </div>
      <Dialog.Root
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setDetail(null);
        }}
      >
        <Dialog.Portal container={root}>
          <Dialog.Backdrop className="ao-backdrop" />
          <Dialog.Popup
            className="ao-dialog"
            finalFocus={() =>
              trigger.current?.isConnected ? trigger.current : heading.current
            }
          >
            <div className="ao-dialog-title">
              <Dialog.Title>{selected?.name}</Dialog.Title>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    icon={<Icon name="x" />}
                    aria-label="Close agent details"
                  />
                }
              />
            </div>
            <Dialog.Description className="ao-dialog-description">
              Agent details for {period.toLowerCase()}. Status controls affect
              this local demo only.
            </Dialog.Description>
            {selected && (
              <>
                <dl className="ao-details">
                  {[
                    ["Status", selected.status],
                    ["Role", selected.role],
                    ["Region", selected.region],
                    ["Model", selected.model],
                    ["Version", selected.version],
                    ["Requests", fmt(selected.requests)],
                    ["Success", `${successRate(selected).toFixed(2)}%`],
                    ["Agent p95", `${fmt(selected.p95ms)} ms`],
                    ["Cost per 1K", `$${selected.costPer1k.toFixed(4)}`],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="ao-dialog-actions">
                  <Button type="secondary" onClick={() => setDetail(null)}>
                    Done
                  </Button>
                  <Button onClick={() => toggle(selected)}>
                    {selected.status === "Paused"
                      ? "Resume agent"
                      : "Pause agent"}
                  </Button>
                </div>
              </>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

import { formatCurrency } from "@/components/currency-finance/model";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { OreoLogo } from "@/docs/OreoLogo";
import { SkeletonReveal } from "@/components/finance-overview";
import { AgentWorkspaceState } from "@/components/automation";
import { RevenueMatrix, PipelineFunnel } from "@/components/sales";
import {
  DashboardStatCard,
  ComparisonBarChart,
  TrendAreaChart,
  ChannelBreakdown,
  metricMoney,
  metricNumber,
  percentChange,
  filterRecords,
  validateRecord,
  recordsCSV,
  type DashboardRecord,
} from "@/components/dashboard-suite";
import {
  DASHBOARDS,
  CHANNELS,
  observations,
  sampleRecords,
  type DashboardKind,
} from "./data";
import "./dashboard-page.css";
export function DashboardSuitePage() {
  return <DashboardWorkspace kind="commerce" />;
}
export function CampaignDashboardPage() {
  return <DashboardWorkspace kind="campaigns" />;
}
export function CRMDashboardPage() {
  return <DashboardWorkspace kind="crm" />;
}
export function MembershipDashboardPage() {
  return <DashboardWorkspace kind="membership" />;
}
function DashboardWorkspace({ kind }: { kind: DashboardKind }) {
  const config = DASHBOARDS[kind],
    [dark, setDark] = useState<boolean>(config.dark),
    [tab, setTab] = useState("Overview"),
    [period, setPeriod] = useState(30),
    [records, setRecords] = useState(() => sampleRecords(kind)),
    [query, setQuery] = useState(""),
    [channel, setChannel] = useState(""),
    [status, setStatus] = useState("All"),
    [loading, setLoading] = useState(true),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [selection, setSelection] = useState<DashboardRecord | "new" | null>(null),
    [undo, setUndo] = useState<DashboardRecord[] | null>(null),
    [draft, setDraft] = useState({
      name: "",
      email: "",
      value: "",
      channel: CHANNELS[0],
    }),
    [validation, setValidation] = useState("");
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    errorRef = useRef<HTMLParagraphElement>(null),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timer.current = setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (validation) errorRef.current?.focus();
  }, [validation]);
  const points = observations(kind).slice(-period),
    total = points.reduce((a, p) => a + p.values.reduce((x, y) => x + y, 0), 0),
    previous = Math.round(total * 0.87),
    area = points.map((p) => ({ ...p, values: [p.values[0] + p.values[1]] })),
    orders = points.reduce(
      (a, p) => a + Math.round((p.values[0] + p.values[1]) / 154),
      0,
    ),
    recent = records.filter(
      (r) =>
        r.date >=
        `2026-10-${String(Math.max(1, 17 - period)).padStart(2, "0")}`,
    ),
    filtered = filterRecords(recent, query, channel, status),
    channels = CHANNELS.map((c) => ({
      id: c,
      label: c,
      value: recent.filter((r) => r.channel === c).length,
    }));
  const statVariant =
    kind === "commerce" ? "footer" : kind === "campaigns" ? "header" : "plain";
  function refresh(fail = false) {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    setError("");
    timer.current = setTimeout(() => {
      setLoading(false);
      setLoaded(true);
      setError(
        fail
          ? "The simulated refresh failed. Your existing sample data is preserved."
          : "",
      );
      setMessage(fail ? "Refresh failed." : "Sample data refreshed.");
    }, 700);
  }
  function open(item: DashboardRecord | "new") {
    trigger.current = document.activeElement as HTMLElement;
    setValidation("");
    setDraft({ name: "", email: "", value: "", channel: CHANNELS[0] });
    setSelection(item);
  }
  function save(e: FormEvent) {
    e.preventDefault();
    const issue = validateRecord(draft.name, draft.email, draft.value);
    if (issue) {
      setValidation(issue);
      return;
    }
    if (
      records.some(
        (r) => r.email.toLowerCase() === draft.email.trim().toLowerCase(),
      )
    ) {
      setValidation("This email is already in the sample workspace.");
      return;
    }
    setUndo(records);
    setRecords([
      {
        id: crypto.randomUUID(),
        name: draft.name.trim(),
        email: draft.email.trim(),
        channel: draft.channel,
        status: "Pending",
        value: Number(draft.value),
        date: "2026-10-16",
      },
      ...records,
    ]);
    setSelection(null);
    setQuery("");
    setChannel("");
    setStatus("All");
    setMessage(
      "Sample record added. Historical chart observations are unchanged.",
    );
  }
  function exportData() {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", recordsCSV(filtered)], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `oreo-${kind}-records.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(`Exported ${filtered.length} filtered records.`);
  }
  function clear() {
    setQuery("");
    setChannel("");
    setStatus("All");
  }
  const recordsPanel = (
    <section className="ds-panel ds-records">
      <header>
        <div>
          <h2>{config.records}</h2>
          <p>
            Local records · {filtered.length} matching · historical charts are
            separate
          </p>
        </div>
        <div className="ds-actions">
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            disabled={!undo || loading}
            onClick={() => {
              if (undo) setRecords(undo);
              setUndo(null);
              setMessage("Previous local change restored.");
            }}
          >
            Undo
          </Button>
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            disabled={!filtered.length || loading}
            leadingIcon={<Icon name="arrow-down" size="sm" />}
            onClick={exportData}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            tapScale={1}
            disabled={loading}
            onClick={() => open("new")}
          >
            Add record
          </Button>
        </div>
      </header>
      <div className="ds-filter">
        <label>
          <Icon name="search" size="sm" />
          <input
            type="search"
            aria-label="Search records"
            placeholder="Search name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Record status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["All", "Active", "Pending", "Completed"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <select
          aria-label="Record channel"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        >
          <option value="">All channels</option>
          {CHANNELS.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </div>
      {filtered.length ? (
        <div
          className="ds-record-scroll"
          tabIndex={0}
          role="region"
          aria-label={`${config.records} table`}
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Source</th>
                <th scope="col">Status</th>
                <th scope="col">Value</th>
                <th scope="col">Added</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <th scope="row">
                    <strong>{r.name}</strong>
                    <small>{r.email}</small>
                  </th>
                  <td>{r.channel}</td>
                  <td>
                    <Tag
                      color={
                        r.status === "Active"
                          ? "mint"
                          : r.status === "Pending"
                            ? "orange"
                            : "default"
                      }
                    >
                      {r.status}
                    </Tag>
                  </td>
                  <td>{formatCurrency(Math.round(r.value * 100), "USD")}</td>
                  <td>{r.date}</td>
                  <td>
                    <Button
                      type="tertiary"
                      size="sm"
                      tapScale={1}
                      disabled={loading}
                      aria-label={`View ${r.name}`}
                      onClick={() => open(r)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <AgentWorkspaceState
          title={
            recent.length ? "No matching records" : "No records in this period"
          }
          description="Clear filters or add a sample record to continue."
          actionLabel="Clear filters"
          onAction={clear}
        />
      )}
    </section>
  );
  return (
    <div ref={root} className={dark ? "theme-dark" : ""}>
      <div className="ds-page" data-kind={kind}>
        <aside className="ds-sidebar">
          <a className="ds-brand" href="/dashboard-stat-card">
            <OreoLogo className="h-6 w-8" />
            Oreo <span>studio</span>
          </a>
          <div className="ds-workspace">
            <span className="ds-workspace-mark">O</span>
            <span>
              Oreo workspace<small>Local sample data</small>
            </span>
          </div>
          <p className="ds-nav-label">WORKSPACE</p>
          <nav aria-label="Dashboard navigation">
            {["Overview", config.records, "Reports"].map((v, i) => (
              <button
                key={v}
                type="button"
                aria-current={tab === v ? "page" : undefined}
                onClick={() => setTab(v)}
              >
                <Icon
                  name={i === 0 ? "columns" : i === 1 ? "users" : "chart-bar"}
                  size="sm"
                />
                {v}
              </button>
            ))}
          </nav>
          <p className="ds-nav-label">TEMPLATES</p>
          <nav aria-label="Dashboard templates">
            {Object.entries(DASHBOARDS).map(([k, c]) => (
              <a
                key={k}
                href={`/${c.route}`}
                aria-current={k === kind ? "page" : undefined}
              >
                {c.title}
                <Icon name="arrow-up-right" size="sm" />
              </a>
            ))}
          </nav>
          <div className="ds-sidebar-bottom">
            <div>
              <small>WHAT’S NEW</small>
              <strong>Four ways to see it.</strong>
              <p>Reusable blocks for your next dashboard.</p>
              <a href="/changelog">View changelog ↗</a>
            </div>
            <a href="/dashboard-stat-card">Component documentation ↗</a>
          </div>
        </aside>
        <div className="ds-workspace-main">
          <header className="ds-topbar">
            <span>
              {config.title} <span>/ {tab}</span>
            </span>
            <span className="ds-actions">
              <span className="ds-demo">Local demo · October 2026</span>
              <IconButton
                type="tertiary"
                tapScale={1}
                aria-label={dark ? "Use light theme" : "Use dark theme"}
                icon={<Icon name={dark ? "sun" : "moon"} />}
                onClick={() => setDark(!dark)}
              />
            </span>
          </header>
          <main className="ds-main">
            <div className="ds-title">
              <div>
                <p>
                  {kind.toUpperCase()} / {tab.toUpperCase()}
                </p>
                <h1 ref={heading} tabIndex={-1}>
                  {kind === "commerce"
                    ? "Welcome back, Alex."
                    : tab === "Overview"
                      ? config.title + " overview"
                      : tab}
                </h1>
                <span>{config.subtitle}</span>
              </div>
              <label className="ds-period">
                Period
                <select
                  aria-label="Reporting period"
                  value={period}
                  onChange={(e) => setPeriod(Number(e.target.value))}
                >
                  {[7, 14, 30].map((n) => (
                    <option value={n} key={n}>
                      Last {n} days
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="ds-demo-toolbar">
              <span>{points[0].label} – Oct 16, 2026 · USD</span>
              <div className="ds-actions">
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  disabled={loading}
                  onClick={() => refresh(true)}
                >
                  Simulate failure
                </Button>
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  disabled={loading}
                  leadingIcon={<Icon name="refresh" size="sm" />}
                  onClick={() => refresh()}
                >
                  {loading ? "Loading…" : "Refresh"}
                </Button>
              </div>
            </div>
            {error && (
              <div className="ds-error">
                <AgentWorkspaceState
                  error
                  title="Refresh unavailable"
                  description={error}
                  actionLabel="Try again"
                  onAction={() => refresh()}
                />
              </div>
            )}
            <SkeletonReveal
              loading={loading}
              hasData={loaded}
              animate={false}
              label="Loading dashboard"
              skeleton={
                <div className="ds-loading">
                  <div />
                  <div />
                  <div />
                  <section />
                </div>
              }
            >
              <div className="ds-content" aria-busy={loading}>
                {tab !== config.records && (
                  <>
                    {kind !== "membership" && (
                      <div className="ds-stats">
                        <DashboardStatCard
                          label={kind === "crm" ? "Revenue" : "Total revenue"}
                          value={metricMoney(total)}
                          change={percentChange(total, previous)}
                          variant={statVariant}
                          trend={area.slice(-8).map((p) => p.values[0])}
                          icon={
                            kind === "campaigns" ? (
                              <Icon name="chart-bar" size="sm" />
                            ) : undefined
                          }
                        />
                        <DashboardStatCard
                          label={
                            kind === "campaigns"
                              ? "Campaign records"
                              : kind === "crm"
                                ? "Contact records"
                                : "Orders"
                          }
                          value={metricNumber(
                            kind === "commerce" ? orders : recent.length,
                          )}
                          change={
                            kind === "commerce"
                              ? percentChange(orders, Math.round(orders * 0.95))
                              : null
                          }
                          comparison="vs prior sample period"
                          variant={statVariant}
                          icon={
                            kind === "campaigns" ? (
                              <Icon name="users" size="sm" />
                            ) : undefined
                          }
                        />
                        <DashboardStatCard
                          label={
                            kind === "commerce"
                              ? "Average order"
                              : kind === "campaigns"
                                ? "Active campaigns"
                                : "Active contacts"
                          }
                          value={
                            kind === "commerce"
                              ? metricMoney(orders ? total / orders : 0)
                              : String(
                                  recent.filter((r) => r.status === "Active")
                                    .length,
                                )
                          }
                          change={
                            kind === "commerce"
                              ? percentChange(
                                  orders ? total / orders : 0,
                                  previous /
                                    Math.max(1, Math.round(orders * 0.95)),
                                )
                              : null
                          }
                          comparison="vs prior sample period"
                          variant={statVariant}
                        />
                      </div>
                    )}
                    <section className="ds-panel ds-primary-chart">
                      <header>
                        <div>
                          <h2>
                            {kind === "commerce"
                              ? "Sales"
                              : kind === "campaigns"
                                ? "Revenue by audience"
                                : "Revenue over time"}
                          </h2>
                          {kind !== "commerce" && (
                            <strong className="ds-big-number">
                              {metricMoney(total)}
                            </strong>
                          )}
                        </div>
                        <span className="ds-up">
                          ↑ {percentChange(total, previous)?.toFixed(1)}%{" "}
                          <small>vs prior sample period</small>
                        </span>
                      </header>
                      <div className="ds-panel-body">
                        {kind === "commerce" ? (
                          <RevenueMatrix
                            days={area.map((p) => ({
                              date: p.label,
                              value: p.values[0],
                            }))}
                            label="Total sales"
                          />
                        ) : kind === "campaigns" ? (
                          <ComparisonBarChart
                            points={points}
                            series={["New customers", "Returning customers"]}
                            label="Revenue by audience"
                          />
                        ) : (
                          <TrendAreaChart points={area} label="Revenue" />
                        )}
                      </div>
                    </section>
                    <div
                      className={`ds-secondary-grid ${kind === "membership" ? "ds-paired" : ""}`}
                    >
                      {kind === "membership" ? (
                        <>
                          <section className="ds-panel">
                            <header>
                              <div>
                                <h2>Net revenue</h2>
                                <strong className="ds-big-number">
                                  {metricMoney(total * 0.91)}
                                </strong>
                              </div>
                              <Tag>9% sample fees</Tag>
                            </header>
                            <div className="ds-panel-body">
                              <TrendAreaChart
                                points={area.map((p) => ({
                                  ...p,
                                  values: [Math.round(p.values[0] * 0.91)],
                                }))}
                                label="Net revenue"
                              />
                            </div>
                          </section>
                          <section className="ds-panel">
                            <header>
                              <div>
                                <h2>Member activity</h2>
                                <strong className="ds-big-number">
                                  {
                                    recent.filter((r) => r.status === "Active")
                                      .length
                                  }{" "}
                                  active
                                </strong>
                              </div>
                            </header>
                            <div className="ds-panel-body">
                              <ChannelBreakdown
                                channels={channels}
                                label="Member acquisition"
                                selected={channel}
                                onSelect={(id) => {
                                  setChannel(id);
                                  setTab(config.records);
                                }}
                              />
                            </div>
                          </section>
                        </>
                      ) : kind === "crm" ? (
                        <>
                          <section className="ds-panel">
                            <header>
                              <div>
                                <h2>Audience activity</h2>
                                <p>Recorded visits by segment</p>
                              </div>
                            </header>
                            <div className="ds-panel-body">
                              <ComparisonBarChart
                                points={points.slice(-7).map((p) => ({
                                  label: p.label,
                                  values: [
                                    Math.round(p.values[0] / 60),
                                    Math.round(p.values[1] / 40),
                                    Math.round(p.values[0] / 110),
                                  ],
                                }))}
                                series={["Enterprise", "SME", "Startup"]}
                                mode="grouped"
                                unit="visits"
                                label="Audience activity"
                              />
                            </div>
                          </section>
                          <section className="ds-panel">
                            <header>
                              <h2>Pipeline by status</h2>
                            </header>
                            <div className="ds-panel-body">
                              <PipelineFunnel
                                stages={["Pending", "Active", "Completed"].map(
                                  (s) => ({
                                    id: s,
                                    label: s,
                                    value: recent
                                      .filter((r) => r.status === s)
                                      .reduce((a, r) => a + r.value, 0),
                                  }),
                                )}
                              />
                            </div>
                          </section>
                        </>
                      ) : (
                        <>
                          <section className="ds-panel ds-channel-panel">
                            <ChannelBreakdown
                              channels={channels}
                              selected={channel}
                              onSelect={(id) => {
                                setChannel(id);
                                setTab(config.records);
                              }}
                              label="Record sources"
                            />
                          </section>
                          <section className="ds-panel">
                            <header>
                              <h2>
                                {kind === "commerce"
                                  ? "Audience mix"
                                  : "Daily comparison"}
                              </h2>
                            </header>
                            <div className="ds-panel-body">
                              <ComparisonBarChart
                                points={points.slice(-7)}
                                series={[
                                  "New customers",
                                  "Returning customers",
                                ]}
                                mode="grouped"
                                label="Audience revenue"
                              />
                            </div>
                          </section>
                        </>
                      )}
                    </div>
                  </>
                )}
                {tab !== "Reports" && recordsPanel}
                {tab === "Reports" && (
                  <section className="ds-report-note">
                    <h2>About this report</h2>
                    <p>
                      Historical observations are illustrative and independent
                      of editable records. Totals follow the selected period.
                      Exact values are available below each chart. Export
                      filtered records from the {config.records.toLowerCase()}{" "}
                      view.
                    </p>
                    <Button
                      type="secondary"
                      tapScale={1}
                      onClick={() => setTab(config.records)}
                    >
                      View {config.records.toLowerCase()}
                    </Button>
                  </section>
                )}
              </div>
            </SkeletonReveal>
            <p className="ds-message" role="status">
              {loading
                ? "Fetching sample observations…"
                : message || "Changes stay in this demo and reset on reload."}
            </p>
            <footer className="ds-footer">
              <a href="/dashboard-stat-card">Explore the components ↗</a>
              <a
                href="https://x.com/efferdco/status/2110800367026118933"
                target="_blank"
                rel="noreferrer"
              >
                Reference by Efferd ↗
              </a>
            </footer>
          </main>
        </div>
      </div>
      <Dialog.Root
        open={selection !== null}
        onOpenChange={(v) => {
          if (!v) setSelection(null);
        }}
      >
        <Dialog.Portal container={root}>
          <Dialog.Backdrop className="ds-backdrop" />
          <Dialog.Popup
            className="ds-dialog"
            finalFocus={() =>
              trigger.current?.isConnected ? trigger.current : heading.current
            }
          >
            <header>
              <Dialog.Title>
                {selection === "new" ? "Add sample record" : selection?.name}
              </Dialog.Title>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    tapScale={1}
                    aria-label="Close details"
                    icon={<Icon name="x" />}
                  />
                }
              />
            </header>
            <div className="ds-dialog-body">
              <Dialog.Description>
                {selection === "new"
                  ? "Create a record in this local workspace. No message will be sent."
                  : "Read-only details. Removing this record is local and can be undone."}
              </Dialog.Description>
              {selection === "new" ? (
                <form id="ds-form" onSubmit={save} noValidate>
                  <label>
                    Name
                    <input
                      maxLength={60}
                      autoFocus
                      value={draft.name}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      maxLength={100}
                      value={draft.email}
                      onChange={(e) =>
                        setDraft({ ...draft, email: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Value in USD
                    <input
                      inputMode="decimal"
                      value={draft.value}
                      onChange={(e) =>
                        setDraft({ ...draft, value: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Source
                    <select
                      value={draft.channel}
                      onChange={(e) =>
                        setDraft({ ...draft, channel: e.target.value })
                      }
                    >
                      {CHANNELS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  {validation && (
                    <p role="alert" tabIndex={-1} ref={errorRef}>
                      {validation}
                    </p>
                  )}
                </form>
              ) : (
                selection && (
                  <dl>
                    {Object.entries({
                      Email: selection.email,
                      Source: selection.channel,
                      Status: selection.status,
                      Value: formatCurrency(
                        Math.round(selection.value * 100),
                        "USD",
                      ),
                      Added: selection.date,
                    }).map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                )
              )}
            </div>
            <footer>
              <Dialog.Close
                render={
                  <Button type="secondary" tapScale={1}>
                    Close
                  </Button>
                }
              />
              {selection === "new" ? (
                <Button
                  render={<button type="submit" />}
                  form="ds-form"
                  tapScale={1}
                >
                  Add record
                </Button>
              ) : (
                <Button
                  danger
                  tapScale={1}
                  onClick={() => {
                    if (selection) {
                      setUndo(records);
                      setRecords(records.filter((r) => r.id !== selection.id));
                      setSelection(null);
                      setMessage("Record removed locally. Undo restores it.");
                    }
                  }}
                >
                  Remove record
                </Button>
              )}
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

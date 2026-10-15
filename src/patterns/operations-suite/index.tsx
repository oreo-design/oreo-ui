import { useState, type ReactNode } from "react";
import { Tabs } from "@base-ui-components/react/tabs";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { MonitorPanel } from "@/components/edge-monitor";
import {
  OperationsMap,
  OperationsFeed,
  HealthMeters,
  PipelineFile,
  RouteTimeline,
  CameraCheckpoint,
} from "@/components/operations";
import {
  VEHICLES,
  vehicleEvent,
  vehiclePoint,
  vehicleStops,
  vehicleRoute,
  INCIDENTS,
  HEALTH,
  MODULES,
  DEFAULT_CONFIG,
  checkConfig,
  type ConfigCheck,
} from "./data";
import "./operations-suite.css";
const templates = [
  { path: "fleet-control", label: "Fleet control", icon: "truck" },
  { path: "pipeline-workspace", label: "ML workspace", icon: "inline-code" },
  { path: "incident-monitor", label: "Incident monitor", icon: "globe" },
] as const;
function Shell({
  active,
  title,
  subtitle,
  children,
  tools,
}: {
  active: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  tools?: ReactNode;
}) {
  const [dark, setDark] = useState(true);
  return (
    <div className={`operations-suite ${dark ? "theme-dark" : ""}`}>
      <header className="os-topbar">
        <a href="/operations-map" className="os-brand">
          <span>
            <Icon name="columns" size="sm" />
          </span>
          Oreo <strong>Operations</strong>
        </a>
        <nav aria-label="Operations templates">
          {templates.map((t) => (
            <a
              key={t.path}
              href={`/${t.path}`}
              aria-current={active === t.path ? "page" : undefined}
            >
              <Icon name={t.icon} size="sm" />
              <span>{t.label}</span>
            </a>
          ))}
        </nav>
        <IconButton
          type="tertiary"
          tapScale={1}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          onClick={() => setDark(!dark)}
          icon={<Icon name={dark ? "sun" : "moon"} size="sm" />}
        />
      </header>
      <div className="os-heading">
        <div>
          <p className="os-eyebrow">OREO OPERATIONS / LOCAL DEMO</p>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="os-toolbar">{tools}</div>
      </div>
      {children}
      <footer className="os-footer">
        <span>Sample data · Changes reset on reload</span>
        <a
          href="https://x.com/lumeodstudio/status/2110370181365076323"
          target="_blank"
          rel="noreferrer"
        >
          Inspired by Lumeo Studio ↗
        </a>
      </footer>
    </div>
  );
}
function Stat({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: ReactNode;
  detail: string;
  icon: IconName;
}) {
  return (
    <div className="os-stat">
      <p>
        <Icon name={icon} size="sm" />
        {label}
      </p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="os-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function Search({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="os-search">
      <Icon name="search" size="sm" />
      <input
        aria-label={label}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
export function FleetControlPage() {
  const [query, setQuery] = useState(""),
    [status, setStatus] = useState("All"),
    [selected, setSelected] = useState("TRK-04"),
    [ack, setAck] = useState<string[]>([]);
  const vehicles = VEHICLES.filter(
    (v) =>
      (status === "All" || v.status === status) &&
      `${v.id} ${v.driver} ${v.from} ${v.to}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const vehicle = vehicles.find((v) => v.id === selected) ?? vehicles[0];
  const clear = () => {
    setQuery("");
    setStatus("All");
  };
  return (
    <Shell
      active="fleet-control"
      title="Every route. In view."
      subtitle="Fleet dispatch · District network · Snapshot at 16:00"
      tools={
        <Field label="Vehicle status">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", "In transit", "Delayed", "Completed", "Idle"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      }
    >
      <div className="os-stats">
        <Stat
          label="Vehicles"
          value={VEHICLES.length}
          detail="In this sample fleet"
          icon="truck"
        />
        <Stat
          label="On the road"
          value={
            VEHICLES.filter((v) => ["In transit", "Delayed"].includes(v.status))
              .length
          }
          detail="Two on time, one delayed"
          icon="globe"
        />
        <Stat
          label="Delivered"
          value="1"
          detail="Completed at 15:10"
          icon="check"
        />
        <Stat
          label="Needs attention"
          value="1"
          detail="Congestion at district junction"
          icon="warning-circle"
        />
      </div>
      <div className="os-fleet-layout">
        <aside className="os-list-panel">
          <div className="os-panel-heading">
            <h2>Fleet directory</h2>
            <span>{vehicles.length} vehicles</span>
          </div>
          <div className="os-pad">
            <Search value={query} onChange={setQuery} label="Search vehicles" />
          </div>
          <OperationsFeed
            items={vehicles.map(vehicleEvent)}
            selectedId={vehicle?.id}
            onSelect={setSelected}
            emptyTitle="No matching vehicles"
            onClear={clear}
          />
        </aside>
        <main className="os-map-column">
          <div className="os-panel-heading">
            <h2>
              {vehicle
                ? `${vehicle.id} · ${vehicle.from} to ${vehicle.to}`
                : "Fleet map"}
            </h2>
            <span>16:00 snapshot</span>
          </div>
          <OperationsMap
            points={vehicles.map(vehiclePoint)}
            selectedId={vehicle?.id}
            onSelect={setSelected}
            route={vehicle ? vehicleRoute(vehicle) : []}
            label="Fleet locations"
          />
          <p className="os-hint">
            Select a vehicle in the list or map to inspect its route.
          </p>
        </main>
        <aside className="os-detail">
          {vehicle ? (
            <>
              <div className="os-panel-heading">
                <h2>Vehicle details</h2>
                <span>{vehicle.id}</span>
              </div>
              <div className="os-truck">
                <svg
                  viewBox="0 0 320 120"
                  aria-label="Illustrated delivery truck"
                  role="img"
                >
                  <path
                    d="M64 82V32H225V82ZM225 48H268L291 72V91H225"
                    fill="var(--color-bg-surface)"
                    stroke="var(--color-text-tertiary)"
                    strokeWidth="2"
                  />
                  <path
                    d="M239 54H264L279 70H239Z"
                    fill="var(--color-status-progress-subtle)"
                    stroke="var(--color-status-progress)"
                  />
                  <path
                    d="M45 85H294V95H45Z"
                    fill="var(--color-text-tertiary)"
                  />
                  {[86, 202, 266].map((x) => (
                    <g key={x}>
                      <circle
                        cx={x}
                        cy="96"
                        r="15"
                        fill="var(--color-bg-base)"
                        stroke="var(--color-text-secondary)"
                        strokeWidth="3"
                      />
                      <circle
                        cx={x}
                        cy="96"
                        r="5"
                        fill="var(--color-text-secondary)"
                      />
                    </g>
                  ))}
                  <text
                    x="90"
                    y="62"
                    fill="var(--color-text-secondary)"
                    fontSize="14"
                    letterSpacing="3"
                  >
                    OREO LOGISTICS
                  </text>
                </svg>
              </div>
              <div className="os-driver">
                <span className="os-avatar">
                  {vehicle.driver
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </span>
                <div>
                  <strong>{vehicle.driver}</strong>
                  <p>Driver · {vehicle.id} · Electric freight</p>
                </div>
              </div>
              <dl className="os-telemetry">
                {[
                  ["Status", vehicle.status],
                  ["ETA", vehicle.eta],
                  ["Speed", `${vehicle.speed} km/h`],
                  ["Battery", `${vehicle.fuel}%`],
                  ["Cargo", vehicle.weight],
                  ["Temperature", vehicle.temperature],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <section className="os-detail-section">
                <h3>Route progress</h3>
                <RouteTimeline stops={vehicleStops(vehicle)} />
              </section>
              <section className="os-detail-section">
                <h3>Cargo capacity</h3>
                <HealthMeters
                  readings={[
                    {
                      label: vehicle.weight,
                      value: vehicle.load,
                      status: "Loaded",
                      tone: "info",
                    },
                  ]}
                />
              </section>
              {vehicle.status === "Delayed" && (
                <section className="os-detail-section">
                  <h3>Active alert</h3>
                  <p className="os-alert-text">
                    22 minute delay · Congestion at district junction. Revised
                    arrival: {vehicle.eta}.
                  </p>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() =>
                      setAck((a) =>
                        a.includes(vehicle.id)
                          ? a.filter((id) => id !== vehicle.id)
                          : [...a, vehicle.id],
                      )
                    }
                  >
                    {ack.includes(vehicle.id)
                      ? "Undo acknowledgement"
                      : "Acknowledge alert"}
                  </Button>
                  <p role="status" className="os-hint">
                    {ack.includes(vehicle.id)
                      ? "Acknowledged locally. The delay is still active."
                      : "Not yet acknowledged"}
                  </p>
                </section>
              )}
            </>
          ) : (
            <AgentWorkspaceState
              title="No vehicle selected"
              description="Clear the filters to inspect a vehicle."
              actionLabel="Clear filters"
              onAction={clear}
            />
          )}
        </aside>
      </div>
    </Shell>
  );
}
export function PipelineWorkspacePage() {
  const [moduleId, setModuleId] = useState("feature-pipeline"),
    [query, setQuery] = useState(""),
    [tab, setTab] = useState("code"),
    [file, setFile] = useState("source"),
    [config, setConfig] = useState(DEFAULT_CONFIG),
    [saved, setSaved] = useState(DEFAULT_CONFIG),
    [editing, setEditing] = useState(false),
    [checks, setChecks] = useState<ConfigCheck[] | null>(null),
    [notice, setNotice] = useState(""),
    [history, setHistory] = useState<string[]>([]);
  const module = MODULES.find((m) => m.id === moduleId)!;
  const modules = MODULES.filter((m) =>
    m.title.includes(query.trim().toLowerCase()),
  );
  const run = () => {
    const result = checkConfig(config);
    setChecks(result);
    setTab("tests");
    setNotice("");
    setHistory((h) => [
      `Check ${h.length + 1} · ${result.every((c) => c.passed) ? "Passed" : "Failed"} · Configuration validation`,
      ...h,
    ]);
  };
  const save = () => {
    const result = checkConfig(config);
    setChecks(result);
    if (result.every((c) => c.passed)) {
      setSaved(config);
      setEditing(false);
      setNotice("Configuration saved locally.");
    } else {
      setNotice("Fix the configuration before saving.");
    }
  };
  return (
    <Shell
      active="pipeline-workspace"
      title="Feature pipeline"
      subtitle="credit-scoring / v2.0.4 / staging · Illustrative source"
      tools={
        <Button
          type="primary"
          tapScale={1}
          leadingIcon={<Icon name="list-checks" size="sm" />}
          onClick={run}
        >
          Run config checks
        </Button>
      }
    >
      <div className="os-pipeline-layout">
        <aside className="os-pipeline-sidebar">
          <h2 className="os-eyebrow">ML WORKSPACE</h2>
          <Search value={query} onChange={setQuery} label="Find module" />
          <h3 className="os-eyebrow">DOMAIN · CREDIT SCORING</h3>
          <nav aria-label="Pipeline modules">
            {modules.map((m) => (
              <button
                type="button"
                key={m.id}
                aria-pressed={moduleId === m.id}
                onClick={() => {
                  setModuleId(m.id);
                  setFile("source");
                  setTab("code");
                }}
              >
                <Icon name="inline-code" size="sm" />
                {m.title}
                <Icon name="chevron-right" size="sm" />
              </button>
            ))}
          </nav>
          {!modules.length && (
            <AgentWorkspaceState
              title="No modules found"
              description="Try a shorter module name."
              actionLabel="Clear search"
              onAction={() => setQuery("")}
            />
          )}
          <div className="os-pipeline-note">
            <Icon name="brain" size="lg" />
            <h3>Built for the details.</h3>
            <p>
              Inspect source, tune configuration, and keep the pipeline healthy.
            </p>
            <a href="/pipeline-file">Explore the components ↗</a>
          </div>
          <section>
            <h3 className="os-eyebrow">PIPELINE HEALTH · SAMPLE</h3>
            <HealthMeters readings={HEALTH} />
          </section>
        </aside>
        <main className="os-pipeline-main">
          <Tabs.Root value={tab} onValueChange={(v) => setTab(String(v))}>
            <Tabs.List
              aria-label="Pipeline views"
              className="os-tabs"
              activateOnFocus
            >
              {["code", "metrics", "history", "tests"].map((t) => (
                <Tabs.Tab key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            <Tabs.Panel value="code">
              <div className="os-file-tabs" role="group" aria-label="Files">
                <Button
                  type={file === "source" ? "secondary" : "tertiary"}
                  tapScale={1}
                  aria-pressed={file === "source"}
                  onClick={() => setFile("source")}
                >
                  {module.file}
                </Button>
                <Button
                  type={file === "config" ? "secondary" : "tertiary"}
                  tapScale={1}
                  aria-pressed={file === "config"}
                  onClick={() => setFile("config")}
                >
                  config.json{config !== saved ? " •" : ""}
                </Button>
              </div>
              <p className="os-module-description">
                {file === "source"
                  ? module.description
                  : "Shared pipeline configuration · JSON"}
              </p>
              {file === "source" ? (
                <PipelineFile
                  name={module.file}
                  source={module.source}
                  annotations={
                    moduleId === "feature-pipeline"
                      ? [
                          { line: 10, label: "within SLA", tone: "success" },
                          { line: 11, label: "drift limit", tone: "warning" },
                          { line: 14, label: "memory bound", tone: "info" },
                        ]
                      : []
                  }
                />
              ) : (
                <>
                  {editing ? (
                    <div className="os-config-editor">
                      <label htmlFor="pipeline-config">
                        Edit configuration JSON
                      </label>
                      <textarea
                        id="pipeline-config"
                        value={config}
                        onChange={(e) => {
                          setConfig(e.target.value);
                          setChecks(null);
                          setNotice("");
                        }}
                        spellCheck={false}
                      />
                      <div className="os-toolbar">
                        <Button tapScale={1} onClick={save}>
                          Save configuration
                        </Button>
                        <Button
                          type="secondary"
                          tapScale={1}
                          onClick={() => {
                            setConfig(saved);
                            setEditing(false);
                            setNotice("");
                            setChecks(null);
                          }}
                        >
                          Cancel changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <PipelineFile name="config.json" source={config} />
                      <div className="os-pad">
                        <Button
                          type="secondary"
                          tapScale={1}
                          onClick={() => setEditing(true)}
                        >
                          Edit configuration
                        </Button>
                      </div>
                    </>
                  )}
                  {notice && (
                    <p
                      role={notice.startsWith("Fix") ? "alert" : "status"}
                      className="os-notice"
                    >
                      {notice}
                    </p>
                  )}
                  {checks && !checks.every((c) => c.passed) && (
                    <ul className="os-checks">
                      {checks
                        .filter((c) => !c.passed)
                        .map((c) => (
                          <li key={c.label} data-failed="true">
                            <Icon name="warning-circle" size="sm" />
                            {c.label}
                          </li>
                        ))}
                    </ul>
                  )}
                </>
              )}
              <p className="os-hint">
                Source is read-only. Checks validate configuration ranges; no
                Python or model training is executed.
              </p>
            </Tabs.Panel>
            <Tabs.Panel value="metrics">
              <div className="os-tab-content">
                <h2>Pipeline health</h2>
                <p>
                  Fixed sample observations. Changing configuration does not
                  simulate new measurements.
                </p>
                <MonitorPanel
                  title="Data quality snapshot"
                  icon="gauge"
                  detail="16:00"
                >
                  <div className="os-pad">
                    <HealthMeters readings={HEALTH} />
                  </div>
                </MonitorPanel>
                <div className="os-stats">
                  <Stat
                    label="Observations"
                    value="24,816"
                    detail="Sample batch"
                    icon="chart-bar"
                  />
                  <Stat
                    label="Feature count"
                    value="24"
                    detail="Schema v2"
                    icon="columns"
                  />
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="history">
              <div className="os-tab-content">
                <h2>Validation history</h2>
                {history.length ? (
                  <OperationsFeed
                    items={history.map((h, i) => ({
                      id: String(i),
                      title: h,
                      detail: "Local configuration check · No remote run",
                      time: `#${history.length - i}`,
                      tone: h.includes("Passed") ? "success" : "danger",
                    }))}
                  />
                ) : (
                  <AgentWorkspaceState
                    title="No checks yet"
                    description="Run the configuration checks to start a local validation history."
                    actionLabel="Run config checks"
                    onAction={run}
                  />
                )}
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="tests">
              <div className="os-tab-content">
                <h2>Configuration checks</h2>
                <p>
                  Shape and range checks only. Python syntax, data access and
                  model behavior are not tested.
                </p>
                {checks ? (
                  <>
                    <ul className="os-checks">
                      {checks.map((c) => (
                        <li key={c.label} data-failed={!c.passed}>
                          <Icon
                            name={c.passed ? "check" : "warning-circle"}
                            size="sm"
                          />
                          <span>
                            {c.passed ? "Pass" : "Fail"} · {c.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      type="secondary"
                      tapScale={1}
                      onClick={() => {
                        setFile("config");
                        setTab("code");
                        setEditing(true);
                      }}
                    >
                      Edit configuration
                    </Button>
                  </>
                ) : (
                  <AgentWorkspaceState
                    title="Ready to validate"
                    description="Run checks against the current local configuration."
                    actionLabel="Run checks"
                    onAction={run}
                  />
                )}
              </div>
            </Tabs.Panel>
          </Tabs.Root>
        </main>
      </div>
    </Shell>
  );
}
export function IncidentMonitorPage() {
  const [district, setDistrict] = useState("All"),
    [category, setCategory] = useState("All"),
    [selected, setSelected] = useState("INC-108"),
    [resolved, setResolved] = useState<string[]>([]),
    [showResolved, setShowResolved] = useState(false),
    [camera, setCamera] = useState(0);
  const visible = INCIDENTS.filter(
    (i) =>
      (district === "All" || i.district === district) &&
      (category === "All" || i.category === category) &&
      (showResolved || !resolved.includes(i.id)),
  );
  const incident = visible.find((i) => i.id === selected) ?? visible[0];
  const clear = () => {
    setDistrict("All");
    setCategory("All");
    setShowResolved(true);
  };
  const active = INCIDENTS.filter((i) => !resolved.includes(i.id));
  const cameras = ["North Avenue", "East yard", "South depot"];
  return (
    <Shell
      active="incident-monitor"
      title="District overview"
      subtitle="Civic operations · Sample incident response · 12:26 snapshot"
      tools={
        <>
          <Field label="District">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {["All", "North", "East", "South"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["All", "Traffic", "Property", "Infrastructure"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
        </>
      }
    >
      <div className="os-stats">
        <Stat
          label="Active incidents"
          value={active.length}
          detail="Across all sample districts"
          icon="warning-circle"
        />
        <Stat
          label="Resolved"
          value={resolved.length}
          detail="This local session"
          icon="check"
        />
        <Stat
          label="Districts"
          value="3"
          detail="North, East and South"
          icon="globe"
        />
        <Stat
          label="Available units"
          value="12"
          detail="Fixed sample capacity"
          icon="users"
        />
      </div>
      <div className="os-incident-layout">
        <aside className="os-incident-sidebar">
          <h2 className="os-eyebrow">MONITORING</h2>
          <p className="os-section-title">
            <Icon name="columns" size="sm" />
            Overview
          </p>
          <section className="os-detail-section">
            <h3>Active by district</h3>
            <HealthMeters
              readings={["North", "East", "South"].map((d) => ({
                label: d,
                value: active.length
                  ? Math.round(
                      (active.filter((i) => i.district === d).length /
                        active.length) *
                        100,
                    )
                  : 0,
                status: `${active.filter((i) => i.district === d).length} incidents`,
                tone: "info",
              }))}
            />
          </section>
          <section className="os-detail-section">
            <h3>Category breakdown</h3>
            <ul className="os-breakdown">
              {["Traffic", "Property", "Infrastructure"].map((c) => (
                <li key={c}>
                  <span>{c}</span>
                  <strong>
                    {active.filter((i) => i.category === c).length}
                  </strong>
                </li>
              ))}
            </ul>
          </section>
          <label className="os-checkbox">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
            />
            Include resolved incidents
          </label>
        </aside>
        <main className="os-incident-main">
          <div className="os-panel-heading">
            <h2>{visible.length} visible incidents</h2>
            <span>Snapshot · 12:26</span>
          </div>
          <OperationsMap
            label="Incident locations"
            points={visible.map((i) => ({
              id: i.id,
              label: `${i.id} · ${i.title}`,
              x: i.x,
              y: i.y,
              tone: resolved.includes(i.id) ? "success" : i.tone,
            }))}
            selectedId={incident?.id}
            onSelect={setSelected}
          />
          <div className="os-panel-heading">
            <h2>Camera checkpoints</h2>
            <span>Illustrations · No live video</span>
          </div>
          <div className="os-cameras">
            {cameras.map((label, i) => (
              <CameraCheckpoint
                key={label}
                label={label}
                index={i}
                selected={camera === i}
                onSelect={() => setCamera(i)}
              />
            ))}
          </div>
          <p className="os-hint" role="status">
            {cameras[camera]} selected · Demo snapshot; no camera is connected.
          </p>
        </main>
        <aside className="os-detail">
          <div className="os-panel-heading">
            <h2>Incident feed</h2>
            <span>{visible.length}</span>
          </div>
          <OperationsFeed
            items={visible.map((i) => ({
              ...i,
              status: resolved.includes(i.id) ? "Resolved" : "Open",
            }))}
            selectedId={incident?.id}
            onSelect={setSelected}
            onClear={clear}
          />
          {incident && (
            <section
              className="os-detail-section os-incident-selection"
              aria-label="Selected incident"
            >
              <p className="os-eyebrow">
                {incident.id} / {incident.category}
              </p>
              <h3>{incident.title}</h3>
              <p>{incident.detail}</p>
              <p>
                Reported {incident.time} · {incident.district} district
              </p>
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => {
                  setShowResolved(true);
                  setResolved((r) =>
                    r.includes(incident.id)
                      ? r.filter((id) => id !== incident.id)
                      : [...r, incident.id],
                  );
                }}
              >
                {resolved.includes(incident.id)
                  ? "Reopen incident"
                  : "Resolve locally"}
              </Button>
              <p className="os-hint" role="status">
                {resolved.includes(incident.id)
                  ? "Resolved locally. You can reopen this incident."
                  : "Open · No live dispatch service connected."}
              </p>
            </section>
          )}
        </aside>
      </div>
    </Shell>
  );
}

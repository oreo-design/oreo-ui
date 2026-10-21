import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useState, useRef } from "react";
import { Tabs } from "@base-ui-components/react/tabs";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import {
  IncidentRecommendation,
  EdgeMetric,
  MonitorPanel,
  RegionTrafficMap,
  RegionHealthList,
  LatencyChart,
  DeploymentFeed,
  compactNumber,
  type DeploymentEntry,
} from "@/components/edge-monitor";
import {
  REGIONS,
  DEPLOYMENTS,
  REQUESTS,
  latencySamples,
  type MonitorPeriod,
} from "./data";
import "./edge-observatory.css";
import { MonitorReveal } from "@/components/monitor-reveal";
import { routingPreview } from "@/components/edge-monitor/routing";

type View = "overview" | "regions" | "logs" | "deployments";
const VIEWS: { id: View; label: string; icon: IconName }[] = [
  { id: "overview", label: "Overview", icon: "columns" },
  { id: "regions", label: "Regions", icon: "globe" },
  { id: "logs", label: "Logs", icon: "list" },
  { id: "deployments", label: "Deployments", icon: "plane" },
];
export function EdgeObservatory() {
  const [intro, setIntro] = useState(1);
  const introSequence = useRef(1);
  useEffect(() => {
    if (!intro) return;
    const timer = setTimeout(() => setIntro(0), 600);
    return () => clearTimeout(timer);
  }, [intro]);
  const [routingOpen, setRoutingOpen] = useState(false),
    [share, setShare] = useState(30),
    [routingDraft, setRoutingDraft] = useState<{
      share: number;
      moved: number;
    } | null>(null);
  const routingReturn = useRef<HTMLElement | null>(null);
  const source = REGIONS.find((r) => r.id === "sin1")!,
    destination = REGIONS.find((r) => r.id === "hkg1")!;
  const routing = routingPreview(source, destination, share, 41);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 850px)");
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const [dark, setDark] = useThemeMode(true),
    [view, setView] = useState<View>("overview");
  const [period, setPeriod] = useState<MonitorPeriod>("24h"),
    [regionId, setRegionId] = useState("all");
  const [query, setQuery] = useState(""),
    [failed, setFailed] = useState(false);
  const [deployments, setDeployments] = useState(DEPLOYMENTS),
    [detail, setDetail] = useState<DeploymentEntry | null>(null);
  const [notice, setNotice] = useState("");
  const selected = REGIONS.find((r) => r.id === regionId);
  const regionLabel = selected?.city ?? "All regions";
  const regions = selected ? [selected] : REGIONS;
  const rate = regions.reduce((total, r) => total + r.requests, 0);
  const latency = selected?.latency ?? 41;
  const errors = selected?.errors ?? 0.021;
  const hours = period === "1h" ? 1 : period === "24h" ? 24 : 168;
  const visibleRequests = REQUESTS.filter(
    (r) =>
      (regionId === "all" || r.region === regionId) &&
      (!failed || r.status >= 400) &&
      `${r.id} ${r.region} ${r.path} ${r.status}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const clearFilters = () => {
    setRegionId("all");
    setFailed(false);
    setQuery("");
  };
  const trace = () => {
    setRegionId("sin1");
    setQuery("");
    setFailed(true);
    setView("logs");
  };
  const bars = (alert = false) =>
    Array.from({ length: 16 }, (_, i) => ({
      value: 20 + ((i * 17) % 65),
      failed: alert && i > 8 && i < 11,
    }));
  const deploy = () => {
    const entry: DeploymentEntry = {
      id: String(Number(deployments[0]?.id ?? 4131) + 1),
      title: "Preview release from main",
      hash: "local",
      author: "You",
      time: "Now",
      status: "ready",
    };
    setDeployments((items) => [entry, ...items]);
    setNotice(
      `Demo deployment #${entry.id} added. No live release was created.`,
    );
    setDetail(entry);
  };
  return (
    <div
      className={dark ? "theme-dark" : ""}
      onPointerDownCapture={() => setIntro(0)}
      onKeyDownCapture={() => setIntro(0)}
      onChangeCapture={() => setIntro(0)}
    >
      <Tabs.Root
        className="edge-observatory"
        orientation={narrow ? "horizontal" : "vertical"}
        value={view}
        onValueChange={(v) => {
          if (VIEWS.some((x) => x.id === v)) setView(v as View);
        }}
      >
        <aside className="edge-sidebar">
          <a href="/edge-monitor" className="edge-brand">
            <span className="edge-brand-mark">O</span>
            <span>
              <strong>Oreo Edge</strong>
              <small>Pro · sample team</small>
            </span>
            <Icon name="arrow-up-right" size="sm" />
          </a>
          <Tabs.List
            aria-label="Monitor views"
            activateOnFocus
            className="edge-navigation"
          >
            {VIEWS.map((item) => (
              <Tabs.Tab key={item.id} value={item.id}>
                <Icon name={item.icon} size="sm" />
                {item.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <div className="edge-projects">
            <p>Projects</p>
            <span>
              <i className="edge-health" data-elevated />
              storefront-prod
            </span>
          </div>
          <div className="edge-quota">
            <div className="flex justify-between text-xs text-text-tertiary">
              <span>Edge requests</span>
              <span>Oct</span>
            </div>
            <p className="mt-2 text-sm">
              <strong>3.12T</strong>
              <span className="text-text-secondary"> / 5T</span>
            </p>
            <meter
              className="mt-3 w-full"
              min="0"
              max="5000"
              value="3120"
              aria-label="Monthly edge requests, 3.12 trillion of 5 trillion"
            />
            <p className="mt-3 text-xs text-text-tertiary">
              Snapshot · demo data
            </p>
          </div>
        </aside>
        <div className="edge-main">
          <header className="edge-topbar">
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
              <a href="/edge-monitor">Oreo Edge</a>
              <span>/</span>
              <span>storefront-prod</span>
              <span>/</span>
              <span className="text-text-primary">
                {VIEWS.find((v) => v.id === view)?.label}
              </span>
            </div>
            <IconButton
              type="tertiary"
              tapScale={1}
              size="sm"
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() => setDark((v) => !v)}
              icon={<Icon name={dark ? "sun" : "moon"} size="sm" />}
            />
          </header>
          <main className="edge-content">
            <div className="edge-toolbar">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">
                  storefront-prod
                </h1>
                <span className="edge-environment">
                  <i className="edge-health" />
                  Production
                </span>
              </div>
              <div className="edge-controls">
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={(e) => {
                    if (e.detail > 0) setIntro(++introSequence.current);
                  }}
                >
                  Replay intro
                </Button>
                <label>
                  <span className="sr-only">Monitoring period</span>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as MonitorPeriod)}
                  >
                    <option value="1h">Last hour</option>
                    <option value="24h">Last 24 hours</option>
                    <option value="7d">Last 7 days</option>
                  </select>
                </label>
                <label>
                  <span className="sr-only">Region filter</span>
                  <select
                    value={regionId}
                    onChange={(e) => setRegionId(e.target.value)}
                  >
                    <option value="all">All regions</option>
                    {REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.city}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="primary" size="sm" tapScale={1} onClick={deploy}>
                  Simulate deploy
                </Button>
              </div>
            </div>
            <p className="edge-snapshot-label">
              October 15, 2026 · {regionLabel} · {period} snapshot
            </p>
            <MonitorReveal play={intro} className="edge-metrics">
              <EdgeMetric
                label="Requests"
                icon="columns"
                value={compactNumber(rate * hours * 3600)}
                detail={`${compactNumber(rate)} req/s average`}
                bars={bars()}
              />
              <EdgeMetric
                label="p95 latency"
                icon="gauge"
                value={String(latency)}
                unit="ms"
                detail={
                  latency >= 80 ? "Elevated latency" : "Regional snapshot"
                }
                warning={latency >= 80}
                bars={bars(latency >= 80)}
              />
              <EdgeMetric
                label="Error rate"
                icon="warning-circle"
                value={errors.toFixed(3)}
                unit="%"
                detail="5xx / requests"
                warning={errors >= 0.1}
                bars={bars(errors >= 0.1)}
              />
              <EdgeMetric
                label="Cache hit ratio"
                icon="folder"
                value={selected?.id === "sin1" ? "91.8" : "94.2"}
                unit="%"
                detail="Across the edge cache"
                bars={bars()}
              />
            </MonitorReveal>
            {routingDraft && (
              <div className="edge-routing-saved" role="status">
                <span>
                  Local routing draft: shift {routingDraft.share}% (
                  {routingDraft.moved.toLocaleString("en-US")} req/s) from sin1
                  to hkg1. Traffic is unchanged.
                </span>
                <Button
                  size="sm"
                  type="secondary"
                  tapScale={1}
                  onClick={() => {
                    setRoutingDraft(null);
                    setNotice("Local routing draft removed.");
                  }}
                >
                  Undo routing draft
                </Button>
              </div>
            )}
            <Tabs.Panel value="overview">
              <div className="edge-dashboard-grid">
                <div className="edge-primary-stack">
                  <MonitorPanel
                    title="Traffic by region"
                    icon="globe"
                    detail={`${compactNumber(rate)} req/s`}
                    action={
                      <span className="edge-map-legend">
                        <i className="edge-health" />
                        Healthy <i className="edge-health" data-elevated />
                        Elevated
                      </span>
                    }
                  >
                    <RegionTrafficMap
                      detailPlacement="overlay"
                      samples={latencySamples(period, selected ?? source)}
                      reveal={intro}
                      regions={REGIONS}
                      selected={selected?.id ?? "sin1"}
                      onSelect={setRegionId}
                    />
                  </MonitorPanel>
                  <MonitorPanel
                    title="Latency"
                    icon="gauge"
                    detail={`${regionLabel} · ${period}`}
                  >
                    <LatencyChart
                      key={`${period}-${regionId}`}
                      reveal={intro}
                      samples={latencySamples(period, selected)}
                      label={regionLabel}
                    />
                  </MonitorPanel>
                </div>
                <aside className="edge-secondary-stack">
                  <MonitorPanel
                    title="Regions"
                    icon="globe"
                    detail={String(REGIONS.length)}
                    action={
                      <Button
                        type="tertiary"
                        size="sm"
                        tapScale={1}
                        onClick={() => setView("regions")}
                      >
                        All ↗
                      </Button>
                    }
                  >
                    <MonitorReveal play={intro} delay={200}>
                      <IncidentRecommendation
                        source={source}
                        baseline={38}
                        target={destination}
                        headroom={41}
                        onTrace={trace}
                        onReview={() => {
                          routingReturn.current =
                            document.activeElement as HTMLElement;
                          setShare(30);
                          setRoutingOpen(true);
                        }}
                      />
                    </MonitorReveal>
                    <RegionHealthList
                      regions={REGIONS.slice(0, 7)}
                      selected={regionId}
                      onSelect={setRegionId}
                    />
                  </MonitorPanel>
                  <MonitorPanel
                    title="Deployments"
                    icon="plane"
                    action={
                      <Button
                        type="tertiary"
                        size="sm"
                        tapScale={1}
                        onClick={() => setView("deployments")}
                      >
                        All ↗
                      </Button>
                    }
                  >
                    <DeploymentFeed
                      entries={deployments.slice(0, 4)}
                      onSelect={setDetail}
                    />
                  </MonitorPanel>
                </aside>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="regions">
              <div className="edge-regions-view">
                <MonitorPanel
                  title="Global traffic"
                  icon="globe"
                  detail="Select a location"
                >
                  <RegionTrafficMap
                    samples={latencySamples(period, selected ?? source)}
                    regions={REGIONS}
                    selected={selected?.id ?? "sin1"}
                    onSelect={setRegionId}
                  />
                </MonitorPanel>
                <MonitorPanel
                  title="Regional health"
                  icon="gauge"
                  detail="p95 · milliseconds"
                >
                  <RegionHealthList
                    regions={REGIONS}
                    selected={regionId}
                    onSelect={setRegionId}
                  />
                </MonitorPanel>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value="logs">
              <MonitorPanel
                title="Request logs"
                icon="list"
                detail="Recent sample requests"
              >
                <div className="edge-log-tools">
                  <label className="edge-search">
                    <Icon name="search" size="sm" />
                    <span className="sr-only">Search requests</span>
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search path, region or status…"
                    />
                  </label>
                  <label className="flex shrink-0 items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={failed}
                      onChange={(e) => setFailed(e.target.checked)}
                    />
                    Errors only
                  </label>
                  <Button
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </div>
                {visibleRequests.length ? (
                  <div
                    className="edge-table-scroll"
                    role="region"
                    aria-label="Request log table"
                    tabIndex={0}
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Path</th>
                          <th>Region</th>
                          <th>Latency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRequests.map((r) => (
                          <tr key={r.id}>
                            <td>{r.time}</td>
                            <td>
                              <span
                                className="edge-log-status"
                                data-error={r.status >= 400 || undefined}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td>{r.path}</td>
                            <td>{r.region}</td>
                            <td>{r.latency} ms</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <AgentWorkspaceState
                    title="No requests match"
                    description="Try another search or clear your region and status filters."
                    actionLabel="Show all requests"
                    onAction={clearFilters}
                  />
                )}
                <p className="edge-log-count" role="status">
                  {visibleRequests.length} of {REQUESTS.length} recent requests
                  · {regionLabel}
                </p>
              </MonitorPanel>
            </Tabs.Panel>
            <Tabs.Panel value="deployments">
              <MonitorPanel
                title="Deployment history"
                icon="plane"
                detail={`${deployments.length} releases`}
              >
                <DeploymentFeed entries={deployments} onSelect={setDetail} />
              </MonitorPanel>
            </Tabs.Panel>
            <p role="status" className="edge-notice">
              {notice}
            </p>
            <footer className="edge-footer">
              <span>Sample infrastructure · changes reset on reload</span>
              <a href="/edge-monitor">Explore the components ↗</a>
              <a
                href="https://x.com/augustasdesign/status/2110393766754341153"
                target="_blank"
                rel="noreferrer"
              >
                Inspired by Augustas ↗
              </a>
            </footer>
          </main>
        </div>
      </Tabs.Root>
      <Dialog.Root
        open={detail !== null}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <Dialog.Portal>
          <div className={dark ? "theme-dark" : ""}>
            <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50" />
            <Dialog.Popup className="edge-deployment-dialog">
              <div className="flex items-center justify-between gap-3">
                <Dialog.Title className="text-lg font-medium">
                  Deployment #{detail?.id}
                </Dialog.Title>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      size="sm"
                      aria-label="Close deployment"
                      icon={<Icon name="x" size="sm" />}
                    />
                  }
                />
              </div>
              <Dialog.Description className="mt-3 text-sm leading-6 text-text-secondary">
                {detail?.title}
              </Dialog.Description>
              <dl className="edge-deployment-facts">
                <div>
                  <dt>Status</dt>
                  <dd>
                    {detail?.status === "attention"
                      ? "Needs attention"
                      : "Ready"}
                  </dd>
                </div>
                <div>
                  <dt>Commit</dt>
                  <dd className="font-mono">{detail?.hash}</dd>
                </div>
                <div>
                  <dt>Author</dt>
                  <dd>{detail?.author}</dd>
                </div>
                <div>
                  <dt>Environment</dt>
                  <dd>Production preview</dd>
                </div>
              </dl>
              <p className="text-xs leading-5 text-text-tertiary">
                This is a local release preview. No repository, server or
                traffic routing is changed.
              </p>
              {detail?.status === "attention" && (
                <Button
                  type="secondary"
                  tapScale={1}
                  className="mt-5"
                  onClick={() => {
                    setDetail(null);
                    trace();
                  }}
                >
                  Inspect error trace
                </Button>
              )}
            </Dialog.Popup>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={routingOpen} onOpenChange={setRoutingOpen}>
        <Dialog.Portal>
          <div className={dark ? "theme-dark" : ""}>
            <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/50" />
            <Dialog.Popup
              className="edge-routing-dialog"
              finalFocus={() => routingReturn.current}
            >
              <header>
                <Dialog.Title>Review traffic shift</Dialog.Title>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      size="sm"
                      tapScale={1}
                      aria-label="Close routing review"
                      icon={<Icon name="x" size="sm" />}
                    />
                  }
                />
              </header>
              <div className="edge-routing-body">
                <Dialog.Description>
                  Preview a local routing draft from Singapore to Hong Kong.
                  This does not change live traffic.
                </Dialog.Description>
                <label className="edge-routing-share">
                  Share of sin1 requests <output>{share}%</output>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={share}
                    onChange={(e) => setShare(Number(e.target.value))}
                    aria-label="Traffic share"
                    aria-valuetext={`${share} percent`}
                  />
                </label>
                {routing.error ? (
                  <p role="alert" className="text-status-error">
                    {routing.error}
                  </p>
                ) : (
                  <dl className="edge-routing-facts">
                    <div>
                      <dt>Requests moved / s</dt>
                      <dd>{routing.moved.toLocaleString("en-US")}</dd>
                    </div>
                    <div>
                      <dt>sin1 after draft / s</dt>
                      <dd>{routing.sourceAfter.toLocaleString("en-US")}</dd>
                    </div>
                    <div>
                      <dt>hkg1 after draft / s</dt>
                      <dd>{routing.targetAfter.toLocaleString("en-US")}</dd>
                    </div>
                    <div>
                      <dt>hkg1 remaining headroom</dt>
                      <dd>{routing.remainingHeadroom.toFixed(1)}%</dd>
                    </div>
                  </dl>
                )}
                <p>
                  Capacity estimate uses the sample's 41% headroom. Latency and
                  error rates are not predicted. Saving retains only this draft
                  until reload.
                </p>
              </div>
              <footer>
                <Dialog.Close
                  render={<Button type="secondary" size="sm" tapScale={1} />}
                >
                  Cancel
                </Dialog.Close>
                <Button
                  size="sm"
                  tapScale={1}
                  disabled={Boolean(routing.error)}
                  onClick={() => {
                    if (routing.error) return;
                    setRoutingDraft({ share, moved: routing.moved });
                    setRoutingOpen(false);
                    setNotice(
                      "Routing draft saved locally. No traffic changed.",
                    );
                  }}
                >
                  Save local draft
                </Button>
              </footer>
            </Dialog.Popup>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

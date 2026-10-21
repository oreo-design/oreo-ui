import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Switch } from "@/components/switch";
import { AgentWorkspaceState } from "@/components/automation";
import {
  RoutingPolicyControl,
  RoutingFlow,
  RouteMetrics,
} from "@/components/model-routing";
import {
  MODELS,
  DEFAULT_CONFIG,
  routesFor,
  blendedCost,
  type RouterConfig,
} from "./data";
import "./model-router.css";
type Environment = "chat-prod" | "chat-staging";
type Entry = {
  draft: RouterConfig;
  applied: RouterConfig;
  version: number;
  previous?: RouterConfig;
};
const fresh = (): Entry => ({
  draft: { ...DEFAULT_CONFIG },
  applied: { ...DEFAULT_CONFIG },
  version: 14,
});
const same = (a: RouterConfig, b: RouterConfig) =>
  JSON.stringify(a) === JSON.stringify(b);
export function ModelRouter() {
  const [dark, setDark] = useThemeMode(true),
    [playing, setPlaying] = useState(true),
    [selected, setSelected] = useState<string>(),
    [environment, setEnvironment] = useState<Environment>("chat-prod"),
    [entries, setEntries] = useState<Record<Environment, Entry>>({
      "chat-prod": fresh(),
      "chat-staging": fresh(),
    }),
    [settings, setSettings] = useState(false),
    [scenario, setScenario] = useState("healthy"),
    [noTraffic, setNoTraffic] = useState(false),
    [notice, setNotice] = useState(""),
    [probe, setProbe] = useState<{ kind: "success" | "error"; text: string }>();
  const entry = entries[environment],
    config = entry.draft,
    dirty = !same(config, entry.applied);
  const routes = routesFor(config.policy, noTraffic ? 0 : 333),
    cost = blendedCost(config.policy),
    liveCost = blendedCost(entry.applied.policy),
    delta = Math.round((cost / liveCost - 1) * 100),
    detail = routes.find((r) => r.id === selected);
  const invalid = config.fallback && config.from === config.to;
  const edit = (patch: Partial<RouterConfig>) => {
    setEntries((all) => ({
      ...all,
      [environment]: {
        ...all[environment],
        draft: { ...all[environment].draft, ...patch },
      },
    }));
    setNotice("");
  };
  function apply() {
    if (invalid) return;
    setEntries((all) => ({
      ...all,
      [environment]: {
        ...entry,
        previous: { ...entry.applied },
        applied: { ...config },
        version: entry.version + 1,
      },
    }));
    setProbe(undefined);
    setNotice(
      `Policy v${entry.version + 1} applied to ${environment} in this local demo.`,
    );
  }
  function undo() {
    if (!entry.previous) return;
    setEntries((all) => ({
      ...all,
      [environment]: {
        draft: { ...entry.previous! },
        applied: { ...entry.previous! },
        version: entry.version + 1,
      },
    }));
    setProbe(undefined);
    setNotice(`Previous configuration restored as v${entry.version + 1}.`);
  }
  function test() {
    const applied = entry.applied,
      from = MODELS.find((m) => m.id === applied.from)!,
      to = MODELS.find((m) => m.id === applied.to)!;
    setProbe(
      scenario === "healthy"
        ? {
            kind: "success",
            text: `${from.name} responded. No fallback needed.`,
          }
        : !applied.fallback
          ? {
              kind: "error",
              text: `${from.name} is unavailable. Fallback is off; the sample request failed.`,
            }
          : scenario === "both"
            ? {
                kind: "error",
                text: `${from.name} and ${to.name} are unavailable. Retry limit reached; the sample request failed.`,
              }
            : {
                kind: "success",
                text: `${from.name} is unavailable. Recovered on ${to.name} with one retry.`,
              },
    );
  }
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="model-router-page">
        <nav className="mr-page-nav" aria-label="Template navigation">
          <a href="/routing-flow">
            <span className="mr-logo">o</span> oreo <span>/</span> Model router
          </a>
          <div>
            <span className="mr-demo-tag">LOCAL DEMO</span>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              onClick={() => setDark(!dark)}
            />
          </div>
        </nav>
        <main className="mr-stage">
          <article className="mr-panel" aria-labelledby="router-title">
            <header className="mr-header">
              <h1 id="router-title">Model router</h1>
              <div>
                <label className="sr-only" htmlFor="mr-environment">
                  Environment
                </label>
                <select
                  id="mr-environment"
                  value={environment}
                  onChange={(e) => {
                    setEnvironment(e.target.value as Environment);
                    setNotice("");
                    setProbe(undefined);
                  }}
                >
                  <option>chat-prod</option>
                  <option>chat-staging</option>
                </select>
                <IconButton
                  type="tertiary"
                  tapScale={1}
                  aria-label="Router settings"
                  aria-expanded={settings}
                  icon={<Icon name="sliders" />}
                  onClick={() => setSettings(!settings)}
                />
              </div>
            </header>
            <section className="mr-overview" aria-label="Policy preview">
              <div className="mr-overview-top">
                <div>
                  <div className="mr-eyebrow">
                    BLENDED COST{" "}
                    <span>· {dirty ? "DRAFT PREVIEW" : "APPLIED POLICY"}</span>
                  </div>
                  <div className="mr-price">
                    ${cost.toFixed(4)}
                    <span>/ 1K tokens</span>
                  </div>
                </div>
                <RoutingPolicyControl
                  value={config.policy}
                  onChange={(policy) => edit({ policy })}
                />
              </div>
              <div className="mr-statline">
                <span>{noTraffic ? 0 : 333} REQ/S</span>
                <span>·</span>
                <span>
                  {routes
                    .reduce((v, r) => v + (r.errors * r.share) / 100, 0)
                    .toFixed(2)}
                  % EST. ERRORS
                </span>
                <span className="mr-cost-delta" data-lower={delta < 0}>
                  {delta
                    ? `${delta > 0 ? "+" : ""}${delta}% COST VS APPLIED`
                    : "SAMPLE METRICS"}
                </span>
              </div>
              {noTraffic ? (
                <div className="mr-quiet">
                  <AgentWorkspaceState
                    title="Waiting for traffic"
                    description="Routes are ready. Resume sample traffic to see the flow."
                    actionLabel="Resume traffic"
                    onAction={() => setNoTraffic(false)}
                  />
                </div>
              ) : (
                <RoutingFlow
                  routes={routes}
                  active={playing}
                  selected={selected}
                  onSelect={(id) =>
                    setSelected(selected === id ? undefined : id)
                  }
                />
              )}
              <div className="mr-flow-caption">
                <span>Gateway → model routes</span>
                <button
                  type="button"
                  onClick={() => setPlaying(!playing)}
                  aria-pressed={!playing}
                >
                  {playing ? "Pause flow" : "Resume flow"}
                </button>
              </div>
            </section>
            <section className="mr-routes" aria-label="Routes and fallback">
              <RouteMetrics
                routes={routes}
                selected={selected}
                onSelect={(id) => setSelected(selected === id ? undefined : id)}
              />
              {detail && (
                <div className="mr-detail">
                  <div>
                    <strong>{detail.name}</strong>
                    <p>
                      {detail.share}% of requests · {detail.requests} requests/s
                    </p>
                    <p>
                      Sample latency: {detail.p50.toFixed(2)}s median,{" "}
                      {detail.p95.toFixed(2)}s P95.
                    </p>
                  </div>
                  <IconButton
                    type="tertiary"
                    tapScale={1}
                    aria-label="Close route details"
                    icon={<Icon name="x" />}
                    onClick={() => setSelected(undefined)}
                  />
                </div>
              )}
              <div className="mr-fallback">
                <div className="mr-fallback-label">
                  <Switch
                    checked={config.fallback}
                    onCheckedChange={(fallback) => edit({ fallback })}
                    aria-label="Enable fallback"
                  />
                  <strong>Fallback</strong>
                </div>
                <span>if</span>
                <select
                  aria-label="Primary model"
                  disabled={!config.fallback}
                  value={config.from}
                  onChange={(e) => edit({ from: e.target.value })}
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <span>fails, retry on</span>
                <select
                  aria-label="Fallback model"
                  disabled={!config.fallback}
                  value={config.to}
                  onChange={(e) => edit({ to: e.target.value })}
                >
                  {MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              {invalid && (
                <p className="mr-error" role="alert">
                  Choose a different fallback model before applying.
                </p>
              )}
            </section>
            {settings && (
              <section className="mr-settings" aria-label="Router settings">
                <header>
                  <h2>Test your policy</h2>
                  <span>Applied v{entry.version}</span>
                </header>
                <p>
                  Try a sample request against the applied policy. Draft edits
                  are excluded.
                </p>
                <div className="mr-test-controls">
                  <label>
                    Scenario
                    <select
                      value={scenario}
                      onChange={(e) => {
                        setScenario(e.target.value);
                        setProbe(undefined);
                      }}
                    >
                      <option value="healthy">All models healthy</option>
                      <option value="primary">Primary unavailable</option>
                      <option value="both">Both models unavailable</option>
                    </select>
                  </label>
                  <Button
                    type="secondary"
                    size="sm"
                    tapScale={1}
                    onClick={test}
                  >
                    Run test
                  </Button>
                </div>
                {probe && (
                  <p
                    className="mr-probe"
                    data-kind={probe.kind}
                    role={probe.kind === "error" ? "alert" : "status"}
                  >
                    {probe.text}
                  </p>
                )}
                <label className="mr-traffic">
                  <Switch
                    checked={!noTraffic}
                    onCheckedChange={(on) => setNoTraffic(!on)}
                    aria-label="Sample traffic"
                  />
                  <span>Sample traffic</span>
                </label>
                <p>
                  Model names and figures are illustrative fixtures from the
                  reference, not provider prices or benchmarks.
                </p>
              </section>
            )}
            <footer className="mr-footer">
              <span>
                POLICY V{entry.version}
                <i />{" "}
                {dirty
                  ? "UNAPPLIED CHANGES"
                  : `APPLIED TO ${environment.toUpperCase()}`}
              </span>
              <div>
                {dirty && (
                  <Button
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    onClick={() => {
                      edit(entry.applied);
                      setNotice("Draft changes discarded.");
                    }}
                  >
                    Discard
                  </Button>
                )}
                <Button
                  type="primary"
                  size="sm"
                  tapScale={1}
                  disabled={!dirty || invalid}
                  onClick={apply}
                >
                  Apply policy
                </Button>
              </div>
            </footer>
            {notice && (
              <div className="mr-notice" role="status">
                <span>{notice}</span>
                {entry.previous && !dirty && (
                  <Button type="tertiary" size="sm" tapScale={1} onClick={undo}>
                    Undo
                  </Button>
                )}
              </div>
            )}
          </article>
          <div className="mr-context">
            <span>ONE GATEWAY. THE RIGHT MODEL.</span>
            <p>
              Explore the trade-off between cost and quality.
              <br />
              All changes stay in this tab and reset on reload.
            </p>
            <a
              href="https://x.com/disarto_max/status/2110043485743055211"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Maxim Kuznetsov ↗
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}

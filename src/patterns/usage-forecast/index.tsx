import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  ForecastTimeline,
  UsageProjection,
  DailyUsagePace,
  forecastUsage,
  forecastDate,
  forecastLabel,
  forecastPercent,
  forecastCSV,
} from "@/components/usage-forecast";
import { USAGE_ACCOUNTS, FORECAST_NOW } from "./data";
import "./workspace.css";
export function UsageForecastPage() {
  const [dark, setDark] = useThemeMode(true),
    [view, setView] = useState<"Forecast" | "Table">("Forecast"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All accounts"),
    [selectedId, setSelectedId] = useState("claude-pro"),
    [sort, setSort] = useState("Risk first"),
    [scenarios, setScenarios] = useState<Record<string, number>>({}),
    [accounts, setAccounts] = useState(USAGE_ACCOUNTS),
    [notice, setNotice] = useState("");
  const details = useRef<HTMLElement>(null);
  const all = accounts.map((a) =>
    forecastUsage(a, FORECAST_NOW, scenarios[a.id] ?? 1),
  );
  const filtered = all
    .filter(
      (f) =>
        `${f.account.name} ${f.account.plan}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()) &&
        (filter === "All accounts" ||
          (filter === "At risk" && f.atRisk) ||
          (filter === "Within allowance" &&
            f.status === "ready" &&
            !f.atRisk) ||
          (filter === "Needs attention" && f.status !== "ready")),
    )
    .sort((a, b) =>
      sort === "Name A–Z"
        ? a.account.name.localeCompare(b.account.name)
        : sort === "Next reset"
          ? a.account.resetAt - b.account.resetAt
          : Number(b.atRisk) - Number(a.atRisk) ||
            (a.runsOutAt ?? Infinity) - (b.runsOutAt ?? Infinity) ||
            a.account.name.localeCompare(b.account.name),
    );
  const selected =
      filtered.find((f) => f.account.id === selectedId) ?? filtered[0],
    risk = all.filter((f) => f.atRisk),
    earliest = [...risk].sort((a, b) => a.runsOutAt! - b.runsOutAt!)[0];
  const select = (id: string) => {
    setSelectedId(id);
    setNotice("");
  };
  const changeScenario = (id: string, value: number) => {
    setSelectedId(id);
    if (filter !== "All accounts") {
      setFilter("All accounts");
      setNotice("Showing all accounts to keep your scenario in view.");
    }
    setScenarios((s) => ({ ...s, [id]: value }));
  };
  const reset = () => {
    setAccounts(USAGE_ACCOUNTS);
    setScenarios({});
    setQuery("");
    setFilter("All accounts");
    setSelectedId("claude-pro");
    setSort("Risk first");
    setNotice("Sample accounts and scenarios restored.");
  };
  const exportData = () => {
    const url = URL.createObjectURL(
      new Blob([forecastCSV(filtered)], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-usage-forecast.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${filtered.length} visible accounts.`);
  };
  return (
    <div
      className={`usage-forecast-workspace ${dark ? "theme-dark" : "theme-light"}`}
    >
      <header className="ufw-topbar">
        <a href="/forecast-timeline">
          <Icon name="chart-bar" /> Oreo <span>/ Usage forecast</span>
        </a>
        <div>
          <Tag>Sample workspace</Tag>
          <IconButton
            type="tertiary"
            tapScale={1}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
            onClick={() => setDark(!dark)}
          />
        </div>
      </header>
      <main>
        <div className="ufw-page-title">
          <div>
            <p>CAPACITY, WITH CONTEXT</p>
            <h1>Your next reset, in sight.</h1>
            <span>Know which accounts need a little breathing room.</span>
          </div>
          <Button
            type="secondary"
            tapScale={1}
            onClick={reset}
            leadingIcon={<Icon name="reset" size="sm" />}
          >
            Reset demo
          </Button>
        </div>
        <div className="ufw-context">
          <span>
            <span className="ufw-live-dot" /> Snapshot ·{" "}
            {forecastDate(FORECAST_NOW)} UTC
          </span>
          <span>Local sample data · No accounts connected</span>
        </div>
        <section className="ufw-panel" aria-label="Account usage forecasts">
          <header className="ufw-panel-header">
            <div>
              <h2>
                {risk.length
                  ? `${risk.length} accounts run out before reset`
                  : "All forecastable accounts stay within allowance"}
              </h2>
              <p>
                {earliest
                  ? `${earliest.account.name} first, ${forecastDate(earliest.runsOutAt!)} · then exhausted for ${earliest.lockedHours.toFixed(1)} h`
                  : "At the selected pace, no early exhaustion is projected."}
              </p>
            </div>
            <div className="ufw-view" role="group" aria-label="Forecast view">
              {(["Forecast", "Table"] as const).map((v) => (
                <Button
                  key={v}
                  type={view === v ? "secondary" : "tertiary"}
                  size="sm"
                  tapScale={1}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
          </header>
          <div className="ufw-toolbar">
            <label className="ufw-search">
              <Icon name="search" size="sm" />
              <input
                aria-label="Search accounts"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find an account"
                type="search"
              />
            </label>
            <select
              aria-label="Account status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {[
                "All accounts",
                "At risk",
                "Within allowance",
                "Needs attention",
              ].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
            <select
              aria-label="Sort accounts"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {["Risk first", "Name A–Z", "Next reset"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              disabled={!filtered.length}
              onClick={exportData}
              leadingIcon={<Icon name="arrow-down" size="sm" />}
            >
              Export CSV
            </Button>
          </div>
          <p className="ufw-notice" role="status">
            {notice ||
              `${filtered.length} of ${accounts.length} accounts · Outlook assumes a constant pace; forecasts end at reset.`}
          </p>
          <div className="ufw-content">
            <div className="ufw-overview">
              {!filtered.length ? (
                <AgentWorkspaceState
                  title="No accounts match"
                  description="Clear the search and filters to see your sample accounts."
                  actionLabel="Clear filters"
                  onAction={() => {
                    setQuery("");
                    setFilter("All accounts");
                  }}
                />
              ) : view === "Forecast" ? (
                <ForecastTimeline
                  forecasts={filtered}
                  selectedId={selected?.account.id}
                  onSelect={select}
                />
              ) : (
                <div
                  className="ufw-table-scroll"
                  tabIndex={0}
                  role="region"
                  aria-label="Account forecast table"
                >
                  <table>
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th>Used</th>
                        <th>pp/day</th>
                        <th>Outlook</th>
                        <th>Reset · UTC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((f) => (
                        <tr
                          key={f.account.id}
                          data-selected={
                            selected?.account.id === f.account.id || undefined
                          }
                        >
                          <th scope="row">
                            <button
                              type="button"
                              aria-pressed={
                                selected?.account.id === f.account.id
                              }
                              onClick={() => select(f.account.id)}
                            >
                              {f.account.name}
                              <small>{f.account.plan}</small>
                            </button>
                          </th>
                          <td>
                            {f.status === "ready"
                              ? forecastPercent(f.used)
                              : "—"}
                          </td>
                          <td>
                            {f.status === "ready" ? f.rate.toFixed(1) : "—"}
                          </td>
                          <td>{forecastLabel(f)}</td>
                          <td>{forecastDate(f.account.resetAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {selected && (
                <Button
                  className="ufw-detail-link"
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    details.current?.scrollIntoView({ block: "start" });
                    details.current?.focus();
                  }}
                >
                  View selected account ↓
                </Button>
              )}
            </div>
            {selected && (
              <aside
                className="ufw-detail"
                ref={details}
                tabIndex={-1}
                aria-label={`${selected.account.name} forecast details`}
              >
                <header>
                  <span className="uf-monogram">
                    {selected.account.name.slice(0, 1)}
                  </span>
                  <div>
                    <h3>{selected.account.name}</h3>
                    <p>{selected.account.plan}</p>
                  </div>
                  <Tag
                    color={
                      selected.status !== "ready"
                        ? "default"
                        : selected.atRisk
                          ? "orange"
                          : "mint"
                    }
                  >
                    {selected.status !== "ready"
                      ? "No forecast"
                      : selected.atRisk
                        ? "At risk"
                        : "Within allowance"}
                  </Tag>
                </header>
                {selected.status === "ready" ? (
                  <>
                    <UsageProjection forecast={selected} />
                    <dl className="ufw-stats">
                      <div>
                        <dt>Pace</dt>
                        <dd>
                          {selected.allowed > 0
                            ? `${(selected.rate / selected.allowed).toFixed(1)}×`
                            : "—"}{" "}
                          <small>allowance</small>
                        </dd>
                      </div>
                      <div>
                        <dt>Exhausted before reset</dt>
                        <dd>
                          {selected.lockedHours.toFixed(1)} <small>hours</small>
                        </dd>
                      </div>
                    </dl>
                    <div className="ufw-scenario">
                      <label htmlFor="ufw-pace">
                        What if your pace changes?
                        <output>{selected.multiplier.toFixed(2)}×</output>
                      </label>
                      <input
                        id="ufw-pace"
                        aria-label="Forecast pace multiplier"
                        type="range"
                        min="0"
                        max="2"
                        step=".25"
                        value={selected.multiplier}
                        onChange={(e) =>
                          changeScenario(
                            selected.account.id,
                            Number(e.target.value),
                          )
                        }
                      />
                      <div>
                        <span>Pause</span>
                        <span>Recent pace × 2</span>
                      </div>
                      <p>
                        Hypothetical future pace. Historical use stays
                        unchanged.
                      </p>
                      <Button
                        size="sm"
                        type="tertiary"
                        tapScale={1}
                        disabled={selected.multiplier === 1}
                        onClick={() => changeScenario(selected.account.id, 1)}
                      >
                        Restore recent pace
                      </Button>
                    </div>
                    <DailyUsagePace forecast={selected} />
                  </>
                ) : (
                  <>
                    <UsageProjection forecast={selected} />
                    <Button
                      type="secondary"
                      tapScale={1}
                      onClick={() => {
                        setAccounts((list) =>
                          list.map((a) =>
                            a.id === selected.account.id
                              ? { ...a, connected: true }
                              : a,
                          ),
                        );
                        setFilter("All accounts");
                        setSelectedId(selected.account.id);
                        setNotice(
                          "Loaded fictional sample history. No external account was connected.",
                        );
                      }}
                    >
                      Load sample history
                    </Button>
                  </>
                )}
              </aside>
            )}
          </div>
        </section>
        <footer className="ufw-footer">
          <span>
            Forecasts use the latest three observed intervals. Resets start a
            new, unforecasted window.
          </span>
          <div>
            <a href="/forecast-timeline">Explore components ↗</a>
            <a
              href="https://x.com/Niyxuis/status/2110504674143150148"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by nyx ↗
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

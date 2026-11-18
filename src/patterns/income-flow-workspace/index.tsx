import { useMemo, useState, useRef } from "react";
import {
  IncomeFlowCard,
  IncomeComparison,
  incomeMoney,
} from "@/components/income-flow";
import { DashboardStatCard } from "@/components/dashboard-suite";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { useThemeMode } from "@/lib/theme/useThemeMode";
import { INCOME_SOURCES } from "./data";
import "./workspace.css";
export function IncomeFlowWorkspace() {
  const feature = useRef<HTMLElement>(null);
  const [source, setSource] = useState("studio"),
    [count, setCount] = useState(8),
    [index, setIndex] = useState(7),
    [dark, setDark] = useThemeMode(false);
  const chosen = INCOME_SOURCES.find((s) => s.id === source)!,
    points = useMemo(() => chosen.points.slice(-count), [chosen, count]),
    active = Math.min(index, points.length - 1),
    sum = points.reduce((n, p) => n + p.amount, 0),
    peak = points.reduce((a, b) => (a.amount > b.amount ? a : b));
  return (
    <main className="if-workspace">
      <header className="if-site-header">
        <a href="/income-flow-card">
          Oreo UI <span>/ Income Flow</span>
        </a>
        <IconButton
          type="secondary"
          icon={<Icon name={dark ? "sun" : "moon"} />}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          onClick={() => setDark(!dark)}
        />
      </header>
      <div className="if-content">
        <header className="if-page-heading">
          <div>
            <p>STUDIO / OVERVIEW</p>
            <h1>Follow your income.</h1>
            <p>A clearer view of what comes in, month by month.</p>
          </div>
          <div className="if-controls">
            <label>
              Source
              <select
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setIndex(count - 1);
                }}
              >
                {INCOME_SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Period
              <select
                value={count}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setCount(n);
                  setIndex(n - 1);
                }}
              >
                <option value={8}>Last 8 months</option>
                <option value={4}>Last 4 months</option>
              </select>
            </label>
          </div>
        </header>
        <div className="if-overview">
          <section
            className="if-feature"
            aria-label="Income exploration"
            ref={feature}
            tabIndex={-1}
          >
            <IncomeFlowCard
              points={points}
              label="Income"
              tone={chosen.tone}
              value={active}
              onValueChange={setIndex}
            />
            <p>
              Move across the flow to inspect a month. Select a month to keep
              it.
            </p>
            <Button
              type="tertiary"
              size="sm"
              disabled={active === points.length - 1}
              onClick={() => setIndex(points.length - 1)}
            >
              Return to latest
            </Button>
          </section>
          <aside className="if-summary" aria-label="Period summary">
            <div>
              <p>{chosen.name}</p>
              <h2>{chosen.description}</h2>
              <p>
                The bands show the same income total at different intensities,
                not separate categories.
              </p>
            </div>
            <DashboardStatCard
              label="Total income"
              value={incomeMoney(sum)}
              change={null}
              comparison=""
              variant="plain"
            />
            <div className="if-facts">
              <div>
                <span>Monthly average</span>
                <strong>{incomeMoney(Math.round(sum / points.length))}</strong>
              </div>
              <div>
                <span>Highest month</span>
                <strong>
                  {peak.label} · {incomeMoney(peak.amount)}
                </strong>
              </div>
            </div>
          </aside>
        </div>
        <section className="if-ledger" aria-labelledby="if-history">
          <header>
            <h2 id="if-history">Monthly income</h2>
            <span>USD · {points.length} periods</span>
          </header>
          <div
            className="if-table-scroll"
            role="region"
            aria-label="Monthly income records"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Income</th>
                  <th scope="col">Compared with previous month</th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, i) => (
                  <tr key={p.id} data-selected={i === active || undefined}>
                    <th scope="row">{p.label}</th>
                    <td>{incomeMoney(p.amount)}</td>
                    <td>
                      <IncomeComparison
                        current={p.amount}
                        previous={points[i - 1]?.amount}
                        previousLabel={points[i - 1]?.label}
                      />
                    </td>
                    <td>
                      <Button
                        type="tertiary"
                        size="sm"
                        aria-label={`Inspect ${p.label} in chart`}
                        aria-pressed={i === active}
                        onClick={() => {
                          setIndex(i);
                          feature.current?.focus({ preventScroll: true });
                          feature.current?.scrollIntoView({
                            block: "center",
                            behavior: "instant",
                          });
                        }}
                      >
                        {i === active ? "Selected" : "Inspect"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <footer className="if-page-footer">
          <span>Local demo · Example income, no connected accounts.</span>
          <a
            href="https://x.com/cabralorenzo/status/2122727878395638129"
            target="_blank"
            rel="noreferrer"
          >
            Reference by Lorenzo Cabra <Icon name="arrow-up-right" size="sm" />
          </a>
        </footer>
      </div>
    </main>
  );
}

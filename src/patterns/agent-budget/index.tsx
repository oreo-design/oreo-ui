import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useState } from "react";
import { Button } from "@/components/button";
import { AgentWorkspaceState } from "@/components/automation";
import { Icon } from "@/components/icon";
import {
  ActivityWorkspaceShell,
  BudgetMeter,
  ActivityCard,
} from "@/components/activity";
import { RowShell, RowLabel } from "@/patterns/settings/row-primitives";
import {
  MonthlyBudgetCard,
  budgetOutlook,
  runBatch,
  money,
  type BudgetInputs,
} from "@/components/agent-budget";
import "./agent-budget-page.css";
export const DEMO_BUDGET: BudgetInputs = {
  cap: 120000,
  spent: 64000,
  planMax: 200000,
  costPerRun: 25,
  dailySpend: 4000,
  daysToReset: 16,
};
export function AgentBudgetPage() {
  const [dark, setDark] = useThemeMode(false),
    [saved, setSaved] = useState(120000),
    [draft, setDraft] = useState(120000),
    [spent, setSpent] = useState(64000),
    [pace, setPace] = useState(4000),
    [message, setMessage] = useState(""),
    [history, setHistory] = useState<string[]>([]);
  const budget = { ...DEMO_BUDGET, cap: draft, spent, dailySpend: pace },
    active = { ...budget, cap: saved },
    outlook = budgetOutlook(active)!,
    dirty = draft !== saved;
  function log(s: string) {
    setMessage(s);
    setHistory((h) => [s, ...h].slice(0, 8));
  }
  function simulate() {
    const r = runBatch(active, 100);
    setSpent(r.spent);
    setDraft((d) => Math.max(d, r.spent));
    log(
      r.executed
        ? `${r.executed} sample runs completed for ${money(r.executed * budget.costPerRun)}. ${r.executed < 100 ? "Remaining runs paused." : ""}`
        : "Agents are paused. Increase and save your cap to resume.",
    );
  }
  function reset() {
    setSaved(120000);
    setDraft(120000);
    setSpent(64000);
    setPace(4000);
    setHistory([]);
    setMessage("Sample workspace reset.");
  }
  function download() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            savedCap: saved,
            draftCap: draft,
            spent,
            planMax: budget.planMax,
            costPerRun: budget.costPerRun,
            dailySpend: pace,
            currency: "USD",
            unit: "cents",
            daysToReset: 16,
            history,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "agent-budget.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Budget snapshot exported.");
  }
  return (
    <div className={`ab-page ${dark ? "theme-dark" : "theme-light"}`}>
      <ActivityWorkspaceShell
        header={
          <>
            <a href="/monthly-budget-card" className="ab-brand">
              <Icon name="sparkle" />
              Oreo <span>/ Agent budget</span>
            </a>
            <div className="ab-nav-actions">
              <Button
                type="tertiary"
                tapScale={1}
                onClick={() => setDark(!dark)}
              >
                {dark ? "Light theme" : "Dark theme"}
              </Button>
              <Button type="secondary" tapScale={1} onClick={download}>
                Export snapshot
              </Button>
            </div>
          </>
        }
        navigation={
          <nav className="ab-nav" aria-label="Workspace">
            <a href="/activity-workspace">Activity</a>
            <a href="/agent-budget" aria-current="page">
              Budget settings
            </a>
            <a href="/usage-forecast">Usage forecast</a>
            <a href="/model-costs">Model costs</a>
          </nav>
        }
      >
        <div className="ab-page-title">
          <div>
            <p className="ab-eyebrow">WORKSPACE / BILLING</p>
            <h1>Give your agents a budget.</h1>
            <p>Know what your limit buys. Keep the next run predictable.</p>
          </div>
          <span className="ab-plan">Team plan · October 2026</span>
        </div>
        <div className="ab-layout">
          <div>
            <MonthlyBudgetCard
              budget={budget}
              onChange={setDraft}
              dirty={dirty}
              onCancel={() => {
                setDraft(saved);
                setMessage("Draft discarded.");
              }}
              onSave={() => {
                setSaved(draft);
                log(`Monthly cap saved at ${money(draft)}.`);
              }}
            />
            <p className="ab-local-note">
              Sample workspace · changes stay in this preview and reset on
              reload.
            </p>
            <p role="status" className="ab-feedback">
              {message}
            </p>
          </div>
          <aside className="ab-side">
            <ActivityCard
              title="Current budget"
              description="Agent runs use your saved cap."
            >
              <BudgetMeter
                used={spent / 100}
                limit={saved / 100}
                label="Saved monthly cap"
              />
              <div className="ab-run-status">
                <Icon name={outlook.paused ? "prohibit" : "check"} size="sm" />
                <span>
                  {outlook.paused ? "Agents paused" : "Agents ready"} ·{" "}
                  {money(outlook.remaining)} left
                </span>
              </div>
              <Button type="secondary" tapScale={1} onClick={simulate}>
                Run 100 sample agents
              </Button>
              <p className="ab-small">
                {money(budget.costPerRun)} per run. Only affordable whole runs
                execute. Saving a higher cap resumes capacity.
              </p>
            </ActivityCard>
            <section className="ab-policy">
              <h2>How this budget works</h2>
              <RowShell>
                <RowLabel
                  title="Hard spending cap"
                  description="When the next run cannot fit, agents pause. No automatic overage."
                />
              </RowShell>
              <RowShell>
                <RowLabel
                  title="Monthly reset"
                  description="This sample period ends November 1. The preview does not schedule a real reset."
                />
              </RowShell>
              <RowShell>
                <RowLabel
                  title="Recent spending pace"
                  description="Adjust the estimate without changing actual spend."
                />
                <select
                  aria-label="Recent spending pace"
                  value={pace}
                  onChange={(e) => setPace(Number(e.target.value))}
                >
                  <option value="0">No spend</option>
                  <option value="2000">$20 / day</option>
                  <option value="4000">$40 / day</option>
                  <option value="8000">$80 / day</option>
                </select>
              </RowShell>
            </section>
          </aside>
        </div>
        <section className="ab-history">
          <div>
            <h2>Budget activity</h2>
            <Button type="tertiary" tapScale={1} onClick={reset}>
              Reset sample
            </Button>
          </div>
          {history.length ? (
            <ol>
              {history.map((h, i) => (
                <li key={`${i}-${h}`}>
                  <Icon name="clock-history" size="sm" />
                  {h}
                </li>
              ))}
            </ol>
          ) : (
            <AgentWorkspaceState
              title="No budget changes yet"
              description="Saved caps and sample runs will appear here."
            />
          )}
        </section>
        <footer className="ab-bottom">
          <a href="/monthly-budget-card">Explore the components ↗</a>
          <a
            href="https://x.com/HeyAnantJ/status/2110652330110779622"
            target="_blank"
            rel="noreferrer"
          >
            Reference by Anant ↗
          </a>
        </footer>
      </ActivityWorkspaceShell>
    </div>
  );
}

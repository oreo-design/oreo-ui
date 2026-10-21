import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { WorkspaceMetric } from "@/components/command-search";
import {
  RevenueMatrix,
  PipelineFunnel,
  DealTable,
  DEAL_STAGES,
  salesMoney,
  salesSummary,
  dealsCSV,
  type Deal,
  type DealStage,
} from "@/components/sales";
import { SALES_DEALS, REVENUE_DAYS } from "./data";
import "./sales-workspace.css";
const scopes = [
  { label: "Overview", icon: "chart-bar" },
  { label: "Open deals", icon: "folder" },
  { label: "Won deals", icon: "checks" },
] as const;
const blank: Deal = {
  id: "",
  lead: "",
  company: "",
  stage: "New",
  source: "Website",
  value: 0,
  nextStep: "Reach out",
};
export function SalesWorkspacePage() {
  const [dark, setDark] = useThemeMode(true),
    [deals, setDeals] = useState(SALES_DEALS),
    [view, setView] = useState<string>("Overview"),
    [query, setQuery] = useState(""),
    [stage, setStage] = useState("All stages"),
    [sort, setSort] = useState("Recent first"),
    [period, setPeriod] = useState(28),
    [selection, setSelection] = useState<string[]>([]);
  const [draft, setDraft] = useState<Deal | null>(null),
    [amount, setAmount] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [undo, setUndo] = useState<Deal[] | null>(null);
  const root = useRef<HTMLDivElement>(null),
    nameInput = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    createButton = useRef<HTMLButtonElement>(null);
  const summary = salesSummary(deals);
  const filtered = deals
    .filter(
      (d) =>
        (view !== "Open deals" || d.stage !== "Won") &&
        (view !== "Won deals" || d.stage === "Won") &&
        (stage === "All stages" || d.stage === stage) &&
        `${d.lead} ${d.company} ${d.source}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Highest value"
        ? b.value - a.value
        : sort === "Lead A–Z"
          ? a.lead.localeCompare(b.lead)
          : 0,
    );
  const changeView = (next: string) => {
    setView(next);
    setSelection([]);
    setStage("All stages");
    setQuery("");
  };
  const open = (deal?: Deal) => {
    trigger.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setDraft(deal ? { ...deal } : { ...blank });
    setAmount(deal ? String(deal.value) : "");
    setError("");
  };
  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const value = Number(amount);
    if (!draft.lead.trim() || !draft.company.trim() || !draft.nextStep.trim()) {
      setError("Add a lead, company and next step before saving.");
      return;
    }
    if (!amount.trim() || !Number.isFinite(value) || value < 0 || value > 1e9) {
      setError("Enter a deal value from $0 to $1,000,000,000.");
      return;
    }
    const next = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      lead: draft.lead.trim(),
      company: draft.company.trim(),
      nextStep: draft.nextStep.trim(),
      value: Math.round(value * 100) / 100,
    };
    setUndo(deals);
    setDeals(
      draft.id
        ? deals.map((d) => (d.id === draft.id ? next : d))
        : [next, ...deals],
    );
    setNotice(
      `${next.lead} ${draft.id ? "updated" : "created"}. Changes are local to this preview.`,
    );
    setDraft(null);
    setSelection([]);
    setQuery("");
    setStage("All stages");
    setView("Overview");
  }
  function exportDeals() {
    const blob = new Blob(["\uFEFF", dealsCSV(filtered)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = "oreo-sales-deals.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${filtered.length} visible deals as CSV.`);
  }
  function winSelected() {
    setUndo(deals);
    setDeals(
      deals.map((d) =>
        selection.includes(d.id)
          ? { ...d, stage: "Won", nextStep: "Begin onboarding" }
          : d,
      ),
    );
    setNotice(
      `${selection.length} ${selection.length === 1 ? "deal" : "deals"} marked won. Pipeline totals have been updated.`,
    );
    setSelection([]);
  }
  const navigation = (
    <nav aria-label="Sales views">
      {scopes.map((s) => (
        <button
          key={s.label}
          aria-current={view === s.label ? "page" : undefined}
          onClick={() => changeView(s.label)}
        >
          <Icon name={s.icon} />
          {s.label}
          <small>
            {s.label === "Overview"
              ? deals.length
              : s.label === "Open deals"
                ? summary.open
                : deals.length - summary.open}
          </small>
        </button>
      ))}
    </nav>
  );
  return (
    <div
      ref={root}
      className={`sales-workspace ${dark ? "theme-dark" : "theme-light"}`}
    >
      <aside className="sw-sidebar">
        <a className="sw-brand" href="/revenue-matrix">
          <span>
            <Icon name="chart-line" />
          </span>
          Oreo <b>sales</b>
        </a>
        <div className="sw-nav-label">WORKSPACE</div>
        {navigation}
        <div className="sw-nav-label sw-resources">RESOURCES</div>
        <a className="sw-resource" href="/deal-table">
          <Icon name="book-open" />
          Component library
        </a>
        <a className="sw-resource" href="/changelog">
          <Icon name="clock-history" />
          What’s new
        </a>
        <div className="sw-insight">
          <span className="sw-insight-icon">
            <Icon name="sparkle" />
          </span>
          <h2>Keep your next move clear.</h2>
          <p>
            {summary.open} opportunities are still open. Make the next
            conversation count.
          </p>
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            onClick={() => changeView("Open deals")}
          >
            Review open deals
          </Button>
        </div>
        <div className="sw-profile">
          <span>JL</span>
          <div>
            Jamie Lee<small>Sales workspace · Demo</small>
          </div>
        </div>
      </aside>
      <div className="sw-main">
        <header className="sw-topbar">
          <div>
            <span>Workspace</span>
            <Icon name="chevron-right" size="sm" />
            <strong>{view}</strong>
          </div>
          <div>
            <span className="sw-demo">Local demo</span>
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
          <div className="sw-mobile-nav">{navigation}</div>
          <div className="sw-heading">
            <div>
              <p>YOUR RELATIONSHIPS, IN FOCUS</p>
              <h1>
                {view === "Overview"
                  ? "A little clarity. A lot of momentum."
                  : view}
              </h1>
            </div>
            <Button
              render={<button ref={createButton} />}
              tapScale={1}
              leadingIcon={<Icon name="plus" size="sm" />}
              onClick={() => open()}
            >
              Create deal
            </Button>
          </div>
          <div className="sw-notice" role="status">
            <span>
              {notice || "Sample workspace · Changes reset when you reload."}
            </span>
            {undo && (
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  setDeals(undo);
                  setUndo(null);
                  setSelection([]);
                  setNotice("Last change undone.");
                }}
              >
                Undo last change
              </Button>
            )}
          </div>
          <section
            className="sw-metrics sw-enter"
            aria-label="All deals summary"
          >
            {(
              [
                {
                  label: "Open pipeline",
                  value: salesMoney(summary.pipeline, true),
                  detail: "Across all open opportunities",
                  icon: "chart-line",
                },
                {
                  label: "Companies",
                  value: String(summary.companies),
                  detail: "Unique companies in this workspace",
                  icon: "users",
                },
                {
                  label: "Open deals",
                  value: String(summary.open),
                  detail: "Ready for the next conversation",
                  icon: "folder",
                },
                {
                  label: "Won value",
                  value: salesMoney(summary.won, true),
                  detail: "Across all won opportunities",
                  icon: "checks",
                },
              ] as {
                label: string;
                value: string;
                detail: string;
                icon: IconName;
              }[]
            ).map((m) => (
              <WorkspaceMetric
                key={m.label}
                {...m}
                icon={<Icon name={m.icon} size="sm" />}
              />
            ))}
          </section>
          {view === "Overview" && (
            <section className="sw-charts">
              <article className="sw-card">
                <header>
                  <h2>
                    <Icon name="chart-bar" size="sm" />
                    Revenue intensity
                  </h2>
                  <label className="sw-period">
                    <span className="sr-only">Revenue period</span>
                    <select
                      aria-label="Revenue period"
                      value={period}
                      onChange={(e) => setPeriod(Number(e.target.value))}
                    >
                      <option value={28}>28 days</option>
                      <option value={14}>14 days</option>
                      <option value={7}>7 days</option>
                    </select>
                  </label>
                </header>
                <div className="sw-card-content">
                  <RevenueMatrix
                    days={REVENUE_DAYS.slice(-period)}
                    label="Historical bookings"
                  />
                  <p className="sw-chart-note">
                    September 2026 · Sample bookings, separate from open deals.
                  </p>
                </div>
              </article>
              <article className="sw-card">
                <header>
                  <h2>
                    <Icon name="filter" size="sm" />
                    Pipeline by stage
                  </h2>
                  <span>{salesMoney(summary.pipeline, true)}</span>
                </header>
                <div className="sw-card-content">
                  <PipelineFunnel stages={summary.stages} />
                </div>
              </article>
            </section>
          )}
          <section className="sw-card sw-deals">
            <header>
              <div>
                <h2>
                  Recent deals <span>{filtered.length}</span>
                </h2>
                <p>One place for every next step.</p>
              </div>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                leadingIcon={<Icon name="arrow-down" size="sm" />}
                onClick={exportDeals}
                disabled={!filtered.length}
              >
                Export CSV
              </Button>
            </header>
            <div className="sw-filters">
              <label className="sw-search">
                <Icon name="search" size="sm" />
                <input
                  type="search"
                  aria-label="Search deals"
                  placeholder="Search leads, companies, sources…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelection([]);
                  }}
                />
              </label>
              <select
                aria-label="Filter by stage"
                value={stage}
                onChange={(e) => {
                  setStage(e.target.value);
                  setSelection([]);
                }}
              >
                <option>All stages</option>
                {DEAL_STAGES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select
                aria-label="Sort deals"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {["Recent first", "Highest value", "Lead A–Z"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            {selection.length > 0 && (
              <div className="sw-selection">
                <span>{selection.length} selected</span>
                <Button
                  size="sm"
                  type="secondary"
                  tapScale={1}
                  onClick={winSelected}
                >
                  Mark won
                </Button>
                <Button
                  size="sm"
                  type="tertiary"
                  tapScale={1}
                  onClick={() => setSelection([])}
                >
                  Clear selection
                </Button>
              </div>
            )}
            <DealTable
              deals={filtered}
              selectedIds={selection}
              onSelectionChange={setSelection}
              onEdit={open}
              onClear={() => changeView("Overview")}
            />
            <footer>
              <span>
                Values in USD · Progress follows stage, not probability.
              </span>
              <span>
                {filtered.length} of {deals.length} deals
              </span>
            </footer>
          </section>
          <footer className="sw-footer">
            <a href="/revenue-matrix">
              Explore the components <Icon name="arrow-up-right" size="sm" />
            </a>
            <a
              href="https://x.com/Wuraoladesigns/status/2110621316835573992"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Wuraola <Icon name="arrow-up-right" size="sm" />
            </a>
          </footer>
        </main>
      </div>
      <Dialog.Root
        open={!!draft}
        onOpenChange={(v) => {
          if (!v) setDraft(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="sw-backdrop" />
          <Dialog.Popup
            className="sw-dialog"
            initialFocus={nameInput}
            finalFocus={() =>
              trigger.current?.isConnected
                ? trigger.current
                : createButton.current
            }
          >
            <header>
              <div>
                <Dialog.Title>
                  {draft?.id ? "Edit deal" : "Create a deal"}
                </Dialog.Title>
                <Dialog.Description>
                  Keep the relationship and its next step together.
                </Dialog.Description>
              </div>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    tapScale={1}
                    aria-label="Close deal editor"
                    icon={<Icon name="x" />}
                  />
                }
              />
            </header>
            {draft && (
              <form onSubmit={save} noValidate>
                <div className="sw-form">
                  <label>
                    Lead name
                    <input
                      ref={nameInput}
                      value={draft.lead}
                      maxLength={80}
                      onChange={(e) =>
                        setDraft({ ...draft, lead: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Company
                    <input
                      value={draft.company}
                      maxLength={80}
                      onChange={(e) =>
                        setDraft({ ...draft, company: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Deal value (USD)
                    <input
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      aria-invalid={!!error || undefined}
                    />
                  </label>
                  <label>
                    Stage
                    <select
                      value={draft.stage}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          stage: e.target.value as DealStage,
                        })
                      }
                    >
                      {DEAL_STAGES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Source
                    <select
                      value={draft.source}
                      onChange={(e) =>
                        setDraft({ ...draft, source: e.target.value })
                      }
                    >
                      {["Website", "LinkedIn", "Referral", "Event"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Next step
                    <input
                      value={draft.nextStep}
                      maxLength={120}
                      onChange={(e) =>
                        setDraft({ ...draft, nextStep: e.target.value })
                      }
                    />
                  </label>
                  {error && (
                    <p role="alert" className="sw-error">
                      {error}
                    </p>
                  )}
                </div>
                <footer>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => setDraft(null)}
                  >
                    Cancel
                  </Button>
                  <Button tapScale={1} render={<button type="submit" />}>
                    Save deal
                  </Button>
                </footer>
              </form>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

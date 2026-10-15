import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  ExperimentChart,
  VariantResults,
  ExperimentDecision,
  summarizeExperiment,
  signed,
  meetsExperimentGate,
} from "@/components/experiment";
import { EXPERIMENTS, SAMPLE_DAYS, type Experiment } from "./data";
import "./experiment-workspace.css";
export function ExperimentWorkspacePage() {
  const [experiments, setExperiments] = useState(EXPERIMENTS),
    [activeId, setActiveId] = useState(EXPERIMENTS[0].id),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("All experiments"),
    [dark, setDark] = useState(true),
    [day, setDay] = useState<number | undefined>(undefined),
    [notice, setNotice] = useState(""),
    [modal, setModal] = useState<"new" | "edit" | "decide" | null>(null),
    [draft, setDraft] = useState({ name: "", a: "", b: "" }),
    [error, setError] = useState("");
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    newButton = useRef<HTMLButtonElement>(null),
    nameInput = useRef<HTMLInputElement>(null);
  const current = experiments.find((e) => e.id === activeId)!;
  const summary = summarizeExperiment(current.days);
  const listed = experiments.filter(
    (e) =>
      (filter === "All experiments" || e.status === filter) &&
      `${e.name} ${e.id}`.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const ready =
    current.status !== "Draft" &&
    current.status !== "Decided" &&
    meetsExperimentGate(current.days, current.confidence, current.threshold);
  const patch = (update: Partial<Experiment>, message: string) => {
    setExperiments((all) =>
      all.map((e) => (e.id === activeId ? { ...e, ...update } : e)),
    );
    setNotice(message);
  };
  const open = (mode: "new" | "edit" | "decide") => {
    trigger.current = document.activeElement as HTMLElement;
    setError("");
    setDraft(
      mode === "new"
        ? { name: "", a: "", b: "" }
        : { name: current.name, a: current.labels[0], b: current.labels[1] },
    );
    setModal(mode);
  };
  const save = (e: FormEvent) => {
    e.preventDefault();
    const clean = {
      name: draft.name.trim(),
      a: draft.a.trim(),
      b: draft.b.trim(),
    };
    if (!clean.name || !clean.a || !clean.b) {
      setError("Add a name and copy for both variants.");
      return;
    }
    if (clean.a === clean.b) {
      setError("Use different copy so the variants can be compared.");
      return;
    }
    if (modal === "new") {
      const exp: Experiment = {
        id: `EXP-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
        name: clean.name,
        owner: "You",
        labels: [clean.a, clean.b],
        days: [],
        confidence: null,
        status: "Draft",
        threshold: 95,
      };
      setExperiments((all) => [exp, ...all]);
      setActiveId(exp.id);
      setSearch("");
      setFilter("All experiments");
      setDay(undefined);
      setNotice(
        "Draft created. Load the sample dataset to explore its results.",
      );
    } else
      patch(
        { name: clean.name, labels: [clean.a, clean.b] },
        "Experiment labels updated. Observation counts are unchanged.",
      );
    setModal(null);
  };
  return (
    <div
      ref={root}
      className={`experiment-workspace ${dark ? "theme-dark" : ""}`}
    >
      <div className="ew-shell">
        <aside className="ew-sidebar">
          <a className="ew-brand" href="/experiment-chart">
            <span>
              <Icon name="chart-line" />
            </span>
            <strong>Oreo / Experiments</strong>
          </a>
          <div className="ew-team">
            <Avatar name="Charles Postiaux" size="sm" />
            <div>
              <strong>Studio workspace</strong>
              <span>Growth & experiments</span>
            </div>
          </div>
          <label className="ew-search">
            <Icon name="search" size="sm" />
            <input
              aria-label="Search experiments"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search experiments…"
            />
          </label>
          <label className="ew-filter">
            Show
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All experiments</option>
              <option>Draft</option>
              <option>Running</option>
              <option>Paused</option>
              <option>Decided</option>
            </select>
          </label>
          <nav aria-label="Experiments">
            {listed.map((e) => (
              <button
                key={e.id}
                aria-current={activeId === e.id ? "page" : undefined}
                onClick={() => {
                  setActiveId(e.id);
                  setDay(undefined);
                  setNotice("");
                }}
              >
                <Icon name="chart-line" size="sm" />
                <span>
                  <strong>{e.name}</strong>
                  <small>
                    {e.id} · {e.status}
                  </small>
                </span>
              </button>
            ))}
          </nav>
          {!listed.length && (
            <AgentWorkspaceState
              title="No matching experiments"
              description="Try another name or reset your filters."
              actionLabel="Clear filters"
              onAction={() => {
                setSearch("");
                setFilter("All experiments");
              }}
            />
          )}
          <div className="ew-side-footer">
            <Icon name="info" size="sm" />
            <p>
              Local demo
              <br />
              <span>Changes reset on reload.</span>
            </p>
          </div>
        </aside>
        <main>
          <header className="ew-topbar">
            <span>
              Experiments <span>/</span> Results
            </span>
            <div>
              <a href="/experiment-chart">
                Components <Icon name="arrow-up-right" size="sm" />
              </a>
              <IconButton
                aria-label={dark ? "Use light theme" : "Use dark theme"}
                icon={<Icon name={dark ? "sun" : "moon"} />}
                type="tertiary"
                tapScale={1}
                onClick={() => setDark((v) => !v)}
              />
              <Button
                size="sm"
                tapScale={1}
                render={<button ref={newButton} />}
                onClick={() => open("new")}
                leadingIcon={<Icon name="plus" size="sm" />}
              >
                New experiment
              </Button>
            </div>
          </header>
          <div className="ew-content">
            <div className="ew-heading">
              <div>
                <p>LEARN A LITTLE. BUILD SOMETHING BETTER.</p>
                <h1>{current.name}</h1>
                <div>
                  <span>{current.id}</span>
                  <span>·</span>
                  <span>{current.owner}</span>
                  <span>·</span>
                  <span>50/50 allocation</span>
                  <Tag
                    color={
                      current.status === "Running"
                        ? "mint"
                        : current.status === "Decided"
                          ? "blue"
                          : "default"
                    }
                  >
                    {current.status}
                  </Tag>
                </div>
              </div>
              <div className="ew-actions">
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  onClick={() => open("edit")}
                  leadingIcon={<Icon name="pencil" size="sm" />}
                >
                  Edit labels
                </Button>
                {(current.status === "Running" ||
                  current.status === "Paused") && (
                  <Button
                    type="secondary"
                    size="sm"
                    tapScale={1}
                    onClick={() =>
                      patch(
                        {
                          status:
                            current.status === "Running" ? "Paused" : "Running",
                        },
                        current.status === "Running"
                          ? "Experiment paused in this demo."
                          : "Experiment resumed in this demo.",
                      )
                    }
                  >
                    {current.status === "Running"
                      ? "Pause experiment"
                      : "Resume experiment"}
                  </Button>
                )}
              </div>
            </div>
            <div role="status" aria-live="polite" className="ew-notice">
              {notice || "One experiment. Two ways to understand the result."}
            </div>
            {current.status === "Draft" ? (
              <section className="ew-empty">
                <AgentWorkspaceState
                  title="Your next learning starts here"
                  description="This draft has no observations. Load the illustrative 14-day dataset to try both charts and the decision flow."
                  actionLabel="Load sample results"
                  onAction={() => {
                    patch(
                      {
                        days: SAMPLE_DAYS.map((d) => ({
                          ...d,
                          a: { ...d.a },
                          b: { ...d.b },
                        })),
                        confidence: 96,
                        status: "Running",
                      },
                      "Sample results loaded. These observations are illustrative and do not measure your copy.",
                    );
                    setDay(undefined);
                  }}
                />
              </section>
            ) : (
              <div className="ew-cards">
                {(["cumulative", "daily"] as const).map((mode) => (
                  <article key={mode} className="ew-card">
                    <header>
                      <h2>{current.name}</h2>
                      <p>
                        {current.id} ·{" "}
                        {mode === "cumulative"
                          ? "Cumulative conversion"
                          : "Daily comparison"}
                      </p>
                    </header>
                    <div className="ew-stat">
                      <strong>
                        {mode === "daily"
                          ? `${summary.wins} of ${summary.comparable}`
                          : summary.lift === null
                            ? "—"
                            : `${signed(summary.lift, 1)}%`}
                      </strong>
                      <p>
                        {mode === "daily"
                          ? "days B converted better than A"
                          : summary.lift === null
                            ? "Relative lift needs a non-zero A rate"
                            : `${summary.lift >= 0 ? "more" : "fewer"} conversions per visitor with B`}
                      </p>
                    </div>
                    <ExperimentChart
                      key={`${current.id}-${mode}`}
                      days={current.days}
                      mode={mode}
                      label={current.name}
                      selectedIndex={day}
                      onSelectedIndexChange={setDay}
                    />
                    <VariantResults
                      a={summary.a}
                      b={summary.b}
                      labels={current.labels}
                    />
                    <ExperimentDecision
                      state={
                        current.status === "Decided"
                          ? "decided"
                          : ready
                            ? "ready"
                            : "collecting"
                      }
                      confidence={current.confidence}
                      threshold={current.threshold}
                      onDecide={() => open("decide")}
                      onUndo={() =>
                        patch(
                          {
                            status: current.decisionFrom ?? "Paused",
                            decisionFrom: undefined,
                          },
                          "Decision undone. The experiment is back in its previous state.",
                        )
                      }
                    />
                  </article>
                ))}
              </div>
            )}
            <section className="ew-method">
              <div>
                <h2>Decision criteria</h2>
                <p>
                  At least 1,000 visitors per variant, a positive observed lift
                  for B, and the supplied confidence meeting your gate.
                </p>
                <small>
                  Confidence is illustrative metadata, not a statistical
                  calculation from this dataset. Selecting B only records a
                  local decision.
                </small>
              </div>
              <label>
                Confidence gate
                <select
                  aria-label="Confidence gate"
                  value={current.threshold}
                  disabled={current.status === "Decided"}
                  onChange={(e) =>
                    patch(
                      { threshold: Number(e.target.value) },
                      "Confidence gate updated. Readiness has been recalculated.",
                    )
                  }
                >
                  <option value="90">90%</option>
                  <option value="95">95%</option>
                  <option value="99">99%</option>
                </select>
                {current.status === "Decided" && (
                  <span>Undo the decision to change its gate.</span>
                )}
              </label>
            </section>
            <footer className="ew-footer">
              <span>
                {current.days.length
                  ? `Sample observations · ${current.days[0].date} – ${current.days[current.days.length - 1].date}, 2026`
                  : "No observations yet"}
              </span>
              <a
                href="https://x.com/PostiauxCharles/status/2110321094301479197"
                target="_blank"
                rel="noreferrer"
              >
                Inspired by Charles Postiaux{" "}
                <Icon name="arrow-up-right" size="sm" />
              </a>
            </footer>
          </div>
        </main>
      </div>
      <Dialog.Root
        open={modal !== null}
        onOpenChange={(v) => {
          if (!v) setModal(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="ew-backdrop" />
          <Dialog.Popup
            className="ew-dialog"
            initialFocus={modal === "decide" ? undefined : nameInput}
            finalFocus={() =>
              trigger.current?.isConnected ? trigger.current : newButton.current
            }
          >
            <header>
              <div>
                <Dialog.Title>
                  {modal === "decide"
                    ? "Select variant B?"
                    : modal === "new"
                      ? "Create an experiment"
                      : "Edit experiment labels"}
                </Dialog.Title>
                <Dialog.Description>
                  {modal === "decide"
                    ? "Record this choice in the local demo. No live page or traffic allocation will change."
                    : "Name the test and give each variant distinct copy."}
                </Dialog.Description>
              </div>
              <Dialog.Close
                render={
                  <IconButton
                    tapScale={1}
                    aria-label="Close dialog"
                    icon={<Icon name="x" />}
                    type="tertiary"
                  />
                }
              />
            </header>
            {modal === "decide" ? (
              <>
                <div className="ew-dialog-body">
                  <VariantResults
                    a={summary.a}
                    b={summary.b}
                    labels={current.labels}
                  />
                  <p className="ew-decision-note">
                    Observed lift{" "}
                    {summary.lift === null
                      ? "—"
                      : `${signed(summary.lift, 1)}%`}{" "}
                    · {current.confidence}% supplied confidence against a{" "}
                    {current.threshold}% gate.
                  </p>
                </div>
                <footer>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => setModal(null)}
                  >
                    Keep testing
                  </Button>
                  <Button
                    tapScale={1}
                    disabled={!ready}
                    onClick={() => {
                      if (!ready) return;
                      patch(
                        {
                          status: "Decided",
                          decisionFrom:
                            current.status === "Paused" ? "Paused" : "Running",
                        },
                        "Variant B selected locally. You can undo this decision.",
                      );
                      setModal(null);
                    }}
                  >
                    Select B in demo
                  </Button>
                </footer>
              </>
            ) : (
              <form onSubmit={save}>
                <div className="ew-dialog-body">
                  <label>
                    Experiment name
                    <input
                      ref={nameInput}
                      value={draft.name}
                      maxLength={80}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Variant A
                    <input
                      value={draft.a}
                      maxLength={140}
                      onChange={(e) =>
                        setDraft({ ...draft, a: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Variant B
                    <input
                      value={draft.b}
                      maxLength={140}
                      onChange={(e) =>
                        setDraft({ ...draft, b: e.target.value })
                      }
                    />
                  </label>
                  {error && (
                    <p role="alert" className="ew-error">
                      {error}
                    </p>
                  )}
                </div>
                <footer>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </Button>
                  <Button tapScale={1} render={<button type="submit" />}>
                    {modal === "new" ? "Create draft" : "Save labels"}
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

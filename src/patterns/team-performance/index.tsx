import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { WorkspaceMetric } from "@/components/command-search";
import {
  PerformanceScore,
  ReviewProgress,
  MemberPerformanceTable,
  performanceRows,
  performanceSummary,
  reviewCounts,
  validatePerformance,
  performanceCSV,
  type MemberPerformance,
  type PerformanceSort,
  type ReviewState,
} from "@/components/team-performance";
import { makePerformanceData, PERIODS, periodLabel } from "./data";
import "./workspace.css";
export function TeamPerformancePage() {
  const [data, setData] = useState(makePerformanceData),
    [period, setPeriod] = useState<string>(PERIODS[0]),
    [dark, setDark] = useThemeMode(false),
    [query, setQuery] = useState(""),
    [department, setDepartment] = useState("All departments"),
    [review, setReview] = useState("All reviews"),
    [sort, setSort] = useState<PerformanceSort>({
      key: "score",
      direction: "desc",
    }),
    [page, setPage] = useState(0),
    [state, setState] = useState("ready"),
    [notice, setNotice] = useState("");
  const [draft, setDraft] = useState<MemberPerformance | null>(null),
    [score, setScore] = useState(""),
    [done, setDone] = useState(""),
    [error, setError] = useState(""),
    [undo, setUndo] = useState<{
      period: string;
      rows: MemberPerformance[];
    } | null>(null);
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLElement | null>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const rows = data[period],
    scoped = performanceRows(rows, query, department, "All reviews", sort),
    filtered = performanceRows(scoped, "", "All departments", review, sort),
    summary = performanceSummary(scoped),
    counts = reviewCounts(scoped),
    pages = Math.max(1, Math.ceil(filtered.length / 7)),
    current = Math.min(page, pages - 1),
    visible = filtered.slice(current * 7, current * 7 + 7);
  function reset() {
    setQuery("");
    setDepartment("All departments");
    setReview("All reviews");
    setPage(0);
    setState("ready");
  }
  function open(member: MemberPerformance) {
    trigger.current = document.activeElement as HTMLElement;
    setDraft({ ...member });
    setScore(String(member.score));
    setDone(String(member.goalsDone));
    setError("");
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const message = validatePerformance(score, done, draft.goals, draft.note);
    if (message) {
      setError(message);
      return;
    }
    const next = {
      ...draft,
      score: Number(score),
      goalsDone: Number(done),
      note: draft.note.trim(),
      lastReview:
        draft.review === "Completed"
          ? period === "2026-09"
            ? "2026-09-30"
            : "2026-08-31"
          : draft.lastReview,
    };
    setUndo({ period, rows });
    setData({
      ...data,
      [period]: rows.map((m) => (m.id === next.id ? next : m)),
    });
    setDraft(null);
    setNotice(`${next.name}'s sample review saved. Changes reset on reload.`);
  }
  function exportRows() {
    const url = URL.createObjectURL(
      new Blob([performanceCSV(filtered)], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `oreo-team-${period}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${filtered.length} filtered member reviews.`);
  }
  return (
    <div ref={root} className={`tp-workspace ${dark ? "theme-dark" : ""}`}>
      <aside className="tp-sidebar">
        <a className="tp-brand" href="/">
          o. <span>Oreo People</span>
        </a>
        <div className="tp-company">
          <Avatar name="Northstar Studio" size="sm" />
          <span>
            <small>Workspace</small>
            <strong>Northstar Studio</strong>
          </span>
        </div>
        <small className="tp-nav-label">TEAM WORKSPACE</small>
        <nav aria-label="Team workspace">
          <button aria-current="page" onClick={reset}>
            <Icon name="users" />
            Performance
          </button>
          <button
            aria-pressed={review === "Pending"}
            onClick={() => {
              setReview("Pending");
              setPage(0);
            }}
          >
            <Icon name="clock-history" />
            Pending reviews<Tag>{counts.Pending}</Tag>
          </button>
          <button
            aria-pressed={review === "Overdue"}
            onClick={() => {
              setReview("Overdue");
              setPage(0);
            }}
          >
            <Icon name="info" />
            Overdue reviews<Tag>{counts.Overdue}</Tag>
          </button>
        </nav>
        <div className="tp-sidebar-bottom">
          <a href="/member-performance-table">Component library ↗</a>
          <a href="/changelog">What's new ↗</a>
          <span>
            <Avatar name="Jamie Lee" size="sm" />
            <span>
              Jamie Lee<small>Sample manager</small>
            </span>
          </span>
        </div>
      </aside>
      <div className="tp-content">
        <header className="tp-topbar">
          <span>
            Team <span>/</span> <strong>Performance</strong>
          </span>
          <div>
            <Tag>Local demo</Tag>
            <IconButton
              type="tertiary"
              tapScale={1}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark(!dark)}
            />
          </div>
        </header>
        <main>
          <div className="tp-title">
            <div>
              <h1 ref={heading} tabIndex={-1}>
                Team Performance
              </h1>
              <p>Track progress. Recognize growth. Make every review count.</p>
            </div>
            <div>
              <select
                aria-label="Review month"
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  setPage(0);
                  setNotice("");
                  setUndo(null);
                }}
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {periodLabel(p)}
                  </option>
                ))}
              </select>
              <Button
                leadingIcon={<Icon name="arrow-down" />}
                onClick={exportRows}
                disabled={!filtered.length || state !== "ready"}
                tapScale={1}
              >
                Export CSV
              </Button>
            </div>
          </div>
          <div className="tp-metrics">
            <WorkspaceMetric
              label="Average performance"
              value={
                summary.average === null
                  ? "—"
                  : `${summary.average.toFixed(1)} / 100`
              }
              detail={
                summary.delta === null
                  ? "No members in this scope"
                  : `${summary.delta >= 0 ? "+" : ""}${summary.delta.toFixed(1)} points vs previous month`
              }
              icon={<Icon name="chart-line" />}
            />
            <WorkspaceMetric
              label="Top performers"
              value={String(summary.top)}
              detail="Members scoring 90 or above"
              icon={<Icon name="star" />}
            />
            <WorkspaceMetric
              label="Needs attention"
              value={String(summary.attention)}
              detail="Members scoring below 70"
              icon={<Icon name="info" />}
            />
            <WorkspaceMetric
              label="Goal achievement"
              value={
                summary.achievement === null
                  ? "—"
                  : `${Math.round(summary.achievement)}%`
              }
              detail={`${summary.done} of ${summary.goals} goals completed`}
              icon={<Icon name="checks" />}
            />
          </div>
          <p className="tp-scope">
            Summary: {scoped.length} members · {department} ·{" "}
            {query ? `matching “${query}”` : "all names"}. Review status filters
            the table only.
          </p>
          <ReviewProgress
            counts={counts}
            selected={
              review === "All reviews" ? undefined : (review as ReviewState)
            }
            onSelect={(s) => {
              setReview(review === s ? "All reviews" : s);
              setPage(0);
            }}
          />
          <section className="tp-members" aria-label="Member reviews">
            <header>
              <div>
                <h2>Team Member Performance</h2>
                <p>
                  {periodLabel(period)} · Scores and review statuses are sample
                  data.
                </p>
              </div>
              <div className="tp-filters">
                <input
                  type="search"
                  aria-label="Search members"
                  placeholder="Search members…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(0);
                  }}
                />
                <select
                  aria-label="Department"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setPage(0);
                  }}
                >
                  <option>All departments</option>
                  {[...new Set(rows.map((m) => m.department))].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <select
                  aria-label="Review status"
                  value={review}
                  onChange={(e) => {
                    setReview(e.target.value);
                    setPage(0);
                  }}
                >
                  {["All reviews", "Completed", "Pending", "Overdue"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </div>
            </header>
            <MemberPerformanceTable
              members={state === "loading" || state === "empty" ? [] : visible}
              sort={sort}
              onSort={(s) => {
                setSort(s);
                setPage(0);
              }}
              onOpen={open}
              loading={state === "loading"}
              error={
                state === "error"
                  ? "The sample review list could not load. Your local edits are still here."
                  : undefined
              }
              onReset={reset}
            />
            <footer>
              <span>
                {state === "ready"
                  ? filtered.length
                    ? `Showing ${current * 7 + 1}–${Math.min(current * 7 + 7, filtered.length)} of ${filtered.length} members`
                    : "0 members"
                  : "Preview state"}
              </span>
              <nav aria-label="Member pages">
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  disabled={current === 0 || state !== "ready"}
                  onClick={() => setPage(current - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {current + 1} of {pages}
                </span>
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  disabled={current >= pages - 1 || state !== "ready"}
                  onClick={() => setPage(current + 1)}
                >
                  Next
                </Button>
              </nav>
            </footer>
          </section>
          <div className="tp-feedback">
            <p role="status">{notice}</p>
            {undo && (
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  setData({ ...data, [undo.period]: undo.rows });
                  setUndo(null);
                  setNotice("Last review edit undone.");
                }}
              >
                Undo last edit
              </Button>
            )}
          </div>
          <footer className="tp-page-footer">
            <span>Local reviews · Changes reset on reload.</span>
            <a
              href="https://x.com/vektorastudio/status/2110661960425787787"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Vektora Studio ↗
            </a>
            <label>
              Preview state{" "}
              <select
                aria-label="Preview state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                {["ready", "loading", "empty", "error"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
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
          <Dialog.Backdrop className="tp-backdrop" />
          <Dialog.Popup
            className="tp-dialog"
            finalFocus={() =>
              trigger.current?.isConnected ? trigger.current : heading.current
            }
          >
            <form onSubmit={save}>
              <header>
                <div>
                  <Dialog.Title>Review {draft?.name}</Dialog.Title>
                  <Dialog.Description>
                    {periodLabel(period)} · Local sample review
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      icon={<Icon name="x" />}
                      aria-label="Close review"
                    />
                  }
                />
              </header>
              {draft && (
                <div className="tp-dialog-body">
                  <div className="tp-person">
                    <Avatar name={draft.name} />
                    <div>
                      <strong>{draft.name}</strong>
                      <p>
                        {draft.role} · {draft.department}
                      </p>
                    </div>
                    <PerformanceScore value={draft.score} />
                  </div>
                  <p className="tp-help">
                    Save updates this sample period only. Completed reviews use
                    the period's final day as a demo review date.
                  </p>
                  <label>
                    Performance score
                    <input
                      aria-describedby={error ? "tp-form-error" : undefined}
                      inputMode="decimal"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                    />
                  </label>
                  <label>
                    Completed goals <span>of {draft.goals}</span>
                    <input
                      inputMode="numeric"
                      value={done}
                      onChange={(e) => setDone(e.target.value)}
                    />
                  </label>
                  <label>
                    Review state
                    <select
                      value={draft.review}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          review: e.target.value as MemberPerformance["review"],
                        })
                      }
                    >
                      {["Completed", "Pending", "Overdue"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Review note
                    <textarea
                      rows={4}
                      maxLength={500}
                      placeholder="Record a highlight or a next step…"
                      value={draft.note}
                      onChange={(e) =>
                        setDraft({ ...draft, note: e.target.value })
                      }
                    />
                  </label>
                  {error && (
                    <p
                      className="tp-form-error"
                      id="tp-form-error"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </div>
              )}
              <footer>
                <Dialog.Close render={<Button type="secondary" tapScale={1} />}>
                  Cancel
                </Dialog.Close>
                <Button render={<button type="submit" />} tapScale={1}>
                  Save review
                </Button>
              </footer>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

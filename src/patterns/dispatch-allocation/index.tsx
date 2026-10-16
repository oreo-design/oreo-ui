import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import {
  AllocationTimeline,
  RouteJobCard,
  assignJob,
  dispatchDay,
  HOURS,
  hourLabel,
  type Allocation,
  type RouteJob,
} from "@/components/dispatch-allocation";
import { DEMO_DATE, RESOURCES, SAMPLE_JOBS } from "./data";
import "./workspace.css";
export function DispatchAllocationPage() {
  const [jobs, setJobs] = useState(SAMPLE_JOBS),
    [undo, setUndo] = useState<RouteJob[] | null>(null),
    [date, setDate] = useState(DEMO_DATE),
    [query, setQuery] = useState(""),
    [category, setCategory] = useState("All types"),
    [resourceView, setResourceView] = useState<"driver" | "vehicle">("driver"),
    [dark, setDark] = useState(false),
    [editor, setEditor] = useState<RouteJob | null>(null),
    [confirm, setConfirm] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  const draft = jobs.filter(
      (j) => j.allocation?.date === date && !j.dispatched,
    ),
    scheduled = jobs.filter((j) => j.allocation?.date === date);
  function remember() {
    trigger.current = document.activeElement as HTMLElement;
    setError("");
  }
  function commit(next: RouteJob[], message: string) {
    setUndo(jobs);
    setJobs(next);
    setNotice(message);
    setError("");
  }
  function allocate(id: string, value?: Allocation) {
    try {
      commit(
        assignJob(jobs, RESOURCES, id, value),
        value
          ? `${id} allocated to ${RESOURCES.find((r) => r.id === value.resourceId)?.name} at ${hourLabel(value.start)}.`
          : `${id} returned to unassigned jobs.`,
      );
      setEditor(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editor) return;
    const data = new FormData(e.currentTarget);
    allocate(editor.id, {
      resourceId: String(data.get("resource")),
      start: Number(data.get("start")),
      date: String(data.get("date")),
    });
  }
  function clear() {
    setQuery("");
    setCategory("All types");
  }
  function exportSchedule() {
    const blob = new Blob(
      [JSON.stringify({ date, resources: RESOURCES, jobs }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `allocations-${date}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Full schedule exported as JSON.");
  }
  return (
    <div
      ref={root}
      className={`dispatch-workspace ${dark ? "theme-dark" : ""}`}
    >
      <header className="dispatch-nav">
        <a
          href="/allocation-timeline"
          className="flex items-center gap-3 text-sm font-semibold"
        >
          <span className="dispatch-brand">
            <Icon name="truck" />
          </span>
          Oreo Dispatch
        </a>
        <nav aria-label="Operations">
          <span className="dispatch-active">Allocations</span>
          <a href="/fleet-control">Fleet control</a>
        </nav>
        <IconButton
          type="tertiary"
          icon={<Icon name={dark ? "sun" : "moon"} />}
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          onClick={() => setDark(!dark)}
        />
      </header>
      <main className="dispatch-main">
        <div className="dispatch-intro">
          <div>
            <p className="text-xs uppercase tracking-widest text-text-tertiary">
              Operations / Planning
            </p>
            <h1
              ref={heading}
              tabIndex={-1}
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              A place for every journey.
            </h1>
            <p className="mt-3 text-sm text-text-secondary">
              Match the right driver to the next job. Keep the whole day in
              view.
            </p>
          </div>
          <div className="dispatch-summary">
            <strong>
              {scheduled.length}
              <span>scheduled</span>
            </strong>
            <strong>
              {jobs.filter((j) => !j.allocation).length}
              <span>unassigned</span>
            </strong>
            <strong>
              {RESOURCES.length}
              <span>drivers</span>
            </strong>
          </div>
        </div>
        <section className="dispatch-panel" aria-label="Allocation workspace">
          <div className="dispatch-panel-title">
            <h2 className="text-lg font-semibold">Allocations</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                type="secondary"
                size="sm"
                disabled={!undo}
                onClick={() => {
                  if (undo) {
                    setJobs(undo);
                    setUndo(null);
                    setError("");
                    setNotice("Last change undone.");
                  }
                }}
                leadingIcon={<Icon name="reset" />}
              >
                Undo
              </Button>
              <Button type="secondary" size="sm" onClick={exportSchedule}>
                Export
              </Button>
              <Button
                size="sm"
                disabled={!draft.length}
                leadingIcon={<Icon name="truck" />}
                onClick={() => {
                  remember();
                  setConfirm(true);
                }}
              >
                Dispatch ({draft.length})
              </Button>
            </div>
          </div>
          <div className="dispatch-toolbar">
            <div className="flex flex-wrap items-center gap-2">
              <label className="dispatch-date">
                <span className="sr-only">Schedule date</span>
                <input
                  aria-label="Schedule date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    if (e.target.value) setDate(e.target.value);
                  }}
                />
              </label>
              <Button
                type="tertiary"
                size="sm"
                onClick={() => setDate(DEMO_DATE)}
              >
                Demo day
              </Button>
              <label>
                <span className="sr-only">Resource view</span>
                <select
                  aria-label="Resource view"
                  value={resourceView}
                  onChange={(e) =>
                    setResourceView(e.target.value as "driver" | "vehicle")
                  }
                >
                  <option value="driver">Drivers</option>
                  <option value="vehicle">Vehicles</option>
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="dispatch-search">
                <Icon name="search" size="sm" />
                <input
                  aria-label="Search jobs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job, customer or location…"
                />
              </label>
              <select
                aria-label="Job type"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {["All types", "Private hire", "Provisional", "Contract"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
            </div>
          </div>
          {error && !editor && (
            <div role="alert" className="dispatch-feedback text-status-error">
              {error}
            </div>
          )}
          <AllocationTimeline
            jobs={jobs}
            resources={RESOURCES}
            date={date}
            query={query}
            category={category}
            resourceView={resourceView}
            onAssign={allocate}
            onOpen={(job) => {
              remember();
              setEditor(job);
            }}
            onClearFilters={clear}
          />
          <div className="dispatch-panel-footer">
            <span className="flex flex-wrap gap-4">
              <span>
                <span className="text-status-progress">●</span> Private hire
              </span>
              <span>
                <span className="text-status-success">●</span> Provisional
              </span>
              <span>
                <span className="text-status-error">●</span> Contract
              </span>
            </span>
            <span>08:00–18:00 · Local schedule</span>
          </div>
        </section>
        <div className="dispatch-status" role="status" aria-live="polite">
          {notice ||
            "Ready to allocate. Changes stay in this demo and reset on reload."}
        </div>
        <footer className="dispatch-footer">
          <span>Local demo · Dispatch marks sample jobs only</span>
          <a
            href="https://x.com/maybepratikk/status/2110717643322015819"
            target="_blank"
            rel="noreferrer"
          >
            Reference by Pratik ↗
          </a>
          <a href="/allocation-timeline">Components ↗</a>
        </footer>
      </main>
      <Dialog.Root
        open={!!editor || confirm}
        onOpenChange={(open) => {
          if (!open) {
            setEditor(null);
            setConfirm(false);
            setError("");
          }
        }}
      >
        <Dialog.Portal container={root}>
          <Dialog.Backdrop className="dispatch-backdrop" />
          <Dialog.Popup
            className="dispatch-dialog"
            finalFocus={() =>
              trigger.current?.isConnected ? trigger.current : heading.current
            }
          >
            <div className="dispatch-dialog-title">
              <Dialog.Title className="text-lg font-semibold">
                {confirm
                  ? "Review dispatch"
                  : editor?.dispatched
                    ? "Dispatched job"
                    : "Allocate job"}
              </Dialog.Title>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    icon={<Icon name="x" />}
                    aria-label="Close allocation dialog"
                  />
                }
              />
            </div>
            <Dialog.Description className="px-6 pt-2 text-sm leading-6 text-text-secondary">
              {confirm
                ? `Mark all ${draft.length} scheduled draft jobs on ${date} as dispatched. Search filters do not limit dispatch. No messages or bookings are sent.`
                : "Choose a driver and an available start time. Jobs must fit the driver’s capacity and finish by 18:00."}
            </Dialog.Description>
            {confirm ? (
              <>
                <ul className="dispatch-dialog-body">
                  {draft.map((j) => (
                    <li
                      className="py-3 border-b border-border-subtle"
                      key={j.id}
                    >
                      <strong className="text-sm">
                        {j.id} · {j.from} → {j.to}
                      </strong>
                      <p className="mt-1 text-xs text-text-secondary">
                        {
                          RESOURCES.find(
                            (r) => r.id === j.allocation?.resourceId,
                          )?.name
                        }{" "}
                        · {hourLabel(j.allocation!.start)}–
                        {hourLabel(j.allocation!.start + j.duration)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="dispatch-dialog-actions">
                  <Button type="secondary" onClick={() => setConfirm(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      commit(
                        dispatchDay(jobs, date),
                        `${draft.length} sample jobs marked as dispatched.`,
                      );
                      setConfirm(false);
                    }}
                  >
                    Confirm dispatch
                  </Button>
                </div>
              </>
            ) : (
              editor && (
                <form onSubmit={submit}>
                  <div className="dispatch-dialog-body">
                    <RouteJobCard job={editor} />
                    <div className="dispatch-fields">
                      <label>
                        Driver
                        <select
                          name="resource"
                          disabled={editor.dispatched}
                          defaultValue={
                            editor.allocation?.resourceId ??
                            RESOURCES.find((r) => r.seats >= editor.passengers)
                              ?.id
                          }
                        >
                          {RESOURCES.map((r) => (
                            <option value={r.id} key={r.id}>
                              {r.name} · {r.seats} seats
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Date
                        <input
                          type="date"
                          name="date"
                          required
                          disabled={editor.dispatched}
                          defaultValue={editor.allocation?.date ?? date}
                        />
                      </label>
                      <label>
                        Start time
                        <select
                          name="start"
                          disabled={editor.dispatched}
                          defaultValue={editor.allocation?.start ?? 8}
                        >
                          {HOURS.map((h) => (
                            <option value={h} key={h}>
                              {hourLabel(h)}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {error && (
                      <p
                        role="alert"
                        className="mt-4 text-sm text-status-error"
                      >
                        {error}
                      </p>
                    )}
                    {editor.dispatched && (
                      <p className="mt-4 text-sm text-text-secondary">
                        Dispatched allocations are locked. Use Undo to reverse
                        the last dispatch.
                      </p>
                    )}
                  </div>
                  <div className="dispatch-dialog-actions">
                    {editor.allocation && !editor.dispatched && (
                      <Button
                        type="secondary"
                        onClick={() => allocate(editor.id)}
                      >
                        Unassign
                      </Button>
                    )}
                    <Button type="secondary" onClick={() => setEditor(null)}>
                      Close
                    </Button>
                    {!editor.dispatched && (
                      <Button render={<button type="submit" />}>
                        Save allocation
                      </Button>
                    )}
                  </div>
                </form>
              )
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

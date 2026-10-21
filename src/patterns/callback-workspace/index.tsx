import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import {
  CallbackBoard,
  CallbackPriority,
  CALLBACK_STAGES,
  callbackMoney,
  callbackDate,
  type Callback,
  type CallbackStage,
} from "@/components/callback";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Switch } from "@/components/switch";
import { AgentWorkspaceState } from "@/components/automation";
import {
  INITIAL_CALLBACKS,
  PEOPLE,
  BRANCHES,
  SAMPLE_TODAY,
  ageInDays,
} from "./data";
import "./callback-workspace.css";
const VIEWS = [
  { id: "all", label: "All open" },
  { id: "repeat", label: "Repeat failures" },
  { id: "impact", label: "High impact" },
  { id: "parts", label: "Awaiting parts" },
  { id: "older", label: "Older than 7 days" },
  { id: "resolved", label: "Resolved" },
];
function matches(c: Callback, view: string) {
  if (view === "resolved") return c.stage === "resolved";
  if (c.stage === "resolved") return false;
  return view === "repeat"
    ? c.repeat
    : view === "impact"
      ? ["High", "Critical"].includes(c.priority)
      : view === "parts"
        ? c.awaitingParts
        : view === "older"
          ? ageInDays(c.reported) > 7
          : true;
}
export function CallbackWorkspace() {
  const [callbacks, setCallbacks] = useState(INITIAL_CALLBACKS),
    [mine, setMine] = useState(false),
    [view, setView] = useState("all"),
    [branch, setBranch] = useState("all"),
    [query, setQuery] = useState("");
  const [grouped, setGrouped] = useState(false),
    [layout, setLayout] = useState("board"),
    [sort, setSort] = useState("default"),
    [dark, setDark] = useThemeMode(false),
    [navOpen, setNavOpen] = useState(false);
  const [draft, setDraft] = useState<Callback | null>(null),
    [cost, setCost] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [archived, setArchived] = useState<Callback | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null),
    headingRef = useRef<HTMLHeadingElement>(null),
    searchRef = useRef<HTMLInputElement>(null),
    titleRef = useRef<HTMLInputElement>(null),
    returnTo = useRef<HTMLElement | null>(null),
    nextId = useRef(2880);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !draft) {
        e.preventDefault();
        setNavOpen(true);
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [draft]);
  const team = callbacks.filter((c) => !mine || c.ownerId === "nate");
  const scoped = team.filter(
    (c) => matches(c, view) && (branch === "all" || c.branch === branch),
  );
  const visible = scoped.filter((c) =>
    `${c.customer} ${c.id} ${c.issue} ${PEOPLE.find((p) => p.id === c.ownerId)?.name}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  if (sort === "cost") visible.sort((a, b) => b.cost - a.cost);
  if (sort === "age")
    visible.sort((a, b) => a.reported.localeCompare(b.reported));
  if (sort === "priority")
    visible.sort(
      (a, b) =>
        ["Critical", "High", "Medium", "Low"].indexOf(a.priority) -
        ["Critical", "High", "Medium", "Low"].indexOf(b.priority),
    );
  const emptyQueue =
    !query.trim() && branch === "all" && view === "all" && !mine;
  const owners = PEOPLE.filter((p) => visible.some((c) => c.ownerId === p.id));
  const stages: CallbackStage[] =
    view === "resolved" ? ["resolved"] : ["new", "review", "scheduled"];
  const heading = VIEWS.find((v) => v.id === view)?.label ?? "All open";
  function open(
    item?: Callback,
    stage: CallbackStage = "new",
    groupBranch?: string,
  ) {
    returnTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const next = item
      ? { ...item }
      : {
          id: `CB-${nextId.current++}`,
          customer: "",
          issue: "",
          stage,
          priority: "Medium" as const,
          reported: SAMPLE_TODAY,
          cost: 0,
          ownerId: "nate",
          branch:
            groupBranch && groupBranch !== "all"
              ? groupBranch
              : branch === "all"
                ? "Dallas"
                : branch,
          repeat: false,
          awaitingParts: false,
          notes: "",
        };
    setDraft(next);
    setCost(String(next.cost));
    setError("");
    setNavOpen(false);
  }
  function reject(message: string) {
    setError(message);
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ block: "nearest" });
      errorRef.current?.focus();
    });
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    if (!draft.customer.trim() || !draft.issue.trim()) {
      reject("Add a customer name and a short issue summary.");
      return;
    }
    if (
      !draft.reported ||
      draft.reported > SAMPLE_TODAY ||
      !Number.isFinite(Date.parse(draft.reported))
    ) {
      reject(
        "Choose a reported date on or before the sample date, October 6, 2026.",
      );
      return;
    }
    const value = Number(cost);
    if (
      !cost.trim() ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 1000000
    ) {
      reject("Enter a cost between $0 and $1,000,000.");
      return;
    }
    const saved = {
      ...draft,
      customer: draft.customer.trim(),
      issue: draft.issue.trim(),
      cost: Math.round(value * 100) / 100,
    };
    setCallbacks((items) =>
      items.some((c) => c.id === saved.id)
        ? items.map((c) => (c.id === saved.id ? saved : c))
        : [...items, saved],
    );
    setNotice(
      `${saved.id} saved in ${CALLBACK_STAGES[saved.stage]}. Current filters still apply.`,
    );
    setDraft(null);
  }
  function clear() {
    setQuery("");
    setBranch("all");
    setView("all");
    setMine(false);
  }
  function archive() {
    if (!draft) return;
    setArchived(callbacks.find((c) => c.id === draft.id) ?? null);
    setCallbacks((cs) => cs.filter((c) => c.id !== draft.id));
    setNotice(`${draft.id} archived from this demo.`);
    setDraft(null);
  }
  function board(items: Callback[], groupBranch: string) {
    return (
      <CallbackBoard
        callbacks={items}
        people={PEOPLE}
        stages={stages}
        onOpen={(c) => open(c)}
        onCreate={(s) => open(undefined, s, groupBranch)}
        showBranch={!grouped}
      />
    );
  }
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div className="callback-workspace">
        <aside className="cb-rail" aria-label="Workspace tools">
          <a
            href="/callback-card"
            className="cb-brand"
            aria-label="Callback components"
          >
            R<span />
          </a>
          <button
            type="button"
            aria-label="Show all callbacks"
            className="cb-rail-active"
            onClick={clear}
          >
            <Icon name="chat-check" />
          </button>
          <a href="/project-workspace" aria-label="Project workspace">
            <Icon name="columns" />
          </a>
          <a href="/invoice-workspace" aria-label="Invoice workspace">
            <Icon name="list-checks" />
          </a>
          <div className="cb-rail-bottom">
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark(!dark)}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
            <Avatar name="Nate Coleman" size="sm" />
          </div>
        </aside>
        <aside
          className="cb-sidebar"
          data-open={navOpen || undefined}
          aria-label="Callback filters"
        >
          <header>
            <h2>Callbacks</h2>
            <IconButton
              className="cb-filter-close"
              type="tertiary"
              tapScale={1}
              aria-label="Close filters"
              icon={<Icon name="x" />}
              onClick={() => setNavOpen(false)}
            />
            <IconButton
              type="secondary"
              tapScale={1}
              aria-label="New callback"
              icon={<Icon name="plus" />}
              onClick={() => open()}
            />
          </header>
          <div className="cb-team" role="group" aria-label="Callback ownership">
            {[false, true].map((isMine) => (
              <button
                key={String(isMine)}
                type="button"
                aria-pressed={mine === isMine}
                onClick={() => setMine(isMine)}
              >
                {isMine ? "Mine" : "Team"}
              </button>
            ))}
          </div>
          <label className="cb-search">
            <Icon name="search" size="sm" />
            <input
              ref={searchRef}
              aria-label="Search callbacks"
              placeholder="Search callbacks"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>⌘K</kbd>
          </label>
          <nav aria-label="Callback views">
            {VIEWS.map((v, i) => (
              <div key={v.id}>
                {i === 1 && (
                  <div className="cb-nav-heading">
                    <Icon name="sliders" size="sm" />
                    Views
                  </div>
                )}
                <button
                  type="button"
                  aria-current={view === v.id ? "page" : undefined}
                  onClick={() => {
                    setView(v.id);
                    setNavOpen(false);
                  }}
                >
                  <span>{v.label}</span>
                  <b data-alert={v.id === "repeat" || undefined}>
                    {team.filter((c) => matches(c, v.id)).length}
                  </b>
                </button>
              </div>
            ))}
          </nav>
          <div className="cb-nav-heading">
            <Icon name="folder" size="sm" />
            Branches
          </div>
          <div className="cb-branches" role="group" aria-label="Branches">
            {["all", ...BRANCHES].map((b) => (
              <button
                type="button"
                key={b}
                aria-pressed={branch === b}
                onClick={() => {
                  setBranch(b);
                  setNavOpen(false);
                }}
              >
                <span>{b === "all" ? "All branches" : b}</span>
                <b>
                  {
                    team.filter(
                      (c) =>
                        matches(c, view) && (b === "all" || c.branch === b),
                    ).length
                  }
                </b>
              </button>
            ))}
          </div>
          <footer>
            <span>Signed in as Nate Coleman</span>
            <a href="/callback-card">
              Component documentation <Icon name="arrow-up-right" size="sm" />
            </a>
          </footer>
        </aside>
        <main className="cb-main">
          <div className="cb-mobile-tools">
            <Button
              type="secondary"
              tapScale={1}
              onClick={() => setNavOpen(!navOpen)}
              aria-expanded={navOpen}
            >
              Filters
            </Button>
            <Button type="secondary" tapScale={1} onClick={() => open()}>
              New callback
            </Button>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark(!dark)}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
          </div>
          <div className="cb-breadcrumb">
            Callbacks <Icon name="chevron-right" size="sm" />
            <span>{heading}</span>
          </div>
          <header className="cb-main-heading">
            <div>
              <h1 ref={headingRef} tabIndex={-1}>
                {view === "all" ? "Open callbacks" : heading}
              </h1>
              <p>
                {visible.length} {view === "resolved" ? "resolved" : "open"} ·{" "}
                {callbackMoney(visible.reduce((n, c) => n + c.cost, 0))}{" "}
                {view === "resolved" ? "recorded" : "open"} cost
                {visible.length > 0 &&
                  ` · oldest ${Math.max(...visible.map((c) => ageInDays(c.reported)))} days`}
              </p>
              <div className="cb-people">
                <AvatarGroup size="sm" max={5}>
                  {owners.map((p) => (
                    <Avatar name={p.name} size="sm" key={p.id} />
                  ))}
                </AvatarGroup>
                <span>
                  {owners.length}{" "}
                  {owners.length === 1 ? "technician" : "technicians"}
                  {mine ? " · Assigned to you" : ""}
                </span>
              </div>
            </div>
            <div className="cb-controls">
              <label className="cb-group-label">
                Group by branch
                <Switch
                  checked={grouped}
                  onCheckedChange={setGrouped}
                  aria-label="Group by branch"
                />
              </label>
              <div className="cb-layout" role="group" aria-label="Layout">
                <IconButton
                  type={layout === "board" ? "secondary" : "tertiary"}
                  tapScale={1}
                  aria-pressed={layout === "board"}
                  aria-label="Board layout"
                  icon={<Icon name="columns" />}
                  onClick={() => setLayout("board")}
                />
                <IconButton
                  type={layout === "list" ? "secondary" : "tertiary"}
                  tapScale={1}
                  aria-pressed={layout === "list"}
                  aria-label="List layout"
                  icon={<Icon name="list" />}
                  onClick={() => setLayout("list")}
                />
              </div>
            </div>
          </header>
          <div className="cb-filter-strip">
            <span>
              {branch === "all" ? "All branches" : branch}
              {query && ` · “${query}”`}
            </span>
            {(query || branch !== "all" || view !== "all" || mine) && (
              <button type="button" onClick={clear}>
                Clear filters
              </button>
            )}
            <label>
              Sort by{" "}
              <select
                aria-label="Sort callbacks"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Board order</option>
                <option value="age">Oldest first</option>
                <option value="priority">Priority</option>
                <option value="cost">Highest cost</option>
              </select>
            </label>
          </div>
          {notice && (
            <div className="cb-notice" role="status">
              <span>{notice}</span>
              {archived && (
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    setCallbacks((cs) => [...cs, archived]);
                    setArchived(null);
                    setNotice(
                      "Callback restored. Current filters still apply.",
                    );
                  }}
                >
                  Undo archive
                </Button>
              )}
              <IconButton
                type="tertiary"
                size="sm"
                tapScale={1}
                aria-label="Dismiss notice"
                icon={<Icon name="x" size="sm" />}
                onClick={() => setNotice("")}
              />
            </div>
          )}
          {!visible.length ? (
            <div className="cb-empty">
              <AgentWorkspaceState
                title={emptyQueue ? "All caught up" : "No callbacks found"}
                description={
                  emptyQueue
                    ? "No open callbacks. Create a callback to start a new service follow-up."
                    : "Try another search, or clear the filters to see your team’s work."
                }
                actionLabel={emptyQueue ? "New callback" : "Clear filters"}
                onAction={emptyQueue ? () => open() : clear}
              />
            </div>
          ) : (
            (grouped
              ? BRANCHES.filter((b) => visible.some((c) => c.branch === b))
              : ["all"]
            ).map((b) => (
              <section
                className="cb-board-group"
                key={b}
                aria-label={b === "all" ? "All branches" : b}
              >
                {b !== "all" && (
                  <h2>
                    {b}
                    <span>
                      {visible.filter((c) => c.branch === b).length} callbacks
                    </span>
                  </h2>
                )}
                {layout === "board" ? (
                  board(
                    visible.filter((c) => b === "all" || c.branch === b),
                    b,
                  )
                ) : (
                  <div className="cb-table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer / callback</th>
                          <th>Priority</th>
                          <th>Stage</th>
                          <th>Technician</th>
                          <th>Reported</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible
                          .filter((c) => b === "all" || c.branch === b)
                          .map((c) => (
                            <tr key={c.id}>
                              <td>
                                <button type="button" onClick={() => open(c)}>
                                  {c.customer}
                                  <small>
                                    {c.id} · {c.branch}
                                  </small>
                                </button>
                              </td>
                              <td>
                                <CallbackPriority priority={c.priority} />
                              </td>
                              <td>{CALLBACK_STAGES[c.stage]}</td>
                              <td>
                                {PEOPLE.find((p) => p.id === c.ownerId)?.name}
                              </td>
                              <td>{callbackDate(c.reported)}</td>
                              <td>{callbackMoney(c.cost)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))
          )}
          <footer className="cb-footer">
            <span>
              Sample snapshot · Oct 6, 2026 · Local edits reset on reload
            </span>
            <a
              href="https://x.com/nizamdesign/status/2110279441683235256"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Nizam ↗
            </a>
          </footer>
        </main>
        <Dialog.Root
          open={Boolean(draft)}
          onOpenChange={(o) => {
            if (!o) setDraft(null);
          }}
        >
          <Dialog.Portal>
            <Dialog.Backdrop className="cb-backdrop" />
            <Dialog.Popup
              className={`cb-dialog ${dark ? "theme-dark" : ""}`}
              initialFocus={titleRef}
              finalFocus={() =>
                returnTo.current?.isConnected
                  ? returnTo.current
                  : headingRef.current
              }
            >
              {draft && (
                <form onSubmit={save} noValidate>
                  <header>
                    <span>
                      {draft.id} · {draft.branch}
                    </span>
                    <Dialog.Close
                      render={
                        <IconButton
                          type="tertiary"
                          tapScale={1}
                          aria-label="Close callback"
                          icon={<Icon name="x" />}
                        />
                      }
                    />
                  </header>
                  <div className="cb-dialog-scroll">
                    <Dialog.Title>
                      {callbacks.some((c) => c.id === draft.id)
                        ? "Callback details"
                        : "New callback"}
                    </Dialog.Title>
                    <Dialog.Description>
                      Keep the issue, owner and next step in one place.
                    </Dialog.Description>
                    <label>
                      Customer
                      <input
                        ref={titleRef}
                        value={draft.customer}
                        maxLength={120}
                        onChange={(e) =>
                          setDraft({ ...draft, customer: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Issue summary
                      <input
                        value={draft.issue}
                        maxLength={180}
                        onChange={(e) =>
                          setDraft({ ...draft, issue: e.target.value })
                        }
                      />
                    </label>
                    <div className="cb-form-grid">
                      <label>
                        Stage
                        <select
                          value={draft.stage}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              stage: e.target.value as CallbackStage,
                            })
                          }
                        >
                          {Object.entries(CALLBACK_STAGES).map(([v, l]) => (
                            <option value={v} key={v}>
                              {l}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Priority
                        <select
                          value={draft.priority}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              priority: e.target.value as Callback["priority"],
                            })
                          }
                        >
                          {["Low", "Medium", "High", "Critical"].map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Technician
                        <select
                          value={draft.ownerId}
                          onChange={(e) =>
                            setDraft({ ...draft, ownerId: e.target.value })
                          }
                        >
                          {PEOPLE.map((p) => (
                            <option value={p.id} key={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Branch
                        <select
                          value={draft.branch}
                          onChange={(e) =>
                            setDraft({ ...draft, branch: e.target.value })
                          }
                        >
                          {BRANCHES.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Reported date
                        <input
                          type="date"
                          max={SAMPLE_TODAY}
                          value={draft.reported}
                          onChange={(e) =>
                            setDraft({ ...draft, reported: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Cost (USD)
                        <input
                          type="number"
                          min="0"
                          max="1000000"
                          step="0.01"
                          value={cost}
                          onChange={(e) => setCost(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="cb-checks">
                      <label>
                        <input
                          type="checkbox"
                          checked={draft.repeat}
                          onChange={(e) =>
                            setDraft({ ...draft, repeat: e.target.checked })
                          }
                        />
                        Repeat failure
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={draft.awaitingParts}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              awaitingParts: e.target.checked,
                            })
                          }
                        />
                        Awaiting parts
                      </label>
                    </div>
                    <label>
                      Service notes
                      <textarea
                        rows={4}
                        maxLength={2000}
                        value={draft.notes}
                        onChange={(e) =>
                          setDraft({ ...draft, notes: e.target.value })
                        }
                      />
                    </label>
                    {error && (
                      <p
                        ref={errorRef}
                        tabIndex={-1}
                        role="alert"
                        className="cb-form-error"
                      >
                        {error}
                      </p>
                    )}
                    <p className="cb-form-hint">
                      Demo record only. Changes do not contact customers or
                      schedule real visits.
                    </p>
                  </div>
                  <footer>
                    {callbacks.some((c) => c.id === draft.id) && (
                      <Button
                        type="tertiary"
                        danger
                        tapScale={1}
                        onClick={archive}
                      >
                        Archive
                      </Button>
                    )}
                    <Dialog.Close
                      render={
                        <Button type="secondary" tapScale={1}>
                          Cancel
                        </Button>
                      }
                    />
                    <Button render={<button type="submit" />} tapScale={1}>
                      Save callback
                    </Button>
                  </footer>
                </form>
              )}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

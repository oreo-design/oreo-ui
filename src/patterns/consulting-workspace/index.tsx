import { useRef, useState, type ChangeEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { WorkspaceMetric } from "@/components/command-search";
import { StepProgress } from "@/components/step-progress";
import { AgentWorkspaceState } from "@/components/automation";
import {
  EscalationCard,
  SourceConflictCard,
  KnowledgeSourceTable,
  ConversationActivity,
  resolveConflict,
  sourceStatus,
  sourceSummary,
  validateSourceFile,
  type Escalation,
  type EscalationStatus,
  type KnowledgeSource,
} from "@/components/consulting";
import { ADVISORS, CASES, SOURCES, CONFLICTS, DAYS } from "./data";
import "./workspace.css";
type Modal =
  | { kind: "case"; id: string }
  | { kind: "source"; id: string }
  | { kind: "advisor" }
  | null;
export function ConsultingWorkspacePage() {
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    returnTo = useRef<HTMLElement | null>(null),
    upload = useRef<HTMLInputElement>(null),
    counter = useRef(1);
  const [dark, setDark] = useState(false),
    [view, setView] = useState<"dashboard" | "knowledge">("dashboard"),
    [query, setQuery] = useState(""),
    [queue, setQueue] = useState<EscalationStatus>("needs-you"),
    [sort, setSort] = useState("impact"),
    [expanded, setExpanded] = useState<string | null>("e1"),
    [cases, setCases] = useState(CASES),
    [sources, setSources] = useState(SOURCES),
    [conflicts, setConflicts] = useState(CONFLICTS),
    [sourceFilter, setSourceFilter] = useState("all"),
    [advisors, setAdvisors] = useState(ADVISORS),
    [advisor, setAdvisor] = useState("growth"),
    [notice, setNotice] = useState(""),
    [errors, setErrors] = useState<string[]>([]),
    [archived, setArchived] = useState<KnowledgeSource | null>(null),
    [modal, setModal] = useState<Modal>(null),
    [response, setResponse] = useState(""),
    [formError, setFormError] = useState(""),
    [newAdvisor, setNewAdvisor] = useState({
      name: "",
      scope: "",
      methodology: "",
      rules: "",
    }),
    [editingAdvisor, setEditingAdvisor] = useState(false),
    [failure, setFailure] = useState(false);
  const chosen = advisors.find((a) => a.id === advisor) ?? advisors[0],
    stats = sourceSummary(sources, conflicts),
    activeCase =
      modal?.kind === "case" ? cases.find((c) => c.id === modal.id) : undefined,
    activeSource =
      modal?.kind === "source"
        ? sources.find((s) => s.id === modal.id)
        : undefined;
  const filteredCases = cases
    .filter(
      (c) =>
        c.status === queue &&
        `${c.client} ${c.person} ${c.advisor} ${c.question}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "impact" ? b.rank - a.rank : a.client.localeCompare(b.client),
    );
  const filteredSources = sources.filter(
    (s) =>
      (sourceFilter === "all" || sourceStatus(s, conflicts) === sourceFilter) &&
      `${s.title} ${s.usedFor}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function changeView(next: "dashboard" | "knowledge") {
    setView(next);
    setQuery("");
    setNotice("");
    setErrors([]);
  }
  function open(next: Modal) {
    returnTo.current = document.activeElement as HTMLElement;
    setFormError("");
    setModal(next);
  }
  function review(item: Escalation) {
    setResponse(item.response ?? item.draft);
    open({ kind: "case", id: item.id });
  }
  function setCaseStatus(id: string, status: EscalationStatus, text?: string) {
    setCases((items) =>
      items.map((c) =>
        c.id === id ? { ...c, status, ...(text ? { response: text } : {}) } : c,
      ),
    );
    setNotice(
      status === "resolved"
        ? "Response saved and case resolved locally. Nothing was sent to a client."
        : status === "waiting"
          ? "Case moved to Waiting on clients. Nothing was sent."
          : "Case reopened in Needs you.",
    );
    setModal(null);
  }
  function resolve(id: string, choice: string) {
    const next = resolveConflict(sources, conflicts, id, choice);
    setSources(next.sources);
    setConflicts(next.conflicts);
    setNotice(
      choice === "ask"
        ? "Human review is required whenever this conflicting guidance is used."
        : "Preferred source saved. Other versions are marked as duplicates.",
    );
  }
  function addFiles(files: File[]) {
    const issues: string[] = [];
    let existing = new Set(sources.map((s) => s.title.toLowerCase().trim()));
    const added: KnowledgeSource[] = [];
    for (const file of files) {
      const error = validateSourceFile(file);
      if (error) {
        issues.push(`${file.name}: ${error}`);
        continue;
      }
      const duplicate = existing.has(file.name.toLowerCase().trim());
      existing.add(file.name.toLowerCase().trim());
      added.push({
        id: `local-${counter.current++}`,
        title: file.name,
        format: file.name.split(".").pop()!.toUpperCase(),
        detail: `${Math.max(1, Math.round(file.size / 1024))} KB · local metadata`,
        usedFor: "Not assigned",
        findings: { frameworks: 0, recommendations: 0, examples: 0 },
        status: duplicate ? "duplicate" : "review",
        local: true,
      });
    }
    setSources((s) => [...added, ...s]);
    setErrors(issues);
    if (added.length) {
      setSourceFilter("all");
      setQuery("");
      setNotice(
        `${added.length} local file record${added.length === 1 ? "" : "s"} added. Contents were not uploaded or analyzed.`,
      );
    }
  }
  function fileChange(e: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(e.target.files ?? []));
    e.target.value = "";
  }
  function archive(source: KnowledgeSource) {
    if (sourceStatus(source, conflicts) === "conflict") return;
    setSources((items) => items.filter((s) => s.id !== source.id));
    setArchived(source);
    setNotice(`${source.title} archived locally.`);
  }
  function clearFilters() {
    setQuery("");
    setSourceFilter("all");
  }
  function advisorModal(edit: boolean) {
    setEditingAdvisor(edit);
    setNewAdvisor(
      edit
        ? {
            name: chosen.name,
            scope: chosen.scope,
            methodology: chosen.methodology,
            rules: chosen.rules,
          }
        : { name: "", scope: "", methodology: "", rules: "" },
    );
    open({ kind: "advisor" });
  }
  return (
    <div ref={root} className={`cs-workspace ${dark ? "theme-dark" : ""}`}>
      <aside className="cs-sidebar">
        <a className="cs-brand" href="/escalation-card">
          <span>
            o<span>•</span>
          </span>
          <strong>Oreo Advisory</strong>
        </a>
        <nav aria-label="Consulting workspace">
          <p>WORKSPACE</p>
          <button
            aria-current={view === "dashboard" ? "page" : undefined}
            onClick={() => changeView("dashboard")}
          >
            <Icon name="columns" />
            Dashboard
            <span>{cases.filter((c) => c.status === "needs-you").length}</span>
          </button>
          <p>BUILD</p>
          <button
            aria-current={view === "knowledge" ? "page" : undefined}
            onClick={() => changeView("knowledge")}
          >
            <Icon name="brain" />
            Advisor knowledge
          </button>
          <a href="/client-workspace">
            <Icon name="users" />
            Client template
            <Icon name="arrow-up-right" size="sm" />
          </a>
          <a href="/knowledge-base">
            <Icon name="book-open" />
            Knowledge template
            <Icon name="arrow-up-right" size="sm" />
          </a>
        </nav>
        <div className="cs-sidebar-note">
          <Icon name="sparkle" />
          <strong>Your expertise, within reach.</strong>
          <p>
            Keep client context together.
            <br />
            Stay close to the decisions that need you.
          </p>
        </div>
        <footer>
          <a href="/source-conflict-card">Component docs ↗</a>
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </footer>
      </aside>
      <main className="cs-main">
        <header className="cs-topbar">
          <label>
            <Icon name="search" />
            <input
              aria-label={
                view === "dashboard"
                  ? "Search clients and escalations"
                  : "Search knowledge sources"
              }
              placeholder={
                view === "dashboard"
                  ? "Search clients, advisors, conversations"
                  : "Search knowledge sources"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <Tag>Local demo</Tag>
          <Avatar name="Alex Morgan" size="sm" />
        </header>
        <div className="cs-content">
          <div className="cs-heading">
            <div>
              <p className="cs-breadcrumb">
                {view === "dashboard"
                  ? "Workspace / Overview"
                  : `Advisors / ${chosen.name}`}
              </p>
              <h1 ref={heading} tabIndex={-1}>
                {view === "dashboard" ? "Good afternoon, Alex" : "Knowledge"}
              </h1>
              <p>
                {view === "dashboard"
                  ? "Friday, Oct 2 · Your advisors answered 39 of 47 conversations in this sample week."
                  : "Give your advisor trusted sources and a clear way to handle uncertainty."}
              </p>
            </div>
            <div className="cs-heading-actions">
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                leadingIcon={<Icon name="plus" size="sm" />}
                onClick={() => advisorModal(false)}
              >
                Create advisor
              </Button>
              {view === "dashboard" ? (
                <Button
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    setQueue("needs-you");
                    setQuery("");
                    setExpanded(
                      cases.find((c) => c.status === "needs-you")?.id ?? null,
                    );
                    setNotice("Showing all cases that need your decision.");
                  }}
                >
                  Review escalations
                </Button>
              ) : (
                <Button
                  size="sm"
                  tapScale={1}
                  onClick={() => advisorModal(true)}
                >
                  Advisor settings
                </Button>
              )}
            </div>
          </div>
          {notice && (
            <div className="cs-notice" role="status">
              <Icon name="check" size="sm" />
              <span>{notice}</span>
              {archived && (
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={() => {
                    setSources((s) =>
                      s.some((x) => x.id === archived.id)
                        ? s
                        : [...s, archived],
                    );
                    setNotice(`${archived.title} restored.`);
                    setArchived(null);
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
          {view === "dashboard" ? (
            <>
              <div className="cs-metrics">
                <WorkspaceMetric
                  label="Active clients"
                  value="18"
                  detail="Sample client portfolio"
                />
                <WorkspaceMetric
                  label="Advisors"
                  value={String(advisors.length)}
                  detail="Local advisor profiles"
                />
                <WorkspaceMetric
                  label="Answered independently"
                  value="83%"
                  detail="39 of 47 in the sample week"
                />
                <WorkspaceMetric
                  label="Needs you"
                  value={String(
                    cases.filter((c) => c.status === "needs-you").length,
                  )}
                  detail={`${cases.filter((c) => c.status === "needs-you" && c.impact === "High impact").length} high impact`}
                />
              </div>
              <div className="cs-dashboard-grid">
                <section className="cs-queue" aria-label="Escalation queue">
                  <div className="cs-filterbar">
                    <div
                      className="cs-filter-group"
                      role="group"
                      aria-label="Escalation status"
                    >
                      {(
                        [
                          ["needs-you", "Needs you"],
                          ["waiting", "Waiting on clients"],
                          ["resolved", "Resolved locally"],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          aria-pressed={queue === id}
                          onClick={() => {
                            setQueue(id);
                            setExpanded(null);
                          }}
                        >
                          {label}
                          <span>
                            {cases.filter((c) => c.status === id).length}
                          </span>
                        </button>
                      ))}
                    </div>
                    <label className="cs-sort">
                      <Icon name="sort-descending" size="sm" />
                      <select
                        aria-label="Sort escalations"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="impact">By impact</option>
                        <option value="client">By client</option>
                      </select>
                    </label>
                  </div>
                  <div className="cs-queue-body">
                    {filteredCases.length ? (
                      filteredCases.map((item) => (
                        <EscalationCard
                          key={item.id}
                          item={item}
                          open={expanded === item.id}
                          onOpenChange={(open) =>
                            setExpanded(open ? item.id : null)
                          }
                          onReview={review}
                          onApprove={review}
                          onReopen={(item) =>
                            setCaseStatus(item.id, "needs-you")
                          }
                        />
                      ))
                    ) : (
                      <AgentWorkspaceState
                        title={
                          query ? "No matching cases" : "Nothing in this queue"
                        }
                        description={
                          query
                            ? "Try a client, advisor or topic from this sample workspace."
                            : "Choose another queue to review your local cases."
                        }
                        actionLabel={
                          query ? "Clear search" : "Show all open cases"
                        }
                        onAction={() => {
                          setQuery("");
                          setQueue("needs-you");
                        }}
                      />
                    )}
                  </div>
                </section>
                <aside className="cs-insights">
                  <ConversationActivity days={DAYS} />
                  <section className="cs-client-activity">
                    <header>
                      <h2>Client activity</h2>
                      <span>Sample week</span>
                    </header>
                    {CASES.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          review(cases.find((c) => c.id === item.id)!)
                        }
                      >
                        <Avatar name={item.person} size="sm" />
                        <span>
                          <strong>{item.client}</strong>
                          <span>{item.summary}</span>
                        </span>
                        <Icon name="arrow-up-right" size="sm" />
                      </button>
                    ))}
                  </section>
                </aside>
              </div>
            </>
          ) : (
            <>
              <section className="cs-advisor-bar">
                <label>
                  Advisor
                  <select
                    aria-label="Advisor profile"
                    value={advisor}
                    onChange={(e) => setAdvisor(e.target.value)}
                  >
                    {advisors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <strong>{chosen.scope}</strong>
                  <span>
                    Shared practice library · reusable across local advisor
                    profiles
                  </span>
                </div>
                <StepProgress
                  completed={stats.approved + stats.duplicate}
                  total={stats.total}
                  label="Sources reviewed"
                />
              </section>
              <div className="cs-knowledge-top">
                <div
                  className="cs-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    addFiles(Array.from(e.dataTransfer.files));
                  }}
                >
                  <Icon name="paperclip" size="lg" />
                  <strong>Drop files or browse</strong>
                  <p>PDF, DOCX, PPTX or XLSX, up to 50 MB each</p>
                  <input
                    ref={upload}
                    type="file"
                    accept=".pdf,.docx,.pptx,.xlsx"
                    multiple
                    aria-label="Add knowledge files"
                    onChange={fileChange}
                  />
                  <Button
                    type="secondary"
                    size="sm"
                    tapScale={1}
                    leadingIcon={<Icon name="plus" size="sm" />}
                    onClick={() => upload.current?.click()}
                  >
                    Add files
                  </Button>
                  <small>
                    Local metadata only · contents are not uploaded or analyzed
                  </small>
                </div>
                <section className="cs-findings">
                  <header>
                    <Icon name="sparkle" />
                    <h2>Approved knowledge</h2>
                    <span>Sample extraction</span>
                  </header>
                  <div>
                    <section>
                      <strong>{stats.frameworks}</strong>
                      <span>frameworks</span>
                    </section>
                    <section>
                      <strong>{stats.recommendations}</strong>
                      <span>recommendations</span>
                    </section>
                    <section>
                      <strong>{stats.examples}</strong>
                      <span>reference examples</span>
                    </section>
                    <section>
                      <strong>{stats.duplicate}</strong>
                      <span>duplicates excluded</span>
                    </section>
                  </div>
                </section>
              </div>
              {errors.length > 0 && (
                <div className="cs-error" role="alert">
                  <strong>Some files could not be added</strong>
                  {errors.map((e) => (
                    <p key={e}>{e}</p>
                  ))}
                  <Button
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    onClick={() => setErrors([])}
                  >
                    Dismiss file errors
                  </Button>
                </div>
              )}
              <div className="cs-sources">
                <div className="cs-filterbar">
                  <div
                    className="cs-filter-group"
                    role="group"
                    aria-label="Knowledge source status"
                  >
                    {(
                      [
                        "all",
                        "review",
                        "conflict",
                        "approved",
                        "duplicate",
                      ] as const
                    ).map((id) => (
                      <button
                        key={id}
                        aria-pressed={sourceFilter === id}
                        onClick={() => setSourceFilter(id)}
                      >
                        {
                          {
                            all: "All sources",
                            review: "Needs review",
                            conflict: "Conflicts",
                            approved: "Approved",
                            duplicate: "Duplicates",
                          }[id]
                        }
                        <span>{id === "all" ? stats.total : stats[id]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {conflicts
                  .filter(
                    (c) =>
                      !c.resolution &&
                      (sourceFilter === "all" || sourceFilter === "conflict") &&
                      (!query ||
                        c.options.some((o) =>
                          o.title.toLowerCase().includes(query.toLowerCase()),
                        )),
                  )
                  .map((c) => (
                    <div className="cs-conflict-wrap" key={c.id}>
                      <SourceConflictCard
                        conflict={c}
                        onResolve={(choice) => resolve(c.id, choice)}
                      />
                    </div>
                  ))}
                <KnowledgeSourceTable
                  sources={filteredSources}
                  conflicts={conflicts}
                  onReview={(s) => open({ kind: "source", id: s.id })}
                  onRemove={archive}
                  onClear={clearFilters}
                  error={
                    failure
                      ? "The local source preview is unavailable. Try again to restore it."
                      : undefined
                  }
                  onRetry={() => setFailure(false)}
                />
              </div>
              <details className="cs-demo-controls">
                <summary>Demo controls</summary>
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  onClick={() => setFailure(true)}
                >
                  Simulate source error
                </Button>
              </details>
            </>
          )}
          <footer className="cs-page-footer">
            <span>
              Local sample workspace · Changes reset on reload · No client
              messages are sent
            </span>
            <a
              href="https://x.com/nizamdesign/status/2110792824627360225"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Nizam ↗
            </a>
          </footer>
        </div>
      </main>
      <Dialog.Root
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="cs-backdrop" />
          <Dialog.Popup
            className="cs-dialog"
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            <header>
              <div>
                <Dialog.Title>
                  {activeCase
                    ? `${activeCase.client} · Review`
                    : activeSource
                      ? "Review knowledge source"
                      : editingAdvisor
                        ? "Advisor settings"
                        : "Create an advisor"}
                </Dialog.Title>
                <Dialog.Description>
                  {activeCase
                    ? "Review and save a local response. No message will be sent."
                    : activeSource
                      ? "Review this source record before it joins the approved library."
                      : "Define a local advisor profile and its decision boundaries."}
                </Dialog.Description>
              </div>
              <IconButton
                type="tertiary"
                size="sm"
                tapScale={1}
                aria-label="Close dialog"
                icon={<Icon name="x" />}
                onClick={() => setModal(null)}
              />
            </header>
            <div className="cs-dialog-body">
              {activeCase ? (
                <>
                  <div className="cs-dialog-client">
                    <Avatar name={activeCase.person} />
                    <div>
                      <strong>{activeCase.person}</strong>
                      <p>
                        {activeCase.role} · {activeCase.client}
                      </p>
                    </div>
                    <Tag>
                      {activeCase.status === "resolved"
                        ? "Resolved locally"
                        : activeCase.impact}
                    </Tag>
                  </div>
                  <h3>{activeCase.question}</h3>
                  <p>{activeCase.reason}</p>
                  <dl className="co-facts">
                    {activeCase.facts.map((f) => (
                      <div key={f.label}>
                        <dt>{f.label}</dt>
                        <dd>{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <label>
                    Response draft
                    <textarea
                      aria-label="Response draft"
                      value={response}
                      readOnly={activeCase.status === "resolved"}
                      rows={7}
                      onChange={(e) => {
                        setResponse(e.target.value);
                        setFormError("");
                      }}
                    />
                  </label>
                  <small>
                    This is a sample advisor draft. Review the wording before
                    saving your local decision.
                  </small>
                </>
              ) : activeSource ? (
                <>
                  <div className="cs-source-detail">
                    <Icon name="paperclip" size="lg" />
                    <h3>{activeSource.title}</h3>
                    <Tag>{sourceStatus(activeSource, conflicts)}</Tag>
                  </div>
                  <dl className="co-facts">
                    <div>
                      <dt>Format</dt>
                      <dd>{activeSource.format}</dd>
                    </div>
                    <div>
                      <dt>Details</dt>
                      <dd>{activeSource.detail}</dd>
                    </div>
                    <div>
                      <dt>Used for</dt>
                      <dd>{activeSource.usedFor}</dd>
                    </div>
                  </dl>
                  <p>
                    {activeSource.local
                      ? "Only the file name and size are held in memory. This demo does not read, upload or analyze file contents. Approving marks this record as reviewed."
                      : "This bundled fixture contains illustrative extraction counts, not a live analysis of an uploaded file."}
                  </p>
                  {conflicts
                    .filter((c) =>
                      c.options.some((o) => o.sourceId === activeSource.id),
                    )
                    .map((c) => (
                      <SourceConflictCard
                        key={c.id}
                        conflict={c}
                        onResolve={(choice) => resolve(c.id, choice)}
                      />
                    ))}
                  <label>
                    Use this source for
                    <input
                      aria-label="Source purpose"
                      value={activeSource.usedFor}
                      maxLength={120}
                      onChange={(e) =>
                        setSources((s) =>
                          s.map((x) =>
                            x.id === activeSource.id
                              ? { ...x, usedFor: e.target.value }
                              : x,
                          ),
                        )
                      }
                    />
                  </label>
                </>
              ) : (
                <form
                  id="advisor-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newAdvisor.name.trim() || !newAdvisor.scope.trim()) {
                      setFormError(
                        "Add an advisor name and an area of expertise.",
                      );
                      return;
                    }
                    if (editingAdvisor) {
                      setAdvisors((a) =>
                        a.map((x) =>
                          x.id === advisor
                            ? {
                                ...x,
                                ...newAdvisor,
                                name: newAdvisor.name.trim(),
                                scope: newAdvisor.scope.trim(),
                              }
                            : x,
                        ),
                      );
                    } else {
                      const id = `advisor-${counter.current++}`;
                      setAdvisors((a) => [
                        ...a,
                        {
                          id,
                          ...newAdvisor,
                          name: newAdvisor.name.trim(),
                          scope: newAdvisor.scope.trim(),
                        },
                      ]);
                      setAdvisor(id);
                    }
                    setNotice(
                      editingAdvisor
                        ? "Advisor settings saved locally."
                        : "Advisor created locally. Add knowledge to support its work.",
                    );
                    setView("knowledge");
                    setQuery("");
                    setModal(null);
                  }}
                >
                  <label>
                    Advisor name
                    <input
                      autoComplete="off"
                      value={newAdvisor.name}
                      maxLength={80}
                      onChange={(e) =>
                        setNewAdvisor({ ...newAdvisor, name: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Area of expertise
                    <input
                      value={newAdvisor.scope}
                      maxLength={160}
                      onChange={(e) =>
                        setNewAdvisor({ ...newAdvisor, scope: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Methodology
                    <textarea
                      value={newAdvisor.methodology}
                      rows={3}
                      maxLength={1000}
                      onChange={(e) =>
                        setNewAdvisor({
                          ...newAdvisor,
                          methodology: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Escalation rules
                    <textarea
                      value={newAdvisor.rules}
                      rows={3}
                      maxLength={1000}
                      onChange={(e) =>
                        setNewAdvisor({ ...newAdvisor, rules: e.target.value })
                      }
                    />
                  </label>
                  <small>
                    Profiles share this practice's sample source library.
                    Settings do not invoke an AI model.
                  </small>
                </form>
              )}
              {formError && (
                <p className="cs-form-error" role="alert">
                  {formError}
                </p>
              )}
            </div>
            <footer>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={() => setModal(null)}
              >
                Close
              </Button>
              {activeCase ? (
                activeCase.status !== "resolved" && (
                  <>
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      onClick={() => setCaseStatus(activeCase.id, "waiting")}
                    >
                      Wait on client
                    </Button>
                    <Button
                      size="sm"
                      tapScale={1}
                      onClick={() => {
                        if (!response.trim()) {
                          setFormError(
                            "Write a response before resolving this case.",
                          );
                          return;
                        }
                        setCaseStatus(
                          activeCase.id,
                          "resolved",
                          response.trim(),
                        );
                      }}
                    >
                      Save response & resolve
                    </Button>
                  </>
                )
              ) : activeSource ? (
                <Button
                  size="sm"
                  tapScale={1}
                  disabled={
                    sourceStatus(activeSource, conflicts) === "conflict" ||
                    activeSource.status === "approved" ||
                    activeSource.status === "duplicate"
                  }
                  title={
                    sourceStatus(activeSource, conflicts) === "conflict"
                      ? "Choose a conflict policy first."
                      : undefined
                  }
                  onClick={() => {
                    if (!activeSource.usedFor.trim()) {
                      setFormError("Describe what this source is used for.");
                      return;
                    }
                    setSources((s) =>
                      s.map((x) =>
                        x.id === activeSource.id
                          ? { ...x, status: "approved" }
                          : x,
                      ),
                    );
                    setNotice(`${activeSource.title} approved locally.`);
                    setModal(null);
                  }}
                >
                  Approve source
                </Button>
              ) : (
                <Button
                  size="sm"
                  tapScale={1}
                  render={<button type="submit" />}
                  form="advisor-form"
                >
                  {editingAdvisor ? "Save settings" : "Create advisor"}
                </Button>
              )}
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

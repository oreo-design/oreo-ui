import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import {
  ClientSummary,
  ClientContactStrip,
  ClientFinanceSummary,
  clientFinance,
} from "@/components/client";
import {
  InvoiceTable,
  invoiceStatus,
  INVOICE_STATUSES,
  INVOICE_STATUS_LABEL,
  type Invoice,
  type InvoiceAction,
  type InvoiceSort,
} from "@/components/invoice";
import {
  CLIENT,
  CLIENT_DATE,
  CLIENT_INVOICES,
  PROJECTS,
  CONTACTS,
} from "./data";
import "./client-workspace.css";

const sections = [
  "Financial",
  "Projects",
  "Documents",
  "Contacts",
  "Activity",
  "Notes",
] as const;
type Section = (typeof sections)[number];
const sectionIcons: Record<Section, IconName> = {
  Financial: "chart-bar",
  Projects: "folder",
  Documents: "paperclip",
  Contacts: "users",
  Activity: "clock-history",
  Notes: "pencil",
};
export function ClientWorkspacePage() {
  const [dark, setDark] = useThemeMode(true),
    [section, setSection] = useState<Section>("Financial");
  const [invoices, setInvoices] = useState<Invoice[]>(CLIENT_INVOICES),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<InvoiceSort>({
    key: "id",
    direction: "desc",
  });
  const [draft, setDraft] = useState<Invoice | null>(null),
    [mode, setMode] = useState<"create" | "edit" | "delete">("edit"),
    [amount, setAmount] = useState(""),
    [error, setError] = useState("");
  const [deleted, setDeleted] = useState<Invoice | null>(null),
    [notice, setNotice] = useState("");
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "Keep the design and engineering teams aligned before the next milestone review.",
      author: "John Smith",
    },
  ]);
  const [note, setNote] = useState(""),
    [noteError, setNoteError] = useState("");
  const [events, setEvents] = useState([
    "Client workspace opened · 16 January 2026",
    "Platform development payment recorded · $28,500",
    "Design system milestone 2 invoice issued · $45,000",
  ]);
  const counter = useRef(4),
    noteCounter = useRef(2),
    returnTo = useRef<HTMLElement | null>(null),
    createRef = useRef<HTMLButtonElement>(null),
    descriptionRef = useRef<HTMLInputElement>(null),
    errorRef = useRef<HTMLParagraphElement>(null);
  const financial = clientFinance(invoices, CLIENT_DATE);
  const filtered = invoices.filter(
    (i) =>
      (filter === "all" || invoiceStatus(i, CLIENT_DATE) === filter) &&
      `${i.id} ${i.client} ${i.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function record(message: string) {
    setNotice(message);
    setEvents((items) => [message, ...items]);
  }
  function open(
    invoice: Invoice,
    action: InvoiceAction,
    trigger: HTMLElement | null,
  ) {
    returnTo.current = trigger;
    setError("");
    if (action === "paid") {
      setInvoices((items) =>
        items.map((i) => (i.id === invoice.id ? { ...i, status: "paid" } : i)),
      );
      record(`${invoice.id} marked as paid.`);
      requestAnimationFrame(() =>
        (trigger?.isConnected ? trigger : createRef.current)?.focus(),
      );
      return;
    }
    if (action === "duplicate") {
      setMode("create");
      setDraft({ ...invoice, id: "New draft", status: "draft" });
      setAmount((invoice.amountCents / 100).toFixed(2));
      return;
    }
    setMode(action === "delete" ? "delete" : "edit");
    setDraft({ ...invoice });
    setAmount((invoice.amountCents / 100).toFixed(2));
  }
  function create() {
    returnTo.current = createRef.current;
    setMode("create");
    setError("");
    setAmount("");
    setDraft({
      id: "New invoice",
      client: CONTACTS[0].name,
      description: "",
      dueDate: "2026-01-30",
      status: "draft",
      amountCents: 0,
    });
  }
  function reject(message: string) {
    setError(message);
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ block: "nearest" });
      errorRef.current?.focus();
    });
  }
  function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    if (mode === "delete") {
      setDeleted(draft);
      setInvoices((items) => items.filter((i) => i.id !== draft.id));
      record(`${draft.id} deleted.`);
      setDraft(null);
      return;
    }
    if (!draft.description.trim() || !draft.client.trim()) {
      reject("Add a description and a contact before saving.");
      return;
    }
    const cents = Math.round(Number(amount) * 100);
    if (
      !/^\d{1,7}(\.\d{1,2})?$/.test(amount) ||
      !Number.isSafeInteger(cents) ||
      cents <= 0
    ) {
      reject("Enter a positive USD amount with up to two decimal places.");
      return;
    }
    const date = new Date(draft.dueDate + "T12:00:00Z");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== draft.dueDate
    ) {
      reject("Choose a valid due date.");
      return;
    }
    const saved = {
      ...draft,
      id:
        mode === "create"
          ? `INV-2026-${String(counter.current++).padStart(3, "0")}`
          : draft.id,
      description: draft.description.trim(),
      client: draft.client.trim(),
      amountCents: cents,
    };
    setInvoices((items) =>
      mode === "create"
        ? [saved, ...items]
        : items.map((i) => (i.id === saved.id ? saved : i)),
    );
    record(`${saved.id} ${mode === "create" ? "created" : "updated"}.`);
    setDraft(null);
  }
  function select(next: Section) {
    setSection(next);
    setNotice("");
  }
  function tabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === "ArrowRight") next = (index + 1) % sections.length;
    if (event.key === "ArrowLeft")
      next = (index + sections.length - 1) % sections.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = sections.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    select(sections[next]);
    document.getElementById(`client-tab-${next}`)?.focus();
  }
  function download(name: string, body: string) {
    const url = URL.createObjectURL(
      new Blob([body], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    record(`${name} downloaded.`);
  }
  function addNote(event: FormEvent) {
    event.preventDefault();
    if (!note.trim()) {
      setNoteError("Write a note before adding it.");
      return;
    }
    setNotes((items) => [
      { id: noteCounter.current++, text: note.trim(), author: CLIENT.owner },
      ...items,
    ]);
    setNote("");
    setNoteError("");
    record("Client note added.");
  }
  return (
    <div className={`cw-shell ${dark ? "theme-dark" : ""}`}>
      <a href="#client-main" className="cw-skip">
        Skip to client details
      </a>
      <aside className="cw-rail" aria-label="Library">
        <a href="/" aria-label="Oreo UI library" className="cw-brand">
          o.
        </a>
        <a href="/client-summary" aria-label="Client components">
          <Icon name="users" />
        </a>
        <a href="/invoice-workspace" aria-label="Invoice Workspace">
          <Icon name="list" />
        </a>
        <a href="/project-workspace" aria-label="Project Workspace">
          <Icon name="folder" />
        </a>
        <span />
        <IconButton
          type="tertiary"
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          icon={<Icon name={dark ? "sun" : "moon"} />}
          onClick={() => setDark(!dark)}
          tapScale={1}
        />
      </aside>
      <aside className="cw-sidebar" aria-label="Client workspace navigation">
        <div className="cw-sidebar-brand">
          <strong>Oreo CRM</strong>
          <Tag>Demo</Tag>
        </div>
        <div className="cw-account">
          <Avatar name="John Smith" agent="nova" size="sm" />
          <div>
            John Smith<small>Workspace admin</small>
          </div>
        </div>
        <p className="cw-nav-label">WORKSPACE</p>
        <nav>
          <a href="/invoice-workspace">
            <Icon name="chart-line" size="sm" />
            Invoices
          </a>
          <a href="/project-workspace">
            <Icon name="folder" size="sm" />
            Projects
          </a>
          <a href="#client-main" aria-current="page">
            <Icon name="users" size="sm" />
            Clients<span>1</span>
          </a>
        </nav>
        <p className="cw-nav-label">ACME CORPORATION</p>
        <nav>
          {sections.map((item) => (
            <button
              key={item}
              onClick={() => select(item)}
              aria-pressed={section === item}
            >
              <Icon name={sectionIcons[item]} size="sm" />
              {item}
              {item === "Notes" && <span>{notes.length}</span>}
            </button>
          ))}
        </nav>
        <div className="cw-sidebar-bottom">
          <span className="cw-online" /> All changes stay in this demo
          <small>Sample snapshot · Jan 16, 2026</small>
          <a href="/changelog">
            What's new <Icon name="arrow-up-right" size="sm" />
          </a>
        </div>
      </aside>
      <main id="client-main" className="cw-main" tabIndex={-1}>
        <header className="cw-topbar">
          <div>
            <a href="/client-summary">Clients</a>
            <Icon name="chevron-right" size="sm" />
            <span>Client details</span>
          </div>
          <a href="/client-summary">
            Components <Icon name="arrow-up-right" size="sm" />
          </a>
        </header>
        <div className="cw-content">
          <div className="cw-page-label">
            <span>CLIENT OVERVIEW</span>
            <span>CLIENT #ACM-001</span>
          </div>
          <ClientSummary
            client={CLIENT}
            projectCount={PROJECTS.length}
            activeProjects={
              PROJECTS.filter((p) => p.status === "Active").length
            }
            revenueCents={financial.paid}
          />
          <section className="cw-contact">
            <h2>Contact information</h2>
            <ClientContactStrip client={CLIENT} />
          </section>
          <div className="cw-activity-heading">
            <h2>Company activity</h2>
            <span>Everything in one place</span>
          </div>
          <div className="cw-tabs" role="tablist" aria-label="Company activity">
            {sections.map((item, index) => (
              <button
                key={item}
                id={`client-tab-${index}`}
                role="tab"
                aria-selected={section === item}
                aria-controls="client-panel"
                tabIndex={section === item ? 0 : -1}
                onKeyDown={(event) => tabKey(event, index)}
                onClick={() => select(item)}
              >
                <Icon name={sectionIcons[item]} size="sm" />
                {item}
              </button>
            ))}
          </div>
          <div className="cw-notice" role="status">
            {notice}
            {deleted && (
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  setInvoices((items) => [deleted, ...items]);
                  record(`${deleted.id} restored.`);
                  setDeleted(null);
                }}
              >
                Undo deletion
              </Button>
            )}
          </div>
          <section
            id="client-panel"
            role="tabpanel"
            aria-labelledby={`client-tab-${sections.indexOf(section)}`}
            tabIndex={0}
          >
            {section === "Financial" && (
              <>
                <ClientFinanceSummary invoices={invoices} asOf={CLIENT_DATE} />
                <section className="cw-invoices">
                  <div className="cw-section-header">
                    <div>
                      <h2>
                        Invoices <span>{invoices.length}</span>
                      </h2>
                      <p>Track payments and keep the next milestone moving.</p>
                    </div>
                    <Button
                      size="sm"
                      render={<button ref={createRef} />}
                      leadingIcon={<Icon name="plus" size="sm" />}
                      onClick={create}
                    >
                      New invoice
                    </Button>
                  </div>
                  <div className="cw-filters">
                    <label className="cw-search">
                      <Icon name="search" size="sm" />
                      <input
                        type="search"
                        aria-label="Search invoices"
                        placeholder="Search invoices…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                    <label>
                      Status
                      <select
                        aria-label="Invoice status"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All statuses</option>
                        {INVOICE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {INVOICE_STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <span>
                      {filtered.length} of {invoices.length} invoices · USD
                    </span>
                  </div>
                  {invoices.length === 0 ? (
                    <AgentWorkspaceState
                      title="No invoices yet"
                      description="Create the first invoice for this client."
                      actionLabel="New invoice"
                      onAction={create}
                    />
                  ) : (
                    <InvoiceTable
                      invoices={filtered}
                      asOf={CLIENT_DATE}
                      currency="USD"
                      clientLabel="Contact"
                      sort={sort}
                      onSortChange={setSort}
                      onAction={open}
                      onClearFilters={() => {
                        setQuery("");
                        setFilter("all");
                      }}
                    />
                  )}
                </section>
              </>
            )}
            {section === "Projects" && (
              <div className="cw-projects">
                {PROJECTS.map((project) => (
                  <article key={project.name}>
                    <div>
                      <Icon name="folder" />
                      <Tag
                        color={project.status === "Active" ? "mint" : "default"}
                      >
                        {project.status}
                      </Tag>
                    </div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <progress
                      max={100}
                      value={project.progress}
                      aria-label={`${project.name} completion`}
                    />
                    <footer>
                      <span>{project.owner}</span>
                      <span>{project.progress}%</span>
                    </footer>
                  </article>
                ))}
              </div>
            )}
            {section === "Contacts" && (
              <div className="cw-contacts">
                {CONTACTS.map((person) => (
                  <article key={person.name}>
                    <Avatar name={person.name} agent="nova" size="md" />
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                    <span>{person.email}</span>
                    <small>
                      {invoices.filter((i) => i.client === person.name).length}{" "}
                      invoices assigned
                    </small>
                  </article>
                ))}
              </div>
            )}
            {section === "Documents" && (
              <div className="cw-documents">
                {[
                  {
                    name: "Client brief",
                    file: "acme-client-brief.txt",
                    body: `Acme Corporation — Client brief\n\nTechnology / Software development\nAccount owner: John Smith\n\nScope: Platform development, design system and mobile experience.\nNext milestone: Design system review on January 30, 2026.\n\nLocal sample document; not a signed agreement.`,
                  },
                  {
                    name: "Project register",
                    file: "acme-projects.txt",
                    body: PROJECTS.map(
                      (p) =>
                        `${p.name} — ${p.status} (${p.progress}%)\nOwner: ${p.owner}\n${p.description}`,
                    ).join("\n\n"),
                  },
                ].map((doc) => (
                  <article key={doc.file}>
                    <Icon name="paperclip" />
                    <div>
                      <h3>{doc.name}</h3>
                      <p>Sample document · Plain text</p>
                    </div>
                    <Button
                      type="secondary"
                      size="sm"
                      onClick={() => download(doc.file, doc.body)}
                      aria-label={`Download ${doc.name}`}
                    >
                      Download
                    </Button>
                  </article>
                ))}
              </div>
            )}
            {section === "Activity" && (
              <ol className="cw-events">
                {events.map((event, index) => (
                  <li key={`${index}-${event}`}>
                    <span className="cw-event-dot" />
                    <div>
                      <p>{event}</p>
                      <small>
                        {index === 0 ? "Latest activity" : "Workspace history"}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {section === "Notes" && (
              <div className="cw-notes">
                <form onSubmit={addNote}>
                  <label htmlFor="client-note">Add a client note</label>
                  <textarea
                    id="client-note"
                    placeholder="What should the team know?"
                    value={note}
                    maxLength={2000}
                    onChange={(e) => {
                      setNote(e.target.value);
                      setNoteError("");
                    }}
                    aria-invalid={Boolean(noteError)}
                    aria-describedby={
                      noteError ? "client-note-error" : undefined
                    }
                  />
                  {noteError && (
                    <p id="client-note-error" role="alert">
                      {noteError}
                    </p>
                  )}
                  <Button size="sm" render={<button type="submit" />}>
                    Add note
                  </Button>
                </form>
                {notes.length ? (
                  notes.map((item) => (
                    <article key={item.id}>
                      <p>{item.text}</p>
                      <footer>
                        <Avatar name={item.author} agent="nova" size="xs" />
                        <span>{item.author}</span>
                      </footer>
                    </article>
                  ))
                ) : (
                  <AgentWorkspaceState
                    title="No client notes"
                    description="Add a note to keep your team up to date."
                  />
                )}
              </div>
            )}
          </section>
          <footer className="cw-footer">
            <span>Local demo · Changes reset on reload</span>
            <a
              href="https://x.com/Tanjim38/status/2110407786957795338"
              target="_blank"
              rel="noreferrer"
            >
              Inspired by Tanjim <Icon name="arrow-up-right" size="sm" />
            </a>
          </footer>
        </div>
      </main>
      <Dialog.Root
        open={draft !== null}
        onOpenChange={(value) => {
          if (!value) setDraft(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="cw-backdrop" />
          <Dialog.Popup
            className={`cw-dialog ${dark ? "theme-dark" : ""}`}
            initialFocus={mode === "delete" ? undefined : descriptionRef}
            finalFocus={() =>
              returnTo.current?.isConnected
                ? returnTo.current
                : createRef.current
            }
          >
            {draft && (
              <form onSubmit={save} noValidate>
                <header>
                  <Dialog.Title>
                    {mode === "delete"
                      ? "Delete invoice?"
                      : mode === "create"
                        ? "New invoice"
                        : "Invoice details"}
                  </Dialog.Title>
                  <Dialog.Close
                    render={
                      <IconButton
                        type="tertiary"
                        aria-label="Close invoice"
                        icon={<Icon name="x" />}
                        tapScale={1}
                      />
                    }
                  />
                </header>
                <div className="cw-dialog-body">
                  <Dialog.Description>
                    {mode === "delete"
                      ? `${draft.id} will be removed from this client. You can undo the last deletion.`
                      : "Update this client's invoice. All amounts are in USD."}
                  </Dialog.Description>
                  {mode !== "delete" && (
                    <>
                      <label>
                        Description
                        <input
                          ref={descriptionRef}
                          maxLength={160}
                          value={draft.description}
                          onChange={(e) =>
                            setDraft({ ...draft, description: e.target.value })
                          }
                        />
                      </label>
                      <label>
                        Contact
                        <select
                          value={draft.client}
                          onChange={(e) =>
                            setDraft({ ...draft, client: e.target.value })
                          }
                        >
                          {CONTACTS.map((c) => (
                            <option key={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </label>
                      <div className="cw-field-pair">
                        <label>
                          Amount (USD)
                          <input
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </label>
                        <label>
                          Due date
                          <input
                            type="date"
                            value={draft.dueDate}
                            onChange={(e) =>
                              setDraft({ ...draft, dueDate: e.target.value })
                            }
                          />
                        </label>
                      </div>
                      <label>
                        Payment status
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              status: e.target.value as Invoice["status"],
                            })
                          }
                        >
                          {["draft", "pending", "paid", "cancelled"].map(
                            (s) => (
                              <option key={s} value={s}>
                                {INVOICE_STATUS_LABEL[s as Invoice["status"]]}
                              </option>
                            ),
                          )}
                        </select>
                      </label>
                      <label>
                        Invoice notes
                        <textarea
                          maxLength={2000}
                          value={draft.notes ?? ""}
                          onChange={(e) =>
                            setDraft({ ...draft, notes: e.target.value })
                          }
                        />
                      </label>
                    </>
                  )}
                  {error && (
                    <p
                      role="alert"
                      ref={errorRef}
                      tabIndex={-1}
                      className="cw-error"
                    >
                      {error}
                    </p>
                  )}
                </div>
                <footer>
                  <Dialog.Close
                    render={<Button type="secondary" tapScale={1} />}
                  >
                    Cancel
                  </Dialog.Close>
                  <Button
                    render={<button type="submit" />}
                    danger={mode === "delete"}
                    tapScale={1}
                  >
                    {mode === "delete" ? "Delete invoice" : "Save invoice"}
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

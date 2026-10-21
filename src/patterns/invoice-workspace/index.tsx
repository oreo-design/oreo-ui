import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import {
  InvoiceTable,
  InvoiceStatusBadge,
  InvoiceTotals,
  INVOICE_STATUSES,
  INVOICE_STATUS_LABEL,
  invoiceStatus,
  invoiceMoney,
  invoiceDate,
  sortInvoices,
  type Invoice,
  type InvoiceAction,
  type InvoiceSort,
  type InvoiceStatus,
} from "@/components/invoice";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuCheckboxItem,
  MenuItem,
  MenuSeparator,
} from "@/components/menu";
import { AgentWorkspaceState } from "@/components/automation";
import { OreoLogo } from "@/docs/OreoLogo";
import { INITIAL_INVOICES, INVOICE_TODAY } from "./data";
import "./invoice-workspace.css";

type View = "list" | "board" | "simple" | "overview";
const views: { id: View; label: string; icon: IconName }[] = [
  { id: "list", label: "List", icon: "list" },
  { id: "board", label: "Board", icon: "columns" },
  { id: "simple", label: "Simple", icon: "align-left" },
  { id: "overview", label: "Overview", icon: "chart-bar" },
];
const scopes: {
  label: string;
  status: InvoiceStatus | null;
  icon: IconName;
}[] = [
  { label: "All invoices", status: null, icon: "list" },
  { label: "Overdue", status: "overdue", icon: "clock-history" },
  { label: "Paid", status: "paid", icon: "checks" },
  { label: "Drafts", status: "draft", icon: "pencil" },
];
export function InvoiceWorkspace() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES),
    [view, setView] = useState<View>("list"),
    [dark, setDark] = useThemeMode(false),
    [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState(""),
    [filters, setFilters] = useState<InvoiceStatus[]>([]),
    [sort, setSort] = useState<InvoiceSort>({
      key: "status",
      direction: "asc",
    });
  const [draft, setDraft] = useState<Invoice | null>(null),
    [mode, setMode] = useState<"create" | "edit" | "delete">("edit"),
    [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [deleted, setDeleted] = useState<Invoice | null>(null);
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);
  const idCounter = useRef(95),
    createButton = useRef<HTMLButtonElement>(null),
    search = useRef<HTMLInputElement>(null),
    opener = useRef<HTMLElement | null>(null);
  const visible = sortInvoices(
    invoices.filter(
      (i) =>
        (!filters.length ||
          filters.includes(invoiceStatus(i, INVOICE_TODAY))) &&
        `${i.id} ${i.client} ${i.description}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    ),
    sort,
    INVOICE_TODAY,
  );
  const nextId = () => `INV-${String(idCounter.current++).padStart(4, "0")}`;
  function clearFilters() {
    setFilters([]);
    setQuery("");
    search.current?.focus();
  }
  function announce(message: string) {
    setNotice(message);
  }
  function action(
    invoice: Invoice,
    action: InvoiceAction,
    trigger: HTMLElement | null,
  ) {
    opener.current = trigger;
    setError("");
    if (action === "paid") {
      setInvoices((items) =>
        items.map((i) => (i.id === invoice.id ? { ...i, status: "paid" } : i)),
      );
      announce(`${invoice.id} marked as paid in this demo.`);
      requestAnimationFrame(() =>
        (trigger?.isConnected ? trigger : createButton.current)?.focus(),
      );
      return;
    }
    if (action === "duplicate") {
      const copy = { ...invoice, id: nextId(), status: "draft" as const };
      setInvoices((items) => [...items, copy]);
      setDraft(copy);
      setAmount((copy.amountCents / 100).toFixed(2));
      setMode("edit");
      setOpen(true);
      announce(`${invoice.id} duplicated as ${copy.id}.`);
      return;
    }
    setDraft({ ...invoice });
    setAmount((invoice.amountCents / 100).toFixed(2));
    setMode(action === "delete" ? "delete" : "edit");
    setOpen(true);
  }
  function create() {
    opener.current = createButton.current;
    setError("");
    setMode("create");
    setDraft({
      id: "New invoice",
      client: "",
      description: "",
      dueDate: "2026-10-30",
      amountCents: 0,
      status: "draft",
      avatar: "nova",
      notes: "",
    });
    setAmount("");
    setOpen(true);
  }
  function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const cents = Math.round(Number(amount) * 100);
    if (!draft.client.trim() || !draft.description.trim()) {
      setError("Add a client and a description before saving.");
      return;
    }
    if (
      !/^\d{1,7}(\.\d{1,2})?$/.test(amount) ||
      !Number.isSafeInteger(cents) ||
      cents <= 0
    ) {
      setError(
        "Enter an amount from €0.01 to €9,999,999.99, with at most two decimal places.",
      );
      return;
    }
    const date = new Date(`${draft.dueDate}T12:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(draft.dueDate) ||
      !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== draft.dueDate
    ) {
      setError("Choose a valid due date.");
      return;
    }
    const result = {
      ...draft,
      id: mode === "create" ? nextId() : draft.id,
      client: draft.client.trim(),
      description: draft.description.trim(),
      amountCents: cents,
    };
    setInvoices((items) =>
      mode === "create"
        ? [...items, result]
        : items.map((i) => (i.id === result.id ? result : i)),
    );
    setOpen(false);
    announce(`${result.id} ${mode === "create" ? "created" : "updated"}.`);
  }
  function remove() {
    if (!draft) return;
    setDeleted(draft);
    setInvoices((items) => items.filter((i) => i.id !== draft.id));
    setOpen(false);
    announce(`${draft.id} deleted. You can undo this action.`);
  }
  function undo() {
    if (!deleted) return;
    setInvoices((items) => [...items, deleted]);
    announce(`${deleted.id} restored.`);
    setDeleted(null);
  }
  function exportCsv() {
    const cell = (value: string) =>
      `"${(/^[=+@\-\t\r]/.test(value) ? "'" : "") + value.replaceAll('"', '""')}"`;
    const rows = [
      [
        "Invoice ID",
        "Client",
        "Description",
        "Due date",
        "Status",
        "Amount EUR",
      ],
      ...visible.map((i) => [
        i.id,
        i.client,
        i.description,
        i.dueDate,
        INVOICE_STATUS_LABEL[invoiceStatus(i, INVOICE_TODAY)],
        (i.amountCents / 100).toFixed(2),
      ]),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.map((row) => row.map(cell).join(",")).join("\r\n")], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-invoices.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(`${visible.length} invoices exported.`);
  }
  return (
    <div className={dark ? "theme-dark" : ""}>
      <div
        ref={setPortalHost}
        className="invoice-workspace"
        data-expanded={expanded || undefined}
      >
        <aside
          className="invoice-rail"
          aria-label="Invoice workspace navigation"
        >
          <a className="invoice-logo" href="/" aria-label="Oreo UI components">
            <Avatar agent="nova" name="Oreo workspace" size="sm" />
            {expanded && <strong>Oreo Studio</strong>}
          </a>
          <nav>
            {scopes.map((scope) => (
              <button
                type="button"
                key={scope.label}
                aria-label={scope.label}
                aria-pressed={
                  scope.status === null
                    ? !filters.length
                    : filters.length === 1 && filters[0] === scope.status
                }
                onClick={() => {
                  setFilters(scope.status ? [scope.status] : []);
                  setQuery("");
                }}
              >
                <Icon name={scope.icon} />
                {expanded && (
                  <>
                    <span>{scope.label}</span>
                    <small>
                      {scope.status
                        ? invoices.filter(
                            (i) =>
                              invoiceStatus(i, INVOICE_TODAY) === scope.status,
                          ).length
                        : invoices.length}
                    </small>
                  </>
                )}
              </button>
            ))}
          </nav>
          <div className="invoice-rail-bottom">
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() => setDark(!dark)}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
            <a
              href="/invoice-table"
              aria-label="Invoice component documentation"
            >
              <Icon name="book-open" />
            </a>
          </div>
        </aside>
        <main className="invoice-surface">
          <header className="invoice-header">
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={
                expanded ? "Collapse navigation" : "Expand navigation"
              }
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              icon={<Icon name="columns" size="sm" />}
            />
            <span className="invoice-header-divider" />
            <Icon name="scan-text" size="sm" />
            <h1>Invoices</h1>
            <span className="invoice-demo-label">Demo</span>
            <div className="invoice-header-actions">
              <IconButton
                className="invoice-mobile-theme"
                type="tertiary"
                tapScale={1}
                aria-label={
                  dark ? "Switch to light theme" : "Switch to dark theme"
                }
                onClick={() => setDark(!dark)}
                icon={<Icon name={dark ? "sun" : "moon"} />}
              />
              <Button
                render={<button ref={createButton} />}
                tapScale={1}
                leadingIcon={<Icon name="plus" size="sm" />}
                onClick={create}
              >
                Create invoice
              </Button>
            </div>
          </header>
          <div className="invoice-toolbar">
            <nav aria-label="Invoice views">
              {views.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={view === item.id}
                  onClick={() => setView(item.id)}
                >
                  <Icon name={item.icon} size="sm" />
                  {item.label}
                </button>
              ))}
            </nav>
            <label className="invoice-search">
              <Icon name="search" size="sm" />
              <input
                ref={search}
                type="search"
                aria-label="Search invoices"
                value={query}
                maxLength={100}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search invoice…"
              />
              {query && (
                <IconButton
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    search.current?.focus();
                  }}
                  icon={<Icon name="x" size="sm" />}
                />
              )}
            </label>
            <Menu>
              <MenuTrigger
                render={
                  <Button
                    type="secondary"
                    tapScale={1}
                    leadingIcon={<Icon name="filter" size="sm" />}
                  />
                }
              >
                Filter{filters.length ? ` (${filters.length})` : ""}
              </MenuTrigger>
              <MenuPopup container={portalHost} align="end">
                {INVOICE_STATUSES.map((status) => (
                  <MenuCheckboxItem
                    key={status}
                    checked={filters.includes(status)}
                    onCheckedChange={(checked) =>
                      setFilters((items) =>
                        checked
                          ? [...items, status]
                          : items.filter((s) => s !== status),
                      )
                    }
                  >
                    <span className="invoice-filter-label">
                      {INVOICE_STATUS_LABEL[status]}
                      <span>
                        {
                          invoices.filter(
                            (i) => invoiceStatus(i, INVOICE_TODAY) === status,
                          ).length
                        }
                      </span>
                    </span>
                  </MenuCheckboxItem>
                ))}
                <MenuSeparator />
                <MenuItem onClick={() => setFilters([])}>
                  Clear status filters
                </MenuItem>
              </MenuPopup>
            </Menu>
          </div>
          {(notice || filters.length > 0 || query) && (
            <div className="invoice-feedback">
              <p role="status">
                {notice || `${visible.length} matching invoices`}
              </p>
              {deleted && (
                <Button type="tertiary" size="sm" tapScale={1} onClick={undo}>
                  Undo delete
                </Button>
              )}
              {(filters.length > 0 || query) && (
                <Button
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
          <div className="invoice-view-content">
            {view === "list" || view === "simple" ? (
              <InvoiceTable
                invoices={visible}
                asOf={INVOICE_TODAY}
                sort={sort}
                onSortChange={setSort}
                onAction={action}
                compact={view === "simple"}
                onClearFilters={clearFilters}
              />
            ) : view === "board" ? (
              <div
                className="invoice-board"
                role="region"
                aria-label="Invoices by status"
                tabIndex={0}
              >
                {INVOICE_STATUSES.map((status) => {
                  const cards = visible.filter(
                    (i) => invoiceStatus(i, INVOICE_TODAY) === status,
                  );
                  return (
                    <section
                      key={status}
                      aria-label={`${INVOICE_STATUS_LABEL[status]} invoices`}
                    >
                      <header>
                        <InvoiceStatusBadge status={status} />
                        <span>{cards.length}</span>
                      </header>
                      {cards.length ? (
                        cards.map((invoice) => (
                          <button
                            type="button"
                            className="invoice-board-card"
                            key={invoice.id}
                            onClick={(e) =>
                              action(invoice, "open", e.currentTarget)
                            }
                          >
                            <span className="invoice-board-id">
                              #{invoice.id}
                            </span>
                            <h2>{invoice.description}</h2>
                            <span className="invoice-client">
                              <Avatar
                                agent={invoice.avatar}
                                name={invoice.client}
                                size="xs"
                              />
                              {invoice.client}
                            </span>
                            <span className="invoice-board-bottom">
                              <span>{invoiceDate(invoice.dueDate)}</span>
                              <strong>
                                {invoiceMoney(invoice.amountCents)}
                              </strong>
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="invoice-board-empty">
                          No {INVOICE_STATUS_LABEL[status].toLowerCase()}{" "}
                          invoices
                          {filters.length || query
                            ? " match these filters"
                            : ""}
                          .
                        </p>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="invoice-overview">
                <div className="invoice-overview-heading">
                  <div>
                    <p>THE BIG PICTURE</p>
                    <h2>Every invoice, accounted for.</h2>
                  </div>
                  <span>As of {invoiceDate(INVOICE_TODAY)}</span>
                </div>
                <InvoiceTotals invoices={visible} asOf={INVOICE_TODAY} />
                <section
                  className="invoice-status-summary"
                  aria-labelledby="invoice-status-title"
                >
                  <h3 id="invoice-status-title">By payment status</h3>
                  {INVOICE_STATUSES.map((status) => {
                    const items = visible.filter(
                      (i) => invoiceStatus(i, INVOICE_TODAY) === status,
                    );
                    return (
                      <button
                        type="button"
                        key={status}
                        onClick={() => {
                          setFilters([status]);
                          setView("list");
                        }}
                      >
                        <InvoiceStatusBadge status={status} />
                        <span>{items.length} invoices</span>
                        <strong>
                          {invoiceMoney(
                            items.reduce((sum, i) => sum + i.amountCents, 0),
                          )}
                        </strong>
                        <Icon name="chevron-right" size="sm" />
                      </button>
                    );
                  })}
                </section>
                {!visible.length && (
                  <AgentWorkspaceState
                    title="No invoices in this view"
                    description="Clear your search and filters to see the workspace totals."
                    actionLabel="Clear filters"
                    onAction={clearFilters}
                  />
                )}
              </div>
            )}
          </div>
          <footer className="invoice-footer">
            <span>
              {visible.length} of {invoices.length} invoices
            </span>
            <span>
              Shown total{" "}
              <strong>
                {invoiceMoney(
                  visible.reduce((sum, i) => sum + i.amountCents, 0),
                )}
              </strong>
            </span>
            <button
              type="button"
              onClick={exportCsv}
              disabled={!visible.length}
            >
              Export CSV <Icon name="arrow-up-right" size="sm" />
            </button>
          </footer>
        </main>
        <p className="invoice-local-note">
          Local sample workspace · As of Oct 15, 2026 · Changes reset on reload
          · No invoices or payments are sent
        </p>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Portal>
            <div className={dark ? "theme-dark" : ""}>
              <Dialog.Backdrop className="invoice-dialog-backdrop" />
              <Dialog.Popup
                className={`invoice-dialog ${mode === "delete" ? "invoice-delete-dialog" : ""}`}
                finalFocus={() =>
                  opener.current?.isConnected
                    ? opener.current
                    : createButton.current
                }
              >
                <header>
                  <span>
                    <Icon name="scan-text" size="sm" />
                    {draft?.id}
                  </span>
                  <Dialog.Close
                    render={
                      <IconButton
                        type="tertiary"
                        tapScale={1}
                        aria-label="Close invoice"
                        icon={<Icon name="x" />}
                      />
                    }
                  />
                </header>
                {mode === "delete" ? (
                  <div className="invoice-delete-content">
                    <Dialog.Title>Delete {draft?.id}?</Dialog.Title>
                    <Dialog.Description>
                      This removes the invoice from this local workspace. You
                      can restore it with Undo delete.
                    </Dialog.Description>
                    <div>
                      <Dialog.Close
                        render={<Button type="secondary" tapScale={1} />}
                      >
                        Keep invoice
                      </Dialog.Close>
                      <Button danger tapScale={1} onClick={remove}>
                        Delete invoice
                      </Button>
                    </div>
                  </div>
                ) : (
                  draft && (
                    <form onSubmit={save} noValidate>
                      <div className="invoice-detail-intro">
                        <Avatar
                          agent={draft.avatar}
                          name={draft.client || "New client"}
                          size="lg"
                        />
                        <div>
                          <Dialog.Title>
                            {mode === "create"
                              ? "Create invoice"
                              : draft.client}
                          </Dialog.Title>
                          <Dialog.Description>
                            Billed by Oreo Studio · Local demo
                          </Dialog.Description>
                        </div>
                      </div>
                      <div className="invoice-detail-amount">
                        <strong>
                          {invoiceMoney(
                            Number.isFinite(Number(amount))
                              ? Math.round(Number(amount) * 100)
                              : 0,
                          )}
                        </strong>
                        <InvoiceStatusBadge
                          status={invoiceStatus(draft, INVOICE_TODAY)}
                        />
                      </div>
                      <div className="invoice-form-grid">
                        <label>
                          Client
                          <input
                            required
                            maxLength={80}
                            value={draft.client}
                            onChange={(e) =>
                              setDraft({ ...draft, client: e.target.value })
                            }
                            placeholder="Client name"
                          />
                        </label>
                        <label>
                          Amount (EUR)
                          <input
                            required
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            aria-invalid={error.includes("amount") || undefined}
                          />
                        </label>
                        <label>
                          Due date
                          <input
                            type="date"
                            required
                            value={draft.dueDate}
                            onChange={(e) =>
                              setDraft({ ...draft, dueDate: e.target.value })
                            }
                          />
                        </label>
                        <label>
                          Status
                          <select
                            value={draft.status}
                            onChange={(e) =>
                              setDraft({
                                ...draft,
                                status: e.target.value as Invoice["status"],
                              })
                            }
                          >
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </label>
                      </div>
                      <label className="invoice-form-wide">
                        Description
                        <input
                          required
                          maxLength={120}
                          value={draft.description}
                          onChange={(e) =>
                            setDraft({ ...draft, description: e.target.value })
                          }
                          placeholder="What is this invoice for?"
                        />
                      </label>
                      <label className="invoice-form-wide">
                        Notes
                        <textarea
                          maxLength={1000}
                          rows={3}
                          value={draft.notes ?? ""}
                          onChange={(e) =>
                            setDraft({ ...draft, notes: e.target.value })
                          }
                          placeholder="Add a note for your team…"
                        />
                      </label>
                      <p className="invoice-form-hint">
                        Pending invoices due before Oct 15 appear as Overdue.
                        Changes apply when you save.
                      </p>
                      {error && (
                        <p className="invoice-form-error" role="alert">
                          {error}
                        </p>
                      )}
                      <footer>
                        <Dialog.Close
                          render={<Button type="secondary" tapScale={1} />}
                        >
                          Cancel
                        </Dialog.Close>
                        <Button tapScale={1} render={<button type="submit" />}>
                          {mode === "create"
                            ? "Create invoice"
                            : "Save changes"}
                        </Button>
                      </footer>
                    </form>
                  )
                )}
              </Dialog.Popup>
            </div>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}

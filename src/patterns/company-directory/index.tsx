import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import {
  CompanyIdentity,
  CompanyTable,
  COMPANY_STAGES,
  companyRows,
  companyCSV,
  parseCompany,
  type Company,
  type CompanyView,
  type CompanySort,
} from "@/components/company";
import { COMPANIES, COMPANY_OWNERS } from "./data";
import "./workspace.css";
const emptyDraft = () => ({
  name: "",
  domain: "",
  stage: "New",
  arr: "0",
  employees: "0",
  owner: COMPANY_OWNERS[0] as string,
  lastContact: "2026-10-16",
  notes: "",
});
export function CompanyDirectoryPage() {
  const errorRef = useRef<HTMLParagraphElement>(null);
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    returnTo = useRef<HTMLElement | null>(null);
  const [rows, setRows] = useState(COMPANIES),
    [dark, setDark] = useThemeMode(false),
    [nav, setNav] = useState(false),
    [view, setView] = useState<CompanyView>("all"),
    [query, setQuery] = useState(""),
    [stage, setStage] = useState("all"),
    [owner, setOwner] = useState("all"),
    [sort, setSort] = useState<CompanySort>({
      key: "lastContact",
      direction: "desc",
    }),
    [mode, setMode] = useState("ready"),
    [editId, setEditId] = useState<string | null>(null),
    [opened, setOpened] = useState(false),
    [draft, setDraft] = useState(emptyDraft),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [undo, setUndo] = useState<{ id: string; previous?: Company } | null>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);
  const filtered = companyRows(rows, {
    view,
    query,
    stage,
    owner,
    currentUser: COMPANY_OWNERS[0],
    sort,
  });
  const counts = {
    all: rows.length,
    mine: rows.filter((c) => c.owner === COMPANY_OWNERS[0]).length,
    hot: rows.filter((c) => c.hot).length,
    favorites: rows.filter((c) => c.favorite).length,
  };
  function reset() {
    setView("all");
    setQuery("");
    setStage("all");
    setOwner("all");
    setMode("ready");
    heading.current?.focus();
  }
  function changeView(next: CompanyView) {
    setView(next);
    if (nav) {
      setNav(false);
      heading.current?.focus();
    }
  }
  function open(c?: Company) {
    returnTo.current = document.activeElement as HTMLElement;
    setEditId(c?.id ?? null);
    setDraft(
      c
        ? {
            name: c.name,
            domain: c.domain,
            stage: c.stage,
            arr: (c.arrCents / 100).toFixed(2),
            employees: String(c.employees),
            owner: c.owner,
            lastContact: c.lastContact,
            notes: c.notes,
          }
        : emptyDraft(),
    );
    setError("");
    setOpened(true);
  }
  function save(event: FormEvent) {
    event.preventDefault();
    try {
      const parsed = parseCompany(draft, COMPANY_OWNERS);
      if (rows.some((c) => c.id !== editId && c.domain === parsed.domain))
        throw new Error("A company with this domain already exists.");
      const previous = rows.find((c) => c.id === editId);
      const updated: Company = {
        id: editId ?? crypto.randomUUID(),
        hot: false,
        favorite: false,
        ...previous,
        ...parsed,
      };
      setRows((old) =>
        previous
          ? old.map((c) => (c.id === updated.id ? updated : c))
          : [updated, ...old],
      );
      setUndo({ id: updated.id, previous });
      setOpened(false);
      setNotice(
        `${updated.name} ${previous ? "updated" : "added"}. Changes are local to this session.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save company.");
    }
  }
  function favorite(c: Company) {
    setRows((old) =>
      old.map((r) => (r.id === c.id ? { ...r, favorite: !r.favorite } : r)),
    );
    setNotice(
      `${c.name} ${c.favorite ? "removed from" : "added to"} favorites.`,
    );
    if (view === "favorites" && c.favorite) heading.current?.focus();
  }
  function exportCSV() {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + companyCSV(filtered)], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-companies.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      `Exported ${filtered.length} matching ${filtered.length === 1 ? "company" : "companies"}.`,
    );
  }
  const field = (name: keyof typeof draft, value: string) =>
    setDraft((old) => ({ ...old, [name]: value }));
  return (
    <div
      ref={root}
      className={`cdir-page${dark ? " theme-dark" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && nav) {
          setNav(false);
          heading.current?.focus();
        }
      }}
    >
      <aside
        className="cdir-sidebar"
        id="company-navigation"
        data-open={nav || undefined}
      >
        <a className="cdir-brand" href="/sales-workspace">
          <Icon name="columns" />
          Oreo <span>CRM</span>
        </a>
        <nav aria-label="CRM">
          <button
            aria-current="page"
            onClick={() => {
              reset();
              setNav(false);
              heading.current?.focus();
            }}
          >
            <Icon name="columns" size="sm" />
            Companies <small>{rows.length}</small>
          </button>
          <a href="/sales-workspace">
            <Icon name="chart-line" size="sm" />
            Sales overview
          </a>
          <a href="/client-workspace">
            <Icon name="users" size="sm" />
            Client workspace
          </a>
        </nav>
        <p className="cdir-nav-label">FAVORITES</p>
        <nav aria-label="Favorite companies">
          {rows
            .filter((c) => c.favorite)
            .map((c) => (
              <button key={c.id} onClick={() => open(c)}>
                <CompanyIdentity name={c.name} />
              </button>
            ))}
          {!rows.some((c) => c.favorite) && (
            <p className="cdir-nav-hint">Star a company to keep it here.</p>
          )}
        </nav>
        <p className="cdir-nav-label">VIEWS</p>
        <nav aria-label="Company views">
          {(["mine", "hot", "favorites"] as const).map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              onClick={() => changeView(v)}
            >
              <Icon
                name={v === "mine" ? "users" : v === "hot" ? "sparkle" : "star"}
                size="sm"
              />
              {v === "mine"
                ? "My companies"
                : v === "hot"
                  ? "Hot accounts"
                  : "Favorites"}
              <small>{counts[v]}</small>
            </button>
          ))}
        </nav>
        <div className="cdir-sidebar-bottom">
          <a href="/company-table">Component library ↗</a>
          <a href="/changelog">What’s new ↗</a>
          <div>
            <Avatar name={COMPANY_OWNERS[0]} size="sm" />
            <span>
              {COMPANY_OWNERS[0]}
              <small>Sample workspace</small>
            </span>
          </div>
        </div>
      </aside>
      <div className="cdir-main">
        <header className="cdir-header">
          <IconButton
            className="cdir-menu"
            icon={<Icon name="list" />}
            aria-label="Toggle navigation"
            aria-expanded={nav}
            aria-controls="company-navigation"
            type="tertiary"
            tapScale={1}
            onClick={() => setNav(!nav)}
          />
          <Icon name="columns" size="sm" />
          <h1 ref={heading} tabIndex={-1}>
            Companies
          </h1>
          <span className="cdir-header-actions">
            <IconButton
              icon={<Icon name={dark ? "sun" : "moon"} />}
              aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
              type="tertiary"
              tapScale={1}
              onClick={() => setDark(!dark)}
            />
            <Button
              size="sm"
              tapScale={1}
              leadingIcon={<Icon name="plus" size="sm" />}
              onClick={() => open()}
            >
              Add company
            </Button>
          </span>
        </header>
        <main>
          <div className="cdir-views" role="group" aria-label="Directory view">
            {(["all", "mine", "hot", "favorites"] as const).map((v) => (
              <button
                key={v}
                aria-pressed={view === v}
                onClick={() => changeView(v)}
              >
                {v === "all"
                  ? "All companies"
                  : v === "mine"
                    ? "My companies"
                    : v === "hot"
                      ? "Hot"
                      : "Favorites"}{" "}
                <span>{counts[v]}</span>
              </button>
            ))}
          </div>
          <div className="cdir-filters">
            <label className="cdir-search">
              <Icon name="search" size="sm" />
              <input
                type="search"
                aria-label="Search companies"
                placeholder="Search companies, domains or owners…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <select
              aria-label="Filter stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option value="all">All stages</option>
              {COMPANY_STAGES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              aria-label="Filter owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            >
              <option value="all">All owners</option>
              {COMPANY_OWNERS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              disabled={mode !== "ready" || !filtered.length}
              leadingIcon={<Icon name="arrow-down" size="sm" />}
              onClick={exportCSV}
            >
              Export CSV
            </Button>
            {(view !== "all" ||
              query ||
              stage !== "all" ||
              owner !== "all") && (
              <Button type="tertiary" size="sm" tapScale={1} onClick={reset}>
                Clear filters
              </Button>
            )}
          </div>
          <CompanyTable
            companies={mode === "ready" ? filtered : []}
            sort={sort}
            onSort={setSort}
            onOpen={open}
            onFavorite={favorite}
            onReset={reset}
            loading={mode === "loading"}
            error={
              mode === "error"
                ? "Could not load companies. Your local edits are preserved."
                : undefined
            }
          />
          <div className="cdir-notice" role="status">
            {notice}
            {undo && (
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  setRows((old) =>
                    undo.previous
                      ? old.map((c) =>
                          c.id === undo.id
                            ? {
                                ...undo.previous!,
                                favorite: c.favorite,
                                hot: c.hot,
                              }
                            : c,
                        )
                      : old.filter((c) => c.id !== undo.id),
                  );
                  setUndo(null);
                  setNotice("Last company save undone.");
                  heading.current?.focus();
                }}
              >
                Undo save
              </Button>
            )}
          </div>
          <footer className="cdir-footer">
            <span>Sample companies · Changes reset on reload</span>
            <a
              href="https://x.com/eliakuratli/status/2110823532917862573"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Elia ↗
            </a>
            <details>
              <summary>Demo states</summary>
              <div>
                {["ready", "loading", "empty", "error"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    type="tertiary"
                    tapScale={1}
                    onClick={() => setMode(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </details>
          </footer>
        </main>
      </div>
      <Dialog.Root open={opened} onOpenChange={setOpened}>
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="cdir-backdrop" />
          <Dialog.Popup
            className="cdir-dialog"
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            <header>
              <div>
                <Dialog.Title>
                  {editId ? "Company details" : "Add company"}
                </Dialog.Title>
                <Dialog.Description>
                  {editId
                    ? "Update this account and its next conversation."
                    : "Create a company in this local sample workspace."}
                </Dialog.Description>
              </div>
              <Dialog.Close
                render={
                  <IconButton
                    icon={<Icon name="x" />}
                    type="tertiary"
                    tapScale={1}
                    aria-label="Close company details"
                  />
                }
              />
            </header>
            <form onSubmit={save} noValidate>
              <div className="cdir-form-scroll">
                {editId && (
                  <CompanyIdentity
                    name={draft.name || "Company"}
                    domain={draft.domain}
                  />
                )}
                <label>
                  Company name
                  <input
                    autoComplete="organization"
                    value={draft.name}
                    maxLength={80}
                    onChange={(e) => field("name", e.target.value)}
                  />
                </label>
                <label>
                  Domain
                  <input
                    placeholder="northstar.example"
                    value={draft.domain}
                    maxLength={253}
                    onChange={(e) => field("domain", e.target.value)}
                  />
                </label>
                <div className="cdir-form-pair">
                  <label>
                    Stage
                    <select
                      value={draft.stage}
                      onChange={(e) => field("stage", e.target.value)}
                    >
                      {COMPANY_STAGES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Owner
                    <select
                      value={draft.owner}
                      onChange={(e) => field("owner", e.target.value)}
                    >
                      {COMPANY_OWNERS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="cdir-form-pair">
                  <label>
                    ARR (USD)
                    <input
                      inputMode="decimal"
                      value={draft.arr}
                      onChange={(e) => field("arr", e.target.value)}
                    />
                  </label>
                  <label>
                    Employees
                    <input
                      inputMode="numeric"
                      value={draft.employees}
                      onChange={(e) => field("employees", e.target.value)}
                    />
                  </label>
                </div>
                <label>
                  Last contact
                  <input
                    type="date"
                    value={draft.lastContact}
                    onChange={(e) => field("lastContact", e.target.value)}
                  />
                </label>
                <label>
                  Account notes
                  <textarea
                    rows={5}
                    maxLength={2000}
                    value={draft.notes}
                    onChange={(e) => field("notes", e.target.value)}
                  />
                  <small>{draft.notes.length}/2,000</small>
                </label>
                {error && (
                  <p
                    ref={errorRef}
                    tabIndex={-1}
                    className="cdir-error"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
              </div>
              <footer>
                <Button
                  type="secondary"
                  tapScale={1}
                  onClick={() => setOpened(false)}
                >
                  Cancel
                </Button>
                <Button tapScale={1} render={<button type="submit" />}>
                  Save company
                </Button>
              </footer>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

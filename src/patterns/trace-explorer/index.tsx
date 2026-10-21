import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { CodeBlock } from "@/components/code-block";
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuCheckboxItem,
} from "@/components/menu";
import {
  QueryFilterBar,
  TraceTable,
  TRACE_FIELDS,
  TRACE_COLUMNS,
  TRACE_COLUMN_LABELS,
  DEFAULT_TRACE_COLUMNS,
  selectTraces,
  queryDocument,
  formatDuration,
  formatTraceTime,
  type QueryCondition,
  type TraceColumn,
  type TraceSort,
  type TraceRecord,
} from "@/components/trace-query";
import { SAMPLE_TRACES, SNAPSHOT } from "./data";
import "./workspace.css";
type Query = {
  conditions: QueryCondition[];
  search: string;
  days: string;
  sort: TraceSort;
};
const initial: Query = {
  conditions: [],
  search: "",
  days: "30",
  sort: "newest",
};
type Saved = Query & { id: string; name: string };
export function TraceExplorerPage() {
  const root = useRef<HTMLDivElement>(null),
    returnTo = useRef<HTMLElement | null>(null),
    heading = useRef<HTMLHeadingElement>(null);
  const [dark, setDark] = useThemeMode(true),
    [query, setQuery] = useState<Query>(initial),
    [columns, setColumns] = useState<TraceColumn[]>(DEFAULT_TRACE_COLUMNS),
    [page, setPage] = useState(0),
    [saved, setSaved] = useState<Saved[]>([]),
    [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"save" | "query" | "trace" | null>(null),
    [selected, setSelected] = useState<TraceRecord | null>(null),
    [name, setName] = useState(""),
    [error, setError] = useState("");
  const from =
    query.days === "all" ? null : SNAPSHOT - Number(query.days) * 86400000;
  const rows = selectTraces(
      SAMPLE_TRACES,
      query.conditions,
      from,
      query.search,
      query.sort,
    ),
    pages = Math.max(1, Math.ceil(rows.length / 12)),
    current = Math.min(page, pages - 1);
  const document = queryDocument(
    query.conditions,
    from,
    query.search,
    query.sort,
  );
  const update = (next: Partial<Query>) => {
    setQuery((q) => ({ ...q, ...next }));
    setPage(0);
    setNotice("");
  };
  const reset = () => {
    setQuery(initial);
    setPage(0);
    setNotice("");
  };
  const open = (next: typeof modal) => {
    returnTo.current =
      window.document.activeElement instanceof HTMLElement
        ? window.document.activeElement
        : null;
    setModal(next);
    setError("");
    setName("");
  };
  const same = (q: Query) =>
    JSON.stringify({
      ...q,
      conditions: q.conditions.map(({ field, operator, value }) => ({
        field,
        operator,
        value,
      })),
    }) ===
    JSON.stringify({
      ...query,
      conditions: query.conditions.map(({ field, operator, value }) => ({
        field,
        operator,
        value,
      })),
    });
  const presets: {
    label: string;
    icon: "scan-text" | "warning-circle" | "clock-history";
    query: Query;
  }[] = [
    { label: "All traces", icon: "scan-text", query: initial },
    {
      label: "Errors",
      icon: "warning-circle",
      query: {
        ...initial,
        conditions: [
          {
            id: "preset-error",
            field: "status",
            operator: "eq",
            value: "error",
          },
        ],
      },
    },
    {
      label: "Slow runs",
      icon: "clock-history",
      query: {
        ...initial,
        conditions: [
          {
            id: "preset-slow",
            field: "durationMs",
            operator: "gte",
            value: "5000",
          },
        ],
        sort: "duration",
      },
    },
  ];
  const exportResults = () => {
    try {
      const blob = new Blob(
        [
          JSON.stringify(
            {
              query: document,
              snapshot: new Date(SNAPSHOT).toISOString(),
              count: rows.length,
              traces: rows,
            },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      );
      const url = URL.createObjectURL(blob),
        a = window.document.createElement("a");
      a.href = url;
      a.download = "oreo-traces.json";
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice(`${rows.length} filtered traces exported.`);
    } catch {
      setNotice("Export failed. Please try again.");
    }
  };
  return (
    <div ref={root} className={`te-workspace ${dark ? "theme-dark" : ""}`}>
      <aside className="te-sidebar">
        <a className="te-brand" href="/query-filter-bar">
          <Icon name="circle-dashed" size="lg" />
          <strong>
            oreo<span> / observability</span>
          </strong>
        </a>
        <div className="te-project">
          <span className="te-project-mark">D</span>
          <div>
            <strong>Documentation</strong>
            <span>Sample project</span>
          </div>
        </div>
        <nav aria-label="Trace views">
          <p>OBSERVABILITY</p>
          {presets.map((p) => (
            <button
              key={p.label}
              aria-current={same(p.query) ? "page" : undefined}
              onClick={() => {
                setQuery(p.query);
                setPage(0);
                setNotice("");
              }}
            >
              <Icon name={p.icon} size="sm" />
              {p.label}
              {p.label === "Errors" && (
                <span className="te-nav-count">
                  {SAMPLE_TRACES.filter((t) => t.status === "error").length}
                </span>
              )}
            </button>
          ))}
          <div className="te-saved-heading">
            <p>SAVED QUERIES</p>
            <IconButton
              type="tertiary"
              size="sm"
              tapScale={1}
              aria-label="Save current query"
              icon={<Icon name="plus" size="sm" />}
              onClick={() => open("save")}
            />
          </div>
          {saved.length ? (
            saved.map((s) => (
              <div className="te-saved" key={s.id}>
                <button
                  aria-current={
                    same({
                      conditions: s.conditions,
                      search: s.search,
                      days: s.days,
                      sort: s.sort,
                    })
                      ? "page"
                      : undefined
                  }
                  onClick={() => {
                    setQuery({
                      conditions: s.conditions,
                      search: s.search,
                      days: s.days,
                      sort: s.sort,
                    });
                    setPage(0);
                    setNotice(`Loaded ${s.name}.`);
                  }}
                >
                  <Icon name="star" size="sm" />
                  <span>{s.name}</span>
                </button>
                <IconButton
                  type="tertiary"
                  size="sm"
                  tapScale={1}
                  aria-label={`Delete query ${s.name}`}
                  icon={<Icon name="x" size="sm" />}
                  onClick={() => {
                    setSaved((all) => all.filter((x) => x.id !== s.id));
                    setNotice(
                      `Deleted saved query ${s.name}. The current filters are unchanged.`,
                    );
                  }}
                />
              </div>
            ))
          ) : (
            <p className="te-saved-empty">
              Keep a useful filter close.
              <br />
              Save your first query.
            </p>
          )}
        </nav>
        <div className="te-sidebar-footer">
          <a href="/trace-table">Component docs ↗</a>
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            aria-label={dark ? "Use light theme" : "Use dark theme"}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            onClick={() => setDark(!dark)}
          />
        </div>
      </aside>
      <main className="te-main">
        <header className="te-topbar">
          <div>
            <Icon name="globe" size="sm" />
            <span>Oreo Studio</span>
            <span>/</span>
            <span>Documentation</span>
            <span>/</span>
            <strong>Traces</strong>
          </div>
          <Tag>Local demo</Tag>
        </header>
        <section className="te-content">
          <div className="te-title">
            <div>
              <p>OBSERVABILITY</p>
              <h1 ref={heading} tabIndex={-1}>
                Traces
              </h1>
              <span>Follow every run. Find the ones that matter.</span>
            </div>
            <div className="te-title-actions">
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                leadingIcon={<Icon name="star" size="sm" />}
                onClick={() => open("save")}
              >
                Save query
              </Button>
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                leadingIcon={<Icon name="arrow-down" size="sm" />}
                onClick={exportResults}
              >
                Export results
              </Button>
            </div>
          </div>
          <div className="te-query">
            <div className="te-query-top">
              <label className="te-range">
                <Icon name="clock-history" size="sm" />
                <select
                  aria-label="Time range"
                  value={query.days}
                  onChange={(e) => update({ days: e.target.value })}
                >
                  <option value="1">Last 24 hours</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="all">All time</option>
                </select>
              </label>
              <span className="te-project-label">
                Project <strong>docs-agent</strong>
              </span>
              <span className="te-snapshot">
                Snapshot · 16 Oct 2026, 12:00 UTC
              </span>
            </div>
            <QueryFilterBar
              fields={TRACE_FIELDS}
              value={query.conditions}
              onChange={(conditions) => update({ conditions })}
            />
          </div>
          <div className="te-results-toolbar">
            <label className="te-search">
              <Icon name="search" size="sm" />
              <input
                aria-label="Search traces"
                placeholder="Search input, name or trace ID…"
                value={query.search}
                onChange={(e) => update({ search: e.target.value })}
              />
            </label>
            <div>
              <select
                aria-label="Sort traces"
                value={query.sort}
                onChange={(e) => update({ sort: e.target.value as TraceSort })}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="duration">Longest duration</option>
                <option value="score">Lowest score</option>
              </select>
              <Menu>
                <MenuTrigger
                  render={
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      leadingIcon={<Icon name="columns" size="sm" />}
                    />
                  }
                >
                  Columns
                </MenuTrigger>
                <MenuPopup container={root.current} align="end">
                  {TRACE_COLUMNS.map((c) => (
                    <MenuCheckboxItem
                      key={c}
                      checked={columns.includes(c)}
                      disabled={columns.length === 1 && columns.includes(c)}
                      onCheckedChange={(checked) =>
                        setColumns((prev) =>
                          checked ? [...prev, c] : prev.filter((x) => x !== c),
                        )
                      }
                    >
                      {TRACE_COLUMN_LABELS[c]}
                    </MenuCheckboxItem>
                  ))}
                </MenuPopup>
              </Menu>
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                onClick={() => open("query")}
              >
                View query
              </Button>
            </div>
          </div>
          <div className="te-count" role="status">
            <strong>{rows.length} traces</strong>
            <span>
              {query.conditions.length
                ? `${query.conditions.length} condition${query.conditions.length === 1 ? "" : "s"} · all must match`
                : "All primitive types"}
            </span>
          </div>
          <TraceTable
            traces={rows.slice(current * 12, current * 12 + 12)}
            columns={columns}
            selectedId={selected?.id}
            onSelect={(trace) => {
              setSelected(trace);
              open("trace");
            }}
            onClear={reset}
          />
          <div className="te-pagination">
            <span>
              {rows.length
                ? `${current * 12 + 1}–${Math.min((current + 1) * 12, rows.length)} of ${rows.length} traces`
                : "0 traces"}
            </span>
            <div>
              <IconButton
                type="secondary"
                size="sm"
                tapScale={1}
                aria-label="Previous page"
                disabled={current === 0}
                icon={<Icon name="chevron-left" size="sm" />}
                onClick={() => setPage(current - 1)}
              />
              <span>
                Page {current + 1} of {pages}
              </span>
              <IconButton
                type="secondary"
                size="sm"
                tapScale={1}
                aria-label="Next page"
                disabled={current === pages - 1}
                icon={<Icon name="chevron-right" size="sm" />}
                onClick={() => setPage(current + 1)}
              />
            </div>
          </div>
          <p className="te-notice" role="status">
            {notice}
          </p>
          <footer className="te-footer">
            <span>Local sample data · Saved queries reset on reload</span>
            <div>
              <Button
                type="tertiary"
                size="sm"
                tapScale={1}
                onClick={() => {
                  reset();
                  setColumns(DEFAULT_TRACE_COLUMNS);
                  setSaved([]);
                  setSelected(null);
                  setNotice("Sample workspace restored.");
                }}
              >
                Reset demo
              </Button>
              <a
                href="https://x.com/calcsam/status/2110759787814375721"
                target="_blank"
                rel="noreferrer"
              >
                Reference ↗
              </a>
            </div>
          </footer>
        </section>
      </main>
      <Dialog.Root
        open={modal !== null}
        onOpenChange={(value) => {
          if (!value) setModal(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="te-backdrop" />
          <Dialog.Popup
            className={`te-dialog ${modal === "save" ? "te-dialog-small" : ""}`}
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            <header>
              <div>
                <Dialog.Title>
                  {modal === "save"
                    ? "Save query"
                    : modal === "query"
                      ? "Query definition"
                      : selected?.name}
                </Dialog.Title>
                <Dialog.Description>
                  {modal === "save"
                    ? "Save these filters for this local session."
                    : modal === "query"
                      ? "An Oreo query document for the current filters."
                      : `${selected?.id} · ${selected ? formatTraceTime(selected.startedAt) : ""} UTC`}
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
            <div className="te-dialog-body">
              {modal === "save" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const clean = name.trim();
                    if (!clean) {
                      setError("Give this query a name.");
                      return;
                    }
                    if (
                      saved.some(
                        (s) => s.name.toLowerCase() === clean.toLowerCase(),
                      )
                    ) {
                      setError("A query with this name already exists.");
                      return;
                    }
                    setSaved((prev) => [
                      ...prev,
                      {
                        ...query,
                        conditions: query.conditions.map((c) => ({ ...c })),
                        id: crypto.randomUUID(),
                        name: clean,
                      },
                    ]);
                    setNotice(`Saved ${clean}.`);
                    setModal(null);
                  }}
                  noValidate
                >
                  <label>
                    Query name
                    <input
                      autoFocus
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-invalid={!!error}
                      aria-describedby={error ? "te-save-error" : undefined}
                      placeholder="e.g. Slow documentation runs"
                    />
                  </label>
                  {error && (
                    <p id="te-save-error" role="alert" className="tq-error">
                      {error}
                    </p>
                  )}
                  <div className="te-save-actions">
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      onClick={() => setModal(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      tapScale={1}
                      render={<button type="submit" />}
                    >
                      Save
                    </Button>
                  </div>
                </form>
              ) : modal === "query" ? (
                <>
                  <CodeBlock
                    title="query.json"
                    language="json"
                    code={JSON.stringify(document, null, 2)}
                  />
                  <p className="te-help">
                    Export includes this definition and all {rows.length}{" "}
                    matching traces, across every result page. This is an Oreo
                    demo schema, not an external provider API.
                  </p>
                  <Button
                    type="secondary"
                    size="sm"
                    tapScale={1}
                    onClick={exportResults}
                  >
                    Export results
                  </Button>
                  <p role="status" className="te-help">
                    {notice}
                  </p>
                </>
              ) : selected ? (
                <>
                  <div className="te-detail-meta">
                    <Tag
                      color={
                        selected.status === "error"
                          ? "pink"
                          : selected.status === "success"
                            ? "mint"
                            : "blue"
                      }
                    >
                      {selected.status}
                    </Tag>
                    <span>{selected.kind}</span>
                    <span>{selected.environment}</span>
                    <span>{formatDuration(selected.durationMs)}</span>
                    <span>Score {selected.score ?? "—"}</span>
                    <span>Feedback {selected.feedback ?? "—"}</span>
                  </div>
                  <dl className="te-identifiers">
                    <div>
                      <dt>Primitive ID</dt>
                      <dd>{selected.primitiveId}</dd>
                    </div>
                    <div>
                      <dt>Model</dt>
                      <dd>{selected.model}</dd>
                    </div>
                    <div>
                      <dt>Estimated cost</dt>
                      <dd>
                        {selected.costUsd === null
                          ? "—"
                          : `$${selected.costUsd.toFixed(4)}`}
                      </dd>
                    </div>
                  </dl>
                  <CodeBlock title="Input" code={selected.input} />
                  <CodeBlock
                    title={selected.status === "error" ? "Error" : "Output"}
                    code={selected.output}
                    language={selected.status === "error" ? "json" : undefined}
                  />
                  <section className="te-spans">
                    <h2>Run steps</h2>
                    <ol>
                      {selected.spans.map((span, i) => (
                        <li key={span.name}>
                          <span className="te-span-number">{i + 1}</span>
                          <strong>{span.name}</strong>
                          <Tag
                            color={
                              span.status === "error"
                                ? "pink"
                                : span.status === "success"
                                  ? "mint"
                                  : "blue"
                            }
                          >
                            {span.status}
                          </Tag>
                          <span>{formatDuration(span.durationMs)}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                </>
              ) : null}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

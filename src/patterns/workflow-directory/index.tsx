import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import {
  DataFilterPopover,
  DataSortMenu,
  RowActionMenu,
  BulkActionBar,
  type FilterValues,
  type DataSort,
  type DataAction,
} from "@/components/data-operations";
import {
  WorkflowTable,
  WorkflowStatusBadge,
  workflowRows,
  workflowCSV,
  type Workflow,
} from "@/components/workflow-table";
import {
  WORKFLOWS,
  FOLDERS,
  OWNERS,
  SORT_OPTIONS,
  workflowFilterGroups,
} from "./data";
import "./workspace.css";
const PAGE_SIZE = 10;
export function WorkflowDirectoryPage() {
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    search = useRef<HTMLInputElement>(null),
    returnTo = useRef<HTMLElement | null>(null);
  const [rows, setRows] = useState(WORKFLOWS),
    [dark, setDark] = useThemeMode(false),
    [query, setQuery] = useState(""),
    [view, setView] = useState("All"),
    [folder, setFolder] = useState("");
  const [filters, setFilters] = useState<FilterValues>({}),
    [sort, setSort] = useState<DataSort>({ key: "edited", direction: "desc" }),
    [page, setPage] = useState(0),
    [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState("ready"),
    [notice, setNotice] = useState(""),
    [undo, setUndo] = useState<Workflow[] | null>(null);
  const [dialog, setDialog] = useState<{
      kind: "edit" | "history" | "test";
      row?: Workflow;
    } | null>(null),
    [name, setName] = useState(""),
    [owner, setOwner] = useState(OWNERS[0]),
    [formError, setFormError] = useState("");
  const matches = workflowRows(rows, { query, view, folder, filters, sort }),
    pages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE)),
    currentPage = Math.min(page, pages - 1),
    visible = matches.slice(
      currentPage * PAGE_SIZE,
      (currentPage + 1) * PAGE_SIZE,
    );
  const matchedIds = new Set(matches.map((r) => r.id)),
    chosen = selected.filter((id) => matchedIds.has(id)),
    selectedRows = rows.filter((r) => chosen.includes(r.id));
  useEffect(() => {
    if (mode !== "loading") return;
    const timer = setTimeout(() => setMode("ready"), 900);
    return () => clearTimeout(timer);
  }, [mode]);
  const resetSelection = () => {
    setSelected([]);
    setPage(0);
  };
  function resetFilters() {
    setQuery("");
    setFilters({});
    setView("All");
    setFolder("");
    setMode("ready");
    resetSelection();
    heading.current?.focus();
  }
  function update(
    ids: string[],
    change: (r: Workflow) => Workflow,
    message: string,
  ) {
    setUndo(rows);
    setRows((old) => old.map((r) => (ids.includes(r.id) ? change(r) : r)));
    setNotice(message);
    setSelected([]);
  }
  function exportRows(items: Workflow[]) {
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + workflowCSV(items)], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-workflows.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`Exported ${items.length} workflows.`);
  }
  function openEditor(row?: Workflow) {
    returnTo.current = document.activeElement as HTMLElement;
    setName(row?.name ?? "");
    setOwner(row?.owner ?? OWNERS[0]);
    setFormError("");
    setDialog({ kind: "edit", row });
  }
  function save(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setFormError("Enter a workflow name.");
      return;
    }
    if (
      rows.some(
        (r) =>
          r.id !== dialog?.row?.id &&
          r.name.toLowerCase() === trimmed.toLowerCase(),
      )
    ) {
      setFormError("A workflow with this name already exists.");
      return;
    }
    setUndo(rows);
    const old = dialog?.row;
    const next: Workflow = old
      ? {
          ...old,
          name: trimmed,
          owner,
          edited: new Date().toISOString(),
          version: old.version + 1,
        }
      : {
          id: crypto.randomUUID(),
          name: trimmed,
          owner,
          status: "Draft",
          description: "Form submitted · new workflow",
          trigger: "Form",
          connector: "Sheets",
          folder: folder || "Operations",
          runs: 0,
          success: null,
          history: [0, 0, 0, 0, 0, 0, 0],
          edited: new Date().toISOString(),
          version: 1,
        };
    setRows((list) =>
      old ? list.map((r) => (r.id === old.id ? next : r)) : [next, ...list],
    );
    setDialog(null);
    setNotice(`${trimmed} ${old ? "updated" : "created as a draft"}.`);
    resetFilters();
  }
  const folderActions = (current?: string): DataAction[] =>
    FOLDERS.map((f) => ({
      id: `folder:${f}`,
      label: f,
      icon: "folder",
      selected: current === f,
    }));
  function rowAction(row: Workflow, id: string) {
    returnTo.current = document.activeElement as HTMLElement;
    if (id === "open") openEditor(row);
    else if (id === "history") setDialog({ kind: "history", row });
    else if (id === "test") setDialog({ kind: "test", row });
    else if (id === "duplicate") {
      setUndo(rows);
      let copy = `${row.name} copy`;
      let n = 2;
      while (rows.some((r) => r.name === copy))
        copy = `${row.name} copy ${n++}`;
      setRows((old) => [
        {
          ...row,
          id: crypto.randomUUID(),
          name: copy,
          status: "Draft",
          runs: 0,
          success: null,
          history: [0, 0, 0, 0, 0, 0, 0],
          version: 1,
          edited: new Date().toISOString(),
        },
        ...old,
      ]);
      setNotice(`${copy} created as a draft.`);
      resetFilters();
    } else if (id.startsWith("folder:"))
      update(
        [row.id],
        (r) => ({ ...r, folder: id.slice(7) }),
        `${row.name} moved to ${id.slice(7)}.`,
      );
    else if (id === "pause")
      update(
        [row.id],
        (r) => ({ ...r, status: r.status === "Paused" ? "Live" : "Paused" }),
        `${row.name} ${row.status === "Paused" ? "resumed" : "paused"}.`,
      );
    else if (id === "archive")
      update(
        [row.id],
        (r) => ({ ...r, status: "Archived" }),
        `${row.name} archived.`,
      );
    else if (id === "restore")
      update(
        [row.id],
        (r) => ({ ...r, status: "Draft" }),
        `${row.name} restored as a draft.`,
      );
  }
  function rowActions(row: Workflow): DataAction[] {
    return [
      { id: "open", label: "Open workflow", icon: "columns" },
      {
        id: "test",
        label: "Run sample test",
        icon: "checks",
        disabled: row.status === "Archived",
      },
      { id: "duplicate", label: "Duplicate", icon: "copy" },
      { id: "history", label: "Version history", icon: "clock-history" },
      {
        id: "move",
        label: "Move to folder",
        icon: "folder",
        children: folderActions(row.folder),
      },
      ...(row.status === "Archived"
        ? [
            {
              id: "restore",
              label: "Restore draft",
              icon: "reset" as const,
              separatorBefore: true,
            },
          ]
        : [
            {
              id: "pause",
              label:
                row.status === "Paused" ? "Resume workflow" : "Pause workflow",
              icon: "circle-dashed" as const,
              disabled: row.status === "Draft",
              separatorBefore: true,
            },
            {
              id: "archive",
              label: "Archive",
              icon: "folder" as const,
              danger: true,
              separatorBefore: true,
            },
          ]),
    ];
  }
  return (
    <div
      ref={root}
      className={`wdir-page${dark ? " theme-dark" : ""}`}
      onKeyDown={(e) => {
        if (
          e.key === "/" &&
          !(e.target instanceof HTMLInputElement) &&
          !(e.target instanceof HTMLTextAreaElement) &&
          !(e.target instanceof HTMLSelectElement) &&
          !dialog
        ) {
          e.preventDefault();
          search.current?.focus();
        }
      }}
    >
      <header className="wdir-top">
        <a href="/" className="wdir-brand">
          <Icon name="columns" />
          Oreo <span>Automations</span>
        </a>
        <div>
          <a href="/workflow-table">
            Components <Icon name="arrow-up-right" size="sm" />
          </a>
          <IconButton
            type="tertiary"
            tapScale={1}
            icon={<Icon name={dark ? "sun" : "moon"} />}
            aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
            onClick={() => setDark((v) => !v)}
          />
          <Avatar size="sm" name="Chara Lee" />
        </div>
      </header>
      <main>
        <div className="wdir-heading">
          <div>
            <p className="wdir-eyebrow">WORKSPACE / AUTOMATIONS</p>
            <h1 ref={heading} tabIndex={-1}>
              Workflows
            </h1>
            <p>Your team's everyday work, on autopilot.</p>
          </div>
          <Button
            tapScale={1}
            leadingIcon={<Icon name="plus" size="sm" />}
            onClick={() => openEditor()}
          >
            Create workflow
          </Button>
        </div>
        <div className="wdir-toolbar">
          <div className="wdir-tabs" role="group" aria-label="Workflow views">
            {["All", "Live", "Draft", "Paused", "Archived"].map((v) => (
              <button
                key={v}
                aria-pressed={view === v}
                onClick={() => {
                  setView(v);
                  setFilters({});
                  resetSelection();
                }}
              >
                {v}
                <span>
                  {
                    rows.filter((r) =>
                      v === "All" ? r.status !== "Archived" : r.status === v,
                    ).length
                  }
                </span>
              </button>
            ))}
          </div>
          <div className="wdir-tools">
            <label className="wdir-search">
              <Icon name="search" size="sm" />
              <input
                ref={search}
                type="search"
                aria-label="Search workflows"
                placeholder="Search workflows"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetSelection();
                }}
              />
              <kbd>/</kbd>
            </label>
            <DataFilterPopover
              groups={workflowFilterGroups(rows)}
              value={filters}
              onApply={(v) => {
                setFilters(v);
                resetSelection();
              }}
              resultCount={(draft) =>
                workflowRows(rows, { query, view, folder, filters: draft })
                  .length
              }
            />
            <DataSortMenu
              options={SORT_OPTIONS}
              value={sort}
              onChange={(s) => {
                setSort(s);
                setPage(0);
              }}
            />
          </div>
        </div>
        <div className="wdir-context">
          <label>
            <Icon name="folder" size="sm" />
            <select
              aria-label="Workflow folder"
              value={folder}
              onChange={(e) => {
                setFolder(e.target.value);
                resetSelection();
              }}
            >
              <option value="">All folders</option>
              {FOLDERS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </label>
          <span>{matches.length} matching workflows</span>
          {(query ||
            Object.values(filters).some((v) => v.length) ||
            folder) && (
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              onClick={resetFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
        <WorkflowTable
          rows={mode === "loading" ? [] : visible}
          selected={chosen}
          onSelectionChange={setSelected}
          onOpen={openEditor}
          actions={(row) => (
            <RowActionMenu
              label={`Actions for ${row.name}`}
              actions={rowActions(row)}
              onAction={(id) => rowAction(row, id)}
            />
          )}
          loading={mode === "loading"}
          error={
            mode === "error"
              ? "The sample request failed. Retry to restore the local workflow list."
              : undefined
          }
          onReset={() =>
            mode === "error" ? setMode("loading") : resetFilters()
          }
        />
        <div className="wdir-pagination">
          <span>
            {matches.length ? currentPage * PAGE_SIZE + 1 : 0}–
            {Math.min((currentPage + 1) * PAGE_SIZE, matches.length)} of{" "}
            {matches.length} workflows
          </span>
          <div>
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              disabled={currentPage === 0}
              onClick={() => setPage(currentPage - 1)}
              leadingIcon={<Icon name="chevron-left" size="sm" />}
            >
              Previous
            </Button>
            <span>
              Page {currentPage + 1} of {pages}
            </span>
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              disabled={currentPage + 1 >= pages}
              onClick={() => setPage(currentPage + 1)}
              trailingIcon={<Icon name="chevron-right" size="sm" />}
            >
              Next
            </Button>
          </div>
        </div>
        <div className="wdir-notice" role="status">
          <span>
            {notice || "Local sample workspace. Changes reset on reload."}
          </span>
          {undo && (
            <Button
              type="tertiary"
              size="sm"
              tapScale={1}
              onClick={() => {
                setRows(undo);
                setUndo(null);
                setSelected([]);
                setNotice("Last change undone.");
              }}
            >
              Undo
            </Button>
          )}
        </div>
        <footer className="wdir-footer">
          <span>
            Inspired by{" "}
            <a
              href="https://x.com/jubayer6910/status/2111721342316020098"
              target="_blank"
              rel="noreferrer"
            >
              Jubayer ↗
            </a>
          </span>
          <RowActionMenu
            label="Demo states"
            trigger="Demo states"
            actions={[
              { id: "loading", label: "Show loading" },
              { id: "error", label: "Simulate error" },
              { id: "ready", label: "Restore list" },
            ]}
            onAction={(id) => {
              setMode(id);
              setSelected([]);
            }}
          />
        </footer>
      </main>
      <div className="wdir-bulk">
        <BulkActionBar
          count={chosen.length}
          total={matches.length}
          onSelectAll={() => setSelected(matches.map((r) => r.id))}
          onClear={() => setSelected([])}
        >
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            onClick={() => {
              setNotice(
                `Sample test: ${selectedRows.filter((r) => r.status !== "Failing").length} passed, ${selectedRows.filter((r) => r.status === "Failing").length} failed. No external services were called.`,
              );
            }}
          >
            Run sample test
          </Button>
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            disabled={
              !selectedRows.some(
                (r) => !["Archived", "Draft", "Paused"].includes(r.status),
              )
            }
            onClick={() =>
              update(
                chosen,
                (r) =>
                  ["Archived", "Draft"].includes(r.status)
                    ? r
                    : { ...r, status: "Paused" },
                "Selected active workflows paused.",
              )
            }
          >
            Pause
          </Button>
          <RowActionMenu
            label="Move selected workflows"
            trigger="Move to…"
            actions={folderActions()}
            onAction={(id) =>
              update(
                chosen,
                (r) => ({ ...r, folder: id.slice(7) }),
                `${chosen.length} workflows moved to ${id.slice(7)}.`,
              )
            }
          />
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            onClick={() => exportRows(selectedRows)}
          >
            Export CSV
          </Button>
          <Button
            type="secondary"
            danger
            size="sm"
            tapScale={1}
            onClick={() =>
              update(
                chosen,
                (r) => ({
                  ...r,
                  status: view === "Archived" ? "Draft" : "Archived",
                }),
                `${chosen.length} workflows ${view === "Archived" ? "restored as drafts" : "archived"}.`,
              )
            }
          >
            {view === "Archived" ? "Restore" : "Archive"}
          </Button>
        </BulkActionBar>
      </div>
      <Dialog.Root
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null);
        }}
      >
        <Dialog.Portal container={root}>
          <Dialog.Backdrop className="wdir-backdrop" />
          <Dialog.Popup
            className="wdir-dialog"
            finalFocus={() =>
              returnTo.current?.isConnected ? returnTo.current : heading.current
            }
          >
            <header>
              <Dialog.Title>
                {dialog?.kind === "edit"
                  ? dialog.row
                    ? "Workflow details"
                    : "Create workflow"
                  : dialog?.kind === "history"
                    ? "Version history"
                    : "Sample test result"}
              </Dialog.Title>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    tapScale={1}
                    icon={<Icon name="x" />}
                    aria-label="Close dialog"
                  />
                }
              />
            </header>
            <Dialog.Description className="wdir-description">
              {dialog?.row?.name ??
                "Start with a draft. Everything stays in this local sample workspace."}
            </Dialog.Description>
            {dialog?.kind === "edit" ? (
              <form onSubmit={save}>
                <label>
                  Workflow name
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    aria-invalid={!!formError}
                    aria-describedby={
                      formError ? "workflow-form-error" : undefined
                    }
                  />
                </label>
                <label>
                  Owner
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                  >
                    {OWNERS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
                {dialog.row && (
                  <div className="wdir-detail">
                    <WorkflowStatusBadge status={dialog.row.status} />
                    <span>
                      {dialog.row.connector} · {dialog.row.trigger}
                    </span>
                    <span>{dialog.row.folder}</span>
                  </div>
                )}
                {formError && (
                  <p
                    id="workflow-form-error"
                    role="alert"
                    className="text-status-error"
                  >
                    {formError}
                  </p>
                )}
                <p className="wdir-description">
                  Edit the name and owner here. Workflow execution and
                  integrations are not connected.
                </p>
                <footer>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() => setDialog(null)}
                  >
                    Cancel
                  </Button>
                  <Button tapScale={1} render={<button type="submit" />}>
                    {dialog.row ? "Save changes" : "Create draft"}
                  </Button>
                </footer>
              </form>
            ) : dialog?.kind === "history" ? (
              <div className="wdir-detail">
                <strong>v{dialog.row?.version} · Current version</strong>
                <time>
                  {dialog.row &&
                    new Date(dialog.row.edited).toLocaleString("en-US", {
                      timeZone: "UTC",
                    })}{" "}
                  UTC
                </time>
                <p>
                  Only the current sample version is available. Earlier revision
                  content is not included in this template.
                </p>
              </div>
            ) : (
              <div className="wdir-detail">
                <strong
                  className={
                    dialog?.row?.status === "Failing"
                      ? "text-status-error"
                      : "text-status-success"
                  }
                >
                  {dialog?.row?.status === "Failing"
                    ? "Sample failed · connector timeout"
                    : "Sample passed"}
                </strong>
                <p>
                  This is a fixture result based on the workflow's sample
                  status. No email, webhook, or external automation ran.
                </p>
              </div>
            )}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Tag } from "@/components/tag";
import { OreoLogo } from "@/docs/OreoLogo";
import { AgentWorkspaceState } from "@/components/automation";
import {
  StorageUsageCard,
  StorageModuleTable,
  RetentionPolicyRow,
  GB,
  formatStorage,
  usedBytes,
  cleanupEstimate,
  recycleArchived,
  restoreBatch,
  purgeBatch,
  type StorageState,
} from "@/components/storage-management";
import { initialStorage, initialPolicies } from "./data";
import "./storage-manager.css";
type Tab = "Storage" | "Recycle bin" | "Audit log";
type Modal =
  | { kind: "module"; id: string }
  | { kind: "cleanup" }
  | { kind: "capacity" }
  | { kind: "purge"; id: string }
  | null;
export function StorageManagerPage() {
  const [dark, setDark] = useState(true),
    [tab, setTab] = useState<Tab>("Storage"),
    [data, setData] = useState(initialStorage),
    [capacity, setCapacity] = useState(20 * GB),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("storage"),
    [selected, setSelected] = useState<string[]>([]),
    [policies, setPolicies] = useState(initialPolicies),
    [draft, setDraft] = useState(initialPolicies),
    [notice, setNotice] = useState(""),
    [modal, setModal] = useState<Modal>(null),
    [nextCapacity, setNextCapacity] = useState(40 * GB),
    [undo, setUndo] = useState<StorageState | null>(null),
    [audit, setAudit] = useState([
      {
        id: "initial",
        action: "Workspace loaded",
        detail: "18.8 GB occupied · local sample data",
        time: "Just now",
      },
    ]);
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  const used = usedBytes(data),
    binBytes = data.bin.reduce((s, b) => s + b.bytes, 0),
    dirty = JSON.stringify(draft) !== JSON.stringify(policies),
    estimate = cleanupEstimate(data.modules, selected),
    filtered = data.modules
      .filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase()))
      .sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name)
          : sort === "growth"
            ? b.growth - a.growth
            : b.bytes - a.bytes,
      ),
    module =
      modal?.kind === "module"
        ? data.modules.find((m) => m.id === modal.id)
        : undefined,
    batch =
      modal?.kind === "purge"
        ? data.bin.find((b) => b.id === modal.id)
        : undefined;
  function log(action: string, detail: string) {
    setAudit((v) => [
      {
        id: crypto.randomUUID(),
        action,
        detail,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...v,
    ]);
    setNotice(detail);
  }
  function open(next: Modal) {
    trigger.current = document.activeElement as HTMLElement;
    setNextCapacity(Math.max(capacity, 40 * GB));
    setModal(next);
  }
  function commit(next: StorageState, action: string, detail: string) {
    setUndo(data);
    setData(next);
    setSelected([]);
    setModal(null);
    log(action, detail);
  }
  function navigate(next: Tab) {
    setTab(next);
    setQuery("");
    setSelected([]);
  }
  function exportSnapshot() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            capacityBytes: capacity,
            usedBytes: used,
            modules: data.modules,
            recycleBin: data.bin,
            retentionDays: policies,
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-storage-snapshot.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    log("Snapshot exported", "Exported the complete local workspace snapshot.");
  }
  return (
    <div ref={root} className={dark ? "theme-dark" : ""}>
      <div className="sm-page">
        <aside className="sm-app-rail">
          <a className="sm-brand" href="/storage-usage-card">
            <OreoLogo className="h-6 w-8" />
            Oreo <span>CRM</span>
          </a>
          <nav aria-label="Workspace">
            <a href="/crm-dashboard">
              <Icon name="columns" size="sm" />
              Dashboard
            </a>
            <a href="/company-directory">
              <Icon name="users" size="sm" />
              Companies
            </a>
            <a href="/grouped-tasks">
              <Icon name="check" size="sm" />
              Tasks
            </a>
            <a href="/meeting-planner">
              <Icon name="calendar" size="sm" />
              Meetings
            </a>
          </nav>
          <p className="sm-nav-caption">INSIGHT & CONTROL</p>
          <nav aria-label="Insights">
            <a href="/project-feed">
              <Icon name="chart-bar" size="sm" />
              Activities
            </a>
            <a href="/usage-forecast">
              <Icon name="clock-history" size="sm" />
              Usage forecast
            </a>
            <a href="/storage-manager" aria-current="page">
              <Icon name="sliders" size="sm" />
              Settings
            </a>
          </nav>
          <div className="sm-rail-foot">
            <Tag>Local workspace</Tag>
            <p>
              Manage sample storage.
              <br />
              Changes reset on reload.
            </p>
            <a href="/changelog">What’s new ↗</a>
          </div>
        </aside>
        <div className="sm-workspace">
          <header className="sm-topbar">
            <span>
              Settings <span>/</span> Data management
            </span>
            <div className="sm-actions">
              <IconButton
                type="tertiary"
                tapScale={1}
                aria-label={dark ? "Use light theme" : "Use dark theme"}
                icon={<Icon name={dark ? "sun" : "moon"} />}
                onClick={() => setDark(!dark)}
              />
              <Button
                type="secondary"
                size="sm"
                tapScale={1}
                onClick={exportSnapshot}
              >
                Export snapshot
              </Button>
            </div>
          </header>
          <div className="sm-body">
            <aside className="sm-settings-rail">
              <h2>Settings</h2>
              <p className="sm-nav-caption">WORKSPACE SETTINGS</p>
              <nav aria-label="Settings sections">
                <a href="/settings">
                  Appearance <Icon name="arrow-up-right" size="sm" />
                </a>
                <a href="/plan-upgrade">
                  Billing & plans <Icon name="arrow-up-right" size="sm" />
                </a>
                <a href="/support-console">
                  Support <Icon name="arrow-up-right" size="sm" />
                </a>
                <a href="/storage-manager" aria-current="page">
                  Data management
                </a>
              </nav>
              <p className="sm-rail-note">
                Storage, retention and recovery in one place.
              </p>
            </aside>
            <main className="sm-main">
              <div className="sm-section-toolbar">
                <nav aria-label="Data management views" className="sm-tabs">
                  {(["Storage", "Recycle bin", "Audit log"] as Tab[]).map(
                    (name) => (
                      <button
                        key={name}
                        aria-label={
                          name === "Recycle bin" && data.bin.length
                            ? `Recycle bin (${data.bin.length})`
                            : name
                        }
                        aria-current={tab === name ? "page" : undefined}
                        onClick={() => navigate(name)}
                      >
                        {name}
                        {name === "Recycle bin" && data.bin.length > 0 && (
                          <span>{data.bin.length}</span>
                        )}
                      </button>
                    ),
                  )}
                </nav>
                <Button
                  type="secondary"
                  size="sm"
                  tapScale={1}
                  onClick={() => open({ kind: "capacity" })}
                  leadingIcon={<Icon name="plus" size="sm" />}
                >
                  Adjust capacity
                </Button>
              </div>
              <div className="sm-page-heading">
                <h1 ref={heading} tabIndex={-1}>
                  {tab === "Storage" ? "Storage management" : tab}
                </h1>
                <p>
                  {tab === "Storage"
                    ? "A clear view of your workspace, down to the last file."
                    : tab === "Recycle bin"
                      ? "Recover archived files or review their removal from this local demo."
                      : "A record of changes made during this session."}
                </p>
              </div>
              <div className="sm-notice" role="status">
                {notice ||
                  "Local sample data · no external storage is connected"}
              </div>
              {tab === "Storage" && (
                <>
                  <StorageUsageCard
                    modules={data.modules}
                    capacity={capacity}
                    recycledBytes={binBytes}
                  />
                  {used >= capacity * 0.9 && (
                    <p className="sm-capacity-note">
                      <Icon name="info" size="sm" />
                      {used > capacity
                        ? "This sample workspace is over capacity."
                        : "Your workspace is nearing capacity."}{" "}
                      Review archived files or adjust the sample limit.
                    </p>
                  )}
                  <section className="sm-panel">
                    <header>
                      <div>
                        <h2>Storage by module</h2>
                        <p>
                          Share is based on all occupied storage, including the
                          recycle bin.
                        </p>
                      </div>
                      <div className="sm-actions">
                        <Button
                          type="tertiary"
                          size="sm"
                          tapScale={1}
                          disabled={!undo}
                          onClick={() => {
                            if (undo) {
                              setData(undo);
                              setUndo(null);
                              setSelected([]);
                              log(
                                "Change undone",
                                "Previous file operation restored.",
                              );
                            }
                          }}
                        >
                          Undo
                        </Button>
                        <Button
                          type="secondary"
                          size="sm"
                          tapScale={1}
                          disabled={!estimate.files}
                          onClick={() => open({ kind: "cleanup" })}
                        >
                          Review cleanup
                          {selected.length ? ` (${selected.length})` : ""}
                        </Button>
                      </div>
                    </header>
                    <div className="sm-filters">
                      <label>
                        <Icon name="search" size="sm" />
                        <input
                          type="search"
                          aria-label="Search modules"
                          placeholder="Search modules…"
                          value={query}
                          onChange={(e) => {
                            setQuery(e.target.value);
                            setSelected([]);
                          }}
                        />
                      </label>
                      <label>
                        Sort by{" "}
                        <select
                          aria-label="Sort modules"
                          value={sort}
                          onChange={(e) => setSort(e.target.value)}
                        >
                          <option value="storage">Largest storage</option>
                          <option value="name">Module name</option>
                          <option value="growth">Highest growth</option>
                        </select>
                      </label>
                    </div>
                    <StorageModuleTable
                      modules={filtered}
                      totalUsed={used}
                      selected={selected}
                      onSelectionChange={setSelected}
                      onDetails={(id) => open({ kind: "module", id })}
                      empty={
                        <AgentWorkspaceState
                          title="No matching modules"
                          description="Try another module name to find its storage usage."
                          actionLabel="Clear search"
                          onAction={() => setQuery("")}
                        />
                      }
                    />
                  </section>
                  <section className="sm-panel sm-retention">
                    <header>
                      <div>
                        <h2>Data retention policies</h2>
                        <p>
                          Draft settings for this demo. No automatic archiving
                          or deletion runs.
                        </p>
                      </div>
                      {dirty && <Tag>Unsaved</Tag>}
                    </header>
                    <div className="sm-retention-body">
                      <RetentionPolicyRow
                        title="Recycle bin retention"
                        description="How long deleted records should remain recoverable."
                        icon="trash"
                        value={draft.bin}
                        onChange={(bin) => setDraft({ ...draft, bin })}
                      />
                      <RetentionPolicyRow
                        title="Email archive"
                        description="Keep older conversations available for reference."
                        icon="chat"
                        value={draft.email}
                        onChange={(email) => setDraft({ ...draft, email })}
                      />
                      <RetentionPolicyRow
                        title="Audit log history"
                        description="Retain workspace change history for your team."
                        icon="clock-history"
                        value={draft.logs}
                        onChange={(logs) => setDraft({ ...draft, logs })}
                      />
                    </div>
                    <footer>
                      <span>
                        {dirty
                          ? "Changes are not saved yet."
                          : "All policy changes saved locally."}
                      </span>
                      <div className="sm-actions">
                        <Button
                          type="secondary"
                          size="sm"
                          tapScale={1}
                          disabled={!dirty}
                          onClick={() => {
                            setDraft(policies);
                            setNotice("Unsaved policy changes discarded.");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          tapScale={1}
                          disabled={!dirty}
                          onClick={() => {
                            setPolicies(draft);
                            log(
                              "Retention policies saved",
                              "Retention preferences saved locally. No automated deletion is scheduled.",
                            );
                          }}
                        >
                          Save policies
                        </Button>
                      </div>
                    </footer>
                  </section>
                </>
              )}
              {tab === "Recycle bin" && (
                <section className="sm-panel">
                  <header>
                    <div>
                      <h2>Recoverable files</h2>
                      <p>
                        {formatStorage(binBytes)} still occupies storage until
                        purged.
                      </p>
                    </div>
                    <Button
                      type="secondary"
                      size="sm"
                      tapScale={1}
                      disabled={!undo}
                      onClick={() => {
                        if (undo) {
                          setData(undo);
                          setUndo(null);
                          log(
                            "Change undone",
                            "Previous file operation restored.",
                          );
                        }
                      }}
                    >
                      Undo
                    </Button>
                  </header>
                  {data.bin.length ? (
                    <ul className="sm-bin">
                      {data.bin.map((b) => (
                        <li key={b.id}>
                          <span className="sm-policy-icon">
                            <Icon name="folder" />
                          </span>
                          <div>
                            <strong>{b.name}</strong>
                            <p>
                              {b.files} files · {formatStorage(b.bytes)}
                            </p>
                          </div>
                          <div className="sm-actions">
                            <Button
                              type="secondary"
                              size="sm"
                              tapScale={1}
                              onClick={() =>
                                commit(
                                  restoreBatch(data, b.id),
                                  "Files restored",
                                  `${b.files} ${b.name.toLowerCase()} files restored.`,
                                )
                              }
                            >
                              Restore
                            </Button>
                            <Button
                              type="tertiary"
                              danger
                              size="sm"
                              tapScale={1}
                              onClick={() => open({ kind: "purge", id: b.id })}
                            >
                              Review purge
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <AgentWorkspaceState
                      title="Recycle bin is empty"
                      description="Archived files you move here can be restored before they are purged."
                      actionLabel="Review storage"
                      onAction={() => navigate("Storage")}
                    />
                  )}
                </section>
              )}
              {tab === "Audit log" && (
                <section className="sm-panel">
                  <header>
                    <h2>Session activity</h2>
                    <span>{audit.length} events</span>
                  </header>
                  <ol className="sm-audit">
                    {audit.map((a) => (
                      <li key={a.id}>
                        <span className="sm-policy-icon">
                          <Icon name="check" size="sm" />
                        </span>
                        <div>
                          <strong>{a.action}</strong>
                          <p>{a.detail}</p>
                        </div>
                        <time>{a.time}</time>
                      </li>
                    ))}
                  </ol>
                </section>
              )}
              <footer className="sm-footer">
                <a href="/storage-usage-card">Explore the components ↗</a>
                <a
                  href="https://x.com/Tanjim38/status/2110794332525715550"
                  target="_blank"
                  rel="noreferrer"
                >
                  Reference by Tanjim ↗
                </a>
              </footer>
            </main>
          </div>
        </div>
      </div>
      <Dialog.Root
        open={modal !== null}
        onOpenChange={(v) => {
          if (!v) setModal(null);
        }}
      >
        <Dialog.Portal container={root}>
          <Dialog.Backdrop className="sm-backdrop" />
          <Dialog.Popup
            className="sm-dialog"
            finalFocus={() =>
              trigger.current?.isConnected &&
              !trigger.current.matches(":disabled")
                ? trigger.current
                : heading.current
            }
          >
            <header>
              <Dialog.Title>
                {module
                  ? `${module.name} storage`
                  : modal?.kind === "cleanup"
                    ? "Review archived files"
                    : modal?.kind === "capacity"
                      ? "Adjust sample capacity"
                      : "Purge recycled files"}
              </Dialog.Title>
              <Dialog.Close
                render={
                  <IconButton
                    type="tertiary"
                    tapScale={1}
                    aria-label="Close dialog"
                    icon={<Icon name="x" />}
                  />
                }
              />
            </header>
            <div className="sm-dialog-body">
              <Dialog.Description>
                {module
                  ? "Storage and eligible archived files in this module."
                  : modal?.kind === "cleanup"
                    ? "Move only the archived sample files below to the recycle bin. Active files stay in place."
                    : modal?.kind === "capacity"
                      ? "Change the quota in this local demo. This does not purchase a plan or change billing."
                      : "Purge this batch from the local recycle bin to reclaim its occupied space. One-step undo remains available."}
              </Dialog.Description>
              {module && (
                <dl>
                  {Object.entries({
                    Storage: formatStorage(module.bytes),
                    Files: module.files,
                    "Archived storage": formatStorage(module.archivedBytes),
                    "Archived files": module.archivedFiles,
                    "Share of occupied": `${used ? Number(((module.bytes / used) * 100).toFixed(1)) : 0}%`,
                  }).map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {modal?.kind === "cleanup" && (
                <>
                  <ul className="sm-review-list">
                    {data.modules
                      .filter(
                        (m) => selected.includes(m.id) && m.archivedFiles > 0,
                      )
                      .map((m) => (
                        <li key={m.id}>
                          <strong>{m.name}</strong>
                          <span>
                            {m.archivedFiles} files ·{" "}
                            {formatStorage(m.archivedBytes)}
                          </span>
                        </li>
                      ))}
                  </ul>
                  <p className="sm-callout">
                    {estimate.files} archived files ·{" "}
                    {formatStorage(estimate.bytes)}. Moving to the bin does not
                    free quota; only purging does.
                  </p>
                </>
              )}
              {modal?.kind === "capacity" && (
                <label className="sm-capacity-field">
                  Sample storage limit
                  <select
                    aria-label="Sample storage limit"
                    value={nextCapacity}
                    onChange={(e) => setNextCapacity(Number(e.target.value))}
                  >
                    {[10, 20, 40, 100].map((n) => (
                      <option key={n} value={n * GB}>
                        {n} GB
                      </option>
                    ))}
                  </select>
                  <span>
                    {formatStorage(used)} currently occupied.
                    {nextCapacity < used
                      ? " This scenario will be over capacity; files are preserved."
                      : ""}
                  </span>
                </label>
              )}
              {batch && (
                <p className="sm-callout">
                  {batch.name}: {batch.files} files ·{" "}
                  {formatStorage(batch.bytes)} will be freed.
                </p>
              )}
            </div>
            <footer>
              <Dialog.Close
                render={
                  <Button type="secondary" tapScale={1}>
                    Cancel
                  </Button>
                }
              />
              {modal?.kind === "cleanup" && (
                <Button
                  tapScale={1}
                  disabled={!estimate.files}
                  onClick={() =>
                    commit(
                      recycleArchived(data, selected, crypto.randomUUID()),
                      "Files recycled",
                      `${estimate.files} archived files moved to the recycle bin. Occupied capacity is unchanged.`,
                    )
                  }
                >
                  Move to recycle bin
                </Button>
              )}
              {modal?.kind === "capacity" && (
                <Button
                  tapScale={1}
                  onClick={() => {
                    setCapacity(nextCapacity);
                    setModal(null);
                    log(
                      "Sample capacity changed",
                      `Sample limit set to ${formatStorage(nextCapacity)}. No billing changes.`,
                    );
                  }}
                >
                  Apply sample limit
                </Button>
              )}
              {batch && (
                <Button
                  danger
                  tapScale={1}
                  onClick={() =>
                    commit(
                      purgeBatch(data, batch.id),
                      "Files purged",
                      `${formatStorage(batch.bytes)} reclaimed from the local recycle bin.`,
                    )
                  }
                >
                  Purge sample files
                </Button>
              )}
            </footer>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

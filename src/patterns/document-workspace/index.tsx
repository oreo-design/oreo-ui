import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { KnowledgeSearch } from "@/components/knowledge-base";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import {
  DocumentTimeline,
  DocumentPhotoStrip,
  FileChangeCard,
  DocumentAccessRequest,
  DocumentSummary,
  MemberActivity,
  DocumentStorage,
  DocumentEmpty,
  DOCUMENT_ACTIONS,
  type DocumentAction,
  type AccessDecision,
} from "@/components/document-activity";
import {
  events as initialEvents,
  photos,
  storage,
  type WorkspaceEvent,
} from "./data";
import { cn } from "@/lib/cn";
import "./workspace.css";

export function DocumentWorkspace({
  dark,
  onToggleTheme,
}: {
  dark: boolean;
  onToggleTheme: () => void;
}) {
  const [tab, setTab] = useState<"Activity" | "Files">("Activity");
  const [action, setAction] = useState<DocumentAction | "All activity">(
    "All activity",
  );
  const [folder, setFolder] = useState("Documents");
  const [query, setQuery] = useState("");
  const [days, setDays] = useState(7);
  const [decision, setDecision] = useState<AccessDecision>("pending");
  const [events, setEvents] = useState(initialEvents);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<{
    title: string;
    photo?: number;
  } | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    if (preview && dialog.current && !dialog.current.open)
      dialog.current.showModal();
  }, [preview]);
  const open = (title: string, photo?: number) => {
    trigger.current = document.activeElement as HTMLElement;
    setPreview({ title, photo });
  };
  const close = () => {
    dialog.current?.close();
    setPreview(null);
    trigger.current?.focus();
  };
  const reset = () => {
    setQuery("");
    setAction("All activity");
    setFolder("Documents");
    setDays(7);
  };
  const scoped = events.filter(
    (event) =>
      event.daysAgo < days &&
      (folder === "Documents" ||
        folder === "All properties" ||
        event.folder === folder ||
        event.location === folder),
  );
  const filtered = scoped.filter(
    (event) =>
      (tab === "Files"
        ? event.action !== "Access" && event.action !== "Comments"
        : action === "All activity" || event.action === action) &&
      `${event.actor} ${event.target} ${event.location}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const metrics = ["Uploads", "Edits", "Shares", "Access"].map((label) => ({
    label: label === "Access" ? "Access requests" : label,
    value: scoped.filter((event) => event.action === label).length,
    change:
      label === "Access" && scoped.some((event) => event.id === "access")
        ? decision === "pending"
          ? "1 pending"
          : decision
        : undefined,
  }));
  const members = [...new Set(scoped.map((event) => event.actor))].map(
    (name) => ({
      name,
      count: scoped.filter((event) => event.actor === name).length,
    }),
  );
  const selectFolder = (value: string) => {
    setFolder(value);
    setQuery("");
  };
  const navItem = (name: string, icon: IconName, locked = false) => (
    <button
      key={name}
      type="button"
      onClick={() => selectFolder(name)}
      aria-current={folder === name ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left text-sm",
        folder === name
          ? "bg-state-press text-text-primary"
          : "text-text-secondary hover:bg-state-hover",
      )}
    >
      <Icon name={icon} size="sm" />
      <span className="flex-1">{name}</span>
      {locked && <Icon name="lock" size="sm" />}
    </button>
  );
  return (
    <div className="document-workspace overflow-hidden rounded-card-medium border border-border-subtle bg-bg-base text-text-primary">
      <aside className="document-sidebar bg-bg-elevated p-3">
        <div className="mb-5 flex items-center gap-3 rounded-card-small bg-bg-surface p-3">
          <span className="flex size-9 items-center justify-center rounded-control bg-bg-inverse text-text-on-inverse">
            <Icon name="folder" />
          </span>
          <div>
            <p className="text-sm font-semibold">Oreo Homes</p>
            <p className="mt-0.5 text-xs text-text-secondary">Property team</p>
          </div>
        </div>
        <nav aria-label="Property workspace">
          {navItem("All properties", "book-open")}
          {navItem("Documents", "folder")}
          <p className="mb-2 mt-7 px-3 text-xs font-semibold text-text-secondary">
            Folders
          </p>
          {navItem("Leases", "lock", true)}
          {navItem("Finance", "chart-line", true)}
          {navItem("Insurance", "checks", true)}
          {navItem("Maintenance", "gear")}
          {["Al Nakheel Residences", "Riyadh Gardens", "Jeddah Waterfront"].map(
            (name) => navItem(name, "hash"),
          )}
        </nav>
        <p className="mt-8 px-3 text-xs leading-5 text-text-tertiary">
          Local demo · Changes reset on reload.
        </p>
      </aside>
      <div className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-3 p-5 sm:px-7">
          <div className="w-full sm:max-w-72">
            <KnowledgeSearch
              value={query}
              onChange={setQuery}
              inputRef={search}
              placeholder="Search documents"
              label="Search documents"
            />
          </div>
          <div className="flex items-center gap-2">
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={onToggleTheme}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
            <Button
              tapScale={1}
              leadingIcon={<Icon name="arrow-up" size="sm" />}
              onClick={() => input.current?.click()}
            >
              Upload
            </Button>
          </div>
          <input
            ref={input}
            type="file"
            hidden
            multiple
            accept="image/*,.pdf,.txt,.doc,.docx"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              if (!files.length) return;
              if (files.some((file) => file.size > 10 * 1024 * 1024)) {
                setError("Choose files smaller than 10 MB, then try again.");
                setNotice("");
                return;
              }
              const additions: WorkspaceEvent[] = files.map((file) => ({
                id: crypto.randomUUID(),
                actor: "You",
                action: "Uploads",
                verb: "added",
                target: file.name,
                location: ["Documents", "All properties"].includes(folder)
                  ? "All properties"
                  : folder,
                time: "Just now",
                dateTime: new Date().toISOString(),
                daysAgo: 0,
                folder: [
                  "Leases",
                  "Finance",
                  "Insurance",
                  "Maintenance",
                ].includes(folder)
                  ? folder
                  : "Maintenance",
                detail: "upload",
              }));
              setEvents((previous) => [...additions, ...previous]);
              setAction("All activity");
              setQuery("");
              setError("");
              setNotice(
                `${files.length} file${files.length === 1 ? "" : "s"} added to this local demo. Nothing was uploaded to a server.`,
              );
            }}
          />
        </header>
        <main className="px-5 pb-8 pt-5 sm:px-8 xl:px-14">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-full bg-bg-surface p-3 text-text-secondary">
              <Icon name="folder" />
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">{folder}</h1>
          </div>
          <div
            className="mb-6 flex gap-2"
            role="group"
            aria-label="Document view"
          >
            {(["Files", "Activity"] as const).map((value) => (
              <Button
                key={value}
                type="secondary"
                tapScale={1}
                aria-pressed={tab === value}
                className={cn(
                  "rounded-full",
                  tab === value &&
                    "bg-status-progress-subtle text-status-progress",
                )}
                leadingIcon={
                  <Icon
                    name={value === "Files" ? "copy" : "chart-line"}
                    size="sm"
                  />
                }
                onClick={() => setTab(value)}
              >
                {value}
              </Button>
            ))}
          </div>
          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Activity filters"
            >
              {tab === "Activity" &&
                (["All activity", ...DOCUMENT_ACTIONS] as const).map(
                  (value) => (
                    <Button
                      key={value}
                      size="sm"
                      type="tertiary"
                      tapScale={1}
                      className={cn(
                        "rounded-full border border-border-default text-text-secondary",
                        action === value &&
                          "border-transparent bg-state-press text-text-primary",
                      )}
                      aria-pressed={action === value}
                      onClick={() => setAction(value)}
                    >
                      {value}
                    </Button>
                  ),
                )}
            </div>
            <Menu>
              <MenuTrigger
                render={
                  <Button
                    type="secondary"
                    tapScale={1}
                    trailingIcon={<Icon name="chevron-down" size="sm" />}
                  />
                }
              >
                {days === 1 ? "Today" : `Last ${days} days`}
              </MenuTrigger>
              <MenuPopup align="end">
                {[1, 7, 30].map((value) => (
                  <MenuItem
                    key={value}
                    selected={days === value}
                    onClick={() => setDays(value)}
                  >
                    {value === 1 ? "Today" : `Last ${value} days`}
                  </MenuItem>
                ))}
              </MenuPopup>
            </Menu>
          </div>
          {error && (
            <p
              role="alert"
              className="mb-5 flex flex-wrap items-center gap-3 rounded-control bg-status-error/10 p-3 text-sm text-status-error"
            >
              {error}
              <Button
                type="secondary"
                tapScale={1}
                onClick={() => input.current?.click()}
              >
                Try again
              </Button>
            </p>
          )}
          <p
            role="status"
            className={notice ? "mb-5 text-sm text-text-secondary" : "sr-only"}
          >
            {notice}
          </p>
          <div className="document-content">
            <div className="min-w-0">
              {tab === "Activity" ? (
                <DocumentTimeline
                  label={days === 1 ? "Today" : "Recent activity"}
                  events={filtered.map((event) => ({
                    ...event,
                    detail:
                      event.detail === "photos" ? (
                        <DocumentPhotoStrip
                          photos={photos}
                          onOpen={(index) =>
                            open("Tower B snag reports", index)
                          }
                        />
                      ) : event.detail === "edit" ? (
                        <FileChangeCard
                          description="Changed clause 7.2 · Service charge"
                          version="v4"
                          onOpen={() => open(event.target)}
                        />
                      ) : event.detail === "share" ? (
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-status-progress-subtle px-2 py-1 text-status-progress">
                            Can view
                          </span>
                          <span className="rounded-full bg-state-press px-2 py-1 text-text-secondary">
                            Expires 30 Nov
                          </span>
                        </div>
                      ) : event.detail === "access" ? (
                        <DocumentAccessRequest
                          status={decision}
                          onDecision={setDecision}
                          onUndo={() => setDecision("pending")}
                        />
                      ) : event.detail === "comment" ? (
                        <p className="rounded-card-small bg-bg-elevated p-3 text-sm text-text-secondary">
                          The renewal dates are confirmed. Ready for review.
                        </p>
                      ) : (
                        <FileChangeCard
                          description={event.target}
                          version="v1"
                          onOpen={() => open(event.target)}
                        />
                      ),
                  }))}
                  empty={<DocumentEmpty onReset={reset} />}
                />
              ) : (
                <section aria-label="Files">
                  {filtered.length ? (
                    <ul className="divide-y divide-border-subtle">
                      {filtered.map((event) => (
                        <li key={event.id}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 py-5 text-left"
                            onClick={() =>
                              open(
                                event.target,
                                event.detail === "photos" ? 0 : undefined,
                              )
                            }
                          >
                            <span className="rounded-control bg-bg-surface p-3 text-text-secondary">
                              <Icon name="scan-text" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block break-words text-sm font-medium">
                                {event.target}
                              </span>
                              <span className="mt-1 block text-xs text-text-secondary">
                                {event.actor} · {event.location}
                              </span>
                            </span>
                            <Icon
                              name="chevron-right"
                              size="sm"
                              className="text-text-secondary"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <DocumentEmpty title="No matching files" onReset={reset} />
                  )}
                </section>
              )}
            </div>
            <aside className="space-y-4" aria-label="Document insights">
              <DocumentSummary
                metrics={metrics}
                period={days === 1 ? "Today" : `Last ${days} days`}
              />
              <MemberActivity members={members} />
              <DocumentStorage capacity={20} segments={storage} />
              <p className="px-1 text-xs leading-5 text-text-tertiary">
                Insights reflect the selected folder and period. Storage is
                sample data.
              </p>
            </aside>
          </div>
        </main>
      </div>
      {preview && (
        <dialog
          ref={dialog}
          className="document-dialog m-auto w-full max-w-2xl rounded-card-medium border border-border-default bg-bg-base p-5 text-text-primary shadow-xl"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          aria-labelledby="document-preview-title"
        >
          <header className="mb-5 flex items-center justify-between gap-4">
            <h2
              id="document-preview-title"
              className="min-w-0 break-words font-medium"
            >
              {preview.title}
            </h2>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label="Close preview"
              icon={<Icon name="x" />}
              onClick={close}
            />
          </header>
          {preview.photo !== undefined ? (
            <>
              <img
                src={photos[preview.photo].src}
                alt={photos[preview.photo].alt}
                className="max-h-96 w-full rounded-card-small object-contain"
              />
              <div className="mt-4 flex items-center justify-between">
                <Button
                  type="secondary"
                  tapScale={1}
                  disabled={preview.photo === 0}
                  onClick={() =>
                    setPreview({ ...preview, photo: preview.photo! - 1 })
                  }
                >
                  Previous
                </Button>
                <span className="text-sm text-text-secondary">
                  {preview.photo + 1} / {photos.length}
                </span>
                <Button
                  type="secondary"
                  tapScale={1}
                  disabled={preview.photo === photos.length - 1}
                  onClick={() =>
                    setPreview({ ...preview, photo: preview.photo! + 1 })
                  }
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-card-small bg-bg-surface p-6">
              <p className="text-sm leading-6">
                {preview.title === "lease-template-2027.pdf"
                  ? "Version 4 · Clause 7.2 updated to clarify annual service charges and the payment schedule."
                  : "This is a local document record. File contents are not stored or sent to a server."}
              </p>
            </div>
          )}
        </dialog>
      )}
    </div>
  );
}

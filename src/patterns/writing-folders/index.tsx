import { useThemeMode } from "@/lib/theme/useThemeMode";
import { useRef, useState, type FormEvent } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { DocumentEmpty } from "@/components/document-activity";
import {
  FolderCollection,
  FolderCreateButton,
  folderRows,
  saveFolder,
  saveDocument,
  removeFolder,
  type WritingLibrary,
  type WritingFolder,
  type WritingDocument,
  type FolderVisibility,
} from "@/components/writing-folders";
import { makeWritingLibrary } from "./data";
import "./workspace.css";
type Editor =
  | { kind: "folder"; value: WritingFolder; fresh: boolean }
  | { kind: "document"; value: WritingDocument; fresh: boolean }
  | { kind: "delete"; value: WritingFolder };
export function WritingFoldersPage() {
  const [library, setLibrary] = useState(makeWritingLibrary),
    [undo, setUndo] = useState<WritingLibrary | null>(null),
    [section, setSection] = useState("folders"),
    [query, setQuery] = useState(""),
    [visibility, setVisibility] = useState("All visibility"),
    [sort, setSort] = useState("recent"),
    [view, setView] = useState<"list" | "grid">("list"),
    [dark, setDark] = useThemeMode(false),
    [state, setState] = useState("ready"),
    [editor, setEditor] = useState<Editor | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    trigger = useRef<HTMLElement | null>(null);
  const selected = library.folders.find((f) => f.id === section),
    isFolders = section === "folders",
    title = isFolders ? "Folders" : (selected?.name ?? "Unorganized");
  const documents = library.documents
    .filter(
      (d) =>
        d.folderId === (selected?.id ?? null) &&
        d.title
          .toLocaleLowerCase("en")
          .includes(query.trim().toLocaleLowerCase("en")),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title, "en")
        : b.modified.localeCompare(a.modified),
    );
  const rows = folderRows(library, query, visibility, sort);
  function navigate(id: string) {
    setSection(id);
    setQuery("");
    setVisibility("All visibility");
    setState("ready");
  }
  function open(next: Editor) {
    trigger.current = document.activeElement as HTMLElement;
    setError("");
    setEditor(next);
  }
  function newFolder() {
    open({
      kind: "folder",
      fresh: true,
      value: {
        id: crypto.randomUUID(),
        name: "",
        visibility: "Private",
        modified: new Date().toISOString(),
      },
    });
  }
  function newDocument() {
    open({
      kind: "document",
      fresh: true,
      value: {
        id: crypto.randomUUID(),
        title: "",
        body: "",
        folderId: selected?.id ?? null,
        modified: new Date().toISOString(),
      },
    });
  }
  function reset() {
    setQuery("");
    setVisibility("All visibility");
    setState("ready");
  }
  function save(e: FormEvent) {
    e.preventDefault();
    if (!editor) return;
    try {
      const now = new Date().toISOString();
      const next =
        editor.kind === "folder"
          ? saveFolder(library, { ...editor.value, modified: now })
          : editor.kind === "document"
            ? saveDocument(library, { ...editor.value, modified: now })
            : removeFolder(library, editor.value.id, now);
      setUndo(library);
      setLibrary(next);
      setNotice(
        editor.kind === "delete"
          ? "Folder deleted. Its documents are now Unorganized."
          : editor.kind === "folder"
            ? "Folder saved."
            : "Document saved.",
      );
      if (editor.kind === "delete" && section === editor.value.id)
        navigate("folders");
      if (editor.kind === "folder") {
        navigate("folders");
      }
      setEditor(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save. Try again.");
    }
  }
  function exportLibrary() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(library, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "oreo-writing-library.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice("Exported all folders and documents.");
  }
  return (
    <div ref={root} className={`wf-workspace ${dark ? "theme-dark" : ""}`}>
      <aside className="wf-sidebar">
        <a className="wf-brand" href="/">
          o.<span>Oreo Writer</span>
        </a>
        <div className="wf-account">
          <Avatar name="Alex Morgan" size="sm" />
          <span>
            Personal workspace<small>A place for your words</small>
          </span>
        </div>
        <Button
          type="secondary"
          tapScale={1}
          onClick={newDocument}
          leadingIcon={<Icon name="plus" />}
        >
          Create new
        </Button>
        <nav aria-label="Writing library">
          <button
            aria-current={isFolders ? "page" : undefined}
            onClick={() => navigate("folders")}
          >
            <Icon name="folder" />
            Folders<span>{library.folders.length}</span>
          </button>
          <button
            aria-current={section === "unorganized" ? "page" : undefined}
            onClick={() => navigate("unorganized")}
          >
            <Icon name="scan-text" />
            Unorganized
            <span>
              {library.documents.filter((d) => d.folderId === null).length}
            </span>
          </button>
        </nav>
        <div className="wf-rail-title">
          YOUR FOLDERS
          <IconButton
            type="tertiary"
            tapScale={1}
            icon={<Icon name="plus" />}
            aria-label="Create folder in sidebar"
            onClick={newFolder}
          />
        </div>
        <nav aria-label="Your folders">
          {library.folders.map((f) => (
            <button
              key={f.id}
              aria-current={section === f.id ? "page" : undefined}
              onClick={() => navigate(f.id)}
            >
              <Icon name="folder" />
              <b>{f.name}</b>
              <span>
                {library.documents.filter((d) => d.folderId === f.id).length}
              </span>
            </button>
          ))}
        </nav>
        {!library.folders.length && (
          <p className="wf-rail-hint">A little order for your next big idea.</p>
        )}
        <div className="wf-sidebar-bottom">
          <p>
            {library.documents.length} documents · {library.folders.length}{" "}
            folders
          </p>
          <a href="/folder-empty-state">Explore components ↗</a>
          <a href="/changelog">What’s new ↗</a>
        </div>
      </aside>
      <div className="wf-main">
        <header className="wf-topbar">
          <span>
            My workspace <span>/</span> Writing
          </span>
          <div>
            <Button type="tertiary" tapScale={1} onClick={exportLibrary}>
              Export library
            </Button>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              icon={<Icon name={dark ? "sun" : "moon"} />}
              onClick={() => setDark(!dark)}
            />
            <Avatar name="Alex Morgan" size="sm" />
          </div>
        </header>
        <main>
          <header className="wf-title">
            <div>
              <p>YOUR WRITING, TOGETHER</p>
              <h1 ref={heading} tabIndex={-1}>
                {title}
              </h1>
              <span>
                {isFolders
                  ? "Make space for your ideas. Give every story a home."
                  : selected
                    ? `${documents.length} ${query.trim() ? "matching " : ""}${documents.length === 1 ? "document" : "documents"} · ${selected.visibility} sample visibility`
                    : "Loose pages, ready for their next chapter."}
              </span>
            </div>
            {isFolders ? (
              <FolderCreateButton onClick={newFolder} />
            ) : (
              <Button
                type="primary"
                tapScale={1}
                onClick={newDocument}
                leadingIcon={<Icon name="plus" />}
              >
                New document
              </Button>
            )}
          </header>
          <div className="wf-toolbar">
            <label className="wf-search">
              <Icon name="search" />
              <input
                aria-label={isFolders ? "Search folders" : "Search documents"}
                placeholder={
                  isFolders ? "Search folders…" : "Search documents…"
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div>
              {isFolders && (
                <>
                  <div
                    className="wf-view"
                    role="group"
                    aria-label="Folder view"
                  >
                    <IconButton
                      type={view === "list" ? "secondary" : "tertiary"}
                      tapScale={1}
                      icon={<Icon name="list" />}
                      aria-label="List view"
                      aria-pressed={view === "list"}
                      onClick={() => setView("list")}
                    />
                    <IconButton
                      type={view === "grid" ? "secondary" : "tertiary"}
                      tapScale={1}
                      icon={<Icon name="columns" />}
                      aria-label="Grid view"
                      aria-pressed={view === "grid"}
                      onClick={() => setView("grid")}
                    />
                  </div>
                  <select
                    aria-label="Folder visibility"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    {["All visibility", "Private", "Workspace"].map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </>
              )}
              <select
                aria-label="Sort by"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recent">Last modified</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>
          {isFolders ? (
            <FolderCollection
              folders={rows}
              view={view}
              loading={state === "loading"}
              error={
                state === "error"
                  ? "The sample library could not be loaded. Your local changes are preserved."
                  : undefined
              }
              filtered={!!query.trim() || visibility !== "All visibility"}
              onReset={reset}
              onCreate={newFolder}
              onOpen={(f) => navigate(f.id)}
              onRename={(f) => open({ kind: "folder", value: f, fresh: false })}
              onDelete={(f) => open({ kind: "delete", value: f })}
            />
          ) : (
            <section className="wf-documents" aria-label={`${title} documents`}>
              {selected && (
                <header>
                  <Button
                    type="tertiary"
                    tapScale={1}
                    onClick={() => navigate("folders")}
                    leadingIcon={<Icon name="chevron-left" />}
                  >
                    All folders
                  </Button>
                  <Button
                    type="tertiary"
                    tapScale={1}
                    onClick={() =>
                      open({ kind: "folder", value: selected, fresh: false })
                    }
                  >
                    Rename folder
                  </Button>
                </header>
              )}
              {documents.length ? (
                <ul>
                  {documents.map((d) => (
                    <li key={d.id}>
                      <Icon name="scan-text" />
                      <button
                        onClick={() =>
                          open({ kind: "document", value: d, fresh: false })
                        }
                      >
                        <strong>{d.title}</strong>
                        <p>{d.body || "A blank page, ready to begin."}</p>
                      </button>
                      <time dateTime={d.modified}>
                        {new Date(d.modified).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                      </time>
                      <Icon name="chevron-right" />
                    </li>
                  ))}
                </ul>
              ) : (
                <DocumentEmpty
                  title={
                    query.trim()
                      ? "No matching documents"
                      : "Room for your first draft"
                  }
                  description={
                    query.trim()
                      ? "Try another title or clear your search."
                      : "Create a document here, or move an existing one from Unorganized."
                  }
                  onReset={query.trim() ? reset : newDocument}
                  actionLabel={query.trim() ? "Clear filters" : "New document"}
                />
              )}
            </section>
          )}
          <div className="wf-notice" role="status">
            <span>{notice}</span>
            {undo && (
              <Button
                type="tertiary"
                tapScale={1}
                onClick={() => {
                  setLibrary(undo);
                  setUndo(null);
                  navigate("folders");
                  setNotice("Last change undone.");
                }}
              >
                Undo last change
              </Button>
            )}
          </div>
          <footer className="wf-footer">
            <span>
              Local sample library · Changes reset on reload.
              <br />
              Visibility labels are sample metadata.
            </span>
            <a
              href="https://x.com/goutham/status/2110710268540117089"
              target="_blank"
              rel="noreferrer"
            >
              Reference by Goutham ↗
            </a>
            {isFolders && (
              <label>
                Preview state{" "}
                <select
                  aria-label="Preview state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {["ready", "loading", "error"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
            )}
          </footer>
        </main>
      </div>
      <Dialog.Root
        open={!!editor}
        onOpenChange={(v) => {
          if (!v) setEditor(null);
        }}
      >
        <Dialog.Portal container={root.current}>
          <Dialog.Backdrop className="wf-backdrop" />
          <Dialog.Popup
            className="wf-dialog"
            finalFocus={() =>
              trigger.current?.isConnected ? trigger.current : heading.current
            }
          >
            <form onSubmit={save}>
              <header>
                <div>
                  <Dialog.Title>
                    {editor?.kind === "delete"
                      ? "Delete folder?"
                      : editor?.kind === "folder"
                        ? editor.fresh
                          ? "New folder"
                          : "Rename folder"
                        : editor?.fresh
                          ? "New document"
                          : "Edit document"}
                  </Dialog.Title>
                  <Dialog.Description>
                    {editor?.kind === "delete"
                      ? "Documents inside will move to Unorganized. You can undo this change."
                      : "Saved in this local sample library until you reload."}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      tapScale={1}
                      icon={<Icon name="x" />}
                      aria-label="Close editor"
                    />
                  }
                />
              </header>
              <div className="wf-dialog-body">
                {editor?.kind === "folder" ? (
                  <>
                    <label>
                      Folder name
                      <input
                        autoFocus
                        maxLength={80}
                        value={editor.value.name}
                        aria-describedby={error ? "wf-error" : undefined}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            value: { ...editor.value, name: e.target.value },
                          })
                        }
                      />
                    </label>
                    <label>
                      Visibility
                      <select
                        value={editor.value.visibility}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            value: {
                              ...editor.value,
                              visibility: e.target.value as FolderVisibility,
                            },
                          })
                        }
                      >
                        <option>Private</option>
                        <option>Workspace</option>
                      </select>
                    </label>
                    <p className="wf-help">
                      A sample label for organizing your folders; this does not
                      change sharing permissions.
                    </p>
                  </>
                ) : editor?.kind === "document" ? (
                  <>
                    <label>
                      Document title
                      <input
                        autoFocus
                        maxLength={120}
                        value={editor.value.title}
                        aria-describedby={error ? "wf-error" : undefined}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            value: { ...editor.value, title: e.target.value },
                          })
                        }
                      />
                    </label>
                    <label>
                      Folder
                      <select
                        value={editor.value.folderId ?? ""}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            value: {
                              ...editor.value,
                              folderId: e.target.value || null,
                            },
                          })
                        }
                      >
                        <option value="">Unorganized</option>
                        {library.folders.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Writing
                      <textarea
                        rows={8}
                        maxLength={20000}
                        value={editor.value.body}
                        onChange={(e) =>
                          setEditor({
                            ...editor,
                            value: { ...editor.value, body: e.target.value },
                          })
                        }
                      />
                    </label>
                  </>
                ) : (
                  <p className="wf-delete-name">{editor?.value.name}</p>
                )}
                {error && (
                  <p role="alert" id="wf-error">
                    {error}
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
                <Button
                  render={<button type="submit" />}
                  type="primary"
                  tapScale={1}
                >
                  {editor?.kind === "delete" ? "Delete folder" : "Save"}
                </Button>
              </footer>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

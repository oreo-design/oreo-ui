import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import {
  FolderCard,
  FolderTree,
  KnowledgeSearch,
  KnowledgeFileTable,
  WorkspaceSwitcher,
  type KnowledgeFile,
  type KnowledgeFolder,
} from "@/components/knowledge-base";
import {
  files,
  studioFiles,
  folders,
  findFolder,
  descendantIds,
  workspaces,
} from "./data";
import "./knowledge-base.css";

export function KnowledgeBase({
  dark = false,
  onToggleTheme,
}: {
  dark?: boolean;
  onToggleTheme?: () => void;
}) {
  const [workspace, setWorkspace] = useState("acme");
  const [active, setActive] = useState("general");
  const [expanded, setExpanded] = useState(["general", "onboarding"]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"none" | "ascending" | "descending">("none");
  const [preview, setPreview] = useState<KnowledgeFile | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const search = useRef<HTMLInputElement>(null);
  const records = workspace === "acme" ? files : studioFiles;
  const current = findFolder(active)!;
  const normalized = query.trim().toLowerCase();
  const count = (id: string) =>
    records.filter((file) => descendantIds(id).includes(file.folderId)).length;
  const counted = (nodes: KnowledgeFolder[]): KnowledgeFolder[] =>
    nodes.map((node) => ({
      ...node,
      count: count(node.id),
      children: node.children && counted(node.children),
    }));
  const selectFolder = (id: string) => {
    setActive(id);
    setQuery("");
    setMobileNav(false);
  };
  const visible = useMemo(
    () =>
      records
        .filter(
          (file) =>
            descendantIds(active).includes(file.folderId) &&
            (!normalized ||
              `${file.name} ${file.author} ${file.summary}`
                .toLowerCase()
                .includes(normalized)),
        )
        .sort((a, b) =>
          sort === "none"
            ? 0
            : (sort === "ascending" ? 1 : -1) * a.name.localeCompare(b.name),
        ),
    [active, normalized, records, sort],
  );
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMobileNav(true);
        requestAnimationFrame(() => search.current?.focus());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const featured = [
    { id: "onboarding", title: "Onboarding", tone: "violet" as const },
    { id: "design", title: "Design System", tone: "blue" as const },
    { id: "documents", title: "Documents", tone: "yellow" as const },
  ];
  const childFolders =
    active === "general"
      ? featured
      : (current.children ?? []).map((folder) => ({
          id: folder.id,
          title: folder.name,
          tone: folder.tone ?? ("violet" as const),
        }));
  return (
    <div className="kb-shell">
      <div className="kb-mobile-bar">
        <span className="text-sm font-medium">
          {workspaces.find((w) => w.id === workspace)?.name}
        </span>
        <Button
          type="secondary"
          size="sm"
          tapScale={1}
          aria-expanded={mobileNav}
          aria-controls="knowledge-sidebar"
          onClick={() => setMobileNav((v) => !v)}
          leadingIcon={<Icon name="list" size="sm" />}
        >
          Browse
        </Button>
      </div>
      <aside
        id="knowledge-sidebar"
        className="kb-sidebar"
        data-open={mobileNav}
      >
        <WorkspaceSwitcher
          workspaces={workspaces}
          value={workspace}
          onChange={(id) => {
            setWorkspace(id);
            selectFolder("general");
            setPreview(null);
          }}
        />
        <div className="mt-5">
          <KnowledgeSearch
            inputRef={search}
            value={query}
            onChange={setQuery}
            placeholder="Search this folder"
          />
        </div>
        <nav aria-label="Workspace" className="my-6 space-y-1">
          <button
            type="button"
            className="kb-nav-link"
            onClick={() => selectFolder("general")}
          >
            <Icon name="book-open" size="md" />
            Home
          </button>
          <button
            type="button"
            className="kb-nav-link"
            onClick={() => selectFolder("integrations")}
          >
            <Icon name="plug" size="md" />
            Integrations
            <span className="ml-auto text-xs text-text-tertiary">
              {count("integrations")}
            </span>
          </button>
        </nav>
        <div className="mb-3 px-3 text-xs uppercase tracking-wide text-text-tertiary">
          Knowledge base
        </div>
        <FolderTree
          folders={counted(folders)}
          activeId={active}
          expandedIds={expanded}
          onSelect={selectFolder}
          onToggle={(id) =>
            setExpanded((value) =>
              value.includes(id)
                ? value.filter((item) => item !== id)
                : [...value, id],
            )
          }
        />
        <div className="mt-auto flex items-center justify-between gap-3 px-3 pt-10">
          <span className="text-xs text-text-tertiary">
            Local demo workspace
          </span>
          {onToggleTheme && (
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={onToggleTheme}
              icon={<Icon name={dark ? "sun" : "moon"} size="sm" />}
            />
          )}
        </div>
      </aside>
      <main className="kb-main">
        <header className="kb-breadcrumb">
          <button
            type="button"
            onClick={() => selectFolder("general")}
            className="text-text-tertiary"
          >
            Knowledge Base
          </button>
          <Icon name="chevron-right" size="sm" className="text-text-tertiary" />
          <span className="min-w-0 truncate font-medium" aria-current="page">
            {current.name}
          </span>
        </header>
        <div className="kb-content">
          {childFolders.length > 0 && !normalized && (
            <section aria-labelledby="folder-heading">
              <h1
                id="folder-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                Folders
              </h1>
              <div className="kb-folder-grid">
                {childFolders.map((folder, index) => (
                  <FolderCard
                    key={folder.id}
                    title={folder.title}
                    tone={folder.tone}
                    description={`${count(folder.id)} ${count(folder.id) === 1 ? "file" : "files"}${folder.id === "onboarding" ? " · 2 subfolders" : folder.id === "design" ? " · fonts & colors" : ""}`}
                    members={
                      folder.tone === "blue"
                        ? []
                        : [
                            { name: "Maya", color: "purple" },
                            { name: "Alex", color: "mint" },
                          ]
                    }
                    updated={
                      folder.id === "onboarding" ? "Updated 2h" : undefined
                    }
                    className={
                      active === "general" && index === 0
                        ? "kb-folder-featured"
                        : undefined
                    }
                    onClick={() => selectFolder(folder.id)}
                  />
                ))}
              </div>
            </section>
          )}
          <section aria-labelledby="files-heading" className="mt-9">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2
                id="files-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                {normalized ? "Search results" : "Files"}
              </h2>
              <span role="status" className="text-xs text-text-tertiary">
                {visible.length} {visible.length === 1 ? "file" : "files"}
                {normalized ? ` matching “${query}”` : ""}
              </span>
            </div>
            <KnowledgeFileTable
              files={visible}
              sort={sort}
              onSort={() =>
                setSort((s) => (s === "ascending" ? "descending" : "ascending"))
              }
              onOpen={setPreview}
              empty={
                <div className="space-y-4">
                  <Icon
                    name="folder"
                    size="lg"
                    className="mx-auto text-text-tertiary"
                  />
                  <p>
                    {normalized
                      ? "No files match your search."
                      : "This folder is ready for something new."}
                  </p>
                  <Button
                    type="secondary"
                    tapScale={1}
                    onClick={() =>
                      normalized ? setQuery("") : selectFolder("general")
                    }
                  >
                    {normalized ? "Clear search" : "Back to all files"}
                  </Button>
                </div>
              }
            />
          </section>
        </div>
      </main>
      <Dialog.Root
        open={preview != null}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-overlay-subtle" />
          <Dialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Popup className="w-full max-w-lg rounded-card-medium border border-border-subtle bg-bg-base p-6 text-text-primary shadow-xl outline-none">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-2 text-xs text-text-tertiary">
                    FILE PREVIEW · {preview?.size}
                  </p>
                  <Dialog.Title className="break-all text-xl font-semibold">
                    {preview?.name}
                  </Dialog.Title>
                </div>
                <Dialog.Close
                  render={
                    <IconButton
                      type="tertiary"
                      aria-label="Close preview"
                      tapScale={1}
                      icon={<Icon name="x" size="sm" />}
                    />
                  }
                />
              </div>
              <Dialog.Description className="mt-5 text-sm leading-7 text-text-secondary">
                {preview?.summary}
              </Dialog.Description>
              {preview && (
                <div className="mt-6 flex items-center gap-3 border-t border-border-subtle pt-5">
                  <Avatar
                    name={preview.authorName}
                    color={preview.color}
                    size="sm"
                  />
                  <span className="break-all text-sm">{preview.author}</span>
                </div>
              )}
              <p className="mt-5 text-xs text-text-tertiary">
                Example summary. Original files are not connected to this
                template.
              </p>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

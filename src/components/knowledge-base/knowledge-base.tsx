import { useId, type ComponentProps, type ReactNode, type Ref } from "react";
import { Avatar, AvatarGroup, type AvatarColor } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { cn } from "@/lib/cn";
import { FolderArtwork, type FolderTone } from "./folder-artwork";
import "./knowledge-base.css";

export type FolderMember = { name: string; color?: AvatarColor };
export type FolderCardProps = Omit<ComponentProps<"button">, "children"> & {
  title: string;
  description: string;
  tone?: FolderTone;
  members?: FolderMember[];
  updated?: string;
  selected?: boolean;
};
export function FolderCard({
  title,
  description,
  tone = "violet",
  members = [],
  updated,
  selected,
  className,
  ...props
}: FolderCardProps) {
  return (
    <button
      type="button"
      {...props}
      aria-pressed={selected}
      className={cn("kb-folder-card", className)}
    >
      <span className="kb-folder-visual">
        <FolderArtwork tone={tone} />
        <span
          className={cn(
            "kb-folder-meta",
            tone === "yellow" && "kb-folder-meta-top",
          )}
        >
          {members.length > 0 && (
            <AvatarGroup size="xs" max={3}>
              {members.map((member) => (
                <Avatar
                  key={member.name}
                  size="xs"
                  name={member.name.slice(0, 1)}
                  aria-label={member.name}
                  color={member.color}
                />
              ))}
            </AvatarGroup>
          )}
          {updated && <span className="kb-updated">{updated}</span>}
        </span>
      </span>
      <span className="mt-4 block text-lg font-medium tracking-tight">
        {title}
      </span>
      <span className="mt-1 block text-sm text-text-secondary">
        {description}
      </span>
    </button>
  );
}

export type KnowledgeFolder = {
  id: string;
  name: string;
  count?: number;
  tone?: FolderTone;
  children?: KnowledgeFolder[];
};
export function FolderTree({
  folders,
  activeId,
  expandedIds,
  onSelect,
  onToggle,
  label = "Knowledge base",
}: {
  folders: KnowledgeFolder[];
  activeId: string;
  expandedIds: string[];
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  label?: string;
}) {
  const prefix = useId();
  const render = (items: KnowledgeFolder[], nested = false): ReactNode => (
    <ul className={nested ? "kb-tree-children" : "kb-tree"}>
      {items.map((folder) => {
        const hasChildren = Boolean(folder.children?.length),
          open = expandedIds.includes(folder.id);
        return (
          <li key={folder.id}>
            <div className="kb-tree-row" data-active={activeId === folder.id}>
              {hasChildren ? (
                <button
                  type="button"
                  className="kb-tree-toggle"
                  aria-label={`${open ? "Collapse" : "Expand"} ${folder.name}`}
                  aria-expanded={open}
                  aria-controls={`${prefix}-${folder.id}`}
                  onClick={() => onToggle(folder.id)}
                >
                  <Icon
                    name={open ? "chevron-down" : "chevron-right"}
                    size="sm"
                  />
                </button>
              ) : (
                <span className="w-5 shrink-0" />
              )}
              <button
                type="button"
                className="kb-tree-select"
                aria-current={activeId === folder.id ? "page" : undefined}
                onClick={() => onSelect(folder.id)}
              >
                <Icon
                  name="folder"
                  weight="fill"
                  size="sm"
                  className="kb-folder-glyph"
                  data-tone={folder.tone}
                />
                <span className="min-w-0 flex-1 truncate">{folder.name}</span>
                {folder.count != null && (
                  <span className="text-xs text-text-tertiary">
                    {folder.count}
                  </span>
                )}
              </button>
            </div>
            {hasChildren && open && (
              <div id={`${prefix}-${folder.id}`}>
                {render(folder.children!, true)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
  return <nav aria-label={label}>{render(folders)}</nav>;
}

export type KnowledgeWorkspace = {
  id: string;
  name: string;
  initials: string;
  members: number;
};
export function WorkspaceSwitcher({
  workspaces,
  value,
  onChange,
}: {
  workspaces: KnowledgeWorkspace[];
  value: string;
  onChange: (id: string) => void;
}) {
  const current = workspaces.find((w) => w.id === value) ?? workspaces[0];
  if (!current) return null;
  return (
    <Menu>
      <MenuTrigger
        className="kb-workspace-switch"
        aria-label={`Switch workspace, ${current.name}`}
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-card-small bg-bg-inverse text-sm font-semibold text-text-on-inverse">
          {current.initials}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-medium">
            {current.name}
          </span>
          <span className="mt-0.5 block text-xs text-text-secondary">
            {current.members} members
          </span>
        </span>
        <Icon name="chevron-down" size="sm" />
      </MenuTrigger>
      <MenuPopup>
        {workspaces.map((w) => (
          <MenuItem
            key={w.id}
            selected={w.id === value}
            onClick={() => onChange(w.id)}
          >
            {w.name}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  );
}

export function KnowledgeSearch({
  value,
  onChange,
  inputRef,
  placeholder = "Search",
  label = "Search knowledge base",
}: {
  value: string;
  onChange: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
  placeholder?: string;
  label?: string;
}) {
  return (
    <label className="kb-search">
      <Icon name="search" size="sm" />
      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <span
        aria-hidden
        className="rounded-control-tiny border border-border-subtle px-1 text-xs text-text-tertiary"
      >
        ⌘K
      </span>
    </label>
  );
}

export type KnowledgeFile = {
  id: string;
  name: string;
  author: string;
  authorName: string;
  color?: AvatarColor;
  folderId: string;
  summary: string;
  size: string;
};
export function KnowledgeFileTable({
  files,
  onOpen,
  sort,
  onSort,
  empty,
}: {
  files: KnowledgeFile[];
  onOpen: (file: KnowledgeFile) => void;
  sort: "none" | "ascending" | "descending";
  onSort: () => void;
  empty?: ReactNode;
}) {
  return (
    <div className="kb-file-table-wrap">
      <table className="kb-file-table">
        <caption className="sr-only">Knowledge base files</caption>
        <thead>
          <tr>
            <th scope="col" aria-sort={sort}>
              <button
                type="button"
                onClick={onSort}
                className="inline-flex items-center gap-2"
              >
                Name
                <Icon
                  name={sort === "ascending" ? "arrow-up" : "arrow-down"}
                  size="sm"
                  className={sort === "none" ? "opacity-40" : ""}
                />
              </button>
            </th>
            <th scope="col">Added by</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>
                <button
                  type="button"
                  onClick={() => onOpen(file)}
                  className="kb-file-open"
                >
                  <Icon name="file" size="sm" />
                  <span className="break-all">{file.name}</span>
                </button>
              </td>
              <td>
                <span className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    name={file.authorName.slice(0, 1)}
                    aria-label={file.authorName}
                    color={file.color}
                  />
                  <span className="truncate">{file.author}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {files.length === 0 && (
        <div
          className="p-10 text-center text-sm text-text-secondary"
          role="status"
        >
          {empty ?? "No files in this folder yet."}
        </div>
      )}
    </div>
  );
}

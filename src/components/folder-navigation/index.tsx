import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type Ref,
} from "react";
import {
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react";
import { Icon } from "@/components/icon";
import { Menu, MenuTrigger, MenuPopup, MenuItem } from "@/components/menu";
import { StatusView } from "@/components/status-view";
import { easeOut } from "@/lib/motion";
import {
  entryBytes,
  folderPath,
  formatBytes,
  type NavigationEntry,
  type NavigationFolder,
  type NavigationFile,
} from "./model";
import "./folder-navigation.css";
export * from "./model";
type InputMethod = "pointer" | "keyboard";
const method = (e: MouseEvent): InputMethod =>
  e.detail === 0 ? "keyboard" : "pointer";
function Name({
  entry,
  transfer = false,
}: {
  entry: Pick<NavigationEntry, "id" | "name">;
  transfer?: boolean;
}) {
  return (
    <motion.span
      layoutId={transfer ? `name-${entry.id}` : undefined}
      layout={transfer ? "position" : false}
      className="fn-name"
      transition={{ duration: transfer ? 0.24 : 0, ease: easeOut }}
    >
      {entry.name}
    </motion.span>
  );
}
export function FolderNavigationRow({
  entry,
  onOpen,
  disabled = false,
  transfer = false,
  buttonRef,
}: {
  entry: NavigationEntry;
  onOpen: (entry: NavigationEntry, method: InputMethod) => void;
  disabled?: boolean;
  transfer?: boolean;
  buttonRef?: (node: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className="fn-row oreo-state-layer oreo-focus"
      disabled={disabled}
      onClick={(e) => onOpen(entry, method(e))}
      aria-label={`${entry.kind === "folder" ? "Open folder" : "Preview file"}: ${entry.name}`}
    >
      <span
        className="fn-glyph"
        data-tone={entry.kind === "file" ? entry.tone : undefined}
        aria-hidden="true"
      >
        <Icon name={entry.kind === "folder" ? "folder" : "file"} size="lg" />
      </span>
      <Name entry={entry} transfer={transfer && entry.kind === "folder"} />
      <span className="fn-size">{formatBytes(entryBytes(entry))}</span>
      {entry.kind === "folder" && (
        <Icon name="chevron-right" size="sm" className="fn-chevron" />
      )}
    </button>
  );
}
export function FolderPathTrail({
  path,
  onNavigate,
  transfer = false,
  currentRef,
}: {
  path: NavigationFolder[];
  onNavigate: (id: string, method: InputMethod) => void;
  transfer?: boolean;
  currentRef?: Ref<HTMLSpanElement>;
}) {
  const current = path.at(-1);
  if (!current) return null;
  const hidden = path.length > 3 ? path.slice(1, -2) : [];
  const shown = path.length > 3 ? [path[0], ...path.slice(-2)] : path;
  return (
    <nav aria-label="Folder path" className="fn-trail">
      <ol>
        {shown.map((folder, i) => (
          <li key={folder.id}>
            {i === 1 && hidden.length > 0 && (
              <>
                <Icon name="chevron-right" size="sm" className="fn-separator" />
                <Menu>
                  <MenuTrigger
                    className="fn-overflow oreo-state-layer oreo-focus"
                    aria-label="Show parent folders"
                  >
                    <Icon name="ellipsis" size="sm" />
                  </MenuTrigger>
                  <MenuPopup>
                    {hidden.map((p) => (
                      <MenuItem
                        key={p.id}
                        icon={<Icon name="folder" size="sm" />}
                        onClick={(e) => onNavigate(p.id, method(e))}
                      >
                        {p.name}
                      </MenuItem>
                    ))}
                  </MenuPopup>
                </Menu>
              </>
            )}
            {i > 0 && (
              <Icon name="chevron-right" size="sm" className="fn-separator" />
            )}
            {folder.id === current.id ? (
              <span
                className="fn-current"
                tabIndex={-1}
                ref={currentRef}
                aria-current="page"
                aria-label={`Current folder: ${folder.name}`}
              >
                <Name entry={folder} transfer={transfer} />
              </span>
            ) : (
              <button
                type="button"
                className="fn-crumb oreo-state-layer oreo-focus"
                title={folder.name}
                onClick={(e) => onNavigate(folder.id, method(e))}
              >
                {i === 0 && (
                  <span className="fn-workspace-mark" aria-hidden="true">
                    {folder.name.slice(0, 1)}
                  </span>
                )}
                <Name entry={folder} transfer={transfer} />
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export function FolderNavigator({
  root,
  folderId,
  onNavigate,
  onFileOpen,
  query = "",
  onClearQuery,
  motionEnabled = true,
}: {
  root: NavigationFolder;
  folderId: string;
  onNavigate: (id: string) => void;
  onFileOpen?: (file: NavigationFile) => void;
  query?: string;
  onClearQuery?: () => void;
  motionEnabled?: boolean;
}) {
  const group = useId(),
    reduce = useReducedMotion(),
    [keyboard, setKeyboard] = useState(false);
  const previous = useRef(folderId),
    rows = useRef(new Map<string, HTMLButtonElement>()),
    currentRef = useRef<HTMLSpanElement>(null),
    body = useRef<HTMLDivElement>(null);
  const path = folderPath(root, folderId),
    folder = path.at(-1),
    filter = query.trim().toLowerCase(),
    entries =
      folder?.children.filter((e) => e.name.toLowerCase().includes(filter)) ??
      [];
  const transfer = motionEnabled && !reduce && !keyboard;
  const navigate = (id: string, input: InputMethod) => {
    setKeyboard(input === "keyboard");
    onNavigate(id);
  };
  useLayoutEffect(() => {
    if (previous.current === folderId) return;
    const old = previous.current;
    previous.current = folderId;
    body.current?.scrollTo({ top: 0, behavior: "instant" });
    (rows.current.get(old) ?? currentRef.current)?.focus({
      preventScroll: true,
    });
  }, [folderId]);
  const folders = entries.filter((e) => e.kind === "folder").length,
    files = entries.length - folders;
  const count =
    [
      folders ? `${folders} ${folders === 1 ? "folder" : "folders"}` : "",
      files ? `${files} ${files === 1 ? "file" : "files"}` : "",
    ]
      .filter(Boolean)
      .join(" · ") || "0 items";
  return (
    <LayoutGroup id={group}>
      <MotionConfig
        transition={{ duration: transfer ? 0.24 : 0, ease: easeOut }}
      >
        <section
          className="fn-browser oreo-squircle"
          aria-label="Folder navigator"
          onKeyDownCapture={() => setKeyboard(true)}
          onPointerDownCapture={() => setKeyboard(false)}
          onKeyDown={(e) => {
            if (
              e.key === "ArrowLeft" &&
              path.length > 1 &&
              !e.defaultPrevented &&
              e.target instanceof HTMLElement &&
              !e.target.closest("[role=menu]")
            ) {
              e.preventDefault();
              navigate(path[path.length - 2].id, "keyboard");
            }
          }}
        >
          <header className="fn-header">
            <FolderPathTrail
              path={path.length ? path : [root]}
              onNavigate={navigate}
              transfer={transfer}
              currentRef={currentRef}
            />
          </header>
          <div className="fn-body" ref={body}>
            {!folder ? (
              <StatusView
                title="Folder unavailable"
                description="This location is no longer in this workspace."
                actionLabel="Go to workspace"
                onAction={() => navigate(root.id, "keyboard")}
              />
            ) : entries.length ? (
              <motion.ul
                key={folder.id}
                initial={
                  transfer ? { opacity: 0.5, filter: "blur(2px)" } : false
                }
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: transfer ? 0.18 : 0, ease: easeOut }}
                aria-label={`${folder.name} contents`}
              >
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <FolderNavigationRow
                      entry={entry}
                      transfer={transfer}
                      disabled={entry.kind === "file" && !onFileOpen}
                      buttonRef={(node) => {
                        if (node) rows.current.set(entry.id, node);
                        else rows.current.delete(entry.id);
                      }}
                      onOpen={(item, input) => {
                        if (item.kind === "folder") navigate(item.id, input);
                        else onFileOpen?.(item);
                      }}
                    />
                  </li>
                ))}
              </motion.ul>
            ) : (
              <StatusView
                title={filter ? "No matching items" : "This folder is empty"}
                description={
                  filter
                    ? "Try another name or clear your search."
                    : "There are no files or folders in this location."
                }
                actionLabel={
                  filter && onClearQuery
                    ? "Clear search"
                    : path.length > 1
                      ? "Go back"
                      : undefined
                }
                onAction={
                  filter && onClearQuery
                    ? onClearQuery
                    : path.length > 1
                      ? () => navigate(path[path.length - 2].id, "keyboard")
                      : undefined
                }
              />
            )}
          </div>
          <footer className="fn-footer">
            <span aria-live="polite">{count}</span>
            <span>
              {formatBytes(entries.reduce((n, e) => n + entryBytes(e), 0))}
            </span>
          </footer>
        </section>
      </MotionConfig>
    </LayoutGroup>
  );
}

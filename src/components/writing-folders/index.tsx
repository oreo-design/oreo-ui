import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { DocumentEmpty } from "@/components/document-activity";
import { AgentWorkspaceState } from "@/components/automation";
import { Tag } from "@/components/tag";
import type { WritingFolder } from "./model";
import "./folders.css";
export * from "./model";
export function FolderEmptyState({
  onCreate,
  title = "It’s empty here",
  description = "Create a folder to start organizing your writing.",
}: {
  onCreate?: () => void;
  title?: string;
  description?: string;
}) {
  return (
    <div className="wf-empty">
      <div className="wf-ghosts" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Icon name="folder" />
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
      <div className="wf-empty-message">
        <DocumentEmpty
          title={title}
          description={description}
          onReset={onCreate}
          actionLabel="New folder"
        />
      </div>
    </div>
  );
}
export type FolderRow = WritingFolder & { documentCount: number };
export function FolderCollection({
  folders,
  view = "list",
  loading = false,
  error,
  filtered = false,
  onCreate,
  onReset,
  onOpen,
  onRename,
  onDelete,
}: {
  folders: FolderRow[];
  view?: "list" | "grid";
  loading?: boolean;
  error?: string;
  filtered?: boolean;
  onCreate?: () => void;
  onReset?: () => void;
  onOpen?: (folder: FolderRow) => void;
  onRename?: (folder: FolderRow) => void;
  onDelete?: (folder: FolderRow) => void;
}) {
  if (error)
    return (
      <AgentWorkspaceState
        title="Folders unavailable"
        description={error}
        error
        actionLabel={onReset ? "Try again" : undefined}
        onAction={onReset}
      />
    );
  if (loading && !folders.length)
    return (
      <div className="wf-loading" role="status" aria-label="Loading folders">
        <span className="sr-only">Loading folders</span>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} />
        ))}
      </div>
    );
  const actions = (f: FolderRow) => (
    <div className="wf-row-actions">
      {onRename && (
        <IconButton
          type="tertiary"
          tapScale={1}
          icon={<Icon name="pencil" />}
          aria-label={`Rename ${f.name}`}
          onClick={() => onRename(f)}
        />
      )}
      {onDelete && (
        <IconButton
          type="tertiary"
          tapScale={1}
          icon={<Icon name="trash" />}
          aria-label={`Delete ${f.name}`}
          onClick={() => onDelete(f)}
        />
      )}
    </div>
  );
  const name = (f: FolderRow) =>
    onOpen ? (
      <button className="wf-folder-name" onClick={() => onOpen(f)}>
        <Icon name="folder" />
        <span>{f.name}</span>
      </button>
    ) : (
      <span className="wf-folder-name">
        <Icon name="folder" />
        <span>{f.name}</span>
      </span>
    );
  const date = (f: FolderRow) => (
    <time dateTime={f.modified}>
      {new Date(f.modified).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })}
    </time>
  );
  const empty = filtered ? (
    <DocumentEmpty
      title="No matching folders"
      description="Try another name or clear your filters."
      onReset={onReset}
    />
  ) : (
    <FolderEmptyState onCreate={onCreate} />
  );
  return (
    <div className="wf-collection" aria-busy={loading}>
      {loading && (
        <p role="status" className="p-4 text-xs text-text-secondary">
          Refreshing folders…
        </p>
      )}
      {view === "list" || !folders.length ? (
        <>
          <div
            className="wf-table-scroll"
            role="region"
            aria-label="Folders"
            tabIndex={0}
          >
            <table>
              <caption className="sr-only">Writing folders</caption>
              <thead>
                <tr>
                  <th>Folder name</th>
                  <th>Last modified</th>
                  <th>Documents</th>
                  <th>Visibility</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {folders.map((f) => (
                  <tr key={f.id}>
                    <td>{name(f)}</td>
                    <td>{date(f)}</td>
                    <td>{f.documentCount}</td>
                    <td>
                      <Tag size="sm">{f.visibility}</Tag>
                    </td>
                    <td>{actions(f)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!folders.length && empty}
        </>
      ) : (
        <ul className="wf-grid">
          {folders.map((f) => (
            <li key={f.id}>
              {name(f)}
              <p>
                {f.documentCount}{" "}
                {f.documentCount === 1 ? "document" : "documents"} · {date(f)}
              </p>
              <footer>
                <Tag size="sm">{f.visibility}</Tag>
                {actions(f)}
              </footer>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
// Keep the default action style aligned with DocumentEmpty in document workspaces.
export const FolderCreateButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    type="primary"
    tapScale={1}
    onClick={onClick}
    leadingIcon={<Icon name="plus" />}
  >
    New folder
  </Button>
);

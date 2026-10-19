import { useEffect, useRef, type ReactNode } from "react";
import { Tag } from "@/components/tag";
import { Avatar } from "@/components/avatar";
import { Icon, type IconName } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import {
  type Workflow,
  type WorkflowStatus,
  toggleVisibleSelection,
} from "./model";
import "./workflow-table.css";
export * from "./model";
export function WorkflowStatusBadge({ status }: { status: WorkflowStatus }) {
  const icon: IconName =
    status === "Live"
      ? "check"
      : status === "Degraded" || status === "Failing"
        ? "warning-circle"
        : status === "Archived"
          ? "folder"
          : "circle-dashed";
  return (
    <Tag
      color={
        status === "Live"
          ? "mint"
          : status === "Degraded"
            ? "orange"
            : status === "Failing"
              ? "pink"
              : "default"
      }
    >
      <span className="workflow-status">
        <Icon name={icon} size="sm" />
        {status}
      </span>
    </Tag>
  );
}
export function WorkflowRunBars({
  values,
  total,
  failing = false,
}: {
  values: number[];
  total: number;
  failing?: boolean;
}) {
  const max = Math.max(1, ...values);
  return (
    <span className="workflow-runs">
      <span
        aria-hidden
        className="workflow-bars"
        data-failing={failing || undefined}
        data-empty={total === 0 || undefined}
      >
        {values.map((v, i) => (
          <i
            key={i}
            style={{ height: `${Math.max(8, (Math.max(0, v) / max) * 100)}%` }}
          />
        ))}
      </span>
      <span>{total.toLocaleString("en-US")}</span>
    </span>
  );
}
function SelectVisible({
  checked,
  mixed,
  onChange,
}: {
  checked: boolean;
  mixed: boolean;
  onChange: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = mixed;
  }, [mixed]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label="Select visible workflows"
      checked={checked}
      onChange={onChange}
    />
  );
}
export function WorkflowTable({
  rows,
  selected = [],
  onSelectionChange,
  onOpen,
  actions,
  loading = false,
  error,
  onReset,
}: {
  rows: Workflow[];
  selected?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onOpen?: (row: Workflow) => void;
  actions?: (row: Workflow) => ReactNode;
  loading?: boolean;
  error?: string;
  onReset?: () => void;
}) {
  if (error)
    return (
      <AgentWorkspaceState
        error
        title="Workflows unavailable"
        description={error}
        actionLabel="Try again"
        onAction={onReset}
      />
    );
  if (loading && !rows.length)
    return (
      <div
        className="workflow-skeleton"
        role="status"
        aria-label="Loading workflows"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <i />
            <span />
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    );
  if (!rows.length)
    return (
      <AgentWorkspaceState
        title="No workflows found"
        description="Try another search or clear the filters to see your workflows."
        actionLabel="Clear filters"
        onAction={onReset}
      />
    );
  const ids = rows.map((r) => r.id),
    selectedCount = ids.filter((id) => selected.includes(id)).length;
  return (
    <div
      className="workflow-table-scroll"
      role="region"
      aria-label="Workflows table"
      tabIndex={0}
      aria-busy={loading}
    >
      <table className="workflow-table">
        <caption className="sr-only">
          Workflow status, seven-day runs and success rate. Last edited dates
          use UTC.
        </caption>
        <thead>
          <tr>
            {onSelectionChange && (
              <th scope="col" className="workflow-check">
                <SelectVisible
                  checked={selectedCount === rows.length}
                  mixed={selectedCount > 0 && selectedCount < rows.length}
                  onChange={() =>
                    onSelectionChange(toggleVisibleSelection(selected, ids))
                  }
                />
              </th>
            )}
            <th scope="col">Workflow</th>
            <th scope="col">Status</th>
            <th scope="col">Runs (7d)</th>
            <th scope="col">Success</th>
            <th scope="col">Owner</th>
            <th scope="col">Last edited</th>
            {actions && (
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              data-selected={selected.includes(row.id) || undefined}
            >
              {onSelectionChange && (
                <td className="workflow-check">
                  <input
                    type="checkbox"
                    aria-label={`Select ${row.name}`}
                    checked={selected.includes(row.id)}
                    onChange={() =>
                      onSelectionChange(
                        selected.includes(row.id)
                          ? selected.filter((id) => id !== row.id)
                          : [...selected, row.id],
                      )
                    }
                  />
                </td>
              )}
              <th scope="row">
                <div className="workflow-identity">
                  <span
                    className="workflow-connector"
                    title={row.connector}
                    aria-label={row.connector}
                  >
                    {row.connector.slice(0, 2).toUpperCase()}
                  </span>
                  <span>
                    {onOpen ? (
                      <button onClick={() => onOpen(row)}>{row.name}</button>
                    ) : (
                      <strong>{row.name}</strong>
                    )}
                    <small>{row.description}</small>
                  </span>
                </div>
              </th>
              <td>
                <WorkflowStatusBadge status={row.status} />
              </td>
              <td>
                <WorkflowRunBars
                  values={row.history}
                  total={row.runs}
                  failing={row.status === "Failing"}
                />
              </td>
              <td
                className="workflow-success"
                data-empty={row.success === null || undefined}
                data-failing={
                  (row.success !== null && row.success < 90) || undefined
                }
              >
                {row.success === null ? "—" : `${row.success.toFixed(1)}%`}
              </td>
              <td>
                <span className="workflow-owner">
                  <Avatar size="sm" name={row.owner} aria-hidden="true" />
                  {row.owner}
                </span>
              </td>
              <td className="workflow-edited">
                v{row.version} ·{" "}
                <time dateTime={row.edited}>
                  {new Date(row.edited).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </td>
              {actions && <td>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

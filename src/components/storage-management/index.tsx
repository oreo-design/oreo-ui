import { useEffect, useId, useRef, type ReactNode } from "react";
import { DocumentStorage } from "@/components/document-activity";
import { Button } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { AgentWorkspaceState } from "@/components/automation";
import { RowShell, RowLabel } from "@/patterns/settings/row-primitives";
import {
  GB,
  formatStorage,
  validModules,
  RETENTION_OPTIONS,
  type StorageModule,
} from "./model";
import "./storage-management.css";
export * from "./model";
export function StorageUsageCard({
  modules,
  capacity,
  recycledBytes = 0,
}: {
  modules: StorageModule[];
  capacity: number;
  recycledBytes?: number;
}) {
  if (
    !validModules(modules) ||
    !Number.isSafeInteger(capacity) ||
    capacity <= 0 ||
    !Number.isSafeInteger(recycledBytes) ||
    recycledBytes < 0 ||
    !Number.isSafeInteger(
      modules.reduce((s, m) => s + m.bytes, 0) + recycledBytes,
    )
  )
    return (
      <AgentWorkspaceState
        error
        title="Storage unavailable"
        description="Provide finite non-negative byte counts and a positive capacity."
      />
    );
  return (
    <DocumentStorage
      title="Storage usage"
      detailed
      capacity={capacity / GB}
      segments={[
        ...modules.map((m) => ({
          label: m.name,
          value: m.bytes / GB,
          tone: m.tone,
        })),
        ...(recycledBytes
          ? [
              {
                label: "Recycle bin",
                value: recycledBytes / GB,
                tone: "video" as const,
              },
            ]
          : []),
      ]}
    />
  );
}
function SelectAll({
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
      aria-label="Select all visible modules"
      checked={checked}
      onChange={onChange}
    />
  );
}
export function StorageModuleTable({
  modules,
  totalUsed,
  selected = [],
  onSelectionChange,
  onDetails,
  empty,
}: {
  modules: StorageModule[];
  totalUsed: number;
  selected?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDetails?: (id: string) => void;
  empty?: ReactNode;
}) {
  if (
    !validModules(modules) ||
    !Number.isSafeInteger(totalUsed) ||
    totalUsed < modules.reduce((s, m) => s + m.bytes, 0)
  )
    return (
      <AgentWorkspaceState
        error
        title="Module data unavailable"
        description="Module totals must fit the occupied storage total."
      />
    );
  if (!modules.length)
    return (
      <>
        {empty ?? (
          <AgentWorkspaceState
            title="No modules found"
            description="Try another module name."
          />
        )}
      </>
    );
  const selectedVisible = modules.filter((m) => selected.includes(m.id)),
    all = selectedVisible.length === modules.length;
  return (
    <div
      className="sm-table-scroll"
      role="region"
      aria-label="Storage by module"
      tabIndex={0}
    >
      <table className="sm-table">
        <thead>
          <tr>
            {onSelectionChange && (
              <th scope="col">
                <SelectAll
                  checked={all}
                  mixed={selectedVisible.length > 0 && !all}
                  onChange={() =>
                    onSelectionChange(
                      all
                        ? selected.filter(
                            (id) => !modules.some((m) => m.id === id),
                          )
                        : [
                            ...new Set([
                              ...selected,
                              ...modules.map((m) => m.id),
                            ]),
                          ],
                    )
                  }
                />
              </th>
            )}
            <th scope="col">Module</th>
            <th scope="col">Storage</th>
            <th scope="col">Files</th>
            <th scope="col">Share of used</th>
            <th scope="col">30d growth</th>
            {onDetails && <th scope="col">Details</th>}
          </tr>
        </thead>
        <tbody>
          {modules.map((m) => (
            <tr key={m.id} data-selected={selected.includes(m.id) || undefined}>
              {onSelectionChange && (
                <td>
                  <input
                    type="checkbox"
                    aria-label={`Select ${m.name}`}
                    checked={selected.includes(m.id)}
                    onChange={() =>
                      onSelectionChange(
                        selected.includes(m.id)
                          ? selected.filter((id) => id !== m.id)
                          : [...selected, m.id],
                      )
                    }
                  />
                </td>
              )}
              <th scope="row">{m.name}</th>
              <td>{formatStorage(m.bytes)}</td>
              <td>{m.files.toLocaleString("en-US")} files</td>
              <td>
                <span className="sm-share">
                  <i data-tone={m.tone} />
                  {totalUsed
                    ? Number(((m.bytes / totalUsed) * 100).toFixed(1))
                    : 0}
                  %
                </span>
              </td>
              <td>
                {m.growth > 0 ? "+" : ""}
                {m.growth.toFixed(1)}%
              </td>
              {onDetails && (
                <td>
                  <Button
                    type="tertiary"
                    size="sm"
                    tapScale={1}
                    aria-label={`View ${m.name}`}
                    onClick={() => onDetails(m.id)}
                  >
                    View
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function RetentionPolicyRow({
  title,
  description,
  icon = "clock-history",
  value,
  onChange,
  disabled = false,
}: {
  title: string;
  description: string;
  icon?: IconName;
  value: number;
  onChange: (days: number) => void;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <RowShell className="sm-retention-row">
      <span className="sm-policy-icon">
        <Icon name={icon} />
      </span>
      <div className="sm-policy-label" id={id}>
        <RowLabel title={title} description={description} />
      </div>
      <select
        aria-describedby={id}
        aria-label={title}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {RETENTION_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </RowShell>
  );
}

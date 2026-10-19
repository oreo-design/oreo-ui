import type { DataSort, FilterValues } from "../data-operations";
export const WORKFLOW_STATUSES = [
  "Live",
  "Degraded",
  "Failing",
  "Draft",
  "Paused",
  "Archived",
] as const;
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];
export type Workflow = {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: string;
  connector: string;
  owner: string;
  folder: string;
  runs: number;
  history: number[];
  success: number | null;
  edited: string;
  version: number;
};
export function workflowRows(
  rows: Workflow[],
  {
    query = "",
    filters = {},
    sort = { key: "edited", direction: "desc" },
    view = "All",
    folder = "",
  }: {
    query?: string;
    filters?: FilterValues;
    sort?: DataSort;
    view?: string;
    folder?: string;
  } = {},
) {
  const needle = query.trim().toLowerCase();
  return rows
    .filter(
      (r) =>
        (view === "All" ? r.status !== "Archived" : r.status === view) &&
        (!folder || r.folder === folder) &&
        (!needle ||
          `${r.name} ${r.description} ${r.owner} ${r.connector}`
            .toLowerCase()
            .includes(needle)) &&
        Object.entries(filters).every(
          ([key, values]) =>
            !values.length || values.includes(String(r[key as keyof Workflow])),
        ),
    )
    .sort((a, b) => {
      const av = a[sort.key as keyof Workflow],
        bv = b[sort.key as keyof Workflow];
      // Missing success metrics always sort last, regardless of direction.
      if (av == null || bv == null)
        return av == null && bv == null
          ? a.id.localeCompare(b.id)
          : av == null
            ? 1
            : -1;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return (
        (sort.direction === "asc" ? cmp : -cmp) || a.id.localeCompare(b.id)
      );
    });
}
export function toggleVisibleSelection(
  selected: string[],
  visibleIds: string[],
) {
  const all =
    visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  return all
    ? selected.filter((id) => !visibleIds.includes(id))
    : [...new Set([...selected, ...visibleIds])];
}
export function workflowCSV(rows: Workflow[]) {
  const cell = (value: unknown) => {
    let s = String(value ?? "");
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return `"${s.replaceAll('"', '""')}"`;
  };
  return [
    [
      "Name",
      "Status",
      "Trigger",
      "Connector",
      "Owner",
      "Folder",
      "Runs (7d)",
      "Success (%)",
    ],
    ...rows.map((r) => [
      r.name,
      r.status,
      r.trigger,
      r.connector,
      r.owner,
      r.folder,
      r.runs,
      r.success,
    ]),
  ]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}

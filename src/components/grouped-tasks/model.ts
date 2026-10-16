import type { TaskStatus, TaskPriority } from "../task-row";
import type { PaletteColor } from "../../lib/palette";
export type TaskMember = { id: string; name: string; color?: PaletteColor };
export type GroupedTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority?: TaskPriority;
  list: string;
  tags: string[];
  due: string;
  assigneeIds: string[];
};
export const TASK_STAGES: TaskStatus[] = [
  "backlog",
  "todo",
  "progress",
  "review",
  "done",
];
export type TaskFilters = {
  query: string;
  priority: string;
  list: string;
  scope: string;
  sort: string;
};
export function filterTasks(
  tasks: GroupedTask[],
  filters: TaskFilters,
  personId: string,
) {
  const q = filters.query.trim().toLowerCase();
  const rank = { High: 0, Medium: 1, Low: 2 };
  return tasks
    .filter(
      (t) =>
        (!q ||
          [t.id, t.title, t.list, ...t.tags]
            .join(" ")
            .toLowerCase()
            .includes(q)) &&
        (filters.priority === "all" ||
          (t.priority ?? "unset") === filters.priority) &&
        (filters.list === "all" || t.list === filters.list) &&
        (filters.scope !== "mine" || t.assigneeIds.includes(personId)) &&
        (filters.scope !== "done" || t.status === "done"),
    )
    .sort((a, b) =>
      filters.sort === "due"
        ? (a.due || "9999").localeCompare(b.due || "9999")
        : filters.sort === "priority"
          ? (a.priority ? rank[a.priority] : 3) -
            (b.priority ? rank[b.priority] : 3)
          : 0,
    );
}
export function formatTaskDate(value: string) {
  if (!value) return "No date";
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime())
    ? "Invalid date"
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(date);
}
/** Apply visible board changes without dropping hidden tasks or secondary assignees. */
export function reconcileTaskCards(
  tasks: GroupedTask[],
  cards: { id: string; title: string; columnId: string; assigneeId?: string }[],
): GroupedTask[] {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const validCards = cards.filter((c) =>
    TASK_STAGES.includes(c.columnId as TaskStatus),
  );
  const ids = new Set(validCards.map((c) => c.id));
  const updates = validCards.map((c) => {
    const old = byId.get(c.id);
    const secondary =
      old?.assigneeIds.filter(
        (id) => id !== old.assigneeIds[0] && id !== c.assigneeId,
      ) ?? [];
    return {
      ...(old ?? { list: "UI Design", tags: [], due: "", assigneeIds: [] }),
      id: c.id,
      title: c.title,
      status: c.columnId as TaskStatus,
      assigneeIds: c.assigneeId ? [c.assigneeId, ...secondary] : [],
    };
  });
  const existing = updates.filter((t) => byId.has(t.id));
  let position = 0;
  return [
    ...tasks.map((t) => (ids.has(t.id) ? (existing[position++] ?? t) : t)),
    ...updates.filter((t) => !byId.has(t.id)),
  ];
}

import type { TaskStatus, TaskPriority } from "@/components/task-row";
import type { KanbanCard } from "@/components/kanban";
export type Subtask = { id: string; title: string; done: boolean };
export type TaskDetails = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  start: string;
  due: string;
  labels: string[];
  repeat: string;
  estimate: string;
  blockedBy: string;
  description: string;
  subtasks: Subtask[];
  comments: { id: string; text: string; at: string }[];
  activity: string[];
};
export function dateError(start: string, due: string) {
  const valid = (value: string) =>
    !value ||
    (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
      Number.isFinite(Date.parse(value + "T00:00:00Z")) &&
      new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value);
  if (!valid(start) || !valid(due)) return "Choose valid dates.";
  return start && due && start > due
    ? "Due date must be on or after the start date."
    : "";
}
export function createTask(
  id: string,
  title: string,
  status: TaskStatus = "todo",
): TaskDetails {
  return {
    id,
    title,
    status,
    priority: "Medium",
    assigneeId: "",
    start: "",
    due: "",
    labels: [],
    repeat: "Does not repeat",
    estimate: "Not estimated",
    blockedBy: "",
    description: "",
    subtasks: [],
    comments: [],
    activity: ["Task created in this local workspace."],
  };
}
/** Applies only the visible board's movement/order; filtered-out records and details survive. */
export function applyTaskBoard(
  tasks: TaskDetails[],
  cards: KanbanCard[],
): TaskDetails[] {
  const ids = new Set(cards.map((c) => c.id));
  const next = cards.map((c) => {
    const old = tasks.find((t) => t.id === c.id);
    return {
      ...(old ?? createTask(c.id, c.title)),
      status: c.columnId as TaskStatus,
      assigneeId: c.assigneeId ?? "",
    };
  });
  let i = 0;
  const result = tasks.map((t) => (ids.has(t.id) ? next[i++] : t));
  return [...result, ...next.slice(i)];
}
export function hasDependencyCycle(
  tasks: TaskDetails[],
  id: string,
  blockedBy: string,
): boolean {
  const seen = new Set([id]);
  let current = blockedBy;
  while (current) {
    if (seen.has(current)) return true;
    seen.add(current);
    current = tasks.find((t) => t.id === current)?.blockedBy ?? "";
  }
  return false;
}

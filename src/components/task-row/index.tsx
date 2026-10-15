import { Avatar, type AvatarProps } from "@/components/avatar";
import { Tag } from "@/components/tag";
import { Icon } from "@/components/icon";
import "./task-row.css";
export type TaskStatus = "backlog" | "todo" | "progress" | "review" | "done";
export type TaskPriority = "Low" | "Medium" | "High";
export const TASK_STATUS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "To do",
  progress: "In progress",
  review: "In review",
  done: "Done",
};
export type TaskRowProps = {
  id: string;
  title: string;
  project?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  due?: string;
  overdue?: boolean;
  person?: { name: string; color?: AvatarProps["color"] };
  onOpen: () => void;
  onComplete: (complete: boolean) => void;
  disabled?: boolean;
};
export function TaskRow({
  id,
  title,
  project,
  status,
  priority = "Medium",
  due,
  overdue = false,
  person,
  onOpen,
  onComplete,
  disabled = false,
}: TaskRowProps) {
  return (
    <div className="oreo-task-row" data-done={status === "done" || undefined}>
      <input
        type="checkbox"
        checked={status === "done"}
        disabled={disabled}
        onChange={(e) => onComplete(e.target.checked)}
        aria-label={`Complete ${title}`}
      />
      <button
        type="button"
        className="tr-title"
        onClick={onOpen}
        disabled={disabled}
      >
        <span>{title}</span>
        <small>
          {id}
          {project && ` · ${project}`}
        </small>
      </button>
      <span className="tr-status">
        <Tag
          color={
            status === "done"
              ? "mint"
              : status === "progress"
                ? "blue"
                : status === "review"
                  ? "purple"
                  : "default"
          }
        >
          {TASK_STATUS[status]}
        </Tag>
      </span>
      <span
        className="tr-priority"
        data-high={priority === "High" || undefined}
        aria-label={`${priority} priority`}
      >
        <Icon name="chart-bar" size="sm" />
        <span>{priority}</span>
      </span>
      <span
        className="tr-due"
        data-overdue={(overdue && status !== "done") || undefined}
      >
        {due ?? "No date"}
      </span>
      {person ? (
        <Avatar name={person.name} color={person.color} size="xs" />
      ) : (
        <span className="tr-unassigned" aria-label="Unassigned">
          <Icon name="users" size="sm" />
        </span>
      )}
    </div>
  );
}

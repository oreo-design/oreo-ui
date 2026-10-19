import { useId, type ReactNode } from "react";
import { Collapsible } from "@base-ui-components/react/collapsible";
import { Avatar, AvatarGroup } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { IconButton } from "@/components/button";
import { Tag } from "@/components/tag";
import { AgentWorkspaceState } from "@/components/automation";
import { TASK_STATUS, type TaskStatus } from "@/components/task-row";
import { paletteSurface, type PaletteColor } from "@/lib/palette";
import {
  TASK_STAGES,
  formatTaskDate,
  type GroupedTask,
  type TaskMember,
} from "./model";
import "./grouped-tasks.css";
export * from "./model";
const stageColor: Record<TaskStatus, PaletteColor> = {
  backlog: "default",
  todo: "default",
  progress: "blue",
  review: "purple",
  done: "mint",
};
export function TaskStatusGroup({
  status,
  count,
  open,
  onOpenChange,
  onAdd,
  tone = "status",
  children,
}: {
  status: TaskStatus;
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: () => void;
  /** Neutral group bands for dense adaptive layouts. */
  tone?: "status" | "neutral";
  children: ReactNode;
}) {
  const id = useId();
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={onOpenChange}
      className="gt-group"
    >
      <div className={`gt-group-heading ${paletteSurface[tone === "neutral" ? "default" : stageColor[status]]}`}>
        <h2 id={id}>
          <Collapsible.Trigger className="gt-group-trigger">
            <Icon name={open ? "chevron-down" : "chevron-right"} size="sm" />
            <span className="gt-status-dot" aria-hidden />
            <span>{TASK_STATUS[status]}</span>
            <span className="gt-count">{count}</span>
          </Collapsible.Trigger>
        </h2>
        {onAdd && (
          <IconButton
            type="tertiary"
            size="sm"
            tapScale={1}
            className="text-current"
            aria-label={`Add task to ${TASK_STATUS[status]}`}
            icon={<Icon name="plus" size="sm" />}
            onClick={onAdd}
          />
        )}
      </div>
      <Collapsible.Panel aria-labelledby={id}>{children}</Collapsible.Panel>
    </Collapsible.Root>
  );
}
export function TaskListRow({
  task,
  people,
  onOpen,
}: {
  task: GroupedTask;
  people: TaskMember[];
  onOpen: () => void;
}) {
  const members = task.assigneeIds.map(
    (id) => people.find((p) => p.id === id) ?? { id, name: id },
  );
  return (
    <tr className="gt-row">
      <td>
        <button type="button" className="gt-task-title" onClick={onOpen}>
          <span className="gt-task-id">{task.id}</span>
          <span>{task.title}</span>
        </button>
      </td>
      <td>
        <Tag
          color={
            task.priority === "High"
              ? "orange"
              : task.priority === "Medium"
                ? "blue"
                : task.priority === "Low"
                  ? "mint"
                  : "default"
          }
        >
          {task.priority ?? "Not set"}
        </Tag>
      </td>
      <td>
        <span className="gt-list-name">
          <Icon name="list" size="sm" />
          {task.list}
        </span>
      </td>
      <td>
        <div className="gt-tags">
          {task.tags.length ? (
            task.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
          ) : (
            <span className="text-text-tertiary">No tags</span>
          )}
        </div>
      </td>
      <td>
        {task.due ? (
          <time dateTime={task.due}>{formatTaskDate(task.due)}</time>
        ) : (
          <span className="text-text-tertiary">No date</span>
        )}
      </td>
      <td>
        {members.length ? (
          <AvatarGroup
            max={3}
            size="xs"
            role="img"
            aria-label={members.map((p) => p.name).join(", ")}
            title={members.map((p) => p.name).join(", ")}
          >
            {members.map((p) => (
              <Avatar
                key={p.id}
                name={p.name}
                color={p.color}
                size="xs"
                aria-hidden
              />
            ))}
          </AvatarGroup>
        ) : (
          <span className="text-text-tertiary">Unassigned</span>
        )}
      </td>
    </tr>
  );
}
export function GroupedTaskList({
  tasks,
  people,
  collapsed = [],
  onCollapsedChange,
  onTaskOpen,
  onAdd,
  showEmpty = false,
}: {
  tasks: GroupedTask[];
  people: TaskMember[];
  collapsed?: TaskStatus[];
  onCollapsedChange: (statuses: TaskStatus[]) => void;
  onTaskOpen: (task: GroupedTask) => void;
  onAdd?: (status: TaskStatus) => void;
  showEmpty?: boolean;
}) {
  if (!tasks.length && !showEmpty)
    return (
      <AgentWorkspaceState
        title="No tasks yet"
        description="Tasks will appear here grouped by status."
        actionLabel={onAdd ? "Add task" : undefined}
        onAction={onAdd ? () => onAdd("backlog") : undefined}
      />
    );
  return (
    <div className="gt-groups">
      {TASK_STAGES.filter(
        (status) => showEmpty || tasks.some((t) => t.status === status),
      ).map((status) => {
        const rows = tasks.filter((t) => t.status === status);
        return (
          <TaskStatusGroup
            key={status}
            status={status}
            count={rows.length}
            open={!collapsed.includes(status)}
            onOpenChange={(open) =>
              onCollapsedChange(
                open
                  ? collapsed.filter((s) => s !== status)
                  : [...collapsed, status],
              )
            }
            onAdd={onAdd ? () => onAdd(status) : undefined}
          >
            {rows.length ? (
              <div
                className="gt-table-scroll"
                tabIndex={0}
                role="region"
                aria-label={`${TASK_STATUS[status]} tasks`}
              >
                <table className="gt-table">
                  <caption className="sr-only">
                    {TASK_STATUS[status]} tasks
                  </caption>
                  <colgroup>
                    <col className="gt-name-col" />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                  </colgroup>
                  <thead>
                    <tr>
                      {[
                        "Name",
                        "Priority",
                        "List",
                        "Tag",
                        "Due date",
                        "Assignee",
                      ].map((label) => (
                        <th scope="col" key={label}>
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((task) => (
                      <TaskListRow
                        key={task.id}
                        task={task}
                        people={people}
                        onOpen={() => onTaskOpen(task)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <AgentWorkspaceState
                title={`No tasks in ${TASK_STATUS[status].toLowerCase()}`}
                description="Add a task here or move one from another group."
                actionLabel={onAdd ? "Add task" : undefined}
                onAction={onAdd ? () => onAdd(status) : undefined}
              />
            )}
          </TaskStatusGroup>
        );
      })}
    </div>
  );
}

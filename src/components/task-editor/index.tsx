import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button, IconButton } from "@/components/button";
import { Icon, type IconName } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { InlineSearchSelect } from "@/components/inline-search-select";
import { AgentWorkspaceState } from "@/components/automation";
import {
  TASK_STATUS,
  type TaskStatus,
  type TaskPriority,
} from "@/components/task-row";
import type { KanbanPerson } from "@/components/kanban";
import { dateError, type Subtask, type TaskDetails } from "./model";
import "./task-editor.css";
export * from "./model";

/** Controlled properties; dates commit as a validated pair. Other changes commit immediately. */
export function TaskProperties({
  task,
  people,
  dependencies = [],
  projectName = "Marketing Campaign",
  labelOptions = ["Design", "Growth", "Content"],
  onChange,
}: {
  task: TaskDetails;
  people: KanbanPerson[];
  dependencies?: { id: string; title: string }[];
  projectName?: string;
  labelOptions?: string[];
  onChange: (patch: Partial<TaskDetails>) => void;
}) {
  const [start, setStart] = useState(task.start),
    [due, setDue] = useState(task.due),
    [error, setError] = useState("");
  useEffect(() => {
    setStart(task.start);
    setDue(task.due);
    setError("");
  }, [task.id, task.start, task.due]);
  const row = (label: string, icon: IconName, children: ReactNode) => (
    <div className="te-property">
      <span>
        <Icon name={icon} size="sm" />
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
  const options = (values: string[], icon: IconName) =>
    values.map((value) => ({
      value,
      label: value,
      icon: <Icon name={icon} size="sm" />,
    }));
  return (
    <div className="te-properties">
      {row(
        "Status",
        "circle-dashed",
        <InlineSearchSelect
          label="Status"
          value={task.status}
          options={Object.entries(TASK_STATUS).map(([value, label]) => ({
            value,
            label,
            icon: (
              <Icon
                name={value === "done" ? "check" : "circle-dashed"}
                size="sm"
              />
            ),
          }))}
          onValueChange={(status) => onChange({ status: status as TaskStatus })}
        />,
      )}
      {row(
        "Priority",
        "chart-bar",
        <InlineSearchSelect
          label="Priority"
          value={task.priority}
          options={options(["Low", "Medium", "High"], "chart-bar")}
          onValueChange={(priority) =>
            onChange({ priority: priority as TaskPriority })
          }
        />,
      )}
      {row(
        "Assignee",
        "users",
        <InlineSearchSelect
          label="Assignee"
          value={task.assigneeId}
          options={[
            {
              value: "",
              label: "Unassigned",
              icon: <Icon name="users" size="sm" />,
            },
            ...people.map((p) => ({
              value: p.id,
              label: p.name,
              icon: <Avatar name={p.name} color={p.color} size="xs" />,
            })),
          ]}
          onValueChange={(assigneeId) => onChange({ assigneeId })}
        />,
      )}
      {row(
        "Due date",
        "calendar",
        <input
          aria-label="Due date"
          type="date"
          value={due}
          onChange={(e) => {
            setDue(e.target.value);
            setError("");
          }}
        />,
      )}
      {row(
        "Start date",
        "calendar",
        <input
          aria-label="Start date"
          type="date"
          value={start}
          onChange={(e) => {
            setStart(e.target.value);
            setError("");
          }}
        />,
      )}
      {(start !== task.start || due !== task.due) && (
        <div className="te-date-actions">
          <Button
            type="secondary"
            size="sm"
            tapScale={1}
            onClick={() => {
              const issue = dateError(start, due);
              setError(issue);
              if (!issue) onChange({ start, due });
            }}
          >
            Save dates
          </Button>
          <Button
            type="tertiary"
            size="sm"
            tapScale={1}
            onClick={() => {
              setStart(task.start);
              setDue(task.due);
              setError("");
            }}
          >
            Cancel dates
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="te-error">
          {error}
        </p>
      )}
      {row(
        "Project",
        "folder",
        <span className="te-project-name">
          <i />
          {projectName}
        </span>,
      )}
      {row(
        "Labels",
        "hash",
        <div className="te-labels">
          {labelOptions.map((label, i) => (
            <button
              type="button"
              key={label}
              aria-pressed={task.labels.includes(label)}
              onClick={() =>
                onChange({
                  labels: task.labels.includes(label)
                    ? task.labels.filter((l) => l !== label)
                    : [...task.labels, label],
                })
              }
              data-color={["purple", "orange", "pink"][i]}
            >
              {label}
            </button>
          ))}
        </div>,
      )}
      {row(
        "Repeat",
        "refresh",
        <InlineSearchSelect
          label="Repeat"
          value={task.repeat}
          options={options(["Does not repeat", "Weekly", "Monthly"], "refresh")}
          onValueChange={(repeat) => onChange({ repeat })}
        />,
      )}
      {row(
        "Estimate",
        "clock-history",
        <InlineSearchSelect
          label="Estimate"
          value={task.estimate}
          options={options(
            ["Not estimated", "1d", "2d", "3d", "5d"],
            "clock-history",
          )}
          onValueChange={(estimate) => onChange({ estimate })}
        />,
      )}
      {row(
        "Blocked by",
        "link",
        <InlineSearchSelect
          label="Blocked by"
          value={task.blockedBy}
          options={[
            { value: "", label: "None", icon: <Icon name="link" size="sm" /> },
            ...dependencies
              .filter((d) => d.id !== task.id)
              .map((d) => ({ value: d.id, label: d.title, description: d.id })),
          ]}
          onValueChange={(blockedBy) => onChange({ blockedBy })}
        />,
      )}
    </div>
  );
}

export function TaskSubtasks({
  items,
  onChange,
}: {
  items: Subtask[];
  onChange: (items: Subtask[]) => void;
}) {
  const [title, setTitle] = useState("");
  return (
    <section className="te-section">
      <h3>
        Subtasks{" "}
        <span>
          {items.filter((t) => t.done).length}/{items.length}
        </span>
      </h3>
      {items.length === 0 ? (
        <p className="te-hint">Break this task into smaller steps.</p>
      ) : (
        <ul className="te-subtasks">
          {items.map((t) => (
            <li key={t.id}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={(e) =>
                    onChange(
                      items.map((x) =>
                        x.id === t.id ? { ...x, done: e.target.checked } : x,
                      ),
                    )
                  }
                />
                <span data-done={t.done || undefined}>{t.title}</span>
              </label>
              <IconButton
                type="tertiary"
                size="sm"
                tapScale={1}
                aria-label={`Remove ${t.title}`}
                icon={<Icon name="x" size="sm" />}
                onClick={() => onChange(items.filter((x) => x.id !== t.id))}
              />
            </li>
          ))}
        </ul>
      )}
      <form
        className="te-add"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) {
            onChange([
              ...items,
              { id: crypto.randomUUID(), title: title.trim(), done: false },
            ]);
            setTitle("");
          }
        }}
      >
        <input
          aria-label="New subtask"
          placeholder="Add a subtask…"
          maxLength={160}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <IconButton
          aria-label="Add subtask"
          type="secondary"
          size="sm"
          tapScale={1}
          disabled={!title.trim()}
          icon={<Icon name="plus" size="sm" />}
          onClick={(e) => e.currentTarget.form?.requestSubmit()}
        />
      </form>
    </section>
  );
}

/** A nonmodal region. Host decides layout and restores the launcher's focus on close. */
export function TaskDetailPanel({
  taskId,
  title,
  complete,
  onComplete,
  onClose,
  children,
}: {
  taskId: string;
  title: string;
  complete: boolean;
  onComplete: () => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const id = useId(),
    heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [taskId]);
  return (
    <section
      className="te-panel"
      aria-labelledby={id}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !e.defaultPrevented) {
          e.preventDefault();
          onClose();
        }
      }}
    >
      <header className="te-panel-header">
        <span>
          <i />
          {taskId}
        </span>
        <Button
          type="tertiary"
          size="sm"
          tapScale={1}
          leadingIcon={
            <Icon name={complete ? "check" : "circle-dashed"} size="sm" />
          }
          onClick={onComplete}
        >
          {complete ? "Reopen task" : "Mark complete"}
        </Button>
        <IconButton
          type="tertiary"
          size="sm"
          tapScale={1}
          aria-label="Close task details"
          icon={<Icon name="x" size="sm" />}
          onClick={onClose}
        />
      </header>
      <div className="te-panel-body">
        <h2 ref={heading} tabIndex={-1} id={id}>
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
export function TaskEditorEmpty() {
  return (
    <AgentWorkspaceState
      title="No task selected"
      description="Open a card to edit its details alongside your board."
    />
  );
}

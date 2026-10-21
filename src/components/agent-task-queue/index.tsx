import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReducedMotion } from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { ShimmerText } from "@/components/activity-label";
import { AgentWorkspaceState } from "@/components/automation";
import { SkeletonReveal } from "@/components/finance-overview";
import { QUEUE_LABELS, type QueueTask, type QueueQuestion } from "./model";
import "./queue.css";
export * from "./model";
const statusGlyph = {
  queued: "circle-dashed",
  running: "circle-dashed",
  paused: "clock-history",
  "needs-context": "info",
  done: "check",
} as const;
function TransportGlyph({ paused = false }: { paused?: boolean }) { return <Icon name={paused ? "play" : "pause"} />; }
export function QueueTaskRow({
  task,
  expanded = false,
  suspended = false,
  onToggle,
  onPause,
  onResume,
  onRemove,
  handle,
  children,
}: {
  task: QueueTask;
  expanded?: boolean;
  suspended?: boolean;
  onToggle?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onRemove?: () => void;
  handle?: ReactNode;
  children?: ReactNode;
}) {
  const id = useId(),
    working = task.status === "running" && !suspended;
  return (
    <article
      className="aq-row"
      data-status={task.status}
      data-expanded={expanded || undefined}
    >
      <span
        className="aq-dot"
        role="img"
        aria-label={
          task.status === "running" && suspended
            ? "Session paused"
            : QUEUE_LABELS[task.status]
        }
      >
        <Icon name={statusGlyph[task.status]} size="sm" />
      </span>
      <div className="aq-row-main">
        <div className="aq-row-heading">
          {onToggle ? (
            <button
              className="aq-title"
              data-task-id={task.id}
              onClick={onToggle}
              aria-expanded={expanded}
              aria-controls={id}
            >
              {working ? <ShimmerText>{task.title}</ShimmerText> : task.title}
            </button>
          ) : (
            <h3 className="aq-title">
              {working ? <ShimmerText>{task.title}</ShimmerText> : task.title}
            </h3>
          )}
          <div className="aq-row-actions">
            {task.status === "paused" && onResume ? (
              <IconButton
                type="tertiary"
                size="sm"
                aria-label={`Resume ${task.title}`}
                title="Resume task"
                icon={<TransportGlyph paused />}
                onClick={onResume}
              />
            ) : (
              (task.status === "queued" || task.status === "running") &&
              onPause && (
                <IconButton
                  type="tertiary"
                  size="sm"
                  aria-label={`Pause ${task.title}`}
                  title="Pause task"
                  icon={<TransportGlyph />}
                  onClick={onPause}
                />
              )
            )}
            {onToggle && (
              <IconButton
                type="tertiary"
                size="sm"
                aria-label={`Context for ${task.title}`}
                title="Task context"
                icon={<Icon name="info" size="sm" />}
                onClick={onToggle}
              />
            )}{" "}
            {onRemove && (
              <IconButton
                type="tertiary"
                size="sm"
                aria-label={`Remove ${task.title}`}
                title="Remove task"
                icon={<Icon name="x" size="sm" />}
                onClick={onRemove}
              />
            )}{" "}
            {handle}
          </div>
        </div>
        {task.status === "needs-context" &&
          !expanded &&
          (onToggle ? (
            <button className="aq-context-hint" onClick={onToggle}>
              Needs more context <Icon name="chevron-down" size="sm" />
            </button>
          ) : (
            <p className="aq-context-hint">Needs more context</p>
          ))}
        {Object.values(task.answers).length > 0 && (
          <p className="aq-answer-summary">
            {Object.values(task.answers).join(" · ")}
          </p>
        )}
        <div id={id} hidden={!expanded} className="aq-row-detail">
          {children}
        </div>
      </div>
    </article>
  );
}
function SortableTask({
  task,
  children,
  handleLabel,
}: {
  task: QueueTask;
  children: (handle: ReactNode) => ReactNode;
  handleLabel: string;
}) {
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id }),
    reduce = useReducedMotion();
  return (
    <li
      ref={setNodeRef}
      style={
        {
          transform: CSS.Transform.toString(transform),
          transition: reduce ? undefined : transition,
          zIndex: isDragging ? 2 : undefined,
          position: "relative",
        } as CSSProperties
      }
      className={isDragging ? "aq-dragging" : ""}
    >
      {children(
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="aq-drag-handle"
          aria-label={handleLabel}
          title="Drag to reorder; Space then arrow keys also works"
        >
          <Icon name="grip-vertical" size="sm" />
        </button>,
      )}
    </li>
  );
}
export function AgentTaskQueue({
  tasks,
  expandedId,
  onExpand,
  onMove,
  onPause,
  onResume,
  onRemove,
  renderDetail,
  suspended = false,
  loading = false,
  error,
  onRetry,
  onReset,
}: {
  tasks: readonly QueueTask[];
  expandedId?: string | null;
  onExpand?: (id: string | null) => void;
  onMove?: (id: string, over: string) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  onRemove?: (id: string) => void;
  renderDetail?: (task: QueueTask) => ReactNode;
  suspended?: boolean;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onReset?: () => void;
}) {
  const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    ),
    root = useRef<HTMLDivElement>(null);
  function remove(id: string) {
    const index = tasks.findIndex((t) => t.id === id),
      neighbor = tasks[index + 1] ?? tasks[index - 1],
      button = neighbor
        ? Array.from(
            root.current?.querySelectorAll<HTMLButtonElement>(
              "[data-task-id]",
            ) ?? [],
          ).find((b) => b.dataset.taskId === neighbor.id)
        : null;
    (button ?? root.current)?.focus();
    onRemove?.(id);
  }
  const row = (task: QueueTask, handle?: ReactNode) => (
    <div data-task-row={task.id}>
      <QueueTaskRow
        task={task}
        suspended={suspended}
        expanded={expandedId === task.id}
        onToggle={
          onExpand
            ? () => onExpand(expandedId === task.id ? null : task.id)
            : undefined
        }
        onPause={onPause ? () => onPause(task.id) : undefined}
        onResume={onResume ? () => onResume(task.id) : undefined}
        onRemove={onRemove ? () => remove(task.id) : undefined}
        handle={handle}
      >
        {renderDetail?.(task)}
      </QueueTaskRow>
    </div>
  );
  return (
    <div
      className="aq-queue"
      ref={root}
      tabIndex={-1}
      aria-label="Agent task queue"
    >
      <SkeletonReveal
        loading={loading}
        hasData={tasks.length > 0}
        animate={false}
        label="Loading task queue"
        skeleton={
          <div className="aq-skeleton" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <div key={n}>
                <span />
                <i />
              </div>
            ))}
          </div>
        }
      >
        {error ? (
          <AgentWorkspaceState
            title="Queue unavailable"
            description={error}
            error
            actionLabel={onRetry ? "Try again" : undefined}
            onAction={onRetry}
          />
        ) : !tasks.length ? (
          <AgentWorkspaceState
            title="A clear queue"
            description="Add a task below. Paused requests and questions never block the rest."
            actionLabel={onReset ? "Restore sample tasks" : undefined}
            onAction={onReset}
          />
        ) : onMove ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (over && active.id !== over.id)
                onMove(String(active.id), String(over.id));
            }}
            accessibility={{
              screenReaderInstructions: {
                draggable:
                  "Press Space to pick up a task. Use arrow keys to reorder, Space to drop, or Escape to cancel.",
              },
            }}
          >
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <ol className="aq-task-list">
                {tasks.map((task) => (
                  <SortableTask
                    task={task}
                    key={task.id}
                    handleLabel={`Reorder ${task.title}`}
                  >
                    {(handle) => row(task, handle)}
                  </SortableTask>
                ))}
              </ol>
            </SortableContext>
          </DndContext>
        ) : (
          <ol className="aq-task-list">
            {tasks.map((task) => (
              <li key={task.id}>{row(task)}</li>
            ))}
          </ol>
        )}
      </SkeletonReveal>
    </div>
  );
}
export function TaskClarification({
  questions,
  answers,
  step = 0,
  onChange,
  onStepChange,
  onSubmit,
  pending = false,
  error,
}: {
  questions: readonly QueueQuestion[];
  answers: Record<string, string>;
  step?: number;
  onChange: (answers: Record<string, string>) => void;
  onStepChange: (step: number) => void;
  onSubmit: () => void;
  pending?: boolean;
  error?: string;
}) {
  const [validation, setValidation] = useState(""),
    heading = useRef<HTMLHeadingElement>(null),
    previousStep = useRef(step),
    id = useId();
  const index = Math.min(Math.max(0, Math.floor(step)), questions.length - 1),
    question = questions[index],
    value = question ? (answers[question.id] ?? "") : "",
    custom = question && !question.options.includes(value) ? value : "";
  useEffect(() => {
    if (step !== previousStep.current) heading.current?.focus();
    previousStep.current = step;
    setValidation("");
  }, [step]);
  if (!question)
    return (
      <AgentWorkspaceState
        title="No questions to answer"
        description="This request already has the context it needs."
      />
    );
  function change(value: string) {
    setValidation("");
    onChange({ ...answers, [question.id]: value });
  }
  function next() {
    if (!value.trim() || value.trim().length > 500) {
      setValidation("Choose an option or write an answer of 1–500 characters.");
      return;
    }
    if (index < questions.length - 1) onStepChange(index + 1);
    else {
      const missing = questions.findIndex(
        (q) => !answers[q.id]?.trim() || answers[q.id].trim().length > 500,
      );
      if (missing >= 0) {
        onStepChange(missing);
        setValidation(
          "Complete this answer before returning the task to the queue.",
        );
        return;
      }
      onSubmit();
    }
  }
  return (
    <section
      className="aq-clarification"
      aria-label="Task clarification"
      aria-busy={pending}
    >
      <header>
        <span>Needs more context</span>
        <span>
          {index + 1} / {questions.length}
        </span>
      </header>
      <h4 ref={heading} tabIndex={-1} id={id}>
        {question.prompt}
      </h4>
      <fieldset disabled={pending} aria-labelledby={id}>
        <legend className="sr-only">Choose an answer</legend>
        {question.options.map((option) => (
          <label
            key={option}
            className="aq-choice"
            data-selected={value === option || undefined}
          >
            <input
              type="radio"
              name={id}
              checked={value === option}
              onChange={() => change(option)}
            />
            <span>{option}</span>
          </label>
        ))}
        <textarea
          aria-label="Custom answer"
          placeholder="Something else…"
          rows={2}
          value={custom}
          onChange={(e) => change(e.target.value)}
          maxLength={500}
        />
      </fieldset>
      {(validation || error) && (
        <p role="alert" className="aq-error">
          {validation || error}
        </p>
      )}
      <footer>
        {index > 0 ? (
          <Button
            type="tertiary"
            size="sm"
            disabled={pending}
            onClick={() => onStepChange(index - 1)}
          >
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="secondary" size="sm" disabled={pending} onClick={next}>
          {pending
            ? "Saving…"
            : index === questions.length - 1
              ? "Save & queue"
              : "Next"}
        </Button>
      </footer>
    </section>
  );
}
export function QueuedRequestStack({
  requests,
  expanded = false,
  onExpandedChange,
}: {
  requests: readonly { id: string; title: string }[];
  expanded?: boolean;
  onExpandedChange: (expanded: boolean) => void;
}) {
  const id = useId();
  if (!requests.length) return null;
  return (
    <section className="aq-request-stack">
      <button
        aria-label={expanded ? "Hide queued requests" : "Show queued requests"}
        aria-expanded={expanded}
        aria-controls={id}
        onClick={() => onExpandedChange(!expanded)}
      >
        <span>{requests[0].title}</span>
        <span>{expanded ? "Hide" : `+${requests.length - 1}`}</span>
      </button>
      <ol id={id} hidden={!expanded}>
        {requests.slice(1).map((request) => (
          <li key={request.id}>{request.title}</li>
        ))}
      </ol>
    </section>
  );
}

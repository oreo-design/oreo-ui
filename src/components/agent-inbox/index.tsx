import { useId, useRef, useState, type ReactNode } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { StatusIcon } from "@/components/status-icon";
import { AgentWorkspaceState } from "@/components/automation";
import { cn } from "@/lib/cn";
import {
  RUN_GROUPS,
  RUN_LABELS,
  RUN_STATUSES,
  groupForRun,
  durationLabel,
  type InboxRun,
  type RunActivity,
  type RunGroup,
  type RunStatus,
} from "./model";
import "./agent-inbox.css";
export * from "./model";

export function AgentRunActivity({
  model,
  items,
}: {
  model: string;
  items: RunActivity[];
}) {
  return (
    <section aria-label="Run activity" className="ai-activity">
      <p className="text-xs text-text-tertiary">{model}</p>
      {items.length ? (
        <ol>
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.text}</span>
              <span className="ai-time">{item.time}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-text-secondary">No activity yet.</p>
      )}
    </section>
  );
}
const glyph = {
  waiting: "planned",
  failed: "blocked",
  running: "in-progress",
  done: "done",
} as const;
const tone = {
  waiting: "text-palette-orange-text",
  failed: "text-status-error",
  running: "text-status-progress",
  done: "text-status-success",
};
/** Click disclosure with optional host-owned transition and drag-handle slots. */
export function AgentRunCard({
  run,
  expanded = false,
  onExpandedChange,
  onStatusChange,
  handle,
}: {
  run: InboxRun;
  expanded?: boolean;
  onExpandedChange?: (open: boolean) => void;
  onStatusChange?: (status: RunStatus) => void;
  handle?: ReactNode;
}) {
  const id = useId();
  return (
    <article className="ai-card" data-status={run.status}>
      <div className="ai-card-heading">
        <Icon name="sparkle" className={tone[run.status]} />
        {onExpandedChange ? (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => onExpandedChange(!expanded)}
            className="ai-disclosure"
          >
            <span>{run.title}</span>
            <Icon name={expanded ? "chevron-up" : "chevron-down"} size="sm" />
          </button>
        ) : (
          <h3>{run.title}</h3>
        )}
        {handle}
      </div>
      <p className={cn("ai-summary", !expanded && "ai-summary-clamp")}>
        {run.summary}
      </p>
      <div className="ai-meta">
        <span className="ai-status">
          <StatusIcon
            status={glyph[run.status]}
            monochrome
            className={tone[run.status]}
            animated={false}
            size="sm"
          />
          <span>
            {RUN_LABELS[run.status]}
            {(run.status === "running" || run.status === "done") &&
              ` · ${durationLabel(run.elapsed)}`}
          </span>
        </span>
        <span aria-label={`${run.queries} queries`} title="Queries">
          <Icon name="search" size="sm" />
          {run.queries}
        </span>
        <span aria-label={`${run.tools} tool calls`} title="Tool calls">
          <Icon name="gear" size="sm" />
          {run.tools}
        </span>
      </div>
      <div id={id} hidden={!expanded} className="ai-detail">
        <AgentRunActivity model={run.model} items={run.activity} />
        {onStatusChange && (
          <div className="ai-card-actions">
            <label className="ai-move">
              <span className="sr-only">Move {run.title}</span>
              <select
                value={run.status}
                onChange={(event) =>
                  onStatusChange(event.target.value as RunStatus)
                }
              >
                {RUN_STATUSES.map((status) => (
                  <option value={status} key={status}>
                    {RUN_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <Button
              type="secondary"
              size="sm"
              tapScale={1}
              onClick={() =>
                onStatusChange(run.status === "running" ? "done" : "running")
              }
            >
              {run.status === "waiting"
                ? "Approve"
                : run.status === "failed"
                  ? "Retry"
                  : run.status === "running"
                    ? "Mark done"
                    : "Reopen"}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
function DraggableRun({
  run,
  expanded,
  onExpandedChange,
  onStatusChange,
  animate,
  layoutKey,
}: {
  run: InboxRun;
  expanded: boolean;
  onExpandedChange?: (open: boolean) => void;
  onStatusChange?: (status: RunStatus) => void;
  animate: boolean;
  layoutKey: string;
}) {
  const { setNodeRef, setActivatorNodeRef, listeners, isDragging } =
    useDraggable({ id: run.id, disabled: !onStatusChange });
  return (
    <motion.div
      ref={setNodeRef}
      layout="position"
      layoutDependency={layoutKey}
      layoutId={`run:${run.id}`}
      transition={{ type: "spring", duration: animate ? 0.25 : 0, bounce: 0 }}
      style={{ opacity: isDragging ? 0.25 : 1 }}
    >
      <AgentRunCard
        run={run}
        expanded={expanded}
        onExpandedChange={onExpandedChange}
        onStatusChange={onStatusChange}
        handle={
          onStatusChange ? (
            <span
              ref={setActivatorNodeRef}
              {...listeners}
              aria-hidden="true"
              className="ai-drag"
              title="Drag to a group; use the expanded status menu for keyboard movement"
            >
              <Icon name="grip-vertical" size="sm" />
            </span>
          ) : undefined
        }
      />
    </motion.div>
  );
}
function RunLane({
  group,
  count,
  children,
  draggable,
}: {
  group: { id: RunGroup; label: string };
  count: number;
  children: ReactNode;
  draggable: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: group.id,
    disabled: !draggable,
  });
  const id = useId();
  return (
    <section
      ref={setNodeRef}
      aria-labelledby={id}
      className="ai-lane"
      data-over={isOver}
    >
      <header>
        <Icon name="sparkle" size="sm" className="text-status-progress" />
        <h2 id={id}>{group.label}</h2>
        <span>{count}</span>
      </header>
      <div className="ai-lane-cards">
        {children}
        {!count && (
          <p className="ai-lane-empty">
            {group.id === "attention"
              ? "All caught up"
              : group.id === "running"
                ? "No active runs"
                : "Nothing completed yet"}
          </p>
        )}
      </div>
    </section>
  );
}
/** Host owns data/view/expanded ID and transitions. DnD commits only on a valid drop. */
export function AgentInboxBoard({
  runs,
  view = "board",
  onViewChange,
  expandedId,
  onExpandedChange,
  onStatusChange,
  loading = false,
  error,
  onRetry,
  filtered = false,
  onClearFilters,
}: {
  runs: InboxRun[];
  view?: "board" | "list";
  onViewChange?: (view: "board" | "list") => void;
  expandedId?: string | null;
  onExpandedChange?: (id: string | null) => void;
  onStatusChange?: (id: string, status: RunStatus) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  filtered?: boolean;
  onClearFilters?: () => void;
}) {
  const id = useId(),
    reduce = useReducedMotion();
  const [dragId, setDragId] = useState<string | null>(null),
    [notice, setNotice] = useState(""),
    [keyboard, setKeyboard] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
  );
  const active = runs.find((r) => r.id === dragId);
  const change = (run: InboxRun, status: RunStatus) => {
    onStatusChange?.(run.id, status);
    setNotice(`${run.title}: ${RUN_LABELS[status]}.`);
    requestAnimationFrame(() => heading.current?.focus());
  };
  return (
    <div
      className="ai-board"
      aria-busy={loading}
      onKeyDownCapture={() => setKeyboard(true)}
      onPointerDownCapture={() => setKeyboard(false)}
    >
      <div className="ai-board-toolbar">
        <h1 ref={heading} tabIndex={-1}>
          <span>Agents / </span>Agent inbox
        </h1>
        {onViewChange && (
          <div className="ai-views" role="group" aria-label="Inbox view">
            {(["board", "list"] as const).map((mode) => (
              <Button
                key={mode}
                type={view === mode ? "secondary" : "tertiary"}
                size="sm"
                tapScale={1}
                aria-pressed={view === mode}
                disabled={!!dragId}
                onClick={() => onViewChange(mode)}
              >
                {mode === "board" ? "Board" : "List"}
              </Button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <AgentWorkspaceState
          title="Could not load runs"
          description={error}
          error
          actionLabel="Try again"
          onAction={onRetry}
        />
      )}
      {loading && !runs.length ? (
        <div className="ai-groups" data-view={view} aria-label="Loading runs">
          {RUN_GROUPS.map((group) => (
            <div key={group.id} className="ai-lane ai-skeleton">
              <div />
              <div />
              <div />
            </div>
          ))}
        </div>
      ) : !runs.length && !error ? (
        <AgentWorkspaceState
          title={filtered ? "No matching runs" : "Your inbox is clear"}
          description={
            filtered
              ? "Try another title, model or status."
              : "New agent runs will appear here when they start."
          }
          actionLabel={filtered ? "Clear search" : undefined}
          onAction={filtered ? onClearFilters : undefined}
        />
      ) : runs.length > 0 ? (
        <LayoutGroup id={id}>
          <DndContext
            id={id}
            sensors={sensors}
            accessibility={{ restoreFocus: false }}
            collisionDetection={pointerWithin}
            onDragStart={(e) => {
              setDragId(String(e.active.id));
              setNotice("");
            }}
            onDragCancel={() => {
              setDragId(null);
              setNotice("Move cancelled.");
              heading.current?.focus();
            }}
            onDragEnd={(e) => {
              const run = runs.find((r) => r.id === e.active.id),
                group = RUN_GROUPS.find((g) => g.id === e.over?.id);
              if (run && group && groupForRun(run.status) !== group.id)
                change(run, group.id === "attention" ? "waiting" : group.id);
              else {
                setNotice("No change.");
                heading.current?.focus();
              }
              setDragId(null);
            }}
          >
            <div className="ai-groups" data-view={view}>
              {RUN_GROUPS.map((group) => {
                const items = runs.filter(
                  (r) => groupForRun(r.status) === group.id,
                );
                return (
                  <RunLane
                    key={group.id}
                    group={group}
                    count={items.length}
                    draggable={!!onStatusChange && !loading}
                  >
                    {items.map((run) => (
                      <DraggableRun
                        key={run.id}
                        run={run}
                        expanded={expandedId === run.id}
                        onExpandedChange={
                          onExpandedChange
                            ? (open) => onExpandedChange(open ? run.id : null)
                            : undefined
                        }
                        onStatusChange={
                          onStatusChange && !loading
                            ? (status) => change(run, status)
                            : undefined
                        }
                        animate={!reduce && !keyboard}
                        layoutKey={`${view}:${runs.map((r) => `${r.id}:${r.status}`).join(",")}`}
                      />
                    ))}
                  </RunLane>
                );
              })}
            </div>
            <DragOverlay dropAnimation={null}>
              {active && (
                <div className="ai-drag-overlay">
                  <AgentRunCard run={active} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </LayoutGroup>
      ) : null}
      <p className="sr-only" role="status">
        {notice}
      </p>
    </div>
  );
}

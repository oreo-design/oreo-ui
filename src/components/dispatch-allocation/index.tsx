import { useId, useState, type CSSProperties, type ReactNode } from "react";
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
import { useReducedMotion } from "motion/react";
import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/components/avatar";
import { AgentWorkspaceState } from "@/components/automation";
import {
  HOURS,
  allocationError,
  hourLabel,
  type Allocation,
  type AllocationResource,
  type RouteJob,
} from "./model";
import "./allocation.css";
export * from "./model";
const tone = (category: RouteJob["category"]) =>
  category === "Private hire"
    ? "progress"
    : category === "Contract"
      ? "error"
      : "success";
export function RouteJobCard({
  job,
  onOpen,
  dragHandle,
}: {
  job: RouteJob;
  onOpen?: () => void;
  dragHandle?: ReactNode;
}) {
  return (
    <article className="allocation-job" data-tone={tone(job.category)}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <strong className="text-sm font-medium">{job.id}</strong>
          <p className="mt-1 text-xs text-text-tertiary">{job.customer}</p>
        </div>
        {dragHandle}
      </div>
      <ol className="allocation-route">
        <li>
          <span className="allocation-dot bg-status-success" />
          <span>
            <span className="sr-only">Pickup: </span>
            {job.from}
          </span>
        </li>
        <li>
          <span className="allocation-dot bg-status-error" />
          <span>
            <span className="sr-only">Drop-off: </span>
            {job.to}
          </span>
        </li>
      </ol>
      <div className="allocation-job-meta">
        <span>
          <Icon name="clock-history" size="sm" />
          {job.duration}h
        </span>
        <span>
          <Icon name="users" size="sm" />
          {job.passengers} pax
        </span>
        <span>{job.luggage}kg</span>
        <span>{job.category}</span>
      </div>
      {onOpen && (
        <Button
          type="secondary"
          size="sm"
          onClick={onOpen}
          className="mt-3 w-full"
        >
          {job.dispatched
            ? "View job"
            : job.allocation
              ? "Edit allocation"
              : "Allocate job"}
        </Button>
      )}
    </article>
  );
}
function DraggableJob({
  job,
  compact,
  canDrag,
  onOpen,
}: {
  job: RouteJob;
  compact?: boolean;
  canDrag?: boolean;
  onOpen?: (job: RouteJob) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: job.id,
    disabled: job.dispatched || !onOpen || !canDrag,
  });
  const handle =
    !job.dispatched && onOpen && canDrag ? (
      <IconButton
        type="tertiary"
        {...attributes}
        {...listeners}
        icon={<Icon name="grip-vertical" />}
        aria-label={`Drag ${job.id}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(job);
          }
        }}
        className="allocation-handle"
        size="sm"
        tapScale={1}
      />
    ) : null;
  return (
    <div
      ref={setNodeRef}
      className={compact ? "allocation-bar-wrap" : "allocation-card-wrap"}
      style={{ opacity: isDragging ? 0.25 : 1 }}
    >
      {compact ? (
        <div className="allocation-bar" data-tone={tone(job.category)}>
          {handle}
          <button
            type="button"
            disabled={!onOpen}
            onClick={() => onOpen?.(job)}
            title={`${job.id}: ${job.from} → ${job.to}`}
            aria-label={`${job.id}: ${job.from} → ${job.to}, ${job.allocation ? hourLabel(job.allocation.start) + " to " + hourLabel(job.allocation.start + job.duration) : "unassigned"}`}
            className="allocation-bar-label"
          >
            {job.dispatched && <Icon name="check" size="sm" />}
            <span>
              {job.from} → {job.to}
            </span>
          </button>
        </div>
      ) : (
        <RouteJobCard
          job={job}
          onOpen={onOpen ? () => onOpen(job) : undefined}
          dragHandle={handle}
        />
      )}
    </div>
  );
}
function Slot({
  resource,
  start,
  date,
  active,
  jobs,
  resources,
}: {
  resource: AllocationResource;
  start: number;
  date: string;
  active: RouteJob | undefined;
  jobs: RouteJob[];
  resources: AllocationResource[];
}) {
  const value = { resourceId: resource.id, start, date },
    { setNodeRef, isOver } = useDroppable({
      id: `${resource.id}:${start}`,
      data: { allocation: value },
    });
  const invalid = active
    ? allocationError(jobs, resources, active.id, value)
    : undefined;
  return (
    <div
      ref={setNodeRef}
      className="allocation-slot"
      data-over={isOver || undefined}
      data-invalid={(isOver && !!invalid) || undefined}
      aria-hidden="true"
    >
      {isOver && (
        <span>
          {invalid
            ? "Unavailable"
            : `${hourLabel(start)} – ${hourLabel(start + (active?.duration ?? 1))}`}
        </span>
      )}
    </div>
  );
}
export type AllocationTimelineProps = {
  jobs: RouteJob[];
  resources: AllocationResource[];
  date: string;
  query?: string;
  category?: string;
  resourceView?: "driver" | "vehicle";
  onAssign?: (id: string, value: Allocation) => void;
  onOpen?: (job: RouteJob) => void;
  onClearFilters?: () => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
};
export function AllocationTimeline({
  jobs,
  resources,
  date,
  query = "",
  category = "All types",
  resourceView = "driver",
  onAssign,
  onOpen,
  onClearFilters,
  loading,
  error,
  onRetry,
}: AllocationTimelineProps) {
  const id = useId(),
    [activeId, setActiveId] = useState<string | null>(null),
    [collapsed, setCollapsed] = useState(false),
    reduced = useReducedMotion();
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
  );
  const active = jobs.find((j) => j.id === activeId),
    matches = (j: RouteJob) =>
      (category === "All types" || j.category === category) &&
      `${j.id} ${j.customer} ${j.from} ${j.to}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
  const visible = jobs.filter(matches),
    pending = visible.filter((j) => !j.allocation),
    filtered = !!query.trim() || category !== "All types";
  if (error)
    return (
      <AgentWorkspaceState
        title="Schedule unavailable"
        description={error}
        error
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  if (loading && jobs.length === 0)
    return (
      <div
        className="allocation-skeleton"
        aria-busy="true"
        aria-label="Loading allocation schedule"
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} />
        ))}
      </div>
    );
  return (
    <DndContext
      id={id}
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(e) => setActiveId(String(e.active.id))}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={(e) => {
        setActiveId(null);
        const value = e.over?.data.current?.allocation as
          | Allocation
          | undefined;
        if (value) onAssign?.(String(e.active.id), value);
      }}
      accessibility={{
        screenReaderInstructions: {
          draggable:
            "Use the Allocate job or Edit allocation button to choose a driver and time with the keyboard.",
        },
      }}
    >
      <div
        className="allocation-scroll"
        role="region"
        aria-label={`${resourceView === "driver" ? "Driver" : "Vehicle"} allocation timeline, 08:00 to 18:00`}
        aria-busy={loading || undefined}
        tabIndex={0}
      >
        <div className="allocation-grid">
          <div className="allocation-hours">
            <div className="allocation-resource">
              {resourceView === "driver" ? "Driver" : "Vehicle"}
              <span className="text-text-tertiary">
                {resources.length} resources
              </span>
            </div>
            {HOURS.map((h) => (
              <span key={h}>{hourLabel(h)}</span>
            ))}
          </div>
          {resources.map((resource, i) => (
            <div key={resource.id} className="allocation-row">
              <div className="allocation-resource">
                <Avatar
                  name={resource.name}
                  size="xs"
                  color={i % 2 ? "purple" : "mint"}
                />
                <span>
                  <strong>
                    {resourceView === "driver"
                      ? resource.name
                      : resource.vehicle}
                  </strong>
                  <small>
                    {resourceView === "driver"
                      ? resource.vehicle
                      : resource.name}{" "}
                    · {resource.seats} seats
                  </small>
                </span>
              </div>
              <div className="allocation-track">
                {HOURS.map((start) => (
                  <Slot
                    key={start}
                    {...{ resource, start, date, active, jobs, resources }}
                  />
                ))}
                {visible
                  .filter(
                    (j) =>
                      j.allocation?.resourceId === resource.id &&
                      j.allocation.date === date,
                  )
                  .map((job) => (
                    <div
                      className="allocation-position"
                      key={job.id}
                      style={
                        {
                          left: `${(job.allocation!.start - 8) * 10}%`,
                          width: `${job.duration * 10}%`,
                        } as CSSProperties
                      }
                    >
                      <DraggableJob
                        job={job}
                        compact
                        canDrag={!!onAssign}
                        onOpen={onOpen}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
          {resources.length === 0 && (
            <AgentWorkspaceState
              title="No resources available"
              description="Add drivers in the host application before allocating jobs."
            />
          )}
        </div>
      </div>
      <div className="allocation-backlog-heading">
        <div>
          <h2 className="text-sm font-semibold">
            Unassigned jobs{" "}
            <span className="ml-2 text-text-tertiary">{pending.length}</span>
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            {onOpen && onAssign
              ? "Drag a card onto a driver’s time slot, or choose Allocate job."
              : onOpen
                ? "Choose a job to review its allocation."
                : "Scheduled journeys and unassigned jobs."}
          </p>
        </div>
        <IconButton
          type="tertiary"
          icon={<Icon name={collapsed ? "chevron-down" : "chevron-up"} />}
          aria-label={
            collapsed ? "Show unassigned jobs" : "Hide unassigned jobs"
          }
          aria-expanded={!collapsed}
          aria-controls={`${id}-backlog`}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>
      <div id={`${id}-backlog`} hidden={collapsed}>
        {pending.length ? (
          <div
            className="allocation-backlog"
            role="region"
            aria-label="Unassigned jobs"
            tabIndex={0}
          >
            {pending.map((job) => (
              <DraggableJob
                key={job.id}
                job={job}
                canDrag={!!onAssign}
                onOpen={onOpen}
              />
            ))}
          </div>
        ) : (
          <AgentWorkspaceState
            title={
              filtered
                ? "No matching unassigned jobs"
                : jobs.length
                  ? "All jobs allocated"
                  : "No jobs yet"
            }
            description={
              filtered
                ? "Try a different job, customer or location."
                : jobs.length
                  ? "Your schedule is ready to review. Open a scheduled job to change its allocation."
                  : "New jobs will appear here when they are added to the schedule."
            }
            actionLabel={filtered ? "Clear filters" : undefined}
            onAction={filtered ? onClearFilters : undefined}
          />
        )}
      </div>
      <DragOverlay
        dropAnimation={
          reduced
            ? null
            : { duration: 180, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        }
      >
        {active ? (
          <div className="allocation-drag">
            <RouteJobCard job={active} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

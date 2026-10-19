import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { StatusIcon } from "@/components/status-icon";
import { AgentWorkspaceState } from "@/components/automation";
import { SkeletonReveal } from "@/components/finance-overview";
import {
  LANE_LABELS,
  elapsedLabel,
  laneState,
  packTasks,
  taskGeometry,
  type LaneAgent,
  type LaneTask,
  type LaneStatus,
  type TimeWindow,
} from "./model";
import "./lanes.css";
export * from "./model";
const glyph = {
  running: "in-progress",
  waiting: "planned",
  done: "done",
  failed: "blocked",
} as const;
export function AgentLaneIdentity({
  agent,
  status = "idle",
}: {
  agent: LaneAgent;
  status?: LaneStatus | "idle";
}) {
  return (
    <div className="al-identity">
      <Avatar name={agent.name} logo={<Icon name="assistant" />} size="md" />
      <div>
        <div className="al-identity-name">
          <strong title={agent.name}>{agent.name}</strong>
          {(status === "idle" || status === "waiting") && (
            <small data-status={status}>
              {status === "idle" ? "Idle" : "Needs you"}
            </small>
          )}
        </div>
        <span title={agent.model}>{agent.model}</span>
      </div>
    </div>
  );
}
export function AgentTimelineAxis({ minutes = 30 }: { minutes?: number }) {
  const range = Number.isFinite(minutes) && minutes > 0 ? minutes : 30;
  return (
    <div className="al-axis" aria-label={`Last ${range} minutes`}>
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} style={{ left: `${(i / 6) * 100}%` }}>
          −{Math.round(range * (1 - i / 6))}m
        </span>
      ))}
      <b>now</b>
    </div>
  );
}
/** Position belongs to the lane. This bar is independently reusable in any track. */
export function AgentTaskBar({
  task,
  now,
  selected = false,
  onSelect,
}: {
  task: LaneTask;
  now: number;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const id = useId();
  const [tip, setTip] = useState(false);
  const [anchor, setAnchor] = useState({ left: 0, top: 0 });
  function show(element: HTMLElement) {
    const r = element.getBoundingClientRect();
    setAnchor({
      left: Math.max(8, Math.min(r.left, window.innerWidth - 328)),
      top:
        r.bottom + 160 > window.innerHeight
          ? Math.max(8, r.top - 150)
          : r.bottom + 8,
    });
    setTip(true);
  }
  useEffect(() => {
    if (!tip) return;
    const hide = () => setTip(false);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [tip]);
  return (
    <div
      className="al-task"
      data-status={task.status}
      data-selected={selected || undefined}
      onMouseEnter={(e) => show(e.currentTarget)}
      onMouseLeave={() => setTip(false)}
    >
      <button
        type="button"
        className="al-task-button"
        aria-pressed={onSelect ? selected : undefined}
        aria-label={`${task.title}, ${LANE_LABELS[task.status]}, ${elapsedLabel(task, now)}`}
        aria-describedby={tip ? id : undefined}
        onClick={() => {
          setTip(false);
          onSelect?.(task.id);
        }}
        onFocus={(e) => show(e.currentTarget)}
        onBlur={() => setTip(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setTip(false);
            e.stopPropagation();
          }
        }}
      >
        <span className="al-task-label">
          <StatusIcon
            status={glyph[task.status]}
            monochrome
            animated={false}
            size="sm"
          />
          <span>{task.title}</span>
        </span>
        {task.status === "waiting" && <small>Needs you</small>}
      </button>
      {tip && (
        <div className="al-tip" style={anchor} id={id} role="tooltip">
          <strong>{task.title}</strong>
          <span>
            {LANE_LABELS[task.status]} · {elapsedLabel(task, now)} ·{" "}
            {task.tools.join(" / ")}
          </span>
          <ul>
            {task.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
/** Host-owned clock/data/actions. Native horizontal scrolling preserves time geometry. */
export function AgentLanes({
  agents,
  tasks,
  now = 0,
  minutes = 30,
  selectedId,
  onSelect,
  loading = false,
  error,
  onRetry,
  onClear,
  actions,
}: {
  agents: readonly LaneAgent[];
  tasks: readonly LaneTask[];
  now?: number;
  minutes?: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onClear?: () => void;
  actions?: ReactNode;
}) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const window: TimeWindow = { now, minutes };
  const rows = agents.map((agent) => {
    const all = tasks.filter(
      (t) => t.agentId === agent.id && taskGeometry(t, window),
    );
    const packed = packTasks(all, now);
    return {
      agent,
      packed,
      height: Math.max(1, ...packed.map((t) => t.track + 1)) * 64 + 16,
    };
  });
  let top = 40;
  const positions = new Map<string, { x: number; end: number; y: number }>();
  rows.forEach((row) => {
    row.packed.forEach(({ task, track }) => {
      const g = taskGeometry(task, window)!;
      positions.set(task.id, {
        x: g.left,
        end: g.left + g.width,
        y: top + track * 64 + 40,
      });
    });
    top += row.height;
  });
  const visible = rows.flatMap((r) => r.packed.map((p) => p.task));
  const running = tasks.filter(
    (t) => t.status === "running" && agents.some((a) => a.id === t.agentId),
  ).length;
  const waiting = tasks.filter(
    (t) => t.status === "waiting" && agents.some((a) => a.id === t.agentId),
  ).length;
  const skeleton = (
    <div className="al-skeleton">
      {[0, 1, 2, 3].map((i) => (
        <div key={i}>
          <i />
          <span />
        </div>
      ))}
    </div>
  );
  return (
    <section className="al-board" aria-labelledby={id} aria-busy={loading}>
      <header className="al-header">
        <h2 id={id}>
          <Icon name="sparkle" />
          Agents
        </h2>
        {!(loading && !tasks.length) && (
          <span className="al-count">
            <i />
            {running} running
          </span>
        )}
        {waiting > 0 && (
          <span className="al-count al-attention">
            <i />
            {waiting} need you
          </span>
        )}
        <div className="al-actions">
          {actions ?? <span>Last {minutes}m</span>}
        </div>
      </header>
      {error ? (
        <AgentWorkspaceState
          error
          title="Timeline unavailable"
          description={error}
          actionLabel="Try again"
          onAction={onRetry}
        />
      ) : (
        <SkeletonReveal
          loading={loading}
          hasData={visible.length > 0}
          label="Loading agent timeline"
          animate={false}
          skeleton={skeleton}
        >
          {!visible.length ? (
            <AgentWorkspaceState
              title={onClear ? "No matching tasks" : "No tasks in this window"}
              description="Try another agent, task, or time range."
              actionLabel={onClear ? "Clear search" : undefined}
              onAction={onClear}
            />
          ) : (
            <div
              className="al-scroll"
              role="region"
              aria-label="Agent timeline. Scroll horizontally to explore time."
              tabIndex={0}
            >
              <div
                className="al-grid"
                style={{ "--al-height": `${top}px` } as CSSProperties}
              >
                <div className="al-corner">Agent / model</div>
                <AgentTimelineAxis minutes={minutes} />
                {rows.map((row) => (
                  <div
                    className="al-row"
                    key={row.agent.id}
                    style={{ height: row.height }}
                  >
                    <div className="al-label">
                      <AgentLaneIdentity
                        agent={row.agent}
                        status={laneState(
                          tasks.filter((t) => t.agentId === row.agent.id),
                        )}
                      />
                    </div>
                    <div className="al-track">
                      {row.packed.map(({ task, track }) => {
                        const geometry = taskGeometry(task, window)!;
                        return (
                          <div
                            className="al-position"
                            key={task.id}
                            style={{
                              left: `min(${geometry.left}%, calc(100% - 48px))`,
                              width: `max(48px, ${geometry.width}%)`,
                              top: track * 64 + 20,
                            }}
                            data-clipped={geometry.clipped || undefined}
                          >
                            <AgentTaskBar
                              task={task}
                              now={now}
                              selected={selectedId === task.id}
                              onSelect={onSelect}
                            />
                          </div>
                        );
                      })}
                      {!row.packed.length && (
                        <span className="al-quiet">
                          No activity in this window
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <svg
                  className="al-links"
                  viewBox={`0 0 1000 ${top}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  {visible.map((task) => {
                    const from = positions.get(task.dependsOn ?? ""),
                      to = positions.get(task.id);
                    if (!from || !to) return null;
                    const x1 = from.end * 10,
                      x2 = to.x * 10,
                      mid = (x1 + x2) / 2;
                    return (
                      <motion.path
                        initial={false}
                        transition={{
                          duration: reduceMotion ? 0 : 0.4,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        key={task.id}
                        vectorEffect="non-scaling-stroke"
                        animate={{
                          d: `M ${x1} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${x2} ${to.y}`,
                        }}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          )}
        </SkeletonReveal>
      )}
      <footer className="al-footer">
        <span>Task lengths show elapsed time. Dotted lines show handoffs.</span>
        <span>
          {error
            ? "Timeline retained"
            : loading
              ? visible.length
                ? "Refreshing…"
                : "Loading tasks…"
              : `${visible.length} tasks in view`}
        </span>
      </footer>
    </section>
  );
}

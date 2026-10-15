import { useSyncExternalStore, type CSSProperties } from "react";
import { ShimmerText } from "@/components/activity-label";
import { AgentWorkspaceState } from "@/components/automation";
import { StatusIcon } from "@/components/status-icon";
import "./thinking-state.css";

export const THINKING_STATES = [
  "thinking",
  "analyzing",
  "debugging",
  "searching",
  "building",
  "pondering",
] as const;
export type ThinkingPhase = (typeof THINKING_STATES)[number];
export type ThinkingTone = "neutral" | "mint" | "purple" | "orange";
export type ThinkingStateProps = {
  phase?: ThinkingPhase;
  label?: string;
  active?: boolean;
  shape?: "square" | "circle";
  tone?: ThinkingTone;
  /** Animation multiplier, clamped to 0.5–2. Does not change application timing. */
  speed?: number;
  grid?: boolean;
  shimmer?: boolean;
  /** Disable when a parent already announces the run state. */
  announce?: boolean;
};
const subscribe = (notify: () => void) => {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
};
const visible = () => !document.hidden;
const serverVisible = () => true;
const title = (value: string) => value[0].toUpperCase() + value.slice(1);
/** Deterministic pixel phases: no frame ticker, randomness or app timing inside the indicator. */
function phaseOffset(phase: ThinkingPhase, x: number, y: number) {
  switch (phase) {
    case "thinking":
      return (Math.atan2(y - 2, x - 2) + Math.PI) / (2 * Math.PI);
    case "analyzing":
      return (x + y * 5) / 25;
    case "debugging":
      return ((x * 3 + y * 2) % 7) / 7;
    case "searching":
      return Math.max(Math.abs(x - 2), Math.abs(y - 2)) / 3;
    case "building":
      return (4 - y) / 5 + x / 25;
    case "pondering":
      return (x + y) / 9;
  }
}
export function ThinkingState({
  phase = "thinking",
  label,
  active = true,
  shape = "square",
  tone = "neutral",
  speed = 1,
  grid = true,
  shimmer = false,
  announce = true,
}: ThinkingStateProps) {
  const pageVisible = useSyncExternalStore(subscribe, visible, serverVisible);
  const duration =
    2.4 / Math.min(2, Math.max(0.5, Number.isFinite(speed) ? speed : 1));
  const text = label ?? title(phase);
  return (
    <span
      className="thinking-state"
      data-active={active}
      data-visible={pageVisible}
      data-tone={tone}
      role={announce ? "status" : undefined}
      aria-live={announce ? "polite" : undefined}
      aria-atomic={announce || undefined}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="thinking-pixels">
        {Array.from({ length: 25 }, (_, i) => {
          const x = i % 5,
            y = Math.floor(i / 5);
          return (
            <g key={i}>
              {grid && (
                <rect
                  x={2 + x * 4}
                  y={2 + y * 4}
                  width="3"
                  height="3"
                  rx={shape === "circle" ? 1.5 : 0.35}
                  className="thinking-grid"
                />
              )}
              <rect
                x={2 + x * 4}
                y={2 + y * 4}
                width="3"
                height="3"
                rx={shape === "circle" ? 1.5 : 0.35}
                className="thinking-pixel"
                style={
                  {
                    animationDuration: `${duration}s`,
                    animationDelay: `${-phaseOffset(phase, x, y) * duration}s`,
                    opacity: 0.22 + phaseOffset(phase, x, y) * 0.6,
                  } as CSSProperties
                }
              />
            </g>
          );
        })}
      </svg>
      <span className="thinking-label">
        {shimmer && active ? <ShimmerText>{text}</ShimmerText> : text}
      </span>
    </span>
  );
}
export type ThinkingRunStatus =
  "idle" | "running" | "paused" | "complete" | "error" | "stopped";
export type ThinkingStep = { id: ThinkingPhase; label: string; detail: string };
export type ThinkingTimelineProps = {
  steps: ThinkingStep[];
  current: number;
  status: ThinkingRunStatus;
  tone?: ThinkingTone;
  shape?: "square" | "circle";
  speed?: number;
};
/** Operational progress only. The host supplies labels, events and recovery actions. */
export function ThinkingTimeline({
  steps,
  current,
  status,
  tone = "neutral",
  shape = "square",
  speed = 1,
}: ThinkingTimelineProps) {
  if (!steps.length)
    return (
      <AgentWorkspaceState
        title="No activity yet"
        description="Steps will appear when the host starts a run."
      />
    );
  const index = Math.max(
    0,
    Math.min(
      steps.length - 1,
      Number.isFinite(current) ? Math.floor(current) : 0,
    ),
  );
  return (
    <ol className="thinking-timeline" aria-label="Run activity">
      {steps.map((step, i) => {
        const done = status === "complete" || (status !== "idle" && i < index);
        const now = status !== "idle" && status !== "complete" && i === index;
        const state = done
          ? "done"
          : now
            ? status === "error"
              ? "blocked"
              : status === "stopped"
                ? "canceled"
                : "in-progress"
            : "todo";
        return (
          <li
            key={step.id}
            data-current={now || undefined}
            data-done={done || undefined}
            aria-current={now ? "step" : undefined}
          >
            <span className="thinking-step-icon">
              <StatusIcon
                status={state}
                animated={false}
                monochrome={state !== "blocked"}
                size="md"
              />
            </span>
            <div>
              {now ? (
                <ThinkingState
                  phase={step.id}
                  label={step.label}
                  active={status === "running"}
                  announce={false}
                  tone={tone}
                  shape={shape}
                  speed={speed}
                />
              ) : (
                <strong>{step.label}</strong>
              )}
              <p>{step.detail}</p>
              <span className="thinking-step-status">
                {done ? "Complete" : now ? title(status) : "Pending"}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

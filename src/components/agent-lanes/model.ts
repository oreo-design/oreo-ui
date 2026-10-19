export type LaneStatus = "running" | "waiting" | "done" | "failed";
export const LANE_LABELS: Record<LaneStatus, string> = {
  running: "Running",
  waiting: "Needs you",
  done: "Completed",
  failed: "Failed",
};
export type LaneAgent = { id: string; name: string; model: string };
/** Minutes on a host-owned clock. null end means still active. IDs are globally unique. */
export type LaneTask = {
  id: string;
  agentId: string;
  title: string;
  start: number;
  end: number | null;
  status: LaneStatus;
  tools: string[];
  notes: string[];
  dependsOn?: string;
};
export type TimeWindow = { now: number; minutes: number };
export function taskGeometry(task: LaneTask, window: TimeWindow) {
  const { now, minutes } = window;
  if (
    !Number.isFinite(now) ||
    !Number.isFinite(minutes) ||
    minutes <= 0 ||
    !Number.isFinite(task.start) ||
    (task.end !== null && (!Number.isFinite(task.end) || task.end < task.start))
  )
    return null;
  const end = Math.min(task.end ?? now, now),
    start = Math.max(task.start, now - minutes);
  if (task.start > now || end <= now - minutes || end < start) return null;
  return {
    left: ((start - now + minutes) / minutes) * 100,
    width: ((end - start) / minutes) * 100,
    clipped: task.start < now - minutes,
  };
}
export function laneState(tasks: readonly LaneTask[]): LaneStatus | "idle" {
  return tasks.some((t) => t.status === "waiting")
    ? "waiting"
    : tasks.some((t) => t.status === "running")
      ? "running"
      : "idle";
}
export function elapsedLabel(task: LaneTask, now: number) {
  return `${Math.max(0, Math.round((task.end ?? now) - task.start))}m`;
}
/** Allocate overlapping tasks to subtracks; inputs are never mutated. */
export function packTasks(tasks: readonly LaneTask[], now: number) {
  const ends: number[] = [];
  return [...tasks]
    .sort((a, b) => a.start - b.start || a.id.localeCompare(b.id))
    .map((task) => {
      let track = ends.findIndex((end) => end <= task.start);
      if (track < 0) track = ends.length;
      ends[track] = Math.max(task.start, task.end ?? now);
      return { task, track };
    });
}

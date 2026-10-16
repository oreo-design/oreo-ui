export const RUN_STATUSES = ["waiting", "failed", "running", "done"] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];
export type RunGroup = "attention" | "running" | "done";
export type RunActivity = { id: string; text: string; time: string };
export type InboxRun = {
  id: string;
  title: string;
  summary: string;
  status: RunStatus;
  elapsed: number;
  queries: number;
  tools: number;
  model: string;
  activity: RunActivity[];
};
export const RUN_LABELS: Record<RunStatus, string> = {
  waiting: "Awaiting approval",
  failed: "Failed",
  running: "Running",
  done: "Done",
};
export const RUN_GROUPS: { id: RunGroup; label: string }[] = [
  { id: "attention", label: "Needs you" },
  { id: "running", label: "Running" },
  { id: "done", label: "Done" },
];
export const groupForRun = (status: RunStatus): RunGroup =>
  status === "waiting" || status === "failed" ? "attention" : status;
export function durationLabel(seconds: number) {
  const safe = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  return `${Math.floor(safe / 60)}m ${safe % 60}s`;
}
export function filterRuns(runs: InboxRun[], query: string) {
  const q = query.trim().toLowerCase();
  return runs.filter((r) =>
    `${r.title} ${r.summary} ${r.model} ${RUN_LABELS[r.status]}`
      .toLowerCase()
      .includes(q),
  );
}
/** Immutable local-demo transition. Hosts own execution, approval and persistence. */
export function transitionRun(
  runs: InboxRun[],
  id: string,
  status: RunStatus,
  activityId: string,
): InboxRun[] {
  const target = runs.find((r) => r.id === id);
  if (!target || target.status === status || !RUN_STATUSES.includes(status))
    return runs;
  return runs.map((r) =>
    r.id !== id
      ? r
      : {
          ...r,
          status,
          activity: [
            ...r.activity,
            {
              id: activityId,
              time: "Now",
              text:
                status === "running"
                  ? r.status === "waiting"
                    ? "Approval recorded in demo; sample run resumed."
                    : r.status === "failed"
                      ? "Retry recorded in demo; sample run resumed."
                      : "Sample run reopened."
                  : `Sample status changed to ${RUN_LABELS[status].toLowerCase()}.`,
            },
          ],
        },
  );
}

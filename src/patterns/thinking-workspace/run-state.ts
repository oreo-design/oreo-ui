import type { ThinkingRunStatus } from "@/components/thinking-state";
type Run = { status: ThinkingRunStatus; ticks: number; fail: boolean };
type Event =
  | { type: "start"; fail: boolean }
  | { type: "tick" | "pause" | "resume" | "stop" | "reset" };
export const initial: Run = { status: "idle", ticks: 0, fail: false };
export function runReducer(run: Run, event: Event): Run {
  if (event.type === "start")
    return { status: "running", ticks: 0, fail: event.fail };
  if (event.type === "reset") return initial;
  if (event.type === "pause" && run.status === "running")
    return { ...run, status: "paused" };
  if (event.type === "resume" && run.status === "paused")
    return { ...run, status: "running" };
  if (
    event.type === "stop" &&
    (run.status === "running" || run.status === "paused")
  )
    return { ...run, status: "stopped" };
  if (event.type !== "tick" || run.status !== "running") return run;
  const ticks = run.ticks + 1;
  return {
    ...run,
    ticks,
    status:
      run.fail && ticks === 9 ? "error" : ticks >= 18 ? "complete" : "running",
  };
}

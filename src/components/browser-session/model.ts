export type BrowserRunStatus =
  "ready" | "running" | "paused" | "user" | "complete" | "error" | "stopped";
export type BrowserAction =
  "navigating" | "reading" | "searching" | "typing" | "waiting";
export type BrowserRun = {
  status: BrowserRunStatus;
  completed: number;
  error: string;
};
export type RunEvent =
  | {
      type:
        | "start"
        | "tick"
        | "pause"
        | "resume"
        | "takeover"
        | "return"
        | "stop"
        | "retry"
        | "reset";
    }
  | { type: "fail"; message: string };
export const INITIAL_RUN: BrowserRun = {
  status: "ready",
  completed: 0,
  error: "",
};
/** A late timer is harmless after pause/takeover/stop. Only running accepts a tick. */
export function advanceRun(
  run: BrowserRun,
  event: RunEvent,
  total: number,
): BrowserRun {
  const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
  switch (event.type) {
    case "reset":
      return { ...INITIAL_RUN };
    case "start":
      return run.status === "running"
        ? run
        : { status: count ? "running" : "complete", completed: 0, error: "" };
    case "tick":
      if (run.status !== "running") return run;
      return {
        ...run,
        completed: Math.min(count, run.completed + 1),
        status: run.completed + 1 >= count ? "complete" : "running",
      };
    case "pause":
      return run.status === "running" ? { ...run, status: "paused" } : run;
    case "resume":
      return run.status === "paused" ? { ...run, status: "running" } : run;
    case "takeover":
      return ["running", "paused"].includes(run.status)
        ? { ...run, status: "user" }
        : run;
    case "return":
      return run.status === "user" ? { ...run, status: "running" } : run;
    case "stop":
      return ["running", "paused", "user", "error"].includes(run.status)
        ? { ...run, status: "stopped", error: "" }
        : run;
    case "fail":
      return run.status === "running"
        ? { ...run, status: "error", error: event.message }
        : run;
    case "retry":
      return run.status === "error"
        ? { ...run, status: "running", error: "" }
        : run;
  }
}
export const BROWSER_STATUS_LABELS: Record<BrowserRunStatus, string> = {
  ready: "Ready to browse",
  running: "Agent is controlling the browser",
  paused: "Agent paused",
  user: "You are in control",
  complete: "Browsing complete",
  error: "Browser needs attention",
  stopped: "Session stopped",
};
export const ACTION_LABELS: Record<BrowserAction, string> = {
  navigating: "Navigating",
  reading: "Reading",
  searching: "Searching",
  typing: "Typing",
  waiting: "Waiting",
};

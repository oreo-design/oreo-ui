export type HandoffStatus =
  | "idle"
  | "analyzing"
  | "awaiting"
  | "implementing"
  | "review"
  | "completed"
  | "failed"
  | "stopped";
export const HANDOFF_LABELS: Record<HandoffStatus, string> = {
  idle: "Not started",
  analyzing: "In progress",
  awaiting: "Awaiting reply",
  implementing: "In progress",
  review: "Ready for review",
  completed: "Completed",
  failed: "Needs attention",
  stopped: "Stopped",
};
export type HandoffMessage = {
  id: string;
  role: "agent" | "user";
  body: string;
};
export type HandoffRun = {
  id: string;
  attempt: number;
  agentId: string;
  status: HandoffStatus;
  request: string;
  messages: HandoffMessage[];
  failNext: boolean;
  resume: "analyzing" | "implementing";
};
export const emptyRun: HandoffRun = {
  id: "",
  attempt: 0,
  agentId: "",
  status: "idle",
  request: "",
  messages: [],
  failNext: false,
  resume: "analyzing",
};
export const busyRun = (s: HandoffStatus) =>
  ["analyzing", "awaiting", "implementing", "review"].includes(s);
export function cleanHandoff(text: string, max = 2000) {
  const body = text.trim();
  if (!body || body.length > max)
    throw new Error(`Enter 1–${max.toLocaleString("en-US")} characters.`);
  return body;
}
export type HandoffAction =
  | { type: "start"; id: string; agentId: string; body: string; fail: boolean }
  | { type: "tick"; id: string; attempt: number }
  | { type: "reply"; body: string }
  | { type: "stop" }
  | { type: "retry" }
  | { type: "accept" }
  | { type: "revise" }
  | { type: "reset" };
export function handoffReducer(
  run: HandoffRun,
  action: HandoffAction,
): HandoffRun {
  const add = (role: HandoffMessage["role"], body: string) => [
    ...run.messages,
    { id: `${run.id}-${run.messages.length + 1}`, role, body },
  ];
  switch (action.type) {
    case "start":
      if (run.status !== "idle" || !action.id || !action.agentId) return run;
      return {
        ...emptyRun,
        id: action.id,
        agentId: action.agentId,
        request: cleanHandoff(action.body),
        status: "analyzing",
        attempt: run.attempt + 1,
        failNext: action.fail,
      };
    case "tick":
      if (
        action.id !== run.id ||
        action.attempt !== run.attempt ||
        !["analyzing", "implementing"].includes(run.status)
      )
        return run;
      if (run.failNext)
        return {
          ...run,
          status: "failed",
          failNext: false,
          resume: run.status as "analyzing" | "implementing",
        };
      if (run.status === "analyzing")
        return {
          ...run,
          status: "awaiting",
          messages: add(
            "agent",
            "The sample export runs inside the web request. Should we use the existing job queue or keep the current synchronous path? Add the constraints you want me to follow.",
          ),
        };
      return {
        ...run,
        status: "review",
        messages: add(
          "agent",
          "The sample patch is ready: exports use the existing queue, the request returns a job reference, and CSV/PDF cases are listed for review. Inspect the sample result before marking this work complete.",
        ),
      };
    case "reply":
      if (run.status !== "awaiting") return run;
      return {
        ...run,
        status: "implementing",
        messages: add("user", cleanHandoff(action.body, 4000)),
        attempt: run.attempt + 1,
      };
    case "stop":
      if (!busyRun(run.status)) return run;
      return {
        ...run,
        status: "stopped",
        resume: run.status === "analyzing" ? "analyzing" : "implementing",
        attempt: run.attempt + 1,
      };
    case "retry":
      if (!["failed", "stopped"].includes(run.status)) return run;
      return {
        ...run,
        status:
          run.resume === "analyzing"
            ? "analyzing"
            : run.messages.some((m) => m.role === "user")
              ? "implementing"
              : "awaiting",
        attempt: run.attempt + 1,
        failNext: false,
      };
    case "accept":
      return run.status === "review"
        ? {
            ...run,
            status: "completed",
            messages: add(
              "user",
              "Reviewed the sample result and marked this local work item complete.",
            ),
          }
        : run;
    case "revise":
      return run.status === "review"
        ? {
            ...run,
            status: "awaiting",
            messages: add(
              "agent",
              "What should change in this sample patch? Add your review feedback before the next iteration.",
            ),
          }
        : run;
    case "reset":
      return ["idle", "completed", "stopped", "failed"].includes(run.status)
        ? { ...emptyRun, attempt: run.attempt + 1 }
        : run;
  }
}
/** Find the @query ending at the textarea caret; never consume surrounding prose. */
export function mentionAt(text: string, caret: number) {
  const prefix = text.slice(0, caret),
    match = /(?:^|\s)@([\w-]*)$/.exec(prefix);
  return match
    ? { start: caret - match[1].length - 1, end: caret, query: match[1] }
    : null;
}
export function removeMention(
  text: string,
  range: { start: number; end: number },
) {
  return text.slice(0, range.start) + text.slice(range.end);
}

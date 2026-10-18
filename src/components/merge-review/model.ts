export type MergePhase =
  | "idle"
  | "creating"
  | "conflicts"
  | "resolving"
  | "checking"
  | "ready"
  | "merging"
  | "merged"
  | "error";
export type MergeRun = {
  phase: MergePhase;
  resolved: number;
  checksPassed: number;
  failChecks: boolean;
  attempt: number;
};
export type MergeEvent =
  | { type: "create"; failChecks?: boolean }
  | { type: "resolve" | "merge" | "retry" | "cancel" | "reset" }
  | { type: "tick"; attempt: number };
export const initialMergeRun: MergeRun = {
  phase: "idle",
  resolved: 0,
  checksPassed: 0,
  failChecks: false,
  attempt: 0,
};
export const isMergeBusy = (phase: MergePhase) =>
  ["creating", "resolving", "checking", "merging"].includes(phase);
/** Local demo driver. Real integrations own transitions and supply verified check results. */
export function mergeReducer(state: MergeRun, event: MergeEvent): MergeRun {
  switch (event.type) {
    case "reset":
      return { ...initialMergeRun, attempt: state.attempt + 1 };
    case "create":
      return state.phase === "idle"
        ? {
            ...initialMergeRun,
            phase: "creating",
            failChecks: !!event.failChecks,
            attempt: state.attempt + 1,
          }
        : state;
    case "resolve":
      return state.phase === "conflicts"
        ? { ...state, phase: "resolving", attempt: state.attempt + 1 }
        : state;
    case "retry":
      return state.phase === "error"
        ? {
            ...state,
            phase: "checking",
            checksPassed: 0,
            failChecks: false,
            attempt: state.attempt + 1,
          }
        : state;
    case "merge":
      return state.phase === "ready" && state.checksPassed === 4
        ? { ...state, phase: "merging", attempt: state.attempt + 1 }
        : state;
    case "cancel":
      return isMergeBusy(state.phase) && state.phase !== "merging"
        ? {
            ...state,
            phase: state.phase === "creating" ? "idle" : "conflicts",
            resolved: 0,
            checksPassed: 0,
            attempt: state.attempt + 1,
          }
        : state;
    case "tick": {
      if (event.attempt !== state.attempt) return state;
      if (state.phase === "creating") return { ...state, phase: "conflicts" };
      if (state.phase === "resolving")
        return {
          ...state,
          resolved: Math.min(3, state.resolved + 1),
          phase: state.resolved >= 2 ? "checking" : "resolving",
        };
      if (state.phase === "checking") {
        if (state.failChecks && state.checksPassed === 1)
          return { ...state, phase: "error" };
        return {
          ...state,
          checksPassed: Math.min(4, state.checksPassed + 1),
          phase: state.checksPassed >= 3 ? "ready" : "checking",
        };
      }
      if (state.phase === "merging") return { ...state, phase: "merged" };
      return state;
    }
  }
}
export function mergeCaption(phase: MergePhase, conflicts = 3): string {
  return {
    idle: "No pull request",
    creating: "Creating PR",
    conflicts: `${conflicts} conflicts`,
    resolving: "Resolving",
    checking: "Running checks",
    ready: "Ready to merge",
    merging: "Merging",
    merged: "Merged",
    error: "Checks failed",
  }[phase];
}

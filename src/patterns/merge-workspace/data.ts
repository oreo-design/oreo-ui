import type {
  BranchCommit,
  MergeCheck,
  MergeRun,
} from "@/components/merge-review";
import type { DiffLine } from "@/components/code-diff";
export const MERGE_TITLE = "Refresh sessions in the auth middleware";
export const COMMITS: BranchCommit[] = [
  {
    id: "d29f50",
    title: "Add session refresh tests",
    lane: 1,
    parents: ["c70a92"],
    branch: "feat/session-refresh",
    author: "You",
    time: "now",
  },
  {
    id: "5be27d",
    title: "Read sessions with the current key",
    lane: 0,
    parents: ["a3f9c1"],
    branch: "main",
    author: "Lena",
    time: "6m",
    conflicts: 1,
  },
  {
    id: "a3f9c1",
    title: "Rotate session keys",
    lane: 0,
    parents: ["9c2d4a"],
    author: "Lena",
    time: "18m",
    conflicts: 2,
  },
  {
    id: "c70a92",
    title: "Refresh sessions near expiry",
    lane: 1,
    parents: ["1f8e3b"],
    author: "You",
    time: "25m",
  },
  {
    id: "e83c51",
    title: "Add analytics consent banner",
    lane: 2,
    parents: ["62b0e4"],
    branch: "feat/checkout-analytics",
    author: "Sam",
    time: "32m",
  },
  {
    id: "1f8e3b",
    title: "Read session expiry from the token",
    lane: 1,
    parents: ["9c2d4a"],
    author: "You",
    time: "40m",
  },
  {
    id: "62b0e4",
    title: "Track checkout funnel events",
    lane: 2,
    parents: ["9c2d4a"],
    author: "Sam",
    time: "2h",
  },
  {
    id: "9c2d4a",
    title: "Update application dependencies",
    lane: 0,
    parents: [],
    author: "Sam",
    time: "3h",
  },
];
export function commitsFor(run: MergeRun): BranchCommit[] {
  const commits = COMMITS.map((c) => ({
    ...c,
    resolved: !!c.conflicts && run.resolved >= (c.conflicts === 1 ? 1 : 3),
  }));
  return run.resolved > 0 ||
    ["resolving", "checking", "ready", "merging", "merged", "error"].includes(
      run.phase,
    )
    ? [
        {
          id: "7e0c3b",
          title: "Merge main into feat/session-refresh",
          lane: 1,
          parents: ["d29f50", "5be27d"],
          branch: "feat/session-refresh",
          author: "You",
          time: "now",
        },
        ...commits.map((c) => ({
          ...c,
          branch: c.id === "d29f50" ? undefined : c.branch,
        })),
      ]
    : commits;
}
export function checksFor(run: MergeRun): MergeCheck[] {
  if (!["checking", "ready", "merging", "merged", "error"].includes(run.phase))
    return [];
  return [
    {
      id: "tests",
      label: "Tests",
      summary: "42 passed",
      detail: "Local fixture: all 42 session refresh scenarios passed · 12s.",
    },
    {
      id: "lint",
      label: "Lint",
      summary: "passed",
      detail: "Local fixture: no lint problems · 9s.",
    },
    {
      id: "types",
      label: "Types",
      summary: "passed",
      detail: "Local fixture: TypeScript check completed · 6s.",
    },
    {
      id: "preview",
      label: "Preview",
      summary: "ready",
      detail:
        "Local fixture: preview artifact is ready. No deployment was created.",
    },
  ].map((c, i) => ({
    ...c,
    state:
      i < run.checksPassed
        ? "passed"
        : run.phase === "error" && i === 1
          ? "failed"
          : i === run.checksPassed && run.phase !== "error"
            ? "running"
            : "pending",
    summary:
      i < run.checksPassed
        ? c.summary
        : run.phase === "error" && i === 1
          ? "failed"
          : i === run.checksPassed && run.phase !== "error"
            ? "running"
            : "queued",
    detail:
      i < run.checksPassed
        ? c.detail
        : run.phase === "error" && i === 1
          ? "Local fixture: unused import in middleware.ts. Retry applies the sample fix and reruns all checks."
          : i === run.checksPassed && run.phase !== "error"
            ? "Local fixture: this check is running; no result yet."
            : "Local fixture: this check has not run yet.",
  }));
}
export const SAMPLE_DIFF: DiffLine[] = [
  {
    type: "context",
    content: "export function refreshSession(session: Session) {",
  },
  { type: "remove", content: "  return decode(session.token, previousKey);" },
  { type: "add", content: "  const key = getCurrentSessionKey();" },
  { type: "add", content: "  return decode(session.token, key);" },
  { type: "context", content: "}" },
];

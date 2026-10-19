export type TestStatus = "queued" | "running" | "passed" | "failed" | "skipped";
export type RunPhase = "idle" | "running" | "complete" | "stopped" | "error";
export type TestFilter = "all" | "failed" | "skipped" | "slow";
export type StackFrame = {
  file: string;
  line: number;
  column?: number;
  code?: string;
  framework?: boolean;
};
export type TestFailure = {
  kind: "assertion" | "timeout" | "snapshot";
  message: string;
  expected?: string;
  received?: string;
  frames: readonly StackFrame[];
};
export type TestCase = {
  id: string;
  file: string;
  group: string;
  name: string;
  status: TestStatus;
  durationMs?: number;
  failure?: TestFailure;
};
export type TestRun = {
  id: number;
  phase: RunPhase;
  tests: readonly TestCase[];
  elapsedMs: number;
  error?: string;
  targetIds?: readonly string[];
};
export const isFinished = (status: TestStatus) =>
  status === "passed" || status === "failed" || status === "skipped";
export function summarizeTests(tests: readonly TestCase[]) {
  const count = {
    total: tests.length,
    completed: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    running: 0,
    queued: 0,
    slow: 0,
  };
  for (const test of tests) {
    count[test.status]++;
    if (isFinished(test.status)) count.completed++;
    if (isFinished(test.status) && (test.durationMs ?? 0) >= 500) count.slow++;
  }
  return count;
}
export function matchesTest(test: TestCase, filter: TestFilter) {
  return (
    filter === "all" ||
    (filter === "slow"
      ? isFinished(test.status) && (test.durationMs ?? 0) >= 500
      : test.status === filter)
  );
}
export function durationLabel(ms: number) {
  const safe = Math.max(0, Number.isFinite(ms) ? ms : 0);
  return safe >= 1000
    ? `${(safe / 1000).toFixed(1)}s`
    : `${Math.round(safe)}ms`;
}
export function failureText(test: TestCase) {
  const f = test.failure;
  return `${test.file} › ${test.group} › ${test.name}
${f?.message ?? "Test failed"}${
    f?.expected !== undefined
      ? `
Expected:
${f.expected}`
      : ""
  }${
    f?.received !== undefined
      ? `
Received:
${f.received}`
      : ""
  }${
    f?.frames
      .map(
        (frame) => `
  at ${frame.file}:${frame.line}${frame.column ? `:${frame.column}` : ""}`,
      )
      .join("") ?? ""
  }`;
}
export type RunAction =
  | { type: "start"; scope: "all" | "failed" }
  | { type: "result"; runId: number; result: TestCase; elapsedMs: number }
  | { type: "stop" }
  | { type: "error"; runId: number; message: string }
  | { type: "reset"; tests: readonly TestCase[] };
export function initialTestRun(tests: readonly TestCase[], id = 0): TestRun {
  return {
    id,
    phase: "idle",
    tests: tests.map((t) => ({
      ...t,
      status: "queued",
      durationMs: undefined,
      failure: undefined,
    })),
    elapsedMs: 0,
  };
}
export function testRunReducer(run: TestRun, action: RunAction): TestRun {
  if (action.type === "reset") return initialTestRun(action.tests, run.id + 1);
  if (action.type === "start") {
    if (run.phase === "running") return run;
    const targets = run.tests
      .filter((t) => action.scope === "all" || t.status === "failed")
      .map((t) => t.id);
    if (!targets.length) return run;
    return {
      id: run.id + 1,
      phase: "running",
      elapsedMs: 0,
      targetIds: targets,
      tests: run.tests.map((t) =>
        targets.includes(t.id)
          ? {
              ...t,
              status: t.id === targets[0] ? "running" : "queued",
              durationMs: undefined,
              failure: undefined,
            }
          : t,
      ),
    };
  }
  if (action.type === "stop")
    return run.phase === "running"
      ? {
          ...run,
          phase: "stopped",
          tests: run.tests.map((t) =>
            t.status === "running" ? { ...t, status: "queued" } : t,
          ),
        }
      : run;
  if (action.runId !== run.id || run.phase !== "running") return run;
  if (action.type === "error")
    return {
      ...run,
      phase: "error",
      error: action.message,
      tests: run.tests.map((t) =>
        t.status === "running" ? { ...t, status: "queued" } : t,
      ),
    };
  const current = run.tests.find((t) => t.id === action.result.id);
  if (
    !current ||
    current.status !== "running" ||
    !isFinished(action.result.status)
  )
    return run;
  const tests = run.tests.map((t) =>
    t.id === current.id
      ? {
          ...t,
          status: action.result.status,
          durationMs: action.result.durationMs,
          failure:
            action.result.status === "failed"
              ? action.result.failure
              : undefined,
        }
      : t,
  );
  const next = tests.find(
    (t) =>
      t.status === "queued" && (!run.targetIds || run.targetIds.includes(t.id)),
  );
  return {
    ...run,
    phase: next ? "running" : "complete",
    elapsedMs: Math.max(run.elapsedMs, action.elapsedMs),
    tests: tests.map((t) =>
      t.id === next?.id ? { ...t, status: "running" } : t,
    ),
  };
}

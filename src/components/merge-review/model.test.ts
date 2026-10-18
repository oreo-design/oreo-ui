import test from "node:test";
import assert from "node:assert/strict";
import { initialMergeRun, mergeReducer, type MergeRun } from "./model.ts";
const tick = (run: MergeRun) =>
  mergeReducer(run, { type: "tick", attempt: run.attempt });
function resolved(failChecks = false) {
  let run = mergeReducer(initialMergeRun, { type: "create", failChecks });
  run = tick(run);
  run = mergeReducer(run, { type: "resolve" });
  for (let i = 0; i < 3; i++) run = tick(run);
  return run;
}
test("merge requires every check and a separate explicit action", () => {
  let run = resolved();
  assert.equal(run.phase, "checking");
  assert.equal(mergeReducer(run, { type: "merge" }), run);
  for (let i = 0; i < 4; i++) run = tick(run);
  assert.equal(run.phase, "ready");
  assert.equal(tick(run).phase, "ready");
  run = mergeReducer(run, { type: "merge" });
  assert.equal(run.phase, "merging");
  assert.equal(tick(run).phase, "merged");
});
test("failure blocks merge and retry reruns the checks", () => {
  let run = resolved(true);
  run = tick(tick(run));
  assert.equal(run.phase, "error");
  assert.equal(mergeReducer(run, { type: "merge" }), run);
  run = mergeReducer(run, { type: "retry" });
  assert.equal(run.checksPassed, 0);
  for (let i = 0; i < 4; i++) run = tick(run);
  assert.equal(run.phase, "ready");
});
test("cancel and reset invalidate stale work across repeated attempts", () => {
  let run = resolved();
  const attempt = run.attempt;
  run = mergeReducer(run, { type: "cancel" });
  assert.equal(run.phase, "conflicts");
  assert.equal(run.resolved, 0);
  assert.equal(mergeReducer(run, { type: "tick", attempt }), run);
  run = mergeReducer(run, { type: "reset" });
  run = mergeReducer(run, { type: "create" });
  assert.equal(mergeReducer(run, { type: "tick", attempt }), run);
});
test("creating can be cancelled; double create and merge are idempotent", () => {
  const run = mergeReducer(initialMergeRun, { type: "create" });
  assert.equal(mergeReducer(run, { type: "create" }), run);
  assert.equal(mergeReducer(run, { type: "cancel" }).phase, "idle");
  assert.equal(
    mergeReducer(initialMergeRun, { type: "merge" }),
    initialMergeRun,
  );
});

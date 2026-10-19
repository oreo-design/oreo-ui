import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialTestRun,
  testRunReducer,
  summarizeTests,
  matchesTest,
  failureText,
  type TestCase,
} from "./model.ts";
const samples: TestCase[] = [
  {
    id: "a",
    file: "a.ts",
    group: "g",
    name: "one",
    status: "passed",
    durationMs: 10,
  },
  {
    id: "b",
    file: "b.ts",
    group: "g",
    name: "two",
    status: "failed",
    durationMs: 5000,
    failure: { kind: "timeout", message: "Timed out", frames: [] },
  },
  { id: "c", file: "b.ts", group: "g", name: "three", status: "skipped" },
];
function finishAll() {
  let r = testRunReducer(initialTestRun(samples), {
    type: "start",
    scope: "all",
  });
  for (const result of samples)
    r = testRunReducer(r, {
      type: "result",
      runId: r.id,
      result,
      elapsedMs: 5010,
    });
  return r;
}
test("streaming derives completion and disjoint status counts", () => {
  const r = finishAll();
  assert.equal(r.phase, "complete");
  assert.deepEqual(summarizeTests(r.tests), {
    total: 3,
    completed: 3,
    passed: 1,
    failed: 1,
    skipped: 1,
    running: 0,
    queued: 0,
    slow: 1,
  });
});
test("failed-only rerun retains pass and skip and replaces old failure", () => {
  const done = finishAll();
  let r = testRunReducer(done, { type: "start", scope: "failed" });
  assert.equal(r.tests[0], done.tests[0]);
  assert.equal(r.tests[2], done.tests[2]);
  assert.equal(r.tests[1].status, "running");
  r = testRunReducer(r, {
    type: "result",
    runId: r.id,
    result: { ...samples[1], status: "passed", durationMs: 12 },
    elapsedMs: 12,
  });
  assert.equal(r.phase, "complete");
  assert.equal(r.tests[1].failure, undefined);
  assert.equal(summarizeTests(r.tests).passed, 2);
});
test("stop, reset and superseded run ids reject late results", () => {
  let r = testRunReducer(initialTestRun(samples), {
    type: "start",
    scope: "all",
  });
  const oldId = r.id;
  r = testRunReducer(r, { type: "stop" });
  assert.equal(
    testRunReducer(r, {
      type: "result",
      runId: oldId,
      result: samples[0],
      elapsedMs: 1,
    }),
    r,
  );
  r = testRunReducer(r, { type: "start", scope: "all" });
  assert.equal(
    testRunReducer(r, {
      type: "result",
      runId: oldId,
      result: samples[0],
      elapsedMs: 1,
    }),
    r,
  );
  assert.equal(
    testRunReducer(r, {
      type: "result",
      runId: r.id,
      result: samples[1],
      elapsedMs: 1,
    }),
    r,
  );
  const reset = testRunReducer(r, { type: "reset", tests: samples });
  assert.ok(reset.id > r.id);
  assert.equal(reset.phase, "idle");
});
test("partial failed-only rerun does not execute unrelated queued tests", () => {
  let r = testRunReducer(initialTestRun(samples), {
    type: "start",
    scope: "all",
  });
  r = testRunReducer(r, {
    type: "result",
    runId: r.id,
    result: { ...samples[0], status: "failed" },
    elapsedMs: 10,
  });
  r = testRunReducer(r, { type: "stop" });
  r = testRunReducer(r, { type: "start", scope: "failed" });
  r = testRunReducer(r, {
    type: "result",
    runId: r.id,
    result: samples[0],
    elapsedMs: 10,
  });
  assert.equal(r.phase, "complete");
  assert.equal(r.tests[1].status, "queued");
});
test("runner errors preserve completed outcomes and allow recovery", () => {
  let r = testRunReducer(initialTestRun(samples), {
    type: "start",
    scope: "all",
  });
  r = testRunReducer(r, {
    type: "result",
    runId: r.id,
    result: samples[0],
    elapsedMs: 10,
  });
  r = testRunReducer(r, {
    type: "error",
    runId: r.id,
    message: "Disconnected",
  });
  assert.equal(r.phase, "error");
  assert.equal(r.tests[0].status, "passed");
  r = testRunReducer(r, { type: "start", scope: "all" });
  assert.equal(r.error, undefined);
  assert.equal(r.tests[0].status, "running");
});
test("filters only count completed slow tests and failure export retains context", () => {
  assert.equal(matchesTest(samples[1], "slow"), true);
  assert.equal(
    matchesTest({ ...samples[1], status: "running" }, "slow"),
    false,
  );
  assert.equal(matchesTest(samples[2], "skipped"), true);
  assert.match(failureText(samples[1]), /b.ts › g › two\nTimed out/);
});

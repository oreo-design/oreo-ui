import assert from "node:assert/strict";
import {
  advanceRun,
  INITIAL_RUN,
} from "../../src/components/browser-session/model.ts";
let r = advanceRun(INITIAL_RUN, { type: "start" }, 6);
assert.equal(r.status, "running");
r = advanceRun(r, { type: "tick" }, 6);
for (const event of ["pause", "takeover", "stop"]) {
  const held = advanceRun(r, { type: event }, 6);
  assert.equal(
    advanceRun(held, { type: "tick" }, 6),
    held,
    `late tick after ${event}`,
  );
  assert.equal(held.completed, 1);
}
const paused = advanceRun(r, { type: "pause" }, 6);
assert.equal(advanceRun(paused, { type: "resume" }, 6).status, "running");
const taken = advanceRun(paused, { type: "takeover" }, 6);
assert.equal(advanceRun(taken, { type: "return" }, 6).completed, 1);
const failed = advanceRun(
  r,
  { type: "fail", message: "Network unavailable" },
  6,
);
assert.equal(failed.error, "Network unavailable");
assert.equal(advanceRun(failed, { type: "tick" }, 6), failed);
r = advanceRun(failed, { type: "retry" }, 6);
assert.equal(r.error, "");
for (let i = 0; i < 10; i++) r = advanceRun(r, { type: "tick" }, 6);
assert.equal(r.status, "complete");
assert.equal(r.completed, 6);
assert.equal(advanceRun(r, { type: "pause" }, 6), r);
assert.deepEqual(advanceRun(r, { type: "reset" }, 6), INITIAL_RUN);
assert.equal(advanceRun(r, { type: "start" }, 0).status, "complete");
assert.equal(advanceRun(r, { type: "start" }, NaN).status, "complete");
console.log(
  "PASS: lifecycle, late ticks, takeover, retry, completion, reset and empty runs",
);

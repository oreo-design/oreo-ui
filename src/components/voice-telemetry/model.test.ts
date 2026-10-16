import test from "node:test";
import assert from "node:assert/strict";
import {
  advance,
  latency,
  partialText,
  percentile,
  phaseAt,
  validStages,
  validTurn,
  type VoiceTurn,
} from "./model.ts";
const t: VoiceTurn = {
  id: 1,
  caller: "Hello there",
  agent: "Hello back",
  duration: 8000,
  callerEnd: 2700,
  agentEnd: 7400,
  stages: [
    { id: "endpoint", label: "Endpoint", ms: 200, tone: "neutral" },
    { id: "model", label: "Model", ms: 400, tone: "orange" },
  ],
  callerSamples: [0, 0.5, 1],
  agentSamples: [0, 0.4, 1],
};
test("phase boundaries follow summed latency without overlap", () => {
  assert.equal(latency(t), 600);
  assert.deepEqual(
    [0, 1, 2699, 2700, 3299, 3300, 7399, 7400, 8000].map((p) => phaseAt(t, p)),
    [
      "ready",
      "listening",
      "listening",
      "processing",
      "processing",
      "speaking",
      "speaking",
      "complete",
      "complete",
    ],
  );
});
test("interrupt wins and never mutates source timing", () => {
  assert.equal(phaseAt(t, 4000, true), "interrupted");
  assert.equal(latency(t), 600);
});
test("validation rejects duplicate or negative stages and impossible signal windows", () => {
  assert.equal(validTurn(t), true);
  assert.equal(validStages([...t.stages, t.stages[0]]), false);
  assert.equal(validStages([{ ...t.stages[0], ms: -1 }]), false);
  assert.equal(validTurn({ ...t, agentEnd: 3200 }), false);
  assert.equal(validTurn({ ...t, callerSamples: [NaN] }), false);
});
test("nearest-rank percentiles do not mutate samples", () => {
  const a = [868, 621, 587, 800];
  assert.equal(percentile(a, 0.5), 621);
  assert.equal(percentile(a, 0.95), 868);
  assert.deepEqual(a, [868, 621, 587, 800]);
  assert.equal(percentile([], 0.5), null);
});
test("clock advance clamps at end and handles stalled deltas", () => {
  assert.equal(advance(7900, 300, 8000), 8000);
  assert.equal(advance(4000, 0, 8000), 4000);
  assert.equal(advance(4000, -200, 8000), 4000);
});
test("transcript has no future text and completes exactly", () => {
  assert.equal(partialText(t.agent, 2000, 3300, 7400), "");
  assert.equal(partialText(t.agent, 8000, 3300, 7400), t.agent);
});

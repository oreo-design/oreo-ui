import { test } from "node:test";
import assert from "node:assert/strict";
import { routingPreview } from "./routing.ts";
const a = { id: "sin1", requests: 158000 },
  b = { id: "hkg1", requests: 119000 };
test("30% shift conserves total requests and respects snapshot capacity", () => {
  const p = routingPreview(a, b, 30, 41);
  assert.equal(p.error, null);
  assert.equal(p.moved, 47400);
  assert.equal(p.sourceAfter, 110600);
  assert.equal(p.targetAfter, 166400);
  assert.equal(p.sourceAfter + p.targetAfter, a.requests + b.requests);
  assert.ok(p.remainingHeadroom > 17 && p.remainingHeadroom < 18);
});
test("every permitted share conserves integers", () => {
  for (let n = 1; n <= 50; n++) {
    const p = routingPreview(a, b, n, 41);
    assert.equal(p.error, null);
    if (p.error) continue;
    assert.ok(Number.isSafeInteger(p.moved));
    assert.equal(p.sourceAfter + p.targetAfter, 277000);
  }
});
test("capacity, duplicate regions and malformed inputs fail explicitly", () => {
  assert.ok(routingPreview(a, b, 30, 10).error);
  assert.ok(routingPreview(a, a, 30, 41).error);
  for (const n of [0, 51, NaN, 1.5])
    assert.ok(routingPreview(a, b, n, 41).error);
  for (const n of [0, 100, NaN]) assert.ok(routingPreview(a, b, 30, n).error);
  assert.ok(routingPreview({ ...a, requests: 0 }, b, 30, 41).error);
  assert.ok(routingPreview({ ...a, requests: 1 }, b, 1, 41).error);
});

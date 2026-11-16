import test from "node:test";
import assert from "node:assert/strict";
import { completion } from "./model.ts";
test("external counts stay finite and never imply completion of an empty list", () => {
  assert.deepEqual(completion(8, 5), {
    total: 5,
    done: 5,
    left: 0,
    segments: 5,
  });
  for (const n of [NaN, Infinity, -1])
    assert.deepEqual(completion(3, n), {
      total: 0,
      done: 0,
      left: 0,
      segments: 0,
    });
  assert.equal(completion(NaN, 5).done, 0);
  assert.equal(completion(2.9, 5).done, 2);
});
test("large checklists keep exact counts with bounded visual segments", () => {
  assert.deepEqual(completion(67, 100), {
    total: 100,
    done: 67,
    left: 33,
    segments: 24,
  });
});

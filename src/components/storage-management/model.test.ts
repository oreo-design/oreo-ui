import test from "node:test";
import assert from "node:assert/strict";
import {
  usedBytes,
  validModules,
  cleanupEstimate,
  recycleArchived,
  restoreBatch,
  purgeBatch,
  type StorageState,
} from "./model.ts";
const state: StorageState = {
  modules: [
    {
      id: "a",
      name: "A",
      bytes: 100,
      files: 10,
      growth: 1,
      tone: "mint",
      archivedBytes: 20,
      archivedFiles: 2,
    },
  ],
  bin: [],
};
test("module validation rejects inconsistent and duplicate data", () => {
  assert.ok(validModules(state.modules));
  for (const m of [
    { ...state.modules[0], bytes: NaN },
    { ...state.modules[0], archivedFiles: 11 },
    { ...state.modules[0], archivedBytes: 101 },
  ])
    assert.equal(validModules([m]), false);
  assert.equal(validModules([...state.modules, ...state.modules]), false);
});
test("cleanup estimate only includes selected modules", () => {
  assert.deepEqual(cleanupEstimate(state.modules, ["a"]), {
    bytes: 20,
    files: 2,
  });
  assert.deepEqual(cleanupEstimate(state.modules, ["missing"]), {
    bytes: 0,
    files: 0,
  });
});
test("recycling preserves occupied capacity and cannot recycle twice", () => {
  const next = recycleArchived(state, ["a"], "one");
  assert.equal(usedBytes(next), 100);
  assert.equal(next.modules[0].bytes, 80);
  assert.equal(next.bin[0].files, 2);
  assert.deepEqual(recycleArchived(next, ["a"], "two"), next);
  assert.equal(state.modules[0].bytes, 100);
});
test("restoring exactly recovers module bytes and eligible files", () => {
  const next = recycleArchived(state, ["a"], "one");
  assert.deepEqual(restoreBatch(next, "one-a"), state);
  assert.equal(restoreBatch(next, "missing"), next);
});
test("purging frees exactly the recycled bytes and original snapshot supports undo", () => {
  const recycled = recycleArchived(state, ["a"], "one");
  const purged = purgeBatch(recycled, "one-a");
  assert.equal(usedBytes(purged), 80);
  assert.equal(usedBytes(recycled), 100);
  assert.equal(purged.modules[0].files, 8);
});

import test from "node:test";
import assert from "node:assert/strict";
import { validateCover, MAX_COVER_BYTES, safeProgress } from "./model.ts";
test("reject unsafe/unsupported, empty and oversized inputs while accepting boundary", () => {
  assert.match(validateCover({ type: "image/svg+xml", size: 20 }), /Choose/);
  assert.match(validateCover({ type: "image/png", size: 0 }), /empty/);
  assert.match(
    validateCover({ type: "image/jpeg", size: MAX_COVER_BYTES + 1 }),
    /10 MB/,
  );
  for (const type of ["image/jpeg", "image/png", "image/webp"])
    assert.equal(validateCover({ type, size: MAX_COVER_BYTES }), null);
});
test("progress remains finite and bounded for external hosts", () => {
  for (const n of [NaN, Infinity, -Infinity, -4])
    assert.equal(safeProgress(n), 0);
  assert.equal(safeProgress(3), 1);
  assert.equal(safeProgress(0.47), 0.47);
});

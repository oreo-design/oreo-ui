import assert from "node:assert/strict";
import test from "node:test";
import { assignLanes, badgeSize, spacingToken, statusOf, transparent } from "./spec.ts";

test("distances on the live spacing scale resolve to half-step multiples", () => {
  assert.equal(spacingToken(12, 4), "--spacing × 3");
  assert.equal(spacingToken(6, 4), "--spacing × 1.5");
  assert.equal(spacingToken(5.85, 4), "--spacing × 1.5", "subpixel text metrics within half a pixel");
  assert.equal(spacingToken(13.2, 4.4), "--spacing × 3", "follows density");
  assert.equal(spacingToken(16, 4.4), null, "a fixed 16px no longer matches at density 1.1");
  assert.equal(spacingToken(13, 4), null);
  assert.equal(spacingToken(0, 4), null);
  assert.equal(spacingToken(12, 0), null);
});

test("badge lanes never overlap and reuse the lowest free lane", () => {
  const items = [{ center: 6, size: 28 }, { center: 30, size: 21 }, { center: 120, size: 28 }];
  assert.deepEqual(assignLanes(items), [0, 1, 0]);
  assert.deepEqual(assignLanes([{ center: 100, size: 20 }, { center: 0, size: 20 }]), [0, 0]);
  assert.equal(badgeSize(8), 21);
  assert.equal(badgeSize(124), 35);
});

test("only alpha-zero computed colors are transparent", () => {
  assert.equal(transparent("rgb(0, 0, 0)"), false);
  assert.equal(transparent("rgba(0, 0, 0, 0)"), true);
  assert.equal(transparent("rgba(12, 0, 0, 0.5)"), false);
  assert.equal(transparent("color(srgb 0 0 0 / 0)"), true);
  assert.equal(transparent("transparent"), true);
});

test("vertical insets that end at a text line box are reported as type metrics", () => {
  assert.equal(statusOf({ basis: "text", value: 5.85 }, 4), "text");
  assert.equal(statusOf({ basis: "space", value: 12 }, 4), "on");
  assert.equal(statusOf({ basis: "space", value: 13 }, 4), "off");
});

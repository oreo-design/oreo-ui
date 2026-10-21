import { test } from "node:test";
import assert from "node:assert/strict";
import { clampProgress, sheetFrame, progressForFocus, focusForProgress, scrambleLine } from "./model.ts";

test("seeking preserves visible keyframes and bounds invalid host values", () => {
  assert.deepEqual(sheetFrame(0), {translate:100,opacity:0});
  assert.deepEqual(sheetFrame(60), {translate:-4,opacity:1});
  assert.deepEqual(sheetFrame(100), {translate:0,opacity:1});
  assert.deepEqual(sheetFrame(-20),sheetFrame(0));
  assert.deepEqual(sheetFrame(200),sheetFrame(100));
  for (const bad of [NaN,Infinity,-Infinity]) assert.equal(clampProgress(bad),0);
  for (let i=0;i<=100;i++) {
    assert.ok(sheetFrame(i).translate>=-4 && sheetFrame(i).translate<=100);
    assert.ok(Math.abs(progressForFocus(focusForProgress(i))-i)<1e-10);
  }
});

test("visual scrambling preserves source geometry without changing the source", () => {
  const code="    transform: translateY(-4%);";
  const noise=scrambleLine(code,6);
  assert.equal(noise.length,code.length);
  assert.deepEqual([...noise].flatMap((c,i)=>/\s/.test(c)?[i]:[]),[...code].flatMap((c,i)=>/\s/.test(c)?[i]:[]));
  assert.equal(scrambleLine(code,6),noise);
  assert.notEqual(scrambleLine(code,6,1),noise);
  assert.equal(code,"    transform: translateY(-4%);");
});

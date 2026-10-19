import test from "node:test";
import assert from "node:assert/strict";
import {
  createBreakout,
  launch,
  pause,
  movePaddle,
  advance,
  progressOf,
  FIELD,
} from "./model.ts";
test("unique destination IDs produce independent target groups", () => {
  const s = createBreakout(["a", "a", "b"]);
  assert.equal(s.targets.length, 16);
  assert.deepEqual(progressOf(s), { a: 0, b: 0 });
});
test("configuration is bounded and empty groups are complete", () => {
  assert.equal(createBreakout([]).phase, "won");
  assert.equal(createBreakout(["a"], 999, 999).targets.length, 12);
  assert.equal(createBreakout(["a"], NaN, NaN).speed, 210);
  assert.equal(createBreakout(["a"], 0).targets.length, 1);
});
test("paused frames and invalid deltas cannot advance the ball", () => {
  const s = pause(launch(createBreakout(["a"])));
  assert.equal(advance(s, 1), s);
  const r = launch(s);
  assert.equal(advance(r, NaN), r);
});
test("launch and pause preserve velocity and target state", () => {
  let s = advance(launch(createBreakout(["a"])), 0.03);
  const p = pause(s),
    r = launch(p);
  assert.deepEqual(r.ball, s.ball);
  assert.deepEqual(r.velocity, s.velocity);
  assert.equal(r.targets, s.targets);
});
test("paddle is clamped and ready ball follows it", () => {
  let s = movePaddle(createBreakout(["a"]), -100);
  assert.equal(s.paddle, 32);
  assert.equal(s.ball.x, 32);
  s = movePaddle(s, 999);
  assert.equal(s.paddle, 568);
  assert.equal(movePaddle(s, NaN), s);
});
test("side walls reflect without leaving bounds", () => {
  const s = launch(createBreakout(["a"]));
  s.ball = { x: 5, y: 200 };
  s.velocity = { x: -210, y: 0 };
  const n = advance(s, 0.03);
  assert.ok(n.ball.x >= 5);
  assert.ok(n.velocity.x > 0);
});
test("paddle reflection goes upward and depends on landing position", () => {
  const s = launch(createBreakout(["a"]));
  s.ball = { x: s.paddle + 20, y: 309 };
  s.velocity = { x: 0, y: 210 };
  const n = advance(s, 0.04);
  assert.ok(n.velocity.y < 0);
  assert.ok(n.velocity.x > 0);
});
test("miss preserves target progress, stops ball and requires explicit relaunch", () => {
  const s = launch(createBreakout(["a"]));
  s.targets[0].hit = true;
  s.ball = { x: 10, y: 346 };
  s.velocity = { x: 0, y: 210 };
  const n = advance(s, 0.03);
  assert.equal(n.phase, "ready");
  assert.equal(n.misses, 1);
  assert.equal(progressOf(n).a, 1);
  assert.deepEqual(n.velocity, { x: 0, y: 0 });
  assert.equal(advance(n, 1), n);
});
test("small substeps hit tiny targets and completion stops simulation", () => {
  const s = launch(createBreakout(["a"], 1, 360));
  const t = s.targets[0];
  s.ball = { x: t.x, y: t.y + 15 };
  s.velocity = { x: 0, y: -360 };
  const n = advance(s, 0.05);
  assert.equal(n.phase, "won");
  assert.equal(progressOf(n).a, 1);
  assert.equal(advance(n, 0.02), n);
  assert.equal(s.targets[0].hit, false);
});
test("large frame gap is capped, and only one target can count once", () => {
  let s = launch(createBreakout(["a"]));
  s.ball = { x: 300, y: 250 };
  s.velocity = { x: 0, y: -210 };
  assert.ok(Math.abs(advance(s, 60).ball.y - s.ball.y) <= 10.51);
  s.targets = s.targets.map((t) => ({ ...t, hit: true }));
  const n = advance(s, 0.02);
  assert.equal(progressOf(n).a, 8);
});

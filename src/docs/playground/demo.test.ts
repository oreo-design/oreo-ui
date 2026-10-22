import { test } from "node:test";
import assert from "node:assert/strict";
import { DemoPlayer } from "./demo.ts";
import { promptBoxDemo } from "./prompt-box.demo.ts";

function fixture() {
  let now = 0;
  let nextId = 0;
  const timers = new Map<number, { at: number; run: () => void }>();
  const frames: string[] = [];
  const statuses: string[] = [];
  const player = new DemoPlayer({ frames: [{ at: 0, label: "start", values: {} }, { at: 100, label: "next", values: {} }], duration: 200 }, frame => frames.push(frame.label), status => statuses.push(status), {
    now: () => now,
    later: (run, delay) => { const id = ++nextId; timers.set(id, { at: now + delay, run }); return id as unknown as ReturnType<typeof setTimeout>; },
    cancel: id => { timers.delete(id as unknown as number); },
  });
  const advance = (ms: number) => { const end = now + ms; while (true) { const next = [...timers].sort((a, b) => a[1].at - b[1].at)[0]; if (!next || next[1].at > end) break; now = next[1].at; timers.delete(next[0]); next[1].run(); } now = end; };
  return { player, frames, statuses, timers, advance };
}

test("pause preserves remaining dwell and resume does not repeat frames", () => {
  const f = fixture(); f.player.play(); f.advance(40); f.player.pause(); f.advance(500);
  assert.deepEqual(f.frames, ["start"]);
  f.player.play(); f.advance(59); assert.deepEqual(f.frames, ["start"]);
  f.advance(1); assert.deepEqual(f.frames, ["start", "next"]);
  f.advance(100); assert.equal(f.statuses.at(-1), "complete"); assert.equal(f.timers.size, 0);
});
test("manual takeover and disposal cancel all pending changes", () => {
  const f = fixture(); f.player.play(); f.player.stop(); f.advance(1000); assert.deepEqual(f.frames, ["start"]);
  f.player.play(); f.player.dispose(); f.advance(1000); assert.deepEqual(f.frames, ["start", "start"]);
});
test("rapid replay owns only one timer and starts from the beginning", () => {
  const f = fixture(); f.player.play(); f.advance(120); f.player.replay(); f.player.replay();
  assert.equal(f.timers.size, 1); f.advance(200);
  assert.deepEqual(f.frames, ["start", "next", "start", "start", "next"]); assert.equal(f.statuses.at(-1), "complete");
});
test("effect cleanup followed by setup restarts with one live timer", () => {
  const f = fixture(); f.player.play(); f.advance(40); f.player.dispose();
  assert.equal(f.timers.size, 0);
  f.player.play(); f.advance(100);
  assert.deepEqual(f.frames, ["start", "start", "next"]);
  assert.equal(f.timers.size, 1);
  f.advance(100); assert.equal(f.statuses.at(-1), "complete");
});
test("reduced motion preserves all demo states without per-character typing", () => {
  const normal = promptBoxDemo(false), reduced = promptBoxDemo(true);
  assert.ok(normal.frames.length > reduced.frames.length);
  assert.equal(reduced.frames.some(frame => frame.label === "Typing"), false);
  assert.deepEqual(Object.assign({}, ...normal.frames.map(f => f.values)), Object.assign({}, ...reduced.frames.map(f => f.values)));
  assert.ok(normal.frames.every((frame, index) => !index || frame.at > normal.frames[index - 1].at));
});

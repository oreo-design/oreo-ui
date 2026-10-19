import test from "node:test";
import assert from "node:assert/strict";
import { laneDemoReducer as reduce } from "./model.ts";
import { LANE_TASKS } from "./data.ts";
const initial = () => ({
  now: 0,
  playing: false,
  tasks: LANE_TASKS,
  approvedAt: null,
});
test("pause/reset ignore late ticks and preserve input fixtures", () => {
  let state = initial();
  assert.equal(reduce(state, { type: "tick" }), state);
  state = reduce(state, { type: "play" });
  state = reduce(state, { type: "tick" });
  assert.equal(state.now, 1);
  state = reduce(state, { type: "reset", tasks: LANE_TASKS });
  assert.equal(reduce(state, { type: "tick" }), state);
  assert.equal(LANE_TASKS.find((t) => t.id === "draft").status, "running");
});
test("handoff created exactly once and finished tasks retain end timestamps", () => {
  let state = reduce(initial(), { type: "play" });
  for (let i = 0; i < 20; i++) state = reduce(state, { type: "tick" });
  assert.equal(state.now, 18);
  assert.equal(state.playing, false);
  assert.equal(state.tasks.filter((t) => t.id === "review-page").length, 1);
  assert.equal(state.tasks.find((t) => t.id === "review-page").end, 10);
  assert.equal(state.tasks.find((t) => t.id === "draft").end, 4);
  assert.equal(state.tasks.find((t) => t.id === "keys").status, "waiting");
});
test("approval is idempotent and completes four simulated minutes later", () => {
  let state = reduce(initial(), { type: "approve" });
  assert.equal(reduce(state, { type: "approve" }), state);
  state = reduce(state, { type: "play" });
  for (let i = 0; i < 4; i++) state = reduce(state, { type: "tick" });
  assert.equal(state.tasks.find((t) => t.id === "keys").status, "done");
  assert.equal(state.tasks.find((t) => t.id === "keys").end, 4);
});

test("approval at the end can resume and finish", () => {
  let state = reduce(initial(), { type: "play" });
  for (let i = 0; i < 18; i++) state = reduce(state, { type: "tick" });
  state = reduce(state, { type: "approve" });
  state = reduce(state, { type: "play" });
  for (let i = 0; i < 4; i++) state = reduce(state, { type: "tick" });
  assert.equal(state.now, 22);
  assert.equal(state.playing, false);
  assert.equal(state.tasks.find((t) => t.id === "keys").status, "done");
});

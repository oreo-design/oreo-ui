import test from "node:test";
import assert from "node:assert/strict";
import { taskGeometry, packTasks } from "./model.ts";
const task = {
  id: "a",
  agentId: "a",
  title: "A",
  start: -40,
  end: -10,
  status: "done",
  tools: [],
  notes: [],
};
test("clips history and omits out-of-window or invalid intervals", () => {
  const g = taskGeometry(task, { now: 0, minutes: 30 });
  assert.equal(g.left, 0);
  assert.equal(g.clipped, true);
  assert.ok(Math.abs(g.width - 200 / 3) < 1e-9);
  assert.equal(
    taskGeometry({ ...task, end: -30 }, { now: 0, minutes: 30 }),
    null,
  );
  assert.equal(
    taskGeometry({ ...task, start: 2, end: null }, { now: 0, minutes: 30 }),
    null,
  );
  assert.equal(taskGeometry(task, { now: 0, minutes: 0 }), null);
  assert.equal(
    taskGeometry({ ...task, end: -50 }, { now: 0, minutes: 30 }),
    null,
  );
});
test("live zero-duration tasks remain visible and overlaps get separate tracks", () => {
  assert.equal(
    taskGeometry({ ...task, start: 0, end: null }, { now: 0, minutes: 30 })
      ?.width,
    0,
  );
  const tasks = [
    { ...task, id: "late", start: -15, end: null },
    task,
    { ...task, id: "next", start: -10, end: -1 },
  ];
  const before = JSON.stringify(tasks);
  assert.deepEqual(
    packTasks(tasks, 0).map((x) => [x.task.id, x.track]),
    [
      ["a", 0],
      ["late", 1],
      ["next", 0],
    ],
  );
  assert.equal(JSON.stringify(tasks), before);
});

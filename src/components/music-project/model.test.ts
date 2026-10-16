import test from "node:test";
import assert from "node:assert/strict";
import {
  toggleTask,
  taskDone,
  clampTime,
  trackTime,
  validComment,
  type ProductionTask,
} from "./model.ts";
const tasks: ProductionTask[] = [
  {
    id: "parent",
    title: "Stems",
    done: false,
    assignee: "Kai",
    due: "Oct 20",
    children: [
      {
        id: "drums",
        title: "Drums",
        done: true,
        assignee: "Kai",
        due: "Oct 20",
      },
      {
        id: "bass",
        title: "Bass",
        done: false,
        assignee: "Kai",
        due: "Oct 20",
      },
    ],
  },
  {
    id: "other",
    title: "Artwork",
    done: false,
    assignee: "Maya",
    due: "Oct 21",
  },
];
test("completing a parent cascades without mutating the previous state", () => {
  const before = JSON.stringify(tasks);
  const next = toggleTask(tasks, "parent", true);
  assert.equal(taskDone(next[0]), true);
  assert.ok(next[0].children?.every((t) => t.done));
  assert.equal(next[1].done, false);
  assert.equal(JSON.stringify(tasks), before);
});
test("child changes derive completion and reopening the parent clears children", () => {
  const complete = toggleTask(tasks, "bass", true);
  assert.equal(taskDone(complete[0]), true);
  const reopened = toggleTask(complete, "drums", false);
  assert.equal(taskDone(reopened[0]), false);
  assert.ok(
    toggleTask(complete, "parent", false)[0].children?.every((t) => !t.done),
  );
});
test("unknown task IDs preserve values", () =>
  assert.deepEqual(toggleTask(tasks, "missing", true), tasks));
test("seek bounds reject non-finite inputs and clamp against actual duration", () => {
  assert.equal(clampTime(500, 238), 238);
  assert.equal(clampTime(-4, 238), 0);
  assert.equal(clampTime(NaN, 238), 0);
  assert.equal(clampTime(84, 238), 84);
  assert.equal(trackTime(238), "3:58");
});
test("comments require text, bounded size and a timestamp in the selected version", () => {
  assert.equal(validComment("  ", 84, 238), false);
  assert.equal(validComment("a".repeat(2001), 0, 238), false);
  assert.equal(validComment("Good", 239, 238), false);
  assert.equal(validComment("Good", NaN, 238), false);
  assert.equal(validComment(" Good ", 238, 238), true);
});

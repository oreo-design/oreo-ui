import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterIssues,
  adjacentIssue,
  appendComment,
  type Issue,
} from "./model.ts";
const a: Issue = {
  id: 10,
  title: "Focus return",
  author: "Jamie",
  state: "open",
  labels: ["bug"],
  updated: 1,
  age: "1h",
  description: "",
  comments: [],
};
const b: Issue = {
  ...a,
  id: 11,
  title: "Compact picker",
  labels: ["enhancement"],
  updated: 2,
  comments: [{ id: "b", author: "Sam", body: "Yes", date: "Now" }],
};
const c: Issue = { ...a, id: 12, state: "closed", updated: 3 };
test("search, state and label intersect without mutating the source", () => {
  const data = [a, b, c];
  assert.deepEqual(
    filterIssues(data, " JAMIE ", "open", "bug", "updated").map((i) => i.id),
    [10],
  );
  assert.deepEqual(
    filterIssues(data, "#12", "closed", "", "newest").map((i) => i.id),
    [12],
  );
  assert.deepEqual(filterIssues(data, "missing", "open", "", "updated"), []);
  assert.deepEqual(data, [a, b, c]);
});
test("sort and navigation follow visible order and stop at boundaries", () => {
  const sorted = filterIssues([a, b, c], "", "open", "", "comments");
  assert.deepEqual(
    sorted.map((i) => i.id),
    [11, 10],
  );
  assert.equal(adjacentIssue(sorted, 11, -1), 11);
  assert.equal(adjacentIssue(sorted, 10, 1), 10);
  assert.equal(adjacentIssue(sorted, 11, 1), 10);
  assert.equal(adjacentIssue(sorted, 99, -1), 10);
  assert.equal(adjacentIssue([], null, 1), null);
});
test("comment submission changes only the target and reorders updated issues", () => {
  const data = [a, b];
  assert.equal(appendComment(data, 10, "   ", "c", 9), data);
  const result = appendComment(data, 10, " Reproduced ", "c", 9);
  assert.equal(result[0].comments[0].body, "Reproduced");
  assert.equal(result[0].updated, 9);
  assert.equal(result[1], b);
  assert.equal(a.comments.length, 0);
  assert.equal(filterIssues(result, "", "open", "", "updated")[0].id, 10);
});

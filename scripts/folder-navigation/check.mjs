import assert from "node:assert/strict";
import { test } from "node:test";
import {
  folderPath,
  entryBytes,
  formatBytes,
} from "../../src/components/folder-navigation/model.ts";
const root = {
  id: "root",
  name: "Root",
  kind: "folder",
  children: [
    { id: "empty", name: "Empty", kind: "folder", children: [] },
    {
      id: "a",
      name: "Same",
      kind: "folder",
      children: [
        {
          id: "b",
          name: "Same",
          kind: "folder",
          children: [{ id: "file", name: "File", kind: "file", bytes: 1200 }],
        },
      ],
    },
  ],
};
test("paths preserve stable identities through duplicate names and reject non-folder destinations", () => {
  assert.deepEqual(
    folderPath(root, "b").map((x) => x.id),
    ["root", "a", "b"],
  );
  assert.deepEqual(folderPath(root, "root"), [root]);
  assert.deepEqual(folderPath(root, "missing"), []);
  assert.deepEqual(folderPath(root, "file"), []);
  assert.equal(folderPath(root, "empty").at(-1).children.length, 0);
});
test("nested totals and decimal display safely handle invalid file metadata", () => {
  assert.equal(entryBytes(root), 1200);
  assert.equal(formatBytes(entryBytes(root)), "1.2 KB");
  for (const bytes of [-1, NaN, Infinity]) {
    assert.equal(
      entryBytes({ id: "bad", name: "Bad", kind: "file", bytes }),
      0,
    );
    assert.equal(formatBytes(bytes), "0 B");
  }
  assert.equal(formatBytes(24.1e6), "24.1 MB");
  assert.equal(formatBytes(1.9e9), "1.9 GB");
  assert.equal(entryBytes(root.children[0]), 0);
});

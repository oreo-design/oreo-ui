import assert from "node:assert/strict";
import {
  saveFolder,
  saveDocument,
  removeFolder,
  folderRows,
} from "../../src/components/writing-folders/model.ts";
const empty = { folders: [], documents: [] },
  now = "2026-10-16T12:00:00Z";
const f = { id: "f", name: "  Café  ", visibility: "Private", modified: now };
const first = saveFolder(empty, f);
assert.equal(first.folders[0].name, "Café");
assert.equal(empty.folders.length, 0);
assert.throws(
  () => saveFolder(first, { ...f, id: "g", name: "CAFE\u0301" }),
  /already exists/,
);
assert.throws(() => saveFolder(first, { ...f, name: " " }), /1 and 80/);
assert.throws(
  () => saveFolder(first, { ...f, name: "x".repeat(81) }),
  /1 and 80/,
);
let library = saveFolder(first, {
  ...f,
  id: "g",
  name: "Studio",
  visibility: "Workspace",
  modified: "2026-10-15T12:00:00Z",
});
library = saveDocument(library, {
  id: "d",
  title: " Letter ",
  body: "Words",
  folderId: "f",
  modified: now,
});
assert.equal(library.documents[0].title, "Letter");
assert.throws(
  () => saveDocument(library, { ...library.documents[0], folderId: "unknown" }),
  /existing folder/,
);
assert.throws(
  () => saveDocument(library, { ...library.documents[0], title: " " }),
  /1 and 120/,
);
assert.throws(
  () =>
    saveDocument(library, { ...library.documents[0], body: "x".repeat(20001) }),
  /20,000/,
);
const moved = saveDocument(library, {
  ...library.documents[0],
  folderId: "g",
  modified: now,
});
assert.equal(folderRows(moved).find((f) => f.id === "g").documentCount, 1);
assert.equal(folderRows(moved).find((f) => f.id === "f").documentCount, 0);
const removed = removeFolder(moved, "g", now);
assert.equal(removed.documents.length, 1);
assert.equal(removed.documents[0].folderId, null);
assert.equal(moved.documents[0].folderId, "g");
assert.equal(moved.folders.length, 2);
assert.throws(() => removeFolder(removed, "g", now), /no longer/);
assert.deepEqual(
  folderRows(library, "studio", "Workspace", "name").map((f) => f.id),
  ["g"],
);
assert.equal(folderRows(library, "no match").length, 0);
assert.equal(saveFolder(library, { ...f, name: "Renamed" }).folders.length, 2);
console.log(
  "Writing folders: normalization, uniqueness, validation, document moves, folder deletion conservation, immutable undo snapshots, counts and filters passed.",
);

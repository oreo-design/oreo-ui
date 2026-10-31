import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { guard } from "../settings-lab/guard.mjs";

test("Settings lineage protects both compatibility entry and extracted implementation", async () => {
  const owners = ["src/patterns/settings/row-primitives.tsx", "src/components/row-layout/index.tsx"];
  const baseline = await guard();
  assert.deepEqual(baseline.violations.filter(v => owners.includes(v.path)), []);
  for (const filename of owners) {
    const result = await guard({ [filename]: `${await readFile(filename, "utf8")}\n/* unexpected mutation */\n` });
    assert.ok(result.violations.some(v => v.path === filename && v.rule === "reviewed-boundary-changed"), filename);
  }
});

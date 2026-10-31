import test from "node:test";
import assert from "node:assert/strict";
import { checkSource } from "./check.mjs";

test("rejects alias and relative upward edges, including re-exports and lazy imports", () => {
  for (const source of [
    'import { Row } from "@/patterns/settings/row";',
    'export { Row } from "../../patterns/settings/row";',
    'const load = () => import("@/docs/example");',
    'const page = require("../../pages/example");',
    'type Page = import("@/pages/example").Page;',
  ]) {
    assert.equal(checkSource("src/components/demo/index.tsx", source)[0]?.rule, "component-imports-composition", source);
  }
});

test("neutral owners cannot acquire a business dependency", () => {
  assert.equal(checkSource("src/components/status-view/index.tsx", 'import { x } from "../automation";')[0]?.rule, "neutral-owner-imports-business");
  assert.equal(checkSource("src/components/row-layout/index.tsx", 'export * from "@/components/storage-management";')[0]?.rule, "neutral-owner-imports-business");
});

test("allows composition downwards and shared component dependencies", () => {
  assert.deepEqual(checkSource("src/patterns/settings/row-primitives.tsx", 'export * from "@/components/row-layout";'), []);
  assert.deepEqual(checkSource("src/components/status-view/index.tsx", 'import { Button } from "@/components/button"; import "./status-view.css"; import { cn } from "@/lib/cn";'), []);
  assert.deepEqual(checkSource("src/components/workflow-table/index.tsx", 'import { StatusView } from "../status-view";'), []);
});

test("ignores source text and comments that are not module edges", () => {
  assert.deepEqual(checkSource("src/components/demo/index.tsx", '// import x from "@/patterns/demo"\nconst example = "@/docs/demo";'), []);
});

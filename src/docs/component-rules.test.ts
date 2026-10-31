import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { componentRuleIds, loadComponentRules } from "./component-rules.ts";
import { formatComponentRules, ruleParts, missingComponentRules } from "../lib/component-rules.ts";
import { sourceReferencePath, sourceReferenceText, internalSourceGuidance } from "./source-reference.ts";

test("all supported component references resolve to a family with four explicit parts", async () => {
  for (const [slug, id] of Object.entries(componentRuleIds)) {
    const rule = await loadComponentRules(slug);
    assert.ok(rule, slug);
    assert.equal(rule.id, id);
    for (const { key } of ruleParts) assert.ok(rule[key].length, `${id}: ${key}`);
    const prompt = formatComponentRules(rule);
    for (const text of [...rule.use, ...rule.avoid, ...ruleParts.flatMap(({key}) => rule[key])]) {
      assert.ok(prompt.includes(text), `${id}: exported rule omitted`);
    }
    assert.ok(prompt.includes(`${rule.id}, v${rule.version}`));
  }
  assert.deepEqual([...new Set(Object.values(componentRuleIds))].sort(), ["agent-budget", "button", "composer", "tree-stepper"]);
});

test("unknown components explicitly disclose missing dedicated guidance", async () => {
  for (const slug of ["not-a-component", "__proto__", "constructor"]) {
    assert.equal(await loadComponentRules(slug), undefined);
  }
  assert.equal(formatComponentRules(undefined), missingComponentRules);
  assert.match(missingComponentRules, /does not establish complete behavior coverage/);
});

test("exported guidance preserves the real integration boundary", async () => {
  const budget = formatComponentRules(await loadComponentRules("budget-cap-control"));
  assert.match(budget, /host owns saved and draft values, actual spend, persistence and failures/);
  assert.match(budget, /do not charge money/);
  assert.match(budget, /pair value with onChange/);
  const composer = formatComponentRules(await loadComponentRules("prompt-box"));
  assert.match(composer, /host owns uploads, permission policy and model execution/);
  assert.match(composer, /does not grant access/);
  const button = formatComponentRules(await loadComponentRules("icon-button"));
  assert.match(button, /htmlType applies only to the default button renderer/);
});

test("rule modules stay data-only and examples refer to known routes", async () => {
  const site = await readFile(new URL("../lib/site.ts", import.meta.url), "utf8");
  const catalog = await readFile(new URL("../lib/catalog.ts", import.meta.url), "utf8");
  for (const id of new Set(Object.values(componentRuleIds))) {
    const source = await readFile(new URL(`../components/${id}/rules.ts`, import.meta.url), "utf8");
    const imports = source.split("\n").filter(line => /^import\s/.test(line));
    assert.ok(imports.every(line => /^import type\s/.test(line)), id);
    const slug = Object.keys(componentRuleIds).find(slug => componentRuleIds[slug] === id)!;
    const rule = (await loadComponentRules(slug))!;
    for (const { href } of rule.examples) {
      const route = href.slice(1).split("?")[0];
      assert.ok(site.includes(`"${route}"`) || catalog.includes(`"${route}"`), href);
    }
  }
});

test("source references point to real internal modules without inventing install commands", async () => {
  const pages = new URL("../pages/", import.meta.url);
  let checked = 0;
  for (const file of await readdir(pages)) {
    if (!file.endsWith(".tsx")) continue;
    const text = await readFile(new URL(file, pages), "utf8");
    assert.doesNotMatch(text, /npx oreo-ui add/);
    for (const [, module] of text.matchAll(/<SourceReference source="([a-z0-9-]+)"/g)) {
      assert.ok((await stat(new URL(`../components/${module}/`, import.meta.url))).isDirectory());
      assert.equal(sourceReferencePath(module), `src/components/${module}/`);
      assert.ok(sourceReferenceText(module).includes(internalSourceGuidance));
      checked++;
    }
  }
  assert.ok(checked >= 29);
  assert.doesNotMatch(sourceReferencePath("../../outside"), /src\/components/);
  const response = await readFile(new URL("ResponseDocs.tsx", pages), "utf8");
  assert.match(response, /pnpm add react-markdown remark-gfm/);
});

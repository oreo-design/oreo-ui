import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  CATALOG, CATALOG_GROUPS, CATALOG_NAV, catalogHref, searchCatalog, relatedCatalogEntries,
  type CatalogEntry, type CatalogSlug,
} from "./catalog.ts";

const entries: Readonly<Record<CatalogSlug, CatalogEntry>> = CATALOG;
const pages = (query: string) => searchCatalog(query).flatMap((group) => group.items.map((item) => item.page));

test("each route occurs once in navigation with stable group and local order", () => {
  const listed = CATALOG_NAV.flatMap((group) => group.items.map((item) => item.page));
  assert.equal(new Set(listed).size, listed.length);
  assert.deepEqual([...listed].sort(), Object.keys(CATALOG).sort());
  assert.deepEqual(CATALOG_NAV.map((group) => group.title), [...CATALOG_GROUPS]);
  for (const group of CATALOG_NAV) {
    const orders = group.items.map((item) => entries[item.page].nav.order);
    assert.equal(new Set(orders).size, orders.length);
    assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
  }
});

test("shared search finds task and family members as well as labels", () => {
  assert.ok(pages("Agent").includes("composer"));
  assert.ok(pages("Agent").includes("prompt-box"));
  assert.ok(pages("composer").includes("attachment"));
  assert.ok(pages("account favorites").includes("company-table"));
  assert.ok(pages("workflow selection").includes("workflow-table"));
  assert.deepEqual(pages("  AGENT   "), pages("agent"));
  assert.equal(searchCatalog("   "), CATALOG_NAV);
  assert.deepEqual(searchCatalog("zz-no-such-oreo-page-zz"), []);
});

test("classification distinguishes family galleries, compositions and templates", () => {
  assert.equal(entries.composer.subject, "family");
  assert.deepEqual(entries.composer.views, ["gallery"]);
  assert.equal(entries["workflow-table"].reuse, "composition");
  assert.equal(entries["workflow-directory"].subject, "template");
  assert.equal(entries.button.reuse, "primitive");
  assert.equal(entries["spectral-glass"].experimental, undefined, "unreviewed entries must not be assigned maturity");
  assert.ok(relatedCatalogEntries("composer").some((entry) => entry.page === "prompt-box"));
});

test("explicit relationships and capability defaults resolve to the catalog", () => {
  for (const [slug, entry] of Object.entries(entries)) {
    if (entry.defaultView) assert.ok(entry.views?.includes(entry.defaultView), `${slug}: invalid default view`);
    for (const related of entry.related ?? []) assert.ok(Object.hasOwn(CATALOG, related), `${slug}: missing ${related}`);
    if (entry.reuse) assert.equal(entry.subject, "component", `${slug}: reuse only describes components`);
  }
});

test("catalog has no runtime imports so sitemap and search remain lightweight", () => {
  const source = readFileSync(new URL("./catalog.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /^\s*import\s/m);
  assert.doesNotMatch(source, /\bimport\s*\(/);
});

test("capability filters keep real playgrounds separate from galleries and standalone demos", () => {
  const filtered = (view: Parameters<typeof searchCatalog>[1]) => searchCatalog("", view).flatMap((group) => group.items.map((item) => item.page));
  assert.ok(filtered("playground").includes("button"));
  assert.ok(!filtered("playground").includes("composer"));
  assert.ok(!filtered("playground").includes("kanban"));
  assert.ok(filtered("gallery").includes("composer"));
  assert.ok(filtered("demo").includes("kanban"));
  assert.ok(filtered("template").includes("workflow-directory"));
  assert.ok(filtered("docs").includes("button"));
  assert.ok(filtered("remixes").includes("prompt-box"));
  assert.deepEqual(searchCatalog("workflow table", "gallery"), []);
  for (const entry of Object.values(entries)) assert.ok(entry.defaultView && entry.views?.includes(entry.defaultView));
});


test("filtered destinations resolve to the capability advertised to the user", () => {
  const row = (view: Parameters<typeof searchCatalog>[1], page: CatalogSlug) => searchCatalog("", view).flatMap(group => group.items).find(item => item.page === page)!;
  assert.equal(row("docs", "workflow-table").hint, "Composition · Documentation");
  assert.equal(catalogHref("workflow-table", "docs"), "/workflow-table?view=docs");
  assert.equal(row("remixes", "prompt-box").hint, "Remix examples");
  assert.equal(catalogHref("prompt-box", "remixes"), "/prompt-box?view=remixes");
  assert.equal(row(undefined, "workflow-table").hint, "Composition · Playground");
  assert.equal(catalogHref("workflow-table"), "/workflow-table");
  assert.equal(catalogHref("workflow-directory", "template"), "/workflow-directory");
  assert.equal(catalogHref("composer", "gallery"), "/composer");
  assert.equal(catalogHref("kanban", "demo"), "/kanban");
  assert.equal(catalogHref("button", "remixes"), "/button", "unsupported capabilities cannot create a misleading deep link");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { createAsyncResource } from "./async-resource.ts";
import { routeView } from "./route-view.ts";

test("a failed content load can genuinely retry and a successful load is reused", async () => {
  let attempts = 0;
  const resource = createAsyncResource(async () => {
    attempts++;
    if (attempts === 1) throw new Error("network unavailable");
    return "module";
  });
  await resource.start();
  assert.equal(resource.getSnapshot().status, "error");
  resource.retry();
  await resource.start();
  assert.deepEqual(resource.getSnapshot(), { status: "ready", value: "module" });
  await resource.start();
  assert.equal(attempts, 2);
});

test("duplicate mounts share pending work and a late old route cannot replace a newer one", async () => {
  let resolveA!: (value: string) => void;
  let attempts = 0;
  const a = createAsyncResource(() => { attempts++; return new Promise<string>(resolve => { resolveA = resolve; }); });
  const b = createAsyncResource(async () => "B");
  const pending = a.start();
  assert.equal(pending, a.start());
  await b.start();
  resolveA("A");
  await pending;
  assert.equal(attempts, 1);
  assert.deepEqual(b.getSnapshot(), { status: "ready", value: "B" });
  assert.deepEqual(a.getSnapshot(), { status: "ready", value: "A" });
});

test("navigation resolves documentation anchors, supported views and gallery defaults", () => {
  const component = { title: "Button", description: "", nav: { group: "Components" as const, order: 0 }, views: ["playground", "docs"] as const, defaultView: "playground" as const };
  assert.equal(routeView(component, "?config=saved", ""), "playground");
  assert.equal(routeView(component, "?view=docs&config=saved", ""), "docs");
  assert.equal(routeView(component, "?view=playground", "#usage"), "docs");
  assert.equal(routeView(component, "?view=remixes", ""), "playground");
  assert.equal(routeView({ ...component, views: ["gallery"], defaultView: "gallery" }, "", ""), "gallery");
});

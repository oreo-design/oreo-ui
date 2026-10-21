import assert from "node:assert/strict";
import test from "node:test";
import { createThemeTransition } from "./transition.ts";
import { createThemeStore, themeStorageKey } from "./store.ts";
import { presetAppearance } from "./tokens.ts";

function setup() {
  const requests: { update: () => void; skipped: boolean }[] = [];
  const values = new Map<string, string>();
  let reduced = false;
  const transition = createThemeTransition({
    start(update) {
      const request = { update, skipped: false };
      requests.push(request);
      return { ready: Promise.resolve(), finished: new Promise<void>(() => {}), skipTransition: () => { request.skipped = true; } };
    },
    canAnimate: () => !reduced,
    flush: update => update(),
  });
  const store = createThemeStore(() => ({ getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } }));
  store.getSnapshot();
  const uninstall = store.installTransition(transition);
  return { requests, values, store, uninstall, reduce: () => { reduced = true; } };
}

test("theme is saved immediately and rendered at snapshot update, not animation completion", () => {
  const { store, requests, values } = setup();
  let notices = 0;
  store.subscribe(() => notices++);
  store.setTheme(presetAppearance("claude"));
  assert.equal(JSON.parse(values.get(themeStorageKey)!).variation.preset, "claude");
  assert.equal(notices, 0);
  requests[0].update();
  assert.equal(store.getSnapshot().theme.variation?.preset, "claude");
  assert.equal(notices, 1);
});

test("rapid choices skip old snapshots and ignore late stale callbacks", () => {
  const { store, requests } = setup();
  store.setTheme(presetAppearance("claude"));
  store.setTheme(presetAppearance("ascii"));
  assert.equal(requests[0].skipped, true);
  requests[1].update(); requests[0].update();
  assert.deepEqual(store.getSnapshot().theme, presetAppearance("ascii"));
});

test("a patch before capture keeps the requested preset, and continuous edits commit immediately", () => {
  const { store, requests } = setup();
  store.setTheme(presetAppearance("ascii"));
  store.patchTheme({ dark: true });
  requests[0].update(); requests[1].update();
  assert.deepEqual(store.getSnapshot().theme, presetAppearance("ascii", true));
  store.patchTheme({ radius: 12 });
  assert.equal(requests.length, 2);
  assert.equal(store.getSnapshot().theme.radius, 12);
});

test("reset to the already rendered theme cancels a pending choice without a new animation", () => {
  const { store, requests } = setup();
  store.setTheme(presetAppearance("claude"));
  store.setTheme(presetAppearance("oreo"));
  requests[0].update();
  assert.equal(requests.length, 1);
  assert.deepEqual(store.getSnapshot().theme, presetAppearance("oreo"));
});

test("cross-tab changes supersede a pending local snapshot without overwriting storage", () => {
  const { store, requests, values } = setup();
  store.setTheme(presetAppearance("claude"));
  const remote = JSON.stringify(presetAppearance("openai", true));
  values.set(themeStorageKey, remote); store.refresh();
  requests[1].update(); requests[0].update();
  assert.deepEqual(store.getSnapshot().theme, presetAppearance("openai", true));
  assert.equal(values.get(themeStorageKey), remote);
});

test("reduced motion and disposal commit the latest choice and invalidate deferred work", () => {
  const { store, requests, reduce, uninstall } = setup();
  store.setTheme(presetAppearance("claude"));
  reduce(); store.setTheme(presetAppearance("ascii")); requests[0].update();
  assert.deepEqual(store.getSnapshot().theme, presetAppearance("ascii"));
  assert.equal(requests.length, 1);
  uninstall();
  const second = setup();
  second.store.setTheme(presetAppearance("openai")); second.uninstall(); second.requests[0].update();
  assert.deepEqual(second.store.getSnapshot().theme, presetAppearance("openai"));
});

test("unsupported or failed snapshot API applies exactly once", () => {
  for (const start of [undefined, () => { throw Error("snapshot unavailable"); }]) {
    let commits = 0;
    const transition = createThemeTransition({ start, canAnimate: () => true, flush: update => update() });
    transition.run(() => commits++, true);
    transition.dispose();
    assert.equal(commits, 1);
  }
});

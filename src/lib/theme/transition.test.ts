import assert from "node:assert/strict";
import test from "node:test";
import { createThemeTransition, themeTransitionDuration } from "./transition.ts";
import { createThemeStore, themeStorageKey } from "./store.ts";
import { presetAppearance } from "./tokens.ts";

function setup() {
  const timers: { finish: () => void; cancelled: boolean; delay: number }[] = [];
  const values = new Map<string, string>();
  let reduced = false;
  let scoped = false;
  const order: string[] = [];
  const transition = createThemeTransition({
    prepare: () => { scoped = true; order.push("prepare"); },
    finish: () => { scoped = false; order.push("finish"); },
    measure: () => { order.push("measure"); },
    schedule: (finish, delay) => {
      const timer = { finish, delay, cancelled: false }; timers.push(timer);
      return () => { timer.cancelled = true; };
    },
    canAnimate: () => !reduced,
    flush: update => { order.push("commit"); update(); },
  });
  const store = createThemeStore(() => ({ getItem: key => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } }));
  store.getSnapshot();
  const uninstall = store.installTransition(transition);
  return { timers, values, store, uninstall, order, scoped: () => scoped, reduce: () => { reduced = true; } };
}

test("selection and storage commit immediately, between before/after style resolution", () => {
  const s = setup(); let notices = 0;
  s.store.subscribe(() => notices++);
  s.store.setTheme(presetAppearance("claude"));
  assert.equal(JSON.parse(s.values.get(themeStorageKey)!).variation.preset, "claude");
  assert.equal(s.store.getSnapshot().theme.variation?.preset, "claude");
  assert.equal(notices, 1);
  assert.deepEqual(s.order, ["prepare", "commit", "measure"]);
  assert.equal(s.scoped(), true);
  assert.ok(s.timers[0].delay >= themeTransitionDuration);
  s.timers[0].finish(); assert.equal(s.scoped(), false);
});

test("rapid choices retain the active scope and stale cleanup cannot end a newer transition", () => {
  const s = setup();
  s.store.setTheme(presetAppearance("claude"));
  s.store.setTheme(presetAppearance("ascii"));
  assert.equal(s.timers[0].cancelled, true);
  s.timers[0].finish();
  assert.equal(s.scoped(), true);
  assert.ok(!s.order.includes("finish"));
  assert.deepEqual(s.store.getSnapshot().theme, presetAppearance("ascii"));
  s.timers[1].finish(); assert.equal(s.scoped(), false);
});

test("radius, density and accent edits retarget immediately just like preset changes", () => {
  const s = setup();
  s.store.setTheme(presetAppearance("ascii"));
  s.store.patchTheme({ radius: 12 });
  s.store.patchTheme({ variation: { ...s.store.getSnapshot().theme.variation!, density: 1.2, accent: "#123456" } });
  assert.equal(s.store.getSnapshot().theme.radius, 12);
  assert.equal(s.store.getSnapshot().theme.variation?.density, 1.2);
  assert.equal(s.timers.length, 3);
  assert.ok(s.timers.slice(0, 2).every(t => t.cancelled));
});

test("reselecting the current target does not snap an active transition to its end", () => {
  const s = setup();
  s.store.setTheme(presetAppearance("claude"));
  s.store.setTheme(presetAppearance("claude"));
  assert.equal(s.timers.length, 1);
  assert.equal(s.scoped(), true);
  assert.equal(s.timers[0].cancelled, false);
  s.timers[0].finish(); assert.equal(s.scoped(), false);
});

test("cross-tab changes immediately supersede a local choice without overwriting storage", () => {
  const s = setup();
  s.store.setTheme(presetAppearance("claude"));
  const remote = JSON.stringify(presetAppearance("openai", true));
  s.values.set(themeStorageKey, remote); s.store.refresh();
  assert.deepEqual(s.store.getSnapshot().theme, presetAppearance("openai", true));
  assert.equal(s.values.get(themeStorageKey), remote);
  assert.equal(s.timers[0].cancelled, true);
});

test("reduced motion and disposal remove the scope and cancel pending cleanup", () => {
  const s = setup();
  s.store.setTheme(presetAppearance("claude"));
  s.reduce(); s.store.setTheme(presetAppearance("ascii"));
  assert.deepEqual(s.store.getSnapshot().theme, presetAppearance("ascii"));
  assert.equal(s.timers.length, 1); assert.equal(s.scoped(), false);
  s.uninstall(); s.timers[0].finish(); assert.equal(s.scoped(), false);
  const other = setup();
  other.store.setTheme(presetAppearance("openai")); other.uninstall();
  assert.equal(other.scoped(), false); assert.equal(other.timers[0].cancelled, true);
  assert.deepEqual(other.store.getSnapshot().theme, presetAppearance("openai"));
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  readConfiguration,
  randomValues,
  readPresets,
  shareUrl,
} from "./configuration.ts";
import { number, select, toggle, text, type PlaygroundSpec } from "./schema.ts";
const spec: PlaygroundSpec = {
  title: "Test",
  controls: {
    label: text("Hello"),
    disabled: toggle(),
    type: select(["primary", "secondary"], "primary"),
    current: { ...number(1, 1, 10), maxFrom: "total" },
    total: number(3, 1, 10),
  },
  render: () => {
    throw new Error("Not used");
  },
};
const config = {
  version: 1 as const,
  component: "test",
  values: {
    label: "你好 <script> & + 👋",
    disabled: false,
    type: "primary",
    current: 9,
    total: 2,
  },
  appearance: { dark: true, radius: 8, library: "phosphor" as const },
};
test("share links round-trip unicode and validate dependent numeric bounds", () => {
  const url = new URL(
    shareUrl("https://oreo.test/test?view=docs#usage", config),
  );
  assert.equal(url.hash, "");
  assert.equal(url.searchParams.has("view"), false);
  const restored = readConfiguration(
    url.searchParams.get("config")!,
    "test",
    spec,
  );
  assert.equal(restored.values.label, config.values.label);
  assert.equal(restored.values.current, 2);
  assert.deepEqual(restored.appearance, config.appearance);
});
test("rejects malformed, mismatched and out-of-schema configurations", () => {
  for (const raw of [
    "x",
    "null",
    "[]",
    JSON.stringify({ ...config, component: "other" }),
    JSON.stringify({ ...config, version: 2 }),
    JSON.stringify({ ...config, values: { disabled: "false" } }),
    JSON.stringify({ ...config, values: { type: "dangerous" } }),
    " ".repeat(64001),
  ])
    assert.throws(() => readConfiguration(raw, "test", spec));
  assert.deepEqual(
    readConfiguration(
      JSON.stringify({ ...config, values: { extra: "ignored" } }),
      "test",
      spec,
    ).values,
    { label: "Hello", disabled: false, type: "primary", current: 1, total: 3 },
  );
});
test("randomization preserves text and linked bounds over repeated draws", () => {
  for (let i = 0; i < 200; i++) {
    const values = randomValues(spec, config.values);
    assert.equal(values.label, config.values.label);
    assert.ok(Number(values.current) <= Number(values.total));
    assert.ok(["primary", "secondary"].includes(String(values.type)));
    assert.equal(typeof values.disabled, "boolean");
  }
});
test("preset storage is bounded and validates every configuration", () => {
  assert.deepEqual(readPresets(null, "test", spec), []);
  assert.throws(() => readPresets("{}", "test", spec));
  assert.throws(() =>
    readPresets(
      JSON.stringify([
        {
          id: "a",
          name: "bad",
          configuration: { ...config, component: "wrong" },
        },
      ]),
      "test",
      spec,
    ),
  );
  assert.equal(
    readPresets(
      JSON.stringify(
        Array.from({ length: 20 }, (_, i) => ({
          id: String(i),
          name: "Saved",
          configuration: config,
        })),
      ),
      "test",
      spec,
    ).length,
    12,
  );
});

test("appearance export keeps provider and radius only when requested", async () => {
  const { withAppearance } = await import("./exportAppearance.ts");
  const code =
    'import { Button } from "@/components/button";\n\n// Starting props. Connect event handlers in your app.\n<Button />';
  assert.equal(withAppearance(code), code);
  const decorated = withAppearance(code, {
    dark: true,
    radius: 12,
    library: "lucide",
  });
  assert.match(decorated, /IconLibraryProvider library="lucide"/);
  assert.match(decorated, /className="theme-dark"/);
  assert.match(decorated, /"--radius-control": "12px"/);
  assert.match(decorated, /<Button \/>/);
});

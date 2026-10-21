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

test("theme presets, custom values and old links round-trip safely", async () => {
  const { presetAppearance, variationTokens } = await import("./variation.ts");
  for (const preset of ["oreo", "claude", "openai", "material"] as const) {
    const appearance = presetAppearance(preset, true);
    const restored = readConfiguration(JSON.stringify({ ...config, appearance }), "test", spec);
    assert.deepEqual(restored.appearance, appearance);
    assert.ok(Object.keys(variationTokens(appearance)).includes("--space-x4"));
  }
  const appearance = { ...presetAppearance("material"), radius: 12, variation: { preset: "material", density: .75, accent: "#123abc" } };
  assert.deepEqual(readConfiguration(JSON.stringify({ ...config, appearance }), "test", spec).appearance, appearance);
  for (const bad of [null, { preset: "unknown", density: 1, accent: null }, { preset: "oreo", density: 9, accent: null }, { preset: "oreo", density: 1, accent: "red;display:none" }]) {
    assert.throws(() => readConfiguration(JSON.stringify({ ...config, appearance: { ...config.appearance, variation: bad } }), "test", spec));
  }
});

test("theme export carries token scales, palette, contrast and preserves semantic errors", async () => {
  const { withAppearance } = await import("./exportAppearance.ts");
  const { presetAppearance, variationTokens, accentForeground } = await import("./variation.ts");
  const a = presetAppearance("claude");
  const code = 'import { Button } from "@/components/button";\n\n// Starting props. Connect event handlers in your app.\n<Button />';
  const exported = withAppearance(code, a);
  assert.match(exported, /--space-x4/);
  assert.match(exported, /--radius-card-medium/);
  assert.match(exported, /#b45d3a/);
  assert.equal(variationTokens(a)["--color-status-error"], undefined);
  assert.equal(accentForeground("#ffffff"), "#000000");
  assert.equal(accentForeground("#000000"), "#ffffff");
  assert.equal(variationTokens(presetAppearance("oreo"))["--spacing"], "4px");
});

test("theme covers utility corners and interaction accents without recoloring semantic status", async () => {
  const { variationTokens, presetAppearance } = await import("./variation.ts");
  const a = { ...presetAppearance("oreo"), radius: 20, variation: { preset: "oreo" as const, density: 1.25, accent: "#ffffff" } };
  const tokens = variationTokens(a);
  assert.equal(tokens["--radius-xl"], "30px");
  assert.equal(tokens["--radius-card-large"], "60px");
  assert.equal(tokens["--spacing"], "5px");
  assert.equal(tokens["--color-accent-foreground"], "#000000");
  assert.equal(tokens["--color-accent"], "#ffffff");
  for (const name of ["error", "success", "progress"]) assert.equal(tokens[`--color-status-${name}`], undefined);
  for (const name of ["mint", "pink", "blue", "purple"]) assert.equal(tokens[`--color-palette-${name}-text`], undefined);
  assert.equal(variationTokens(presetAppearance("oreo"))["--color-theme-accent"], undefined);
});

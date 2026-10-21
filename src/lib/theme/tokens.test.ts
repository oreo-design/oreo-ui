import assert from "node:assert/strict";
import test from "node:test";
import { presetAppearance, variationTokens, themeNames } from "./tokens.ts";

test("nested non-ASCII scopes explicitly turn off inherited ASCII surface recipes", () => {
  const ascii = variationTokens(presetAppearance("ascii"));
  for (const preset of themeNames.filter(p => p !== "ascii")) {
    const next = variationTokens(presetAppearance(preset));
    for (const key of Object.keys(ascii).filter(k => k.startsWith("--theme-") || k.startsWith("--radius-media") || k === "--font-technical"))
      assert.ok(key in next, `${preset} must reset ${key}`);
    assert.equal(next["--theme-hatch-color"], "transparent");
    assert.equal(next["--theme-frame-marks"], "0");
    assert.equal(next["--theme-art-presence"], "0");
    assert.equal(next["--font-technical"], "initial");
  }
});

test("custom theme controls preserve role distinctions without square markers on rounded corners", () => {
  const custom = {...presetAppearance("ascii"), radius:12, variation:{preset:"ascii" as const,density:1.2,accent:"#123abc"}};
  const t=variationTokens(custom);
  assert.equal(t["--color-accent"],"#123abc");
  assert.equal(t["--spacing"],"4.8px");
  assert.equal(t["--theme-frame-marks"],"0");
  assert.ok(parseFloat(t["--radius-keycap"]) < parseFloat(t["--radius-model-selector"]));
  for (const preset of ["oreo","claude","openai"] as const) {
    const appearance=presetAppearance(preset),tokens=variationTokens(appearance);
    assert.equal(tokens["--radius-media"],tokens["--radius-control"]);
    assert.equal(tokens["--radius-media-thumb"],tokens["--radius-control-tiny"]);
  }
});

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const url = process.env.SETTINGS_LAB_URL || "http://localhost:5198";
const out = "artifacts/settings-lab";
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
page.setDefaultTimeout(5000);
// Cold Vite startup may exceed interaction timeouts in a fresh checkout.
page.setDefaultNavigationTimeout(60_000);
const report = { expanded: [], exportRecovery: false, darkPopup: false };
try {
  for (const width of [320, 390]) for (const dark of [false, true]) for (const card of ["outline", "surface", "divider"]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${url}/settings-lab?stress${dark ? "&dark" : ""}`);
    await page.getByLabel("Card style", { exact: true }).selectOption(card);
    const row = page.locator('[data-service="github"]');
    await row.getByRole("button", { name: "Manage", exact: true }).click();
    await row.getByRole("button", { name: "Disconnect…", exact: true }).click();
    await page.waitForFunction(() => document.activeElement?.hasAttribute("data-confirm-keep"));
    const actions = await row.locator("[data-confirm-actions]").boundingBox();
    const panel = await page.locator(".oreo-settings main").boundingBox();
    assert(actions.y + actions.height <= panel.y + panel.height + 1, "Confirmation actions were not revealed inside Settings");
    const bar = page.locator("[data-settings-navigation-bar]");
    const background = await bar.evaluate(el => getComputedStyle(el).backgroundColor);
    assert.notEqual(background, "rgba(0, 0, 0, 0)", "Navigation must have its own opaque surface");
    const barBox = await bar.boundingBox();
    assert(Math.abs(barBox.y - panel.y) < 1, "Navigation bar must stay at the scroller's top");
    const overflow = await row.evaluate(root => [...root.querySelectorAll("*")].filter(el => !el.closest(".sr-only") && getComputedStyle(el).visibility !== "hidden").flatMap(el => {
      const box = el.getBoundingClientRect(), bounds = root.getBoundingClientRect();
      return box.width && (box.left < bounds.left - 1 || box.right > bounds.right + 1) ? [el.tagName] : [];
    }));
    report.expanded.push({ width, dark, card, overflow, confirmationFocusedAndVisible: true });
    assert.equal(overflow.length, 0, "Expanded confirmation exceeds its row");
    if (width === 390 && dark && card === "outline") await page.screenshot({ path: `${out}/expanded-mobile.png`, fullPage: true });
  }
  await page.goto(`${url}/settings-lab?case=export&dark`);
  await page.getByLabel("模拟连接失败").check();
  await page.getByRole("button", { name: "Prepare export", exact: true }).click();
  await page.getByRole("button", { name: "Try again", exact: true }).waitFor();
  assert.equal(await page.getByRole("status").textContent(), "Couldn't prepare this export. Try again when you're ready.");
  await page.getByLabel("模拟连接失败").uncheck();
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page.getByRole("button", { name: "Download", exact: true }).waitFor();
  report.exportRecovery = true;
  await page.screenshot({ path: `${out}/export-ready.png`, fullPage: true });
  await page.getByRole("button", { name: "Export format", exact: true }).click();
  const expected = await page.evaluate(() => {
    const sample = document.createElement("span"); sample.style.backgroundColor = "var(--color-bg-surface)";
    document.body.append(sample); const color = getComputedStyle(sample).backgroundColor; sample.remove(); return color;
  });
  assert.equal(await page.getByRole("menu").evaluate(el => getComputedStyle(el).backgroundColor), expected);
  report.darkPopup = true;
} finally {
  await browser.close();
  await writeFile(`${out}/state-probes.json`, JSON.stringify(report, null, 2) + "\n");
}
console.log("State probes: 12 narrow expanded layouts, export retry and dark portal passed.");

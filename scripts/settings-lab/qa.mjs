import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const url = process.env.SETTINGS_LAB_URL || "http://localhost:5198";
const out = "artifacts/settings-lab";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1120 }, reducedMotion: "reduce" });
page.setDefaultTimeout(5000);
// Cold Vite startup may exceed interaction timeouts in a fresh checkout.
page.setDefaultNavigationTimeout(60_000);
const report = { generatedAt: new Date().toISOString(), matrix: [], comparison: [], mutations: [], interactions: [], failures: [], pageErrors: [] };
page.on("pageerror", e => report.pageErrors.push(e.message));
async function check(name, run) {
  try { await run(); report.interactions.push({ name, pass: true }); }
  catch (e) { report.failures.push({ name, error: e.message }); console.log("FAIL", name, e.message); }
}
async function go(query = "") {
  await page.goto(`${url}/settings-lab${query}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
}
async function geometry() {
  return page.evaluate(() => {
    const root = document.querySelector(".lab-product");
    const failures = [];
    const rows = [...root.querySelectorAll(".settings-adaptive-row")];
    for (const [i, row] of rows.entries()) {
      const body = row.firstElementChild;
      const r = row.getBoundingClientRect();
      for (const el of row.querySelectorAll("*")) {
        if (el.closest(".sr-only") || getComputedStyle(el).visibility === "hidden" || getComputedStyle(el).clip === "rect(0px, 0px, 0px, 0px)") continue;
        const b = el.getBoundingClientRect();
        if (b.width && (b.right > r.right + 1 || b.left < r.left - 1)) failures.push(`row ${i}: ${el.tagName} outside row`);
      }
      const identity = body.querySelector(".settings-adaptive-row__identity").getBoundingClientRect();
      const title = body.querySelector(".settings-adaptive-row__identity > div:last-child > div:first-child");
      const titleStyle = getComputedStyle(title);
      if (titleStyle.fontSize !== "13px" || titleStyle.fontWeight !== "500" || titleStyle.lineHeight !== "18px") failures.push(`row ${i}: inherited title typography changed`);
      const control = body.querySelector(".settings-adaptive-row__control")?.getBoundingClientRect();
      if (control && Math.min(identity.right, control.right) - Math.max(identity.left, control.left) > 1 && Math.min(identity.bottom, control.bottom) - Math.max(identity.top, control.top) > 1) failures.push(`row ${i}: control overlaps identity`);
      if (body.scrollWidth > body.clientWidth + 1) failures.push(`row ${i}: horizontal overflow`);
    }
    for (const section of root.querySelectorAll("section")) {
      const heading = section.querySelector("h2");
      if (heading && section.querySelector(":scope > p, :scope > div:first-child p")) failures.push("small group label must not have a description");
      const row = section.querySelector(".settings-adaptive-row");
      if (heading && row && Math.abs(heading.getBoundingClientRect().left - row.getBoundingClientRect().left) > 1.1) failures.push("section heading lost row-edge alignment");
    }
    if (document.documentElement.scrollWidth > innerWidth + 1) failures.push("document horizontal overflow");
    return { rows: rows.length, failures };
  });
}

try {
  for (const width of [1440, 390]) for (const dark of [false, true]) for (const recipe of ["preferences", "workspace", "integrations", "export"]) {
    await page.setViewportSize({ width, height: 1120 });
    await go(`?case=${recipe}&stress${dark ? "&dark" : ""}`);
    for (const scheme of ["sunken-nav", "sunken-content", "card-panel", "drawer"]) for (const card of ["outline", "surface", "divider"]) {
      await page.getByLabel("Background hierarchy").selectOption(scheme);
      await page.getByLabel("Card style", { exact: true }).selectOption(card);
      await page.waitForTimeout(220);
      const result = await geometry();
      report.matrix.push({ width, dark, recipe, scheme, card, ...result });
      if (result.failures.length) console.log("GEOMETRY", width, dark, recipe, scheme, card, result.failures);
    }
  }
  console.log("Matrix complete:", report.matrix.length);
  await page.setViewportSize({ width: 1440, height: 1120 });
  await go();
  await check("Connecting button retains its measured width", async () => {
    const button = page.getByRole("button", { name: "Reconnect Calendar", exact: true });
    const before = await button.boundingBox();
    await button.click();
    const pending = page.getByRole("button", { name: "Connecting… Calendar", exact: true });
    assert.equal(await pending.isDisabled(), true);
    const after = await pending.boundingBox();
    assert(Math.abs(before.width - after.width) < .1, `width changed ${before.width} → ${after.width}`);
    await page.locator('[data-service="calendar"][data-connection="connected"]').waitFor();
  });
  await check("Manage, cancel disconnect, confirm disconnect", async () => {
    const row = page.locator('[data-service="github"]');
    await row.getByRole("button", { name: "Manage", exact: true }).click();
    assert.equal(await row.getByText("aster-studio", { exact: true }).isVisible(), true);
    await row.getByRole("button", { name: "Disconnect…", exact: true }).click();
    await row.getByRole("button", { name: "Keep connected", exact: true }).click();
    assert.equal(await row.getAttribute("data-connection"), "connected");
    await row.getByRole("button", { name: "Disconnect…", exact: true }).click();
    await row.getByRole("button", { name: "Disconnect GitHub", exact: true }).click();
    assert.equal(await row.getAttribute("data-connection"), "disconnected");
    await page.waitForFunction(() => document.activeElement?.getAttribute("aria-label") === "Connect GitHub");
  });
  await check("Failed connection recovers on retry", async () => {
    await page.getByLabel("模拟连接失败").check();
    await page.getByRole("button", { name: "Connect Documents", exact: true }).click();
    const row = page.locator('[data-service="drive"][data-connection="error"]');
    await row.waitFor();
    assert.equal(await row.getByRole("alert").isVisible(), true);
    await page.getByLabel("模拟连接失败").uncheck();
    await row.getByRole("button", { name: "Reconnect Documents", exact: true }).click();
    await page.locator('[data-service="drive"][data-connection="connected"]').waitFor();
  });
  await check("Navigation cancels pending work without leaving stale state", async () => {
    await page.getByRole("button", { name: "Connect GitHub", exact: true }).click();
    await page.getByRole("button", { name: /02.*结构组合/ }).click();
    await page.getByRole("button", { name: /03.*边界扩展/ }).click();
    assert.equal(await page.locator('[data-service="github"]').getAttribute("data-connection"), "disconnected");
  });
  await check("Editor save and changes survive navigation", async () => {
    await page.getByRole("button", { name: /02.*结构组合/ }).click();
    await page.getByLabel("Workspace instructions").fill("Context stays close to the work.");
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    assert.equal(await page.getByRole("button", { name: "Save changes", exact: true }).isDisabled(), true);
    await page.getByRole("button", { name: /01.*内容替换/ }).click();
    await page.getByRole("button", { name: /02.*结构组合/ }).click();
    assert.equal(await page.getByLabel("Workspace instructions").inputValue(), "Context stays close to the work.");
  });
  await check("Switch works with keyboard and survives implementation switch", async () => {
    await page.getByRole("button", { name: /01.*内容替换/ }).click();
    const toggle = page.getByRole("switch", { name: "Direct messages" });
    await toggle.focus(); await page.keyboard.press("Space");
    assert.equal(await toggle.getAttribute("aria-checked"), "false");
    await page.getByRole("button", { name: "现有接口", exact: true }).click();
    assert.equal(await page.getByRole("switch", { name: "Direct messages" }).getAttribute("aria-checked"), "false");
    await page.getByRole("button", { name: "继承式扩展", exact: true }).click();
  });
  await check("Long menu option fits narrow viewport and selection", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Notification language", exact: true }).click();
    const menu = page.getByRole("menu");
    const b = await menu.boundingBox();
    assert(b.x >= 0 && b.x + b.width <= 391, `menu exceeds viewport: ${JSON.stringify(b)}`);
    await page.getByRole("menuitem", { name: "Deutsch — Benachrichtigungen und Zusammenfassungen" }).click();
    assert.equal((await geometry()).failures.length, 0);
  });
  await check("Drawer traps keyboard focus and restores its trigger", async () => {
    const trigger = page.getByRole("button", { name: "Open settings navigation" });
    await trigger.click();
    await page.getByRole("dialog").waitFor();
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press("Tab");
      // Base UI's hidden focus guards redirect on the next animation frame.
      await page.waitForFunction(() => !!document.activeElement.closest('[role="dialog"]'), null, { timeout: 1000 });
      assert(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')), "focus escaped dialog");
    }
    await page.keyboard.press("Escape");
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert(await trigger.evaluate(el => document.activeElement === el), "focus was not restored");
  });
  await check("Inherited and original compositions use the same stress brief", async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const recipe of ["preferences", "workspace", "integrations", "export"]) for (const mode of ["original", "inherited"]) {
      await go(`?case=${recipe}&mode=${mode}&stress`);
      if (recipe === "preferences") {
        await page.getByRole("button", { name: "Notification language", exact: true }).click();
        await page.getByRole("menuitem", { name: "Deutsch — Benachrichtigungen und Zusammenfassungen" }).click();
      }
      const overflow = await page.locator(".oreo-settings main").evaluate(el => el.scrollWidth - el.clientWidth);
      report.comparison.push({ recipe, mode, width: 390, horizontalOverflowPx: overflow });
      if (mode === "inherited") assert.equal(overflow, 0, `${recipe} still has horizontal overflow`);
    }
  });
  await check("Geometry and typography checks reject deliberate regressions", async () => {
    await page.setViewportSize({ width: 1440, height: 1120 }); await go();
    for (const [name, css] of [
      ["overlapping controls", ".settings-adaptive-row__control { position:absolute!important; left:0!important; top:0!important; }"],
      ["unrelated title size", ".settings-adaptive-row__identity > div:last-child > div:first-child { font-size:19px!important; }"]
    ]) {
      const style = await page.addStyleTag({ content: css });
      const result = await geometry();
      report.mutations.push({ name, caught: result.failures.length > 0, failures: result.failures });
      assert(result.failures.length, `Failed to catch ${name}`);
      await style.evaluate(el => el.remove());
      assert.equal((await geometry()).failures.length, 0, "Mutation did not cleanly revert");
    }
  });
  await check("Small group labels reject a reintroduced description", async () => {
    await go("?case=preferences");
    await page.locator(".lab-product section").first().evaluate(section => {
      const description = document.createElement("p");
      description.dataset.injectedDescription = "true";
      description.textContent = "This explanation does not belong under a small label.";
      section.firstElementChild.after(description);
    });
    const result = await geometry();
    const caught = result.failures.includes("small group label must not have a description");
    report.mutations.push({ name: "description under a small group label", caught, failures: result.failures });
    assert(caught, "Group description regression was not detected");
    await page.locator("[data-injected-description]").evaluate(el => el.remove());
    assert.equal((await geometry()).failures.length, 0);
  });
  await check("Transfer recipe prepares and downloads valid JSON and CSV", async () => {
    await go("?case=export");
    for (const format of ["JSON", "CSV"]) {
      if (format === "CSV") {
        await page.getByRole("button", { name: "Export format", exact: true }).click();
        await page.getByRole("menuitem", { name: "CSV", exact: true }).click();
      }
      await page.getByRole("button", { name: "Prepare export", exact: true }).click();
      assert.equal(await page.getByRole("button", { name: "Export format", exact: true }).isDisabled(), true);
      await page.getByRole("button", { name: "Download", exact: true }).waitFor();
      const promise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Download", exact: true }).click();
      const file = await promise;
      assert.equal(file.suggestedFilename(), `aster-sample.${format.toLowerCase()}`);
      const body = await readFile(await file.path(), "utf8");
      if (format === "JSON") assert.equal(JSON.parse(body).projects.length, 2);
      else assert.equal(body.trim().split("\n").length, 3);
    }
  });
  await check("Normal motion drawer closes and reopens without stale state", async () => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize({ width: 390, height: 844 }); await go();
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Open settings navigation" }).click();
      await page.getByRole("dialog").waitFor();
      await page.waitForTimeout(80);
      await page.keyboard.press("Escape");
      await page.getByRole("dialog").waitFor({ state: "hidden" });
    }
    assert.equal(await page.getByRole("button", { name: "Open settings navigation" }).getAttribute("aria-expanded"), "false");
    await page.emulateMedia({ reducedMotion: "reduce" });
  });
  for (const [name, width, query] of [["desktop",1440,""],["mobile",390,"?stress"],["dark",1440,"?dark"],["narrow",1440,"?narrow&stress"]]) {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 1120 });
    await go(query);
    await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  }
} finally {
  await browser.close();
  report.summary = { matrixCases: report.matrix.length, geometryFailures: report.matrix.filter(r => r.failures.length).length, interactionPasses: report.interactions.length, interactionFailures: report.failures.length, pageErrors: report.pageErrors.length };
  await writeFile(`${out}/qa.json`, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report.summary));
}
if (report.failures.length || report.pageErrors.length || report.matrix.some(r => r.failures.length)) process.exitCode = 1;

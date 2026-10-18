/** Headless local-only checks. Requires permission to launch Chromium; no foreground UI. */
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const origin = process.env.REMIX_URL || "http://127.0.0.1:5198";
if (!["127.0.0.1", "localhost"].includes(new URL(origin).hostname)) throw new Error("Use a local preview URL");
const baseline = process.argv.includes("--baseline");
const out = "artifacts/ai-remixes";
await mkdir(out, { recursive: true });
const sourceCheckout = baseline ? resolve(process.env.BASELINE_DIR || "../oreo-ui-baseline") : process.cwd();
const report = { generatedAt: new Date().toISOString(), sourceCheckout, revision: execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceCheckout, encoding: "utf8" }).trim(), diffSha256: createHash("sha256").update(execFileSync("git", ["diff", "--binary", "HEAD"], { cwd: sourceCheckout })).digest("hex"), buildIndexSha256: createHash("sha256").update(readFileSync(resolve(sourceCheckout, "dist/index.html"))).digest("hex"), baseline, locale: "en-US", origin, matrix: [], checks: [], errors: [], blockedRequests: [] };
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce", locale: "en-US" });
// Fixtures should not depend on analytics or other remote calls.
await context.route("**/*", route => {
  const url = new URL(route.request().url());
  if (["127.0.0.1", "localhost"].includes(url.hostname) || ["data:", "blob:"].includes(url.protocol)) return route.continue();
  report.blockedRequests.push(url.origin); return route.abort();
});
const page = await context.newPage();
page.on("pageerror", e => report.errors.push(e.message));
page.setDefaultTimeout(7000);
const slugs = ["prompt-box", "attachment", "confirmation", "plan", "sources"];
async function go(slug, options = "") {
  await page.goto(`${origin}/${slug}?view=remixes${options}`);
  await page.evaluate(() => document.fonts.ready);
  await page.getByRole("heading", { name: "AI remixes" }).waitFor();
}
const remixed = () => page.getByRole("region", { name: "Remixed component", exact: true });
async function check(name, run) {
  try { await run(); report.checks.push({ name, pass: true }); }
  catch (e) { report.checks.push({ name, pass: false, error: e.message }); }
}
try {
  if (baseline) {
    for (const slug of slugs) {
      await page.goto(`${origin}/${slug}`); await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${out}/before-${slug}.png`, fullPage: true });
      report.matrix.push({ slug, width: 1440, height: 1000, theme: "light", state: "original playground before integration", capture: `before-${slug}.png` });
    }
  } else {
    for (const slug of slugs) for (const mode of ["capability", "style"]) for (const width of [390, 900, 1440]) for (const dark of [false, true]) {
      await page.setViewportSize({ width, height: 1000 });
      await go(slug, `&remix=${mode}&stress${dark ? "&dark" : ""}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      const name = `${slug}-${mode}-${width}-${dark ? "dark" : "light"}.png`;
      await page.screenshot({ path: `${out}/${name}`, fullPage: true });
      report.matrix.push({ slug, mode, width, height: 1000, theme: dark ? "dark" : "light", reducedMotion: true, stress: true, overflow, capture: name });
      if (overflow) report.errors.push(`Horizontal overflow: ${name}`);
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const slug of slugs) for (const mode of ["capability", "style"]) {
      await go(slug, `&remix=${mode}`);
      await page.screenshot({ path: `${out}/default-${slug}-${mode}.png`, fullPage: true });
    }
    for (const slug of slugs) {
      await page.goto(`${origin}/${slug}`); await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `${out}/after-${slug}.png`, fullPage: true });
    }
    await check("Entry and exit preserve the original playground", async () => {
      await page.goto(`${origin}/prompt-box`);
      await page.getByRole("button", { name: "AI remixes", exact: true }).click();
      await page.getByRole("heading", { name: "AI remixes" }).waitFor();
      await page.getByRole("button", { name: "Playground", exact: true }).click();
      assert(await page.getByRole("main", { name: "Prompt Box playground" }).isVisible());
    });
    await check("Prompt queue: keyboard, pause, edit, remove, retry and empty state", async () => {
      await go("prompt-box");
      const r = remixed();
      await r.getByRole("textbox", { name: "Prompt", exact: true }).fill("Check evidence [fail]");
      await r.getByRole("textbox", { name: "Prompt", exact: true }).press("Shift+Enter");
      assert((await r.getByRole("textbox", { name: "Prompt", exact: true }).inputValue()).includes("\n"));
      await r.getByRole("textbox", { name: "Prompt", exact: true }).press("Enter");
      assert.equal(await r.getByRole("listitem").count(), 2);
      await r.getByRole("button", { name: "Run queue" }).click();
      await r.getByRole("button", { name: "Pause queue" }).click();
      await r.getByRole("button", { name: "Run queue" }).click();
      await r.getByText("Simulated failure · ready to retry", { exact: true }).waitFor();
      await r.getByRole("button", { name: "Retry", exact: true }).click();
      await page.waitForFunction(() => [...document.querySelectorAll('[aria-label="Remixed component"] .remix-queue-item')].every(el => el.textContent.includes("Demo complete")));
      await r.getByRole("button", { name: "Edit prompt 1", exact: true }).click();
      assert(await r.getByRole("textbox", { name: "Prompt", exact: true }).evaluate(el => el === document.activeElement));
      await r.getByRole("textbox", { name: "Prompt", exact: true }).fill("Edited local prompt");
      await r.getByRole("textbox", { name: "Prompt", exact: true }).press("Enter");
      assert(await r.getByText("Edited local prompt", { exact: true }).isVisible());
      await r.getByRole("button", { name: "Remove prompt 1", exact: true }).click();
      await r.getByRole("button", { name: "Remove prompt 1", exact: true }).click();
      assert(await r.getByText("No prompts queued", { exact: true }).isVisible());
      assert(await r.getByRole("textbox", { name: "Prompt", exact: true }).evaluate(el => el === document.activeElement));
      await page.screenshot({ path: `${out}/state-queue-empty.png`, fullPage: true });
    });
    await check("Attachment: invalid range, navigation and explicit inclusion", async () => {
      await go("attachment"); const r = remixed();
      await r.getByRole("textbox", { name: "Pages to include" }).fill("5-7");
      assert(await r.getByRole("button", { name: "Include pages" }).isDisabled());
      await r.getByRole("textbox", { name: "Pages to include" }).fill("1, 3-4");
      await r.getByRole("button", { name: "Next page" }).click();
      assert(await r.getByLabel("Document preview, page 2").isVisible());
      await r.getByRole("button", { name: "Include pages" }).click();
      assert(await r.getByText("Included pages 1, 3, 4 in local context.", { exact: true }).isVisible());
      await page.screenshot({ path: `${out}/state-pages-included.png`, fullPage: true });
    });
    await check("Confirmation: no selection, selective execution, undo and denial", async () => {
      await go("confirmation"); const r = remixed();
      await r.getByRole("checkbox", { name: "Read sample research" }).uncheck();
      await r.getByRole("checkbox", { name: "Create a local summary" }).uncheck();
      await r.getByRole("button", { name: "Run 0 selected" }).click();
      assert(await r.getByText("Select at least one operation, or decline.").isVisible());
      await r.getByRole("checkbox", { name: "Archive sample notes" }).check();
      await r.getByRole("button", { name: "Run 1 selected" }).click();
      await r.getByText("Notes archived · 0 active notes, 1 archived", { exact: true }).waitFor();
      assert(await r.getByText("Skipped · Create a local summary", { exact: true }).isVisible());
      await page.screenshot({ path: `${out}/state-permission-receipt.png`, fullPage: true });
      await r.getByRole("button", { name: "Undo demo operations" }).click();
      assert(await r.getByText("1 active note · onboarding-notes", { exact: true }).isVisible());
      await r.getByRole("button", { name: "Decline", exact: true }).click();
      await r.getByText("Declined · nothing ran", { exact: true }).waitFor();
    });
    await check("Plan: dependencies, failure, retry, completion and reset", async () => {
      await go("plan"); const r = remixed();
      assert(await r.getByRole("button", { name: "Run step 2" }).isDisabled());
      await r.getByRole("button", { name: "Run step 1" }).click();
      await r.getByRole("button", { name: "Run step 2" }).click();
      await r.getByRole("button", { name: "Retry step 2" }).waitFor();
      assert(await r.getByRole("button", { name: "Run step 3" }).isDisabled());
      await page.screenshot({ path: `${out}/state-plan-failure.png`, fullPage: true });
      await r.getByRole("button", { name: "Retry step 2" }).click();
      await r.getByRole("button", { name: "Run step 3" }).click();
      await r.getByText("Demo summary ready. All steps complete.", { exact: true }).waitFor();
      assert.equal(await r.getByRole("progressbar").getAttribute("aria-valuenow"), "3");
      await r.getByRole("button", { name: "Reset plan" }).click();
      assert.equal(await r.getByRole("progressbar").getAttribute("aria-valuenow"), "0");
    });
    await check("Sources: keyboard selection, empty query recovery, retained inclusion", async () => {
      await go("sources"); const r = remixed();
      await r.getByRole("link", { name: /Activation snapshot/ }).focus();
      await page.keyboard.press("Enter");
      await r.getByRole("checkbox", { name: "Include this source" }).check();
      await r.getByRole("searchbox", { name: "Find evidence" }).fill("no such source");
      assert(await r.getByText("No matching evidence", { exact: true }).isVisible());
      assert(await r.getByText("2 of 3 sources included. Selection survives filtering.", { exact: true }).isVisible());
      await r.getByRole("button", { name: "Clear search" }).click();
      await page.screenshot({ path: `${out}/state-evidence-selection.png`, fullPage: true });
    });
    await check("Style adaptations preserve their original interactions", async () => {
      await go("prompt-box", "&remix=style"); let r = remixed();
      await r.getByRole("textbox", { name: "Prompt", exact: true }).fill("A style test");
      await r.getByRole("textbox", { name: "Prompt", exact: true }).press("Enter");
      assert(await r.getByText("Local demo received: A style test", { exact: true }).isVisible());
      await go("attachment", "&remix=style"); r = remixed();
      await r.getByRole("button", { name: "Remove onboarding-research.pdf", exact: true }).focus(); await page.keyboard.press("Enter");
      await r.getByRole("button", { name: "Restore sample" }).click();
      await go("confirmation", "&remix=style"); r = remixed();
      await r.getByRole("button", { name: "Allow once" }).click(); await r.getByText("Allowed in this demo", { exact: true }).waitFor();
      await go("plan", "&remix=style"); r = remixed();
      await r.getByRole("button", { name: "Complete next step" }).click(); assert.equal(await r.getByRole("progressbar").getAttribute("aria-valuenow"), "2");
      await go("sources", "&remix=style"); r = remixed();
      await r.getByRole("link", { name: /Support themes/ }).click(); assert(await r.getByRole("region", { name: "Evidence excerpt" }).isVisible());
    });
    await check("Reduced-motion disables CSS transitions and animations in the affected view", async () => {
      await go("plan");
      const moving = await page.locator(".remix-layout").evaluate(root => [...root.querySelectorAll("*")].filter(el => { const s = getComputedStyle(el); return s.animationName !== "none" || s.transitionDuration.split(",").some(v => parseFloat(v) > 0); }).length);
      assert.equal(moving, 0);
    });
  }
} finally {
  await context.close(); await browser.close();
  await writeFile(`${out}/${baseline ? "baseline-manifest" : "qa-results"}.json`, JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ captures: report.matrix.length, checks: report.checks.length, failed: report.checks.filter(c => !c.pass), errors: report.errors }, null, 2));
if (report.errors.length || report.checks.some(c => !c.pass)) process.exitCode = 1;

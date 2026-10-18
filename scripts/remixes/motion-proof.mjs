import { chromium } from "playwright";
import { mkdir, rename, writeFile } from "node:fs/promises";
const out = "artifacts/ai-remixes";
await mkdir(`${out}/video`, { recursive: true });
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const report = [];
try {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion, recordVideo: { dir: `${out}/video`, size: { width: 1440, height: 1000 } } });
    await context.route("**/*", route => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = []; page.on("pageerror", e => errors.push(e.message));
    const r = () => page.getByRole("region", { name: "Remixed component", exact: true });
    const marks = [];
    for (const slug of ["prompt-box", "attachment", "confirmation", "plan", "sources"]) {
      await page.goto(`http://127.0.0.1:5198/${slug}?view=remixes`);
      await page.evaluate(() => document.fonts.ready);
      await r().scrollIntoViewIfNeeded();
      // Intentional viewing dwell for the evidence recording, not application latency.
      await page.waitForTimeout(400);
      const before = Date.now();
      if (slug === "prompt-box") {
        await r().getByRole("textbox", { name: "Prompt", exact: true }).fill("Compare the sample interviews");
        await r().getByRole("button", { name: "Add attachment" }).click();
        await r().getByRole("textbox", { name: "Prompt", exact: true }).press("Enter");
        await r().getByRole("button", { name: "Run queue" }).click();
        await page.waitForFunction(() => [...document.querySelectorAll('[aria-label="Remixed component"] .remix-queue-item')].every(el => el.textContent.includes("Demo complete")));
      } else if (slug === "attachment") {
        await r().getByRole("button", { name: "Next page" }).click();
        await page.waitForTimeout(350);
        await r().getByRole("textbox", { name: "Pages to include" }).fill("2-4");
        await r().getByRole("button", { name: "Include pages" }).click();
      } else if (slug === "confirmation") {
        await r().getByRole("button", { name: "Run 2 selected" }).click();
        await r().getByText("2 demo operations completed", { exact: true }).waitFor();
        await page.waitForTimeout(400);
        await r().getByRole("button", { name: "Undo demo operations" }).click();
      } else if (slug === "plan") {
        await r().getByRole("button", { name: "Run step 1" }).click();
        await r().getByRole("button", { name: "Run step 2" }).click();
        await r().getByRole("button", { name: "Retry step 2" }).waitFor();
        await page.waitForTimeout(350);
        await r().getByRole("button", { name: "Retry step 2" }).click();
        await r().getByRole("button", { name: "Run step 3" }).click();
        await r().getByText("Demo summary ready. All steps complete.", { exact: true }).waitFor();
      } else {
        await r().getByRole("link", { name: /Activation snapshot/ }).click();
        await r().getByRole("checkbox", { name: "Include this source" }).check();
        const disclosure = r().getByRole("button", { name: /Sources/ });
        await disclosure.click(); await page.waitForTimeout(300); await disclosure.click();
      }
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${out}/motion-${slug}-${reducedMotion}.png` });
      marks.push({ slug, interactionMs: Date.now() - before });
    }
    const video = await page.video().path();
    await context.close();
    const destination = `${out}/video/interactions-${reducedMotion}.webm`;
    await rename(video, destination);
    report.push({ reducedMotion, video: destination, marks, pageErrors: errors });
  }
} finally { await browser.close(); await writeFile(`${out}/motion-results.json`, JSON.stringify(report, null, 2)); }
console.log(JSON.stringify(report, null, 2));
if (report.some(run => run.pageErrors.length)) process.exitCode = 1;

/** Read-only gallery/navigation and responsive smoke check, local or canonical production. */
import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const origin = process.env.REMIX_URL || "http://127.0.0.1:5200";
assert(["localhost", "127.0.0.1", "oreo-ui-preview.vercel.app"].includes(new URL(origin).hostname));
const slugs = ["prompt-box", "attachment", "confirmation", "plan", "sources"];
const out = process.env.REMIX_EVIDENCE || "artifacts/ai-remixes/gallery";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const page = await context.newPage(); const errors = []; const checks = [];
page.on("pageerror", error => errors.push(String(error)));
await context.route("**/*", route => new URL(route.request().url()).origin === new URL(origin).origin ? route.continue() : route.abort());
try {
 for (const width of [390, 900, 1440]) for (const dark of [false, true]) {
  await page.setViewportSize({ width, height: 1000 });
  const response = await page.goto(`${origin}/ai-remixes${dark ? "?dark" : ""}`); assert.equal(response.status(), 200);
  await page.getByRole("heading", { name: "Beyond the original." }).waitFor();
  assert.equal(await page.locator(".remix-gallery-card").count(), 5);
  assert.equal(await page.locator('.remix-gallery-links a[href*="view=remixes"]').count(), 10);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: `${out}/gallery-${width}-${dark ? "dark" : "light"}.png`, fullPage: true });
  checks.push(`gallery ${width} ${dark ? "dark" : "light"}`);
 }
 await page.setViewportSize({ width:1440, height:1000 });
 for (const slug of slugs) {
  for (const mode of ["capability", "style"]) {
   await page.goto(`${origin}/ai-remixes`);
   const link = page.locator(`.remix-gallery-links a[href="/${slug}?view=remixes&remix=${mode}"]`);
   await link.focus(); await page.keyboard.press("Enter");
   await page.getByRole("region", { name:"Remixed component" }).waitFor();
   assert(new URL(page.url()).searchParams.get("remix") === mode);
   assert(await page.getByRole("region", { name:"Original component" }).isVisible());
   await page.getByRole("link", { name:"All experiments", exact:true }).click();
   await page.getByRole("heading", { name:"Beyond the original." }).waitFor();
   checks.push(`${slug} ${mode} keyboard link and return`);
  }
  await page.locator(`.remix-gallery-links a[href="/${slug}?view=docs"]`).click();
  await page.getByRole("button", { name:"Explore AI remixes" }).waitFor();
  checks.push(`${slug} original docs`);
 }
 await page.goto(`${origin}/button`);
 await page.getByRole("link", { name:"AI Remixes", exact:true }).click();
 await page.getByRole("heading", { name:"Beyond the original." }).waitFor();
 await page.goBack(); assert(new URL(page.url()).pathname === "/button");
 await page.goForward(); await page.getByRole("heading", { name:"Beyond the original." }).waitFor();
 checks.push("sidebar and history navigation");
 assert.deepEqual(errors, []);
} finally {
 await browser.close();
 await writeFile(`${out}/results.json`, JSON.stringify({ origin, timestamp:new Date().toISOString(), checks, errors }, null, 2));
}
console.log(JSON.stringify({ origin, checks:checks.length, errors }));

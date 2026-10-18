import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const out = "artifacts/ai-remixes";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, chromiumSandbox: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const report = [];
try {
  for (const [name, url] of [["overview", "https://claude.com/product/overview"], ["sonnet", "https://www.anthropic.com/news/claude-3-5-sonnet"]]) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${out}/official-${name}.png` });
    if (name === "overview") {
      await page.getByRole("heading", { name: "Put Claude to work", exact: true }).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/official-product-section.png` });
      await page.getByText("Modify prompt", { exact: true }).first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${out}/official-conversation-demo.png` });
    }
    report.push({ name, url, title: await page.title(), images: await page.locator("img").evaluateAll(imgs => imgs.map(img => ({ src: img.currentSrc || img.src, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight }))) });
  }
} finally { await browser.close(); await writeFile(`${out}/official-reference.json`, JSON.stringify(report, null, 2)); }
console.log(JSON.stringify(report.map(({name, title, url, images}) => ({name, title, url, images: images.length})), null, 2));

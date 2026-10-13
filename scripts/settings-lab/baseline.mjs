import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
const currentURL = process.env.SETTINGS_LAB_URL || "http://localhost:5198";
const baselineURL = process.env.SETTINGS_BASELINE_URL || "http://localhost:5199";
const out = "artifacts/settings-lab/baseline";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const contexts = await Promise.all([baselineURL, currentURL].map(() => browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" })));
const pages = await Promise.all(contexts.map(c => c.newPage()));
const pixels = await browser.newPage();
async function compare(a, b) {
  if (a.equals(b)) return { pass: true, identicalPNG: true, changedPixels: 0, maxChannelDelta: 0 };
  const diff = await pixels.evaluate(async urls => {
    const images = await Promise.all(urls.map(async url => createImageBitmap(await (await fetch(url)).blob())));
    if (images[0].width !== images[1].width || images[0].height !== images[1].height) return { pass: false, reason: "different dimensions" };
    const data = images.map(image => {
      const canvas = document.createElement("canvas"); canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext("2d"); ctx.drawImage(image, 0, 0);
      return ctx.getImageData(0, 0, image.width, image.height).data;
    });
    let changedPixels = 0, maxChannelDelta = 0;
    for (let i = 0; i < data[0].length; i += 4) {
      let delta = 0;
      for (let channel = 0; channel < 4; channel++) delta = Math.max(delta, Math.abs(data[0][i+channel] - data[1][i+channel]));
      if (delta) changedPixels++;
      maxChannelDelta = Math.max(maxChannelDelta, delta);
    }
    const totalPixels = images[0].width * images[0].height;
    // GPU shadow-edge rounding: at most 1/255 on <=0.001% of pixels.
    // A 1px shift, color change, missing glyph or layout change exceeds this.
    return { pass: maxChannelDelta <= 1 && changedPixels <= totalPixels * .00001, changedPixels, maxChannelDelta, totalPixels };
  }, [a,b].map(buffer => `data:image/png;base64,${buffer.toString("base64")}`));
  return { identicalPNG: false, ...diff };
}
const results = [];
const names = ["General", "Appearance", "Personalization", "Pets", "Keyboard shortcuts", "Usage & billing"];
const cases = [];
for (const dark of [false, true]) {
  for (const name of names) cases.push({ name, dark, scheme: "sunken-nav", card: "outline" });
  for (const scheme of ["sunken-nav", "sunken-content", "card-panel", "drawer"]) for (const card of ["outline", "surface", "divider"]) {
    if (scheme !== "sunken-nav" || card !== "outline") cases.push({ name: "General", dark, scheme, card });
  }
}
try {
  for (const [i, config] of cases.entries()) {
    const screenshots = await Promise.all(pages.map(async (page, n) => {
      const origin = n === 0 ? baselineURL : currentURL;
      await page.goto(`${origin}/settings`);
      await page.evaluate(config => localStorage.setItem("oreo-settings-frame", JSON.stringify({ dark: config.dark, appearance: { scheme: config.scheme, card: config.card, navIcons: true } })), config);
      await page.reload();
      await page.evaluate(async () => { await document.fonts.load('13px "Inter Variable"'); await document.fonts.ready; });
      await page.addStyleTag({ content: ".fixed.bottom-6.right-6 { visibility: hidden !important; }" });
      if (config.name !== "General") await page.locator(".oreo-settings").getByRole("button", { name: config.name, exact: true }).click();
      await page.waitForTimeout(700);
      const top = await page.locator(".oreo-settings").screenshot({ animations: "disabled" });
      await page.locator(".oreo-settings main").evaluate(el => { el.scrollTop = el.scrollHeight; });
      const bottom = await page.locator(".oreo-settings").screenshot({ animations: "disabled" });
      return [top, bottom];
    }));
    for (const [position, suffix] of [[0, "top"], [1, "bottom"]]) {
      const result = await compare(screenshots[0][position], screenshots[1][position]);
      results.push({ ...config, position: suffix, ...result });
      if (!result.identicalPNG || i === 0) {
        await writeFile(`${out}/${i}-${suffix}-source.png`, screenshots[0][position]);
        await writeFile(`${out}/${i}-${suffix}-current.png`, screenshots[1][position]);
      }
      console.log(`${result.pass ? "PASS" : "DIFF"} original ${i + 1}/${cases.length} ${suffix}: ${config.name} ${config.scheme}/${config.card} ${config.dark ? "dark" : "light"}`);
    }
  }
} finally {
  await browser.close();
  await writeFile(`${out}/report.json`, JSON.stringify({ baseline: "f63171f4d0f8097d98ca9606a7d6760f7871bf79", comparedAt: new Date().toISOString(), comparisons: results.length, passed: results.filter(r => r.pass).length, identical: results.filter(r => r.identicalPNG).length, tolerance: "At most 1/255 per channel on <= 0.001% of pixels; no size mismatch", results }, null, 2) + "\n");
}
if (results.some(r => !r.pass)) process.exitCode = 1;

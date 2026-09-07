import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "output/playwright/interior";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4321";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const [device, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const [name, path] of [
      ["projects", "/projects/"],
      ["writing", "/posts/"],
      ["about", "/about/"],
      ["article", "/posts/adding-new-posts-in-astropaper-theme/"],
    ]) {
      await page.goto(base + path);
      for (const theme of ["dark", "light"]) {
        if ((await page.locator("html").getAttribute("data-theme")) !== theme)
          await page.locator("#theme-btn").click();
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `${output}/${name}-${device}-${theme}.png`,
          fullPage: name !== "article",
          animations: "disabled",
        });
        results.push({
          name,
          device,
          width,
          theme,
          geometry: await page.evaluate(() => ({
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
          })),
        });
      }
      if (name === "article") {
        await page.locator("#theme-btn").click();
        await page.locator(".code-block").first().scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `${output}/article-code-${device}.png`,
          animations: "disabled",
        });
      }
    }
    results.push({ device, errors });
    await page.close();
  }
  await writeFile(
    `${output}/visual-checks.json`,
    JSON.stringify(results, null, 2)
  );
  console.log(JSON.stringify({ screenshots: 18, results }));
} finally {
  await browser.close();
}

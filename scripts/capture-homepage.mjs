import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const output = "output/playwright";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4321";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1086 },
  });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base);
  const results = [];
  for (const [name, width, height, theme, fullPage] of [
    ["home-desktop-dark", 1440, 1086, "dark", true],
    ["home-desktop-light", 1440, 1086, "light", true],
    ["home-mobile-dark", 390, 844, "dark", true],
    ["home-mobile-light", 390, 844, "light", true],
    ["home-tablet-dark", 768, 1024, "dark", true],
    ["home-laptop-dark", 1440, 900, "dark", false],
  ]) {
    await page.setViewportSize({ width, height });
    if ((await page.locator("html").getAttribute("data-theme")) !== theme) {
      await page.locator("#theme-btn").click();
    }
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `${output}/${name}.png`,
      fullPage,
      animations: "disabled",
    });
    results.push({
      name,
      width,
      height,
      theme,
      geometry: await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      })),
      images: await page
        .locator("img")
        .evaluateAll(images =>
          images.map(image => ({
            src: image.currentSrc,
            complete: image.complete,
            width: image.naturalWidth,
          }))
        ),
    });
  }
  await page.goto(`${base}/about/`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `${output}/about-desktop.png`,
    fullPage: true,
    animations: "disabled",
  });
  await page.goto(`${base}/posts/adding-new-posts-in-astropaper-theme/`);
  await page.screenshot({
    path: `${output}/article-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });
  await writeFile(
    `${output}/visual-checks.json`,
    JSON.stringify({ results, errors }, null, 2)
  );
  console.log(JSON.stringify({ screenshots: results.length + 2, errors }));
} finally {
  await browser.close();
}

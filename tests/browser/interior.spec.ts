import { test, expect } from "@playwright/test";

const articlePath = "/posts/adding-new-posts-in-astropaper-theme/";
const pages = [
  { path: "/projects/", title: "作品与实验", active: "作品" },
  { path: "/posts/", title: "写作", active: "写作" },
  { path: "/about/", title: "关于 Coolbat", active: "关于" },
  {
    path: articlePath,
    title: "Adding new posts in AstroPaper theme",
    active: "写作",
  },
];

for (const width of [375, 768, 1024, 1440]) {
  for (const item of pages) {
    test(`${item.path} remains readable at ${width}px in both themes`, async ({
      page,
    }) => {
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.goto(item.path);
      for (const theme of ["dark", "light"]) {
        if (theme === "light") await page.locator("#theme-btn").click();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          item.title
        );
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth)
        ).toBeLessThanOrEqual(width);
        await expect(
          page.locator(`.primary-nav a[aria-current="page"]`)
        ).toHaveText(item.active);
        await expect(
          page.locator(".site-footer a[href='https://github.com/coolbat']")
        ).toBeVisible();
        await expect(
          page.locator(".site-footer a[href='https://x.com/coolbat1999']")
        ).toBeVisible();
        if (item.path === articlePath) {
          const table = await page
            .locator("#article table")
            .first()
            .boundingBox();
          expect(table!.x + table!.width).toBeLessThanOrEqual(width);
          const bodySize = await page
            .locator("#article")
            .evaluate(node => parseFloat(getComputedStyle(node).fontSize));
          expect(bodySize).toBeGreaterThanOrEqual(16);
        }
      }
      expect(errors).toEqual([]);
    });
  }
}

test("writing opens the original article and preserves attribution and contact links", async ({
  page,
}) => {
  await page.goto("/posts/");
  await expect(page.locator(".post-entry")).toHaveCount(1);
  await expect(page.locator(".post-entry")).toContainText("Sat Naing");
  await page.locator(".post-entry").click();
  await expect(page).toHaveURL(new RegExp(articlePath));
  await expect(page.locator(".article-author")).toHaveText("Sat Naing");
  await expect(page.locator(".article-meta time")).toHaveText([
    "2022.09.23",
    "2023.12.21",
  ]);
  const schema = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!
  );
  expect(schema.author[0].name).toBe("Sat Naing");
  expect(schema.author[0].url).toBeUndefined();
  await page.locator('.primary-nav a[href="/about/"]').click();
  await expect(page.locator(".about-contact a")).toHaveCount(2);
  expect(
    await page
      .locator(".about-contact a")
      .evaluateAll(links => links.map(link => link.getAttribute("href")))
  ).toEqual(["https://github.com/coolbat", "https://x.com/coolbat1999"]);
});

test("mobile contents jump to the heading and remain usable without JavaScript", async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(articlePath);
  await expect(page.locator(".mobile-toc")).not.toHaveAttribute("open", "");
  await page.locator(".mobile-toc summary").click();
  await page.locator('.mobile-toc a[href="#frontmatter"]').click();
  await expect(page.locator("#frontmatter")).toBeFocused();
  await expect(page).toHaveURL(/#frontmatter$/);
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noScript = await context.newPage();
  await noScript.goto(`http://127.0.0.1:4319${articlePath}`);
  await expect(noScript.locator("[data-copy-link]")).toBeHidden();
  await noScript.locator(".mobile-toc summary").click();
  await noScript.locator('.mobile-toc a[href="#frontmatter"]').click();
  await expect(noScript).toHaveURL(/#frontmatter$/);
  await expect(noScript.locator("#frontmatter")).toBeInViewport();
  await context.close();
});

test("code and canonical link copy work and survive repeated client navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text: string) => {
          Reflect.set(window, "copiedText", text);
        },
      },
    });
  });
  await page.goto(articlePath);
  const codeCount = await page.locator("#article pre").count();
  for (let visit = 0; visit < 2; visit++) {
    await expect(page.locator("[data-copy-code]")).toHaveCount(codeCount);
    await expect(page.locator("#reading-progress")).toHaveCount(1);
    const code = await page.locator("#article pre code").first().textContent();
    await page.locator("[data-copy-code]").first().click();
    await expect
      .poll(() => page.evaluate(() => Reflect.get(window, "copiedText")))
      .toBe(code);
    await page.locator("[data-copy-link]").click();
    await expect
      .poll(() => page.evaluate(() => Reflect.get(window, "copiedText")))
      .toBe(`https://coolbat.xyz${articlePath}`);
    await expect(page.getByRole("status")).toContainText("成功");
    await page.locator(".share-menu summary").click();
    const share = await page
      .locator('.share-menu a[href^="https://x.com/"]')
      .getAttribute("href");
    expect(new URL(share!).searchParams.get("url")).toBe(
      `https://coolbat.xyz${articlePath}`
    );
    await page.locator("[data-back-top]").click();
    await expect(page.locator("#article-top")).toBeFocused();
    await page.locator('.primary-nav a[href="/posts/"]').click();
    await page.locator(".post-entry").click();
  }
});

test("denied clipboard access gives useful feedback without script errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new DOMException("Denied", "NotAllowedError");
        },
      },
    });
  });
  await page.goto(articlePath);
  await page.locator("[data-copy-code]").first().click();
  await expect(page.getByRole("status")).toContainText("请手动选择并复制");
  await expect(page.locator("[data-copy-code]").first()).toHaveText("复制失败");
  expect(errors).toEqual([]);
});

test("interior layouts support 200 percent text size", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const item of pages) {
    await page.goto(item.path);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
      item.path
    ).toBeLessThanOrEqual(1440);
  }
});

import { test, expect } from "@playwright/test";

test("homepage has real content, readable HTML and a working share image", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Coolbat.*观星造物/
  );
  await expect(
    page.getByRole("region", { name: "精选作品", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "最近写作", exact: true })
  ).toBeVisible();
  await expect(page.locator("main")).not.toContainText("Adding new posts");
  await expect(page.locator(".project-card")).toHaveCount(4);
  await expect(page.locator(".project-card h3")).toHaveText([
    "AniDiagram",
    "HeroCards",
    "PhraseSketch",
    "Awesome DSH Plugins",
  ]);
  expect(
    await page
      .locator(".project-card > a")
      .evaluateAll(links => links.map(link => link.getAttribute("href")))
  ).toEqual([
    "https://github.com/coolbat/anidiagram",
    "https://github.com/coolbat/herocards",
    "https://github.com/coolbat/PhraseSketch",
    "https://github.com/coolbat/awesome-dsh-plugins",
  ]);
  await expect(
    page.locator(".project-card").filter({ hasText: "PhraseSketch" })
  ).toContainText("私有仓库");
  await expect(page.getByText("思考，还在路上。")).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://coolbat.xyz/"
  );
  expect(await page.locator('a[href="#"]').count()).toBe(0);
  const schema = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(schema).not.toContain("undefined");
  expect(
    JSON.parse(schema!)["@graph"].map(
      (item: { "@type": string }) => item["@type"]
    )
  ).toContain("WebSite");
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll(images =>
          images.every(
            image =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0
          )
        )
    )
    .toBe(true);
  const og = await request.get("/og.png");
  expect(og.ok()).toBe(true);
  const bytes = await og.body();
  expect(bytes.toString("ascii", 1, 4)).toBe("PNG");
  expect(bytes.readUInt32BE(16)).toBe(1200);
  expect(bytes.readUInt32BE(20)).toBe(630);
  expect(errors).toEqual([]);
});

test("theme survives client navigation, reload and system theme changes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "切换到浅色", exact: true }).click();
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "关于", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Coolbat"
  );
  await page
    .getByRole("link", { name: "coolbat.xyz 首页", exact: true })
    .click();
  await expect(page).toHaveURL(/4319\/$/);
  await page.getByRole("button", { name: "切换到深色", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile menu works with Escape and closes after navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "主导航" });
  await expect(nav).toBeHidden();
  await page.getByRole("button", { name: "展开导航", exact: true }).click();
  await expect(nav).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(
    page.getByRole("button", { name: "展开导航", exact: true })
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await nav.getByRole("link", { name: "作品", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.getByRole("navigation", { name: "主导航" })).toBeHidden();
  await expect(
    page.getByRole("button", { name: "展开导航", exact: true })
  ).toHaveAttribute("aria-expanded", "false");
});

test("keyboard skip and primary anchor move focus to their content", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "跳到正文" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await page.getByRole("link", { name: "探索我的作品", exact: true }).click();
  await expect(page).toHaveURL(/#featured-works$/);
  await expect(page.locator("#featured-works")).toBeFocused();
});

test("motion can be paused and reduced-motion changes are respected", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "暂停星光", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-paused",
    "true"
  );
  await page.reload();
  await expect(
    page.getByRole("button", { name: "播放星光", exact: true })
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "播放星光", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-motion-paused",
    "false"
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: "已减少动态效果", exact: true })
  ).toBeDisabled();
  expect(
    await page
      .locator(".glowing-star")
      .first()
      .evaluate(element => getComputedStyle(element).animationName)
  ).toBe("none");
});

test("navigation and primary content work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4319/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "主导航" })).toBeVisible();
  await expect(page.getByRole("button", { name: "展开导航" })).toBeHidden();
  await page
    .getByRole("navigation", { name: "主导航" })
    .getByRole("link", { name: "作品", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(page.locator(".project-card")).toHaveCount(5);
  await expect(
    page.getByRole("heading", { name: "Coolbat Blog", exact: true })
  ).toBeVisible();
  await context.close();
});

test("unavailable localStorage does not break theme controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage unavailable", "SecurityError");
      },
    })
  );
  await page.goto("/");
  await page.getByRole("button", { name: "切换到浅色", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});

test("search, original article and feed remain available", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "搜索文章", exact: true }).click();
  await expect(page).toHaveURL(/\/search\/$/);
  await page.getByRole("textbox").fill("Adding new posts");
  await page
    .getByRole("link", {
      name: "Adding new posts in AstroPaper theme",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(
    /\/posts\/adding-new-posts-in-astropaper-theme\/$/
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Adding new posts"
  );
  const schema = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent())!
  );
  expect(schema["@type"]).toBe("BlogPosting");
  for (const route of [
    "/rss.xml",
    "/sitemap-index.xml",
    "/robots.txt",
    "/tags/",
    "/archives/",
    "/projects/",
  ]) {
    expect((await request.get(route)).ok(), route).toBe(true);
  }
});

for (const width of [375, 390, 768, 1024, 1280, 1440, 1476, 1920]) {
  test(`layout fits ${width}px in both themes`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const theme of ["dark", "light"]) {
      if (theme === "light")
        await page
          .getByRole("button", { name: "切换到浅色", exact: true })
          .click();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const bounds = await page.evaluate(() => ({
        client: document.documentElement.clientWidth,
        scroll: document.documentElement.scrollWidth,
      }));
      expect(bounds.scroll, `${width}px / ${theme}`).toBeLessThanOrEqual(
        bounds.client
      );
      await expect(
        page.getByRole("link", { name: "探索我的作品", exact: true })
      ).toBeInViewport();
      const labelBounds = await page
        .locator(".hero-sky .star-label:visible")
        .evaluateAll(labels => ({
          bottom: Math.max(
            ...labels.map(label => label.getBoundingClientRect().bottom)
          ),
          nextSection: document
            .querySelector("#featured-works")!
            .getBoundingClientRect().top,
        }));
      expect(labelBounds.bottom).toBeLessThan(labelBounds.nextSection);
    }
  });
}

for (const width of [390, 768, 1440]) {
  test(`project grid handles more content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    // DOM-only layout fixture. It never adds fake projects to source or build output.
    for (const count of [2, 3, 4]) {
      await page.locator(".works-grid").evaluate((grid, count) => {
        while (grid.childElementCount > count) grid.lastElementChild!.remove();
        while (grid.childElementCount < count)
          grid.append(grid.firstElementChild!.cloneNode(true));
        (grid as HTMLElement).dataset.count = String(count);
        document.querySelector(".works-afterword")?.remove();
      }, count);
      const cards = await page.locator(".project-card").evaluateAll(items =>
        items.map(item => {
          const r = item.getBoundingClientRect();
          return { x: r.x, y: r.y, right: r.right, width: r.width };
        })
      );
      const expectedColumns = width < 768 ? 1 : width < 1280 ? 2 : count;
      expect(new Set(cards.map(card => Math.round(card.x))).size).toBe(
        expectedColumns
      );
      expect(
        cards.every(
          card => card.width > 0 && card.x >= 0 && card.right <= width
        )
      ).toBe(true);
    }
  });

  test(`long writing titles keep dates readable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    // Exercise the populated layout without publishing placeholder articles.
    await page.locator(".writing-empty").evaluate(empty => {
      const list = document.createElement("ul");
      list.className = "writing-list";
      for (const title of [
        "一个关于独立开发者如何探索人工智能与东方文化的很长很长的中文标题",
        "A".repeat(100),
      ]) {
        const item = document.createElement("li");
        item.innerHTML =
          '<a href="/posts/"><div><h3></h3><p>用于验证长标题和日期排版的浏览器测试文案。</p></div><time datetime="2026-09-07">2026.09.07</time></a>';
        item.querySelector("h3")!.textContent = title;
        list.append(item);
      }
      empty.replaceWith(list);
    });
    for (const row of await page.locator(".writing-list a").all()) {
      const bounds = await row.evaluate(link => {
        const title = link.querySelector("h3")!.getBoundingClientRect();
        const date = link.querySelector("time")!.getBoundingClientRect();
        return {
          title: { right: title.right, bottom: title.bottom },
          date: { left: date.left, right: date.right, top: date.top },
        };
      });
      expect(bounds.date.right).toBeLessThanOrEqual(width);
      if (width < 768)
        expect(bounds.title.bottom).toBeLessThanOrEqual(bounds.date.top);
      else expect(bounds.title.right).toBeLessThan(bounds.date.left);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBeLessThanOrEqual(width);
  });
}

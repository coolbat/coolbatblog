import { test, expect } from "@playwright/test";

test.describe("Observatory", () => {
  test("loads with canvas, HUD and seasonal caption", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("/observatory/");
    await expect(page.locator(".sky-canvas canvas")).toBeVisible();
    await expect(page.locator(".observatory-topbar")).toBeVisible();
    await expect(page.locator(".season-caption")).toContainText("秋");
    await expect(page.locator(".season-switcher")).toBeVisible();
    await expect(page.locator(".sky-disclaimer")).toContainText(
      "Northern Hemisphere"
    );
    expect(errors).toEqual([]);
  });

  test("season switcher changes the sky and caption", async ({ page }) => {
    await page.goto("/observatory/");
    await expect(page.locator(".season-caption")).toContainText("秋");
    await page.getByRole("button", { name: /Winter/ }).click();
    await expect(page.locator(".season-caption")).toContainText("冬", {
      timeout: 4000,
    });
    await expect(page.getByRole("button", { name: /Winter/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  test("directory opens constellation card, object focus leads to telescope view, ESC walks back", async ({
    page,
  }) => {
    await page.goto("/observatory/");
    await page.locator(".sky-directory summary").click();
    await page
      .locator(".directory-panel li", { hasText: "仙女座" })
      .getByRole("button")
      .first()
      .click();
    const card = page.locator(".constellation-card");
    await expect(card).toBeVisible();
    await expect(card.locator("h2")).toContainText("仙女座");

    // 点击深空目标 M31 → 出现望远镜 CTA
    await card
      .locator(".card-section", { hasText: "深空目标" })
      .getByRole("button", { name: /M31/ })
      .click();
    const cta = page.locator(".object-cta");
    await expect(cta).toBeVisible();
    await expect(cta).toContainText("仙女座星系");

    // 对准望远镜 → Telescope View
    await cta.getByRole("button", { name: /对准望远镜/ }).click();
    const view = page.locator(".telescope-view");
    await expect(view).toBeVisible();
    await expect(view.locator("h2")).toContainText("仙女座星系");

    // 观察更多外链
    const explore = view.getByRole("link", { name: /观察更多/ });
    await expect(explore).toHaveAttribute("target", "_blank");
    await expect(explore).toHaveAttribute("rel", /noopener noreferrer/);
    await expect(explore).toHaveAttribute("href", /\/objects\/m31$/);

    // ESC 逐级退出：telescope → object → constellation → sky
    await page.keyboard.press("Escape");
    await expect(view).toHaveCount(0);
    await expect(cta).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(cta).toHaveCount(0);
    await expect(card).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(card).toHaveCount(0);
  });

  test("mobile layout has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/observatory/");
    await expect(page.locator(".sky-canvas canvas")).toBeVisible();
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
    await expect(page.locator(".season-switcher")).toBeVisible();
  });

  test("homepage portal star navigates to observatory (reduced motion)", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const portal = page.locator(".portal-star");
    await expect(portal).toBeVisible();
    await expect(portal).toHaveAttribute("aria-label", /观星台/);
    await portal.click();
    await page.waitForURL("**/observatory/**", { timeout: 8000 });
    await expect(page.locator(".observatory-root")).toBeVisible();
  });

  test("reduced motion sky still works end to end", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/observatory/");
    await expect(page.locator(".sky-canvas canvas")).toBeVisible();
    await page.getByRole("button", { name: /Winter/ }).click();
    await expect(page.locator(".season-caption")).toContainText("冬", {
      timeout: 4000,
    });
  });
});

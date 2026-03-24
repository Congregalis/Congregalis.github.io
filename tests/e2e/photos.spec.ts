import { test, expect } from "@playwright/test";

test("photos section switches from ring mode to waterfall mode", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const section = document.querySelector('[data-section="photos"]');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - window.innerHeight * 0.74;
    window.scrollTo(0, Math.max(0, targetY));
  });
  await expect(page.locator('[data-section="photos"]')).toHaveAttribute("data-photos-mode", "ring");

  await expect
    .poll(async () => {
      await page.evaluate(() => window.scrollBy(0, 140));
      return page.locator('[data-section="photos"]').getAttribute("data-photos-mode");
    })
    .toBe("waterfall");
});

test("photos section starts with all archive entries rendered", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="photos"] figure')).toHaveCount(6);
  await expect
    .poll(async () => page.locator('[data-photos-waterfall] [data-photo-card]').count())
    .toBe(3);
});

test("waterfall photos reveal metadata on hover", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-photos-waterfall]").scrollIntoViewIfNeeded();
  const firstCard = page.locator("[data-photos-waterfall] [data-photo-card]").first();
  await firstCard.hover();
  await expect(firstCard.locator("[data-photo-meta]")).toBeVisible();
});

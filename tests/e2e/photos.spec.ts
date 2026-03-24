import { test, expect } from "@playwright/test";

test("photos section switches from ring mode to waterfall mode", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-photos-ring]").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-section="photos"]')).toHaveAttribute("data-photos-mode", "ring");

  await page.evaluate(() => window.scrollBy(0, 900));
  await expect
    .poll(async () => page.locator('[data-section="photos"]').getAttribute("data-photos-mode"))
    .toBe("waterfall");
});

test("waterfall photos reveal metadata on hover", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-photos-waterfall]").scrollIntoViewIfNeeded();
  const firstCard = page.locator("[data-photo-card]").first();
  await firstCard.hover();
  await expect(firstCard.locator("[data-photo-meta]")).toBeVisible();
});

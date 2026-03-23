import { test, expect } from "@playwright/test";

test("scrolling past the hero reveals the three signal entries", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="signals"]').scrollIntoViewIfNeeded();

  await expect(page.locator("[data-signal-card]")).toHaveCount(3);
  await expect(page.locator('[data-section="signals"]')).toHaveAttribute("data-signals-ready", "true");
});

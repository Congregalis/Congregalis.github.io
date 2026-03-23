import { test, expect } from "@playwright/test";

test("home shell exposes the six primary sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('[data-section="hero"]')).toBeVisible();
  await expect(page.locator('[data-section="signals"]')).toBeVisible();
  await expect(page.locator('[data-section="projects"]')).toBeVisible();
  await expect(page.locator('[data-section="notes"]')).toBeVisible();
  await expect(page.locator('[data-section="photos"]')).toBeVisible();
  await expect(page.locator('[data-section="contact"]')).toBeVisible();
});

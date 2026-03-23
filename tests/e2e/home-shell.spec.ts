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

test("root exposes dark chrome design tokens", async ({ page }) => {
  await page.goto("/");

  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim(),
  );
  const signal = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-signal").trim(),
  );

  expect(bg).toBe("#0b1115");
  expect(signal).toBe("#8df7e3");
});

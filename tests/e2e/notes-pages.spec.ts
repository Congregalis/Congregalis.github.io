import { test, expect } from "@playwright/test";

test("generated note page loads by slug", async ({ page }) => {
  await page.goto("/notes/field-observation-01/");

  await expect(page.locator("[data-note-page-root]")).toHaveCount(1);
  await expect(page).toHaveTitle(/Field Observation 01/);
});

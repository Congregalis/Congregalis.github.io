import { test, expect } from "@playwright/test";

test("generated note page loads by slug", async ({ page }) => {
  await page.goto("/notes/field-observation-01/");

  const noteRoot = page.locator("[data-note-page-root]");

  await expect(noteRoot).toHaveCount(1);
  await expect(noteRoot).toHaveAttribute("data-note-page-shell", "ready");
  await expect(page).toHaveTitle(/Field Observation 01/);
});

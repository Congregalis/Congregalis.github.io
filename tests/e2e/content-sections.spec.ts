import { test, expect } from "@playwright/test";

test("content sections render the initial project, note, and photo items", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-project-card]")).toHaveCount(3);
  await expect(page.locator("[data-note-card]")).toHaveCount(3);
  await expect(page.locator("[data-photo-card]")).toHaveCount(6);
});

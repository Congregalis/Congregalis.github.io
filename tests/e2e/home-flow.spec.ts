import { expect, test } from "@playwright/test";

test("home exposes v2 sequencing shells", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-projects-prelude]")).toBeVisible();
  await expect(page.locator("[data-projects-outro]")).toBeVisible();
  await expect(page.locator("[data-notes-timeline]")).toBeVisible();
  await expect(page.locator("[data-photos-ring]")).toBeVisible();
  await expect(page.locator("[data-photos-waterfall]")).toBeVisible();
});

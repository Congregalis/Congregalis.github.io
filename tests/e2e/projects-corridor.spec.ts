import { test, expect, devices } from "@playwright/test";

test("desktop project corridor exposes an active project state", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="projects"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-corridor-ready", "true");
});

test.use({ ...devices["iPhone 13"] });

test("mobile falls back to stacked project cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
});

import { test, expect } from "@playwright/test";

test("generated note page loads by slug", async ({ page }) => {
  await page.goto("/notes/field-observation-01/");

  const noteRoot = page.locator("[data-note-page-root]");

  await expect(noteRoot).toHaveCount(1);
  await expect(page).toHaveTitle(/Field Observation 01/);
});

test("note page exposes previous and next navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/notes/field-observation-02/");
  await expect(page.locator("[data-note-progress]")).toBeVisible();
  await expect(page.locator("[data-note-nav] a")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /返回首页时间线/i })).toHaveAttribute("href", "/#notes");
});

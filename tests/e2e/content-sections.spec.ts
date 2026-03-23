import { test, expect } from "@playwright/test";

test("content sections render the initial project, note, and photo items", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-project-card]")).toHaveCount(3);
  await expect(page.locator("[data-note-card]")).toHaveCount(3);
  await expect(page.locator("[data-photo-card]")).toHaveCount(6);
});

test("notes, photos, and contact sections mark themselves as ready", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="notes"]').scrollIntoViewIfNeeded();

  await expect(page.locator('[data-section="notes"]')).toHaveAttribute("data-reveal-ready", "true");
  await expect(page.locator('[data-section="photos"]')).toHaveAttribute("data-reveal-ready", "true");
  await expect(page.locator('[data-section="contact"] .contact-block')).toHaveCount(1);
  await expect(page.locator('[data-section="contact"]')).toHaveAttribute("data-reveal-ready", "true");
  await expect(page.getByRole("link", { name: "hello@example.com" })).toBeVisible();
});

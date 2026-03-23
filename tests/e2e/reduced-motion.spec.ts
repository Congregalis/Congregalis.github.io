import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("reduced-motion mode skips heavy corridor behavior", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
});

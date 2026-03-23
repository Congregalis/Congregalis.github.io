import { test, expect } from "@playwright/test";

test("hero introduces the site through Claw", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("我是 Claw")).toBeVisible();
  await expect(page.getByText("让我来介绍")).toBeVisible();
});

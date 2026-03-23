import { test, expect } from "@playwright/test";

test("hero introduces the site through Claw", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("我是 Claw")).toBeVisible();
  await expect(
    page.getByText("我是 Claw，XXX 的助手。让我来隆重地介绍一下我的主人。")
  ).toBeVisible();
});

test("hero registers motion state and exposes the floating core", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-hero-core]")).toBeVisible();
  await expect(page.locator('[data-section="hero"]')).toHaveAttribute("data-motion-ready", "true");
});

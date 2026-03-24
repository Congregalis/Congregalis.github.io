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

test("hero marks the upgraded intro sequence as ready", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="hero"]')).toHaveAttribute("data-hero-sequence-ready", "true");
});

test("hero skips entry animation when prefers-reduced-motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const section = page.locator('[data-section="hero"]');
  const core = page.locator("[data-hero-core]");

  await expect(section).toHaveAttribute("data-motion-ready", "true");
  await expect(core).not.toHaveAttribute("style", /opacity|transform/);
});

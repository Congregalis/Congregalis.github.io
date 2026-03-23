import { test, expect } from "@playwright/test";

async function getBasePrefix(page) {
  return page.evaluate(() => {
    const marker = "/notes/";
    const pathname = window.location.pathname;
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) {
      return "/";
    }

    const rawPrefix = `${pathname.slice(0, markerIndex)}/`;
    return rawPrefix.replace(/\/{2,}/g, "/");
  });
}

test("generated note page loads by slug", async ({ page }) => {
  await page.goto("/notes/field-observation-01/");

  const noteRoot = page.locator("[data-note-page-root]");

  await expect(noteRoot).toHaveCount(1);
  await expect(page).toHaveTitle(/Field Observation 01/);
});

test("note page exposes previous and next navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/notes/field-observation-02/");
  const basePrefix = await getBasePrefix(page);

  await expect(page.locator("[data-note-progress]")).toBeVisible();
  await expect(page.locator("[data-note-nav] a")).toHaveCount(3);
  await expect(page.getByRole("link", { name: "上一篇" })).toHaveAttribute(
    "href",
    `${basePrefix}notes/field-observation-01/`
  );
  await expect(page.getByRole("link", { name: "下一篇" })).toHaveAttribute(
    "href",
    `${basePrefix}notes/field-observation-03/`
  );
  await expect(page.getByRole("link", { name: /返回首页时间线/i })).toHaveAttribute(
    "href",
    `${basePrefix}#notes`
  );
});

test("first note uses span placeholder for previous navigation", async ({ page }) => {
  await page.goto("/notes/field-observation-01/");
  await expect(page.locator("[data-note-nav] span")).toHaveCount(1);
  await expect(page.locator("[data-note-nav] span")).toHaveText("上一篇");
  await expect(page.getByRole("link", { name: "下一篇" })).toHaveAttribute("href", /field-observation-02/);
});

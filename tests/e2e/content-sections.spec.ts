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

test("notes timeline reveals nodes in reading mode", async ({ page }) => {
  await page.goto("/");
  const timeline = page.locator("[data-notes-timeline]");
  const firstCard = page.locator("[data-note-card]").first();

  const isBelowFold = await timeline.evaluate((node) => node.getBoundingClientRect().top > window.innerHeight);
  expect(isBelowFold).toBeTruthy();

  await expect(timeline).toHaveAttribute("data-timeline-ready", "true");
  await expect.poll(async () => {
    const opacity = await firstCard.evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity));
    return Number.isNaN(opacity) ? 1 : opacity;
  }).toBeLessThan(0.2);

  await timeline.scrollIntoViewIfNeeded();
  await expect.poll(async () => {
    const opacity = await firstCard.evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity));
    return Number.isNaN(opacity) ? 0 : opacity;
  }).toBeGreaterThan(0.95);
});

test("project CTA can anchor to the contact section", async ({ page }) => {
  await page.goto("/");

  const contactTarget = page.locator("#contact");
  await expect(contactTarget).toHaveCount(1);

  await page.locator('[data-project-card] a[href="#contact"]').first().click();
  await expect(page).toHaveURL(/#contact$/);
});

test("home timeline links open the full note page", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-notes-timeline]").scrollIntoViewIfNeeded();
  const basePrefix = await page.evaluate(() => window.location.pathname);
  await expect(page.getByRole("link", { name: /进入全文/i }).first()).toHaveAttribute(
    "href",
    `${basePrefix}notes/field-observation-01/`
  );
  await page.getByRole("link", { name: /进入全文/i }).first().click();
  await expect(page).toHaveURL(new RegExp(`${basePrefix}notes/`));
});

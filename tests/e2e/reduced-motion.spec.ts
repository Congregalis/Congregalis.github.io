import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

async function expectVisibleEndState(page, selector) {
  await expect
    .poll(async () => {
      return page.$$eval(selector, (elements) => {
        if (elements.length === 0) return false;
        return elements.every((element) => {
          const style = window.getComputedStyle(element);
          return Number.parseFloat(style.opacity) >= 0.99 && style.visibility !== "hidden";
        });
      });
    })
    .toBe(true);
}

test("reduced-motion mode fans out to all motion modules", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator("body")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
  await expect(page.locator('[data-section="photos"]')).toHaveAttribute("data-photos-mode", "waterfall");

  await expectVisibleEndState(page, "[data-signal-card]");
  await expectVisibleEndState(page, '[data-section="notes"] [data-note-card]');
  await expectVisibleEndState(page, '[data-section="photos"] [data-photo-card]');
  await expectVisibleEndState(page, '[data-section="contact"] .contact-block');

  const heroSection = page.locator('[data-section="hero"]');
  const heroCore = page.locator("[data-hero-core]");
  const styleBefore = await heroCore.getAttribute("style");

  await heroSection.hover();
  const box = await heroSection.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.4);
    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.6);
  }
  await page.waitForTimeout(120);

  const styleAfter = await heroCore.getAttribute("style");
  expect(styleAfter).toBe(styleBefore);
  expect(styleAfter ?? "").not.toContain("transform");
});

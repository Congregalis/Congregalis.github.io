import { test, expect } from "@playwright/test";

test("scrolling past the hero reveals the three signal entries", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const section = page.locator('[data-section="signals"]');
  const cards = page.locator("[data-signal-card]");
  const firstCard = cards.first();

  await expect(cards).toHaveCount(3);
  await expect(section).toHaveAttribute("data-signals-ready", "true");

  const getCardState = async () =>
    firstCard.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const opacity = Number.parseFloat(style.opacity);
      const transform = style.transform;

      let translateY = 0;
      if (transform && transform !== "none") {
        const matrixMatch = transform.match(/^matrix\((.+)\)$/);
        if (matrixMatch) {
          const values = matrixMatch[1].split(",").map((value) => Number.parseFloat(value.trim()));
          translateY = values[5] ?? 0;
        }
      }

      return { opacity, translateY };
    });

  await expect.poll(getCardState).toMatchObject({
    opacity: expect.any(Number),
    translateY: expect.any(Number),
  });

  const beforeScroll = await getCardState();
  expect(beforeScroll.opacity).toBeLessThan(0.2);
  expect(beforeScroll.translateY).toBeGreaterThan(10);

  await section.scrollIntoViewIfNeeded();

  await expect
    .poll(async () => {
      const afterScroll = await getCardState();
      return afterScroll.opacity > 0.95 && Math.abs(afterScroll.translateY) < 2;
    })
    .toBeTruthy();
});

test("signals handoff completes after entering the signal layer", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="signals"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-section="signals"]')).toHaveAttribute("data-signals-mode", "handoff-complete");
});

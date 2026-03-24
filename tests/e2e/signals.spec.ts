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
  const section = page.locator('[data-section="signals"]');

  await expect(section).toHaveAttribute("data-signals-mode", "idle");

  await page.evaluate(() => {
    const signalsSection = document.querySelector('[data-section="signals"]');
    if (!signalsSection) return;

    const trackedModes = [signalsSection.getAttribute("data-signals-mode")];
    const observer = new MutationObserver(() => {
      trackedModes.push(signalsSection.getAttribute("data-signals-mode"));
    });
    observer.observe(signalsSection, { attributes: true, attributeFilter: ["data-signals-mode"] });

    window.__signalsModeTracking = { trackedModes, observer };
  });

  await section.scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-signals-mode", "handoff-complete");

  const trackedModes = await page.evaluate(() => {
    const tracking = window.__signalsModeTracking;
    if (!tracking) return [];
    tracking.observer.disconnect();
    return tracking.trackedModes;
  });

  expect(trackedModes[0]).toBe("idle");
  expect(trackedModes).toContain("handoff-running");
  expect(trackedModes[trackedModes.length - 1]).toBe("handoff-complete");
});

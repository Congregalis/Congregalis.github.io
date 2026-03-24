import { test, expect } from "@playwright/test";

test("hero centers the Congregalis wordmark card", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-hero-wordmark]")).toBeVisible();
  await expect(page.locator("[data-hero-wordmark-label]")).toHaveText("Congregalis");
  await expect(page.getByText("做交互、写代码，也会把标准抬得有点高")).toBeVisible();
  await expect(page.locator("[data-hero-ripple]")).toHaveCount(3);
});

test("hero registers motion state and exposes the floating core", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-hero-core]")).toBeVisible();
  await expect(page.locator("[data-hero-wordmark-label]")).toHaveText("Congregalis");
  await expect(page.locator('[data-section="hero"]')).toHaveAttribute("data-motion-ready", "true");
});

test("hero marks the upgraded intro sequence as ready", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="hero"]')).toHaveAttribute("data-hero-sequence-ready", "true");
});

test("hero intro advances through phased sequence instead of finishing instantly", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const section = page.locator('[data-section="hero"]');
  const getPhase = () => section.getAttribute("data-hero-sequence-phase");

  await expect.poll(getPhase).toBe("background-start");
  await expect.poll(getPhase, { timeout: 8_000 }).toBe("core-unfold");
  await expect.poll(getPhase, { timeout: 8_000 }).toBe("copy-broadcast");
  await expect.poll(getPhase, { timeout: 8_000 }).toBe("signal-response");
  await expect.poll(getPhase, { timeout: 8_000 }).toBe("complete");
});

test("hero skips entry animation when prefers-reduced-motion is enabled", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const section = page.locator('[data-section="hero"]');
  const core = page.locator("[data-hero-core]");

  await expect(section).toHaveAttribute("data-motion-ready", "true");
  await expect(section).toHaveAttribute("data-hero-sequence-phase", "complete");
  await expect(core).not.toHaveAttribute("style", /opacity|transform/);
});

test("hero wordmark tilts with pointer movement once the signal phase begins", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const section = page.locator('[data-section="hero"]');
  const core = page.locator("[data-hero-core]");
  const wordmark = page.locator("[data-hero-wordmark]");

  await expect(section).toHaveAttribute("data-hero-sequence-phase", "signal-response", { timeout: 10_000 });

  const coreTransformBefore = await core.evaluate((element) => getComputedStyle(element).transform);
  const wordmarkTransformBefore = await wordmark.evaluate((element) => getComputedStyle(element).transform);
  const box = await section.boundingBox();

  if (!box) {
    throw new Error("Hero section should expose a bounding box for pointer tests.");
  }

  await page.mouse.move(box.x + box.width * 0.18, box.y + box.height * 0.32);

  await expect
    .poll(() => core.evaluate((element) => getComputedStyle(element).transform), { timeout: 2_000 })
    .not.toBe(coreTransformBefore);
  await expect
    .poll(() => wordmark.evaluate((element) => getComputedStyle(element).transform), { timeout: 2_000 })
    .not.toBe(wordmarkTransformBefore);
});

test("hero section spans the viewport width without side gutters", async ({ page }) => {
  await page.goto("/");

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector('[data-section="hero"]');
    if (!hero) {
      throw new Error("Hero section is missing.");
    }

    return {
      heroWidth: Math.round(hero.getBoundingClientRect().width),
      viewportWidth: document.documentElement.clientWidth
    };
  });

  expect(Math.abs(metrics.heroWidth - metrics.viewportWidth)).toBeLessThanOrEqual(1);
});

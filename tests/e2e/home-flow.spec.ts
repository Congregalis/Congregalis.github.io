import { expect, test } from "@playwright/test";

test("home exposes v2 sequencing shells", async ({ page }) => {
  await page.goto("/");

  const projectsSection = page.locator('[data-section="projects"]');
  const notesSection = page.locator('[data-section="notes"]');
  const photosSection = page.locator('[data-section="photos"]');

  await expect(projectsSection.locator("[data-projects-prelude]")).toHaveCount(1);
  await expect(projectsSection.locator("[data-projects-corridor-shell]")).toHaveCount(1);
  await expect(projectsSection.locator("[data-projects-outro]")).toHaveCount(1);
  await projectsSection.locator("[data-projects-prelude]").scrollIntoViewIfNeeded();
  await expect(projectsSection).toHaveAttribute("data-projects-phase", "prelude");

  await expect(notesSection.locator("[data-notes-timeline]")).toHaveCount(1);

  await expect(photosSection.locator("[data-photos-ring]")).toHaveCount(1);
  await expect(photosSection.locator("[data-photos-waterfall]")).toHaveCount(1);
  await expect(photosSection.locator("[data-photos-ring-shell]")).toHaveCount(1);
  await expect(photosSection.locator("[data-photos-waterfall-shell]")).toHaveCount(1);

  await expect(page.locator("[data-projects-prelude]")).toHaveCount(1);
  await expect(page.locator("[data-projects-corridor-shell]")).toHaveCount(1);
  await expect(page.locator("[data-projects-outro]")).toHaveCount(1);
  await expect(page.locator("[data-notes-timeline]")).toHaveCount(1);
  await expect(page.locator("[data-photos-ring]")).toHaveCount(1);
  await expect(page.locator("[data-photos-waterfall]")).toHaveCount(1);
  await expect(page.locator("[data-photos-ring-shell]")).toHaveCount(1);
  await expect(page.locator("[data-photos-waterfall-shell]")).toHaveCount(1);
});

test("home upgrades hero intro and signal handoff states", async ({ page }) => {
  await page.goto("/");

  const heroSection = page.locator('[data-section="hero"]');
  const signalsSection = page.locator('[data-section="signals"]');

  await expect(heroSection).toHaveAttribute("data-hero-sequence-ready", "true");
  await signalsSection.scrollIntoViewIfNeeded();
  await expect(signalsSection).toHaveAttribute("data-signals-mode", "handoff-complete");
});

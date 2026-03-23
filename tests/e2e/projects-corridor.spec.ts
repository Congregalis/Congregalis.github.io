import { test, expect, devices } from "@playwright/test";

async function readCorridorState(page) {
  return page.evaluate(() => {
    const corridor = document.querySelector("[data-project-corridor]");
    if (!corridor) return null;

    const cards = Array.from(corridor.querySelectorAll("[data-project-index]"));
    const topCard = cards
      .map((card) => ({
        index: card.getAttribute("data-project-index"),
        zIndex: Number.parseInt(window.getComputedStyle(card).zIndex, 10) || 0,
      }))
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    return {
      activeProject: corridor.getAttribute("data-active-project"),
      topProject: topCard?.index ?? null,
    };
  });
}

test("desktop corridor updates active project and keeps hit target aligned", async ({ page }) => {
  await page.goto("/");
  const corridor = page.locator('[data-project-corridor]');

  await page.locator('[data-section="projects"]').scrollIntoViewIfNeeded();
  await expect(corridor).toHaveAttribute("data-corridor-ready", "true");
  await expect(corridor).toHaveAttribute("data-active-project", "0");

  const startState = await readCorridorState(page);
  expect(startState?.activeProject).toBe("0");
  expect(startState?.topProject).toBe("0");

  await page.evaluate(() => window.scrollBy(0, 2200));
  await expect
    .poll(async () => corridor.getAttribute("data-active-project"), {
      message: "active project should change after corridor scroll",
    })
    .not.toBe("0");

  const movedState = await readCorridorState(page);
  expect(movedState?.activeProject).toBe(movedState?.topProject);
});

test("desktop reduced-motion falls back to stacked layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
});

test("mobile falls back to stacked project cards", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
  await context.close();
});

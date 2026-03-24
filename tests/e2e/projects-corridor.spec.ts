import { test, expect, devices } from "@playwright/test";

async function readCorridorState(page) {
  return page.evaluate(() => {
    const section = document.querySelector('[data-section="projects"]');
    const corridor = document.querySelector("[data-project-corridor]");
    if (!section || !corridor) return null;

    const cards = Array.from(corridor.querySelectorAll("[data-project-index]"));
    const topCard = cards
      .map((card) => ({
        index: card.getAttribute("data-project-index"),
        zIndex: Number.parseInt(window.getComputedStyle(card).zIndex, 10) || 0,
      }))
      .sort((a, b) => b.zIndex - a.zIndex)[0];

    return {
      phase: section.getAttribute("data-projects-phase"),
      activeProject: corridor.getAttribute("data-active-project"),
      topProject: topCard?.index ?? null,
    };
  });
}

async function scrollProjectsToProgress(page, progress) {
  await page.evaluate((nextProgress) => {
    const section = document.querySelector('[data-section="projects"]');
    if (!section) return;

    const clampedProgress = Math.max(0, Math.min(1, nextProgress));
    if (typeof window.__projectsScrollAnchor !== "number") {
      window.__projectsScrollAnchor = window.scrollY + section.getBoundingClientRect().top;
    }
    const scrollDistance = 1800;
    window.scrollTo(0, window.__projectsScrollAnchor + scrollDistance * clampedProgress);
  }, progress);
}

async function readActiveVisualContrast(page) {
  return page.evaluate(() => {
    const corridor = document.querySelector("[data-project-corridor]");
    if (!corridor) return null;

    const cards = Array.from(corridor.querySelectorAll("[data-project-index]"));
    const activeCard = cards.find((card) => card.getAttribute("data-card-active") === "true");
    const inactiveCard = cards.find((card) => card.getAttribute("data-card-active") !== "true");
    if (!activeCard || !inactiveCard) return null;

    const readScale = (card) => {
      const transform = window.getComputedStyle(card).transform;
      if (!transform || transform === "none") return 1;
      const matrix = new DOMMatrixReadOnly(transform);
      return Math.hypot(matrix.m11, matrix.m12, matrix.m13);
    };

    return {
      activeOpacity: Number.parseFloat(window.getComputedStyle(activeCard).opacity) || 0,
      inactiveOpacity: Number.parseFloat(window.getComputedStyle(inactiveCard).opacity) || 0,
      activeScale: readScale(activeCard),
      inactiveScale: readScale(inactiveCard),
    };
  });
}

test("desktop corridor updates active project and keeps hit target aligned", async ({ page }) => {
  await page.goto("/");
  const corridor = page.locator('[data-project-corridor]');
  const section = page.locator('[data-section="projects"]');

  await page.locator("[data-projects-prelude]").scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-projects-phase", "prelude");
  await expect(corridor).toHaveAttribute("data-corridor-ready", "true");
  await expect(corridor).toHaveAttribute("data-active-project", "0");

  const startState = await readCorridorState(page);
  expect(startState?.phase).toBe("prelude");
  expect(startState?.activeProject).toBe("0");
  expect(startState?.topProject).toBe("0");

  await scrollProjectsToProgress(page, 0.52);
  await expect
    .poll(async () => section.getAttribute("data-projects-phase"), {
      message: "projects phase should enter corridor in middle progress",
    })
    .toBe("corridor");
  await expect
    .poll(async () => corridor.getAttribute("data-active-project"), {
      message: "active project should change after corridor scroll",
    })
    .not.toBe("0");

  const movedState = await readCorridorState(page);
  expect(movedState?.phase).toBe("corridor");
  expect(movedState?.activeProject).toBe(movedState?.topProject);

  const visualContrast = await readActiveVisualContrast(page);
  expect(visualContrast).not.toBeNull();
  expect(visualContrast!.activeOpacity).toBeGreaterThan(visualContrast!.inactiveOpacity + 0.05);
  expect(visualContrast!.activeScale).toBeGreaterThan(visualContrast!.inactiveScale + 0.02);
});

test("projects section syncs phase and active card when reversing from outro", async ({ page }) => {
  await page.goto("/");
  const section = page.locator('[data-section="projects"]');
  const corridor = page.locator('[data-project-corridor]');

  await page.locator("[data-projects-prelude]").scrollIntoViewIfNeeded();
  await expect(section).toHaveAttribute("data-projects-phase", "prelude");
  const totalCards = await page.locator("[data-project-corridor] [data-project-index]").count();
  const lastIndex = String(Math.max(0, totalCards - 1));

  await scrollProjectsToProgress(page, 1);
  await expect
    .poll(async () => section.getAttribute("data-projects-phase"), {
      message: "projects phase should eventually reach outro near corridor end",
    })
    .toBe("outro");
  await expect(corridor).toHaveAttribute("data-active-project", lastIndex);

  const outroState = await readCorridorState(page);
  expect(outroState?.phase).toBe("outro");
  expect(outroState?.activeProject).toBe(outroState?.topProject);

  await page.evaluate(() => window.scrollBy(0, -1200));
  await expect
    .poll(async () => section.getAttribute("data-projects-phase"), {
      message: "projects phase should return to corridor on reverse scroll",
    })
    .toBe("corridor");

  const reverseState = await readCorridorState(page);
  expect(reverseState?.phase).toBe("corridor");
  expect(reverseState?.activeProject).toBe(reverseState?.topProject);
  expect(reverseState?.activeProject).not.toBe(lastIndex);
});

test("desktop reduced-motion falls back to stacked layout", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(page.locator('[data-section="projects"]')).toHaveAttribute("data-projects-phase", "prelude");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
});

test("mobile falls back to stacked project cards", async ({ browser }) => {
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator('[data-section="projects"]')).toHaveAttribute("data-projects-phase", "prelude");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
  await context.close();
});

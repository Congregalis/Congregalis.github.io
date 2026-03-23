import { gsap, projectCorridorBreakpoint } from "./motion-config.js";

let projectsCorridorMedia = null;

export function initProjectsCorridor({ reducedMotion = false } = {}) {
  if (projectsCorridorMedia) {
    projectsCorridorMedia.revert();
    projectsCorridorMedia = null;
  }

  const section = document.querySelector('[data-section="projects"]');
  const wrapper = document.querySelector("[data-project-corridor]");
  if (!section || !wrapper) return;

  const cards = gsap.utils.toArray("[data-project-index]", wrapper);
  if (cards.length === 0) return;

  const setActiveCard = (activeIndex) => {
    wrapper.dataset.activeProject = String(activeIndex);

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.dataset.cardActive = isActive ? "true" : "false";

      gsap.set(card, {
        zIndex: isActive ? cards.length + 1 : 1,
        pointerEvents: isActive ? "auto" : "none",
      });
    });
  };

  const resetToStacked = () => {
    wrapper.dataset.layout = "stacked";
    wrapper.dataset.corridorReady = "true";
    wrapper.dataset.activeProject = "0";

    gsap.set(cards, { clearProps: "all" });
    cards.forEach((card) => {
      card.dataset.cardActive = "false";
    });
  };

  if (reducedMotion) {
    resetToStacked();
    return;
  }

  const mm = gsap.matchMedia();
  projectsCorridorMedia = mm;

  mm.add(`(max-width: ${projectCorridorBreakpoint - 1}px)`, () => {
    resetToStacked();
  });

  mm.add(`(min-width: ${projectCorridorBreakpoint}px)`, () => {
    wrapper.dataset.layout = "desktop";
    wrapper.dataset.corridorReady = "true";

    gsap.set(cards, { autoAlpha: 0.28, scale: 0.84 });
    gsap.set(cards[0], { autoAlpha: 1, scale: 1 });
    setActiveCard(0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=1800",
        pin: true,
        scrub: 1,
      },
    });

    cards.forEach((card, index) => {
      const stepPosition = index === 0 ? 0 : ">";
      tl.call(() => setActiveCard(index), null, stepPosition);
      tl.to(cards, { autoAlpha: 0.28, scale: 0.84, duration: 0.2 }, "<");
      tl.to(card, { autoAlpha: 1, scale: 1, duration: 0.2 }, "<");
    });
  });

  return () => {
    if (projectsCorridorMedia === mm) {
      projectsCorridorMedia = null;
    }
    mm.revert();
  };
}

import { gsap, isReducedMotion, projectCorridorBreakpoint } from "./motion-config.js";

export function initProjectsCorridor() {
  const section = document.querySelector('[data-section="projects"]');
  const wrapper = document.querySelector("[data-project-corridor]");
  const cards = gsap.utils.toArray("[data-project-index]", wrapper);

  if (!section || !wrapper || cards.length === 0) return;

  const mm = gsap.matchMedia();
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
    setActiveCard(0);
    gsap.set(cards, { clearProps: "all" });
    cards.forEach((card) => {
      card.dataset.cardActive = "false";
    });
  };

  mm.add(`(max-width: ${projectCorridorBreakpoint - 1}px)`, () => {
    resetToStacked();
  });

  mm.add(`(min-width: ${projectCorridorBreakpoint}px)`, () => {
    if (isReducedMotion) {
      resetToStacked();
      return;
    }

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
    mm.revert();
  };
}

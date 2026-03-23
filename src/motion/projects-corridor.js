import { gsap, isReducedMotion, projectCorridorBreakpoint } from "./motion-config.js";

export function initProjectsCorridor() {
  const section = document.querySelector('[data-section="projects"]');
  const wrapper = document.querySelector("[data-project-corridor]");
  const cards = gsap.utils.toArray("[data-project-index]");

  if (!section || !wrapper || cards.length === 0) return;

  const mm = gsap.matchMedia();

  mm.add(`(max-width: ${projectCorridorBreakpoint - 1}px)`, () => {
    wrapper.dataset.layout = "stacked";
    wrapper.dataset.corridorReady = "true";
    wrapper.dataset.activeProject = "0";
    gsap.set(cards, { clearProps: "all" });
  });

  mm.add(`(min-width: ${projectCorridorBreakpoint}px)`, () => {
    wrapper.dataset.layout = isReducedMotion ? "stacked" : "desktop";
    wrapper.dataset.corridorReady = "true";
    wrapper.dataset.activeProject = "0";

    if (isReducedMotion) {
      gsap.set(cards, { clearProps: "all" });
      return;
    }

    gsap.set(cards, { autoAlpha: 0.28, scale: 0.84 });
    gsap.set(cards[0], { autoAlpha: 1, scale: 1 });

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
      tl.to(cards, { autoAlpha: 0.28, scale: 0.84, duration: 0.2 }, index === 0 ? 0 : ">");
      tl.to(card, { autoAlpha: 1, scale: 1, duration: 0.2 }, "<");
      tl.call(() => {
        wrapper.dataset.activeProject = String(index);
      });
    });
  });

  return () => {
    mm.revert();
  };
}

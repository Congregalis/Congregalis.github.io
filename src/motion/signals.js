import { gsap } from "./motion-config.js";

export function initSignals({ reducedMotion = false } = {}) {
  const section = document.querySelector('[data-section="signals"]');
  if (!section) return;

  const cards = gsap.utils.toArray("[data-signal-card]", section);
  if (cards.length === 0) return;

  section.dataset.signalsReady = "true";

  if (reducedMotion) {
    gsap.set(cards, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.from(cards, {
    autoAlpha: 0,
    y: 32,
    stagger: 0.12,
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
    },
  });
}

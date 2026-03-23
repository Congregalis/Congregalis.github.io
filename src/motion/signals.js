import { gsap, isReducedMotion } from "./motion-config.js";

export function initSignals() {
  const section = document.querySelector('[data-section="signals"]');
  const cards = gsap.utils.toArray("[data-signal-card]");
  if (!section || cards.length === 0) return;

  section.dataset.signalsReady = "true";

  if (isReducedMotion) {
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

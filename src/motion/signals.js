import { gsap } from "./motion-config.js";

export function initSignals({ reducedMotion = false } = {}) {
  const section = document.querySelector('[data-section="signals"]');
  if (!section) return;

  const cards = gsap.utils.toArray("[data-signal-card]", section);
  if (cards.length === 0) return;

  section.dataset.signalsReady = "true";
  section.dataset.signalsMode = "idle";

  if (reducedMotion) {
    gsap.set(cards, { autoAlpha: 1, y: 0 });
    section.dataset.signalsMode = "handoff-complete";
    return;
  }

  gsap.set(cards, { autoAlpha: 0, y: 34, x: -20, scale: 0.95, filter: "blur(4px)" });

  gsap.to(cards, {
    autoAlpha: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    stagger: 0.1,
    duration: 0.72,
    ease: "power2.out",
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      once: true,
      onEnter: () => {
        section.dataset.signalsMode = "handoff-running";
      },
      onEnterBack: () => {
        section.dataset.signalsMode = "handoff-running";
      },
    },
    onComplete: () => {
      section.dataset.signalsMode = "handoff-complete";
    },
  });
}

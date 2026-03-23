import { gsap } from "./motion-config.js";

export function initReveals() {
  const sections = ["notes", "photos", "contact"];

  sections.forEach((name) => {
    const section = document.querySelector(`[data-section="${name}"]`);
    if (!section) return;

    section.dataset.revealReady = "true";

    const items = section.querySelectorAll("article, figure, .contact-block");
    if (items.length === 0) return;

    gsap.from(items, {
      autoAlpha: 0,
      y: 28,
      immediateRender: false,
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: "top 80%"
      }
    });
  });
}

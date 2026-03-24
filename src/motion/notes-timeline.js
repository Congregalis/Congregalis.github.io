import { gsap } from "./motion-config.js";

export function initNotesTimeline({ reducedMotion = false } = {}) {
  const section = document.querySelector("[data-notes-timeline]");
  if (!section) return;
  const notesSection = section.closest('[data-section="notes"]');

  section.dataset.timelineReady = "true";
  if (notesSection) {
    notesSection.dataset.revealReady = "true";
  }
  const items = section.querySelectorAll("[data-note-card]");
  if (items.length === 0) return;

  if (reducedMotion) {
    gsap.set(items, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.from(items, {
    autoAlpha: 0,
    y: 20,
    immediateRender: false,
    stagger: 0.08,
    scrollTrigger: { trigger: section, start: "top 80%" }
  });
}

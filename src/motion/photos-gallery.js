import { gsap } from "./motion-config.js";

let photosGalleryTimeline = null;

export function initPhotosGallery({ reducedMotion = false } = {}) {
  if (photosGalleryTimeline) {
    photosGalleryTimeline.scrollTrigger?.kill();
    photosGalleryTimeline.kill();
    photosGalleryTimeline = null;
  }

  const section = document.querySelector('[data-section="photos"]');
  const ringShell = section?.querySelector("[data-photos-ring-shell]");
  const waterfallShell = section?.querySelector("[data-photos-waterfall-shell]");
  if (!section || !ringShell || !waterfallShell) return;

  const ringCards = ringShell.querySelectorAll("[data-photo-ring-card]");
  const waterfallCards = waterfallShell.querySelectorAll("[data-photo-card]");

  const setMode = (mode) => {
    section.dataset.photosMode = mode;
  };

  setMode("ring");

  if (reducedMotion) {
    setMode("waterfall");
    gsap.set(ringShell, { autoAlpha: 0, y: -24 });
    gsap.set(waterfallShell, { autoAlpha: 1, y: 0 });
    gsap.set(waterfallCards, { autoAlpha: 1, y: 0, scale: 1 });
    return;
  }

  gsap.set(ringShell, { autoAlpha: 1, y: 0, rotateZ: 0 });
  gsap.set(ringCards, {
    autoAlpha: 1,
    yPercent: 0,
    rotateY: (index) => index * 16 - 12,
    z: (index) => (index % 2 === 0 ? 42 : -42),
    transformOrigin: "50% 50% -180px",
  });

  gsap.set(waterfallShell, { autoAlpha: 0, y: 38 });
  gsap.set(waterfallCards, { autoAlpha: 0.15, y: 22, scale: 0.975 });

  photosGalleryTimeline = gsap.timeline({
    defaults: { ease: "power2.out" },
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      end: "+=700",
      scrub: 0.8,
      onUpdate: (self) => {
        setMode(self.progress >= 0.68 ? "waterfall" : "ring");
      },
      onRefresh: (self) => {
        setMode(self.progress >= 0.68 ? "waterfall" : "ring");
      },
    },
  });

  photosGalleryTimeline
    .to(
      ringShell,
      {
        autoAlpha: 0.1,
        y: -44,
        rotateZ: -1.8,
      },
      0
    )
    .to(
      ringCards,
      {
        yPercent: (index) => (index % 2 === 0 ? -10 : 8),
        rotateY: (index) => (index % 2 === 0 ? 22 : -20),
        scale: 0.94,
        stagger: 0.02,
      },
      0
    )
    .to(
      waterfallShell,
      {
        autoAlpha: 1,
        y: 0,
      },
      0.45
    )
    .to(
      waterfallCards,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        stagger: 0.06,
      },
      0.5
    );
}

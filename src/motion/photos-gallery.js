import { gsap, ScrollTrigger } from "./motion-config.js";

let photosGalleryTimeline = null;
let photosModeHandoff = null;

const PHOTOS_RING_TRIGGER_START = "top 75%";
const PHOTOS_RING_SCROLL_DISTANCE = 720;
const PHOTOS_HANDOFF_START = "top 24%";

export function initPhotosGallery({ reducedMotion = false } = {}) {
  if (photosGalleryTimeline) {
    photosGalleryTimeline.scrollTrigger?.kill();
    photosGalleryTimeline.kill();
    photosGalleryTimeline = null;
  }
  if (photosModeHandoff) {
    photosModeHandoff.kill();
    photosModeHandoff = null;
  }

  const section = document.querySelector('[data-section="photos"]');
  const ringShell = section?.querySelector("[data-photos-ring-shell]");
  const waterfallShell = section?.querySelector("[data-photos-waterfall-shell]");
  if (!section || !ringShell || !waterfallShell) return;

  const ringCards = ringShell.querySelectorAll("[data-photo-ring-card]");
  const waterfallCards = waterfallShell.querySelectorAll("[data-photo-card]");

  const setMode = (mode) => {
    if (section.dataset.photosMode === mode) return;
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
      start: PHOTOS_RING_TRIGGER_START,
      end: `+=${PHOTOS_RING_SCROLL_DISTANCE}`,
      scrub: 0.8,
    },
  });

  photosModeHandoff = ScrollTrigger.create({
    trigger: section,
    start: PHOTOS_HANDOFF_START,
    onEnter: () => setMode("waterfall"),
    onLeaveBack: () => setMode("ring"),
    onRefresh: (self) => {
      setMode(self.isActive ? "waterfall" : "ring");
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

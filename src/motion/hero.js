import { gsap, motionDefaults } from "./motion-config.js";

export function initHero({ reducedMotion = false } = {}) {
  const section = document.querySelector('[data-section="hero"]');
  const core = document.querySelector("[data-hero-core]");
  if (!section || !core) return;

  section.dataset.motionReady = "true";

  if (reducedMotion) return;

  const tl = gsap.timeline({ defaults: motionDefaults });
  tl.fromTo(core, { scale: 0.82, autoAlpha: 0, rotation: -8 }, { scale: 1, autoAlpha: 1, rotation: 0 });
  tl.from(".hero-copy > *", { y: 18, autoAlpha: 0, stagger: 0.08 }, "<0.1");

  const xTo = gsap.quickTo(core, "x", { duration: 0.4, ease: "power3.out" });
  const yTo = gsap.quickTo(core, "y", { duration: 0.4, ease: "power3.out" });
  let centerX = 0;
  let centerY = 0;

  const updatePointerCenter = () => {
    const bounds = section.getBoundingClientRect();
    centerX = bounds.left + bounds.width / 2;
    centerY = bounds.top + bounds.height / 2;
  };

  updatePointerCenter();
  window.addEventListener("resize", updatePointerCenter, { passive: true });

  section.addEventListener("pointermove", (event) => {
    xTo((event.clientX - centerX) * 0.02);
    yTo((event.clientY - centerY) * 0.02);
  });

  section.addEventListener("pointerleave", () => {
    xTo(0);
    yTo(0);
  });
}

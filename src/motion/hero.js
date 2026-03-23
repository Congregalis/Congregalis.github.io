import { gsap, motionDefaults, isReducedMotion } from "./motion-config.js";

export function initHero() {
  const section = document.querySelector('[data-section="hero"]');
  const core = document.querySelector("[data-hero-core]");
  if (!section || !core) return;

  const tl = gsap.timeline({ defaults: motionDefaults });
  tl.fromTo(core, { scale: 0.82, autoAlpha: 0, rotation: -8 }, { scale: 1, autoAlpha: 1, rotation: 0 });
  tl.from(".hero-copy > *", { y: 18, autoAlpha: 0, stagger: 0.08 }, "<0.1");

  section.dataset.motionReady = "true";

  if (isReducedMotion) return;

  const xTo = gsap.quickTo(core, "x", { duration: 0.4, ease: "power3.out" });
  const yTo = gsap.quickTo(core, "y", { duration: 0.4, ease: "power3.out" });

  section.addEventListener("pointermove", (event) => {
    const bounds = section.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    xTo((event.clientX - centerX) * 0.02);
    yTo((event.clientY - centerY) * 0.02);
  });

  section.addEventListener("pointerleave", () => {
    xTo(0);
    yTo(0);
  });
}

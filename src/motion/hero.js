import { gsap, motionDefaults } from "./motion-config.js";

export function initHero({ reducedMotion = false } = {}) {
  const section = document.querySelector('[data-section="hero"]');
  const core = document.querySelector("[data-hero-core]");
  const stage = section?.querySelector(".hero-stage");
  const copyItems = section ? gsap.utils.toArray(".hero-copy > *", section) : [];
  if (!section || !core || !stage || copyItems.length === 0) return;

  section.dataset.motionReady = "true";
  section.dataset.heroSequenceReady = "true";

  if (stage.querySelectorAll(".hero-signal-trace").length === 0) {
    const signalFragment = document.createDocumentFragment();
    for (let i = 0; i < 3; i += 1) {
      const trace = document.createElement("span");
      trace.className = "hero-signal-trace";
      trace.setAttribute("aria-hidden", "true");
      signalFragment.append(trace);
    }
    stage.append(signalFragment);
  }
  const traces = gsap.utils.toArray(".hero-signal-trace", stage);

  if (reducedMotion) return;

  const tl = gsap.timeline({ defaults: motionDefaults });
  tl.fromTo(
    section,
    { "--hero-bg-alpha": 0, "--hero-halo-scale": 0.9 },
    { "--hero-bg-alpha": 1, "--hero-halo-scale": 1, duration: 1.15, ease: "power2.out" }
  );
  tl.fromTo(stage, { autoAlpha: 0, y: 34, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1 }, "<0.04");
  tl.fromTo(core, { scale: 0.8, autoAlpha: 0, rotation: -10 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 1.1 }, "<");
  tl.from(copyItems, { y: 22, autoAlpha: 0, stagger: 0.08, duration: 0.68 }, "<0.2");
  tl.from(traces, { autoAlpha: 0, x: -16, y: 8, stagger: 0.06, duration: 0.55 }, "<0.16");

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

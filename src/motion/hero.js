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

  if (reducedMotion) {
    section.dataset.heroSequencePhase = "complete";
    return;
  }

  const tl = gsap.timeline({ defaults: motionDefaults });
  tl.set(section, { attr: { "data-hero-sequence-phase": "background-start" } });
  tl.fromTo(
    section,
    { "--hero-bg-alpha": 0, "--hero-halo-scale": 0.9 },
    { "--hero-bg-alpha": 1, "--hero-halo-scale": 1, duration: 1.8, ease: "power2.out" }
  );

  tl.addLabel("phase-core", "+=0.22");
  tl.set(section, { attr: { "data-hero-sequence-phase": "core-unfold" } }, "phase-core");
  tl.fromTo(
    stage,
    { autoAlpha: 0, y: 40, scale: 0.92 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 2.3, ease: "power3.out" },
    "phase-core"
  );
  tl.fromTo(
    core,
    { scale: 0.78, autoAlpha: 0, rotation: -12 },
    { scale: 1, autoAlpha: 1, rotation: 0, duration: 2.4, ease: "power3.out" },
    "phase-core+=0.16"
  );

  tl.addLabel("phase-copy", "+=0.2");
  tl.set(section, { attr: { "data-hero-sequence-phase": "copy-broadcast" } }, "phase-copy");
  tl.from(
    copyItems,
    { y: 24, autoAlpha: 0, duration: 0.92, stagger: 0.22, ease: "power2.out", immediateRender: false },
    "phase-copy"
  );
  tl.to(core, { boxShadow: "var(--shadow-panel), 0 0 160px rgba(141, 247, 227, 0.32)", duration: 1.1 }, "phase-copy+=0.18");

  tl.addLabel("phase-signal", "+=1.1");
  tl.set(section, { attr: { "data-hero-sequence-phase": "signal-response" } }, "phase-signal");
  tl.from(
    traces,
    { autoAlpha: 0, x: -24, y: 12, duration: 0.95, stagger: 0.28, ease: "power2.out" },
    "phase-signal"
  );
  tl.to(
    traces,
    { autoAlpha: 0.78, x: 10, duration: 0.72, stagger: 0.18, repeat: 1, yoyo: true, ease: "sine.inOut" },
    "phase-signal+=0.58"
  );
  tl.to(core, { rotation: 0, duration: 0.86, ease: "power2.out" }, "phase-signal+=0.66");
  tl.set(section, { attr: { "data-hero-sequence-phase": "complete" } }, "+=1.15");

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

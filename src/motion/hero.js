import { gsap, motionDefaults } from "./motion-config.js";

export function initHero({ reducedMotion = false } = {}) {
  const section = document.querySelector('[data-section="hero"]');
  const core = document.querySelector("[data-hero-core]");
  const wordmark = section?.querySelector("[data-hero-wordmark]");
  const stage = section?.querySelector(".hero-stage");
  const ripples = stage ? gsap.utils.toArray("[data-hero-ripple]", stage) : [];
  const copyItems = section ? gsap.utils.toArray("[data-hero-stage-copy]", section) : [];
  if (!section || !core || !wordmark || !stage) return;

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
    if (ripples.length > 0) {
      gsap.set(ripples, { autoAlpha: 0.16, scale: 1 });
    }
    section.dataset.heroSequencePhase = "complete";
    return;
  }

  gsap.set(stage, { perspective: 1200 });
  if (ripples.length > 0) {
    gsap.set(ripples, { transformOrigin: "50% 50%", scale: 0.62, autoAlpha: 0 });
  }

  const tl = gsap.timeline({ defaults: motionDefaults });
  tl.set(section, { attr: { "data-hero-sequence-phase": "background-start" } });
  tl.fromTo(
    section,
    { "--hero-bg-alpha": 0, "--hero-halo-scale": 0.92 },
    { "--hero-bg-alpha": 1, "--hero-halo-scale": 1, duration: 1.8, ease: "power2.out" }
  );

  tl.addLabel("phase-core", "+=0.22");
  tl.set(section, { attr: { "data-hero-sequence-phase": "core-unfold" } }, "phase-core");
  tl.fromTo(
    stage,
    { autoAlpha: 0, y: 40, scale: 0.94 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 2.2, ease: "power3.out" },
    "phase-core"
  );
  tl.fromTo(
    core,
    { scale: 0.84, autoAlpha: 0, y: 28, rotationX: -12, rotationY: 10 },
    { scale: 1, autoAlpha: 1, y: 0, rotationX: 0, rotationY: 0, duration: 2.35, ease: "power3.out" },
    "phase-core+=0.16"
  );
  tl.fromTo(
    wordmark,
    { autoAlpha: 0, y: 18, x: -8, scale: 0.94 },
    { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 1.7, ease: "power3.out", immediateRender: false },
    "phase-core+=0.28"
  );

  tl.addLabel("phase-copy", "+=0.2");
  tl.set(section, { attr: { "data-hero-sequence-phase": "copy-broadcast" } }, "phase-copy");
  if (copyItems.length > 0) {
    tl.from(
      copyItems,
      { y: 18, autoAlpha: 0, duration: 0.78, stagger: 0.14, ease: "power2.out", immediateRender: false },
      "phase-copy"
    );
  }
  tl.to(core, { boxShadow: "var(--shadow-panel), 0 0 176px rgba(47, 238, 101, 0.28)", duration: 1.1 }, "phase-copy+=0.18");
  tl.to(wordmark, { scale: 1.02, duration: 0.65, repeat: 1, yoyo: true, ease: "sine.inOut" }, "phase-copy+=0.34");

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
  tl.to(core, { rotationX: 0, rotationY: 0, duration: 0.86, ease: "power2.out" }, "phase-signal+=0.66");

  let pointerReady = false;
  tl.call(() => {
    pointerReady = true;
  }, null, "phase-copy+=0.34");
  tl.set(section, { attr: { "data-hero-sequence-phase": "complete" } }, "+=0.22");

  if (ripples.length > 0) {
    const rippleTl = gsap.timeline({ repeat: -1, paused: true });
    ripples.forEach((ripple, index) => {
      const offset = index * 0.72;
      rippleTl
        .fromTo(
          ripple,
          { scale: 0.62, autoAlpha: 0 },
          { scale: 1.02, autoAlpha: 0.42, duration: 0.26, ease: "none", immediateRender: index === 0 },
          offset
        )
        .to(
          ripple,
          { scale: 1.56, autoAlpha: 0, duration: 2.5, ease: "power2.out" },
          offset + 0.08
        );
    });
    tl.call(() => rippleTl.play(0), null, "phase-core+=0.42");
  }

  const mm = gsap.matchMedia();
  mm.add("(pointer: fine)", () => {
    const outerRX = gsap.quickTo(core, "rotationX", { duration: 0.45, ease: "power3.out" });
    const outerRY = gsap.quickTo(core, "rotationY", { duration: 0.45, ease: "power3.out" });
    const innerX = gsap.quickTo(wordmark, "x", { duration: 0.45, ease: "power3.out" });
    const innerY = gsap.quickTo(wordmark, "y", { duration: 0.45, ease: "power3.out" });

    const handlePointerMove = (event) => {
      if (!pointerReady) return;

      const bounds = core.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      const progressX = gsap.utils.clamp(0, 1, (event.clientX - bounds.left) / bounds.width);
      const progressY = gsap.utils.clamp(0, 1, (event.clientY - bounds.top) / bounds.height);

      outerRX(gsap.utils.interpolate(8, -8, progressY));
      outerRY(gsap.utils.interpolate(-10, 10, progressX));
      innerX(gsap.utils.interpolate(-18, 18, progressX));
      innerY(gsap.utils.interpolate(-12, 12, progressY));
    };

    const handlePointerLeave = () => {
      if (!pointerReady) return;

      outerRX(0);
      outerRY(0);
      innerX(0);
      innerY(0);
    };

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
    };
  });
}

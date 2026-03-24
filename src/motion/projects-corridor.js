import { gsap, projectCorridorBreakpoint } from "./motion-config.js";

let projectsCorridorMedia = null;

export function initProjectsCorridor({ reducedMotion = false } = {}) {
  if (projectsCorridorMedia) {
    projectsCorridorMedia.revert();
    projectsCorridorMedia = null;
  }

  const section = document.querySelector('[data-section="projects"]');
  const wrapper = document.querySelector("[data-project-corridor]");
  if (!section || !wrapper) return;

  const cards = gsap.utils.toArray("[data-project-index]", wrapper);
  if (cards.length === 0) return;

  const setProjectsPhase = (phase) => {
    section.dataset.projectsPhase = phase;
  };

  const setActiveCard = (activeIndex) => {
    wrapper.dataset.activeProject = String(activeIndex);

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      card.dataset.cardActive = isActive ? "true" : "false";

      gsap.set(card, {
        zIndex: isActive ? cards.length + 1 : 1,
        pointerEvents: isActive ? "auto" : "none",
      });
    });
  };

  const resolvePhaseFromProgress = (progress) => {
    if (progress < 0.2) return "prelude";
    if (progress >= 0.84) return "outro";
    return "corridor";
  };

  const resolveActiveIndexFromProgress = (progress, phase) => {
    if (phase === "prelude") return 0;
    if (phase === "outro") return cards.length - 1;

    const corridorStart = 0.2;
    const corridorEnd = 0.84;
    const corridorProgress = gsap.utils.clamp(0, 1, (progress - corridorStart) / (corridorEnd - corridorStart));
    return Math.round(corridorProgress * (cards.length - 1));
  };

  let lastPhase = "";
  let lastActiveIndex = -1;
  const syncStateFromProgress = (progress) => {
    const phase = resolvePhaseFromProgress(progress);
    if (phase !== lastPhase) {
      setProjectsPhase(phase);
      lastPhase = phase;
    }

    const activeIndex = resolveActiveIndexFromProgress(progress, phase);
    if (activeIndex !== lastActiveIndex) {
      setActiveCard(activeIndex);
      lastActiveIndex = activeIndex;
    }
  };

  const resetToStacked = () => {
    setProjectsPhase("prelude");
    wrapper.dataset.layout = "stacked";
    wrapper.dataset.corridorReady = "true";
    wrapper.dataset.activeProject = "0";
    lastPhase = "prelude";
    lastActiveIndex = 0;

    gsap.set(cards, { clearProps: "all" });
    cards.forEach((card) => {
      card.dataset.cardActive = "false";
    });
  };

  if (reducedMotion) {
    resetToStacked();
    return;
  }

  const mm = gsap.matchMedia();
  projectsCorridorMedia = mm;

  mm.add(`(max-width: ${projectCorridorBreakpoint - 1}px)`, () => {
    resetToStacked();
  });

  mm.add(`(min-width: ${projectCorridorBreakpoint}px)`, () => {
    setProjectsPhase("prelude");
    wrapper.dataset.layout = "desktop";
    wrapper.dataset.corridorReady = "true";

    gsap.set(cards, { autoAlpha: 0.24, scale: 0.82, yPercent: 4, z: -140, rotateX: 8 });
    gsap.set(cards[0], { autoAlpha: 1, scale: 1.03, yPercent: 0, z: 0, rotateX: 0 });
    syncStateFromProgress(0);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=1800",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          syncStateFromProgress(self.progress);
        },
        onRefresh: (self) => {
          syncStateFromProgress(self.progress);
        },
      },
    });

    tl.to(cards, { autoAlpha: 0.28, scale: 0.84, yPercent: 0, z: -110, rotateX: 6, duration: 0.24 }, 0);
    tl.to(cards[0], { autoAlpha: 1, scale: 1, z: 0, rotateX: 0, duration: 0.24 }, 0);

    cards.forEach((card, index) => {
      const stepPosition = index === 0 ? 0.22 : ">";
      tl.to(cards, { autoAlpha: 0.28, scale: 0.84, z: -100, rotateX: 5, duration: 0.22 }, "<");
      tl.to(card, { autoAlpha: 1, scale: 1, z: 0, rotateX: 0, duration: 0.22 }, "<");
    });

    tl.to(cards, { autoAlpha: 0.94, scale: 0.98, yPercent: 0, z: 0, rotateX: 0, duration: 0.32, stagger: 0.03 });
  });

  return () => {
    if (projectsCorridorMedia === mm) {
      projectsCorridorMedia = null;
    }
    mm.revert();
  };
}

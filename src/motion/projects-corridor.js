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

  const applyVisualFromProgress = (progress, activeIndex, phase) => {
    const corridorStart = 0.2;
    const corridorEnd = 0.84;
    const corridorSpan = corridorEnd - corridorStart;
    const corridorProgress = gsap.utils.clamp(0, 1, (progress - corridorStart) / corridorSpan);
    const focusIndex = corridorProgress * (cards.length - 1);

    cards.forEach((card, index) => {
      const isActive = index === activeIndex;
      let autoAlpha = 0.24;
      let scale = 0.82;
      let yPercent = 4;
      let z = -140;
      let rotateX = 8;

      if (phase === "prelude") {
        if (index === 0) {
          autoAlpha = 1;
          scale = 1.03;
          yPercent = 0;
          z = 0;
          rotateX = 0;
        }
      } else if (phase === "corridor") {
        const distance = Math.abs(index - focusIndex);
        const emphasis = Math.max(0, 1 - distance);
        autoAlpha = 0.28 + emphasis * 0.72;
        scale = 0.84 + emphasis * 0.16;
        yPercent = 0;
        z = -100 + emphasis * 100;
        rotateX = (1 - emphasis) * 5;
      } else {
        autoAlpha = isActive ? 0.98 : 0.9;
        scale = isActive ? 1 : 0.97;
        yPercent = 0;
        z = 0;
        rotateX = 0;
      }

      gsap.set(card, { autoAlpha, scale, yPercent, z, rotateX });
    });
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
    applyVisualFromProgress(progress, activeIndex, phase);
  };

  const resetToStacked = () => {
    setProjectsPhase("prelude");
    wrapper.dataset.layout = "stacked";
    wrapper.dataset.corridorReady = "true";
    wrapper.dataset.activeProject = "0";
    lastPhase = "";
    lastActiveIndex = -1;

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

    tl.to({}, { duration: 1 });
  });

  return () => {
    if (projectsCorridorMedia === mm) {
      projectsCorridorMedia = null;
    }
    mm.revert();
  };
}

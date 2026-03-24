import "./styles/base.css";
import { renderSections } from "./render/sections.js";
import { setMotionMode } from "./motion/motion-config.js";
import { initHero } from "./motion/hero.js";
import { initSignals } from "./motion/signals.js";
import { initProjectsCorridor } from "./motion/projects-corridor.js";
import { initReveals } from "./motion/reveals.js";
import { initNotesTimeline } from "./motion/notes-timeline.js";
import { initPhotosGallery } from "./motion/photos-gallery.js";

const reducedMotion = setMotionMode();

renderSections();
initHero({ reducedMotion });
initSignals({ reducedMotion });
initProjectsCorridor({ reducedMotion });
initNotesTimeline({ reducedMotion });
initPhotosGallery({ reducedMotion });
initReveals({ reducedMotion });

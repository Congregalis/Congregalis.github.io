import "./styles/base.css";
import { renderSections } from "./render/sections.js";
import { initHero } from "./motion/hero.js";
import { initSignals } from "./motion/signals.js";
import { initProjectsCorridor } from "./motion/projects-corridor.js";

renderSections();
initHero();
initSignals();
initProjectsCorridor();

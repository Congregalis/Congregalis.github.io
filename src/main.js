import "./styles/base.css";
import { renderSections } from "./render/sections.js";

document.querySelectorAll('main > section[data-section]').forEach((section) => {
  section.classList.add("section-shell");
});

renderSections();

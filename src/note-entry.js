import "./styles/base.css";
import "./styles/note-page.css";
import { renderNotePage } from "./render/note-page.js";

function initReadingProgress() {
  const progress = document.querySelector("[data-note-progress]");
  if (!progress) return;

  const updateProgress = () => {
    const scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const maxScroll = Math.max(1, scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const value = String(Math.round(ratio * 100));
    progress.setAttribute("aria-valuenow", value);
    progress.style.setProperty("--progress", String(ratio));
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

const notePageRoot = document.querySelector("[data-note-page-root]");
const noteData = window.__NOTE__;

if (notePageRoot && noteData) {
  notePageRoot.innerHTML = renderNotePage(noteData);
  initReadingProgress();
}

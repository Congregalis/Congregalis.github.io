import "./styles/base.css";
import "./styles/note-page.css";
import { renderNotePage } from "./render/note-page.js";

const notePageRoot = document.querySelector("[data-note-page-root]");
const noteData = window.__NOTE__;

if (notePageRoot && noteData) {
  notePageRoot.innerHTML = renderNotePage(noteData);
}

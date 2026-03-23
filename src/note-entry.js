import "./styles/base.css";
import "./styles/note-page.css";
import { renderNotePage } from "./render/note-page.js";

document.querySelector("[data-note-page-root]").innerHTML = renderNotePage(window.__NOTE__);

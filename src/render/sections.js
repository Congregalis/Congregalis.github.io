import { siteContent } from "../data/site-content.js";

export function renderSections() {
  document.querySelector('[data-section="hero"]').innerHTML = `
    <div class="hero-copy">
      <p class="eyebrow">Claw Archive</p>
      <h1>${siteContent.profile.name}</h1>
      <p>${siteContent.profile.intro}</p>
    </div>
    <div class="hero-core" data-hero-core></div>
  `;

  document.querySelector('[data-section="projects"]').innerHTML = siteContent.projects
    .map(
      (project) =>
        `<article data-project-card><h2>${project.title}</h2><p>${project.summary}</p></article>`
    )
    .join("");

  document.querySelector('[data-section="notes"]').innerHTML = siteContent.notes
    .map((note) => `<article data-note-card><h3>${note.title}</h3><p>${note.excerpt}</p></article>`)
    .join("");

  document.querySelector('[data-section="photos"]').innerHTML = siteContent.photos
    .map(
      (photo) =>
        `<figure data-photo-card><div class="photo-placeholder"></div><figcaption>${photo.title}</figcaption></figure>`
    )
    .join("");

  document.querySelector('[data-section="contact"]').innerHTML = `
    <p>${siteContent.contact.prompt}</p>
    <a href="mailto:${siteContent.contact.email}">${siteContent.contact.email}</a>
  `;
}

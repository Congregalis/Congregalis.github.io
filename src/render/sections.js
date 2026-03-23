import { siteContent } from "../data/site-content.js";

export function renderSections() {
  document.querySelector('[data-section="hero"]').innerHTML = `
    <div class="hero-copy">
      <p class="eyebrow">Claw Archive</p>
      <h1>${siteContent.profile.name}</h1>
      <p>${siteContent.profile.intro}</p>
    </div>
    <div class="hero-stage" aria-hidden="true">
      <div class="hero-core" data-hero-core></div>
    </div>
  `;

  document.querySelector('[data-section="signals"]').innerHTML = `
    <div class="section-shell signals-shell">
      <article class="signal-card" data-signal-card data-signal="projects">Projects</article>
      <article class="signal-card" data-signal-card data-signal="notes">Notes</article>
      <article class="signal-card" data-signal-card data-signal="photos">Photos</article>
    </div>
  `;

  document.querySelector('[data-section="projects"]').innerHTML = `
    <div class="section-shell">
      <div class="projects-corridor" data-project-corridor data-layout="desktop">
        ${siteContent.projects
          .map(
            (project, index) => `
              <article class="project-card" data-project-card data-project-index="${index}">
                <p class="system-label">0${index + 1}</p>
                <h2>${project.title}</h2>
                <p>${project.summary}</p>
                <a href="#contact">${project.linkLabel}</a>
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;

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

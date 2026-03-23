import { siteContent } from "../data/site-content.js";

const normalizedBaseUrl = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

function withBase(pathname) {
  return `${normalizedBaseUrl}${pathname.replace(/^\/+/, "")}`;
}

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
    <div class="section-shell projects-prelude" data-projects-prelude></div>
    <div class="section-shell projects-corridor-shell" data-projects-corridor-shell>
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
    <div class="section-shell projects-outro" data-projects-outro></div>
  `;

  document.querySelector('[data-section="notes"]').innerHTML = `
    <div class="section-shell notes-timeline" id="notes" data-notes-timeline>
      ${siteContent.notes
        .map(
          (note) => `
            <article class="timeline-note" data-note-card>
              <p class="system-label">${note.date}</p>
              <h3>${note.title}</h3>
              <p>${note.excerpt}</p>
              <a href="${withBase(`notes/${note.slug}/`)}">进入全文</a>
            </article>
          `
        )
        .join("")}
    </div>
  `;

  document.querySelector('[data-section="photos"]').innerHTML = `
    <div
      class="section-shell photos-shell photos-ring-shell"
      data-photos-ring
      data-photos-ring-shell
    >
      ${siteContent.photos
        .slice(0, Math.ceil(siteContent.photos.length / 2))
        .map(
          (photo) =>
            `<figure data-photo-card><div class="photo-placeholder"></div><figcaption>${photo.title}</figcaption></figure>`
        )
        .join("")}
    </div>
    <div
      class="section-shell photos-shell photos-waterfall-shell"
      data-photos-waterfall
      data-photos-waterfall-shell
    >
      ${siteContent.photos
        .slice(Math.ceil(siteContent.photos.length / 2))
        .map(
          (photo) =>
            `<figure data-photo-card><div class="photo-placeholder"></div><figcaption>${photo.title}</figcaption></figure>`
        )
        .join("")}
    </div>
  `;

  document.querySelector('[data-section="contact"]').innerHTML = `
    <div class="section-shell contact-block">
      <p class="system-label">contact</p>
      <h2>Claw 判断你不是随便路过。</h2>
      <p>${siteContent.contact.prompt}</p>
      <a href="mailto:${siteContent.contact.email}">${siteContent.contact.email}</a>
    </div>
  `;
}

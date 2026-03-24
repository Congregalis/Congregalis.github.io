import { siteContent } from "../data/site-content.js";

const normalizedBaseUrl = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

function withBase(pathname) {
  return `${normalizedBaseUrl}${pathname.replace(/^\/+/, "")}`;
}

function renderHeroWordmarkSvg(label) {
  return `
    <svg
      class="hero-wordmark-svg"
      data-hero-wordmark
      viewBox="0 0 1320 360"
      role="img"
      aria-labelledby="hero-wordmark-title hero-wordmark-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="hero-wordmark-title">${label}</title>
      <desc id="hero-wordmark-desc">${label} custom hero wordmark.</desc>
      <defs>
        <filter id="hero-wordmark-shadow" x="-20%" y="-40%" width="160%" height="220%">
          <feDropShadow dx="0" dy="22" stdDeviation="16" flood-color="#09100d" flood-opacity="0.16" />
        </filter>
        <linearGradient id="hero-wordmark-gloss" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.58" />
          <stop offset="42%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="100%" stop-color="#9dff7d" stop-opacity="0.16" />
        </linearGradient>
        <mask id="hero-wordmark-cut-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="1320" height="360">
          <rect x="0" y="0" width="1320" height="360" fill="#ffffff" />
          <polygon points="422,118 454,118 434,182 402,182" fill="#000000" />
          <polygon points="704,100 736,100 716,168 684,168" fill="#000000" />
          <polygon points="980,92 1012,92 992,160 960,160" fill="#000000" />
          <polygon points="838,194 868,194 850,252 820,252" fill="#000000" />
        </mask>
      </defs>

      <path d="M98 106L248 84L242 100L92 122Z" fill="#09100d" fill-opacity="0.18" />
      <path d="M1072 78L1216 78L1182 100L1038 100Z" fill="#09100d" fill-opacity="0.18" />
      <path d="M98 106L248 84" fill="none" stroke="#fbfff8" stroke-opacity="0.16" stroke-linecap="round" stroke-width="2" />
      <path d="M1072 78L1216 78" fill="none" stroke="#fbfff8" stroke-opacity="0.16" stroke-linecap="round" stroke-width="2" />

      <g filter="url(#hero-wordmark-shadow)">
        <path
          d="M156 280C358 308 716 308 1164 238L1160 258C716 320 360 322 158 298Z"
          fill="#09100d"
          fill-opacity="0.18"
        />
        <path
          d="M168 282C370 300 720 300 1148 240"
          fill="none"
          stroke="#fbfff8"
          stroke-opacity="0.18"
          stroke-linecap="round"
          stroke-width="2"
        />

        <g transform="translate(28 0) skewX(-14)" mask="url(#hero-wordmark-cut-mask)">
          <text
            data-hero-wordmark-label
            x="108"
            y="216"
            fill="#09100d"
            font-family="Manrope, sans-serif"
            font-size="182"
            font-weight="800"
            letter-spacing="-12"
            lengthAdjust="spacingAndGlyphs"
            textLength="1058"
          >${label}</text>
          <text
            x="108"
            y="216"
            fill="url(#hero-wordmark-gloss)"
            font-family="Manrope, sans-serif"
            font-size="182"
            font-weight="800"
            letter-spacing="-12"
            lengthAdjust="spacingAndGlyphs"
            opacity="0.42"
            textLength="1058"
          >${label}</text>
          <text
            x="108"
            y="216"
            fill="none"
            font-family="Manrope, sans-serif"
            font-size="182"
            font-weight="800"
            letter-spacing="-12"
            lengthAdjust="spacingAndGlyphs"
            stroke="#fbfff8"
            stroke-opacity="0.22"
            stroke-width="4"
            textLength="1058"
          >${label}</text>
        </g>

        <path d="M278 144L364 128" fill="none" stroke="#09100d" stroke-opacity="0.14" stroke-linecap="round" stroke-width="8" />
        <path d="M956 232L1048 214" fill="none" stroke="#09100d" stroke-opacity="0.14" stroke-linecap="round" stroke-width="8" />
      </g>
    </svg>
  `;
}

export function renderSections() {
  document.querySelector('[data-section="hero"]').innerHTML = `
    <div class="hero-accessible-copy">
      <p class="eyebrow">Claw Archive</p>
      <h1>${siteContent.profile.name}</h1>
      <p>${siteContent.profile.intro}</p>
    </div>
    <div class="hero-stage">
      <div class="hero-ripple-field" aria-hidden="true">
        <span class="hero-ripple" data-hero-ripple></span>
        <span class="hero-ripple" data-hero-ripple></span>
        <span class="hero-ripple" data-hero-ripple></span>
      </div>
      <div class="hero-core" data-hero-core>
        <div class="hero-nameplate">
          <p class="hero-nameplate-tag" data-hero-stage-copy>Claw Archive</p>
          <div class="hero-wordmark-shell">
            <div class="hero-wordmark">
              ${renderHeroWordmarkSvg(siteContent.profile.name)}
            </div>
          </div>
          <p class="hero-nameplate-meta" data-hero-stage-copy>${siteContent.profile.role}</p>
        </div>
      </div>
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

  const photosSection = document.querySelector('[data-section="photos"]');
  photosSection.dataset.photosMode = "ring";
  photosSection.innerHTML = `
    <div
      class="section-shell photos-shell photos-ring-shell"
      data-photos-ring
      data-photos-ring-shell
    >
      ${siteContent.photos
        .slice(0, Math.ceil(siteContent.photos.length / 2))
        .map(
          (photo) =>
            `<figure data-photo-ring-card><div class="photo-placeholder"></div><figcaption>${photo.title}</figcaption></figure>`
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
            `<figure data-photo-card><div class="photo-placeholder"></div><figcaption data-photo-meta>${photo.title}</figcaption></figure>`
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

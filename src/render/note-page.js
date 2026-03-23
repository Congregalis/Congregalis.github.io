const normalizedBaseUrl = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

function withBase(pathname) {
  return `${normalizedBaseUrl}${pathname.replace(/^\/+/, "")}`;
}

function noteHref(slug) {
  return withBase(`notes/${slug}/`);
}

function homeNotesHref() {
  return `${normalizedBaseUrl}#notes`;
}

export function renderNotePage(note) {
  const previousLink = note.previous
    ? `<a href="${noteHref(note.previous)}">上一篇</a>`
    : `<span aria-hidden="true">上一篇</span>`;
  const nextLink = note.next
    ? `<a href="${noteHref(note.next)}">下一篇</a>`
    : `<span aria-hidden="true">下一篇</span>`;

  return `
    <article class="note-page" data-note-page>
      <header class="note-hero">
        <p class="system-label">${note.date}</p>
        <h1 data-note-title>${note.title}</h1>
        <p class="note-claw-intro">${note.clawIntro}</p>
        <a href="${homeNotesHref()}">返回首页</a>
      </header>
      <div class="note-progress" data-note-progress></div>
      <div class="note-body" data-note-body>
        ${note.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </div>
      <nav class="note-nav" data-note-nav>
        ${previousLink}
        <a href="${homeNotesHref()}">返回首页时间线</a>
        ${nextLink}
      </nav>
    </article>
  `;
}

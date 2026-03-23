export function renderNotePage(note) {
  const previousLink = note.previous
    ? `<a href="/notes/${note.previous}/">上一篇</a>`
    : `<span aria-hidden="true">上一篇</span>`;
  const nextLink = note.next
    ? `<a href="/notes/${note.next}/">下一篇</a>`
    : `<span aria-hidden="true">下一篇</span>`;

  return `
    <article class="note-page" data-note-page>
      <header class="note-hero">
        <p class="system-label">${note.date}</p>
        <h1 data-note-title>${note.title}</h1>
        <p class="note-claw-intro">${note.clawIntro}</p>
        <a href="/#notes">返回首页</a>
      </header>
      <div class="note-progress" data-note-progress></div>
      <div class="note-body" data-note-body>
        ${note.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </div>
      <nav class="note-nav" data-note-nav>
        ${previousLink}
        <a href="/#notes">返回首页时间线</a>
        ${nextLink}
      </nav>
    </article>
  `;
}

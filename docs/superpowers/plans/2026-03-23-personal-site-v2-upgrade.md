# Personal Site V2 Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前第一版交互式个人站升级为第二版主舞台站点，完成更强首屏、更顺滑的 Projects 章节、`Notes` 独立文章页、`Photos` 的 3D 环形开场与档案瀑布流。

**Architecture:** 继续使用 `Vite + 原生 HTML/CSS/JS + GSAP`，但将数据结构从单一首页占位对象升级为可共享给首页与文章页的内容模型。首页动效拆分为更明确的章节模块，`Notes` 通过轻量静态页面生成脚本产出 `/notes/<slug>/` 页面，首页与文章页共用同一份内容源。

**Tech Stack:** Vite, Vanilla HTML/CSS/JS, GSAP, ScrollTrigger, Playwright, GitHub Pages, `@gsap-core`, `@gsap-timeline`, `@gsap-scrolltrigger`, `@gsap-performance`, `@playwright`

---

## Scope Guard

本计划只覆盖第二版核心升级，不包括：

- `Projects` 独立详情页
- `Photos` 独立图库页
- `Notes` 归档页 / 标签页 / 年份页
- CMS / 后台
- 新框架迁移（React / Astro / Next）

如果后续要做 `Projects` 详情页或 `Photos` 独立页，另开新计划，别把这一轮继续做成无底洞。

## File Structure Map

第二版会比第一版复杂很多，如果还沿用“所有东西都往现有文件里塞”的路子，代码迟早烂。先把职责边界钉死。

### Content / Routing

- Create: `src/content/site-meta.js`
  - 首页元信息、Claw 全局语气、页面 title/description 辅助
- Create: `src/content/projects.js`
  - 3 个项目的结构化数据，供首页走廊复用
- Create: `src/content/notes.js`
  - 时间线摘要、正文、slug、上一篇/下一篇关系
- Create: `src/content/photos.js`
  - 3D 环形焦点图与瀑布流归档图的数据源
- Modify: `src/data/site-content.js`
  - 改成聚合层，从上面四个内容模块拼出首页需要的数据
- Create: `scripts/sync-note-pages.mjs`
  - 根据 `src/content/notes.js` 生成 `notes/<slug>/index.html`
- Modify: `package.json`
  - 增加 `sync:notes`，并让 `dev/build/test:e2e` 在需要时先同步文章页
- Modify: `vite.config.mjs`
  - 将根首页和生成出来的 note HTML 一起作为构建输入

### Rendering

- Modify: `src/render/sections.js`
  - 负责首页结构升级：首屏序章层、signals、projects prelude/outro、notes timeline、photos ring/waterfall
- Create: `src/render/note-page.js`
  - 负责独立文章页的结构化渲染
- Create: `src/note-entry.js`
  - 独立文章页入口脚本，Task 1 先提供最小可构建占位，Task 2/6 再补完整渲染与阅读辅助

### Motion

- Modify: `src/motion/motion-config.js`
  - 保持统一 motion mode，总线继续由 `main.js` 分发
- Modify: `src/motion/hero.js`
  - 升级为高密度首屏序章与主物件回应
- Modify: `src/motion/signals.js`
  - 升级为连续解构层，而不是简单 reveal
- Modify: `src/motion/projects-corridor.js`
  - 承担 `Prelude + Corridor + Outro` 三段式章节控制
- Create: `src/motion/notes-timeline.js`
  - 首页时间线 reveal、焦点节点处理
- Create: `src/motion/photos-gallery.js`
  - 短暂 3D 环形开场 + 档案瀑布流接管
- Modify: `src/motion/reveals.js`
  - 收敛为后半段轻 reveal 辅助层（主要面向 contact 或轻量补充）
- Modify: `src/main.js`
  - 统一接入新增模块与新的执行顺序

### Styles

- Modify: `src/styles/base.css`
  - 接入新增样式文件
- Modify: `src/styles/layout.css`
  - 首页纵深段、文章页阅读宽度、时间线与瀑布流的基础版心
- Modify: `src/styles/sections.css`
  - 首页所有新章节的样式主文件
- Create: `src/styles/note-page.css`
  - 独立文章页的正文排版、页首、页尾导航

### Tests

- Modify: `tests/e2e/hero.spec.ts`
  - 首屏高密度序章、交互回应、reduced-motion 保护
- Modify: `tests/e2e/signals.spec.ts`
  - 解构层与后续节奏衔接
- Modify: `tests/e2e/projects-corridor.spec.ts`
  - Prelude/Outro、desktop smoothness、reduced/mobile 退化
- Modify: `tests/e2e/content-sections.spec.ts`
  - 首页 Notes/Photos/Contact 新结构与锚点仍成立
- Modify: `tests/e2e/reduced-motion.spec.ts`
  - 新增 `notes/photos` 升级后的 reduced 终态保护
- Create: `tests/e2e/notes-pages.spec.ts`
  - 独立文章页生成、路由、上一篇/下一篇
- Create: `tests/e2e/home-flow.spec.ts`
  - 首页章节节奏：Hero -> Projects -> Notes -> Photos
- Create: `tests/e2e/photos.spec.ts`
  - Photos 环形开场与瀑布流模式切换

## Task 1: Restructure Content Sources And Static Note Page Generation

**Files:**
- Create: `src/content/site-meta.js`
- Create: `src/content/projects.js`
- Create: `src/content/notes.js`
- Create: `src/content/photos.js`
- Modify: `src/data/site-content.js`
- Create: `scripts/sync-note-pages.mjs`
- Create: `src/note-entry.js`
- Modify: `package.json`
- Modify: `vite.config.mjs`
- Test: `tests/e2e/notes-pages.spec.ts`

- [ ] **Step 1: Write the failing note-page route test**

```ts
import { test, expect } from "@playwright/test";

test("generated note page loads by slug", async ({ page }) => {
  await page.goto("/notes/field-observation-01/");

  await expect(page.locator("[data-note-page-root]")).toHaveCount(1);
  await expect(page).toHaveTitle(/Field Observation 01/);
});
```

- [ ] **Step 2: Run the note-page test to verify it fails**

Run:

```bash
npx playwright test tests/e2e/notes-pages.spec.ts
```

Expected:

- FAIL，因为 `/notes/<slug>/` 尚不存在

- [ ] **Step 3: Create modular content sources and note-page sync script**

`src/content/notes.js`

```js
export const notes = [
  {
    slug: "field-observation-01",
    title: "Field Observation 01",
    date: "2026-03-23",
    summary: "一段首页时间线摘要。",
    clawIntro: "Claw 已经把这篇从档案柜里抽出来了。",
    body: [
      "第一段正文，要足够长，避免文章页在测试视口里完全没有滚动空间。",
      "第二段正文，继续展开同一个观察主题。",
      "第三段正文，拉开真实阅读节奏。",
      "第四段正文，专门保证阅读辅助测试有滚动空间。"
    ],
    previous: null,
    next: "field-observation-02"
  },
  {
    slug: "field-observation-02",
    title: "Field Observation 02",
    date: "2026-03-24",
    summary: "第二段首页时间线摘要。",
    clawIntro: "Claw 把第二篇也拖出来了。",
    body: [
      "另一篇正文，也要保持足够长度。",
      "继续展开，别让文章页短到像提示条。",
      "第三段正文，用于阅读辅助测试。",
      "第四段正文，确保滚动后进度会变化。"
    ],
    previous: "field-observation-01",
    next: "field-observation-03"
  },
  {
    slug: "field-observation-03",
    title: "Field Observation 03",
    date: "2026-03-25",
    summary: "第三段首页时间线摘要。",
    clawIntro: "这是目前时间线里最新的一篇。",
    body: [
      "第三篇正文，同样保持可滚动长度。",
      "继续补足内容节奏。",
      "第三段正文。",
      "第四段正文。"
    ],
    previous: "field-observation-02",
    next: null
  }
];
```

`scripts/sync-note-pages.mjs`

```js
import { readdirSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { notes } from "../src/content/notes.js";

const notesRoot = resolve("notes");
await mkdir(notesRoot, { recursive: true });
const expected = new Set(notes.map((note) => note.slug));

for (const entry of readdirSync(notesRoot, { withFileTypes: true })) {
  if (entry.isDirectory() && !expected.has(entry.name)) {
    await rm(resolve(notesRoot, entry.name), { recursive: true, force: true });
  }
}

for (const note of notes) {
  const output = resolve("notes", note.slug, "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(
    output,
    `<!doctype html>
<html lang="zh-Hans">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${note.title} / Claw Archive</title>
    <script>window.__NOTE__ = ${JSON.stringify(note)};</script>
    <script type="module" src="/src/note-entry.js"></script>
  </head>
  <body>
    <main data-note-page-root></main>
  </body>
</html>`
  );
}
```

`src/note-entry.js`

```js
document.querySelector("[data-note-page-root]")?.setAttribute("data-note-page-shell", "ready");
```

`package.json` scripts direction:

```json
{
  "scripts": {
    "sync:notes": "node scripts/sync-note-pages.mjs",
    "dev": "npm run sync:notes && vite",
    "build": "npm run sync:notes && vite build",
    "test:e2e": "npm run sync:notes && playwright test"
  }
}
```

`vite.config.mjs` direction:

```js
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isPages = Boolean(process.env.GITHUB_ACTIONS && repo);
const base = isPages ? `/${repo}/` : "/";

const notePages = readdirSync("notes", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => resolve("notes", entry.name, "index.html"));

export default {
  base,
  build: {
    rollupOptions: {
      input: ["index.html", ...notePages]
    }
  }
};
```

- [ ] **Step 4: Re-run the note-page test and build**

Run:

```bash
npx playwright test tests/e2e/notes-pages.spec.ts
npm run build
```

Expected:

- Note route shell test passes
- Build succeeds with generated note page inputs

- [ ] **Step 5: Commit**

```bash
git add src/content/site-meta.js src/content/projects.js src/content/notes.js src/content/photos.js src/data/site-content.js scripts/sync-note-pages.mjs src/note-entry.js package.json vite.config.mjs tests/e2e/notes-pages.spec.ts notes
git commit -m "feat: add modular content sources and note page generation"
```

## Task 2: Build Note Page Renderer And Home Timeline Linkage

**Files:**
- Create: `src/render/note-page.js`
- Modify: `src/note-entry.js`
- Create: `src/styles/note-page.css`
- Modify: `src/render/sections.js`
- Modify: `src/styles/base.css`
- Modify: `tests/e2e/notes-pages.spec.ts`
- Modify: `tests/e2e/content-sections.spec.ts`

- [ ] **Step 1: Extend tests for timeline links and note-page navigation**

```ts
test("home timeline links open the full note page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /进入全文/i }).first().click();
  await expect(page).toHaveURL(/\/notes\//);
});

test("note page exposes previous and next navigation", async ({ page }) => {
  await page.goto("/notes/field-observation-02/");
  await expect(page.locator("[data-note-nav] a")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /返回首页时间线/i })).toHaveAttribute("href", "/#notes");
});
```

- [ ] **Step 2: Run the note-page and content tests to verify they fail**

Run:

```bash
npx playwright test tests/e2e/notes-pages.spec.ts tests/e2e/content-sections.spec.ts
```

Expected:

- FAIL，因为首页仍是旧的 `Notes` 列表结构，note page 也没有导航结构

- [ ] **Step 3: Implement note-page render and home timeline markup**

`src/render/note-page.js`

```js
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
        <a href="/#notes">返回首页时间线</a>
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
```

`src/note-entry.js`

```js
import "./styles/base.css";
import "./styles/note-page.css";
import { renderNotePage } from "./render/note-page.js";

document.querySelector("[data-note-page-root]").innerHTML = renderNotePage(window.__NOTE__);
```

`src/render/sections.js` notes direction:

```js
<div class="section-shell notes-timeline" id="notes" data-notes-timeline>
  ${siteContent.notes
    .map(
      (note) => `
        <article class="timeline-note" data-note-card>
          <p class="system-label">${note.date}</p>
          <h3>${note.title}</h3>
          <p>${note.summary}</p>
          <a href="/notes/${note.slug}/">进入全文</a>
        </article>
      `
    )
    .join("")}
</div>
```

- [ ] **Step 4: Re-run the targeted tests**

Run:

```bash
npx playwright test tests/e2e/notes-pages.spec.ts tests/e2e/content-sections.spec.ts
```

Expected:

- 首页时间线链接可进入 note page
- note page 正文、进度辅助和导航区域可见

- [ ] **Step 5: Commit**

```bash
git add src/render/note-page.js src/note-entry.js src/styles/note-page.css src/render/sections.js src/styles/base.css tests/e2e/notes-pages.spec.ts tests/e2e/content-sections.spec.ts notes
git commit -m "feat: add notes timeline and note detail pages"
```

## Task 3: Recompose Home DOM For V2 Sequencing

**Files:**
- Modify: `src/render/sections.js`
- Modify: `src/styles/sections.css`
- Test: `tests/e2e/home-flow.spec.ts`

- [ ] **Step 1: Write the failing home-flow structure test**

```ts
import { test, expect } from "@playwright/test";

test("home exposes v2 sequencing shells", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-projects-prelude]")).toBeVisible();
  await expect(page.locator("[data-projects-outro]")).toBeVisible();
  await expect(page.locator("[data-notes-timeline]")).toBeVisible();
  await expect(page.locator("[data-photos-ring]")).toBeVisible();
  await expect(page.locator("[data-photos-waterfall]")).toBeVisible();
});
```

- [ ] **Step 2: Run the home-flow test to verify it fails**

Run:

```bash
npx playwright test tests/e2e/home-flow.spec.ts
```

Expected:

- FAIL，因为首页还没有第二版章节壳层

- [ ] **Step 3: Rebuild homepage section shells without adding final motion yet**

`src/render/sections.js` direction:

```js
document.querySelector('[data-section="projects"]').innerHTML = `
  <div class="section-shell projects-prelude" data-projects-prelude></div>
  <div class="section-shell">
    <div class="projects-corridor" data-project-corridor data-layout="desktop">...</div>
  </div>
  <div class="section-shell projects-outro" data-projects-outro></div>
`;

document.querySelector('[data-section="photos"]').innerHTML = `
  <div class="section-shell photos-ring-shell" data-photos-ring></div>
  <div class="section-shell photos-waterfall-shell" data-photos-waterfall></div>
`;
```

`src/styles/sections.css`

```css
[data-projects-prelude],
[data-projects-outro] {
  min-height: clamp(180px, 28vh, 280px);
}

[data-photos-ring] {
  min-height: clamp(320px, 48vh, 520px);
}

[data-photos-waterfall] {
  min-height: clamp(420px, 60vh, 760px);
}
```

- [ ] **Step 4: Re-run the home-flow test**

Run:

```bash
npx playwright test tests/e2e/home-flow.spec.ts
```

Expected:

- 首页结构壳层断言通过

- [ ] **Step 5: Commit**

```bash
git add src/render/sections.js src/styles/sections.css tests/e2e/home-flow.spec.ts
git commit -m "refactor: prepare homepage shells for v2 sequencing"
```

## Task 4: Rebuild The Hero Intro And Signals Transition

**Files:**
- Modify: `src/motion/hero.js`
- Modify: `src/motion/signals.js`
- Modify: `src/styles/sections.css`
- Modify: `tests/e2e/hero.spec.ts`
- Modify: `tests/e2e/signals.spec.ts`
- Modify: `tests/e2e/home-flow.spec.ts`

- [ ] **Step 1: Extend tests for denser hero sequence and signal handoff**

```ts
test("hero marks the upgraded intro sequence as ready", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-section="hero"]')).toHaveAttribute("data-hero-sequence-ready", "true");
});

test("signals handoff completes after entering the signal layer", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="signals"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-section="signals"]')).toHaveAttribute("data-signals-mode", "handoff-complete");
});
```

- [ ] **Step 2: Run hero and signal tests to verify they fail**

Run:

```bash
npx playwright test tests/e2e/hero.spec.ts tests/e2e/signals.spec.ts tests/e2e/home-flow.spec.ts
```

Expected:

- FAIL，因为这些新状态位和更强序章尚不存在

- [ ] **Step 3: Upgrade the first 10-15 seconds of the homepage**

Implementation direction:

- `hero.js`
  - 增加 `data-hero-sequence-ready="true"`
  - 时间线分为：背景启动、主物件展开、Claw 文案播报、交互回应
- `signals.js`
  - 不只是 reveal 三张卡，而是将其标记为 `data-signals-mode="handoff-complete"`
  - 视觉上像主物件拆出的信号，而非普通卡片列表

Example skeleton:

```js
section.dataset.heroSequenceReady = "true";

const tl = gsap.timeline({ defaults: motionDefaults });
tl.from(".hero-stage", { autoAlpha: 0, scale: 0.94 })
  .from(".hero-copy > *", { autoAlpha: 0, y: 20, stagger: 0.06 }, "<0.1")
  .from(".hero-signal-trace", { autoAlpha: 0, x: -18, stagger: 0.05 }, "<0.15");
```

- [ ] **Step 4: Re-run hero/signal/home-flow tests**

Run:

```bash
npx playwright test tests/e2e/hero.spec.ts tests/e2e/signals.spec.ts tests/e2e/home-flow.spec.ts
```

Expected:

- 升级版首屏与信号交接测试通过

- [ ] **Step 5: Commit**

```bash
git add src/motion/hero.js src/motion/signals.js src/styles/sections.css tests/e2e/hero.spec.ts tests/e2e/signals.spec.ts tests/e2e/home-flow.spec.ts
git commit -m "feat: densify hero intro and signal handoff"
```

## Task 5: Smooth Projects With Prelude, Corridor, And Outro

**Files:**
- Modify: `src/motion/projects-corridor.js`
- Modify: `src/styles/sections.css`
- Modify: `tests/e2e/projects-corridor.spec.ts`
- Modify: `tests/e2e/home-flow.spec.ts`

- [ ] **Step 1: Extend tests for prelude/outro and smoother corridor flow**

```ts
test("projects section exposes prelude and outro phases", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-projects-prelude]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-section="projects"]')).toHaveAttribute("data-projects-phase", "prelude");
});
```

- [ ] **Step 2: Run corridor and flow tests to verify they fail**

Run:

```bash
npx playwright test tests/e2e/projects-corridor.spec.ts tests/e2e/home-flow.spec.ts
```

Expected:

- FAIL，因为目前还没有 `Prelude/Outro` 状态位

- [ ] **Step 3: Rebuild projects as a three-phase chapter**

Implementation direction:

- `projects-corridor.js`
  - 增加 `data-projects-phase="prelude|corridor|outro"`
  - 将 `setActiveCard()` 与 phase 切换绑定
  - Prelude 先聚焦，再进入主走廊，最后进入 Outro 压平景深

Example skeleton:

```js
section.dataset.projectsPhase = "prelude";

tl.call(() => {
  section.dataset.projectsPhase = "corridor";
}, null, 0.2);

tl.call(() => {
  section.dataset.projectsPhase = "outro";
}, null, 0.85);
```

- [ ] **Step 4: Re-run targeted tests**

Run:

```bash
npx playwright test tests/e2e/projects-corridor.spec.ts tests/e2e/home-flow.spec.ts
```

Expected:

- Prelude/Outro 状态与主走廊测试通过

- [ ] **Step 5: Commit**

```bash
git add src/motion/projects-corridor.js src/styles/sections.css tests/e2e/projects-corridor.spec.ts tests/e2e/home-flow.spec.ts
git commit -m "feat: smooth projects with prelude and outro"
```

## Task 6: Implement Notes Timeline Motion And Article Page Polish

**Files:**
- Create: `src/motion/notes-timeline.js`
- Modify: `src/main.js`
- Modify: `src/note-entry.js`
- Modify: `src/render/note-page.js`
- Modify: `src/styles/sections.css`
- Modify: `src/styles/note-page.css`
- Modify: `tests/e2e/notes-pages.spec.ts`
- Modify: `tests/e2e/content-sections.spec.ts`

- [ ] **Step 1: Add failing tests for timeline behavior and note page polish**

```ts
test("notes timeline reveals nodes in reading mode", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-notes-timeline]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-notes-timeline]")).toHaveAttribute("data-timeline-ready", "true");
});

test("note page exposes previous and next links", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/notes/field-observation-02/");
  await expect(page.locator("[data-note-progress]")).toBeVisible();
  await expect(page.locator("[data-note-nav] a")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /返回首页时间线/i })).toHaveAttribute("href", "/#notes");
});

test("note page reading helper updates while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/notes/field-observation-02/");
  const progress = page.locator("[data-note-progress]");
  const scrollable = await page.evaluate(() => document.body.scrollHeight > window.innerHeight);
  expect(scrollable).toBeTruthy();
  const before = await progress.getAttribute("aria-valuenow");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(async () => progress.getAttribute("aria-valuenow"))
    .not.toBe(before);
});
```

- [ ] **Step 2: Run the note tests to verify they fail**

Run:

```bash
npx playwright test tests/e2e/notes-pages.spec.ts tests/e2e/content-sections.spec.ts
```

Expected:

- FAIL，因为首页时间线还没有 motion state，note nav 也不完整

- [ ] **Step 3: Add notes timeline motion and note-page reading polish**

`src/motion/notes-timeline.js`

```js
import { gsap } from "./motion-config.js";

export function initNotesTimeline({ reducedMotion = false } = {}) {
  const section = document.querySelector("[data-notes-timeline]");
  if (!section) return;

  section.dataset.timelineReady = "true";
  const items = section.querySelectorAll("[data-note-card]");
  if (reducedMotion) {
    gsap.set(items, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.from(items, {
    autoAlpha: 0,
    y: 20,
    stagger: 0.08,
    scrollTrigger: { trigger: section, start: "top 80%" }
  });
}
```

Implementation note for article-page reading helper:

```js
window.addEventListener("scroll", () => {
  const ratio = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
  progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  progress.style.setProperty("--progress", String(ratio));
});
```

- [ ] **Step 4: Re-run the notes tests**

Run:

```bash
npx playwright test tests/e2e/notes-pages.spec.ts tests/e2e/content-sections.spec.ts
```

Expected:

- 首页时间线 ready 状态通过
- note page 阅读辅助、返回首页时间线、上一篇/下一篇通过

- [ ] **Step 5: Commit**

```bash
git add src/motion/notes-timeline.js src/main.js src/note-entry.js src/render/note-page.js src/styles/sections.css src/styles/note-page.css tests/e2e/notes-pages.spec.ts tests/e2e/content-sections.spec.ts notes
git commit -m "feat: add notes timeline and article page polish"
```

## Task 7: Implement Photos Ring Intro And Archive Waterfall

**Files:**
- Create: `src/motion/photos-gallery.js`
- Modify: `src/render/sections.js`
- Modify: `src/main.js`
- Modify: `src/styles/sections.css`
- Create: `tests/e2e/photos.spec.ts`
- Modify: `tests/e2e/reduced-motion.spec.ts`

- [ ] **Step 1: Write failing tests for ring intro and waterfall handoff**

```ts
import { test, expect } from "@playwright/test";

test("photos section switches from ring mode to waterfall mode", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-photos-ring]").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-section="photos"]')).toHaveAttribute("data-photos-mode", "ring");

  await page.evaluate(() => window.scrollBy(0, 900));
  await expect
    .poll(async () => page.locator('[data-section="photos"]').getAttribute("data-photos-mode"))
    .toBe("waterfall");
});

test("waterfall photos reveal metadata on hover", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-photos-waterfall]").scrollIntoViewIfNeeded();
  const firstCard = page.locator("[data-photo-card]").first();
  await firstCard.hover();
  await expect(firstCard.locator("[data-photo-meta]")).toBeVisible();
});
```

- [ ] **Step 2: Run the photos test to verify it fails**

Run:

```bash
npx playwright test tests/e2e/photos.spec.ts
```

Expected:

- FAIL，因为 photos 仍然只是普通占位瀑布流

- [ ] **Step 3: Implement the short 3D ring and archive waterfall**

Implementation direction:

- `photos-gallery.js`
  - 短时间 ring 模式
  - 然后切到 waterfall 模式
  - reduced-motion 直接进 waterfall
- 瀑布流中的每张图在 hover 时要有：
  - 轻微提亮
  - 轻微放大
  - 信息条显现

Example skeleton:

```js
section.dataset.photosMode = "ring";

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top 75%",
    end: "+=700",
    scrub: 0.8
  }
});

tl.call(() => {
  section.dataset.photosMode = "waterfall";
}, null, 0.7);
```

Markup direction:

```js
<figure data-photo-card>
  <div class="photo-placeholder"></div>
  <figcaption data-photo-meta>${photo.title}</figcaption>
</figure>
```

- [ ] **Step 4: Re-run photos and reduced-motion tests**

Run:

```bash
npx playwright test tests/e2e/photos.spec.ts tests/e2e/reduced-motion.spec.ts
```

Expected:

- ring -> waterfall handoff 通过
- reduced-motion 直接进入可见终态

- [ ] **Step 5: Commit**

```bash
git add src/motion/photos-gallery.js src/render/sections.js src/main.js src/styles/sections.css tests/e2e/photos.spec.ts tests/e2e/reduced-motion.spec.ts
git commit -m "feat: add photos ring intro and waterfall archive"
```

## Task 8: Final Responsive / Reduced Motion Alignment And Full Verification

**Files:**
- Modify: `src/motion/hero.js`
- Modify: `src/motion/signals.js`
- Modify: `src/motion/projects-corridor.js`
- Modify: `src/motion/notes-timeline.js`
- Modify: `src/motion/photos-gallery.js`
- Modify: `src/motion/reveals.js`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/sections.css`
- Modify: `tests/e2e/reduced-motion.spec.ts`
- Modify: `tests/e2e/home-flow.spec.ts`
- Modify: `tests/e2e/photos.spec.ts`

- [ ] **Step 1: Add failing reduced-motion/home-flow assertions for v2 modules**

```ts
test("reduced motion skips photos ring and keeps notes timeline readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator('[data-section="photos"]')).toHaveAttribute("data-photos-mode", "waterfall");
  await expect(page.locator("[data-notes-timeline]")).toHaveAttribute("data-timeline-ready", "true");
});
```

- [ ] **Step 2: Run the reduced-motion and flow tests to verify they fail**

Run:

```bash
npx playwright test tests/e2e/reduced-motion.spec.ts tests/e2e/home-flow.spec.ts tests/e2e/photos.spec.ts
```

Expected:

- FAIL，直到所有 v2 模块都接入新的降级路径

- [ ] **Step 3: Finish the v2 fallback mesh**

Implementation checklist:

- `hero`：reduced 下仍高密度进入但不响应 pointer follow
- `signals`：reduced 下直接进入完成态
- `projects`：仍强制 stacked
- `notes timeline`：直接可读
- `photos`：直接 waterfall
- `reveal`：contact 终态可读
- layout：移动端 notes timeline / photos waterfall 的宽度与节奏不塌

- [ ] **Step 4: Run full verification**

Run:

```bash
npx playwright test
npm run build
PLAYWRIGHT_USE_PREVIEW=1 npx playwright test tests/e2e/home-shell.spec.ts tests/e2e/notes-pages.spec.ts tests/e2e/photos.spec.ts
```

Expected:

- 全量 E2E 通过
- 构建通过
- preview 模式下首页与 note page smoke 通过

- [ ] **Step 5: Commit**

```bash
git add src/motion/hero.js src/motion/signals.js src/motion/projects-corridor.js src/motion/notes-timeline.js src/motion/photos-gallery.js src/motion/reveals.js src/styles/layout.css src/styles/sections.css tests/e2e/reduced-motion.spec.ts tests/e2e/home-flow.spec.ts tests/e2e/photos.spec.ts
git commit -m "feat: finish v2 motion fallbacks and verification"
```

## Final Verification Checklist

在任何“第二版升级完成”说法之前，必须 fresh 跑过以下命令：

- [ ] Run: `npm run test:e2e`
  - Expected: 全部通过
- [ ] Run: `npm run build`
  - Expected: 构建通过，首页与 note pages 都进入 `dist`
- [ ] Run: `PLAYWRIGHT_USE_PREVIEW=1 npx playwright test tests/e2e/home-shell.spec.ts tests/e2e/notes-pages.spec.ts tests/e2e/photos.spec.ts`
  - Expected: preview 模式通过，确认生产产物没有路径问题
- [ ] Manual: 首页前 10-15 秒体验
  - Expected: 压迫式抓人，但不会持续轰炸
- [ ] Manual: `Hero -> Projects` 与 `Projects -> Notes`
  - Expected: 明显比第一版顺
- [ ] Manual: `Photos` 环形开场
  - Expected: 像展台，不像转盘
- [ ] Manual: `Notes` 文章页
  - Expected: 可读、安静、上一页/下一页/返回首页都工作

## Execution Notes

- 第二版的关键不是“加更多模块”，而是“重新编曲首页节奏 + 打通 Notes 内容系统”
- 如果实现过程中发现 `src/render/sections.js` 或 `src/styles/sections.css` 被撑得过大，可以在不违背任务边界的前提下拆出更小的文件，但要在对应任务内完成，不要半路乱拆
- 所有首页新增高密度动效都必须服从一个原则：`高密度` 不等于 `掉帧`

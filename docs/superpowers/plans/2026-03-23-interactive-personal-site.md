# Interactive Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可部署到 GitHub Pages 的纯静态个人网站，用 GSAP 完成 `A2 / 暗铬实验室` 视觉方向、`A + B` 首页结构、`Claw` 第三人称旁白、以及项目区唯一一次纵深走廊体验。

**Architecture:** 使用 `Vite + 原生 HTML/CSS/JS + GSAP`，以语义化单页为主骨架，内容数据集中在一个模块中，动效拆分为 `hero`、`signals`、`projects-corridor`、`reveals` 四类模块。桌面端保留完整交互，移动端与 `prefers-reduced-motion` 使用 `gsap.matchMedia()` 和显式降级分支退化到轻量体验。

**Tech Stack:** Vite, Vanilla HTML/CSS/JS, GSAP, ScrollTrigger, Playwright, GitHub Actions, `@fontsource/instrument-serif`, `@fontsource/manrope`, `@fontsource/ibm-plex-mono`

---

## Scope Guard

本计划只覆盖第一版静态个人站，不包括：

- CMS 或后台
- 博客发布系统
- 服务端渲染
- 复杂 3D 场景或 WebGL
- 多页面内容管理

如果后续需要文章归档页、照片独立浏览页、项目详情页，可以在第一版上线后单独拆新计划。

## Implementation References

实现时同时参考这些技能约束：

- `@gsap-core`
- `@gsap-timeline`
- `@gsap-scrolltrigger`
- `@gsap-performance`
- `@playwright`
- `@verification-before-completion`

## Current Reality Check

当前工作目录只有设计文档，还不是 git 仓库。计划执行时，第一任务要把工程和仓库骨架一起立起来；如果执行时仓库状态已经变化，就按实际情况跳过对应初始化步骤，不要硬做重复活。

## File Structure Map

在开始任务之前，先把文件边界钉死。目标是让内容、样式、动效、部署各管各的，不要把一切都塞进一个大 `main.js` 里自取其辱。

### Root / Tooling

- Create: `package.json`
  - Vite scripts, Playwright scripts, deploy-friendly commands
- Create: `vite.config.mjs`
  - GitHub Pages `base` 路径计算
- Create: `.gitignore`
  - `node_modules`, `dist`, `playwright-report`, `.superpowers`
- Create: `playwright.config.ts`
  - 本地启动 `vite preview` 的 e2e 配置

### HTML Shell

- Create: `index.html`
  - 页面语义骨架、SEO 元信息、根 section 容器

### App Entry / Data / Motion

- Create: `src/main.js`
  - 导入样式、注册插件、初始化渲染与动效
- Create: `src/data/site-content.js`
  - `Claw` 文案、项目、随想、照片、联系信息的集中数据源
- Create: `src/render/sections.js`
  - 根据数据渲染项目卡、随想列表、照片条目、联系信息
- Create: `src/motion/motion-config.js`
  - timeline 默认值、断点、reduced-motion 判断、共享 selector
- Create: `src/motion/hero.js`
  - Hero 入场时间线与轻量鼠标跟随
- Create: `src/motion/signals.js`
  - 入口解构段的 ScrollTrigger
- Create: `src/motion/projects-corridor.js`
  - 项目走廊的桌面重交互和移动端降级
- Create: `src/motion/reveals.js`
  - Notes / Photos / Footer 的轻量 reveal

### Styles

- Create: `src/styles/tokens.css`
  - 颜色、字体、阴影、圆角、间距 token
- Create: `src/styles/base.css`
  - reset、排版、全局元素样式
- Create: `src/styles/layout.css`
  - section 布局、栅格、容器、响应式基础
- Create: `src/styles/components.css`
  - 卡片、标签、按钮、测量线、系统标记
- Create: `src/styles/sections.css`
  - hero、signals、projects、notes、photos、footer 的具体样式

### Assets / Deployment

- Create: `public/favicon.svg`
  - 简单但有主题感的 favicon
- Create: `public/og-card.svg`
  - GitHub Pages 可直接引用的社交分享占位图
- Create: `.github/workflows/deploy.yml`
  - 测试、构建、部署 GitHub Pages

### Tests

- Create: `tests/e2e/home-shell.spec.ts`
  - 页面骨架和基础 section smoke test
- Create: `tests/e2e/hero.spec.ts`
  - Hero 与 Claw 开场文案
- Create: `tests/e2e/signals.spec.ts`
  - 入口解构段与滚动后的状态变化
- Create: `tests/e2e/projects-corridor.spec.ts`
  - 桌面走廊和移动端降级
- Create: `tests/e2e/content-sections.spec.ts`
  - Notes / Photos / Contact 内容渲染
- Create: `tests/e2e/reduced-motion.spec.ts`
  - reduced-motion 分支

## Task 1: Bootstrap The Static Site Toolchain

**Files:**
- Create: `package.json`
- Create: `vite.config.mjs`
- Create: `.gitignore`
- Create: `playwright.config.ts`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/styles/base.css`
- Test: `tests/e2e/home-shell.spec.ts`

- [ ] **Step 1: Write the failing shell smoke test**

```ts
import { test, expect } from "@playwright/test";

test("home shell exposes the six primary sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('[data-section="hero"]')).toBeVisible();
  await expect(page.locator('[data-section="signals"]')).toBeVisible();
  await expect(page.locator('[data-section="projects"]')).toBeVisible();
  await expect(page.locator('[data-section="notes"]')).toBeVisible();
  await expect(page.locator('[data-section="photos"]')).toBeVisible();
  await expect(page.locator('[data-section="contact"]')).toBeVisible();
});
```

- [ ] **Step 2: Install the toolchain and run the test to verify it fails**

Run:

```bash
npm init -y
npm install gsap @fontsource/instrument-serif @fontsource/manrope @fontsource/ibm-plex-mono
npm install -D vite @playwright/test
npx playwright install chromium
npx playwright test tests/e2e/home-shell.spec.ts
```

Expected:

- `npm init -y` succeeds
- Playwright test fails because no runnable page shell exists yet

- [ ] **Step 3: Write the minimal scaffold that makes the shell test pass**

`package.json`

```json
{
  "name": "personal-site",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test:e2e": "playwright test"
  }
}
```

`vite.config.mjs`

```js
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isPages = Boolean(process.env.GITHUB_ACTIONS && repo);

export default {
  base: isPages ? `/${repo}/` : "/"
};
```

`index.html`

```html
<!doctype html>
<html lang="zh-Hans">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>XXX / Claw Archive</title>
    <script type="module" src="/src/main.js"></script>
  </head>
  <body>
    <main id="app">
      <section data-section="hero"></section>
      <section data-section="signals"></section>
      <section data-section="projects"></section>
      <section data-section="notes"></section>
      <section data-section="photos"></section>
      <section data-section="contact"></section>
    </main>
  </body>
</html>
```

`src/main.js`

```js
import "./styles/base.css";
```

`src/styles/base.css`

```css
html, body {
  margin: 0;
  min-height: 100%;
}

body {
  background: #0f1418;
  color: #f3f5f4;
  font-family: "Manrope", sans-serif;
}

section {
  min-height: 50vh;
}
```

- [ ] **Step 4: Run the shell test and build to verify the scaffold works**

Run:

```bash
npx playwright test tests/e2e/home-shell.spec.ts
npm run build
```

Expected:

- Playwright shell test passes
- Vite build outputs `dist/`

- [ ] **Step 5: Initialize git if needed and commit**

Run:

```bash
test -d .git || git init
git add package.json vite.config.mjs .gitignore playwright.config.ts index.html src/main.js src/styles/base.css tests/e2e/home-shell.spec.ts
git commit -m "chore: bootstrap static site scaffold"
```

## Task 2: Add Content Data And Semantic Section Markup

**Files:**
- Create: `src/data/site-content.js`
- Create: `src/render/sections.js`
- Modify: `index.html`
- Modify: `src/main.js`
- Test: `tests/e2e/hero.spec.ts`
- Test: `tests/e2e/content-sections.spec.ts`

- [ ] **Step 1: Write failing tests for Claw copy and content counts**

```ts
import { test, expect } from "@playwright/test";

test("hero introduces the site through Claw", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("我是 Claw")).toBeVisible();
  await expect(page.getByText("让我来介绍")).toBeVisible();
});

test("content sections render the initial project, note, and photo items", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-project-card]")).toHaveCount(3);
  await expect(page.locator("[data-note-card]")).toHaveCount(3);
  await expect(page.locator("[data-photo-card]")).toHaveCount(6);
});
```

- [ ] **Step 2: Run the new tests and verify they fail**

Run:

```bash
npx playwright test tests/e2e/hero.spec.ts tests/e2e/content-sections.spec.ts
```

Expected:

- Tests fail because content is still empty placeholder sections

- [ ] **Step 3: Add a single content source and render semantic section bodies**

`src/data/site-content.js`

```js
export const siteContent = {
  profile: {
    name: "XXX",
    role: "做交互、写代码，也会把标准抬得有点高",
    intro: "我是 Claw，XXX 的助手。让我来隆重地介绍一下我的主人。"
  },
  projects: [
    { slug: "project-01", title: "Project One", summary: "一句价值描述。", linkLabel: "查看项目" },
    { slug: "project-02", title: "Project Two", summary: "一句价值描述。", linkLabel: "查看项目" },
    { slug: "project-03", title: "Project Three", summary: "一句价值描述。", linkLabel: "查看项目" }
  ],
  notes: [
    { title: "随想一", date: "2026-03", excerpt: "短摘要占位。" },
    { title: "随想二", date: "2026-03", excerpt: "短摘要占位。" },
    { title: "随想三", date: "2026-03", excerpt: "短摘要占位。" }
  ],
  photos: Array.from({ length: 6 }, (_, index) => ({
    title: `Photo ${index + 1}`,
    alt: `Photo ${index + 1} placeholder`
  })),
  contact: {
    prompt: "如果你已经看到这里，Claw 判断你大概率不是随便路过。",
    email: "hello@example.com"
  }
};
```

`src/render/sections.js`

```js
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
    .map((project) => `<article data-project-card><h2>${project.title}</h2><p>${project.summary}</p></article>`)
    .join("");

  document.querySelector('[data-section="notes"]').innerHTML = siteContent.notes
    .map((note) => `<article data-note-card><h3>${note.title}</h3><p>${note.excerpt}</p></article>`)
    .join("");

  document.querySelector('[data-section="photos"]').innerHTML = siteContent.photos
    .map((photo) => `<figure data-photo-card><div class="photo-placeholder"></div><figcaption>${photo.title}</figcaption></figure>`)
    .join("");

  document.querySelector('[data-section="contact"]').innerHTML = `
    <p>${siteContent.contact.prompt}</p>
    <a href="mailto:${siteContent.contact.email}">${siteContent.contact.email}</a>
  `;
}
```

`src/main.js`

```js
import "./styles/base.css";
import { renderSections } from "./render/sections.js";

renderSections();
```

- [ ] **Step 4: Run the content tests to verify they pass**

Run:

```bash
npx playwright test tests/e2e/hero.spec.ts tests/e2e/content-sections.spec.ts
```

Expected:

- Claw 文案可见
- `3 / 3 / 6` 内容条目渲染正确

- [ ] **Step 5: Commit**

```bash
git add index.html src/main.js src/data/site-content.js src/render/sections.js tests/e2e/hero.spec.ts tests/e2e/content-sections.spec.ts
git commit -m "feat: render core site content sections"
```

## Task 3: Build The Visual System Tokens And Layout Foundation

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/components.css`
- Create: `src/styles/sections.css`
- Modify: `src/styles/base.css`
- Modify: `src/main.js`
- Test: `tests/e2e/home-shell.spec.ts`

- [ ] **Step 1: Extend the shell test with token and visual-foundation assertions**

```ts
test("root exposes dark chrome design tokens", async ({ page }) => {
  await page.goto("/");

  const bg = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-bg").trim()
  );
  const signal = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--color-signal").trim()
  );

  expect(bg).not.toBe("");
  expect(signal).not.toBe("");
});
```

- [ ] **Step 2: Run the shell test and verify the new token assertion fails**

Run:

```bash
npx playwright test tests/e2e/home-shell.spec.ts
```

Expected:

- Existing shell assertions pass
- Token assertion fails because custom properties are not defined yet

- [ ] **Step 3: Implement the visual system foundation**

`src/styles/tokens.css`

```css
:root {
  --color-bg: #0b1115;
  --color-surface: #151d22;
  --color-surface-soft: rgba(255, 255, 255, 0.08);
  --color-text: #edf2ef;
  --color-text-muted: rgba(237, 242, 239, 0.72);
  --color-signal: #8df7e3;
  --color-metal: #9c9488;
  --shadow-panel: 0 20px 48px rgba(0, 0, 0, 0.28);
  --radius-panel: 24px;
}
```

`src/styles/base.css`

```css
@import "@fontsource/instrument-serif";
@import "@fontsource/manrope";
@import "@fontsource/ibm-plex-mono";
@import "./tokens.css";
@import "./layout.css";
@import "./components.css";
@import "./sections.css";

* { box-sizing: border-box; }

body {
  margin: 0;
  background:
    radial-gradient(circle at top right, rgba(141, 247, 227, 0.06), transparent 20%),
    linear-gradient(180deg, #0b1115 0%, #11171b 100%);
  color: var(--color-text);
  font-family: "Manrope", sans-serif;
}

h1, h2, h3 {
  font-family: "Instrument Serif", serif;
  font-weight: 400;
}
```

`src/styles/layout.css`

```css
.section-shell {
  width: min(1200px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 96px 0;
}
```

`src/styles/components.css`

```css
.eyebrow,
.system-label {
  font-family: "IBM Plex Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}
```

`src/styles/sections.css`

```css
[data-section="hero"] {
  min-height: 100vh;
}

[data-hero-core] {
  width: min(34vw, 360px);
  aspect-ratio: 1;
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.04));
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(14px);
}
```

- [ ] **Step 4: Re-run the shell test and build**

Run:

```bash
npx playwright test tests/e2e/home-shell.spec.ts
npm run build
```

Expected:

- Token assertions pass
- Build still succeeds

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/base.css src/styles/layout.css src/styles/components.css src/styles/sections.css src/main.js tests/e2e/home-shell.spec.ts
git commit -m "feat: add dark chrome design system foundation"
```

## Task 4: Implement The Hero Scene And Claw Stage Voice

**Files:**
- Create: `src/motion/motion-config.js`
- Create: `src/motion/hero.js`
- Modify: `src/render/sections.js`
- Modify: `src/main.js`
- Modify: `src/styles/sections.css`
- Test: `tests/e2e/hero.spec.ts`

- [ ] **Step 1: Extend the hero test with motion-ready assertions**

```ts
test("hero registers motion state and exposes the floating core", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-hero-core]")).toBeVisible();
  await expect(page.locator('[data-section="hero"]')).toHaveAttribute("data-motion-ready", "true");
});
```

- [ ] **Step 2: Run the hero test and verify the motion-ready assertion fails**

Run:

```bash
npx playwright test tests/e2e/hero.spec.ts
```

Expected:

- Existing Claw copy assertion passes
- New motion-ready assertion fails

- [ ] **Step 3: Implement hero timeline and light pointer-follow**

`src/motion/motion-config.js`

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const motionDefaults = { duration: 0.8, ease: "power2.out" };
export const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export { gsap, ScrollTrigger };
```

`src/motion/hero.js`

```js
import { gsap, motionDefaults, isReducedMotion } from "./motion-config.js";

export function initHero() {
  const section = document.querySelector('[data-section="hero"]');
  const core = document.querySelector("[data-hero-core]");
  if (!section || !core) return;

  const tl = gsap.timeline({ defaults: motionDefaults });
  tl.fromTo(core, { scale: 0.82, autoAlpha: 0, rotation: -8 }, { scale: 1, autoAlpha: 1, rotation: 0 });
  tl.from(".hero-copy > *", { y: 18, autoAlpha: 0, stagger: 0.08 }, "<0.1");

  section.dataset.motionReady = "true";

  if (isReducedMotion) return;

  const xTo = gsap.quickTo(core, "x", { duration: 0.4, ease: "power3.out" });
  const yTo = gsap.quickTo(core, "y", { duration: 0.4, ease: "power3.out" });

  section.addEventListener("pointermove", (event) => {
    const bounds = section.getBoundingClientRect();
    xTo((event.clientX - bounds.width / 2) * 0.02);
    yTo((event.clientY - bounds.height / 2) * 0.02);
  });
}
```

`src/main.js`

```js
import "./styles/base.css";
import { renderSections } from "./render/sections.js";
import { initHero } from "./motion/hero.js";

renderSections();
initHero();
```

- [ ] **Step 4: Run the hero test and manual visual spot-check**

Run:

```bash
npx playwright test tests/e2e/hero.spec.ts
npm run dev
```

Expected:

- Hero motion-ready test passes
- 本地浏览器中 Hero 核心体入场与 Claw 文案节奏正常

- [ ] **Step 5: Commit**

```bash
git add src/motion/motion-config.js src/motion/hero.js src/render/sections.js src/main.js src/styles/sections.css tests/e2e/hero.spec.ts
git commit -m "feat: implement hero stage and claw intro"
```

## Task 5: Implement The Signal-Layer Deconstruction Sequence

**Files:**
- Create: `src/motion/signals.js`
- Modify: `src/render/sections.js`
- Modify: `src/main.js`
- Modify: `src/styles/sections.css`
- Test: `tests/e2e/signals.spec.ts`

- [ ] **Step 1: Write the failing signal-layer test**

```ts
import { test, expect } from "@playwright/test";

test("scrolling past the hero reveals the three signal entries", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="signals"]').scrollIntoViewIfNeeded();

  await expect(page.locator("[data-signal-card]")).toHaveCount(3);
  await expect(page.locator('[data-section="signals"]')).toHaveAttribute("data-signals-ready", "true");
});
```

- [ ] **Step 2: Run the signal test and verify it fails**

Run:

```bash
npx playwright test tests/e2e/signals.spec.ts
```

Expected:

- Test fails because signal cards and state attributes do not exist yet

- [ ] **Step 3: Render signal cards and bind a short ScrollTrigger timeline**

`src/render/sections.js`

```js
document.querySelector('[data-section="signals"]').innerHTML = `
  <div class="section-shell signals-shell">
    <article class="signal-card" data-signal-card data-signal="projects">Projects</article>
    <article class="signal-card" data-signal-card data-signal="notes">Notes</article>
    <article class="signal-card" data-signal-card data-signal="photos">Photos</article>
  </div>
`;
```

`src/motion/signals.js`

```js
import { gsap, ScrollTrigger, isReducedMotion } from "./motion-config.js";

export function initSignals() {
  const section = document.querySelector('[data-section="signals"]');
  const cards = gsap.utils.toArray("[data-signal-card]");
  if (!section || cards.length === 0) return;

  section.dataset.signalsReady = "true";

  if (isReducedMotion) {
    gsap.set(cards, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.from(cards, {
    autoAlpha: 0,
    y: 32,
    stagger: 0.12,
    scrollTrigger: {
      trigger: section,
      start: "top 75%"
    }
  });
}
```

`src/main.js`

```js
import { initSignals } from "./motion/signals.js";

renderSections();
initHero();
initSignals();
```

- [ ] **Step 4: Run the signal test**

Run:

```bash
npx playwright test tests/e2e/signals.spec.ts
```

Expected:

- Three signal cards render
- Section gains `data-signals-ready="true"`

- [ ] **Step 5: Commit**

```bash
git add src/render/sections.js src/motion/signals.js src/main.js src/styles/sections.css tests/e2e/signals.spec.ts
git commit -m "feat: add hero deconstruction signal layer"
```

## Task 6: Implement The Projects Corridor With Desktop And Mobile Branches

**Files:**
- Create: `src/motion/projects-corridor.js`
- Modify: `src/render/sections.js`
- Modify: `src/motion/motion-config.js`
- Modify: `src/main.js`
- Modify: `src/styles/sections.css`
- Test: `tests/e2e/projects-corridor.spec.ts`

- [ ] **Step 1: Write failing tests for desktop corridor state and mobile fallback**

```ts
import { test, expect, devices } from "@playwright/test";

test("desktop project corridor exposes an active project state", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="projects"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-corridor-ready", "true");
});

test.use({ ...devices["iPhone 13"] });

test("mobile falls back to stacked project cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
});
```

- [ ] **Step 2: Run the corridor tests and verify they fail**

Run:

```bash
npx playwright test tests/e2e/projects-corridor.spec.ts
```

Expected:

- Desktop and mobile assertions fail because no corridor wrapper or branch logic exists

- [ ] **Step 3: Implement the corridor DOM and GSAP branch logic**

`src/render/sections.js`

```js
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
```

`src/motion/projects-corridor.js`

```js
import { gsap, ScrollTrigger, isReducedMotion } from "./motion-config.js";

export function initProjectsCorridor() {
  const section = document.querySelector('[data-section="projects"]');
  const wrapper = document.querySelector("[data-project-corridor]");
  const cards = gsap.utils.toArray("[data-project-index]");
  if (!section || !wrapper || cards.length === 0) return;

  const mm = gsap.matchMedia();

  mm.add("(max-width: 767px)", () => {
    wrapper.dataset.layout = "stacked";
    wrapper.dataset.corridorReady = "true";
    gsap.set(cards, { clearProps: "all" });
  });

  mm.add("(min-width: 768px)", () => {
    wrapper.dataset.layout = isReducedMotion ? "stacked" : "desktop";
    wrapper.dataset.corridorReady = "true";

    if (isReducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=1800",
        pin: true,
        scrub: 1
      }
    });

    cards.forEach((card, index) => {
      tl.to(cards, { autoAlpha: 0.28, scale: 0.84, duration: 0.2 }, index === 0 ? 0 : ">");
      tl.to(card, { autoAlpha: 1, scale: 1, z: 0, duration: 0.2 }, "<");
      tl.call(() => {
        wrapper.dataset.activeProject = String(index);
      });
    });
  });

  return () => mm.revert();
}
```

- [ ] **Step 4: Run corridor tests and perform a manual desktop/mobile preview**

Run:

```bash
npx playwright test tests/e2e/projects-corridor.spec.ts
npm run dev
```

Expected:

- Desktop corridor test passes
- Mobile fallback test passes
- 手动确认桌面端有一次明确的纵深走廊，移动端退化为可读卡片流

- [ ] **Step 5: Commit**

```bash
git add src/render/sections.js src/motion/projects-corridor.js src/motion/motion-config.js src/main.js src/styles/sections.css tests/e2e/projects-corridor.spec.ts
git commit -m "feat: add responsive project corridor"
```

## Task 7: Implement Notes, Photos, And Contact With Light Reveal Motion

**Files:**
- Create: `src/motion/reveals.js`
- Modify: `src/render/sections.js`
- Modify: `src/main.js`
- Modify: `src/styles/sections.css`
- Test: `tests/e2e/content-sections.spec.ts`

- [ ] **Step 1: Extend the content test with contact and reveal-ready assertions**

```ts
test("notes, photos, and contact sections mark themselves as ready", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-section="notes"]').scrollIntoViewIfNeeded();

  await expect(page.locator('[data-section="notes"]')).toHaveAttribute("data-reveal-ready", "true");
  await expect(page.locator('[data-section="photos"]')).toHaveAttribute("data-reveal-ready", "true");
  await expect(page.getByRole("link", { name: "hello@example.com" })).toBeVisible();
});
```

- [ ] **Step 2: Run the content test and verify the new assertions fail**

Run:

```bash
npx playwright test tests/e2e/content-sections.spec.ts
```

Expected:

- Count assertions pass
- Reveal-ready assertions fail

- [ ] **Step 3: Implement quiet section layouts and reveal animation**

`src/motion/reveals.js`

```js
import { gsap } from "./motion-config.js";

export function initReveals() {
  const sections = ["notes", "photos", "contact"];

  sections.forEach((name) => {
    const section = document.querySelector(`[data-section="${name}"]`);
    if (!section) return;

    section.dataset.revealReady = "true";

    const items = section.querySelectorAll("article, figure, .contact-block");
    if (items.length === 0) return;

    gsap.from(items, {
      autoAlpha: 0,
      y: 28,
      stagger: 0.08,
      scrollTrigger: {
        trigger: section,
        start: "top 80%"
      }
    });
  });
}
```

`src/render/sections.js`

```js
document.querySelector('[data-section="contact"]').innerHTML = `
  <div class="section-shell contact-block">
    <p class="system-label">contact</p>
    <h2>Claw 判断你不是随便路过。</h2>
    <p>${siteContent.contact.prompt}</p>
    <a href="mailto:${siteContent.contact.email}">${siteContent.contact.email}</a>
  </div>
`;
```

`src/main.js`

```js
import { initReveals } from "./motion/reveals.js";

renderSections();
initHero();
initSignals();
initProjectsCorridor();
initReveals();
```

- [ ] **Step 4: Run the content test**

Run:

```bash
npx playwright test tests/e2e/content-sections.spec.ts
```

Expected:

- Notes / Photos / Contact reveal-ready assertions pass

- [ ] **Step 5: Commit**

```bash
git add src/motion/reveals.js src/render/sections.js src/main.js src/styles/sections.css tests/e2e/content-sections.spec.ts
git commit -m "feat: add quiet content sections and footer reveals"
```

## Task 8: Add Reduced-Motion, Responsive Polish, And Motion Cleanup

**Files:**
- Modify: `src/motion/motion-config.js`
- Modify: `src/motion/hero.js`
- Modify: `src/motion/signals.js`
- Modify: `src/motion/projects-corridor.js`
- Modify: `src/motion/reveals.js`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/sections.css`
- Test: `tests/e2e/reduced-motion.spec.ts`
- Test: `tests/e2e/projects-corridor.spec.ts`

- [ ] **Step 1: Write the failing reduced-motion test**

```ts
import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("reduced-motion mode skips heavy corridor behavior", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveAttribute("data-motion-mode", "reduced");
  await expect(page.locator('[data-project-corridor]')).toHaveAttribute("data-layout", "stacked");
});
```

- [ ] **Step 2: Run reduced-motion and corridor tests to verify the new branch fails**

Run:

```bash
npx playwright test tests/e2e/reduced-motion.spec.ts tests/e2e/projects-corridor.spec.ts
```

Expected:

- Reduced-motion test fails because body mode and fallback branch are incomplete

- [ ] **Step 3: Harden motion config and cleanup behavior**

`src/motion/motion-config.js`

```js
export function setMotionMode() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.dataset.motionMode = reduced ? "reduced" : "full";
  return reduced;
}
```

`src/main.js`

```js
import { setMotionMode } from "./motion/motion-config.js";

const reducedMotion = setMotionMode();
renderSections();
initHero({ reducedMotion });
initSignals({ reducedMotion });
initProjectsCorridor({ reducedMotion });
initReveals({ reducedMotion });
```

Implementation notes:

- 所有动效模块改为接收 `reducedMotion` 参数，别在每个文件里各自偷偷判断
- `projects-corridor` 在 reduced-motion 下直接走 stacked 布局
- `hero` 跳过 pointer follow
- `reveal` 在 reduced-motion 下改成 `gsap.set(..., { autoAlpha: 1, y: 0 })`
- `gsap.matchMedia()` 必须在重建前 `revert()`，避免断点切换后残留旧 trigger

- [ ] **Step 4: Re-run reduced-motion, corridor, and full test suite**

Run:

```bash
npx playwright test tests/e2e/reduced-motion.spec.ts tests/e2e/projects-corridor.spec.ts
npx playwright test
npm run build
```

Expected:

- Reduced-motion 测试通过
- 现有全套 e2e 通过
- 构建成功

- [ ] **Step 5: Commit**

```bash
git add src/motion/motion-config.js src/motion/hero.js src/motion/signals.js src/motion/projects-corridor.js src/motion/reveals.js src/styles/layout.css src/styles/sections.css src/main.js tests/e2e/reduced-motion.spec.ts tests/e2e/projects-corridor.spec.ts
git commit -m "feat: add responsive motion fallbacks"
```

## Task 9: Add GitHub Pages Deployment And Final QA Guardrails

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `public/favicon.svg`
- Create: `public/og-card.svg`
- Modify: `package.json`
- Modify: `index.html`
- Test: `tests/e2e/home-shell.spec.ts`

- [ ] **Step 1: Extend the shell test with title and meta smoke checks**

```ts
test("page exposes title and description metadata", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Claw Archive/);

  const description = await page.locator('meta[name="description"]').getAttribute("content");
  expect(description).toContain("Claw");
});
```

- [ ] **Step 2: Run the shell test and verify the metadata assertion fails**

Run:

```bash
npx playwright test tests/e2e/home-shell.spec.ts
```

Expected:

- Metadata assertion fails because description and share assets are not wired yet

- [ ] **Step 3: Add metadata, assets, and deploy workflow**

`index.html`

```html
<meta
  name="description"
  content="我是 Claw，XXX 的助手。这里收纳他的项目、随想、照片，以及那些差点做过头但最终收住了的东西。"
/>
<meta property="og:title" content="XXX / Claw Archive" />
<meta property="og:description" content="暗铬实验室风格的交互式个人网站。" />
<meta property="og:image" content="/og-card.svg" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

`.github/workflows/deploy.yml`

```yml
name: Deploy Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Implementation notes:

- `favicon.svg` 和 `og-card.svg` 先用简洁矢量占位，不等设计资源
- 在 GitHub 仓库设置里启用 Pages 的 `GitHub Actions` 源
- 如果默认分支不是 `main`，同步改 workflow 触发分支

- [ ] **Step 4: Run the metadata test, full e2e suite, and production build**

Run:

```bash
npx playwright test tests/e2e/home-shell.spec.ts
npx playwright test
npm run build
```

Expected:

- Shell metadata test passes
- Full suite passes
- Build succeeds with correct asset paths

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml public/favicon.svg public/og-card.svg package.json index.html tests/e2e/home-shell.spec.ts
git commit -m "chore: add pages deployment workflow"
```

## Final Verification Checklist

执行完全部任务后，必须完成以下验证，不能靠“应该没问题”糊弄自己：

- [ ] Run: `npx playwright test`
  - Expected: 全部通过
- [ ] Run: `npm run build`
  - Expected: `dist/` 成功生成，无报错
- [ ] Run: `npm run preview`
  - Expected: 本地预览可打开，桌面端首页节奏成立
- [ ] Manual: 桌面端检查 Hero 入场、信号解构、项目走廊
  - Expected: 只有项目区是一段明显重交互
- [ ] Manual: 移动端检查项目区降级、排版和可读性
  - Expected: 无强制横向滚动，无卡顿，无信息丢失
- [ ] Manual: 浏览器开启 reduced motion
  - Expected: 无重型 pin/scrub，内容仍能顺畅读完
- [ ] Manual: 键盘 tab 浏览所有链接
  - Expected: 可见焦点、可达联系入口

## Handoff Notes

- 真实项目文案、随想摘要、照片资源可在功能完成后替换 `src/data/site-content.js` 中的占位内容
- 如果项目详情页被纳入第一版范围，必须另开计划，不要把它偷偷塞进当前单页任务里
- 如果动画复杂度开始蔓延到 Notes 或 Photos，立刻收手，回到最初设计：`80% 可读，20% 炸点`

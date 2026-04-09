import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const rootDir = process.cwd();
const contentDir = path.join(rootDir, 'content');
const writingsSourceDir = path.join(contentDir, 'writings');
const gallerySourceFile = path.join(contentDir, 'gallery.json');
const dataDir = path.join(rootDir, 'data');
const writingsOutputDir = path.join(rootDir, 'writings');

marked.setOptions({
  gfm: true,
  breaks: false
});

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ensureRequired(value, label, filePath) {
  if (!value) {
    throw new Error(`${filePath} 缺少必填字段: ${label}`);
  }
}

function formatDateDisplay(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`无效日期: ${value}`);
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function normalizeDateValue(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return '';
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\'':
        return '&#39;';
      default:
        return char;
    }
  });
}

function resolveNestedAssetPath(assetPath) {
  if (!assetPath) {
    return '';
  }

  if (/^(https?:)?\/\//.test(assetPath) || assetPath.startsWith('data:') || assetPath.startsWith('/')) {
    return assetPath;
  }

  return `../${assetPath.replace(/^\.?\//, '')}`;
}

function buildArticleHtml(post) {
  const articleCover = post.cover
    ? `
            <figure class="article-cover">
                <img src="${escapeHtml(resolveNestedAssetPath(post.cover))}" alt="${escapeHtml(post.coverAlt || post.title)}" loading="lazy">
            </figure>`
    : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(post.title)} | Congregalis</title>
    <meta name="description" content="${escapeHtml(post.excerpt)}">
    <link rel="icon" href="../favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@300;400;500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../styles.css">
</head>
<body class="article-page">
    <div id="starfield">
        <canvas id="nebula-canvas"></canvas>
    </div>
    <canvas id="flashlight-canvas"></canvas>
    <canvas id="sunlight-canvas"></canvas>

    <nav class="navbar">
        <div class="nav-container">
            <a class="logo" href="../index.html" aria-label="返回首页">
                <span class="logo-text">C.</span>
            </a>
            <ul class="nav-menu">
                <li><a href="../index.html#about" class="nav-link">About</a></li>
                <li><a href="../index.html#writing" class="nav-link">Writing</a></li>
                <li><a href="../index.html#gallery" class="nav-link">Gallery</a></li>
                <li><a href="../index.html#projects" class="nav-link">Projects</a></li>
                <li><a href="../index.html#anime" class="nav-link">Anime</a></li>
                <li><button id="theme-toggle" class="theme-toggle" aria-label="切换主题">
                    <i class="fas fa-moon"></i>
                </button></li>
            </ul>
            <button class="menu-toggle" aria-label="打开菜单">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </nav>

    <main class="article-main">
        <section class="article-shell">
            <div class="container">
                <a href="../index.html#writing" class="article-back">← 返回随笔列表</a>
                <article class="article-card">
                    <header class="article-header">
                        <p class="article-date">${escapeHtml(post.displayDate)}</p>
                        <h1 class="article-title">${escapeHtml(post.title)}</h1>
                        <p class="article-excerpt">${escapeHtml(post.excerpt)}</p>
                    </header>
${articleCover}
                    <div class="article-content">
${post.bodyHtml}
                    </div>
                </article>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <p>© 2026 Congregalis. All rights reserved.</p>
                <a href="https://deerflow.tech" target="_blank" rel="noreferrer" class="deerflow-badge">Created By Deerflow</a>
            </div>
        </div>
    </footer>

    <script src="../script.js"></script>
</body>
</html>
`;
}

async function buildWritings() {
  const fileNames = (await fs.readdir(writingsSourceDir)).filter((fileName) => fileName.endsWith('.md'));
  const posts = [];
  const usedSlugs = new Set();

  for (const fileName of fileNames) {
    const fullPath = path.join(writingsSourceDir, fileName);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(raw);
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    const excerpt = typeof data.excerpt === 'string' ? data.excerpt.trim() : '';
    const date = normalizeDateValue(data.date);
    const slug = typeof data.slug === 'string' && data.slug.trim() ? data.slug.trim() : slugify(fileName.replace(/\.md$/, ''));
    const cover = typeof data.cover === 'string' ? data.cover.trim() : '';
    const coverAlt = typeof data.coverAlt === 'string' ? data.coverAlt.trim() : '';

    ensureRequired(title, 'title', fileName);
    ensureRequired(excerpt, 'excerpt', fileName);
    ensureRequired(date, 'date', fileName);
    ensureRequired(slug, 'slug', fileName);

    if (usedSlugs.has(slug)) {
      throw new Error(`slug 重复: ${slug}`);
    }
    usedSlugs.add(slug);

    const displayDate = formatDateDisplay(date);
    const bodyHtml = marked.parse(content.trim());

    posts.push({
      title,
      excerpt,
      date,
      displayDate,
      slug,
      cover,
      coverAlt,
      bodyHtml,
      href: `./writings/${slug}.html`
    });
  }

  posts.sort((left, right) => new Date(right.date) - new Date(left.date));
  return posts;
}

async function buildGallery() {
  const raw = await fs.readFile(gallerySourceFile, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('content/gallery.json 必须是数组');
  }

  return parsed.map((item, index) => {
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const type = item.type === 'video' ? 'video' : 'image';
    const src = typeof item.src === 'string' ? item.src.trim() : '';
    const thumb = typeof item.thumb === 'string' && item.thumb.trim() ? item.thumb.trim() : src;
    const poster = typeof item.poster === 'string' && item.poster.trim() ? item.poster.trim() : thumb;
    const alt = typeof item.alt === 'string' && item.alt.trim() ? item.alt.trim() : title;

    ensureRequired(title, `gallery[${index}].title`, 'content/gallery.json');
    ensureRequired(src, `gallery[${index}].src`, 'content/gallery.json');

    return {
      title,
      type,
      src,
      thumb,
      poster,
      alt
    };
  });
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function cleanRemovedWritingPages(validSlugs) {
  const existingFiles = (await fs.readdir(writingsOutputDir)).filter((fileName) => fileName.endsWith('.html'));

  await Promise.all(
    existingFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.html$/, '');
      if (validSlugs.has(slug)) {
        return;
      }

      await fs.unlink(path.join(writingsOutputDir, fileName));
    })
  );
}

export async function buildContent() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(writingsOutputDir, { recursive: true });

  const writings = await buildWritings();
  const gallery = await buildGallery();
  const writingMeta = writings.map(({ bodyHtml, ...post }) => post);

  await writeJson(path.join(dataDir, 'writings.json'), writingMeta);
  await writeJson(path.join(dataDir, 'gallery.json'), gallery);

  const siteDataJs = `window.__SITE_DATA__ = ${JSON.stringify({ writings: writingMeta, gallery }, null, 2)};\n`;
  await fs.writeFile(path.join(dataDir, 'site-content.js'), siteDataJs, 'utf8');

  await Promise.all(
    writings.map((post) =>
      fs.writeFile(path.join(writingsOutputDir, `${post.slug}.html`), buildArticleHtml(post), 'utf8')
    )
  );
  await cleanRemovedWritingPages(new Set(writings.map((post) => post.slug)));

  console.log(`内容构建完成：${writingMeta.length} 篇随笔，${gallery.length} 个影集条目。`);
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] && path.resolve(process.argv[1]) === currentFilePath) {
  buildContent().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

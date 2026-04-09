# Congregalis Personal Site

## 说明

- 原生 `HTML + CSS + JavaScript`
- 随笔正文使用 Markdown，源文件放在 `content/writings/`
- 影集数据使用 `content/gallery.json`
- 构建脚本会生成首页数据文件和单篇文章页
- GitHub Pages 通过仓库里的 GitHub Actions 工作流自动部署

## 目录结构

```text
.
├── content/
│   ├── gallery.json            # 影集数据源
│   └── writings/               # 随笔 Markdown 源文件
├── public/
│   ├── photos/                 # 本地照片资源
│   └── videos/                 # 本地视频资源
├── scripts/
│   ├── build-content.mjs       # 生成首页数据和文章页
│   └── build-site.mjs          # 额外打包 dist/ 供部署
├── data/                       # 构建生成，默认不提交
├── writings/                   # 构建生成，默认不提交
├── index.html
├── styles.css
└── script.js
```

`data/` 和 `writings/` 是生成物，不要手改。你要是手改它，下一次构建就给你顶回去，白忙活。

## 环境要求

- Node.js 22 或更高
- npm 10 或更高

## 安装依赖

```bash
npm install
```

## 本地启动

1. 先生成站点内容：

```bash
npm run build:content
```

2. 再起一个本地静态服务器：

```bash
python3 -m http.server 4173
```

3. 浏览器打开：

```text
http://127.0.0.1:4173/index.html
```

只要你改了随笔、影集或本地资源路径，就重新跑一次 `npm run build:content`。这项目没上 dev server 热更新，别指望它自己通灵。

## 如何添加随笔

### 1. 新建 Markdown 文件

在 `content/writings/` 下新建一个 `.md` 文件，例如：

```text
content/writings/2026-03-26-new-note.md
```

### 2. 写 frontmatter 和正文

示例：

```md
---
title: 新随笔标题
date: 2026-03-26
excerpt: 这篇随笔的摘要，显示在首页卡片上。
slug: new-note
cover: public/photos/2026/note-cover.webp
coverAlt: 随笔封面图说明
---

这里开始写正文，支持 Markdown。

## 小标题

- 列表
- 引用
- 代码块
```

### frontmatter 字段说明

- `title`：必填，文章标题
- `date`：必填，建议用 `YYYY-MM-DD`
- `excerpt`：必填，首页摘要
- `slug`：必填，文章 URL 名称，对应生成的 `writings/<slug>.html`
- `cover`：可选，文章封面图路径
- `coverAlt`：可选，封面图说明

### 路径写法建议

- 本地资源路径请写成相对形式，比如 `public/photos/2026/foo.webp`
- 不要写成 `/public/photos/2026/foo.webp`

原因很简单：GitHub Pages 项目站点通常带仓库路径前缀，前导 `/` 很容易把资源路径干崩。

### 3. 生成内容

```bash
npm run build:content
```

生成后会更新：

- `data/writings.json`
- `data/site-content.js`
- `writings/<slug>.html`

## 如何添加照片

### 1. 把照片放进资源目录

建议放这里：

```text
public/photos/2026/
```

例如：

```text
public/photos/2026/taipei-night.webp
public/photos/2026/taipei-night-thumb.webp
```

建议准备两份：

- 原展示图：较大，用于 lightbox
- 缩略图：较小，用于首页瀑布流

别把相机原片直接丢仓库，Git 不是你 NAS，仓库养胖了后面拉代码能把人恶心坏。

### 2. 在 `content/gallery.json` 里新增一项

```json
{
  "title": "台北夜色",
  "type": "image",
  "src": "public/photos/2026/taipei-night.webp",
  "thumb": "public/photos/2026/taipei-night-thumb.webp",
  "alt": "台北夜色"
}
```

字段说明：

- `title`：必填，标题
- `type`：必填，照片写 `image`
- `src`：必填，大图路径
- `thumb`：可选，缩略图路径；不填时默认用 `src`
- `alt`：可选，图片替代文本

### 3. 重新生成内容

```bash
npm run build:content
```

## 如何添加视频

### 1. 把视频和封面图放到本地资源目录

建议：

```text
public/videos/2026/
public/photos/2026/
```

例如：

```text
public/videos/2026/trip.mp4
public/photos/2026/trip-poster.webp
```

### 2. 在 `content/gallery.json` 里新增一项

```json
{
  "title": "旅行短片",
  "type": "video",
  "src": "public/videos/2026/trip.mp4",
  "thumb": "public/photos/2026/trip-poster.webp",
  "poster": "public/photos/2026/trip-poster.webp",
  "alt": "旅行短片封面"
}
```

字段说明：

- `type`：视频必须写 `video`
- `src`：视频文件路径
- `thumb`：首页卡片缩略图
- `poster`：lightbox 视频封面；不填时默认使用 `thumb`

### 3. 重新生成内容

```bash
npm run build:content
```

## 生成站点内容

### 仅生成本地可预览内容

```bash
npm run build:content
```

这个命令会生成：

- `data/`
- `writings/`

用于本地预览和页面运行。

### 生成部署包

```bash
npm run build
```

这个命令会：

1. 先执行 `npm run build:content`
2. 再把站点需要的静态文件打包到 `dist/`
3. 生成 `dist/.nojekyll`

`dist/` 就是部署给 GitHub Pages 的内容。

## 部署到 GitHub Pages

仓库已经包含工作流：

- `.github/workflows/deploy.yml`

默认行为：

- 推送到 `main` 分支时自动触发
- 工作流会执行 `npm ci`
- 然后执行 `npm run build`
- 最后把 `dist/` 部署到 GitHub Pages

### 首次配置步骤

1. 把仓库推到 GitHub。
2. 打开仓库页面。
3. 进入 `Settings`。
4. 进入 `Pages`。
5. 在 `Build and deployment` 的 `Source` 里选择 `GitHub Actions`。
6. 确认默认分支是 `main`。
7. 后续每次推送到 `main`，站点都会自动重新部署。

### 本地手动检查部署包

```bash
npm run build
python3 -m http.server 4173 -d dist
```

然后访问：

```text
http://127.0.0.1:4173/index.html
```

## 推荐工作流

### 写一篇新随笔

```bash
# 1. 写文章
vim content/writings/2026-03-26-new-note.md

# 2. 生成内容
npm run build:content

# 3. 本地看效果
python3 -m http.server 4173

# 4. 提交
git add .
git commit -m "Add new writing"
git push
```

### 加照片或视频

```bash
# 1. 放资源文件
# 2. 改 content/gallery.json

# 3. 生成内容
npm run build:content

# 4. 本地检查
python3 -m http.server 4173

# 5. 提交并推送
git add .
git commit -m "Update gallery"
git push
```

## Git 忽略规则

已经在 `.gitignore` 里忽略了这些典型垃圾：

- `node_modules/`
- `dist/`
- `data/`
- `writings/`
- `output/`
- `.vite/`
- `.worktrees/`
- Python `__pycache__` 和 `.pyc`
- 日志文件

如果你以后又引入新的本地工具缓存，继续往 `.gitignore` 里加，别让仓库变成垃圾场。

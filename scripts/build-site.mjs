import fs from 'node:fs/promises';
import path from 'node:path';
import { buildContent } from './build-content.mjs';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');
const copies = [
  'index.html',
  'styles.css',
  'script.js',
  'favicon.svg',
  'data',
  'writings',
  'public'
];

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyEntry(relativePath) {
  const source = path.join(rootDir, relativePath);
  const target = path.join(distDir, relativePath);

  if (!(await pathExists(source))) {
    return;
  }

  await fs.cp(source, target, { recursive: true });
}

async function buildSite() {
  await buildContent();
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  await Promise.all(copies.map((entry) => copyEntry(entry)));
  await fs.writeFile(path.join(distDir, '.nojekyll'), '', 'utf8');

  console.log('站点打包完成：dist/');
}

buildSite().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

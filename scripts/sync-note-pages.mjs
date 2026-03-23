import { readdirSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { notes } from "../src/content/notes.js";

const notesRoot = resolve("notes");
const generatedMarker = "generated-by-sync-note-pages";

function serializeNote(note) {
  return JSON.stringify(note)
    .replace(/</g, "\\u003C")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

await mkdir(notesRoot, { recursive: true });
const expected = new Set(notes.map((note) => note.slug));

for (const entry of readdirSync(notesRoot, { withFileTypes: true })) {
  if (entry.isDirectory() && !expected.has(entry.name)) {
    const existingIndex = resolve(notesRoot, entry.name, "index.html");
    let isGeneratedByScript = false;
    try {
      const html = await readFile(existingIndex, "utf8");
      isGeneratedByScript = html.includes(generatedMarker);
    } catch {}

    if (isGeneratedByScript) {
      await rm(resolve(notesRoot, entry.name), { recursive: true, force: true });
    }
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
    <!-- ${generatedMarker} -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${note.title} / Claw Archive</title>
    <script>window.__NOTE__ = ${serializeNote(note)};</script>
    <script type="module" src="/src/note-entry.js"></script>
  </head>
  <body>
    <main data-note-page-root></main>
  </body>
</html>`
  );
}

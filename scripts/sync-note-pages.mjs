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

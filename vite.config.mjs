import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isPages = Boolean(process.env.GITHUB_ACTIONS && repo);
const isUserSite = Boolean(repo?.endsWith(".github.io"));
const base = isPages ? (isUserSite ? "/" : `/${repo}/`) : "/";

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

import { siteMeta } from "../content/site-meta.js";
import { projects } from "../content/projects.js";
import { notes } from "../content/notes.js";
import { photos } from "../content/photos.js";

export const siteContent = {
  profile: siteMeta.profile,
  projects,
  notes: notes.map((note) => ({
    slug: note.slug,
    title: note.title,
    date: note.date,
    excerpt: note.summary
  })),
  photos,
  contact: siteMeta.contact
};

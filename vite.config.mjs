const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isPages = Boolean(process.env.GITHUB_ACTIONS && repo);

export default {
  base: isPages ? `/${repo}/` : "/"
};

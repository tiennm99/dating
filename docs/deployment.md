# Deployment

## Platform

GitHub Pages — classic mode (deploy from branch), no Actions workflow.

## Production URL

Expected URL: `https://tiennm99.github.io/dating/`.

## Build

None. The site is a single `index.html` at the repo root plus `assets/`,
served as-is.

## Configuration

- Pages source: branch `main`, folder `/ (root)`.
- `.nojekyll` at the root disables Jekyll processing.
- Pushing to `main` publishes automatically; no secrets, no CI.

## Notes

- Classic Pages serves the whole branch root, so `docs/` and `plans/` markdown
  files are also reachable by URL. The repo is public, so this exposes nothing
  new.
- Static files only. No backend, no form service.

# Deployment

## Platform

GitHub Pages.

## Production URL

Expected URL: `https://tiennm99.github.io/dating/`.

## Build

None. The site is plain HTML/CSS/JS served as-is. All internal links and asset
references are relative, so no base-path configuration is needed.

## Workflow

`.github/workflows/deploy-pages.yml` runs on push to `main`: it copies the site
files (`index.html`, `jd/`, `cv/`, `assets/`, `robots.txt`) into `_site/`,
uploads that folder, then deploys with GitHub Pages Actions. `docs/` and
`plans/` are intentionally left out of the published artifact.

## Notes

- Static files only. No backend, no form service.
- Pages source should be GitHub Actions.
- No secrets required.

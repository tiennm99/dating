# Deployment

## Platform

GitHub Pages.

## Production URL

Expected URL: `https://tiennm99.github.io/dating/`.

## Build

```sh
pnpm run build
```

For project-page base path:

```sh
pnpm run build:gh
```

## Workflow

`.github/workflows/deploy-pages.yml` builds on `main`, uploads `build/`, then deploys with GitHub Pages Actions.

## Notes

- Static SvelteKit only. No backend, no form service.
- Pages source should be GitHub Actions.
- No secrets required.

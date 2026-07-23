# Deployment

## Platform

GitHub Pages.

## Production URL

Expected URL: `https://tiennm99.github.io/dating/`.

## Build

```sh
pnpm run build
```

For project-page base path, set `BASE_PATH` (the single base-path knob; CI derives it from the repository name):

```sh
# Git Bash / Linux / macOS
BASE_PATH=/dating pnpm run build
```

```powershell
# Windows PowerShell
$env:BASE_PATH = '/dating'; pnpm run build
```

## Workflow

`.github/workflows/deploy-pages.yml` builds on `main`, uploads `build/`, then deploys with GitHub Pages Actions.

## Notes

- Static SvelteKit only. No backend, no form service.
- Pages source should be GitHub Actions.
- No secrets required.

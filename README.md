# Dating

Warm-witty dating JD and CV site for Tiến Nguyễn Minh.

## Pages

- `/` home
- `/jd/` future lover job description
- `/cv/` candidate CV

## Features

- Light theme: white and blue
- Dark theme: black and pink
- Compact emoji theme switch
- Vietnamese-only copy
- Theme preference persisted in the browser

## Tech

- SvelteKit 2
- Svelte 5
- JavaScript with JSDoc type checking
- `@sveltejs/adapter-static`
- GitHub Pages

## Developing

Install dependencies:

```sh
pnpm install
```

Run locally:

```sh
pnpm run dev
```

## Building

Local static build:

```sh
pnpm run build
```

GitHub Pages build (CI sets `BASE_PATH` from the repository name; to reproduce locally):

```sh
# Git Bash / Linux / macOS
BASE_PATH=/dating pnpm run build
```

```powershell
# Windows PowerShell
$env:BASE_PATH = '/dating'; pnpm run build
```

Preview:

```sh
pnpm run preview
```

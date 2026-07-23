# Dating

Warm-witty dating JD and CV site for Tiến Nguyễn Minh.

## Pages

- `/` home
- `/jd/` future lover job description
- `/cv/` candidate CV

## Features

- Light theme: white and blue
- Dark theme: black and pink
- Compact emoji theme switch and VI/EN language switch
- English and full Vietnamese copy switch
- Vietnamese is the default locale
- Static i18n and theme preferences persisted in the browser

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

GitHub Pages build:

```sh
pnpm run build:gh
```

Preview:

```sh
pnpm run preview
```

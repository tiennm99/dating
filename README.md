# Dating

Warm-witty dating JD and CV site for Tiến Nguyễn Minh.

## Pages

- `/` home — `index.html`
- `/jd/` future lover job description — `jd/index.html`
- `/cv/` candidate CV — `cv/index.html`

## Features

- Light theme: white and blue
- Dark theme: black and pink
- Compact emoji theme switch
- Vietnamese-only copy
- Theme preference persisted in the browser

## Tech

- Plain HTML, CSS, and JavaScript — no framework, no build step
- Shared styles in `assets/styles.css`, theme toggle in `assets/theme-switch.js`
- All links are relative, so the site works at any base path
- GitHub Pages

## Developing

No install needed. Open `index.html` directly, or serve the folder for correct
`/jd/` and `/cv/` routing, e.g.:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which uploads
the site files as-is to GitHub Pages.

# Dating

Warm-witty dating JD and CV site for Tiến Nguyễn Minh.

## Structure

Single-page site: `index.html` at the repo root holds all three parts,
navigable via anchors:

- `#home` — intro hero
- `#jd` — future lover job description
- `#cv` — candidate CV

## Features

- Light theme: white and blue
- Dark theme: black and pink
- Compact emoji theme switch
- Vietnamese-only copy
- Theme preference persisted in the browser

## Tech

- Plain HTML, CSS, and JavaScript — no framework, no build step
- Shared styles in `assets/styles.css`, theme toggle in `assets/theme-switch.js`
- GitHub Pages (classic, deploy from branch)

## Developing

No install needed. Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deploying

Classic GitHub Pages serves the `main` branch root directly — pushing to `main`
publishes the site. `.nojekyll` disables Jekyll processing.

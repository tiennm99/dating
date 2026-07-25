# Dating

Warm-witty dating JD and CV site for Tiến Nguyễn Minh.

## Structure

Single-page site: `index.html` at the repo root holds the whole story, told as
scenes and navigable via anchors:

- `#home` — cold open, the vacant position
- `#applicant` — who the candidate is
- `#honest` — saying it straight
- `#offer` — what you get
- `#shared` — what you both protect
- `#no-test` — bonus points, and the written climax
- `#closing` — the connect beat
- `#dossier` — appendix, the detail table
- `#end` — end card

## Features

- Light theme: warm ivory and terracotta-rose
- Dark theme: candlelit plum and rose-gold
- First visit follows the OS colour scheme; an explicit choice is persisted
- Compact emoji theme switch
- Vietnamese-only copy

## Tech

- Plain HTML, CSS, and JavaScript — no framework, no build step
- GitHub Pages (classic, deploy from branch)

### Motion tiers

Motion is a three-tier progressive enhancement. Any change must keep all three
working, and no `[data-reveal]` element may ever be left invisible:

1. **Film** (`html.film-ready`) — GSAP + ScrollTrigger + Lenis from a CDN, in
   `assets/story-film.js`. Activates only on ≥768px, with motion allowed, and
   only when the CDN libraries actually arrived in time.
2. **Reveal** (`html.js-ready:not(.film-ready)`) — IntersectionObserver fade-and-rise
   in `assets/story.js`. This is what phones and reduced-motion visitors get.
3. **Static** — no JS, or a stalled CDN. A watchdog in the `index.html` head
   un-hides everything after 1200ms if no engine has claimed the page, so the
   first paint is never wordless.

Two ordering rules in `story-film.js` are load-bearing and commented there: pins
are created before reveals and carry `refreshPriority: 1`, and reveals are
per-beat and non-reversing.

### Files

- `assets/styles.css` — tokens, layout, components (both themes)
- `assets/story.css` / `story.js` — tier 2 reveal
- `assets/story-film.css` / `story-film.js` — tier 1 film
- `assets/story-chrome.css` / `story-chrome.js` — progress bar + active nav
- `assets/theme-switch.js` — theme toggle (keep in sync with the head bootstrap)
- `assets/freshness-stamp.js` — "cập nhật [ngày]" from the GitHub commit date

## Developing

No install needed. Open `index.html` directly, or serve the folder:

```sh
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deploying

Classic GitHub Pages serves the `main` branch root directly — pushing to `main`
publishes the site. `.nojekyll` disables Jekyll processing.

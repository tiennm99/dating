# Phase 1 — Foundation

Goal: load the film stack and establish the fail-open, reduced-motion-safe
engine boundary. No scenes yet — just the scaffolding that guarantees safety.

## Context links

- Current reveal engine: `assets/story.js`, `assets/story.css`
- Pre-paint bootstrap + `js-ready` gate: `index.html` inline `<script>` (lines ~39-62)
- Chrome to reconcile later: `assets/story-chrome.js`

## Requirements

- Load GSAP core, ScrollTrigger, Lenis via CDN with `defer` (mirroring
  `theme-switch.js`), pinned to explicit versions.
- Create `assets/story-film.js` that:
  - Bails out (leaving content fully visible) if GSAP/ScrollTrigger/Lenis
    absent, or `prefers-reduced-motion: reduce`, or `IntersectionObserver`
    unsupported.
  - When active: adds a distinct root flag (e.g. `html.film-ready`) so
    `story-film.css` owns the hidden/pinned states — never `story.css`.
  - Bridges Lenis → ScrollTrigger: drive `lenis.raf` from GSAP ticker, call
    `ScrollTrigger.update` on Lenis scroll, `lenis.on('scroll', ...)`.
- Create `assets/story-film.css` owning film-only layout, all scoped under
  `html.film-ready`, with a `prefers-reduced-motion` neutralizer.

## Files

- Create: `assets/story-film.js`, `assets/story-film.css`
- Modify: `index.html` (CDN `<script>` tags, new `<link>`/`<script>` for the two new assets)

## Implementation steps

1. Add CDN tags for GSAP, ScrollTrigger, Lenis (versioned) + new local assets.
2. Implement the guard/bail-out and the Lenis⇄GSAP ticker bridge in
   `story-film.js`; set `html.film-ready` only on success.
3. Add `story-film.css` skeleton (scene container, pin wrapper) scoped under
   `html.film-ready`; reduced-motion media query neutralizes it.
4. Ensure `story.js` reveal and `story-film.js` never both animate the same
   node (coordination finalized in Phase 2).

## Validation

- JS off / CDN blocked (DevTools request block): page = today's document.
- `prefers-reduced-motion: reduce`: `html.film-ready` NOT set; static content.
- Motion allowed, modern browser: `html.film-ready` set, Lenis scrolling smooth,
  no console errors. No scenes animate yet — just smooth scroll + flag.

## Risks / rollback

- Lenis/ScrollTrigger version mismatch → pin known-compatible versions.
- Rollback: remove new tags + two new files.

# Plan: Whole-page scroll-driven "short film" story

**Status:** Implemented — verified in headless Chrome (film activates, no console errors, fallback intact)
**Created:** 2026-07-24
**Branch:** main
**Slug:** scroll-film-story

## Implementation notes (decisions made during build)

- **Pinning limited to title cards.** Full-viewport pinning of content-heavy
  scenes risks clipping/jank when content exceeds the viewport, so only the two
  short scenes (`#home`, `#closing`, tagged `data-scene-pin`) pin. Every scene
  still gets a scrubbed entrance timeline. Ask if you want more scenes pinned.
- **Dropped the "Bộ hồ sơ" packet-explainer** (old Chương 2). It explained the
  JD/CV joke rather than being a fact about the person; the new arc makes the
  conceit implicit. No personal facts lost — the full dossier retains all 18.
- **Mobile / reduced-motion:** film gates OFF below 768px or under reduced
  motion; the existing `story.js` reveal runs there unchanged (no dynamic
  resize upgrade without reload — accepted).
- Orphaned `.jd-hero` / `.cv-hero` CSS rules left in styles.css (harmless dead
  rules; classes no longer used).

## Goal

Convert the existing witty JD/CV one-pager into a **scroll-driven cinematic
narrative**: each chapter becomes a scene that pins and its beats scrub to
scroll position, like frames of a short film. Reader controls pacing by
scrolling. Whole page participates (all 5 chapters), not just a hero.

## Decisions (locked with user)

- Playback: **scroll-driven** (reader scrolls to advance; scenes pin + scrub).
- Scope: **whole page** as a film (all chapters converted).
- Delivery: **CDN, no build step** (matches GitHub Pages / no-bundler setup).

## Stack

| Concern            | Library                     | Why                                              |
|--------------------|-----------------------------|--------------------------------------------------|
| Sequencing + pin   | GSAP core + ScrollTrigger   | Free (2025), CDN, battle-tested scrub/pin engine |
| Cinematic scroll   | Lenis                       | Momentum glide; feeds scroll value to ScrollTrigger |
| Theme (unchanged)  | assets/theme-switch.js      | Keep as-is                                       |

## Non-negotiable safety contract

Mirrors the existing `story.js` / `story.css` philosophy:

1. **Fail-open.** Content fully visible by default. GSAP only hides-then-reveals
   *after* it loads and confirms support. CDN/JS failure ⇒ current readable
   document, never a blank film.
2. **`prefers-reduced-motion`.** No pin/scrub. Fall back to the existing static
   reveals (or plain final-position content). No horizontal band jank.
3. **Accessibility/SEO preserved.** All copy stays real DOM text (no canvas),
   heading order and reading order unchanged.
4. **Chrome reconciled.** Pinning changes total scroll height — the
   scroll-progress bar (`story-chrome.js`) and active-nav IO must stay correct
   after pins are created (ScrollTrigger.refresh + progress recompute).

## Phases

| # | Phase | File | Depends on |
|---|-------|------|-----------|
| 1 | Foundation: load stack, Lenis⇄ScrollTrigger bridge, fail-open + reduced-motion gate | phase-01-foundation.md | — |
| 2 | Scene conversion: 5 chapters → pinned/scrubbed timelines | phase-02-scenes.md | 1 |
| 3 | Chrome reconciliation + verification (progress bar, nav, a11y, perf) | phase-03-chrome-verify.md | 2 |

## Acceptance criteria

- With JS disabled or CDN blocked: page renders as today (readable, no gaps).
- With `prefers-reduced-motion: reduce`: no pinning; content in final position.
- With motion allowed: each chapter pins and its beats scrub smoothly to scroll.
- Scroll-progress bar reaches 100% exactly at page end (accounts for pin height).
- Active-nav still highlights the correct section while scrubbing.
- No console errors; no layout shift (CLS) on load; keyboard/reader order intact.

## Files touched

- **Modify:** `index.html` (add CDN + new asset tags; minimal scene hooks/attrs)
- **New:** `assets/story-film.js` (GSAP/Lenis orchestration)
- **New:** `assets/story-film.css` (pin/scene layout + reduced-motion fallback)
- **Modify:** `assets/story.js` (disable IO reveal for filmed sections when film is active; keep as reduced-motion/no-support fallback)
- **Modify:** `assets/story-chrome.js` (recompute progress after ScrollTrigger pins; refresh on layout change)

## Risks & rollback

- **Pin height math** breaks progress bar / nav → mitigate with
  `ScrollTrigger.refresh()` after setup and on resize; progress reads live
  scrollHeight so it self-corrects.
- **Double animation** (story.js reveal + GSAP) → gate story.js off for filmed
  sections when the film engine initializes.
- **Mobile jank** from pinning → allow disabling pins under a width/motion
  threshold, degrade to static reveals.
- **Rollback:** all changes are additive files + reversible edits; `git revert`
  or delete the two new assets and their `<script>`/`<link>` tags.

## Open questions

1. Pin on mobile (<~768px) too, or degrade to the current reveal there? (Pinning
   on small touch screens is the most common source of jank.)
2. Keep the confetti payoff idea at Chương 5, or pure film with no gags?
3. Pin GSAP/Lenis to specific CDN versions (reproducible) vs. latest?

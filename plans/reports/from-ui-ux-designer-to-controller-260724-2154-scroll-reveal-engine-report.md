# Scroll-Reveal Chapters — Motion Engine Report

Two new files delivered. `index.html`, `assets/styles.css`, `assets/theme-switch.js` untouched.

- `C:\Users\miti99\Workspaces\tiennm99\dating\assets\story.css`
- `C:\Users\miti99\Workspaces\tiennm99\dating\assets\story.js`

## 1. Motion system + choreography

Treatment: "scroll-reveal chapters" — fade + gentle upward rise (translateY 26px → 0), no scale/parallax/horizontal slide. Longform-read feel.

Tokens (defined once in `story.css :root`, theme-agnostic; colors reused from styles.css, never redefined):
```
--reveal-distance: 26px;
--reveal-duration: 620ms;
--reveal-ease: cubic-bezier(0.22, 1, 0.36, 1);
--reveal-stagger: 90ms;
--reveal-duration-soft: 860ms;  /* closing beat only */
```

Mechanics:
- Single `IntersectionObserver` (`rootMargin: 0px 0px -10% 0px`, `threshold: 0.15`). Reveal once, then `unobserve`.
- `[data-reveal-group]` containers are observed as a unit: when the chapter enters, all its `[data-reveal]` descendants flip to `.is-visible` together, and inline `transition-delay` (index × `--reveal-stagger`, capped at index 6) produces the staggered cascade.
- Standalone `[data-reveal]` (none in the current hook plan, but supported) are observed individually.
- Hero needs NO special-casing: it is in view at load, so the observer fires for it immediately → the staggered on-load entrance falls out of the same code path.

Choreography per section (all groups; children cascade at 90ms steps):
- Hero `#home`: eyebrow → h1 → lead → button-row (fires on load).
- Packet concept: intro (eyebrow+h2) → panel 1 → panel 2.
- JD hero `#jd`: eyebrow → h2 → lead → meta-grid.
- Benefits / Responsibilities / Điểm cộng: intro → panels cascade.
- CV hero `#cv`: eyebrow → h2 → lead → meta-grid.
- Chân dung (6 panels): intro → panels cascade (delays cap so later cards don't lag).
- Thông tin nhanh: intro → whole `dl.facts-list` as one block (avoids 18 tag noise).
- Lời kết (closing): intro → panel, both `data-reveal="soft"` → 860ms softer landing.

Robustness: no `IntersectionObserver` → early return, content stays fully visible. Whole setup wrapped in try/catch that force-reveals everything on error. `window 'load'` + 200ms safety net force-reveals any in-/above-view item the observer missed. Listener is passive. `html.js-ready` defensively re-added in JS.

## 2. EXACT HTML hooks for the controller

### Head / script wiring
Add the stylesheet after the existing `styles.css` link (line 56), and the script after `theme-switch.js` (line 57):
```html
<link rel="stylesheet" href="assets/styles.css" />
<link rel="stylesheet" href="assets/story.css" />
<script src="assets/theme-switch.js" defer></script>
<script src="assets/story.js" defer></script>
```

### Pre-paint `html.js-ready` (controller owns this)
Inside the existing pre-paint theme bootstrap IIFE in `<head>` (lines 42–54), add, guarded by IO support:
```js
if ('IntersectionObserver' in window) {
	document.documentElement.classList.add('js-ready');
}
```
Placing it pre-paint prevents a flash of the initial (visible) state before hiding. story.js also adds it defensively, but pre-paint is preferred to avoid FOUC.

### `data-reveal` / `data-reveal-group` placement
By current selector / line reference in index.html:

1. Hero — `<div class="site-shell hero-copy">` (line 107): add `data-reveal-group`. Its 4 children each get `data-reveal`:
   - `<p class="eyebrow">` (108), `<h1>` (109), `<p class="lead">` (110), `<div class="button-row">` (114).

2. Packet section (`aria-labelledby="packet-title"`, line 121): add `data-reveal-group` to the `<section>`.
   - inner intro `<div>` (122) → `data-reveal`
   - both `<article class="panel …">` (127, 135) → `data-reveal`

3. JD hero `<section … id="jd">` (146): add `data-reveal-group`.
   - `<p class="eyebrow">` (147), `<h2 class="page-title">` (148), `<p class="lead">` (149), `<div class="meta-grid">` (154) → each `data-reveal`

4. Benefits section (`aria-labelledby="benefits-title"`, 161): `data-reveal-group` on `<section>`.
   - intro `<div>` (162) → `data-reveal`
   - all 4 `<article class="panel">` (167, 170, 173, 179) → `data-reveal`

5. Responsibilities section (`responsibilities-title`, 185): `data-reveal-group` on `<section>`.
   - intro `<div>` (189) → `data-reveal`
   - `<article class="panel strong">` (194) → `data-reveal`

6. Điểm cộng section (`process-title`, 210): `data-reveal-group` on `<section>`.
   - intro `<div>` (211) → `data-reveal`
   - both `<article class="panel">` (216, 229) → `data-reveal`

7. CV hero `<section … id="cv">` (241): `data-reveal-group`.
   - `<p class="eyebrow">` (242), `<h2 class="page-title">` (243), `<p class="lead">` (244), `<div class="meta-grid">` (249) → each `data-reveal`

8. Chân dung section (`strengths-title`, 256): `data-reveal-group` on `<section>`.
   - intro `<div>` (257) → `data-reveal`
   - all 6 `<article class="panel">` (262, 269, 277, 284, 292, 299) → `data-reveal`

9. Thông tin nhanh section (`facts-title`, 309): `data-reveal-group` on `<section>`.
   - intro `<div>` (310) → `data-reveal`
   - `<dl class="facts-list">` (314) → `data-reveal` (reveal the whole list as one block; do NOT tag each `<div>` inside)

10. Lời kết / closing section (`closing-title`, 390): `data-reveal-group` on `<section>`.
    - intro `<div>` (391) → `data-reveal="soft"`
    - `<article class="panel strong">` (395) → `data-reveal="soft"`

Do NOT tag the sticky `<header>`, nav, or skip-link (above the fold / persistent chrome).

## 3. `html.js-ready` dependency — confirmed
All hiding rules in story.css are scoped `html.js-ready [data-reveal] { … }`. Without that class the browser paints normal, fully-visible content. The reduced-motion block is likewise scoped under `html.js-ready` and forces `opacity:1; transform:none; transition:none` plus `transition-delay:0` — so even with the class present, reduced-motion visitors see everything instantly and un-jumped regardless of `.is-visible`. CSS depends on the controller's pre-paint class exactly as specified; story.js re-adds it defensively.

## 4. Assumptions / open questions
- Assumed section intros should reveal before their panels within the same chapter (intro is first DOM child → index 0). If you prefer intro + panels to appear simultaneously, drop `data-reveal-group` from that section and tag items individually — no code change needed.
- `facts-list` revealed as a single block (KISS, avoids 18 attributes + long capped-stagger tail). If per-row cascade is wanted, tag each `.facts-list > div` instead; stagger cap (index 6) already handles the count gracefully.
- `will-change` intentionally omitted: transform+opacity are already compositor-friendly, and ~30 simultaneously-hinted layers would waste memory for such subtle motion.
- No visual browser verification performed here (no screenshot tooling invoked); JS passes `node --check`. Recommend a quick manual pass in light + dark + reduced-motion once hooks are integrated.

Status: DONE
Summary: Delivered `assets/story.css` + `assets/story.js` implementing the shared reveal contract (tokens, `html.js-ready` scoping, IO reveal-once + stagger, soft closing variant, reduced-motion/no-JS safe), with copy-paste-precise HTML hooks for the controller.
Concerns/Blockers: None; two optional design toggles noted above (facts-list granularity, intro/panel simultaneity).

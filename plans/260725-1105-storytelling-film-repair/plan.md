# Plan — Repair the scroll film, then make it tell a story

Status: COMPLETE — verified in Chromium at 1440×900 / 390×844 / 320×640, both
themes, reduced-motion, CDN-blocked, and engine-blocked (watchdog) tiers.
Owner inputs still outstanding — see the checklist at the end.
Owner decisions (2026-07-25): full pass (stage fix + narrative + craft/perf); film stays
desktop-only (`min-width: 768px`); placeholder links stay in place, owner fills them later.

Source evidence:
- `plans/reports/from-ui-ux-designer-to-controller-260725-1040-storytelling-ux-audit-report.md`
- `plans/reports/from-researcher-to-controller-260725-1040-scroll-storytelling-stack-report.md`

## Problem

The GSAP tier is currently a net negative. Verified in code:
- Entrance triggers are created before the pins with no `refreshPriority`, so
  `ScrollTrigger.refresh()` measures them stale — every scene's animation completes
  below the fold (`#applicant` −540px, `#dossier` −1080px).
- `html.film-ready .film-scene{display:flex}` (0,2,1) beats `.section-grid`
  (0,1,0) — five scenes lose the two-column editorial layout in film mode.
- Both `[data-scene-pin]` pins have no timeline attached: ~540px of dead scroll.

Net: the `prefers-reduced-motion` fallback is the better-designed page.

## Contracts to preserve (invariants)

- Motion tiers: `html.film-ready` (GSAP) → `html.js-ready:not(.film-ready)` (IO reveal)
  → static. No `[data-reveal]` ever trapped invisible. `failOpen()` stays verbatim.
- Theme: `data-theme` on `<html>`, `color-scheme`, storage key `dating-theme`,
  bootstrap ↔ `theme-switch.js` in sync. Token names unchanged unless dead.
- Vietnamese copy is **moved, never reworded**. New strings are only permitted where
  marked OWNER and must be trivially replaceable.
- Both themes, focus states, skip link, 320px, WCAG AA, no build step, no backend.

## Phases

### P1 — Fix the stage (blockers)
1. `story-film.css`: stop clobbering `display`. Flex-centre only `#offer`
   (`:not(.section-grid):not(.home-hero)`); give grid scenes `align-content:center`.
2. `story-film.js`: create pins first with `refreshPriority: 1`, then reveals.
3. `story-film.js`: replace the per-scene tween with `ScrollTrigger.batch` per beat,
   `once: true` (non-reversing). Kills the stale-measure class of bug, fixes tall
   scenes, and stops the closing CTAs from sitting invisible-but-focusable.
4. `story-film.js`: attach a scrubbed camera push-in to the `#home` pin and a settle
   to the `#closing` pin. A pin with no animation must not exist.

### P2 — Craft + performance
5. Upgrade GSAP 3.12.5 → 3.15.0, Lenis 1.1.13 → 1.3.25; single CDN host (jsDelivr).
6. Fonts: request the Fraunces variable range `9..144,400..750` (550/600 currently
   both resolve to 650, so h1/h2/h3 all render identically); drop unused BVP 500.
7. FCP watchdog: un-hide beats if no engine claims the page within 1200ms.
8. Mobile header to one row; drive `scroll-margin-top` from `--header-h`.
9. Lenis-driven anchors; drop `scroll-behavior:smooth` under `film-ready`.
10. Perf: per-trigger `will-change`, no `backdrop-filter` ≤720px, cache `scrollHeight`.
11. Freshness stamp: reserve space, refresh ScrollTrigger after it lands.
12. Full-bleed header; reset `<p>` margins in `.panel`; preload the hero frame.
13. Label emoji for screen readers; drop dead tokens (`--mist`, `--brass`, `.jd-hero`,
    `.cv-hero`); give the light theme some dusk.
14. Honour `[data-reveal="soft"]` in the film tier (currently loses its 1250ms landing).

### P3 — Narrative
15. Slate-only labelling: drop `.eyebrow` where a `.chapter-tag` already exists.
16. Three shapes for the sagging middle — `#offer` as a structured benefit list,
    `#shared` unboxed as a vow, `#no-test` as the calmest thing on the page.
17. End card after `#dossier` carrying the seal, the freshness stamp (moved) and one
    repeat CTA, so the film has a last frame instead of ending on a spreadsheet.
18. Slow `#honest` deliberately — restraint used as emphasis.
19. Carry the hero dusk into `#applicant` instead of hard-cutting.
20. Nav reaches `#closing` (the only "apply" door currently has no link).

## Acceptance

- Chrome, both themes: every scene's beats animate *within* the viewport, not before it.
- Film tier renders the two-column grid identically to the reduced-motion tier.
- No dead scroll: the hero pin drives a visible push-in.
- Closing CTAs never focusable while invisible.
- Reduced-motion and no-CDN tiers unchanged and still complete.
- 320px: no horizontal overflow. Anchor jumps clear the mobile header.
- No console errors in any tier.

## Verification results (measured, not asserted)

| Check | Before | After |
|---|---|---|
| Reveals completing below the fold | every scene (−540px to −1080px) | 0 at every probe |
| `#applicant` in film mode | one 1120px column | `grid`, `403px 627px` |
| Hero pin | 540px dead scroll | `--hero-scale` 1→1.07, copy 101px→−5px, opacity 1→0.12 |
| Invisible-but-focusable CTAs | 2 at `scrollY 5200` | 0, after a full down-and-back-up pass |
| Mobile header (320px) | 254px (40% of viewport) | 73px (11%) |
| `scroll-margin-top` vs header | 88px vs 254px | 72px vs 73px |
| Horizontal overflow at 320px | 0 | 0 |
| Console errors | 0 | 0 |
| Watchdog tier (no engine) | n/a | fires, `js-ready` removed, 36/36 beats visible |

Two defects were introduced and fixed during implementation, both caught by
browser probing rather than by reading the code:
- The first `#closing` design drove content opacity from a reversible scrub,
  which reintroduced the invisible-but-focusable CTA bug. The pin now scrubs a
  decorative vignette only; the content reveal is separate and non-reversing.
- `#closing::after` used `inset: -10% -20%`, adding 42px of horizontal overflow
  at 320px. Because it is a pseudo-element it was invisible to a DOM overflow
  scan; found by comparing `scrollWidth` against the element sweep.

## Owner still to provide (unchanged, placeholders shipped)

- [ ] Facebook / Instagram handles, public playlist URL
- [ ] `assets/tien.jpg` — scene 2 is the protagonist reveal and is a grey silhouette
- [ ] Vietnamese text for the two commented OWNER beats (`#applicant`, `#honest`)

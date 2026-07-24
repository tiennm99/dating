# Plan — Make the profile more interesting & honest

Status: COMPLETE (verified in Chrome, both themes; owner inputs pending — see checklist)
Goal: increase both *interesting* and *honest* without breaking the 3-tier motion
fallback, both themes, a11y, responsiveness, or the no-build/no-backend constraint.

## Approved scope (from owner decisions)

1. **Connect affordance** — Facebook + Instagram buttons in `#closing` (reuse `.button`,
   inside the reveal-group so they animate in all tiers). Placeholder hrefs; owner fills handles.
2. **Photo slot** — responsive, CLS-safe, themed image slot with a CSS/SVG placeholder
   (no external fetch). Ships without a real photo; owner drops in `assets/tien.jpg` later.
3. **OS theme on first visit** — bootstrap + `theme-switch.js` honor `prefers-color-scheme`
   when no stored choice; a stored choice still wins; persist only on explicit click.
4. **Playlist link** — real anchor on the Scene 2 (`#applicant`) "playlist" claim (no embed).
   Placeholder URL; owner supplies.
5. **Freshness stamp** — "Vị trí còn mở tính đến [ngày]" derived at runtime from the GitHub
   commit date (`api.github.com/repos/tiennm99/dating/commits`), vi-VN formatted, injected
   into a `#closing` element. Degrades silently: hidden if fetch fails/offline; never shows a
   broken/placeholder date; never blocks render; no token in client code.
6. **Vulnerability + concrete texture** — structure only: one sincerely un-cute admission in
   `#honest` and one concrete detail in `#applicant`, following the panel + reveal-group
   pattern, as clearly-marked Vietnamese placeholders the owner rewrites in his voice.

## Contracts to preserve (invariants)
- Motion tiers: `html.film-ready` (GSAP) → `html.js-ready:not(.film-ready)` (IO reveal) →
  static. No `[data-reveal]` ever trapped invisible; new markup uses the right data-* attrs.
- Theme: `data-theme` on `<html>`, `color-scheme`, storage key `dating-theme` (`light`/`dark`),
  bootstrap ↔ theme-switch.js kept in sync. Token names unchanged.
- Both themes, focus states, skip-link, 320px, WCAG AA (`--primary-strong` for small text),
  no build step, no backend, Vietnamese copy, no fabricated personal facts.

## Order (low risk → higher)
P1 OS theme (technical) → P2 connect + playlist + copy placeholders (additive markup) →
P3 photo slot (markup + CSS) → P4 freshness stamp (new tiny JS + markup).

## Acceptance
- Chrome: both themes, hero → closing, no console errors, no trapped content, mobile fallback.
- Freshness stamp shows a real date online and is absent (not broken) when the API fails.
- OS dark on a fresh profile → site opens dark; after a manual toggle, choice persists.

## OWNER MUST PROVIDE (placeholders shipped)
- [ ] Facebook handle/URL
- [ ] Instagram handle/URL
- [ ] Public playlist URL (Spotify/YouTube)
- [ ] `assets/tien.jpg` (or similar) photo file
- [ ] Vietnamese text for the vulnerability beat (`#honest`) and the concrete-texture beat (`#applicant`)

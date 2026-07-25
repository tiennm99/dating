# Storytelling & Motion Audit — dating (scroll-film one-pager)

Advisory only. No files modified. Verified in real Chromium (agent-browser, headless, 1440×900 / 390×844 / 320×640, light + dark + `prefers-reduced-motion`, cdnjs blocked). Findings marked **[code-read]** were not reproducible in-browser; everything else is measured.

## Verdict

The writing is the best thing here — scenes 1–3 are specific, funny and genuinely disarming, and the dark theme's plum/rose-gold really does read candlelit. But the film layer that was supposed to make it *interesting* is currently a net negative: **every scene's scrub animation finishes entirely below the fold** (measured), so a desktop visitor with GSAP running sees essentially no motion at all, then hits **390px of completely frozen scroll** at the top. Worse, `html.film-ready .film-scene { display:flex }` silently overrides `.section-grid`, so the premium tier loses the two-column editorial layout and runs body copy at ~130 characters per line — the `prefers-reduced-motion` fallback is visibly the better-designed page. *Honest* is also undercut by shipping three dead placeholder links (`YOUR_HANDLE`, `PLAYLIST_URL_HERE`) as the page's entire conversion path, and a grey silhouette where the protagonist's face should be. *Restrained* is fully achieved; the problem is not too much motion, it's motion that misfires.

## What already works

- Three-tier fallback is real. Blocked cdnjs → `film-ready` never set, IO reveal takes over, 0 trapped elements. Reduced-motion → film off, all 31 `[data-reveal]` at opacity 1, two-column grid intact. No console errors or page errors in any tier.
- Dark palette (`#17090f` / `#f2a488`) is on-brief. Measured contrast passes AA in both themes (`--muted` 5.8:1 light, `--primary-strong` 6.4:1 light).
- Freshness stamp works end-to-end and degrades to nothing on failure — the honesty guarantee holds.
- Scroll-progress bar reaches exactly `scaleX(1)` at page end despite two pins.
- 320px: zero horizontal overflow, h1 clamps to 57.6px cleanly, Vietnamese diacritics never clip (`line-height: 1.14` / `1.35` choices are correct).
- Fraunces + Be Vietnam Pro pairing is the right call for VI display type.

## Findings

### BLOCKER 1 — Every scene's reveal animation plays below the fold

`assets/story-film.js:70-100`

Entrance ScrollTriggers are created **before** the pin ScrollTriggers, and no `refreshPriority` is set. `ScrollTrigger.refresh()` therefore refreshes them in creation order, measuring the DOM before each pin's spacer is applied. Result: every entrance trigger is early by the cumulative pin spacing above it.

Measured at 1440×900:

| scene | element top (doc) | trigger should end | trigger actually ends | error |
|---|---|---|---|---|
| `#applicant` | 1445 | 1157 | 617 | −540 |
| `#honest` | 2846 | 2558 | 2018 | −540 |
| `#offer` | 3888 | 3600 | 3060 | −540 |
| `#dossier` | 8284 | 7996 | 6916 | −1080 |

Direct probe at `scrollY = 2050`: `#honest > div` is at viewport-top **900px** (exactly the bottom edge, not yet visible) and already `opacity: 1, transform: none`. Its last panel sits 1554px down and is likewise fully revealed.

**Why it hurts:** the entire "rewarding detail on scroll" premise is dead. The reader scrolls into every scene and finds it already finished. 42KB of GSAP + ScrollTrigger + Lenis buys zero visible motion.

**Fix:** give the two pin triggers `refreshPriority: 1` so they refresh first, then `ScrollTrigger.refresh()`. Better still, move to per-beat triggers (see Opportunity 2) — that removes the whole class of problem for tall scenes, where a scene-level trigger can never time the bottom half correctly anyway.

### BLOCKER 2 — Film mode destroys the two-column editorial layout

`assets/story-film.css:14-19` vs `assets/styles.css:502-507`

`html.film-ready .film-scene { display:flex; flex-direction:column; }` has specificity (0,2,1); `.section-grid { display:grid; grid-template-columns: minmax(0,.9fr) minmax(0,1.4fr) }` has (0,1,0). The film rule wins on all five `.section-grid` scenes (`#applicant`, `#honest`, `#shared`, `#no-test`, `#dossier`).

Measured: reduced-motion tier → `grid`, columns `400.688px 623.312px`. Film tier → single 1120px column. The grid's `gap: clamp(2rem,7vw,6rem)` becomes a ~96px vertical flex gap, so the portrait/heading column floats alone with a huge hole under it.

Consequence in the screenshots: `#honest` panels run the full 1120px, ~130 characters per line — roughly double the readable measure. The portrait placeholder sits orphaned at 256px in an empty 1120px row.

**Why it hurts:** the tier with the most capable browser gets the worst-looking page. The intended layout (big serif heading left, ~55-char panels right) is genuinely lovely and only reduced-motion visitors ever see it.

**Fix:** don't clobber `display`. e.g.
`html.film-ready .film-scene:not(.section-grid) { display:flex; flex-direction:column; justify-content:center; }` plus `html.film-ready .film-scene { min-height:100vh; } html.film-ready .section-grid { align-content:center; }`.

### BLOCKER 3 — 390px of dead scroll is the first thing a visitor experiences

`assets/story-film.js:92-100`

`#home` pins from scroll 5→545 with **no timeline attached to the pin**. Measured with real repaints: h1 viewport-top is 328px at y=150, 328 at y=300, 328 at y=450, 328 at y=540. Nothing changes. Additionally, the `#home` entrance timeline lives at scroll −697→−283, i.e. permanently at progress 1 — so the hero also has no entrance animation in the film tier (in the fallback tier it gets the 900ms staggered rise).

**Why it hurts:** the cold open is the one frame the whole film hangs on. Currently: text pops in with no animation the moment the CDN resolves, then ~43% of a viewport of scrolling produces no response at all. Reads as a stuck page, not a dramatic hold. `#closing` has the same empty pin (6844→7384).

**Fix:** attach a scrubbed timeline to the pin — see Opportunity 1. A pin without an animation should not exist.

### MAJOR 4 — First contentful paint contains no content [partly code-read]

`index.html:64-66` + `assets/story.css:28` + script order `index.html:80-86`

The inline head script adds `js-ready` pre-paint; `story.css` then hides all 31 `[data-reveal]`. `story.js` is `defer` and sits *after* three `defer` CDN scripts, so it cannot execute until 42KB from cdnjs+jsdelivr resolves. Measured locally: FCP at 84ms with every beat at opacity 0 — the first paint is header + hero photo and **not one word of text**; DOMContentLoaded at 203ms. Locally the gap is ~120ms; on a Vietnamese mobile connection (the actual audience) 42KB from cdnjs is plausibly 2–4s of a wordless page. Hard failure is handled correctly (verified with cdnjs aborted); **slow-but-successful is not**.

**Fix:** watchdog in the existing inline head IIFE — `setTimeout(() => { if (!root.dataset.storyEngine) root.classList.remove('js-ready'); }, 1200)`, with `story.js`/`story-film.js` setting `root.dataset.storyEngine` when they take over. Removing `js-ready` un-hides everything through the existing 900ms transition, so the degradation is graceful rather than a pop.

### MAJOR 5 — The only two CTAs are invisible but focusable

`index.html:420-435`, `assets/story-film.css:25-29`

Measured at `scrollY = 5200`: "Nhắn qua Facebook" and "Theo dõi Instagram" have effective opacity 0 yet remain in the tab order with no visible focus ring. WCAG 2.1 AA 2.4.7 failure, and it's the page's entire conversion path. The `story.js` tier is safe here (reveal-once + in-view force-reveal); the film tier is not, because `scrub` is reversible.

**Fix:** make film reveals non-reversing (Opportunity 2) — that matches the fallback tier's reveal-once contract and removes the issue without adding `visibility` juggling.

### MAJOR 6 — Mobile sticky header eats 30–40% of the screen and breaks anchor targets

`assets/styles.css:402-418`, `:431-433`

Measured: `.site-header` is **254px tall** at both 390×844 and 320×640 — brand row, then a nav that wraps "Chi tiết" onto its own line, then the theme control on a third row. Sticky, permanent. On a 640px viewport that is 40% of the screen.

Compounding: `section[id] { scroll-margin-top: 5.5rem }` = 88px. Measured after `location.hash = '#offer'` at 390px: section top lands at 88px from the viewport top while the header occupies 254px — **the scene heading lands behind the header on every anchor jump on mobile**. Desktop is fine (header 85px vs margin 88px).

**Fix:** collapse the mobile header to one row (brand + a single overflow/anchor control + theme), and set `scroll-margin-top` from a `--header-h` custom property updated per breakpoint (or measured once in JS).

### MAJOR 7 — The middle third of the film sags: three identical scenes in a row

`index.html:290-397`

`#offer`, `#shared`, `#no-test` are all abstract promise-copy in the same rose-bordered rounded rectangle. Scenes 2–3 have texture (Genshin, T1 Keria, 162cm không cộng dép, fetish là chân); scenes 4–6 have none. `#offer`'s four panels have no `<h3>` at all — four title-less single sentences in 1120px boxes, each ~104px tall because `<p>` default margins are never reset inside `.panel`. `#shared` and `#no-test` each wrap a `<ul>` in the same box.

This is exactly where the JD conceit stops helping: "Trách nhiệm" and "Ghi chú tuyển chọn" turn the tender part into HR. The plan (`phase-02-scenes.md`) called scene 6 the emotional peak; visually it is indistinguishable from scenes 4 and 5.

**Fix:** three different shapes for three registers — see Opportunity 4.

### MAJOR 8 — No payoff; the film ends on a spreadsheet

`index.html:443-529`

`#dossier` is 1478px of 18-row `<dl>` and it comes *after* `#closing`. The reader reaches the emotional landing, then scrolls a viewport and a half of reference data with no closing frame, no repeat CTA, and no "The End". The `#closing` pin releases straight into it, so the "hold" reads as a stall rather than a resolution.

**Fix:** Opportunity 5 — a short end card after the dossier carrying the seal, the freshness stamp and one repeat CTA.

### MAJOR 9 — Three dead placeholder links shipped live

`index.html:224` (`href="PLAYLIST_URL_HERE"`), `:423` (`facebook.com/YOUR_HANDLE`), `:429` (`instagram.com/YOUR_HANDLE`)

Both closing CTAs 404, and the "Nghe thử playlist →" link — which exists specifically to *prove* the playlist claim — resolves to a relative path on the same origin. On a page whose entire thesis is honesty, three broken proof-links is the single largest credibility hit, larger than any motion defect.

**Fix:** owner supplies the URLs, or remove the affordances until he does. Half a CTA is worse than none.

### MAJOR 10 — The tender closing beat is *less* tender in the premium tier

`assets/story-film.js:71` vs `assets/story.css:38-44`

`story.css` gives `[data-reveal="soft"]` a 1250ms landing "to let the warm final beat settle". `story-film.js` selects `[data-reveal]` (which matches `soft`) and applies the identical `power2.out` / `stagger 0.12` / `scrub: 1` as every other scene. The one beat that was deliberately given special timing loses it in the tier that was supposed to be the cinematic one. The two tiers also use different easing signatures entirely (`cubic-bezier(.16,1,.3,1)` vs `power2.out`).

**Fix:** read the attribute value in the film loop and lengthen scrub/stagger for `soft`; move both tiers onto the same `--reveal-ease` intent.

### MAJOR 11 — The heading weight hierarchy does not actually render

`index.html:16`, `assets/styles.css:196-214`

`document.fonts` measured: Fraunces 500 **unloaded**, 650 loaded, 750 loaded. CSS asks for `font-weight: 650` (h1), `550` (h2), `600` (h3), `700` (`.brand-mark`). With only 500/650/750 instances requested, CSS weight matching resolves 550→650 and 600→650. **h1, h2 and h3 all render at Fraunces 650.** The lighter, airier h2 the CSS describes does not exist.

Also measured: `Be Vietnam Pro 500` requested and never used (one wasted font file).

**Fix:** request the variable range — `Fraunces:opsz,wght@9..144,400..750` — and drop `500` from the Be Vietnam Pro list.

### MINOR 12 — The sticky header bar is clipped to 1120px

`index.html:97` — `<header class="site-shell site-header">`

`.site-shell` constrains width; `.site-header` paints the background, border-bottom and `backdrop-filter`. Result (visible in every screenshot): a floating dark bar over the hero photo with the page/photo showing on both sides, while the fixed `.scroll-progress` above it spans the full viewport. Reads as a rendering bug.

**Fix:** full-bleed `<header class="site-header">` with an inner `<div class="site-shell">`.

### MINOR 13 — Freshness stamp causes 42px CLS inside a pinned scene, with no refresh

`assets/freshness-stamp.js:38-39`, `assets/styles.css:767-774`

Measured: the stamp adds **42px** when un-hidden after the GitHub fetch. It lands inside the pinned `#closing`, after `ScrollTrigger.refresh()` has run, and nothing refreshes afterwards — so every downstream trigger position is off by another 42px on top of Blocker 1, plus a real layout shift.

**Fix:** reserve the space (`min-height: 42px` on `.freshness-stamp`, drop `hidden` in favour of empty text), or call `window.ScrollTrigger?.refresh()` after un-hiding.

### MINOR 14 — Triple labelling; the slate spoils its own beat

`index.html:144-145, 251-253, 339-341, 369-371, 409-411`

Every scene stacks `.chapter-tag` + `.eyebrow` + heading, both micro-labels uppercase, letterspaced, `--primary-strong`, ~11.5px/12.5px. In the screenshots the eyebrow is longer and visually heavier than the chapter tag it sits under, so the hierarchy inverts. And in four scenes the two are near-duplicates:

- Cảnh 3: slate "Thành thật từ đầu" / eyebrow "Nói thẳng" / heading "Nói thẳng, để đỡ mất công đoán."
- Cảnh 5: slate "Điều cả hai cùng giữ" / heading "Điều cả hai cùng bảo vệ."
- Cảnh 6: slate "Không có bài kiểm tra áp lực" / eyebrow "Điểm cộng" / heading "Điểm cộng thì vui…"
- Cảnh 7: slate "Lời kết" / eyebrow "Lời kết"

**Fix (placement only, no copy rewritten):** drop `.eyebrow` in scenes carrying a `.chapter-tag`, or demote it to `--muted`, sentence case, no letterspacing. Two-step hierarchy: slate → title.

### MINOR 15 — Nav covers 4 of 8 scenes and omits the CTA

`index.html:108-113`, `assets/story-chrome.js:53`

`Mở đầu / Con người / Lời mời / Chi tiết` → `#home, #applicant, #offer, #dossier`. `#honest`, `#shared`, `#no-test` and — critically — `#closing` are unreachable from the persistent chrome. The only "apply" door in the whole page has no link to it.

### MINOR 16 — Compositor layer pressure, especially on mobile where the film is off

`assets/story-film.css:28` puts `will-change: opacity, transform` on all 31 reveals permanently, never cleared — reversing the deliberate omission documented in the prior story.css report. On top of: `body::after` (fixed, `inset:-20% -10%`, `will-change: transform`, 26s infinite drift), `body::before` (fixed full-viewport SVG-noise overlay above content), and `backdrop-filter: blur(18px)` on a full-width sticky header. The header blur is the most expensive of these and it runs on mobile, where the film is disabled and the reading experience *is* the product.

**Fix:** drop the blanket `will-change`; set/clear per trigger. Consider `backdrop-filter: none` under `max-width: 720px`.

### MINOR 17 — Forced layout every scroll frame

`assets/story-chrome.js:26` reads `docEl.scrollHeight` inside the rAF callback on every scroll frame. With Lenis writing scroll position every frame and pins mutating layout, this invalidates and re-computes layout continuously. Cache `max` and recompute on `resize` + after `ScrollTrigger.refresh()`.

### MINOR 18 — Double smoothing makes the scroll mushy

`assets/story-film.js:62, 84` — Lenis `duration: 1.1` plus `scrub: 1` stacks roughly two seconds of latency between a wheel tick and the settled visual state. For a page people will re-read (the honesty panels especially), that fights precise reading. Suggest Lenis `duration: 0.9–1.0` and `scrub: 0.5`, or `scrub: true` since Lenis already smooths.

### MINOR 19 — Anchor jumps bypass Lenis entirely

`assets/styles.css:82` keeps `scroll-behavior: smooth` while Lenis runs; nothing calls `lenis.scrollTo`. Measured on `#dossier`: 0 → 8196px in about one second, sampled per frame (`0, 2, 9, 21, 39, 63, 94, 133, …, 3525` in 24 frames). Every scene's scrub runs at warp speed and the easing signature is completely different from wheel scrolling. Not broken, but it snaps the reader out of the film.

**Fix:** intercept `nav a[href^="#"]` → `lenis.scrollTo(target, { offset: -headerHeight, duration: 1.4 })`, and drop `scroll-behavior: smooth` when `film-ready`. Also fixes Major 6's offset in the same place.

### POLISH 20 — Panel internals

`.panel` never resets `<p>` margins, so `#offer`'s one-line panels measure 104px tall. `.meta-grid` and the following `.panel-list` sit flush with 0px between them in both tiers.

### POLISH 21 — Light theme has no dusk in it

`--panel-bg: rgba(255,250,244,.82)` on a `#fbf5ee → #f4e6da` ground gives almost no surface separation; panels are held together only by the rose left-border and a very soft shadow. Text contrast is fine (measured 5.8:1); it's the *mood* that's missing — reads pale wedding stationery rather than candlelit. Additionally, the hero is dark-overlaid in both themes, so light mode hard-cuts from a cinematic dark frame to bright ivory at the scene-1→2 boundary. Dark mode is continuous and clearly the stronger of the two against the brief.

### POLISH 22 — Unlabelled emoji in the zodiac beat

`index.html:385, 522` — `🐈 🐒 🐅 🐍 🐎 🐖 🐉 🐕 🌚` are read out by screen readers as eight English emoji names mid-Vietnamese-sentence. Markup-only fix: wrap each in `<span role="img" aria-label="…">`. No copy change.

### POLISH 23 — Dead tokens and latent coupling

`--mist` and `--brass` (`styles.css:40, 43`) have zero usages; `.jd-hero` / `.cv-hero` are orphaned (already noted in the plan). Separately, `.home-hero { align-items: center }` (`styles.css:588`) was written for a row flex and silently becomes horizontal alignment once film mode sets `flex-direction: column` — harmless today only because `.hero-copy` carries `.site-shell`'s explicit width.

### POLISH 24 — Hero image is the film's opening frame and isn't preloaded

`dating-application-hero-background.webp` is only discoverable after `styles.css` parses. `<link rel="preload" as="image" href="assets/dating-application-hero-background.webp" fetchpriority="high">` is one line.

## Storytelling opportunities

**1. Give the hero pin a job — camera push-in (S, low risk).**
The `#home` pin already exists and costs 390px of scroll. Attach a scrubbed timeline to it: `background-size`/`scale` 1 → 1.06 on `.home-hero`, `--hero-overlay-mid` alpha rising, `.hero-copy` drifting up ~40px and fading to 0.2 as the pin releases. Dead scroll becomes a slow push-in and a dissolve into scene 2. No new markup, no invariant touched.

**2. Per-beat triggers, non-reversing (M, medium risk).**
Replace the one-tween-per-scene loop with `ScrollTrigger.batch('[data-scene] [data-reveal]', { start: 'top 88%', once: true, onEnter: b => gsap.to(b, {opacity:1, y:0, stagger:.1, ease:'expo.out'}) })`. Fixes Blocker 1 structurally (no scene-level measurement to go stale), fixes tall scenes that a single trigger can never time, kills Major 5 (nothing re-hides, nothing invisible stays focusable), and aligns the film tier with the fallback's reveal-once contract. Risk: `failOpen()` and the load-time safety net must be retained verbatim.

**3. The photo as scene 2's pivot (S build / owner-blocked, low risk).**
Once `assets/tien.jpg` exists: let the portrait fill the left grid column instead of capping at 16rem, and scrub `filter: sepia(.5) saturate(.6)` → `none` across the scene. One face, one reveal — this is the highest-value "rewarding detail" available on the page and it currently renders as a grey silhouette captioned "Ảnh thật cập nhật sau", i.e. the protagonist reveal is a placeholder.

**4. Three shapes for the sagging middle (M, low risk).**
- `#offer`: promote the four title-less panels into a numbered benefit list reusing `.meta-grid`'s cell language — the JD conceit lands harder as a structured "gói đãi ngộ" than as four floating sentences.
- `#shared`: remove the box. Set the four pledges as large Fraunces lines, each `<li>` its own beat, staggered slowly. Reads as a vow instead of a policy.
- `#no-test`: strip the left border and centre "Ghi chú tuyển chọn" quietly — this is the written climax and should be the visually *calmest* thing on the page.

**5. An end card after the dossier (S, low risk).**
Add a short `#end` scene after `#dossier`: brand seal, the freshness stamp (moved here — also removes its CLS from the pinned `#closing`), and one repeat of "Nhắn qua Facebook". The dossier becomes an actual credits roll with a last frame behind it, and the CTA appears at the true bottom where the reader finishes.

**6. Slow the honesty beat down deliberately (S, low risk).**
`#honest` is the strongest copy. Give its three panels individual triggers with a longer scrub each (per-scene config object keyed by section id) so the reader is physically slowed there. Restraint used as emphasis: the one place the film breathes.

**7. Carry the dusk out of the hero (S, low risk).**
Add a scrubbed overlay on the top ~40vh of `#applicant` resolving from `--hero-overlay-start` to transparent, so the film dissolves from the dark opening frame into the page instead of cutting. Matters most in light theme, where the current cut is abrupt.

**8. Slate-only labelling (S, zero risk).**
Remove `.eyebrow` from every scene that already has a `.chapter-tag` (or demote it). Structure/placement only — no Vietnamese rewritten. Restores a clean slate → title hierarchy and stops the labels from announcing the punchline before the heading delivers it.

**9. Lenis-driven anchors (S, low risk).**
Intercept in-page nav clicks → `lenis.scrollTo(el, { offset: -headerHeight, duration: 1.4 })`; drop `scroll-behavior: smooth` when `film-ready`. Nav travel then shares the film's camera language, and the mobile header offset (Major 6) gets fixed in the same place.

## Recommended priority order

1. **Blockers 1 + 2.** Everything else is decoration on a broken stage — the motion never lands and the layout is wrong for the majority tier. Blocker 2 is a two-line CSS fix with the largest visible payoff of anything in this report.
2. **Major 9 (dead links) + Opportunity 3 (photo).** Owner-blocked, so start the ask now. An "honest" page with three 404s and a placeholder face fails its own brief regardless of craft.
3. **Blocker 3 (hero pin payoff, Opportunity 1)** and **Major 4 (FCP watchdog)** — first impression and slow-connection behaviour for the actual Vietnamese mobile audience.
4. **Major 5** — falls out of Opportunity 2 for free once beats stop reversing.
5. **Major 6** — mobile is where this page will mostly be read; 254px of chrome and mis-targeted anchors are worse there than any desktop finding.
6. **Majors 7 + 8** (sag + payoff, Opportunities 4/5) — the narrative work, once the stage is fixed.
7. **Majors 10, 11; Minors 12, 13, 14** — craft pass.
8. **Minors 16–19 + polish** — performance and hygiene.

## Unresolved questions

1. Is there a real portrait, and is the owner willing to publish it? Scene 2 — the protagonist reveal — is entirely blocked on this, and no amount of motion design substitutes for a face.
2. The two commented-out OWNER beats (a concrete detail in `#applicant`, an un-cute admission in `#honest`) are still unwritten. The honesty arc has a visible hole without the second one — every current "flaw" is a charming flaw.
3. Do the Facebook/Instagram/playlist links go live before this is shared, or should the affordances be removed until they exist?
4. Is the GSAP + Lenis layer worth keeping? It costs 42KB from two CDNs, currently produces no visible motion, and breaks the layout. A per-beat IntersectionObserver reveal — already written and working in `story.js` — would deliver most of Opportunities 2/6 at zero bytes. Fixing the film is maybe half a day; deleting it is an hour. Worth a decision before investing further.
5. Should `#dossier` stay a flat 18-row `<dl>`, or become a genuine credits roll (slower per-row scrub, quieter type)? It is 1478px — the longest single block on the page — and currently the last thing the reader sees.
6. The publicly-indexed personal details under a real name (162cm, fetish là chân) were flagged in the 2026-07-23 review and are still live. Confirm this is still intentional rather than un-reviewed.

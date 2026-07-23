# Content, UX & Accessibility Review — Dating JD & CV Static Site

Advisory only. No source files modified. Reviewed: both locale files, all 4 route/layout files, app.html, all 3 stylesheets, preferences.js. Contrast ratios computed from actual hex values (WCAG 2.1 formula).

## What already works well (no action)

- **Theme flash: HANDLED.** `src/app.html:7-23` has an inline pre-hydration script setting `data-theme`, `lang`, and `color-scheme` from localStorage with a safe fallback. No flash-of-wrong-theme.
- Skip link (`layout.css:1-15`) + `main id="content"`, `aria-current="page"` on nav, `aria-pressed` + `aria-label` + `title` on segmented controls, `aria-hidden` on decorative emoji — solid.
- `prefers-reduced-motion` handled globally (`base.css:149-157`) incl. `scroll-behavior` override.
- 44px touch targets on nav links and segmented buttons; 48px CTAs.
- Fonts: Be Vietnam Pro + Fraunces both ship Vietnamese subsets — good pairing choice for VI diacritics.
- EN/VI structure parity is exact (same keys, same list lengths); localization quality is high ("Wibu nửa mùa" for "Part-time otaku", "Sài Gòn" for "HCMC" — genuinely localized, not translated).
- Dark theme contrast is comfortably passing everywhere I measured (6.2:1–11.4:1).

## Findings (ranked)

### H1 — JD page: eyebrow/heading pair mismatched to content — HIGH (content/UX)

`src/lib/i18n/en.js:72-73`, `vi.js:71-72`, rendered at `src/routes/jd/+page.svelte:51-68`.

The last JD section pairs eyebrow **"Nice to have" / "Điểm cộng"** with heading **"Interview process." / "Quy trình phỏng vấn."** — but the section body is (a) the nice-to-have list and (b) a "Selection notes" panel. Nothing in it describes a process. Every other section on the site pairs eyebrow+heading correctly, so this one reads like a copy-paste slip and breaks the JD parody's internal logic.

Fix (pick one):

- **Preferred (copy-only):** rename `processTitle` to match the eyebrow:
  - EN: `'Bonus points, never blockers.'`
  - VI: `'Điểm cộng thì vui, không có cũng chẳng sao.'`
    The "Selection notes" panel already has its own h3 and covers the "process" angle fine.
- Alternative: keep "Interview process." and change the eyebrow to `'Selection'` / `'Tuyển chọn'`, moving the nice-to-have list under its own h3 — more markup churn, not worth it (YAGNI).

Also update the anchor id `process-title` only if you rename in markup; not required for a copy-only fix.

### H2 — Missing og:title / og:description / og:locale; missing twitter:image:alt — HIGH (content/SEO)

`src/routes/+layout.svelte:39-55` sets og:type, og:site*name, og:image (+dimensions/alt) and twitter:card/image — but no page ever emits `og:title`, `og:description`, `og:url`, or `og:locale`. Shares on FB/Zalo/Messenger (the likely channels for a VN dating CV) will fall back to scraping, often showing just the site name + image. For this product the share card \_is* the funnel.

Fix:

- In each page's `<svelte:head>` (`+page.svelte:7-10`, `jd/+page.svelte:5-8`, `cv/+page.svelte:5-8`) add alongside existing title/description:
  `<meta property="og:title" content={$copy.X.metaTitle} />` and `<meta property="og:description" content={$copy.X.metaDescription} />`.
- In `+layout.svelte` add `<meta property="og:locale" content="vi_VN" />` and `<meta property="og:locale:alternate" content="en_US" />` (prerendered HTML is vi-default, so vi_VN is correct).
- Add `<meta name="twitter:image:alt" content="..." />` mirroring og:image:alt.
- og:image:alt at line 49 is EN-only in a vi-default document; consider moving alt text into copy files, e.g. VI: `'Minh họa bộ hồ sơ ứng tuyển hẹn hò ấm áp'`.

### M1 — Light-theme eyebrow color fails AA contrast — MEDIUM (a11y)

`content.css:1-8` sets `.eyebrow { color: var(--primary); font-size: 0.78rem }` (≈12.5px bold — "normal text" per WCAG, needs 4.5:1).

Measured: `#1f6feb` on `--background #f7fbff` = **4.46:1 (FAIL)**; on white panel = 4.63:1. Every eyebrow on every page fails by a hair in light theme. Dark theme passes (6.69:1).

Fix: in light theme only, use `--primary-strong #0a52bd` for eyebrow text → **6.84:1 (PASS)**, still clearly "blue brand". Simplest: `.eyebrow { color: var(--primary-strong); }` — dark theme's `--primary-strong #ff7ac2` also passes (8.55:1), so one rule fixes both.

Related, borderline-but-passing (no action needed, just aware): white on `--primary` buttons = 4.63:1 at bold 700 weight — passes AA.

### M2 — `aria-label` on plain `<div>`s is not exposed to AT — MEDIUM (a11y)

`jd/+page.svelte:14` and `cv/+page.svelte:14`: `<div class="meta-grid" aria-label={...}>`. `aria-label` on a generic div with no role is ignored by most screen readers, so `summaryAria` copy ("Role summary" / "Tóm tắt vị trí") does nothing.

Fix: add `role="group"` to the div, or better semantics for key/value pairs: `<dl class="meta-grid">` with `<dt>`/`<dd>` (same for `.facts-list` on `cv/+page.svelte:41-48`, currently span+strong — a textbook definition list). The `dl` route also removes the need for aria-label entirely. Low effort, real AT win.

### M3 — Heading `line-height: 0.98` risks Vietnamese diacritic collision — MEDIUM (visual, VI-specific)

`base.css:112-118`: h1–h3 use Fraunces at `line-height: 0.98`. The h1 "Tiến Nguyễn Minh" wraps (max-width 11ch at `base.css:121-124`) at large clamp sizes (up to 8.8rem). Stacked VI diacritics (ễ, ấ) on the lower line can visually collide with descenders/baseline of the line above at sub-1 line-height. Same risk for VI h2s that wrap ("Một trò đùa nghiêm túc, được quản lý nhẹ nhàng.").

Fix: bump heading line-height to `1.06–1.1`. Verify with a screenshot at 320px and 768px in VI before/after. This is the classic VN-typography gotcha; Fraunces has tall accent stacking.

### M4 — Hero text legibility over image where overlay fades — MEDIUM (visual, verify)

`+page.svelte:50-58` layers a 90deg gradient from `--hero-overlay-start` (0.86 alpha) to `--hero-overlay-end` (**0.08** light / 0.10 dark) over an unknown-luminance photo, with white `--hero-ink` text. Text is left-anchored, but the h1 at clamp max (8.8rem) and the 42rem lead can extend past the midpoint where overlay alpha is ~0.5 and falling. If the image has bright regions center-right, white text contrast collapses there.

Fix options (cheapest first): raise `--hero-overlay-mid` to ~0.62 light / 0.72 dark; or add a subtle `text-shadow: 0 1px 24px rgba(0,0,0,0.4)` on `.hero-copy`; or cap the gradient's protected zone at the shell width. Verify with actual screenshots in both themes at 1440px and 375px — I could not render the image in this review.

### L1 — Flash of Vietnamese for stored-EN visitors — LOW (note only)

Prerendered HTML is vi (copy is store-driven; `preferences.js:83-92` swaps locale post-hydration). `app.html` sets `lang` early but text content still flips vi→en after hydration for EN users. Inherent to the static + client-locale architecture; not worth fixing (YAGNI), just documenting so it isn't re-reported as a bug.

### L2 — Google Fonts via CSS `@import` — LOW (perf)

`base.css:1` uses `@import`, which serializes CSS→font-CSS→font fetch. Move to `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` + `<link rel="stylesheet">` in `app.html` for faster first paint of Fraunces hero type. Optional.

### L3 — Duplicated preference logic in app.html vs preferences.js — LOW (maintenance)

`app.html:11-14` re-hardcodes storage keys (`dating-theme`, `dating-locale`), valid values, and defaults that also live in `preferences.js:16-17` and `i18n/index.js`. Any future change (e.g., adding a `system` theme) must be made twice. Acceptable trade for a zero-flash inline script; add a one-line comment in both files pointing at each other.

### L4 — Copy micro-nits (both locales, tone preserved)

1. `vi.js:75` — "biến tình yêu thành **mục tiêu quý**": "quý" is ambiguous (quarterly vs. precious) and the OKR joke gets lost. Suggest: `'…mà không biến tình yêu thành OKR xét theo quý.'` (EN at `en.js:76` is fine.)
2. `en.js:116` — "Hometown: Long An, now Tây Ninh" reads to EN speakers like the person moved. It's the 2025 province merger. Suggest: `'Long An (recently merged into Tây Ninh — the province moved, not him)'` — keeps the wit, kills the confusion. VI readers get it; `vi.js:115` fine as-is.
3. `en.js:79` — h3 `'Selection notes'` is the only titled block without terminal punctuation while sibling h2s use periods ("What you receive.", "What we both protect."). Either add the period or accept h3s are label-style (home h3s also have none) — consistency either way; current mix is h2=period, h3=none except this reads fine. Truly minor; skip unless touching the file anyway.
4. `en.js:54` / `vi.js:53` — "Start date: When trust passes review" / "Khi niềm tin qua vòng xem xét": VI could echo code-review for the dev-persona: `'Khi niềm tin được approve qua vòng review'`. Optional flavor, not a defect.

## Contrast audit summary (measured)

| Pair                                    | Ratio   | Verdict                            |
| --------------------------------------- | ------- | ---------------------------------- |
| Light eyebrow `#1f6feb` / `#f7fbff`     | 4.46:1  | **FAIL AA (normal text)** → see M1 |
| Light `--primary-strong` / bg           | 6.84:1  | Pass                               |
| Light `--muted #4d6685` / bg            | 5.68:1  | Pass                               |
| Light white / `--primary` (buttons)     | 4.63:1  | Pass                               |
| Light `--focus #0b70ff` / bg (non-text) | 4.23:1  | Pass (3:1)                         |
| Dark `--primary #ff4fa3` / bg           | 6.69:1  | Pass                               |
| Dark `--primary` / panel                | 6.21:1  | Pass                               |
| Dark `--muted #d8b9cc` / bg             | 11.38:1 | Pass                               |
| Dark `#1d0611` / `--primary` (buttons)  | 6.35:1  | Pass                               |
| Dark `--primary-strong` / bg            | 8.55:1  | Pass                               |

## Responsive spot-check (code-level)

- `.section-grid` and `.meta-grid` collapse to 1 column at 720px (`content.css:110-115`); `.facts-list` at 620px (`cv/+page.svelte:91-95`) — the 620/720 split is intentional-looking and safe. No real breakage risk found.
- Header stacks to column ≤720px with full-width wrap (`layout.css:161-177`) — fine; sticky header height grows on mobile but content isn't obscured since it's flow-relative.
- `h1` mobile override `clamp(3rem, 18vw, 5rem)` at `base.css:159-163` keeps "Tiến Nguyễn Minh" from overflowing at 320px. OK.

## Suggested fix order

1. H1 heading/eyebrow copy fix (2-line change, both locale files)
2. M1 eyebrow color (1 CSS line)
3. H2 og/twitter meta (small, high share-value)
4. M2 `dl`/`role="group"` semantics
5. M3 heading line-height + VI screenshot check
6. M4 hero overlay verification
7. L-items opportunistically

## Unresolved questions

1. **Hero image luminance (M4):** could not render `dating-application-hero-background.webp` composited with overlays in this review — needs a browser screenshot in both themes to confirm or dismiss.
2. **"tà răm" (`vi.js:107,124`):** reads as a deliberate playful spelling (of "tà dâm"?). If intentional slang, keep; if a typo, worth confirming with the author — EN side says "naughty," which is milder than either reading.
3. **"Private note" feet fact (`en.js:125`, `vi.js:124`):** publicly indexed on GitHub Pages with the author's real name. Not a design defect and clearly a deliberate honesty choice — flagging only so the author confirms he's comfortable with search-engine permanence.

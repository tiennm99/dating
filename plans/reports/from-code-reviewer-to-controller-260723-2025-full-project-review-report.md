# Full Project Review — dating (JD/CV static site)

Reviewer: code-reviewer | Date: 2026-07-23 | Branch: main @ 546e8d5

## Scope

- All source: `src/lib/i18n/*`, `src/routes/*`, `src/app.html`, styles, `vite.config.js`, `jsconfig.json`, `eslint.config.js`, `package.json`, `.github/workflows/deploy-pages.yml`, docs.
- Verified empirically: `pnpm run check` → 0 errors/0 warnings (282 files); `pnpm run lint` → clean; `pnpm run build` → succeeds with adapter-static.
- Advisory only; no source files modified.

## Overall Assessment

Healthy for its size. The TS→JSDoc conversion is sound: `@type {SiteCopy}` on both locale files plus strict `checkJs` gives real structural enforcement, and `svelte-check` passes. No security, data-loss, or trust-boundary issues (no backend, no user input, all published data intentional). Findings below are config hygiene and maintainability drift risks, not correctness bugs.

## Critical Issues

None.

## High Priority

None.

## Medium Priority

### M1. `build:gh` script is broken on Windows (package.json:10)

`"build:gh": "BUILD_PROFILE=gh vite build"` uses POSIX inline-env syntax. pnpm runs scripts through cmd on Windows, where this fails — and this is a Windows dev machine. README.md:52 and docs/deployment.md:20 both advertise this command.
**Fix:** Either drop `build:gh` entirely (see M2) or make it portable, e.g. `"build:gh": "cross-env BUILD_PROFILE=gh vite build"` — or since `BASE_PATH` already works, `node`-free option: document `BASE_PATH=/dating pnpm run build` for Git Bash only and remove the script.

### M2. Two parallel base-path mechanisms: CI vs local script (deploy-pages.yml:41 vs vite.config.js:8)

The workflow builds with `BASE_PATH: /${{ github.event.repository.name }}` + `pnpm run build`; the repo also defines `BUILD_PROFILE=gh` → hardcoded `/dating`. Both currently resolve to `/dating`, but they are independent code paths that will drift (e.g. repo rename: CI follows automatically, `build:gh` and the hardcoded og:image URLs go stale silently, and `pnpm run build:gh` locally no longer reproduces what CI ships).
**Fix:** Pick one mechanism. Simplest: delete the `BUILD_PROFILE` branch from `resolveBase()` and the `build:gh` script, keep `BASE_PATH` as the single knob, and update README/docs to show `BASE_PATH=/dating pnpm run build`.

### M3. Lint is not enforced anywhere in CI (deploy-pages.yml:36-42)

The only workflow runs `check` and `build` but never `pnpm run lint`. Prettier/eslint are effectively honor-system; the deploy gate will happily ship unformatted or eslint-failing code.
**Fix:** Add `- name: Lint` / `run: pnpm run lint` after the Check step (or before it; it's fast).

## Low Priority

### L1. Inline theme script duplicates preference constants (src/app.html:11-14 vs src/lib/i18n/preferences.js:16-17, types.js:1-5)

The no-FOUC script is the right design (verified present — theme/lang/colorScheme are set pre-paint, so the "theme applied only after hydration" concern does not apply). But it hardcodes `'dating-theme'`, `'dating-locale'`, `'dark'`, `'vi'`, `'en'` separately from `types.js`/`preferences.js`. Renaming a key or adding a theme in one place silently breaks the other, and nothing will fail loudly — you just get FOUC back. Minor extra: the `catch` branch (app.html:20) sets `data-theme` but not `style.colorScheme`.
**Fix:** A cross-reference comment in both files ("keep in sync with src/app.html inline script" / "keep in sync with src/lib/i18n/preferences.js") is proportionate. Codegen would be overkill. Add `colorScheme` to the catch branch.

### L2. Locale content flash for en users (inherent to single-prerender i18n)

Pages are prerendered in vi; a returning en user gets correct `lang`/theme pre-paint (the inline script handles those) but sees vi copy until hydration swaps stores. For a 2-locale personal site this is acceptable and fixing it (per-locale prerender routes) is not worth the complexity. Documenting it here so it isn't rediscovered as a "bug."
**Fix:** None recommended. YAGNI.

### L3. Dead scaffold and unused assets

- `src/lib/index.js:1` — empty placeholder, nothing imports it. Delete.
- `static/assets/audio/*.mp3` (3 files), `static/assets/placeholders/dating-profile-placeholder.png` — zero references in `src/` (grep-verified), but everything under `static/` ships verbatim to GitHub Pages, so the mp3s inflate the deployed site for no benefit.
- `src/lib/assets/offer-letter-hero.png`, `src/lib/assets/generated/dating-application-hero-background.png` — unreferenced (only the `.webp` is imported); repo weight only, not build weight.
  **Fix:** Delete if these are not planned features (see Unresolved Questions — commit 4b2fc44 "add generated media set" suggests they may be staged for future use).

### L4. CV hero summary is positionally coupled to `facts` order (src/routes/cv/+page.svelte:15)

`$copy.cv.facts.slice(0, 3)` means reordering the facts array silently changes the hero. The JD page has an explicit `summary` field (types.js:52); the CV page derives it implicitly — inconsistent within the same typedef.
**Fix:** Either add an explicit `summary: CopyFact[]` to the `cv` block for symmetry, or accept the slice and add a one-line comment on the `facts` arrays in en.js/vi.js noting the first three feed the hero. Either is fine; pick one.

### L5. Hardcoded absolute og:image URLs (src/routes/+layout.svelte:44-46, 51-54)

`https://tiennm99.github.io/dating/...` is correct for the current deployment but bypasses the `BASE_PATH` machinery entirely. og:image genuinely must be absolute, so hardcoding is a legitimate choice — just note it as the third place (after M2's two) where the deployment URL lives.
**Fix:** Leave as-is; add to the M2 cleanup checklist if the base-path story is consolidated.

## Architecture Assessment (dimension 1)

- **i18n split earns its keep.** `types.js` (typedefs + option tuples, zero runtime deps) / `index.js` (pure data + guards, SSR-safe) / `preferences.js` (browser-only store lifecycle) is a real boundary, not ceremony: `index.js` is importable anywhere, `preferences.js` owns all DOM/localStorage effects behind `browser` guards. The `export { localeOptions, themeOptions }` re-export at preferences.js:19 is mild indirection but gives components a single import site — acceptable at this size.
- **Store subscription without unsubscribe (preferences.js:90-91) is not a leak.** `initializePreferences` is a module-level singleton guarded by `preferencesStarted`, called once from the root layout's `onMount`. Root layout lives for the page lifetime in an SPA; the two subscriptions are intentional app-lifetime side-effect sinks. No fix needed. (Side note, informational: because `subscribe` fires immediately, first visit writes the defaults to localStorage before the user has expressed any preference. Harmless.)
- **No svelte.config.js — SvelteKit config inlined in `sveltekit()` plugin options (vite.config.js:19-33).** Verified working: build, check, and eslint-plugin-svelte all pass. Nonstandard but supported; keep in mind some ecosystem tooling historically looks for `svelte.config.js` if editor integration ever misbehaves.
- **localStorage handling is correct:** try/catch on both read (preferences.js:50-56) and write (62-68), validated through `isLocale`/`isTheme` before use, `browser` guards for SSR/prerender. The `/** @type {Locale} */ (value)` cast inside `includes` (index.js:30, 38) is the standard workaround for readonly-tuple `includes` narrowing; fine.

## JSDoc / Type Soundness (dimension 2)

Sound. `@satisfies {Record<Locale, SiteCopy>}` on `messages` (index.js:19), `@type {SiteCopy}` on both locale objects, and type-guard return annotations (`@returns {value is Locale}`) are all correct idioms. The large inline `SiteCopy` typedef (types.js:16-82) is verbose but it is the single source of truth that makes en/vi drift a build failure rather than a runtime surprise — this is the right trade for a copy-heavy site. en.js/vi.js structural duplication is enforced-by-type, not accidental; no action.

## Verification Gaps (dimension 4)

**No tests are warranted, and that is the correct call.** The failure modes that matter are already covered by cheaper gates:

- Locale file structural drift → `svelte-check` strict `checkJs` (verified: catches missing/extra keys).
- Prerender/route breakage → `vite build` with `strict: true` adapter (in CI).
- The only uncovered behavior is theme/locale persistence + the app.html script (L1), and a Playwright harness for a 3-page personal site fails YAGNI hard. Revisit only if a persistence regression actually ships twice.

The real gap is M3 (lint not in CI), not missing tests.

## Recommended Actions (priority order)

1. Consolidate base-path handling to `BASE_PATH` only; remove `BUILD_PROFILE` branch and `build:gh`, update README + docs/deployment.md (M1+M2 together).
2. Add `pnpm run lint` step to deploy-pages.yml (M3).
3. Add keep-in-sync comments between app.html inline script and preferences.js; set colorScheme in the catch branch (L1).
4. Delete `src/lib/index.js` and unused assets after confirming intent (L3).
5. Optionally resolve the cv summary coupling (L4).

## Metrics

- svelte-check: 0 errors / 0 warnings (282 files)
- prettier + eslint: clean
- build (local, BASE_PATH empty): succeeds
- Tests: none (intentionally; see Verification Gaps)

## Unresolved Questions

1. Are `static/assets/audio/*.mp3`, the placeholder PNG, and `offer-letter-hero.png` staged for a planned feature (commit 4b2fc44 "add generated media set"), or leftovers safe to delete?
2. Is the repo name `/dating` considered stable? If yes, M2's drift risk is theoretical and consolidation is purely hygiene; if a rename or custom domain is plausible, prioritize it.

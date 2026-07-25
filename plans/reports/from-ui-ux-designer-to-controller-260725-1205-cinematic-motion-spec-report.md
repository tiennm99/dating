# Cinematic motion spec — "the desk"

Design + spec only. **No project files modified.** Verified in real Chromium via `agent-browser` against `python -m http.server` (port 8000 = repo as-is, port 8001 = a **scratchpad copy** with the `min-width: 768px` gate patched out, so the film tier could be measured at 390×844 without touching the repo). Items I could not reproduce in a browser are marked **[code-read]** or **[unverified]**.

Folds in the two constraint changes received mid-task: **film enabled on phones including pins + scrub**, and **"cinematic but motivated" only**.

---

## 1. Direction

The hero photograph is already doing the work nobody noticed: it is **a letter lying on a blue-grey desk, next to an opened envelope, a pen, a coffee and a sprig of eucalyptus**. That is the whole visual thesis of a "thư ngỏ" and it is already on screen in the first frame. So the through-line is simply: *the reader is sitting at the desk where this letter was written, and the page is that letter, page by page.*

Two motion vocabularies, nothing else. **Camera:** push in, drift, find focus, dim the room, settle. **Material:** a sheet is set down, a pen mark is pressed, a margin rule is drawn top-to-bottom, a photograph is lifted off the table toward you, a seal is stamped at the end. Every beat below is one of those two things and nothing is allowed in that cannot be named as one of them. The scenes escalate physically and then de-escalate: cold open (camera only) → the protagonist is picked up (the one big material gesture) → the honest admissions are found by focus, not travel → the vow is the stillest thing on the page → the last frame is a stamp. The page ends more still than it began; that is what makes it read as sincere rather than as a showreel.

The current motion is not too little, it is too *uniform* — 35 beats all doing `opacity 0→1, y 40→0`. Most of what follows costs a per-scene recipe object, not new machinery.

---

## 2. What is verified about the current build

| Claim | Method | Result |
|---|---|---|
| Film tier runs at 390×844 once the gate is removed | scratchpad copy on :8001, viewport 390×844 | `html.js-ready film-ready lenis`, `storyEngine=film`, 36 ScrollTriggers, 2 pins |
| Pins work on a 390px viewport | `ScrollTrigger.getAll().filter(t=>t.pin)` | `#home` 0→499, `#closing` 6153→6659 |
| Film costs scroll length on phone | `documentElement.scrollHeight` at 390×844 | reveal tier **8149px** → film tier **10282px** (**+26%**, ~12 viewport heights) |
| No horizontal overflow in film tier at 390 | `scrollWidth` | 390 (clean) |
| GSAP 3.15.0 free plugins exist on jsDelivr | `fetch()` in-page | Flip 200 / 24.9KB · MotionPathPlugin 200 / 21.5KB · SplitText 200 / 7.6KB · Observer 200 / 9.8KB · CustomEase 200 / 7.0KB (minified, pre-gzip) |
| `overflow: clip visible` on `<main>` does not break pinning | applied inline, `ScrollTrigger.refresh()` | computes `clip/visible`, both pins survive with identical start/end |
| The "photo lifted off the desk" set-piece renders | inline transform + screenshot at 390px | reads correctly; **zero layout shift, zero overflow** (see §4) |
| **GSAP permanently kills `.panel:hover`** | inline style probe after reveal | `.panel` retains `style="transform: translate(0px, 0px)"` forever → the `translateY(-3px)` hover lift is dead in the film tier today. Pre-existing; my spec makes it worse unless fixed (§6, item 0) |

Not verified, and I am not going to assert it: real touch-scroll scrub smoothness, iOS pin jitter with the address bar, `svh` behaviour, and anything about mid-range Android frame rate. Headless desktop Chromium cannot tell you those.

---

## 3. Shared scaffolding

Everything below assumes these three additions, made **once**, inside the existing `try {}` in `assets/story-film.js`, and **after** the two pin blocks (invariant 3).

### 3a. Environment constants (top of the `try`, before the pins)

```js
// Motion is now enabled on phones, so the recipes below need to know which
// device they are on: touch scroll delivers scroll events in bursts during
// momentum, so scrubs need a numeric (lerped) value or they look steppy, and
// the two most expensive techniques are switched off below 768px.
const isPhone = window.matchMedia('(max-width: 767px)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;
// A numeric scrub interpolates between scroll events instead of snapping to
// them — the difference between "tracks the thumb" and "catches up in jumps".
const SCRUB = isTouch ? 0.6 : 0.5;
// Pins cost 26% extra page length on a phone (measured). Shorten them there.
const PIN_END = isPhone ? '+=45%' : '+=60%';
```

### 3b. Per-scene entrance recipes (replaces `DEFAULT_TIMING` / `SCENE_TIMING`)

```js
// One recipe per scene. `from` is the pre-hide state, everything else is the
// landing. Scenes absent from the map use DEFAULT_ENTRANCE.
//
// Physical vocabulary, deliberately narrow:
//   y            — the sheet drops the last few millimetres onto the desk
//   x            — the sheet is slid in from the side
//   rotation     — the sheet lands very slightly off-square (<= 0.6deg)
//   blur         — the camera finds focus (desktop only; see §5)
// No scene combines more than two of them.
const DEFAULT_ENTRANCE = { start: 'top 86%', y: 40, duration: 0.8, stagger: 0.12, ease: 'expo.out' };
const ENTRANCE = {
  // Cold open: the copy is set down on the frame, barely off-square.
  home: { start: 'top 92%', y: 30, rotation: -0.5, duration: 0.95, stagger: 0.14, ease: 'expo.out' },
  // Notes slid onto the desk beside the photograph.
  applicant: { start: 'top 84%', y: 26, x: 18, rotation: -0.4, duration: 0.9, stagger: 0.15, ease: 'expo.out' },
  // The strongest copy on the page: almost no travel, the camera racks focus
  // onto each admission instead. Slowest cascade here — restraint as emphasis.
  honest: { start: 'top 82%', y: 14, blur: 5, duration: 1.45, stagger: 0.3, ease: 'power2.out' },
  offer: { start: 'top 86%', y: 34, duration: 0.85, stagger: 0.14, ease: 'expo.out' },
  // The vow. The stillest scene on the page: pure dissolve, zero travel.
  // The only movement is the margin rule drawing itself down (§4 · #shared).
  shared: { start: 'top 84%', y: 0, duration: 1.3, stagger: 0.4, ease: 'power2.out' },
  // The climax. Nothing moves quickly here; the page has already stopped.
  'no-test': { start: 'top 84%', y: 18, duration: 1.35, stagger: 0.42, ease: 'power2.out' },
  dossier: { start: 'top 88%', y: 34, duration: 0.8, stagger: 0.1, ease: 'expo.out' },
  // Last frame. Longest landing on the page.
  end: { start: 'top 82%', y: 24, duration: 1.4, stagger: 0.3, ease: 'power2.out' },
};

// #honest's blur is the one technique likely to cost frames on a mid-range
// Android: animating filter re-rasterizes the layer every frame. On phones the
// focus pull becomes a scale settle, which is compositor-only.
if (isPhone) {
  delete ENTRANCE.honest.blur;
  ENTRANCE.honest.scale = 1.015;
  ENTRANCE.honest.duration = 1.2;
  // Horizontal travel is dropped on phones as well: the site shell has only a
  // 16px gutter at 390px, so an 18px slide has nowhere to come from.
  delete ENTRANCE.applicant.x;
}
```

### 3c. The batch loop (drop-in replacement for section 2 of `story-film.js`)

```js
gsap.utils.toArray('[data-scene]').forEach((scene) => {
  if (PIN_CHOREOGRAPHED.has(scene.id)) return;

  const beats = scene.querySelectorAll(REVEAL);
  if (!beats.length) return;

  const r = ENTRANCE[scene.id] || DEFAULT_ENTRANCE;

  const from = { opacity: 0, y: r.y ?? 40 };
  if (r.x) from.x = r.x;
  if (r.rotation) from.rotation = r.rotation;
  if (r.scale) from.scale = r.scale;
  if (r.blur) from.filter = 'blur(' + r.blur + 'px)';
  gsap.set(beats, from);

  const to = {
    opacity: 1,
    y: 0,
    ease: r.ease,
    duration: r.duration,
    stagger: r.stagger,
  };
  if (r.x) to.x = 0;
  if (r.rotation) to.rotation = 0;
  if (r.scale) to.scale = 1;
  if (r.blur) to.filter = 'blur(0px)';

  ScrollTrigger.batch(beats, {
    start: r.start,
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        ...to,
        // Promote only for the life of the tween; a blanket will-change on 35
        // beats holds compositor layers for the whole session.
        onStart: () =>
          batch.forEach((el) => {
            el.style.willChange = r.blur ? 'opacity, transform, filter' : 'opacity, transform';
          }),
        onComplete: () =>
          batch.forEach((el) => {
            el.style.willChange = '';
            // Hand the element back to CSS so :hover transforms work again
            // (see §6 item 0 — without this, GSAP's residual inline
            // `transform: translate(0px,0px)` outranks .panel:hover forever).
            el.classList.add('beat-in');
            el.style.opacity = '';
            el.style.transform = '';
            el.style.filter = '';
          }),
      });
    },
  });
});
```

Paired CSS change in `assets/story-film.css` — the pre-hide must stop applying once a beat has landed, otherwise clearing the inline styles re-hides it:

```css
/* Was: html.film-ready [data-scene] [data-reveal] { ... } */
html.film-ready [data-scene] [data-reveal]:not(.beat-in) {
	opacity: 0;
	transform: translateY(40px);
}

@media (prefers-reduced-motion: reduce) {
	html.film-ready [data-scene] [data-reveal]:not(.beat-in) {
		opacity: 1;
		transform: none;
	}
}
```

`failOpen()` stays verbatim — inline styles still beat both stylesheets.

### 3d. Horizontal-travel guard (`assets/story-film.css`)

```css
/* Any beat that slides in from the side momentarily sits outside the 16px
   gutter. `clip` on the x axis only contains that without creating a scroll
   container, so ScrollTrigger's pinning is untouched — verified: computes
   `clip/visible`, both pins survive a refresh with identical start/end. */
html.film-ready main {
	overflow: clip visible;
}
```

### 3e. Custom-property contract

Every new custom property **defaults to its finished value**, so the IO-reveal tier, the static tier and reduced-motion get the completed look for free with no extra CSS:

| Property | Default | Consumed by |
|---|---|---|
| `--hero-pan` | `0%` | `.home-hero::before` |
| `--slate-rule` | `1` | `.chapter-tag::before` |
| `--gift-mark` | `1` | `.gift-list li::before` |
| `--vow-rule` | `1` | `.vow-list li::before` (film-scoped) |
| `--room-dim` | `0` | `body::before` (film-scoped) |

---

## 4. Per-scene motion spec

### `#home` — cold open · camera drifts across the desk

**Beat.** "Chỗ bên cạnh đã trống hơi lâu." The frame should feel like a held shot in a quiet room, not a stuck page.

**Technique.** The existing push-in (`--hero-scale` 1→1.07) gains a **lateral drift** — the camera creeps toward the envelope on the right-hand side of the photograph while it pushes in. Two axes of a single slow move; it is the difference between a zoom and a shot. Separately, the film-slate rule on `.chapter-tag` **draws out from the margin** as the copy lands.

**Code** — replaces the `heroPush` block:

```js
if (hero) {
	const heroPush = gsap.timeline({
		scrollTrigger: {
			trigger: hero,
			start: 'top top',
			end: PIN_END,
			pin: true,
			pinSpacing: true,
			scrub: SCRUB,
			refreshPriority: 1,
			invalidateOnRefresh: true,
		},
	});
	heroPush
		.fromTo(hero, { '--hero-scale': 1 }, { '--hero-scale': 1.07, ease: 'none' }, 0)
		// Pan magnitude must stay below the scale overhang (3.5% per side at
		// 1.07) or the frame edge shows. 2% is safe at every viewport width.
		.fromTo(hero, { '--hero-pan': '0%' }, { '--hero-pan': '-2%', ease: 'none' }, 0);
	if (heroCopy) {
		heroPush.to(heroCopy, { y: -48, opacity: 0.12, ease: 'power1.in' }, 0);
	}
}
```

**CSS** (`assets/styles.css`, one line changed):

```css
.home-hero::before {
	/* was: transform: scale(var(--hero-scale, 1)); */
	transform: translateX(var(--hero-pan, 0%)) scale(var(--hero-scale, 1));
}
```

**CSS** (`assets/story-film.css`, new):

```css
/* Film slate. The leading rule draws out from the margin instead of appearing
   whole. scaleX, not width — no layout, no reflow. Defaults to 1 so the other
   two tiers render the finished rule. */
html.film-ready .chapter-tag::before {
	transform: scaleX(var(--slate-rule, 1));
	transform-origin: left center;
}
```

**JS** (page-wide, after the pins):

```js
const slates = gsap.utils.toArray('.chapter-tag');
if (slates.length) {
	gsap.set(slates, { '--slate-rule': 0 });
	ScrollTrigger.batch(slates, {
		start: 'top 90%',
		once: true,
		onEnter: (b) => gsap.to(b, { '--slate-rule': 1, duration: 0.7, ease: 'power2.out', stagger: 0.06 }),
	});
}
```

**Reduced motion.** Film never activates → `--hero-pan: 0%`, `--slate-rule: 1`. Still frame, complete rule.
**Mobile.** Full technique survives. Pin shortened to `+=45%` (≈380px at 844 height). The pan is a percentage of the element so it scales down with the viewport automatically.
**Effort** S. **Risk** low — one CSS line, one tween, no new markup, no invariant touched.

---

### `#applicant` — **the hero moment** · the photograph is lifted off the desk

Specced in full in §5.

Supporting beats in the same scene: the three `.panel` notes are **slid in from the right and set down slightly off-square** (`x: 18, y: 26, rotation: -0.4`, from `ENTRANCE.applicant`). Nothing else. The panels must not compete with the photograph.

**Reduced motion / static.** Panels appear in place, portrait upright.
**Mobile.** `x` is dropped (§3b) — 390px leaves a 16px gutter, there is nowhere to slide from. Panels get `y + rotation` only.
**Effort** S for the panels (recipe entry only). **Risk** low, given the §3d clip guard.

---

### `#honest` — the camera racks focus

**Beat.** Three admissions, one of them genuinely un-flattering. This is where the page earns its brief and the reader should be *slowed*, not entertained.

**Technique.** Almost no travel (14px). Each panel arrives **out of focus and resolves** — `blur(5px) → blur(0)` over 1.45s with a 0.3s stagger, the longest cascade on the page. A focus pull is the least showy camera move there is and it says "look at this one thing" without moving anything.

**Code.** Entirely covered by `ENTRANCE.honest` (§3b) + the batch loop (§3c). No new markup, no new CSS.

**Reduced motion.** Film off; the IO tier's existing 900ms fade applies.
**Mobile.** **Degraded on purpose.** `filter` animation is the one technique here that is not compositor-only — the layer re-rasterizes every frame. On phones the recipe swaps to `scale: 1.015 → 1` over 1.2s, which suggests the same "settling into focus" gesture at zero raster cost. **[unverified]** on real hardware — flag for your Android check.
**Effort** S. **Risk** low functionally; **medium on performance for desktop low-end GPUs** (3 panels blurring simultaneously). `will-change: filter` is set only for the tween's life.

---

### `#offer` — the pen touches the paper before the words

**Beat.** "Điều mình có thể trao đi." Four unhurried promises.

**Technique.** The small rose circle beside each line is a pen mark. It is **pressed onto the page first**, and the line follows. Two-stage, ~100ms apart — barely conscious, but it is the difference between text appearing and text being *written down*.

**CSS** (`assets/story-film.css`):

```css
/* The gift-list mark is a pen dot pressed onto the page. scale() on an
   absolutely-positioned pseudo-element: no layout, no horizontal bleed
   (it is inset at left: 0, never negative). Defaults to 1 for other tiers. */
html.film-ready .gift-list li::before {
	transform: scale(var(--gift-mark, 1));
}
```

**JS** (after the pins):

```js
const marks = gsap.utils.toArray('#offer .gift-list li');
if (marks.length) {
	gsap.set(marks, { '--gift-mark': 0 });
	ScrollTrigger.batch(marks, {
		start: 'top 88%',
		once: true,
		onEnter: (b) =>
			gsap.to(b, { '--gift-mark': 1, duration: 0.45, stagger: 0.14, ease: 'back.out(2.2)' }),
	});
}
```

**Reduced motion / static.** `--gift-mark: 1`, rule is film-scoped. Unchanged.
**Mobile.** Survives intact — four 8px pseudo-elements, no measurable cost.
**Effort** S. **Risk** very low.

---

### `#shared` — the vow · a margin rule drawn down the page

**Beat.** Four pledges as large serif lines. This must be the **stillest** scene on the page. If it moves, it stops being a vow.

**Technique.** Zero travel: pure dissolve, 1.3s, 0.4s stagger (from `ENTRANCE.shared`). The only motion is the hairline in the left margin **drawing itself downward** just ahead of each line — a pen stroke down the margin of a letter. Slow, singular, unmistakably material.

**CSS** (`assets/story-film.css`):

```css
/* Film tier only: hand the margin rule to a pseudo-element so it can be drawn
   with scaleY. styles.css keeps the real border-left for the other two tiers.
   Positioned at left: 0 of the padding box — 2px right of where the border
   sits, which is imperceptible and, unlike a negative inset, cannot widen the
   page (the #closing::after lesson). */
html.film-ready .vow-list li {
	position: relative;
	border-left-color: transparent;
}

html.film-ready .vow-list li::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 2px;
	background: var(--line);
	transform: scaleY(var(--vow-rule, 1));
	transform-origin: top center;
}
```

**JS** (after the pins):

```js
const vows = gsap.utils.toArray('#shared .vow-list li');
if (vows.length) {
	gsap.set(vows, { '--vow-rule': 0 });
	ScrollTrigger.batch(vows, {
		start: 'top 85%',
		once: true,
		onEnter: (b) =>
			gsap.to(b, { '--vow-rule': 1, duration: 0.95, stagger: 0.4, ease: 'power2.inOut' }),
	});
}
```

**Reduced motion / static.** Film-scoped rules never apply; the original `border-left` renders as today.
**Mobile.** Survives intact. Four 2px bars.
**Effort** S. **Risk** low. One thing to check at 320px: `.vow-list li` gains `position: relative`, which is inert here.

---

### `#no-test` — the climax · the camera stops

**Beat.** "Không có bài kiểm tra nào cả." The written peak of the page, deliberately the quietest block in the layout.

**Technique.** Nothing arrives quickly. The playful zodiac panel lands normally; the `.panel.quiet` climax lands **one sentence at a time**, 0.42s apart, 1.35s each — the slowest thing on the page. The reader is physically stopped. No vignette, no scale, no travel beyond 18px.

**Markup** (`index.html`, structural only — **Vietnamese copy is byte-identical**, only the wrapper elements and the placement of `data-reveal` change):

```html
<article class="panel quiet">
	<h3 data-reveal>Thật lòng mà nói</h3>
	<p>
		<span data-reveal>Không có bài kiểm tra nào cả.</span>
		<span data-reveal>Không có vòng loại nào hết.</span>
		<span data-reveal
			>Người mình mong gặp là người vẫn tử tế khi mệt, nói thẳng khi rối, và sẵn sàng chọn
			nhau trong những khoảnh khắc nhỏ rất đời thường.</span
		>
	</p>
</article>
```

`data-reveal` moves **off** the `<article>` onto the `<h3>` and the three spans, so no reveal is nested inside another reveal.

**CSS** (`assets/styles.css`):

```css
/* Three statements, not one paragraph. transform does not apply to inline
   boxes, so each sentence needs its own block — which is also the better
   typography here: three short centred statements at 46ch read as spoken
   lines rather than as prose. */
.panel.quiet p span {
	display: block;
}

.panel.quiet p span + span {
	margin-top: 0.85rem;
}
```

**Code.** Covered by `ENTRANCE['no-test']` + the batch loop.

**Reduced motion / static.** The three spans are still blocks (intentional in all tiers) and reveal via `story.js` exactly like any other beat.
**Mobile.** Survives intact. At 390px the three statements stack naturally.
**Effort** M — the only markup change in the spec, and it changes typography. **Decline-able**: if you would rather not restructure the paragraph, keep `data-reveal` on the `<article>` and the slow recipe still gives you the calmest arrival on the page, just as one block.
**Risk** low. Verify the three-block version at 320px and that the sentence split does not orphan a line.

---

### `#closing` — the room dims

**Beat.** "Kết nối để tìm hiểu thêm nhé." The last spoken beat, and the page's only conversion door.

**Technique.** The pin keeps its warm vignette (`--closing-settle`) and gains a second, purely decorative job: **the grain-and-vignette overlay deepens across the hold**, so the room quietly darkens around the last words. A lighting change, not a movement. Content opacity is never touched — that is what put the CTAs at opacity 0 last time.

Separately the panel arrives as **a sheet set down**: the longest, softest landing on the page.

**Code** — extends the existing closing block:

```js
if (closing) {
	const softBeats = closing.querySelectorAll(REVEAL);
	gsap.set(softBeats, { opacity: 0, y: 34, rotation: 0.5 });

	gsap
		.timeline({
			scrollTrigger: {
				trigger: closing,
				start: 'top top',
				end: PIN_END,
				pin: true,
				pinSpacing: true,
				scrub: 1.2,
				refreshPriority: 1,
				invalidateOnRefresh: true,
			},
		})
		.fromTo(closing, { '--closing-settle': 0 }, { '--closing-settle': 1, ease: 'none' }, 0)
		// The lights go down on the last line. Decorative only: this drives the
		// opacity of the fixed grain/vignette overlay, never any content.
		.fromTo(root, { '--room-dim': 0 }, { '--room-dim': 1, ease: 'none' }, 0);

	// Content reveal stays separate and non-reversing.
	ScrollTrigger.create({
		trigger: closing,
		start: 'top 80%',
		once: true,
		onEnter: () => {
			gsap.to(softBeats, {
				opacity: 1,
				y: 0,
				rotation: 0,
				ease: 'power2.out',
				duration: 1.4,
				stagger: 0.3,
				onStart: () => softBeats.forEach((el) => (el.style.willChange = 'opacity, transform')),
				onComplete: () =>
					softBeats.forEach((el) => {
						el.style.willChange = '';
						el.classList.add('beat-in');
						el.style.opacity = '';
						el.style.transform = '';
					}),
			});
		},
	});
}
```

**CSS** (`assets/story-film.css`):

```css
/* The grain/vignette layer already exists (styles.css body::before, opacity .1).
   During the closing hold it deepens by a maximum of 0.14, which darkens only
   the frame edges — the gradient is `transparent 58%` through the middle, so
   body text contrast is unaffected. Defaults to 0 in the other tiers. */
html.film-ready body::before {
	opacity: calc(0.1 + var(--room-dim, 0) * 0.14);
}
```

**Reduced motion / static.** `--room-dim: 0`, rule is film-scoped. Overlay stays at 0.1 exactly as today.
**Mobile.** Survives; pin shortened to `+=45%`. `body::before` is an already-existing fixed composited layer, so changing its opacity is a compositor-only operation.
**Effort** S. **Risk** low, with one thing to measure: **re-check AA contrast at `--room-dim: 1` in both themes** before shipping. If light theme loses margin, drop the coefficient to 0.10.

---

### `#dossier` — the credits roll

**Beat.** 18 rows of specifics after the emotional landing. It should feel like credits scrolling past, not a spreadsheet.

**Technique.** The whole `.facts-list` **lags the scroll very slightly** — a ±36px parallax over the full 1291px (desktop) / 1936px (mobile, measured) of the scene. Imperceptible frame to frame, but the block reads as passing the camera rather than sitting on a page. Transform only; opacity untouched, so it is a legitimate decorative scrub.

```js
const facts = document.querySelector('#dossier .facts-list');
if (facts) {
	// A slow lag against the scroll — the block passes the camera. Travel is
	// halved on phones: .facts-list is a 1936px composited layer at 390px and
	// re-compositing it every frame is the second most likely place to drop
	// frames on a mid-range Android (after #honest's blur, which is already off).
	const travel = isPhone ? 14 : 36;
	gsap.fromTo(
		facts,
		{ y: travel },
		{
			y: -travel,
			ease: 'none',
			scrollTrigger: {
				trigger: '#dossier',
				start: 'top bottom',
				end: 'bottom top',
				scrub: SCRUB,
				invalidateOnRefresh: true,
				onToggle: (self) => {
					facts.style.willChange = self.isActive ? 'transform' : '';
				},
			},
		},
	);
}
```

**Reduced motion / static.** Film off; the list sits where CSS puts it.
**Mobile.** Kept, at reduced travel. **This is the one I would cut first** if your Android check shows jank — it is the least load-bearing effect in the spec.
**Effort** S. **Risk** low functionally, **medium on mobile performance**.

---

### `#end` — the seal is pressed

**Beat.** "Hết." The last frame.

**Technique.** The `TN` seal is **stamped** onto the page — it comes in oversized and tilted and settles square, with a single overshoot. One gesture, 0.85s, then the page is over. It is decorative (`aria-hidden`), so it carries no accessibility risk, and a wax seal closing a letter is the most on-brief gesture available.

```js
const seal = document.querySelector('.end-card__seal');
if (seal) {
	// Decorative and aria-hidden, so it sits outside the [data-reveal] contract.
	// failOpen() is extended below so a build error can never leave it hidden.
	gsap.set(seal, { opacity: 0, scale: 1.5, rotation: -12, transformOrigin: '50% 50%' });
	ScrollTrigger.create({
		trigger: '#end',
		start: 'top 78%',
		once: true,
		onEnter: () =>
			gsap.to(seal, {
				opacity: 0.9, // matches .end-card__seal in styles.css
				scale: 1,
				rotation: 0,
				duration: 0.85,
				ease: 'back.out(1.5)',
				onComplete: () => {
					seal.style.opacity = '';
					seal.style.transform = '';
				},
			}),
	});
}
```

**`failOpen()` gains two lines** so the seal is covered by the same guarantee as the beats:

```js
const failOpen = () => {
	document.querySelectorAll(REVEAL).forEach((el) => {
		el.style.opacity = '1';
		el.style.transform = 'none';
	});
	// The end-card seal is animated outside the [data-reveal] contract.
	document.querySelectorAll('.end-card__seal').forEach((el) => {
		el.style.opacity = '';
		el.style.transform = '';
	});
};
```

**Reduced motion / static.** Never touched; renders at `opacity: .9` from CSS.
**Mobile.** Survives intact — one 48px element.
**Effort** S. **Risk** low.

---

## 5. The hero moment — `#applicant`: the photograph is lifted off the desk

**Why this scene.** Three reasons, in order. (1) **Reach** — it is scene 2; anyone who scrolls at all reaches it, and it is precisely the moment she is deciding whether this person is interesting. (2) **It is the protagonist reveal.** The set-piece should serve the single most important thing on the page, and that is his face. (3) **It is the only place on this page where a "turn" is honest.** The owner asked for things that "flip around"; the sincere version of that is not a card spinning, it is *picking up a photograph from a table to look at it*. The hero photo has already established that table.

**The gesture.** The portrait starts lying almost flat on the desk — foreshortened, small, sitting under a tight contact shadow, its near edge on the surface. As she scrolls, it **hinges up on its bottom edge toward her**, growing and taking a real drop shadow, until it faces the reader square. Then it stays up. She controls the rise with her thumb.

**Why it is not a card flip.** It rotates about a *horizontal hinge along its own bottom edge* (`transform-origin: 50% 100%`), through **68° and not 180°**, so it never turns past the plane and there is **no back face, no `backface-visibility`, no two-sided markup**. That mechanical restriction is what makes it read as an object obeying gravity rather than as a transition effect.

**Verified.** Applied inline at 390×844 and screenshotted: it reads correctly as a photo lying at a grazing angle, **zero layout shift** (the `<figure>` box is unchanged, the flattened image simply sits at the bottom of its reserved 4/5 box), and **zero horizontal overflow** (`scrollWidth` stays 390). The empty space above the flattened photo is exactly the space it rises into, which is what sells it.

**Code** — placed after the pins, before or alongside the batch loop:

```js
/* ---------- Scene 2 set-piece: the photograph is picked up ----------
   The portrait starts lying on the desk (hinged on its own bottom edge,
   68deg, never past the plane, so there is no back face) and rises to
   face the reader as she scrolls. This is the one place on the page where
   a turn is physically motivated: the hero frame establishes a desk, and
   this is a photograph on it.

   The scrub is intentional — she controls the rise with her thumb, which
   is the difference between watching an animation and handling an object.
   It is safe against the non-reversing invariant because it drives
   TRANSFORM ONLY: the portrait is foreshortened at 68deg but never
   invisible, contains nothing focusable, and its accessible name (the
   placeholder's aria-label, or the img alt once the real photo lands) is
   unaffected by any transform.

   Once it is fully up, the trigger kills itself so the face never lies
   back down if she scrolls up to re-read scene 1. Picked up once, like
   the reveal-once contract every other beat honours. */
const portrait = document.querySelector('#applicant .portrait');
if (portrait) {
	gsap.set(portrait, {
		transformOrigin: '50% 100%',
		transformPerspective: 900,
		rotationX: 68,
		scale: 0.94,
		y: 8,
		force3D: true,
	});

	const lift = gsap.to(portrait, {
		rotationX: 0,
		scale: 1,
		y: 0,
		ease: 'none',
		scrollTrigger: {
			trigger: '#applicant',
			start: 'top 80%',
			end: 'top 28%',
			scrub: SCRUB,
			invalidateOnRefresh: true,
			onToggle: (self) => {
				portrait.style.willChange = self.isActive ? 'transform' : '';
			},
			onLeave: (self) => {
				// Lock it upright. kill(false) leaves the inline transform where
				// it is, so set the resting state explicitly first.
				gsap.set(portrait, { rotationX: 0, scale: 1, y: 0 });
				portrait.style.willChange = '';
				self.kill(false);
			},
		},
	});
	void lift;
}
```

**CSS** — none required. The whole set-piece is inline transforms on one element. (Optional polish, film-scoped: a contact shadow that opens as it rises. Skip it in v1; the geometry already reads.)

**Reduced-motion fallback.** The film never activates, so `gsap.set` never runs and the portrait renders upright exactly as it does today. Nothing to add.

**Mobile.** **Survives fully and is arguably better on a phone** — the rise is thumb-driven, which is the whole point. At 390px the portrait is full-width in a single-column grid, so the gesture is larger and more legible than on desktop. Two mobile notes: the `end: 'top 28%'` window is ~440px of scroll at 844 height, which is one comfortable swipe; and `scrub: 0.6` on touch is load-bearing here — with `scrub: true` the rise will step during momentum flicks instead of tracking. **[unverified on real hardware]**

**Frame cost.** Negligible: one small element, `transform` only, `will-change` held only while the trigger is active. This is the cheapest thing in the spec and the most memorable.

**Effort** M. **Risk** low-medium. Two things to check: (a) `self.kill(false)` inside `onLeave` — confirm no console warning and that the portrait stays upright after a full down-and-back-up pass; (b) once the real `assets/tien.jpg` lands, re-check that a photograph (rather than a flat placeholder) still looks right at 68° — a face at a grazing angle can look odd, and the answer may be to reduce the start angle to ~58°.

**One dependency worth stating plainly.** This set-piece currently lifts a grey silhouette captioned "Ảnh thật cập nhật sau". It works, but the *memorable* version needs the real photo. This is the strongest possible argument for getting `assets/tien.jpg` from the owner: the page's single best moment is built on it.

---

## 6. Mobile — 390px, film on, pins on, scrub on

Measured, not assumed: with the gate removed, the film tier runs at 390×844 with both pins intact, no horizontal overflow, and **the page grows from 8149px to 10282px — +26%, about twelve viewport heights.** That is the headline cost of this decision and it is worth naming before anything else.

**Item 0 — fix this first, it is not optional.** GSAP leaves `transform: translate(0px, 0px)` inline on every beat forever (verified), which permanently outranks `.panel:hover { transform: translateY(-3px) }`. Irrelevant on touch, but my recipes bake `rotate()` and `translateX()` into that residue too. The `.beat-in` class handoff in §3c fixes it for both tiers at once.

**Survives touch scrolling unchanged**

- `#home` push-in + pan (pin, scrub) — pan is a percentage, scales with viewport.
- `#applicant` portrait lift (scrub) — better on a phone than on desktop.
- `#offer` pen marks, `#shared` margin rule, `#end` seal — one-shot, tiny, `once: true`.
- `#closing` vignette + room dim — compositor-only opacity on layers that already exist.
- All entrance recipes minus the two exceptions below.

**Must degrade**

| Technique | Phone behaviour | Why |
|---|---|---|
| `#honest` focus pull (`filter: blur`) | replaced by `scale: 1.015 → 1` | `filter` re-rasterizes the layer every frame; three panels at once is the single most likely dropped-frame source in this spec |
| `#applicant` panel `x: 18` slide | dropped, `y + rotation` only | 16px gutter at 390px — nowhere to slide from, and it is the one technique that could widen the page |
| `#dossier` credits roll | ±36px → ±14px | a 1936px composited layer at 390px; cut this entirely if Android jank shows |
| Both pins | `+=60%` → `+=45%` | 506px of pinned scroll per pin is a lot of thumb on an already 26%-longer page |
| Scrub value | `true`/`0.5` → `0.6` numeric | touch delivers scroll events in bursts during momentum; a numeric scrub lerps across the gaps so nothing looks steppy |

**Phone-first version of the direction.** Identical, and that is the point — every technique here is either a camera property (scale, pan, focus, light level) or a single-element transform. None of it depends on hover, a cursor, a wide viewport, or a two-column layout. On a phone the film is actually *stronger*: the portrait lift becomes a full-width, thumb-driven gesture rather than a 256px detail in a side column.

**Two changes I would make specifically because the film now runs on phones**

```css
/* 100vh on mobile is the *largest* viewport height, so every scene is taller
   than the visible area while the address bar is showing, and the page
   re-lays-out when the bar hides — which forces a ScrollTrigger refresh and can
   jump a pin mid-scroll. svh is the stable small-viewport unit. */
html.film-ready .film-scene {
	min-height: 100vh;
	min-height: 100svh;
}
```

and, in `story-film.js`, debounce the refresh that orientation/URL-bar resize triggers:

```js
// A phone fires resize when the address bar hides. Refreshing on every one of
// those re-measures two pins and 40+ triggers mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true });
```

**Flagged for your mid-range Android verification pass**, in descending order of expected cost:

1. `#honest` blur — **already disabled on phones** in this spec; verify the scale fallback is enough.
2. `#dossier` credits roll on a 1936px layer.
3. Two `position: fixed` pins coexisting with `body::before` (fixed full-viewport SVG-noise overlay) and `body::after` (fixed 26s infinite bloom drift) — both pre-existing, both now competing with pinning on the weakest tier.
4. `--hero-scale` on `.home-hero::before`, a full-viewport background-image layer at scale 1.07 across the whole pin.
5. Lenis `syncTouch` — **[unverified]**. Lenis 1.x leaves touch scrolling native by default. If scrubs look steppy on real hardware, the choice is `syncTouch: true` (smooths touch, feels heavy on some devices and is the more invasive change) versus raising the scrub number further. Try the scrub number first.
6. iOS pin behaviour with `pinType` — **[code-read]**. Lenis scrolls the window natively, so ScrollTrigger's default `pinType: 'fixed'` should be correct; confirm on a real iPhone rather than in DevTools device mode.

---

## 7. What to reject

Considered and turned down for **this** page, not in general.

| Rejected | Reason |
|---|---|
| **3D card flips** (`rotateY(180)`, front/back faces) | A card with two faces is a UI widget, not an object. Reads as PowerPoint and would undo the sincerity in one gesture. The portrait lift is the honest version: one face, a hinge on the object's own edge, and it stops before the plane. |
| **3D tilt / parallax on hover** | Requires a cursor; the primary reader is on a phone. And a tilting portrait says "product shot", not "this is me". |
| **Typewriter text** | On Vietnamese, character-by-character reveal makes diacritics pop in after their base glyphs — twitchy and slightly comic. It also fakes live authorship on a page whose brief is honesty. |
| **Per-character `SplitText`** | Same diacritic problem. `SplitText` was measured at 7.6KB min from jsDelivr and is genuinely free in 3.13+, but line-level is the only safe granularity here, and the one place that wanted it (`#no-test`) gets a better result from three `<span>`s at 0KB. |
| **GSAP `Flip`** (24.9KB min, verified 200) | Flip earns its weight when an element must travel between two *different layout positions*. Nothing on this page does. Loading 25KB to animate things that stay put is exactly the "look what CSS can do" failure mode. |
| **GSAP `MotionPath`** (21.5KB min, verified 200) | Nothing travels along a curve. A letter does not arc across a desk. |
| **Horizontal scroll hijack** | The reader is holding a phone and reading a letter. Turning the vow list into a sideways carousel would be the single most alienating thing available. |
| **Scroll-jacked slideshow / snap-to-scene** | Removes her control over pace. On a page asking her to read carefully and re-read the honest parts, taking away the scrollbar is hostile. |
| **Cursor followers, magnetic buttons, custom cursors** | Desktop-only theatre, and the vocabulary of an agency portfolio. Actively works against "sincere". |
| **WebGL / Three.js / shader dissolves** | I can build them and they would be wrong. Hundreds of KB, a second render pipeline, three more failure modes, on a static one-pager whose emotional register is a handwritten letter. |
| **Confetti, hearts, particles on the CTA** | The page's climax is "không có bài kiểm tra nào cả". Confetti after that line is a joke at its own expense. |
| **Text-scramble / glitch effects** | Belongs to a different genre entirely, and mangles diacritics. |
| **Counting-up numbers on the dossier** (26, 162cm, 65kg) | Turns honest disclosures into a scoreboard, which is exactly the corporate register that was just removed. |
| **A second vignette on `#no-test`** | Considered and dropped. `#closing` already has one; a second would make the device visible as a device. The climax's stillness *is* its effect. |
| **Dimming the surrounding content to spotlight the climax** | Either it reverses (banned) or it leaves body copy permanently at reduced opacity. She may want to re-read it. |
| **Page-curl / paper-fold on scene transitions** | Genuinely material and genuinely on-metaphor — and still rejected. A full page-turn between scenes needs either a pin per scene (another 3000px of scroll on a phone, on top of the 26% already added) or 3D geometry with a back face. Costs too much of exactly the resource the phone tier has least of. |
| **Animating the hero `background-size`** | Banned by invariant 6 and it repaints a full-viewport layer every frame. `transform: scale()` on the `::before` already does it for free. |

---

## 8. Sequencing

Cheapest and highest impact first. Each step is independently shippable and independently revertible.

| # | Item | Effort | Impact | Notes |
|---|---|---|---|---|
| 1 | **`.beat-in` handoff + `overflow: clip visible` guard** (§3c, §3d) | S | enabling | Not a visible feature. Everything after this depends on it, and it fixes the already-broken `.panel:hover`. |
| 2 | **Per-scene entrance recipes** (§3b) | S | **highest** | One object. Immediately kills the "every beat does the same thing" monotony across all nine scenes. Ship this alone and the page is already noticeably less uniform. |
| 3 | **Hero pan + slate rule draw** (`#home`) | S | high | First frame, everyone sees it, two lines of CSS. |
| 4 | **The portrait lift** (`#applicant`, §5) | M | **highest** | The set-piece. Do it after 1–3 so the surrounding beats already read correctly. |
| 5 | **Pen marks + margin rule** (`#offer`, `#shared`) | S | medium | Two small film-scoped CSS rules, two batches. Pure craft. |
| 6 | **Room dim + set-down landing** (`#closing`) | S | medium | Re-measure AA contrast at `--room-dim: 1` in both themes before shipping. |
| 7 | **Seal press** (`#end`) + `failOpen()` extension | S | medium | Last frame. Cheap, and it gives the page an ending gesture. |
| 8 | **Mobile hardening**: `100svh`, `PIN_END`, `ignoreMobileResize`, `SCRUB` | S | high on phone | Do this *before* the Android verification pass or you will be measuring the wrong build. |
| 9 | **`#no-test` sentence split** | M | medium | Only markup + typography change in the spec. Decline-able. |
| 10 | **`#dossier` credits roll** | S | low | Least load-bearing. First thing to cut if Android drops frames. |

**Net library cost: 0KB.** No new plugins. Everything above uses GSAP core + ScrollTrigger, which are already loaded.

---

## 9. Unresolved questions

1. **`assets/tien.jpg`.** The set-piece is "a photograph is picked up". It currently picks up a grey silhouette. It works, but the version she would remember needs the real photo. Is it coming?
2. **The `#no-test` sentence split** (item 9) is the only place I change typography. Three centred statements read better to me than one centred paragraph, but it is a real design change on the page's climax — do you want it, or should the climax stay one block with the slow timing only?
3. **`--room-dim` contrast.** I capped the overlay deepening at +0.14 by reasoning about the gradient's `transparent 58%` centre stop, not by measurement. Someone should measure `--muted` on `--panel-bg` at `--room-dim: 1` in the light theme before this ships.
4. **Portrait start angle** — 68° is right for a flat placeholder. A real face at 68° may look strange; expect to tune toward ~58° once the photo exists.
5. **`ScrollTrigger.config({ ignoreMobileResize: true })`** is a page-wide setting and I could not test its interaction with Lenis on a real device. It is the standard recommendation, but verify it does not leave a pin mis-measured after an orientation change.
6. **The +26% mobile page length** is a product decision, not a motion one. Two pins and nine `min-height: 100vh` stages turn 8149px into 10282px at 390×844. If that is too long, the cheapest reductions are `PIN_END` at `+=35%` and dropping `min-height` to `85svh` on phones — both one-liners, neither affects any technique in this spec.
7. Someone else is driving the default `agent-browser` session (I found it on `127.0.0.1:8200`, "Motion Lab · Thư ngỏ — 8 cách chuyển động"). If a parallel motion exploration is running, this spec should be reconciled with it before implementation rather than merged blind.

// story-film.js — scroll-driven "short film" choreography.
//
// Turns each chapter into a scene whose beats rise into view as the reader
// scrolls (GSAP + ScrollTrigger), gliding on Lenis smooth scroll. The opening
// and closing scenes pin and play a scrubbed camera move during the hold.
//
// Relationship to the older reveal engine (assets/story.js):
//   * This file runs BEFORE story.js (script order in index.html).
//   * When the film activates it adds `html.film-ready`; story.js then bails and
//     story.css stops hiding [data-reveal] (its rules are scoped
//     `html.js-ready:not(.film-ready)`). GSAP owns the motion instead.
//   * When the film does NOT activate (narrow screen, reduced motion, or the
//     CDN libraries are missing) this file returns early and the existing
//     story.js reveal runs unchanged — the guaranteed fallback.
//
// Two ordering rules keep the choreography honest and must not be reshuffled:
//   1. Pins are created BEFORE reveals and carry `refreshPriority: 1`.
//      ScrollTrigger refreshes in priority-then-creation order; if a reveal is
//      measured before the pin above it has inserted its spacer, that reveal is
//      early by the full pin distance and finishes below the fold.
//   2. Reveals are per-beat and non-reversing (`once: true`), matching story.js's
//      reveal-once contract. A reversing scrub leaves beats — including the two
//      closing CTAs — at opacity 0 while still in the tab order.
//
// Fail-open: any error during setup calls failOpen(), which force-shows every
// beat with inline styles that win over both stylesheets, so content is never
// trapped hidden. Loaded with `defer`, mirroring the other enhancement scripts.
(() => {
	'use strict';

	const root = document.documentElement;
	const REVEAL = '[data-reveal]';

	// Per-scene entrance timing. Scenes absent from this map use DEFAULT_TIMING.
	// `#honest` carries the strongest copy, so it is deliberately the slowest
	// cascade on the page — restraint used as emphasis rather than decoration.
	const DEFAULT_TIMING = { start: 'top 86%', duration: 0.8, stagger: 0.12 };
	const SCENE_TIMING = {
		honest: { start: 'top 82%', duration: 1.15, stagger: 0.24 },
	};
	// `#closing` is excluded from the batch entirely: its beats are choreographed
	// on its own pin timeline so the soft landing survives in this tier too.
	const PIN_CHOREOGRAPHED = new Set(['closing']);

	// Force every beat visible regardless of stylesheet state. Inline opacity/
	// transform beat both story.css and story-film.css (neither uses !important
	// on these properties), so this is a hard guarantee against trapped content.
	const failOpen = () => {
		document.querySelectorAll(REVEAL).forEach((el) => {
			el.style.opacity = '1';
			el.style.transform = 'none';
		});
	};

	// Activation gate. The film is a progressive enhancement on top of the
	// static reveal; only take over when all four hold:
	//   * viewport wide enough that pinning/scrubbing reads well (not phones),
	//   * the reader has not asked to reduce motion,
	//   * the CDN libraries actually loaded,
	//   * the head watchdog has not already given up waiting for us.
	// Otherwise return and let story.js handle the reveal as it does today.
	//
	// The watchdog case is the subtle one: a CDN that is slow but ultimately
	// succeeds. By the time this runs the watchdog has un-hidden the page and the
	// reader is already reading, so activating here would hide all 31 beats again
	// in order to animate them back in — a flash-of-disappearing-content on
	// exactly the slow connections the watchdog exists to protect.
	const wideEnough = window.matchMedia('(min-width: 768px)').matches;
	const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
	const libsReady =
		typeof window.gsap !== 'undefined' &&
		typeof window.ScrollTrigger !== 'undefined' &&
		typeof window.Lenis !== 'undefined';
	const watchdogFired = root.dataset.storyWatchdog === 'fired';

	if (!wideEnough || !motionOK || !libsReady || watchdogFired) {
		return;
	}

	try {
		const { gsap, ScrollTrigger, Lenis } = window;
		gsap.registerPlugin(ScrollTrigger);

		// Marks the page as "the film is running": disables story.css reveal and
		// activates the story-film.css pre-hide + scene layout.
		root.classList.add('film-ready');
		// Tells the head watchdog an engine claimed the page, so it stops waiting.
		root.dataset.storyEngine = 'film';

		// Smooth momentum scroll, bridged into ScrollTrigger so scrubbing tracks
		// the eased scroll position rather than raw wheel deltas. Lenis already
		// eases the input, so scrub values stay low — stacking a long Lenis
		// duration on a long scrub makes the page feel mushy to read.
		const lenis = new Lenis({ duration: 0.95, smoothWheel: true });
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		/* ---------- 1. Pinned scenes (created first — see header note) ---------- */

		// Cold open: the pin used to be 540px of frozen scroll with nothing
		// attached. It now drives a slow camera push-in on the hero frame while
		// the copy drifts up and dissolves, so the hold reads as a dissolve into
		// scene 2 rather than a stuck page. --hero-scale is consumed by
		// .home-hero::before (styles.css); it defaults to 1, so the other two
		// tiers are unaffected.
		const hero = document.getElementById('home');
		const heroCopy = hero && hero.querySelector('.hero-copy');
		if (hero) {
			const heroPush = gsap.timeline({
				scrollTrigger: {
					trigger: hero,
					start: 'top top',
					end: '+=60%',
					pin: true,
					pinSpacing: true,
					scrub: 0.5,
					refreshPriority: 1,
				},
			});
			heroPush.fromTo(hero, { '--hero-scale': 1 }, { '--hero-scale': 1.07, ease: 'none' }, 0);
			if (heroCopy) {
				heroPush.to(heroCopy, { y: -48, opacity: 0.12, ease: 'power1.in' }, 0);
			}
		}

		// Closing beat. The pin's job is deliberately DECORATIVE: it scrubs a warm
		// vignette (--closing-settle) so the camera appears to settle during the
		// hold. It must never drive content opacity — a scrub is reversible, and
		// scrolling back up would leave this scene's two CTAs at opacity 0 while
		// they are still in the tab order.
		const closing = document.getElementById('closing');
		if (closing) {
			const softBeats = closing.querySelectorAll(REVEAL);
			gsap.set(softBeats, { opacity: 0, y: 40 });

			gsap.timeline({
				scrollTrigger: {
					trigger: closing,
					start: 'top top',
					end: '+=60%',
					pin: true,
					pinSpacing: true,
					scrub: 1.2,
					refreshPriority: 1,
				},
			}).fromTo(closing, { '--closing-settle': 0 }, { '--closing-settle': 1, ease: 'none' });

			// The content reveal is separate and non-reversing, matching every other
			// scene. It keeps the longer, softer landing story.css reserves for
			// [data-reveal="soft"], which the old shared scene tween threw away.
			ScrollTrigger.create({
				trigger: closing,
				start: 'top 80%',
				once: true,
				onEnter: () => {
					gsap.to(softBeats, {
						opacity: 1,
						y: 0,
						ease: 'power2.out',
						duration: 1.25,
						stagger: 0.28,
						onStart: () =>
							softBeats.forEach((el) => {
								el.style.willChange = 'opacity, transform';
							}),
						onComplete: () =>
							softBeats.forEach((el) => {
								el.style.willChange = '';
							}),
					});
				},
			});
		}

		/* ---------- 2. Per-beat entrances (non-reversing) ---------- */

		// One batch per scene so each can carry its own tempo, and so a tall scene
		// times its lower half correctly — a single scene-level trigger never can.
		gsap.utils.toArray('[data-scene]').forEach((scene) => {
			if (PIN_CHOREOGRAPHED.has(scene.id)) return;

			const beats = scene.querySelectorAll(REVEAL);
			if (!beats.length) return;

			const timing = SCENE_TIMING[scene.id] || DEFAULT_TIMING;
			gsap.set(beats, { opacity: 0, y: 40 });

			ScrollTrigger.batch(beats, {
				start: timing.start,
				once: true,
				onEnter: (batch) => {
					gsap.to(batch, {
						opacity: 1,
						y: 0,
						ease: 'expo.out',
						duration: timing.duration,
						stagger: timing.stagger,
						// Promote only for the life of the tween. A blanket
						// will-change on all 31 beats holds compositor layers for
						// the whole session and costs more than it saves.
						onStart: () =>
							batch.forEach((el) => {
								el.style.willChange = 'opacity, transform';
							}),
						onComplete: () =>
							batch.forEach((el) => {
								el.style.willChange = '';
							}),
					});
				},
			});
		});

		/* ---------- 3. Anchor jumps travel with the film's camera ---------- */

		// Native `scroll-behavior: smooth` bypasses Lenis: a nav click warps the
		// page in ~24 frames with a completely different easing signature from
		// wheel scrolling. Route in-page links through Lenis instead, offset by
		// the real sticky-header height so headings never land behind it.
		// The skip link is deliberately left alone — its native behaviour also
		// moves keyboard focus, which lenis.scrollTo does not.
		const header = document.querySelector('.site-header');
		document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
			link.addEventListener('click', (event) => {
				const hash = link.getAttribute('href');
				if (!hash || hash === '#') return;

				const target = document.querySelector(hash);
				if (!target) return;

				event.preventDefault();
				lenis.scrollTo(target, {
					offset: header ? -header.offsetHeight : 0,
					duration: 1.4,
				});
				// Keep the URL shareable without triggering a second native jump.
				history.replaceState(null, '', hash);
			});
		});

		/* ---------- 4. Measurement ---------- */

		// Pins change total scroll height; recompute all triggers once now and on
		// full load (fonts/images can shift layout after this script runs).
		ScrollTrigger.refresh();
		window.addEventListener('load', () => ScrollTrigger.refresh(), { passive: true });

		// Safety net (mirrors story.js): if the opening scene's beats are still
		// hidden shortly after load while in view, something went wrong building
		// the timelines — force everything open.
		window.addEventListener(
			'load',
			() => {
				window.setTimeout(() => {
					const firstBeat = document.querySelector('[data-scene] ' + REVEAL);
					if (!firstBeat) return;
					const hidden = parseFloat(getComputedStyle(firstBeat).opacity) === 0;
					const rect = firstBeat.getBoundingClientRect();
					const inView = rect.top < window.innerHeight && rect.bottom > 0;
					if (hidden && inView) failOpen();
				}, 400);
			},
			{ passive: true },
		);
	} catch {
		// Any failure: reveal everything so content is never trapped hidden.
		failOpen();
	}
})();

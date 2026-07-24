// story-film.js — scroll-driven "short film" choreography.
//
// Turns each chapter into a scene whose beats scrub into view as the reader
// scrolls (GSAP + ScrollTrigger), gliding on Lenis smooth scroll. Title-card
// scenes ([data-scene-pin]) pin briefly for a dramatic hold.
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
// Fail-open: any error during setup calls failOpen(), which force-shows every
// beat with inline styles that win over both stylesheets, so content is never
// trapped hidden. Loaded with `defer`, mirroring the other enhancement scripts.
(() => {
	'use strict';

	const root = document.documentElement;
	const REVEAL = '[data-reveal]';

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
	// static reveal; only take over when all three hold:
	//   * viewport wide enough that pinning/scrubbing reads well (not phones),
	//   * the reader has not asked to reduce motion,
	//   * the CDN libraries actually loaded.
	// Otherwise return and let story.js handle the reveal as it does today.
	const wideEnough = window.matchMedia('(min-width: 768px)').matches;
	const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
	const libsReady =
		typeof window.gsap !== 'undefined' &&
		typeof window.ScrollTrigger !== 'undefined' &&
		typeof window.Lenis !== 'undefined';

	if (!wideEnough || !motionOK || !libsReady) {
		return;
	}

	try {
		const { gsap, ScrollTrigger, Lenis } = window;
		gsap.registerPlugin(ScrollTrigger);

		// Marks the page as "the film is running": disables story.css reveal and
		// activates the story-film.css pre-hide + scene layout.
		root.classList.add('film-ready');

		// Smooth momentum scroll, bridged into ScrollTrigger so scrubbing tracks
		// the eased scroll position rather than raw wheel deltas.
		const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		// One scrubbed entrance timeline per scene: beats rise + fade in as the
		// scene crosses the viewport. Reversible — scrolling back re-hides them,
		// which reads as the camera moving off the scene.
		gsap.utils.toArray('[data-scene]').forEach((scene) => {
			const beats = scene.querySelectorAll(REVEAL);
			if (!beats.length) return;

			gsap.set(beats, { opacity: 0, y: 40 });
			gsap.to(beats, {
				opacity: 1,
				y: 0,
				ease: 'power2.out',
				stagger: 0.12,
				scrollTrigger: {
					trigger: scene,
					start: 'top 78%',
					end: 'top 32%',
					scrub: 1,
				},
			});
		});

		// Title-card scenes pin for a short hold before releasing to the next
		// scene. Only used on short scenes (open + close) so pinned content never
		// exceeds the viewport.
		gsap.utils.toArray('[data-scene-pin]').forEach((scene) => {
			ScrollTrigger.create({
				trigger: scene,
				start: 'top top',
				end: '+=60%',
				pin: true,
				pinSpacing: true,
			});
		});

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

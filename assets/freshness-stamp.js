// freshness-stamp.js — fills the "vị trí vẫn đang mở · cập nhật [ngày]" stamp in
// the closing scene from the repo's latest commit date, via the public GitHub REST
// API (no build step, no backend, no token in client code — unauthenticated call,
// 60 req/hr/IP is plenty for a personal page).
//
// Progressive enhancement + honesty guarantee: the stamp element ships with the
// `hidden` attribute and is revealed ONLY after a successful fetch + parse. Any
// failure — offline, rate-limited, HTTP error, missing/invalid date — leaves it
// hidden, so the page never shows a broken or placeholder date. Loaded with
// `defer` and fetching async, it never blocks render. The date shown is the commit
// date, and the copy says exactly that ("cập nhật" = last updated) — no implied
// deadline the data can't back up.
(() => {
	'use strict';

	const el = document.querySelector('[data-freshness]');
	if (!el || typeof window.fetch !== 'function') return;

	const API = 'https://api.github.com/repos/tiennm99/dating/commits?per_page=1';

	fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
		.then((res) => (res.ok ? res.json() : Promise.reject(new Error('HTTP ' + res.status))))
		.then((data) => {
			const commit = Array.isArray(data) && data[0] && data[0].commit;
			const iso =
				commit && ((commit.committer && commit.committer.date) || (commit.author && commit.author.date));
			if (!iso) throw new Error('no commit date in response');

			const date = new Date(iso);
			if (Number.isNaN(date.getTime())) throw new Error('unparseable date');

			const formatted = new Intl.DateTimeFormat('vi-VN', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}).format(date);

			el.textContent = 'Vị trí vẫn đang mở · cập nhật ' + formatted + '.';
			el.hidden = false;

			// The stamp lands after ScrollTrigger has already measured, so every
			// trigger below it would otherwise sit one stamp-height out of place.
			// (.freshness-stamp also reserves its own height in styles.css, so the
			// visible layout shift is zero; this keeps the film's maths honest for
			// the cases where the text wraps to a second line.)
			window.ScrollTrigger?.refresh();
		})
		.catch(() => {
			// Silent by design: keep the stamp hidden rather than show a broken date.
		});
})();

// Theme toggle. The pre-paint bootstrap inline in each page head sets
// documentElement.dataset.theme before first paint (stored choice, else OS
// preference, else light); this script wires the buttons and syncs button state.
// Keep the storage key and accepted values in sync with that bootstrap script.
(() => {
	const storageKey = 'dating-theme';
	const buttons = document.querySelectorAll('[data-theme-option]');

	/** Reflect a theme in the DOM + button state. `persist` writes the choice to
	 *  localStorage; it is true ONLY for an explicit user toggle. The initial sync
	 *  and OS-follow updates pass false so an implicit default is never frozen into
	 *  a stored preference — that is what lets a first visit keep tracking the OS
	 *  until the visitor actually picks a theme.
	 *  @param {'light' | 'dark'} theme */
	function applyTheme(theme, persist) {
		document.documentElement.dataset.theme = theme;
		document.documentElement.style.colorScheme = theme;

		if (persist) {
			try {
				localStorage.setItem(storageKey, theme);
			} catch {
				// Keep the in-memory preference even when persistence is blocked.
			}
		}

		for (const button of buttons) {
			const active = button.dataset.themeOption === theme;
			button.classList.toggle('active', active);
			button.setAttribute('aria-pressed', String(active));
		}
	}

	for (const button of buttons) {
		button.addEventListener('click', () => {
			applyTheme(button.dataset.themeOption === 'dark' ? 'dark' : 'light', true);
		});
	}

	// Sync button state with the theme chosen by the pre-paint bootstrap (no persist).
	applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', false);

	// While no explicit choice is stored, keep following live OS light/dark changes.
	// A stored choice (set on toggle) suppresses this, matching "stored choice wins".
	if (window.matchMedia) {
		const osDark = window.matchMedia('(prefers-color-scheme: dark)');
		const onOsChange = (event) => {
			let stored = null;
			try {
				stored = localStorage.getItem(storageKey);
			} catch {
				// Treat unreadable storage as "no choice" and follow the OS.
			}
			if (stored !== 'light' && stored !== 'dark') {
				applyTheme(event.matches ? 'dark' : 'light', false);
			}
		};
		if (typeof osDark.addEventListener === 'function') {
			osDark.addEventListener('change', onOsChange);
		} else if (typeof osDark.addListener === 'function') {
			// Older Safari fallback.
			osDark.addListener(onOsChange);
		}
	}
})();

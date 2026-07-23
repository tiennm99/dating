// Theme toggle. The pre-paint bootstrap inline in each page head sets
// documentElement.dataset.theme before first paint; this script only wires
// the buttons and keeps the stored preference in sync.
// Keep the storage key and accepted values in sync with that bootstrap script.
(() => {
	const storageKey = 'dating-theme';
	const buttons = document.querySelectorAll('[data-theme-option]');

	/** @param {'light' | 'dark'} theme */
	function applyTheme(theme) {
		document.documentElement.dataset.theme = theme;
		document.documentElement.style.colorScheme = theme;

		try {
			localStorage.setItem(storageKey, theme);
		} catch {
			// Keep the in-memory preference even when persistence is blocked.
		}

		for (const button of buttons) {
			const active = button.dataset.themeOption === theme;
			button.classList.toggle('active', active);
			button.setAttribute('aria-pressed', String(active));
		}
	}

	for (const button of buttons) {
		button.addEventListener('click', () => {
			applyTheme(button.dataset.themeOption === 'dark' ? 'dark' : 'light');
		});
	}

	// Sync button state with the theme chosen by the pre-paint bootstrap.
	applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
})();

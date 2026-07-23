import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const themeOptions = /** @type {const} */ (['light', 'dark']);
/** @typedef {(typeof themeOptions)[number]} Theme */

/** @type {Theme} */
const defaultTheme = 'light';

// Keep this key and the accepted values in sync with the pre-paint bootstrap script in src/app.html.
const themeStorageKey = 'dating-theme';

/** @type {import('svelte/store').Writable<Theme>} */
export const theme = writable(defaultTheme);

let themeStarted = false;

/**
 * @param {string | null} value
 * @returns {value is Theme}
 */
function isTheme(value) {
	return themeOptions.includes(/** @type {Theme} */ (value));
}

/** @returns {Theme} */
function readStoredTheme() {
	try {
		const storedTheme = localStorage.getItem(themeStorageKey);
		return isTheme(storedTheme) ? storedTheme : defaultTheme;
	} catch {
		return defaultTheme;
	}
}

/** @param {Theme} nextTheme */
function applyTheme(nextTheme) {
	document.documentElement.dataset.theme = nextTheme;
	document.documentElement.style.colorScheme = nextTheme;

	try {
		localStorage.setItem(themeStorageKey, nextTheme);
	} catch {
		// Keep the in-memory preference even when persistence is blocked.
	}
}

export function initializeTheme() {
	if (!browser || themeStarted) return;

	theme.set(readStoredTheme());
	themeStarted = true;

	theme.subscribe(applyTheme);
}

/** @param {Theme} nextTheme */
export function setTheme(nextTheme) {
	theme.set(nextTheme);
}

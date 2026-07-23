import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import {
	defaultLocale,
	defaultTheme,
	isLocale,
	isTheme,
	localeOptions,
	messages,
	themeOptions
} from './index.js';

/** @typedef {import('./types.js').Locale} Locale */
/** @typedef {import('./types.js').Theme} Theme */

const localeStorageKey = 'dating-locale';
const themeStorageKey = 'dating-theme';

export { localeOptions, themeOptions };

/** @type {import('svelte/store').Writable<Locale>} */
export const locale = writable(defaultLocale);

/** @type {import('svelte/store').Writable<Theme>} */
export const theme = writable(defaultTheme);

export const copy = derived(locale, ($locale) => messages[$locale]);

let preferencesStarted = false;

/** @returns {Locale} */
function readStoredLocale() {
	if (!browser) return defaultLocale;

	const storedLocale = readStorage(localeStorageKey);
	if (isLocale(storedLocale)) return storedLocale;

	return defaultLocale;
}

/** @returns {Theme} */
function readStoredTheme() {
	if (!browser) return defaultTheme;

	const storedTheme = readStorage(themeStorageKey);
	return isTheme(storedTheme) ? storedTheme : defaultTheme;
}

/** @param {string} key */
function readStorage(key) {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

/**
 * @param {string} key
 * @param {string} value
 */
function writeStorage(key, value) {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Keep the in-memory preference even when persistence is blocked.
	}
}

/** @param {Locale} nextLocale */
function applyLocale(nextLocale) {
	document.documentElement.lang = nextLocale;
	writeStorage(localeStorageKey, nextLocale);
}

/** @param {Theme} nextTheme */
function applyTheme(nextTheme) {
	document.documentElement.dataset.theme = nextTheme;
	document.documentElement.style.colorScheme = nextTheme;
	writeStorage(themeStorageKey, nextTheme);
}

export function initializePreferences() {
	if (!browser || preferencesStarted) return;

	locale.set(readStoredLocale());
	theme.set(readStoredTheme());
	preferencesStarted = true;

	locale.subscribe(applyLocale);
	theme.subscribe(applyTheme);
}

/** @param {Locale} nextLocale */
export function setLocale(nextLocale) {
	locale.set(nextLocale);
}

/** @param {Theme} nextTheme */
export function setTheme(nextTheme) {
	theme.set(nextTheme);
}

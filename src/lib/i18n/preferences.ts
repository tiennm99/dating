import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';
import {
	defaultLocale,
	defaultTheme,
	isLocale,
	isTheme,
	localeOptions,
	messages,
	themeOptions,
	type Locale,
	type Theme
} from './index';

const localeStorageKey = 'dating-locale';
const themeStorageKey = 'dating-theme';

export { localeOptions, themeOptions };

export const locale = writable<Locale>(defaultLocale);
export const theme = writable<Theme>(defaultTheme);
export const copy = derived(locale, ($locale) => messages[$locale]);

let preferencesStarted = false;

function readStoredLocale(): Locale {
	if (!browser) return defaultLocale;

	const storedLocale = readStorage(localeStorageKey);
	if (isLocale(storedLocale)) return storedLocale;

	return defaultLocale;
}

function readStoredTheme(): Theme {
	if (!browser) return defaultTheme;

	const storedTheme = readStorage(themeStorageKey);
	return isTheme(storedTheme) ? storedTheme : defaultTheme;
}

function readStorage(key: string) {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStorage(key: string, value: string) {
	try {
		localStorage.setItem(key, value);
	} catch {
		// Keep the in-memory preference even when persistence is blocked.
	}
}

function applyLocale(nextLocale: Locale) {
	document.documentElement.lang = nextLocale;
	writeStorage(localeStorageKey, nextLocale);
}

function applyTheme(nextTheme: Theme) {
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

export function setLocale(nextLocale: Locale) {
	locale.set(nextLocale);
}

export function setTheme(nextTheme: Theme) {
	theme.set(nextTheme);
}

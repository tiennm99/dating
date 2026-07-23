import { en } from './en.js';
import { vi } from './vi.js';
import { localeOptions, themeOptions } from './types.js';

export * from './types.js';

/** @typedef {import('./types.js').Locale} Locale */
/** @typedef {import('./types.js').Theme} Theme */
/** @typedef {import('./types.js').CopyFact} CopyFact */
/** @typedef {import('./types.js').CopyStrength} CopyStrength */
/** @typedef {import('./types.js').SiteCopy} SiteCopy */

/** @type {Locale} */
export const defaultLocale = 'vi';

/** @type {Theme} */
export const defaultTheme = 'light';

/** @satisfies {Record<Locale, SiteCopy>} */
export const messages = {
	en,
	vi
};

/**
 * @param {string | null} value
 * @returns {value is Locale}
 */
export function isLocale(value) {
	return localeOptions.includes(/** @type {Locale} */ (value));
}

/**
 * @param {string | null} value
 * @returns {value is Theme}
 */
export function isTheme(value) {
	return themeOptions.includes(/** @type {Theme} */ (value));
}

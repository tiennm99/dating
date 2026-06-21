import { en } from './en';
import { vi } from './vi';
import { localeOptions, themeOptions, type Locale, type SiteCopy, type Theme } from './types';

export * from './types';

export const defaultLocale: Locale = 'vi';
export const defaultTheme: Theme = 'light';

export const messages = {
	en,
	vi
} satisfies Record<Locale, SiteCopy>;

export function isLocale(value: string | null): value is Locale {
	return localeOptions.includes(value as Locale);
}

export function isTheme(value: string | null): value is Theme {
	return themeOptions.includes(value as Theme);
}

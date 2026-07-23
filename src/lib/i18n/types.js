export const localeOptions = /** @type {const} */ (['vi', 'en']);
/** @typedef {(typeof localeOptions)[number]} Locale */

export const themeOptions = /** @type {const} */ (['light', 'dark']);
/** @typedef {(typeof themeOptions)[number]} Theme */

/** @typedef {readonly [label: string, value: string]} CopyFact */

/**
 * @typedef {object} CopyStrength
 * @property {string} title
 * @property {string} body
 */

/**
 * @typedef {object} SiteCopy
 * @property {{
 *   skipLink: string,
 *   brand: string,
 *   homeAria: string,
 *   primaryNavAria: string
 * }} layout
 * @property {Record<'home' | 'jd' | 'cv', string>} nav
 * @property {{
 *   themeGroup: string,
 *   languageGroup: string,
 *   themeActions: Record<Theme, string>,
 *   languageActions: Record<Locale, string>
 * }} controls
 * @property {{
 *   metaTitle: string,
 *   metaDescription: string,
 *   heroEyebrow: string,
 *   title: string,
 *   lead: string,
 *   primaryCta: string,
 *   secondaryCta: string,
 *   packetEyebrow: string,
 *   packetTitle: string,
 *   futureLoverTitle: string,
 *   futureLoverBody: string,
 *   committeeTitle: string,
 *   committeeBody: string
 * }} home
 * @property {{
 *   metaTitle: string,
 *   metaDescription: string,
 *   heroEyebrow: string,
 *   title: string,
 *   lead: string,
 *   summaryAria: string,
 *   summary: CopyFact[],
 *   benefitsEyebrow: string,
 *   benefitsTitle: string,
 *   benefits: string[],
 *   responsibilitiesEyebrow: string,
 *   responsibilitiesTitle: string,
 *   responsibilities: string[],
 *   niceEyebrow: string,
 *   processTitle: string,
 *   niceToHave: string[],
 *   selectionTitle: string,
 *   selectionBody: string
 * }} jd
 * @property {{
 *   metaTitle: string,
 *   metaDescription: string,
 *   heroEyebrow: string,
 *   title: string,
 *   lead: string,
 *   summaryAria: string,
 *   strengthsEyebrow: string,
 *   strengthsTitle: string,
 *   strengths: CopyStrength[],
 *   factsEyebrow: string,
 *   factsTitle: string,
 *   facts: CopyFact[],
 *   closingEyebrow: string,
 *   closingTitle: string,
 *   closingBody: string
 * }} cv
 */

export {};

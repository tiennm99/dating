export const localeOptions = ['vi', 'en'] as const;
export type Locale = (typeof localeOptions)[number];

export const themeOptions = ['light', 'dark'] as const;
export type Theme = (typeof themeOptions)[number];

export type CopyFact = readonly [label: string, value: string];

export type CopyStrength = {
	title: string;
	body: string;
};

export type SiteCopy = {
	layout: {
		skipLink: string;
		brand: string;
		homeAria: string;
		primaryNavAria: string;
	};
	nav: Record<'home' | 'jd' | 'cv', string>;
	controls: {
		themeGroup: string;
		languageGroup: string;
		themeActions: Record<Theme, string>;
		languageActions: Record<Locale, string>;
	};
	home: {
		metaTitle: string;
		metaDescription: string;
		heroEyebrow: string;
		title: string;
		lead: string;
		primaryCta: string;
		secondaryCta: string;
		packetEyebrow: string;
		packetTitle: string;
		futureLoverTitle: string;
		futureLoverBody: string;
		committeeTitle: string;
		committeeBody: string;
	};
	jd: {
		metaTitle: string;
		metaDescription: string;
		heroEyebrow: string;
		title: string;
		lead: string;
		summaryAria: string;
		summary: CopyFact[];
		benefitsEyebrow: string;
		benefitsTitle: string;
		benefits: string[];
		responsibilitiesEyebrow: string;
		responsibilitiesTitle: string;
		responsibilities: string[];
		niceEyebrow: string;
		processTitle: string;
		niceToHave: string[];
		selectionTitle: string;
		selectionBody: string;
	};
	cv: {
		metaTitle: string;
		metaDescription: string;
		heroEyebrow: string;
		title: string;
		lead: string;
		summaryAria: string;
		strengthsEyebrow: string;
		strengthsTitle: string;
		strengths: CopyStrength[];
		factsEyebrow: string;
		factsTitle: string;
		facts: CopyFact[];
		closingEyebrow: string;
		closingTitle: string;
		closingBody: string;
	};
};

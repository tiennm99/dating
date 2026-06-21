import type { SiteCopy } from './types';

export const en: SiteCopy = {
	layout: {
		skipLink: 'Skip to content',
		brand: 'Dating JD & CV',
		homeAria: 'Dating JD and CV home',
		primaryNavAria: 'Primary navigation'
	},
	nav: {
		home: 'Home',
		jd: 'JD',
		cv: 'CV'
	},
	controls: {
		themeGroup: 'Theme',
		languageGroup: 'Language',
		themes: {
			light: 'Light',
			dark: 'Dark'
		},
		themeActions: {
			light: 'Use light theme',
			dark: 'Use dark theme'
		},
		languages: {
			en: 'EN',
			vi: 'VI'
		},
		languageActions: {
			en: 'Use English',
			vi: 'Use Vietnamese'
		}
	},
	home: {
		metaTitle: 'Tien Nguyen Minh | Dating JD & CV',
		metaDescription: 'A warm-witty dating job description and CV for Tien Nguyen Minh.',
		heroEyebrow: 'Open role / long-term partner',
		title: 'Tien Nguyen Minh',
		lead: 'A small application packet for one future lover: equal parts job description, personal CV, and honest invitation to build something kind.',
		primaryCta: 'Read the JD',
		secondaryCta: 'Review the CV',
		packetEyebrow: 'Application packet',
		packetTitle: 'A serious joke, lightly managed.',
		futureLoverTitle: 'For the future lover',
		futureLoverBody:
			'The JD explains what this role receives: steadiness, attention, humor, emotional maintenance, and a partner who treats care as daily work, not launch-day theater.',
		committeeTitle: 'For the hiring committee',
		committeeBody:
			'The CV summarizes the applicant: software engineer, systems thinker, patient debugger, and human still actively refactoring bad habits.'
	},
	jd: {
		metaTitle: 'JD | Future Lover Role',
		metaDescription:
			'Rights, benefits, responsibilities, and selection notes for the future lover role.',
		heroEyebrow: 'Job description',
		title: 'Future Lover',
		lead: 'This is a long-term, human-facing role. The compensation package is mostly attention, loyalty, shared meals, private jokes, and someone who will try again after mistakes.',
		summaryAria: 'Role summary',
		summary: [
			['Type', 'Full-time heart, flexible schedule'],
			['Location', 'Mostly Earth, sometimes HCMC'],
			['Start date', 'When trust passes review']
		],
		benefitsEyebrow: 'Rights & benefits',
		benefitsTitle: 'What you receive.',
		benefits: [
			'Priority support for hard days, strange ideas, and quiet evenings.',
			'Consistent honesty, clear communication, and bug reports without blame.',
			'A partner who can debug production systems and also overthink dinner choices.',
			'Long-term growth plan: better health, better travel, better stories.'
		],
		responsibilitiesEyebrow: 'Responsibilities',
		responsibilitiesTitle: 'What we both protect.',
		responsibilities: [
			'Build trust with direct words and small repeated actions.',
			'Respect alone time, career ambition, family, friends, and personal rituals.',
			'Bring curiosity, kindness, and willingness to repair after conflict.',
			'Co-maintain a life where both people can be serious and silly.'
		],
		niceEyebrow: 'Nice to have',
		processTitle: 'Interview process.',
		niceToHave: [
			'Enjoys food, walks, games, films, or learning obscure things for no urgent reason.',
			'Can laugh at a corporate parody without turning love into a quarterly OKR.',
			'Believes romance works better with patience than guessing games.'
		],
		selectionTitle: 'Selection notes',
		selectionBody:
			'No pressure test. No hidden puzzle round. Strong candidates are kind when tired, direct when confused, and willing to choose each other in small boring moments.'
	},
	cv: {
		metaTitle: 'CV | Tien Nguyen Minh',
		metaDescription: 'A warm personal CV for Tien Nguyen Minh, rewritten for a future lover.',
		heroEyebrow: 'Candidate CV',
		title: 'Tien Nguyen Minh',
		lead: 'Senior Software Engineer, backend systems builder, game-server caretaker, and candidate for one emotionally responsible long-term partnership.',
		summaryAria: 'Candidate summary',
		strengthsEyebrow: 'Core strengths',
		strengthsTitle: 'Why shortlist this candidate.',
		strengths: [
			{
				title: 'Reliable under load',
				body: 'Senior Software Engineer at ZingPlay Game Studios, VNG Corp., with 5+ years building and operating real-time multiplayer game backends.'
			},
			{
				title: 'Builder mindset',
				body: 'Comfortable turning vague ideas into running systems with Java, Go, TypeScript, Docker, CI, and a lot of practical debugging.'
			},
			{
				title: 'Long-game thinker',
				body: 'Maintains production systems, tests release-critical flows, and prefers durable fixes over dramatic hot takes.'
			},
			{
				title: 'Still improving',
				body: 'Active curriculum includes clearer communication, better routines, deeper empathy, and remembering that rest is also a feature.'
			}
		],
		factsEyebrow: 'Reference sheet',
		factsTitle: 'Useful facts.',
		facts: [
			['Current role', 'Senior Software Engineer'],
			['Main craft', 'Backend systems for multiplayer games'],
			['Languages', 'Java, Go, TypeScript, Shell'],
			['Location', 'Ho Chi Minh City, Vietnam'],
			['Education', 'Computer Science and Engineering, HCMUT'],
			['Relationship mode', 'Static site first, real conversation later']
		],
		closingEyebrow: 'Closing statement',
		closingTitle: 'The honest version.',
		closingBody:
			'I am not a perfect product. I am a maintained system: observable, sometimes stubborn, generally reliable, and much better with the right person reviewing the roadmap.'
	}
};

<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import {
		copy,
		initializePreferences,
		locale,
		localeOptions,
		setLocale,
		setTheme,
		theme,
		themeOptions
	} from '$lib/i18n/preferences';
	import { onMount } from 'svelte';
	import '../app.css';

	let { children } = $props();

	const navItems = /** @type {const} */ ([
		{ path: '/', labelKey: 'home', routeId: '/' },
		{ path: '/jd/', labelKey: 'jd', routeId: '/jd' },
		{ path: '/cv/', labelKey: 'cv', routeId: '/cv' }
	]);

	const themeIcons = /** @type {const} */ ({
		light: '☀️',
		dark: '🌙'
	});

	const localeLabels = /** @type {const} */ ({
		vi: 'VI',
		en: 'EN'
	});

	onMount(initializePreferences);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Dating JD & CV" />
	<meta
		property="og:image"
		content="https://tiennm99.github.io/dating/assets/social/dating-jd-cv-social-preview.png"
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Warm dating application packet illustration" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:image"
		content="https://tiennm99.github.io/dating/assets/social/dating-jd-cv-social-preview.png"
	/>
</svelte:head>

<a class="skip-link" href="#content">{$copy.layout.skipLink}</a>

<header class="site-shell site-header">
	<a class="brand-mark" href={resolve('/')} aria-label={$copy.layout.homeAria}>
		<span class="brand-seal">TN</span>
		<span>{$copy.layout.brand}</span>
	</a>

	<div class="header-actions">
		<nav aria-label={$copy.layout.primaryNavAria}>
			{#each navItems as item (item.path)}
				<a
					href={resolve(item.path)}
					class:active={page.route.id === item.routeId}
					aria-current={page.route.id === item.routeId ? 'page' : undefined}
				>
					{$copy.nav[item.labelKey]}
				</a>
			{/each}
		</nav>

		<div class="preference-controls">
			<div
				class="segmented-control icon-segmented"
				role="group"
				aria-label={$copy.controls.themeGroup}
			>
				{#each themeOptions as option (option)}
					<button
						type="button"
						class:active={$theme === option}
						aria-label={$copy.controls.themeActions[option]}
						aria-pressed={$theme === option}
						title={$copy.controls.themeActions[option]}
						onclick={() => setTheme(option)}
					>
						<span class="emoji-icon" aria-hidden="true">{themeIcons[option]}</span>
					</button>
				{/each}
			</div>

			<div
				class="segmented-control icon-segmented"
				role="group"
				aria-label={$copy.controls.languageGroup}
			>
				{#each localeOptions as option (option)}
					<button
						type="button"
						class:active={$locale === option}
						aria-label={$copy.controls.languageActions[option]}
						aria-pressed={$locale === option}
						title={$copy.controls.languageActions[option]}
						onclick={() => setLocale(option)}
					>
						<span class="locale-code" aria-hidden="true">{localeLabels[option]}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
</header>

<main id="content">
	{@render children()}
</main>

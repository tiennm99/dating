<script lang="ts">
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

	const navItems = [
		{ href: resolve('/'), labelKey: 'home', routeId: '/' },
		{ href: resolve('/jd/'), labelKey: 'jd', routeId: '/jd' },
		{ href: resolve('/cv/'), labelKey: 'cv', routeId: '/cv' }
	] as const;

	const themeIcons = {
		light: '☀️',
		dark: '🌙'
	} as const;

	onMount(initializePreferences);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a class="skip-link" href="#content">{$copy.layout.skipLink}</a>

<header class="site-shell site-header">
	<a class="brand-mark" href={resolve('/')} aria-label={$copy.layout.homeAria}>
		<span class="brand-seal">TN</span>
		<span>{$copy.layout.brand}</span>
	</a>

	<div class="header-actions">
		<nav aria-label={$copy.layout.primaryNavAria}>
			{#each navItems as item (item.href)}
				<a
					href={item.href}
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
						<span aria-hidden="true">{themeIcons[option]}</span>
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
						{#if option === 'en'}
							<svg class="flag-icon" viewBox="0 0 24 16" aria-hidden="true" focusable="false">
								<rect width="24" height="16" fill="#fff" />
								<path
									d="M0 0h24v1.23H0zM0 2.46h24v1.23H0zM0 4.92h24v1.23H0zM0 7.38h24v1.23H0zM0 9.84h24v1.23H0zM0 12.3h24v1.23H0zM0 14.76h24V16H0z"
									fill="#b22234"
								/>
								<rect width="10.8" height="8.62" fill="#3c3b6e" />
								<g fill="#fff">
									<circle cx="1.6" cy="1.3" r="0.32" />
									<circle cx="3.2" cy="1.3" r="0.32" />
									<circle cx="4.8" cy="1.3" r="0.32" />
									<circle cx="6.4" cy="1.3" r="0.32" />
									<circle cx="8" cy="1.3" r="0.32" />
									<circle cx="2.4" cy="2.6" r="0.32" />
									<circle cx="4" cy="2.6" r="0.32" />
									<circle cx="5.6" cy="2.6" r="0.32" />
									<circle cx="7.2" cy="2.6" r="0.32" />
									<circle cx="8.8" cy="2.6" r="0.32" />
									<circle cx="1.6" cy="3.9" r="0.32" />
									<circle cx="3.2" cy="3.9" r="0.32" />
									<circle cx="4.8" cy="3.9" r="0.32" />
									<circle cx="6.4" cy="3.9" r="0.32" />
									<circle cx="8" cy="3.9" r="0.32" />
								</g>
							</svg>
						{:else}
							<svg class="flag-icon" viewBox="0 0 24 16" aria-hidden="true" focusable="false">
								<rect width="24" height="16" fill="#da251d" />
								<path
									d="M12 3.1l1.13 3.47h3.64l-2.95 2.15 1.13 3.47L12 10.04 9.05 12.19l1.13-3.47-2.95-2.15h3.64L12 3.1z"
									fill="#ffde00"
								/>
							</svg>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
</header>

<main id="content">
	{@render children()}
</main>

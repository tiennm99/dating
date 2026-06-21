<script lang="ts">
	import { resolve } from '$app/paths';
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
		{ href: resolve('/'), labelKey: 'home' },
		{ href: resolve('/jd/'), labelKey: 'jd' },
		{ href: resolve('/cv/'), labelKey: 'cv' }
	] as const;

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
				<a href={item.href}>{$copy.nav[item.labelKey]}</a>
			{/each}
		</nav>

		<div class="preference-controls">
			<div class="preference-group" role="group" aria-label={$copy.controls.themeGroup}>
				<span class="preference-label">{$copy.controls.themeGroup}</span>
				<div class="segmented-control">
					{#each themeOptions as option (option)}
						<button
							type="button"
							class:active={$theme === option}
							aria-label={$copy.controls.themeActions[option]}
							aria-pressed={$theme === option}
							onclick={() => setTheme(option)}
						>
							{$copy.controls.themes[option]}
						</button>
					{/each}
				</div>
			</div>

			<div class="preference-group" role="group" aria-label={$copy.controls.languageGroup}>
				<span class="preference-label">{$copy.controls.languageGroup}</span>
				<div class="segmented-control">
					{#each localeOptions as option (option)}
						<button
							type="button"
							class:active={$locale === option}
							aria-label={$copy.controls.languageActions[option]}
							aria-pressed={$locale === option}
							onclick={() => setLocale(option)}
						>
							{$copy.controls.languages[option]}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</header>

<main id="content">
	{@render children()}
</main>

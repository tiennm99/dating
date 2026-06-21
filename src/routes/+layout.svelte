<script lang="ts">
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();

	const navItems = [
		{ href: resolve('/'), label: 'Home' },
		{ href: resolve('/jd/'), label: 'JD' },
		{ href: resolve('/cv/'), label: 'CV' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a class="skip-link" href="#content">Skip to content</a>

<header class="site-shell site-header">
	<a class="brand-mark" href={resolve('/')} aria-label="Dating JD & CV home">
		<span class="brand-seal">TN</span>
		<span>Dating JD & CV</span>
	</a>

	<nav aria-label="Primary navigation">
		{#each navItems as item (item.href)}
			<a href={item.href}>{item.label}</a>
		{/each}
	</nav>
</header>

<main id="content">
	{@render children()}
</main>

<script lang="ts">
	import { resolve } from '$app/paths';
	import heroImage from '$lib/assets/generated/dating-application-hero-background.webp';
	import { copy } from '$lib/i18n/preferences';
</script>

<svelte:head>
	<title>{$copy.home.metaTitle}</title>
	<meta name="description" content={$copy.home.metaDescription} />
</svelte:head>

<section class="home-hero" style={`--hero-image: url(${heroImage});`}>
	<div class="site-shell hero-copy">
		<p class="eyebrow">{$copy.home.heroEyebrow}</p>
		<h1>{$copy.home.title}</h1>
		<p class="lead">{$copy.home.lead}</p>
		<div class="button-row">
			<a class="button" href={resolve('/jd/')}>{$copy.home.primaryCta}</a>
			<a class="button secondary" href={resolve('/cv/')}>{$copy.home.secondaryCta}</a>
		</div>
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="packet-title">
	<div>
		<p class="eyebrow">{$copy.home.packetEyebrow}</p>
		<h2 id="packet-title">{$copy.home.packetTitle}</h2>
	</div>
	<div class="panel-list">
		<article class="panel strong">
			<h3>{$copy.home.futureLoverTitle}</h3>
			<p>{$copy.home.futureLoverBody}</p>
		</article>
		<article class="panel">
			<h3>{$copy.home.committeeTitle}</h3>
			<p>{$copy.home.committeeBody}</p>
		</article>
	</div>
</section>

<style>
	.home-hero {
		min-height: min(760px, 82dvh);
		display: flex;
		align-items: center;
		margin-top: -5rem;
		padding-top: 6rem;
		background-position: center;
		background-size: cover;
		background-image:
			linear-gradient(
				90deg,
				var(--hero-overlay-start),
				var(--hero-overlay-mid),
				var(--hero-overlay-end)
			),
			var(--hero-image);
		color: var(--hero-ink);
	}

	.hero-copy {
		padding-block: clamp(5rem, 12vw, 8rem);
	}

	.hero-copy .lead {
		margin-top: 1.5rem;
		color: var(--hero-muted);
	}

	.hero-copy .eyebrow {
		color: var(--hero-accent);
	}

	.hero-copy .button.secondary {
		border-color: var(--hero-border);
		color: var(--hero-ink);
	}
</style>

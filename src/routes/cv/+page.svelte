<script lang="ts">
	import { copy } from '$lib/i18n/preferences';
</script>

<svelte:head>
	<title>{$copy.cv.metaTitle}</title>
	<meta name="description" content={$copy.cv.metaDescription} />
</svelte:head>

<section class="site-shell page-section cv-hero">
	<p class="eyebrow">{$copy.cv.heroEyebrow}</p>
	<h1>{$copy.cv.title}</h1>
	<p class="lead">{$copy.cv.lead}</p>
	<div class="meta-grid" aria-label={$copy.cv.summaryAria}>
		{#each $copy.cv.facts.slice(0, 3) as fact (fact[0])}
			<div><span>{fact[0]}</span>{fact[1]}</div>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="strengths-title">
	<div>
		<p class="eyebrow">{$copy.cv.strengthsEyebrow}</p>
		<h2 id="strengths-title">{$copy.cv.strengthsTitle}</h2>
	</div>
	<div class="panel-list">
		{#each $copy.cv.strengths as strength (strength.title)}
			<article class="panel">
				<h3>{strength.title}</h3>
				<p>{strength.body}</p>
			</article>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="facts-title">
	<div>
		<p class="eyebrow">{$copy.cv.factsEyebrow}</p>
		<h2 id="facts-title">{$copy.cv.factsTitle}</h2>
	</div>
	<div class="facts-list">
		{#each $copy.cv.facts as fact (fact[0])}
			<div>
				<span>{fact[0]}</span>
				<strong>{fact[1]}</strong>
			</div>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="closing-title">
	<div>
		<p class="eyebrow">{$copy.cv.closingEyebrow}</p>
		<h2 id="closing-title">{$copy.cv.closingTitle}</h2>
	</div>
	<article class="panel strong">
		<p>{$copy.cv.closingBody}</p>
	</article>
</section>

<style>
	.cv-hero {
		padding-top: clamp(4rem, 10vw, 8rem);
	}

	.facts-list {
		display: grid;
		gap: 1px;
		background: var(--line);
	}

	.facts-list div {
		display: grid;
		grid-template-columns: minmax(9rem, 0.7fr) 1fr;
		gap: 1rem;
		background: var(--panel-bg);
		padding: 1rem;
	}

	.facts-list span {
		color: var(--blueprint);
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	@media (max-width: 620px) {
		.facts-list div {
			grid-template-columns: 1fr;
		}
	}
</style>

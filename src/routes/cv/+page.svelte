<script lang="ts">
	import { cvFacts, cvStrengths } from '$lib/site-content';
</script>

<svelte:head>
	<title>CV | Tien Nguyen Minh</title>
	<meta
		name="description"
		content="A warm personal CV for Tien Nguyen Minh, rewritten for a future lover."
	/>
</svelte:head>

<section class="site-shell page-section cv-hero">
	<p class="eyebrow">Candidate CV</p>
	<h1>Tien Nguyen Minh</h1>
	<p class="lead">
		Senior Software Engineer, backend systems builder, game-server caretaker, and candidate for one
		emotionally responsible long-term partnership.
	</p>
	<div class="meta-grid" aria-label="Candidate summary">
		{#each cvFacts.slice(0, 3) as fact (fact[0])}
			<div><span>{fact[0]}</span>{fact[1]}</div>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="strengths-title">
	<div>
		<p class="eyebrow">Core strengths</p>
		<h2 id="strengths-title">Why shortlist this candidate.</h2>
	</div>
	<div class="panel-list">
		{#each cvStrengths as strength (strength.title)}
			<article class="panel">
				<h3>{strength.title}</h3>
				<p>{strength.body}</p>
			</article>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="facts-title">
	<div>
		<p class="eyebrow">Reference sheet</p>
		<h2 id="facts-title">Useful facts.</h2>
	</div>
	<div class="facts-list">
		{#each cvFacts as fact (fact[0])}
			<div>
				<span>{fact[0]}</span>
				<strong>{fact[1]}</strong>
			</div>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="closing-title">
	<div>
		<p class="eyebrow">Closing statement</p>
		<h2 id="closing-title">The honest version.</h2>
	</div>
	<article class="panel strong">
		<p>
			I am not a perfect product. I am a maintained system: observable, sometimes stubborn,
			generally reliable, and much better with the right person reviewing the roadmap.
		</p>
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
		background: rgba(247, 244, 237, 0.86);
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

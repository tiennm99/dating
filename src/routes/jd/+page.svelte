<script>
	import { copy } from '$lib/site-copy';
</script>

<svelte:head>
	<title>{copy.jd.metaTitle}</title>
	<meta name="description" content={copy.jd.metaDescription} />
	<meta property="og:title" content={copy.jd.metaTitle} />
	<meta property="og:description" content={copy.jd.metaDescription} />
</svelte:head>

<section class="site-shell page-section jd-hero">
	<p class="eyebrow">{copy.jd.heroEyebrow}</p>
	<h1>{copy.jd.title}</h1>
	<p class="lead">{copy.jd.lead}</p>
	<div class="meta-grid" role="group" aria-label={copy.jd.summaryAria}>
		{#each copy.jd.summary as fact (fact[0])}
			<div><span>{fact[0]}</span>{fact[1]}</div>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="benefits-title">
	<div>
		<p class="eyebrow">{copy.jd.benefitsEyebrow}</p>
		<h2 id="benefits-title">{copy.jd.benefitsTitle}</h2>
	</div>
	<div class="panel-list">
		{#each copy.jd.benefits as benefit (benefit)}
			<article class="panel">
				<p>{benefit}</p>
			</article>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="responsibilities-title">
	<div>
		<p class="eyebrow">{copy.jd.responsibilitiesEyebrow}</p>
		<h2 id="responsibilities-title">{copy.jd.responsibilitiesTitle}</h2>
	</div>
	<div class="panel-list">
		<article class="panel strong">
			<ul>
				{#each copy.jd.responsibilities as responsibility (responsibility)}
					<li>{responsibility}</li>
				{/each}
			</ul>
		</article>
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="process-title">
	<div>
		<p class="eyebrow">{copy.jd.niceEyebrow}</p>
		<h2 id="process-title">{copy.jd.processTitle}</h2>
	</div>
	<div class="panel-list">
		<article class="panel">
			<ul>
				{#each copy.jd.niceToHave as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</article>
		<article class="panel">
			<h3>{copy.jd.selectionTitle}</h3>
			<p>{copy.jd.selectionBody}</p>
		</article>
	</div>
</section>

<style>
	.jd-hero {
		padding-top: clamp(4rem, 10vw, 8rem);
	}
</style>

<script lang="ts">
	import { niceToHave, roleBenefits, roleResponsibilities } from '$lib/site-content';
</script>

<svelte:head>
	<title>JD | Future Lover Role</title>
	<meta
		name="description"
		content="Rights, benefits, responsibilities, and selection notes for the future lover role."
	/>
</svelte:head>

<section class="site-shell page-section jd-hero">
	<p class="eyebrow">Job description</p>
	<h1>Future Lover</h1>
	<p class="lead">
		This is a long-term, human-facing role. The compensation package is mostly attention, loyalty,
		shared meals, private jokes, and someone who will try again after mistakes.
	</p>
	<div class="meta-grid" aria-label="Role summary">
		<div><span>Type</span>Full-time heart, flexible schedule</div>
		<div><span>Location</span>Mostly Earth, sometimes HCMC</div>
		<div><span>Start date</span>When trust passes review</div>
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="benefits-title">
	<div>
		<p class="eyebrow">Rights & benefits</p>
		<h2 id="benefits-title">What you receive.</h2>
	</div>
	<div class="panel-list">
		{#each roleBenefits as benefit (benefit)}
			<article class="panel">
				<p>{benefit}</p>
			</article>
		{/each}
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="responsibilities-title">
	<div>
		<p class="eyebrow">Responsibilities</p>
		<h2 id="responsibilities-title">What we both protect.</h2>
	</div>
	<div class="panel-list">
		<article class="panel strong">
			<ul>
				{#each roleResponsibilities as responsibility (responsibility)}
					<li>{responsibility}</li>
				{/each}
			</ul>
		</article>
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="process-title">
	<div>
		<p class="eyebrow">Nice to have</p>
		<h2 id="process-title">Interview process.</h2>
	</div>
	<div class="panel-list">
		<article class="panel">
			<ul>
				{#each niceToHave as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</article>
		<article class="panel">
			<h3>Selection notes</h3>
			<p>
				No pressure test. No hidden puzzle round. Strong candidates are kind when tired, direct when
				confused, and willing to choose each other in small boring moments.
			</p>
		</article>
	</div>
</section>

<style>
	.jd-hero {
		padding-top: clamp(4rem, 10vw, 8rem);
	}
</style>

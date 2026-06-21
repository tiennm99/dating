<script lang="ts">
	import { resolve } from '$app/paths';
	import heroImage from '$lib/assets/offer-letter-hero.png';
</script>

<svelte:head>
	<title>Tien Nguyen Minh | Dating JD & CV</title>
	<meta
		name="description"
		content="A warm-witty dating job description and CV for Tien Nguyen Minh."
	/>
</svelte:head>

<section
	class="home-hero"
	style={`background-image: linear-gradient(90deg, rgba(29, 41, 48, 0.84), rgba(29, 41, 48, 0.48), rgba(29, 41, 48, 0.1)), url(${heroImage});`}
>
	<div class="site-shell hero-copy">
		<p class="eyebrow">Open role / long-term partner</p>
		<h1>Tien Nguyen Minh</h1>
		<p class="lead">
			A small application packet for one future lover: equal parts job description, personal CV, and
			honest invitation to build something kind.
		</p>
		<div class="button-row">
			<a class="button" href={resolve('/jd/')}>Read the JD</a>
			<a class="button secondary" href={resolve('/cv/')}>Review the CV</a>
		</div>
	</div>
</section>

<section class="site-shell page-section section-grid" aria-labelledby="packet-title">
	<div>
		<p class="eyebrow">Application packet</p>
		<h2 id="packet-title">A serious joke, lightly managed.</h2>
	</div>
	<div class="panel-list">
		<article class="panel strong">
			<h3>For the future lover</h3>
			<p>
				The JD explains what this role receives: steadiness, attention, humor, emotional
				maintenance, and a partner who treats care as daily work, not launch-day theater.
			</p>
		</article>
		<article class="panel">
			<h3>For the hiring committee</h3>
			<p>
				The CV summarizes the applicant: software engineer, systems thinker, patient debugger, and
				human still actively refactoring bad habits.
			</p>
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
		color: white;
	}

	.hero-copy {
		padding-block: clamp(5rem, 12vw, 8rem);
	}

	.hero-copy .lead {
		margin-top: 1.5rem;
		color: rgba(255, 255, 255, 0.86);
	}

	.hero-copy .eyebrow {
		color: #f3c36f;
	}

	.hero-copy .button.secondary {
		border-color: rgba(255, 255, 255, 0.72);
		color: white;
	}
</style>

<script lang="ts">
	import Nav from '$lib/components/landing/Nav.svelte';
	import HeroScanner from '$lib/components/landing/HeroScanner.svelte';
	import Steps from '$lib/components/landing/Steps.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import Testimonials from '$lib/components/landing/Testimonials.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
</script>

<svelte:head>
	<title>SmartDoc — Resi & invoice, jadi data yang rapi.</title>
	<meta name="description" content="Upload resi atau invoice, ekstrak data otomatis via AI, periksa, dan ekspor ke spreadsheet." />
</svelte:head>

<Nav />

<div class="shell">
	<header class="hero">
		<div>
			<div class="eyebrow">
				<span class="eyebrow-dot">✦</span>
				<span><strong>Baru</strong> · Ekstraksi multi-format & batch upload</span>
			</div>
			<h1>Resi & invoice,<br/>jadi <em>data yang rapi.</em></h1>
			<p class="lede">
				Upload foto struk atau scan invoice — vendor, tanggal, total, dan tiap item
				terekstrak otomatis. Siap diperiksa, dikategorikan, dan diekspor ke
				spreadsheet Anda.
			</p>
			<div class="hero-ctas">
				<a href="/upload" class="btn btn-primary hero-btn">
					Mulai sekarang
					<svg class="arrow" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
				</a>
				<a href="/inbox" class="btn btn-ghost hero-btn">Lihat inbox</a>
			</div>
			<div class="hero-meta">
				<span>Ekstraksi otomatis via AI</span>
				<span class="dot"></span>
				<span>JPG · PNG · PDF · WebP</span>
			</div>
		</div>

		<HeroScanner />
	</header>

	<Steps />

	<Features />

	<Testimonials />

	<!-- Final CTA -->
	<section class="cta-final">
		<h2>Berhenti retype <em>resi</em>.</h2>
		<p>Upload dokumen pertama Anda, lihat hasilnya dalam detik.</p>
		<div class="btns">
			<a href="/upload" class="btn btn-primary cta-btn">
				Mulai sekarang
				<svg class="arrow" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</a>
			<a href="/inbox" class="btn btn-ghost cta-btn">Lihat inbox</a>
		</div>
	</section>

	<Footer />
</div>

<style>
	/* Hero */
	.hero {
		padding: 64px 0 40px;
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 64px;
		align-items: center;
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 6px 12px 6px 8px;
		border-radius: 999px;
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		font-size: 12.5px;
		color: var(--ink-soft);
		margin-bottom: 28px;
	}
	.eyebrow-dot {
		width: 18px; height: 18px;
		border-radius: 999px;
		background: var(--brand-soft);
		color: var(--brand);
		display: grid;
		place-items: center;
		font-size: 11px;
		font-weight: 700;
	}
	.eyebrow strong { color: var(--ink); font-weight: 600; }

	h1 {
		font-family: var(--font-display);
		font-size: clamp(46px, 6.4vw, 88px);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.035em;
		margin: 0 0 24px;
		text-wrap: balance;
	}
	.lede {
		font-size: 18.5px;
		line-height: 1.5;
		color: var(--ink-soft);
		max-width: 480px;
		margin: 0 0 32px;
		text-wrap: pretty;
	}
	.hero-ctas {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 28px;
	}
	.hero-btn { height: 50px; padding: 0 22px; font-size: 15px; }
	.hero-meta {
		display: flex;
		align-items: center;
		gap: 18px;
		font-size: 13px;
		color: var(--ink-mute);
	}
	.dot {
		width: 4px; height: 4px;
		border-radius: 999px;
		background: currentColor;
		opacity: 0.5;
	}

	/* Final CTA */
	.cta-final {
		padding: 120px 0 80px;
		text-align: center;
	}
	.cta-final h2 {
		font-size: clamp(48px, 7vw, 96px);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.04em;
		margin: 0 auto 22px;
		max-width: 12ch;
		text-wrap: balance;
	}
	.cta-final p {
		color: var(--ink-soft);
		font-size: 18px;
		max-width: 520px;
		margin: 0 auto 32px;
	}
	.btns { display: inline-flex; gap: 14px; }
	.cta-btn { height: 52px; padding: 0 24px; font-size: 15.5px; }

	@media (max-width: 1080px) {
		.hero { grid-template-columns: 1fr; gap: 48px; }
	}
</style>

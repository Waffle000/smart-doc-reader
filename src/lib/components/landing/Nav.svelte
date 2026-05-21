<script lang="ts">
	import { page } from '$app/stores';
	let { currentPage = '' }: { currentPage?: string } = $props();
</script>

<div class="shell" style="z-index: 50;">
<nav class="nav">
	<a href="/" class="brand">
		<span class="brand-mark">S</span>
		SmartDoc
	</a>
	<div class="nav-links">
		<a href="/#how">Cara Kerja</a>
		<a href="/#fitur">Fitur</a>
		<a href="/#testimoni">Testimoni</a>
		{#if $page.data.user}
			<a href="/inbox">Inbox</a>
			<a href="/upload">Upload</a>
		{/if}
	</div>
	<div class="nav-cta relative">
		{#if $page.data.user}
			<div class="group relative">
				<!-- Avatar trigger -->
				<button class="flex items-center gap-3 hover:bg-brand/5 p-1.5 pr-3 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand/20">
					<div class="w-8 h-8 rounded-full bg-brand text-bg flex items-center justify-center font-serif italic text-sm">
						{$page.data.user.name.charAt(0).toUpperCase()}
					</div>
					<span class="text-sm font-medium text-brand hidden sm:block">{$page.data.user.name}</span>
					<svg class="w-4 h-4 text-brand/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
				</button>

				<!-- Dropdown Menu -->
				<div class="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
					<div class="w-56 bg-white rounded-2xl border border-brand/10 shadow-lg p-2 relative overflow-hidden">
						<!-- Grain background -->
						<div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
						
						<div class="px-3 py-2 mb-2 border-b border-brand/5 relative z-10">
							<div class="text-sm font-medium text-brand truncate">{$page.data.user.name}</div>
							<div class="text-xs text-brand/50 font-mono truncate mt-0.5">{$page.data.user.email}</div>
						</div>
						
						<div class="flex flex-col gap-1 relative z-10">
							<a href="/profile" class="px-3 py-2 text-sm text-brand rounded-xl hover:bg-brand/5 transition-colors flex items-center gap-2">
								<svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
								Profil Saya
							</a>
							<a href="/logout" class="px-3 py-2 text-sm text-warn rounded-xl hover:bg-warn/10 transition-colors flex items-center gap-2">
								<svg class="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
								Keluar
							</a>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<a href="/login" class="btn btn-link" style="font-size:14px">Masuk</a>
			<a href="/register" class="btn btn-primary">Daftar</a>
		{/if}
	</div>
</nav>
</div>

<style>
	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22px 0;
		border-bottom: 1px solid var(--line-soft);
		position: relative;
		z-index: 50;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		letter-spacing: -0.01em;
		font-size: 18px;
		text-decoration: none;
	}
	.brand-mark {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--brand);
		color: var(--bg);
		display: grid;
		place-items: center;
		font-family: var(--font-serif);
		font-size: 18px;
		font-style: italic;
		line-height: 1;
		padding-bottom: 2px;
	}
	.nav-links {
		display: flex;
		align-items: center;
		gap: 28px;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.nav-links a { transition: color .15s; }
	.nav-links a:hover { color: var(--ink); }
	.nav-cta {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	@media (max-width: 720px) {
		.nav-links { display: none; }
	}
</style>

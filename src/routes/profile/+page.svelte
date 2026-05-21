<script lang="ts">
	import Nav from '$lib/components/landing/Nav.svelte';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Profil — Smart Doc Reader</title>
</svelte:head>

<Nav />

<main class="max-w-[500px] mx-auto mt-16 px-4 pb-20">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-display font-medium text-brand">Profil Saya</h1>
	</div>

	<div class="bg-white p-8 rounded-[22px] border border-brand/10 shadow-sm relative overflow-hidden flex flex-col items-center">
		<!-- Subtle grain inside card too -->
		<div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
		
		<div class="w-24 h-24 rounded-full bg-brand text-bg flex items-center justify-center font-serif italic text-4xl mb-6 relative z-10 shadow-md">
			{data.user?.name.charAt(0).toUpperCase()}
		</div>
		
		<div class="w-full space-y-4 relative z-10 text-left mb-8">
			<div class="bg-bg border border-brand/10 rounded-xl p-4">
				<div class="text-[10px] font-mono text-brand/50 uppercase tracking-widest mb-1">Nama Lengkap</div>
				<div class="text-brand font-medium">{data.user?.name}</div>
			</div>
			
			<div class="bg-bg border border-brand/10 rounded-xl p-4">
				<div class="text-[10px] font-mono text-brand/50 uppercase tracking-widest mb-1">Email</div>
				<div class="text-brand font-mono text-sm">{data.user?.email}</div>
			</div>

			<div class="bg-bg border border-brand/10 rounded-xl p-4">
				<div class="text-[10px] font-mono text-brand/50 uppercase tracking-widest mb-1">Anggota Sejak</div>
				<div class="text-brand text-sm">
					{new Date(data.user?.createdAt || Date.now()).toLocaleDateString('id-ID', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}
				</div>
			</div>
		</div>

		<a href="/logout" class="btn relative z-10 w-full justify-center py-3 rounded-xl font-medium" style="background: var(--warn); color: white;">
			Keluar dari Akun
		</a>
	</div>
</main>

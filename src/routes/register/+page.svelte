<script lang="ts">
	import { enhance } from '$app/forms';
	import Nav from '$lib/components/landing/Nav.svelte';
	import type { ActionData } from './$types';

	let { form } = $props<{ form: ActionData }>();
	let loading = $state(false);
	let showPassword = $state(false);
</script>

<svelte:head>
	<title>Register — Smart Doc Reader</title>
</svelte:head>

<Nav />

<main class="max-w-[400px] mx-auto mt-24 px-4 pb-20">
	<div class="mb-8 text-center">
		<h1 class="text-3xl font-display font-medium text-brand mb-2">Buat Akun</h1>
		<p class="text-brand/60">Daftar untuk mulai mengelola resi Anda.</p>
	</div>

	<div class="bg-white p-8 rounded-[22px] border border-brand/10 shadow-sm relative overflow-hidden">
		<!-- Subtle grain inside card too -->
		<div class="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
		
		<form method="POST" use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}} class="space-y-5 relative z-10">

			<div class="space-y-1.5">
				<label for="name" class="text-xs font-mono text-brand/60 uppercase tracking-wider">Nama Lengkap</label>
				<input 
					type="text" 
					id="name" 
					name="name" 
					required 
					value={form?.name ?? ''}
					class="w-full bg-bg border border-brand/10 rounded-xl px-4 py-3 text-brand outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10 transition-all {form?.error ? 'border-warn/50 focus:border-warn focus:ring-warn/10' : ''}"
					placeholder="John Doe"
				/>
			</div>

			<div class="space-y-1.5">
				<label for="email" class="text-xs font-mono text-brand/60 uppercase tracking-wider">Email</label>
				<input 
					type="email" 
					id="email" 
					name="email" 
					required 
					value={form?.email ?? ''}
					class="w-full bg-bg border border-brand/10 rounded-xl px-4 py-3 text-brand outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10 transition-all {form?.error ? 'border-warn/50 focus:border-warn focus:ring-warn/10' : ''}"
					placeholder="nama@email.com"
				/>
			</div>

			<div class="space-y-1.5 relative">
				<label for="password" class="text-xs font-mono text-brand/60 uppercase tracking-wider">Password</label>
				<div class="relative">
					<input 
						type={showPassword ? 'text' : 'password'}
						id="password" 
						name="password" 
						required 
						minlength="8"
						class="w-full bg-bg border border-brand/10 rounded-xl px-4 py-3 pr-12 text-brand outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10 transition-all {form?.error ? 'border-warn/50 focus:border-warn focus:ring-warn/10' : ''}"
						placeholder="Minimal 8 karakter"
					/>
					<button type="button" class="absolute right-4 top-1/2 -translate-y-1/2 text-brand/40 hover:text-brand/80 transition-colors" onclick={() => showPassword = !showPassword} aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}>
						{#if showPassword}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.29-3.29"></path></svg>
						{:else}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
						{/if}
					</button>
				</div>
			</div>

			{#if form?.error}
				<div class="text-warn text-sm font-mono flex items-center gap-2 mt-1 fade-in">
					<div class="w-1.5 h-1.5 rounded-full bg-warn shrink-0"></div>
					{form.error}
				</div>
			{/if}

			<button type="submit" disabled={loading} class="btn btn-primary w-full justify-center mt-2">
				{#if loading}
					Memproses...
				{:else}
					Daftar
				{/if}
			</button>
		</form>
		
		<div class="mt-6 text-center text-sm text-brand/60 relative z-10">
			Sudah punya akun? <a href="/login" class="text-brand font-medium hover:underline">Masuk</a>
		</div>
	</div>
</main>

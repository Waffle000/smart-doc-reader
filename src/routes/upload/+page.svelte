<script lang="ts">
	import { enhance } from '$app/forms';
	import Nav from '$lib/components/landing/Nav.svelte';
	import { Upload } from 'lucide-svelte';

	let { form } = $props();

	let selectedFile = $state<File | null>(null);
	let dragging = $state(false);
	let uploading = $state(false);

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) selectedFile = file;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragging = true;
	}

	function handleDragLeave() { dragging = false; }

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.[0]) selectedFile = input.files[0];
	}
</script>

<svelte:head>
	<title>Upload — SmartDoc</title>
</svelte:head>

<Nav currentPage="upload" />

<div class="shell">
	<div class="page">
		<div class="page-header">
			<div class="section-tag">Upload</div>
			<h1>Upload <em>dokumen</em></h1>
			<p class="lede">Upload resi atau invoice. Data akan diekstrak otomatis via AI.</p>
		</div>

		{#if form?.message}
			<div class="error-msg" role="alert">{form.message}</div>
		{/if}

		<form
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				uploading = true;
				return async ({ update }) => {
					uploading = false;
					await update();
				};
			}}
		>
			<div
				class="dropzone"
				class:dragging
				role="button"
				tabindex="0"
				ondrop={handleDrop}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				onclick={() => document.getElementById('file-input')?.click()}
				onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('file-input')?.click(); }}
			>
				<Upload size={20} strokeWidth={1.5} color="var(--ink-mute)" />
				{#if selectedFile}
					<span class="file-name">{selectedFile.name}</span>
					<span class="file-size">{(selectedFile.size / 1024).toFixed(0)} KB</span>
				{:else}
					<span class="drop-text">Drop file di sini atau klik untuk pilih</span>
					<span class="drop-hint">JPG, PNG, WebP, PDF · maks 10MB</span>
				{/if}
			</div>

			<input
				id="file-input"
				type="file"
				name="file"
				accept="image/jpeg,image/png,image/webp,application/pdf"
				onchange={handleFileChange}
				hidden
			/>

			{#if selectedFile}
				<button type="submit" class="btn btn-primary submit-btn" disabled={uploading}>
					{uploading ? 'Mengunggah...' : 'Upload & ekstrak'}
					{#if !uploading}
						<svg class="arrow" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
					{/if}
				</button>
			{/if}
		</form>
	</div>
</div>

<style>
	.page {
		max-width: 640px;
		margin: 0 auto;
		padding: 64px 0 120px;
	}
	.page-header {
		margin-bottom: 32px;
	}
	h1 {
		font-size: clamp(36px, 5vw, 56px);
		line-height: 1.02;
		letter-spacing: -0.03em;
		margin-bottom: 12px;
	}
	.lede {
		color: var(--ink-soft);
		font-size: 16.5px;
		line-height: 1.5;
	}
	.error-msg {
		background: rgba(197, 83, 46, 0.08);
		border: 1px solid rgba(197, 83, 46, 0.2);
		color: var(--warn);
		padding: 12px 16px;
		border-radius: var(--radius);
		font-size: 14px;
		margin-bottom: 24px;
	}
	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 220px;
		border: 1.5px dashed var(--line);
		border-radius: var(--radius-lg);
		background: var(--bg-elevated);
		cursor: pointer;
		transition: border-color .15s, background .15s, box-shadow .25s;
		padding: 32px;
	}
	.dropzone:hover, .dropzone.dragging {
		border-color: var(--brand);
		background: var(--brand-soft);
		box-shadow: var(--shadow-md);
	}
	.drop-text {
		font-size: 15px;
		font-weight: 500;
		color: var(--ink-soft);
	}
	.drop-hint {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--ink-mute);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.file-name {
		font-weight: 600;
		font-size: 15px;
	}
	.file-size {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--ink-mute);
	}
	.submit-btn {
		margin-top: 24px;
		width: 100%;
		justify-content: center;
		height: 48px;
		font-size: 15px;
	}
	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>

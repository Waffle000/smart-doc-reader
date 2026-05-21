<script lang="ts">
	let {
		open = false,
		title = 'Konfirmasi',
		message = '',
		confirmLabel = 'Ya',
		cancelLabel = 'Batal',
		variant = 'danger',
		onconfirm,
		oncancel
	}: {
		open?: boolean;
		title?: string;
		message?: string;
		confirmLabel?: string;
		cancelLabel?: string;
		variant?: 'danger' | 'warning';
		onconfirm: () => void;
		oncancel: () => void;
	} = $props();

	function onKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') oncancel();
	}

	function onBackdropClick(e: MouseEvent): void {
		if (e.target === e.currentTarget) oncancel();
	}
</script>

{#if open}
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="dialog-backdrop" onclick={onBackdropClick} onkeydown={onKeydown}>
	<div class="dialog-panel" role="alertdialog" aria-labelledby="dlg-title" aria-describedby="dlg-msg">
		<div class="dialog-icon {variant}">
			{#if variant === 'danger'}
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
				</svg>
			{:else}
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
					<path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
				</svg>
			{/if}
		</div>
		<h3 id="dlg-title">{title}</h3>
		<p id="dlg-msg">{message}</p>
		<div class="dialog-actions">
			<button class="dlg-btn dlg-cancel" onclick={oncancel}>{cancelLabel}</button>
			<button class="dlg-btn dlg-confirm {variant}" onclick={onconfirm}>{confirmLabel}</button>
		</div>
	</div>
</div>
{/if}

<style>
	.dialog-backdrop {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: grid;
		place-items: center;
		background: rgba(20, 22, 15, 0.35);
		backdrop-filter: blur(4px);
		animation: fadeIn .15s ease;
	}
	@keyframes fadeIn { from { opacity: 0; } }
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(12px) scale(0.97); }
	}
	.dialog-panel {
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		padding: 32px;
		max-width: 380px;
		width: calc(100vw - 40px);
		box-shadow: var(--shadow-lg);
		text-align: center;
		animation: slideUp .2s ease;
	}
	.dialog-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		margin: 0 auto 16px;
	}
	.dialog-icon.danger {
		background: rgba(197, 83, 46, 0.1);
		color: var(--warn);
	}
	.dialog-icon.warning {
		background: var(--brand-soft);
		color: var(--brand);
	}
	h3 {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 700;
		color: var(--ink);
		margin: 0 0 8px;
	}
	p {
		font-family: var(--font-display);
		font-size: 13.5px;
		color: var(--ink-soft);
		line-height: 1.5;
		margin: 0 0 24px;
	}
	.dialog-actions {
		display: flex;
		gap: 10px;
	}
	.dlg-btn {
		flex: 1;
		padding: 10px 16px;
		border-radius: var(--radius);
		font-family: var(--font-display);
		font-size: 13.5px;
		font-weight: 600;
		cursor: pointer;
		border: 1px solid var(--line);
		transition: all .12s;
	}
	.dlg-cancel {
		background: var(--bg-elevated);
		color: var(--ink-soft);
	}
	.dlg-cancel:hover {
		background: var(--bg);
		color: var(--ink);
	}
	.dlg-confirm.danger {
		background: var(--warn);
		color: #fff;
		border-color: var(--warn);
	}
	.dlg-confirm.danger:hover {
		filter: brightness(1.08);
	}
	.dlg-confirm.warning {
		background: var(--brand);
		color: var(--bg);
		border-color: var(--brand);
	}
	.dlg-confirm.warning:hover {
		background: var(--brand-deep);
	}
</style>

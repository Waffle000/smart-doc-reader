<script lang="ts">
	import type { Confidence } from '$lib/server/db/schema';
	import { confidenceClass, CONFIDENCE_HINT } from '$lib/utils/confidence';

	let {
		label,
		name,
		value,
		confidence = null,
		type = 'text'
	}: {
		label: string;
		name: string;
		value: string | number | null;
		confidence?: Confidence | null;
		type?: string;
	} = $props();

	const cls = $derived(confidenceClass(confidence));
	const hint = $derived(confidence ? CONFIDENCE_HINT[confidence] : '');

	// Number formatting for Indonesian locale (dots for thousands)
	const isNumeric = $derived(type === 'number');

	function formatIdNumber(val: number | null | undefined): string {
		if (val == null || val === 0) return '0';
		return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(val);
	}

	let displayValue = $state(isNumeric ? formatIdNumber(value as number) : String(value ?? ''));
	let isFocused = $state(false);

	function onFocus(): void {
		if (!isNumeric) return;
		isFocused = true;
		// Show raw number on focus for editing
		displayValue = value != null ? String(value) : '';
	}

	function onBlur(e: Event): void {
		if (!isNumeric) return;
		isFocused = false;
		const input = e.target as HTMLInputElement;
		const raw = input.value.replace(/\./g, '').replace(',', '.');
		const parsed = parseFloat(raw);
		if (!isNaN(parsed)) {
			displayValue = formatIdNumber(parsed);
		}
	}

	// Raw value for form submission (hidden input)
	const rawValue = $derived.by(() => {
		if (!isNumeric) return String(value ?? '');
		if (isFocused) return displayValue;
		// Parse from display format
		const raw = displayValue.replace(/\./g, '').replace(',', '.');
		const parsed = parseFloat(raw);
		return isNaN(parsed) ? String(value ?? '') : String(parsed);
	});
</script>

<div class="cf">
	<label class="cf-label" for={name}>
		<span>{label}</span>
		{#if confidence && confidence !== 'high'}
			<span class="cf-conf" title={hint}>
				{confidence === 'low' ? '⚠' : '·'} {confidence}
			</span>
		{/if}
	</label>
	{#if isNumeric}
		<input type="hidden" {name} value={rawValue} />
		<input
			id={name}
			type="text"
			inputmode="numeric"
			bind:value={displayValue}
			class="cf-input {cls}"
			title={hint}
			onfocus={onFocus}
			onblur={onBlur}
		/>
	{:else}
		<input
			id={name}
			{name}
			{type}
			value={value ?? ''}
			class="cf-input {cls}"
			step={type === 'number' ? 'any' : undefined}
			title={hint}
		/>
	{/if}
</div>

<style>
	.cf {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.cf-label {
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--ink-mute);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.cf-conf {
		font-size: 10px;
		color: var(--warn);
		font-weight: 600;
	}
	.cf-input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--line);
		border-radius: var(--radius);
		background: var(--bg-elevated);
		color: var(--ink);
		font-family: var(--font-display);
		font-size: 14.5px;
		font-weight: 500;
		transition: border-color .15s;
	}
	.cf-input:focus {
		outline: none;
		border-color: var(--brand);
	}
</style>

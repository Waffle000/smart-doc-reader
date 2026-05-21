<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Nav from '$lib/components/landing/Nav.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { Search, Download } from 'lucide-svelte';
	import { formatAmount } from '$lib/utils/currency';

	let { data, form } = $props();

	let searchQuery = $state(data.filters.q ?? '');
	let dateFrom = $state(data.filters.from ?? '');
	let dateTo = $state(data.filters.to ?? '');
	let selectedIds = $state<Set<string>>(new Set());

	function toggleSelect(id: string) {
		const next = new Set(selectedIds);
		if (next.has(id)) next.delete(id); else next.add(id);
		selectedIds = next;
	}

	function toggleAll() {
		if (selectedIds.size === data.docs.length) {
			selectedIds = new Set();
		} else {
			selectedIds = new Set(data.docs.map((d) => d.id));
		}
	}

	function exportSelected() {
		const ids = Array.from(selectedIds).join(',');
		window.location.href = `/api/export?ids=${ids}`;
	}

	function applyFilters() {
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (dateFrom) params.set('from', dateFrom);
		if (dateTo) params.set('to', dateTo);
		goto(`/inbox?${params.toString()}`);
	}
</script>

<svelte:head>
	<title>Inbox — SmartDoc</title>
</svelte:head>

<Nav currentPage="inbox" />

<div class="shell">
	<div class="page">
		<div class="page-top">
			<div>
				<div class="section-tag">Inbox</div>
				<h1>Semua <em>dokumen</em></h1>
			</div>
			<a href="/upload" class="btn btn-primary">
				Upload
				<svg class="arrow" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
			</a>
		</div>

		<!-- Filters -->
		<div class="filters">
			<div class="search-wrap">
				<Search size={14} strokeWidth={1.5} color="var(--ink-mute)" />
				<input
					type="text"
					placeholder="Cari vendor..."
					bind:value={searchQuery}
					onkeydown={(e) => { if (e.key === 'Enter') applyFilters(); }}
				/>
			</div>
			<input type="date" class="date-input" bind:value={dateFrom} onchange={applyFilters} />
			<input type="date" class="date-input" bind:value={dateTo} onchange={applyFilters} />
			{#if selectedIds.size > 0}
				<button class="btn btn-ghost" onclick={exportSelected}>
					<Download size={14} strokeWidth={1.5} />
					Export ({selectedIds.size})
				</button>
			{/if}
		</div>

		<!-- Table -->
		{#if data.docs.length === 0}
			<div class="empty">
				<p>Belum ada dokumen.</p>
				<a href="/upload" class="btn btn-primary">Upload pertama</a>
			</div>
		{:else}
			<div class="inbox-frame">
				<div class="inbox-table">
					<!-- Header -->
					<div class="th">
						<button class="check" class:on={selectedIds.size === data.docs.length} onclick={toggleAll}></button>
					</div>
					<div class="th">Vendor</div>
					<div class="th">Tanggal</div>
					<div class="th tr">Total</div>
					<div class="th">Status</div>

					<!-- Rows -->
					{#each data.docs as doc}
						<a class="row" href="/docs/{doc.id}">
							<div class="td">
								<button
									class="check"
									class:on={selectedIds.has(doc.id)}
									onclick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSelect(doc.id); }}
								></button>
							</div>
							<div class="td vendor-cell">
								<div class="thumb"></div>
								<div>
									<div class="name">{doc.vendor ?? doc.filename}</div>
									<div class="meta">{doc.filename}</div>
								</div>
							</div>
							<div class="td">
								{#if doc.invoiceDate}
									{new Date(doc.invoiceDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
								{:else}
									<span class="meta">—</span>
								{/if}
							</div>
							<div class="td tr amt">
								{#if doc.totalAmount}
									{formatAmount(doc.totalAmount, doc.currency ?? 'IDR')}
								{:else}
									<span class="meta">—</span>
								{/if}
							</div>
							<div class="td">
								<StatusBadge status={doc.status} />
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.page {
		padding: 48px 0 120px;
	}
	.page-top {
		display: flex;
		align-items: end;
		justify-content: space-between;
		margin-bottom: 32px;
	}
	h1 {
		font-size: clamp(36px, 5vw, 56px);
		line-height: 1.02;
		letter-spacing: -0.03em;
	}

	/* Filters */
	.filters {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}
	.search-wrap {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 12px;
		height: 38px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg-elevated);
		flex: 1;
		min-width: 200px;
		max-width: 320px;
	}
	.search-wrap input {
		border: none;
		background: transparent;
		font-family: inherit;
		font-size: 13.5px;
		color: var(--ink);
		outline: none;
		flex: 1;
	}
	.search-wrap input::placeholder { color: var(--ink-mute); }
	.date-input {
		height: 38px;
		padding: 0 12px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--bg-elevated);
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--ink-soft);
	}

	/* Inbox frame */
	.inbox-frame {
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}
	.inbox-table {
		display: grid;
		grid-template-columns: 40px 1.4fr 0.8fr 0.8fr 0.6fr;
		font-size: 13.5px;
	}
	.th {
		font-family: var(--font-mono);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		padding: 12px 14px;
		border-bottom: 1px solid var(--line);
		background: var(--bg-elevated);
		display: flex;
		align-items: center;
	}
	.row {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
		text-decoration: none;
		color: inherit;
		transition: background .12s;
		cursor: pointer;
		border-bottom: 1px solid var(--line-soft);
	}
	.row:hover { background: rgba(20, 22, 15, 0.03); }
	.td {
		padding: 14px 14px;
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.tr { text-align: right; justify-content: flex-end; }
	.vendor-cell { gap: 10px; }
	.name { font-weight: 600; }
	.meta { color: var(--ink-mute); font-family: var(--font-mono); font-size: 11.5px; }
	.amt { font-weight: 600; font-variant-numeric: tabular-nums; }
	.thumb {
		width: 28px; height: 36px;
		border-radius: 4px;
		background: var(--bg);
		border: 1px solid var(--line);
		background-image: repeating-linear-gradient(0deg, var(--line) 0 1px, transparent 1px 4px);
		flex-shrink: 0;
	}

	/* Custom checkbox */
	.check {
		width: 16px; height: 16px;
		border: 1.5px solid var(--line);
		border-radius: 4px;
		background: transparent;
		cursor: pointer;
		position: relative;
		padding: 0;
		display: grid;
		place-items: center;
		transition: background .12s, border-color .12s;
	}
	.check.on {
		background: var(--brand);
		border-color: var(--brand);
	}
	.check.on::after {
		content: "✓";
		color: var(--bg);
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		font-size: 11px;
		font-weight: 700;
	}

	/* Empty state */
	.empty {
		text-align: center;
		padding: 80px 24px;
		color: var(--ink-soft);
	}
	.empty p { margin-bottom: 24px; font-size: 16px; }

	@media (max-width: 720px) {
		.inbox-table { grid-template-columns: 36px 1fr 0.6fr 0.5fr; }
		.inbox-table .th:nth-child(5),
		.inbox-table .td:nth-child(5n) { display: none; }
	}
</style>

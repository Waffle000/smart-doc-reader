<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll, beforeNavigate } from '$app/navigation';
	import Nav from '$lib/components/landing/Nav.svelte';
	import ConfidenceField from '$lib/components/ConfidenceField.svelte';
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import { RotateCw, Trash2, Save, Download, ChevronDown } from 'lucide-svelte';

	let { data } = $props();
	let saving = $state(false);
	let showSaveToast = $state(false);
	let showExport = $state(false);
	let isProcessing = $state(data.doc.status === 'uploaded' || data.doc.status === 'processing');

	// Confirm dialog state
	let showDeleteDialog = $state(false);
	let showReextractDialog = $state(false);
	let deleteFormEl: HTMLFormElement | undefined = $state();
	let reextractFormEl: HTMLFormElement | undefined = $state();

	// Warn on SvelteKit navigation
	beforeNavigate(({ cancel }) => {
		if (isProcessing && !confirm('Ekstraksi sedang berjalan. Yakin ingin meninggalkan halaman? Proses tetap berjalan di server.')) {
			cancel();
		}
	});

	// Warn on browser tab close / refresh
	$effect(() => {
		if (!isProcessing) return;
		const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
		window.addEventListener('beforeunload', handler);
		return () => window.removeEventListener('beforeunload', handler);
	});

	let extractionTriggered = $state(false);

	function getExportData(): Record<string, unknown> {
		return {
			vendor: data.ext?.vendor ?? '',
			invoiceDate: data.ext?.invoiceDate ?? '',
			totalAmount: data.ext?.totalAmount ?? 0,
			currency: data.ext?.currency ?? '',
			taxAmount: data.ext?.taxAmount ?? 0,
			subtotal: data.ext?.subtotal ?? 0,
			lineItems: (data.items ?? []).map((item: any) => ({
				description: item.description,
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				total: item.total
			}))
		};
	}

	function downloadFile(content: string, filename: string, type: string): void {
		const blob = new Blob([content], { type });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	function exportCSV(): void {
		const d = getExportData();
		const lines = ['vendor,tanggal,total,mata_uang,pajak,subtotal'];
		lines.push([d.vendor, d.invoiceDate, d.totalAmount, d.currency, d.taxAmount, d.subtotal].join(','));
		if ((d.lineItems as any[]).length > 0) {
			lines.push('');
			lines.push('deskripsi,qty,harga_satuan,total_item');
			for (const item of d.lineItems as any[]) {
				lines.push([item.description, item.quantity, item.unitPrice, item.total].join(','));
			}
		}
		downloadFile(lines.join('\n'), `${d.vendor || 'dokumen'}.csv`, 'text/csv;charset=utf-8');
		showExport = false;
	}

	function exportJSON(): void {
		const d = getExportData();
		downloadFile(JSON.stringify(d, null, 2), `${d.vendor || 'dokumen'}.json`, 'application/json');
		showExport = false;
	}

	function exportExcel(): void {
		const d = getExportData();
		const items = d.lineItems as any[];
		let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
		xml += '<?mso-application progid="Excel.Sheet"?>\n';
		xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
		xml += '<Worksheet ss:Name="Dokumen"><Table>\n';
		xml += '<Row><Cell><Data ss:Type="String">Vendor</Data></Cell><Cell><Data ss:Type="String">Tanggal</Data></Cell><Cell><Data ss:Type="String">Total</Data></Cell><Cell><Data ss:Type="String">Mata Uang</Data></Cell><Cell><Data ss:Type="String">Pajak</Data></Cell><Cell><Data ss:Type="String">Subtotal</Data></Cell></Row>\n';
		xml += `<Row><Cell><Data ss:Type="String">${d.vendor}</Data></Cell><Cell><Data ss:Type="String">${d.invoiceDate}</Data></Cell><Cell><Data ss:Type="Number">${d.totalAmount}</Data></Cell><Cell><Data ss:Type="String">${d.currency}</Data></Cell><Cell><Data ss:Type="Number">${d.taxAmount}</Data></Cell><Cell><Data ss:Type="Number">${d.subtotal}</Data></Cell></Row>\n`;
		if (items.length > 0) {
			xml += '<Row></Row>\n';
			xml += '<Row><Cell><Data ss:Type="String">Deskripsi</Data></Cell><Cell><Data ss:Type="String">Qty</Data></Cell><Cell><Data ss:Type="String">Harga Satuan</Data></Cell><Cell><Data ss:Type="String">Total Item</Data></Cell></Row>\n';
			for (const item of items) {
				xml += `<Row><Cell><Data ss:Type="String">${item.description ?? ''}</Data></Cell><Cell><Data ss:Type="Number">${item.quantity ?? 0}</Data></Cell><Cell><Data ss:Type="Number">${item.unitPrice ?? 0}</Data></Cell><Cell><Data ss:Type="Number">${item.total ?? 0}</Data></Cell></Row>\n`;
			}
		}
		xml += '</Table></Worksheet></Workbook>';
		downloadFile(xml, `${d.vendor || 'dokumen'}.xls`, 'application/vnd.ms-excel');
		showExport = false;
	}

	$effect(() => {
		const status = data.doc.status;
		let pollTimer: ReturnType<typeof setInterval> | undefined;

		if (status === 'uploaded' && !extractionTriggered) {
			extractionTriggered = true;
			isProcessing = true;
			// Fire-and-forget: server completes even if user navigates
			fetch('/api/extract', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ documentId: data.doc.id })
			}).catch(() => {}); // ignore client-side abort errors
		}

		if (status === 'uploaded' || status === 'processing') {
			isProcessing = true;
			pollTimer = setInterval(async () => {
				try {
					await invalidateAll();
				} catch { /* ignore */ }
			}, 3000);
		} else {
			isProcessing = false;
			extractionTriggered = false;
		}

		return () => {
			if (pollTimer) clearInterval(pollTimer);
		};
	});
</script>

<svelte:head>
	<title>{data.ext?.vendor ?? data.doc.filename} — SmartDoc</title>
</svelte:head>

<Nav />

{#if showSaveToast}
	<div class="save-toast" role="status">
		<svg class="toast-check" viewBox="0 0 52 52" fill="none">
			<circle class="check-circle" cx="26" cy="26" r="24" stroke="currentColor" stroke-width="2.5" />
			<path class="check-path" d="M15 27l7 7 15-15" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
		<span>Data berhasil disimpan</span>
	</div>
{/if}

<div class="detail-layout">
	{#if data.doc.status === 'extracted' || data.doc.status === 'verified'}
		<!-- Preview -->
		<div class="preview-panel">
			<div class="preview-frame">
				{#if data.doc.mimeType?.startsWith('image/')}
					<img src="/api/files/{data.doc.id}" alt="Preview dokumen" />
				{:else}
					<iframe src="/api/files/{data.doc.id}" title="Preview dokumen"></iframe>
				{/if}
			</div>
		</div>

		<!-- Form -->
		<div class="form-panel">
			<div class="form-header">
				<div>
					<div class="section-tag">Ekstraksi</div>
					<h2>{data.ext?.vendor ?? 'Hasil'}</h2>
				</div>
				<StatusBadge status={data.doc.status} />
			</div>

			<form
				id="doc-form"
				style="flex: 1"
				method="POST"
				action="?/save"
				use:enhance={() => {
					saving = true;
					return async ({ update, result }) => {
						saving = false;
						await update({ reset: false });
						if (result.type === 'success') {
							showSaveToast = true;
							setTimeout(() => { showSaveToast = false; }, 2500);
						}
					};
				}}
			>
				<div class="fields-grid">
					<ConfidenceField
						label="Vendor"
						name="vendor"
						value={data.ext?.vendor}
						confidence={data.ext?.vendorConfidence}
					/>
					<ConfidenceField
						label="Tanggal"
						name="invoiceDate"
						value={data.ext?.invoiceDate}
						confidence={data.ext?.invoiceDateConfidence}
						type="date"
					/>
					<ConfidenceField
						label="Total"
						name="totalAmount"
						value={data.ext?.totalAmount}
						confidence={data.ext?.totalAmountConfidence}
						type="number"
					/>
					<ConfidenceField
						label="Mata Uang"
						name="currency"
						value={data.ext?.currency}
						confidence={data.ext?.currencyConfidence}
					/>
					<ConfidenceField
						label="Pajak"
						name="taxAmount"
						value={data.ext?.taxAmount}
						confidence={null}
						type="number"
					/>
					<ConfidenceField
						label="Subtotal"
						name="subtotal"
						value={data.ext?.subtotal}
						confidence={null}
						type="number"
					/>
				</div>

				<!-- Line items -->
				{#if data.items && data.items.length > 0}
					<div class="items-section">
						<div class="items-header">
							<span class="items-label">Line Items ({data.items.length})</span>
						</div>
						<div class="items-table">
							<div class="items-thead">
								<span>Deskripsi</span>
								<span class="tc">Qty</span>
								<span class="tr">Harga</span>
								<span class="tr">Total</span>
							</div>
							{#each data.items as item, i}
								<div class="items-row">
									<input type="hidden" name="item_{i}_id" value={item.id} />
									<input type="text" name="item_{i}_description" value={item.description} class="item-input" />
									<input type="text" name="item_{i}_quantity" value={item.quantity != null ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 4 }).format(item.quantity) : ''} class="item-input item-num tc" />
									<input type="text" name="item_{i}_unitPrice" value={item.unitPrice != null ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 4 }).format(item.unitPrice) : ''} class="item-input item-num tr" />
									<input type="text" name="item_{i}_total" value={item.total != null ? new Intl.NumberFormat('id-ID', { maximumFractionDigits: 4 }).format(item.total) : ''} class="item-input item-num tr" />
								</div>
							{/each}
						</div>
						<input type="hidden" name="itemCount" value={data.items.length} />
					</div>
				{/if}
			</form>

			<div class="floating-action-bar-wrapper">
				<div class="floating-action-bar">
					<div class="status-indicator">
						<div class="status-dot"></div>
						<span>Siap • otomatis tersinkron</span>
					</div>

					<div class="action-bar-right">
						<form method="POST" action="?/reextract" use:enhance bind:this={reextractFormEl} style="display:contents">
							<button type="button" class="btn-icon" onclick={() => showReextractDialog = true} title="Re-extract">
								<RotateCw size={14} strokeWidth={1.5} />
							</button>
						</form>
						<form method="POST" action="?/delete" use:enhance bind:this={deleteFormEl} style="display:contents">
							<button type="button" class="btn-icon danger" onclick={() => showDeleteDialog = true} title="Hapus">
								<Trash2 size={14} strokeWidth={1.5} color="#F87171" />
							</button>
						</form>

						<div class="divider"></div>

						<div class="export-dropdown" class:show={showExport}>
							<button type="button" class="btn-export" onclick={() => showExport = !showExport}>
								<Download size={14} strokeWidth={1.5} />
								Ekspor
								<ChevronDown size={14} strokeWidth={1.5} />
							</button>
							{#if showExport}
								<div class="export-menu">
									<button type="button" class="export-item" onclick={exportCSV}>
										<span class="export-icon">CSV</span> CSV File
									</button>
									<button type="button" class="export-item" onclick={exportExcel}>
										<span class="export-icon">XLS</span> Excel File
									</button>
									<button type="button" class="export-item" onclick={exportJSON}>
										<span class="export-icon">JSON</span> JSON Data
									</button>
								</div>
							{/if}
						</div>

						<button type="submit" form="doc-form" class="btn-primary-pill" disabled={saving}>
							<Save size={14} strokeWidth={1.5} />
							{saving ? 'Menyimpan...' : 'Simpan'}
						</button>
					</div>
				</div>
			</div>
		</div>

	{:else if data.doc.status === 'not_a_receipt'}
		<div class="state-msg">
			<h2>Bukan resi atau invoice</h2>
			<p>Dokumen ini tidak terdeteksi sebagai resi atau invoice. Coba upload dokumen lain, atau hapus.</p>
			<div class="secondary-actions" style="display: flex; justify-content: center; margin-top: 32px;">
				<form method="POST" action="?/delete" use:enhance bind:this={deleteFormEl} style="display:contents">
					<button type="button" class="btn btn-ghost" style="color: #F87171; border-color: #F87171;" onclick={() => showDeleteDialog = true}>
						<Trash2 size={14} strokeWidth={1.5} />
						Hapus dokumen
					</button>
				</form>
			</div>
		</div>

	{:else if data.doc.status === 'failed'}
		<div class="state-msg">
			<div class="error-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="40" height="40"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
			</div>
			<h2>Ekstraksi gagal</h2>
			{#if data.doc.errorMessage}
				<p class="error-detail">{data.doc.errorMessage}</p>
			{:else}
				<p>Terjadi kesalahan saat memproses dokumen.</p>
			{/if}
			<div class="error-tips">
				<p class="tips-title">Coba langkah berikut:</p>
				<ul>
					<li>Pastikan dokumen adalah <strong>resi, struk, atau invoice</strong> yang jelas terbaca</li>
					<li>Pastikan gambar tidak <strong>buram, terpotong, atau terlalu gelap</strong></li>
					<li>Untuk PDF, pastikan file tidak <strong>terproteksi password</strong></li>
					<li>Ukuran file maksimal <strong>10 MB</strong></li>
				</ul>
			</div>
			<div class="secondary-actions" style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: 32px;">
				<form method="POST" action="?/reextract" use:enhance>
					<button type="submit" class="btn btn-primary">
						<RotateCw size={14} strokeWidth={1.5} />
						Coba lagi
					</button>
				</form>
				<form method="POST" action="?/delete" use:enhance bind:this={deleteFormEl} style="display:contents">
					<button type="button" class="btn btn-ghost" style="color: #F87171; border-color: #F87171;" onclick={() => showDeleteDialog = true}>
						<Trash2 size={14} strokeWidth={1.5} />
						Hapus
					</button>
				</form>
			</div>
		</div>

	{:else}
		<div class="state-msg">
			<div class="processing-state">
				<div class="proc-dot"></div>
				<span>Mengekstrak data...</span>
			</div>
			<p>AI sedang membaca dokumen Anda. Biasanya selesai dalam beberapa detik.</p>
		</div>
	{/if}
</div>

<ConfirmDialog
	open={showDeleteDialog}
	title="Hapus Dokumen"
	message="Dokumen ini beserta semua data ekstraksi akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
	confirmLabel="Ya, hapus"
	cancelLabel="Batal"
	variant="danger"
	onconfirm={() => { showDeleteDialog = false; deleteFormEl?.requestSubmit(); }}
	oncancel={() => { showDeleteDialog = false; }}
/>

<ConfirmDialog
	open={showReextractDialog}
	title="Re-extract Dokumen"
	message="Data ekstraksi saat ini akan ditimpa dengan hasil ekstraksi ulang dari AI. Lanjutkan?"
	confirmLabel="Ya, extract ulang"
	cancelLabel="Batal"
	variant="warning"
	onconfirm={() => { showReextractDialog = false; reextractFormEl?.requestSubmit(); }}
	oncancel={() => { showReextractDialog = false; }}
/>

<style>
	.detail-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: calc(100vh - 80px);
		position: relative;
		z-index: 1;
	}

	/* Preview */
	.preview-panel {
		padding: 24px;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		background: var(--bg);
	}
	.preview-frame {
		max-width: 100%;
		border-radius: var(--radius-lg);
		overflow: hidden;
		border: 1px solid var(--line);
		box-shadow: var(--shadow-md);
	}
	.preview-frame img {
		display: block;
		max-width: 100%;
		height: auto;
	}
	.preview-frame iframe {
		display: block;
		width: 100%;
		min-height: 80vh;
		border: none;
	}

	/* Form */
	.form-panel {
		padding: 32px;
		background: var(--bg-elevated);
		border-left: 1px solid var(--line);
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}
	.form-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 32px;
	}
	.form-header h2 {
		font-size: 24px;
		letter-spacing: -0.02em;
		margin-top: 8px;
	}

	/* Fields */
	.fields-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-bottom: 32px;
	}

	/* Line items */
	.items-section {
		margin-bottom: 32px;
	}
	.items-header {
		margin-bottom: 12px;
	}
	.items-label {
		font-family: var(--font-mono);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--brand);
		font-weight: 600;
	}
	.items-table {
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		overflow: hidden;
	}
	.items-thead {
		display: grid;
		grid-template-columns: 1.5fr 0.5fr 0.5fr 0.6fr;
		padding: 8px 12px;
		font-family: var(--font-mono);
		font-size: 9.5px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		border-bottom: 1px solid var(--line);
		background: var(--bg-elevated);
	}
	.items-row {
		display: grid;
		grid-template-columns: 1.5fr 0.5fr 0.5fr 0.6fr;
		border-bottom: 1px solid var(--line-soft);
	}
	.item-input {
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: transparent;
		font-family: var(--font-display);
		font-size: 13px;
		color: var(--ink);
	}
	.item-input:focus {
		outline: none;
		background: var(--brand-soft);
	}
	.item-num {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: 12.5px;
	}
	.tr { text-align: right; }
	.tc { text-align: center; }

	/* Actions */
	.floating-action-bar-wrapper {
		margin-top: auto;
		display: flex;
		z-index: 10;
	}
	.floating-action-bar {
		flex: 1;
		background: #18181A;
		border-radius: 9999px;
		padding: 8px 8px 8px 16px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 10px 25px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05);
	}
	.action-bar-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.status-indicator {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 16px;
		color: #A1A1AA;
		font-size: 13px;
		font-family: var(--font-mono);
	}
	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #4ADE80;
		box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
	}
	.btn-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid rgba(255,255,255,0.1);
		background: transparent;
		color: #A1A1AA;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-icon:hover {
		background: rgba(255,255,255,0.1);
		color: white;
	}
	.btn-icon.danger {
		border-color: rgba(248, 113, 113, 0.2);
	}
	.btn-icon.danger:hover {
		background: rgba(248, 113, 113, 0.1);
	}
	.divider {
		width: 1px;
		height: 24px;
		background: rgba(255,255,255,0.1);
		margin: 0 4px;
	}
	.btn-export {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 16px;
		height: 36px;
		border-radius: 9999px;
		background: transparent;
		border: 1px solid rgba(255,255,255,0.1);
		color: white;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-export:hover {
		background: rgba(255,255,255,0.1);
	}
	.btn-primary-pill {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 20px;
		height: 36px;
		border-radius: 9999px;
		background: #F4F4F5;
		color: #18181A;
		border: none;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}
	.btn-primary-pill:hover {
		background: white;
		transform: translateY(-1px);
	}
	.btn-primary-pill:disabled {
		opacity: 0.7;
		cursor: not-allowed;
		transform: none;
	}

	/* Export Dropdown in dark mode */
	.export-dropdown {
		position: relative;
	}
	.export-menu {
		position: absolute;
		bottom: calc(100% + 12px);
		right: 0;
		background: #18181A;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 12px;
		padding: 6px;
		min-width: 180px;
		box-shadow: 0 10px 25px rgba(0,0,0,0.3);
		z-index: 110;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.export-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 12px;
		border: none;
		background: transparent;
		border-radius: 8px;
		color: #A1A1AA;
		font-size: 13px;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}
	.export-item:hover {
		background: rgba(255,255,255,0.1);
		color: white;
	}
	.export-icon {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 700;
		color: #A1A1AA;
		background: rgba(255,255,255,0.05);
		padding: 3px 6px;
		border-radius: 4px;
		min-width: 36px;
		text-align: center;
	}
	.export-item:hover .export-icon {
		color: white;
		background: rgba(255,255,255,0.15);
	}




	/* State messages */
	.state-msg {
		grid-column: span 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80px 32px;
		text-align: center;
	}
	.state-msg h2 {
		font-size: 24px;
		margin-bottom: 12px;
	}
	.state-msg p {
		color: var(--ink-soft);
		max-width: 420px;
		margin-bottom: 24px;
	}
	.error-icon {
		color: #ef4444;
		margin-bottom: 12px;
	}
	.error-detail {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fecaca;
		border-radius: var(--radius);
		padding: 12px 16px;
		font-family: var(--font-mono);
		font-size: 12.5px;
		line-height: 1.5;
		max-width: 480px;
		margin-bottom: 20px;
		text-align: left;
	}
	.error-tips {
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 16px 20px;
		max-width: 480px;
		margin-bottom: 24px;
		text-align: left;
	}
	.tips-title {
		font-weight: 600;
		font-size: 13px;
		margin: 0 0 10px;
		color: var(--ink);
	}
	.error-tips ul {
		margin: 0;
		padding-left: 18px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.error-tips li {
		font-size: 13px;
		color: var(--ink-soft);
		line-height: 1.45;
	}
	.processing-state {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 16px;
		font-weight: 600;
		margin-bottom: 12px;
	}
	.proc-dot {
		width: 8px; height: 8px;
		border-radius: 999px;
		background: var(--brand);
	}
	@media (prefers-reduced-motion: no-preference) {
		.proc-dot {
			animation: pulse-proc 1.4s infinite;
		}
		@keyframes pulse-proc {
			0%, 100% { opacity: 0.3; }
			50% { opacity: 1; }
		}
	}

	@media (max-width: 1080px) {
		.detail-layout { grid-template-columns: 1fr; }
		.preview-panel { max-height: 50vh; overflow: auto; }
		.state-msg { grid-column: auto; }
	}

	/* Save toast */
	.save-toast {
		position: fixed;
		top: 28px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		display: flex;
		align-items: center;
		gap: 10px;
		background: #065f46;
		color: #ecfdf5;
		padding: 12px 22px;
		border-radius: 12px;
		font-size: 14px;
		font-weight: 600;
		box-shadow: 0 8px 30px rgba(0,0,0,0.18);
		animation: toast-in 0.35s cubic-bezier(0.16,1,0.3,1);
	}
	.toast-check {
		width: 28px;
		height: 28px;
		color: #34d399;
	}
	.check-circle {
		fill: none;
		stroke-dasharray: 152;
		stroke-dashoffset: 152;
		animation: draw-circle 0.5s 0.1s cubic-bezier(0.65,0,0.35,1) forwards;
	}
	.check-path {
		fill: none;
		stroke-dasharray: 40;
		stroke-dashoffset: 40;
		animation: draw-check 0.35s 0.45s cubic-bezier(0.65,0,0.35,1) forwards;
	}
	@keyframes toast-in {
		from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.95); }
		to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
	}
	@keyframes draw-circle {
		to { stroke-dashoffset: 0; }
	}
	@keyframes draw-check {
		to { stroke-dashoffset: 0; }
	}
</style>

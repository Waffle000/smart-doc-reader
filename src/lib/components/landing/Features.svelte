<script lang="ts">
	import { Lock } from 'lucide-svelte';
</script>

<section id="fitur">
	<div class="section-head">
		<div>
			<div class="section-tag">FITUR</div>
			<h2 class="section-title">Dibangun untuk<br>volume <em>nyata.</em></h2>
		</div>
		<p class="section-sub">
			Bukan demo lima resi. SmartDoc menangani ratusan dokumen sekali angkat, lintas format dan bahasa.
		</p>
	</div>

	<div class="bento-grid">
		<!-- AKURASI -->
		<div class="bento-card bento-large">
			<div class="bento-tag">AKURASI</div>
			<h3>99.2% akurat di field utama.</h3>
			<p>Diukur pada 50.000+ resi nyata dari UMKM Indonesia — termal pudar, faktur kusut, foto miring, semua tetap terbaca.</p>
			
			<div class="bento-large-bottom">
				<div class="bento-big-number">99.2<span>%</span></div>
				<div class="bento-labels">VENDOR &bull; TANGGAL &bull; TOTAL</div>
			</div>
		</div>

		<!-- MULTI-FORMAT -->
		<div class="bento-card">
			<div class="bento-tag">MULTI-FORMAT</div>
			<h3>JPG, PNG, PDF, HEIC.</h3>
			<p>Termasuk PDF multi-halaman, email tagihan, dan foto langsung dari kamera HP.</p>
			
			<div class="bento-badges">
				<span class="badge">JPG</span>
				<span class="badge">PNG</span>
				<span class="badge">PDF</span>
				<span class="badge">HEIC</span>
				<span class="badge">WEBP</span>
				<span class="badge">TIFF</span>
			</div>
		</div>

		<!-- BAHASA -->
		<div class="bento-card">
			<div class="bento-tag">BAHASA</div>
			<h3>ID, EN, dan lainnya.</h3>
			<p>Dilatih khusus untuk struk Indonesia — termasuk istilah pajak lokal seperti PPN, PB1, dan service charge.</p>
			
			<div class="bento-badges">
				<span class="badge badge-green">ID</span>
				<span class="badge badge-green">EN</span>
				<span class="badge">JP</span>
				<span class="badge">ZH</span>
				<span class="badge">+12</span>
			</div>
		</div>

		<!-- EKSPOR -->
		<div class="bento-card">
			<div class="bento-tag">EKSPOR</div>
			<h3>Sheets, Xero, JSON.</h3>
			<p>One-click ekspor ke alat akunting favorit, atau langsung tarik via API.</p>
			
			<div class="bento-code">
				<div class="code-row"><span class="arrow">&rarr;</span> <span class="key">Google Sheets</span> <span class="val">auto-sync</span></div>
				<div class="code-row"><span class="arrow">&rarr;</span> <span class="key">Xero / Mekari</span> <span class="val">connected</span></div>
				<div class="code-row"><span class="arrow">&rarr;</span> <span class="key">REST API</span> <span class="val">v1.4</span></div>
				<div class="code-row"><span class="arrow">&rarr;</span> <span class="key">Webhook</span> <span class="val">realtime</span></div>
			</div>
		</div>

		<!-- PRIVASI -->
		<div class="bento-card">
			<div class="bento-tag">PRIVASI</div>
			<h3>Data Anda, milik Anda.</h3>
			<p>Penyimpanan terenkripsi di server Jakarta. Hapus permanen kapan saja, audit log tersedia.</p>
			
			<div class="bento-security">
				<div class="lock-icon">
					<Lock size={16} strokeWidth={2} />
				</div>
				<div class="sec-text">
					<strong>AES-256 &bull; ISO 27001</strong>
					<span>Server Jakarta &bull; audit-ready</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section { 
		padding: 96px 0; 
		position: relative; 
		z-index: 1; 
		width: 100%;
	}

	/* Grid */
	.bento-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr 1fr;
		gap: 24px;
	}
	
	.bento-card {
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		border-radius: 20px;
		padding: 32px;
		display: flex;
		flex-direction: column;
	}
	
	.bento-tag {
		font-family: var(--font-mono);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.12em;
		color: var(--ink-mute);
		margin-bottom: 16px;
	}
	
	.bento-card h3 {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin: 0 0 12px;
		line-height: 1.3;
	}
	
	.bento-card p {
		margin: 0;
		color: var(--ink-soft);
		font-size: 14.5px;
		line-height: 1.6;
	}

	/* Large Card (Akurasi) */
	.bento-large {
		grid-row: span 2;
		background: #234833;
		border-color: #234833;
		color: white;
		justify-content: space-between;
	}
	.bento-large .bento-tag {
		color: rgba(255, 255, 255, 0.6);
	}
	.bento-large h3 {
		color: white;
	}
	.bento-large p {
		color: rgba(255, 255, 255, 0.8);
	}
	.bento-large-bottom {
		margin-top: 64px;
	}
	.bento-big-number {
		font-family: 'Instrument Serif', var(--font-display), serif;
		font-style: italic;
		font-size: 110px;
		line-height: 0.9;
		color: #D4E2A3;
		margin-bottom: 16px;
		letter-spacing: -0.02em;
	}
	.bento-big-number span {
		font-size: 64px;
		margin-left: 2px;
	}
	.bento-labels {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.15em;
		color: rgba(255, 255, 255, 0.7);
	}

	/* Badges */
	.bento-badges {
		margin-top: 32px;
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		background: var(--bg);
		padding: 16px;
		border-radius: 12px;
		border: 1px solid var(--line);
	}
	.badge {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 600;
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		padding: 4px 10px;
		border-radius: 20px;
		color: var(--ink-soft);
	}
	.badge-green {
		background: #E8F5E9;
		color: #2E7D32;
		border-color: #C8E6C9;
	}

	/* Code block */
	.bento-code {
		margin-top: 32px;
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 16px;
		font-family: var(--font-mono);
		font-size: 11.5px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.code-row {
		display: flex;
		align-items: center;
	}
	.code-row .arrow {
		color: var(--ink-mute);
		margin-right: 8px;
	}
	.code-row .key {
		color: var(--ink-soft);
		flex: 1;
	}
	.code-row .val {
		font-weight: 600;
		color: var(--ink);
	}

	/* Security block */
	.bento-security {
		margin-top: 32px;
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 12px;
		padding: 16px;
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.lock-icon {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: #E8F5E9;
		color: #2E7D32;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.sec-text {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.sec-text strong {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 700;
		color: var(--ink);
	}
	.sec-text span {
		font-family: var(--font-mono);
		font-size: 10px;
		color: var(--ink-mute);
	}

	@media (max-width: 900px) {
		.bento-grid {
			grid-template-columns: 1fr 1fr;
		}
		.bento-large {
			grid-column: 1 / -1;
			grid-row: auto;
		}
	}
	
	@media (max-width: 600px) {
		.bento-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

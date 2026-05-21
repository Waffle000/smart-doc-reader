<section id="how">
	<div class="section-head">
		<div>
			<div class="section-tag">Cara kerja</div>
			<h2 class="section-title">Tiga langkah, dari kertas ke <em>spreadsheet</em>.</h2>
		</div>
		<p class="section-sub">
			Tidak perlu template, tidak perlu input manual. SmartDoc membaca format struk apa pun — termal, faktur pajak, hingga PDF email.
		</p>
	</div>

	<div class="steps">
		<div class="step">
			<div class="step-num">01</div>
			<h3>Unggah atau foto</h3>
			<p>Tarik file ke browser, foto langsung dari HP, atau pilih dari gallery. JPG, PNG, WebP, PDF — semua didukung.</p>
			<div class="step-visual">
				<div class="upload-mini">
					<div class="doc"></div>
					<div class="doc"></div>
					<div class="doc"></div>
				</div>
			</div>
		</div>

		<div class="step">
			<div class="step-num">02</div>
			<h3>Ekstraksi otomatis</h3>
			<p>AI membaca vendor, tanggal, total, PPN, dan tiap baris item — termasuk struk termal yang pudar.</p>
			<div class="step-visual">
				<div class="processing">
					<div class="processing-row"><span>vendor</span><span>99%</span></div>
					<div class="processing-bar"><i></i></div>
					<div class="processing-row"><span>line_items[4]</span><span>98%</span></div>
					<div class="processing-bar"><i></i></div>
					<div class="processing-row"><span>tax · total</span><span>100%</span></div>
					<div class="processing-bar"><i></i></div>
				</div>
			</div>
		</div>

		<div class="step">
			<div class="step-num">03</div>
			<h3>Periksa & ekspor</h3>
			<p>Tinjau hasil, koreksi jika perlu, lalu unduh CSV atau salin ke spreadsheet Anda.</p>
			<div class="step-visual">
				<table class="mini-table">
					<thead>
						<tr><th>Vendor</th><th>Tgl</th><th class="r">Total</th></tr>
					</thead>
					<tbody>
						<tr><td>Warung Harja</td><td>21/05</td><td class="r">132.867</td></tr>
						<tr><td>Grab Mart</td><td>20/05</td><td class="r">87.400</td></tr>
						<tr><td>PT Sumber Mas</td><td>18/05</td><td class="r">2.450.000</td></tr>
						<tr><td>Indomaret #441</td><td>17/05</td><td class="r">56.300</td></tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>

<style>
	section { padding: 96px 0; position: relative; z-index: 1; }
	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}
	.step {
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		padding: 28px;
		position: relative;
		overflow: hidden;
		min-height: 360px;
		display: flex;
		flex-direction: column;
		transition: transform .25s ease, box-shadow .25s ease;
	}
	.step:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
	.step-num {
		font-family: var(--font-serif);
		font-style: italic;
		font-size: 64px;
		line-height: 1;
		color: var(--brand);
		letter-spacing: -0.04em;
		margin-bottom: 24px;
	}
	.step h3 {
		margin: 0 0 8px;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
	}
	.step p {
		margin: 0;
		color: var(--ink-soft);
		font-size: 14.5px;
		line-height: 1.55;
	}
	.step-visual {
		margin-top: auto;
		padding-top: 28px;
	}

	/* Step 1: upload zone */
	.upload-mini {
		height: 110px;
		border: 1.5px dashed var(--line);
		border-radius: 12px;
		display: grid;
		place-items: center;
		position: relative;
		background: repeating-linear-gradient(45deg, transparent 0 8px, var(--line-soft) 8px 9px);
	}
	.doc {
		position: absolute;
		width: 50px; height: 64px;
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 6px;
		transform: rotate(-8deg);
		box-shadow: var(--shadow-sm);
	}
	.doc:nth-child(2) { transform: rotate(6deg) translate(18px, 4px); background: var(--brand-soft); }
	.doc:nth-child(3) { transform: rotate(-2deg) translate(-22px, -2px); }

	/* Step 2: processing bars */
	.processing {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--ink-soft);
	}
	.processing-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.processing-bar {
		height: 6px;
		background: var(--line-soft);
		border-radius: 999px;
		overflow: hidden;
		position: relative;
	}
	.processing-bar > i {
		position: absolute;
		inset: 0;
		background: var(--brand);
		transform-origin: left;
		display: block;
	}
	@media (prefers-reduced-motion: no-preference) {
		.processing-bar > i { animation: bar 2.4s ease-in-out infinite; }
		.processing-bar:nth-of-type(2) > i { animation-delay: 0.4s; }
		.processing-bar:nth-of-type(3) > i { animation-delay: 0.8s; }
		@keyframes bar {
			0% { transform: scaleX(0); }
			60% { transform: scaleX(1); }
			100% { transform: scaleX(1); opacity: 0; }
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.processing-bar > i { transform: scaleX(1); }
	}

	/* Step 3: mini table */
	.mini-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-mono);
		font-size: 10.5px;
	}
	.mini-table th, .mini-table td {
		text-align: left;
		padding: 5px 6px;
		border-bottom: 1px solid var(--line-soft);
	}
	.mini-table th { color: var(--ink-mute); font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; font-size: 9.5px; }
	.mini-table td { color: var(--ink); font-weight: 500; }
	.r { text-align: right; }

	@media (max-width: 720px) {
		.steps { grid-template-columns: 1fr; }
	}
</style>

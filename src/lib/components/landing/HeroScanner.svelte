<div class="scanner">
	<div class="scanner-head">
		<span>document.scan</span>
		<span class="pill"><span class="pulse-dot"></span> Memproses</span>
	</div>
	<div class="scanner-body">
		<!-- Receipt (thermal paper) -->
		<div class="receipt">
			<h4>WARUNG KOPI HARJA</h4>
			<div class="sub">Jl. Cendana No. 47 · Bandung</div>
			<div class="sub">Kasir: Rani &nbsp;·&nbsp; 21/05/2026 14:32</div>
			<div style="height:8px"></div>
			<div class="row"><span>Kopi Susu Aren ×2</span><span>50.000</span></div>
			<div class="row"><span>Croissant Almond</span><span>32.000</span></div>
			<div class="row"><span>Roti Bakar Coklat</span><span>24.000</span></div>
			<div class="row"><span>Air Mineral 600ml</span><span>8.000</span></div>
			<div class="row"><span>Service 5%</span><span>5.700</span></div>
			<div class="row"><span>PPN 11%</span><span>13.167</span></div>
			<div class="total"><span>TOTAL</span><span>132.867</span></div>
			<div class="inv-num">Tunai · #INV-20260521-0047</div>
			<div class="barcode"></div>
		</div>
		<!-- Extracted fields -->
		<div class="extracted">
			<div class="field f1">
				<div class="field-label"><span>Vendor</span><span class="conf">99%</span></div>
				<div class="field-value">Warung Kopi Harja</div>
			</div>
			<div class="field f2">
				<div class="field-label"><span>Tanggal</span><span class="conf">100%</span></div>
				<div class="field-value mono">2026-05-21 · 14:32</div>
			</div>
			<div class="field f3">
				<div class="field-label"><span>Total</span><span class="conf">100%</span></div>
				<div class="field-value">Rp 132.867</div>
			</div>
			<div class="field f4">
				<div class="field-label"><span>Kategori</span><span class="conf">96%</span></div>
				<div class="field-value">Makan & Minum</div>
			</div>
			<div class="field items-field f5">
				<div class="field-label" style="color:var(--brand)"><span>Item (4)</span><span class="conf">98%</span></div>
				<div class="item-row"><span>Kopi Susu Aren ×2</span><span>50.000</span></div>
				<div class="item-row"><span>Croissant Almond</span><span>32.000</span></div>
				<div class="item-row"><span>Roti Bakar Coklat</span><span>24.000</span></div>
				<div class="item-row"><span>Air Mineral 600ml</span><span>8.000</span></div>
			</div>
		</div>
	</div>
</div>

<style>
	.scanner {
		position: relative;
		aspect-ratio: 1 / 1.05;
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		padding: 22px;
		box-shadow: var(--shadow-lg);
		overflow: hidden;
	}
	.scanner-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
		font-size: 12px;
		color: var(--ink-mute);
		font-family: var(--font-mono);
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--brand-soft);
		color: var(--brand);
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 11.5px;
	}
	.pulse-dot {
		width: 6px; height: 6px;
		border-radius: 999px;
		background: var(--brand);
	}
	@media (prefers-reduced-motion: no-preference) {
		.pulse-dot {
			box-shadow: 0 0 0 0 var(--brand);
			animation: pulse 1.6s infinite;
		}
		@keyframes pulse {
			0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--brand) 50%, transparent); }
			70% { box-shadow: 0 0 0 8px transparent; }
			100% { box-shadow: 0 0 0 0 transparent; }
		}
	}
	.scanner-body {
		display: grid;
		grid-template-columns: 1fr 1.25fr;
		gap: 18px;
		height: calc(100% - 36px);
	}

	/* Receipt (thermal paper) */
	.receipt {
		position: relative;
		background: #FFFDF4;
		border-radius: 12px;
		padding: 18px 16px;
		font-family: var(--font-mono);
		color: #2A2C26;
		font-size: 10.5px;
		line-height: 1.55;
		box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06);
		overflow: hidden;
		clip-path: polygon(
			0 6px, 5% 0, 10% 6px, 15% 0, 20% 6px, 25% 0, 30% 6px, 35% 0,
			40% 6px, 45% 0, 50% 6px, 55% 0, 60% 6px, 65% 0, 70% 6px, 75% 0,
			80% 6px, 85% 0, 90% 6px, 95% 0, 100% 6px, 100% 100%, 0 100%
		);
	}
	@media (prefers-reduced-motion: no-preference) {
		.receipt::after {
			content: "";
			position: absolute;
			left: 0; right: 0;
			height: 2px;
			background: linear-gradient(90deg, transparent, var(--brand) 50%, transparent);
			box-shadow: 0 0 18px 4px color-mix(in oklab, var(--brand) 40%, transparent);
			top: 0;
			animation: scan 3.6s ease-in-out infinite;
		}
		@keyframes scan {
			0%   { top: 6%; opacity: 0; }
			10%  { opacity: 1; }
			50%  { top: 92%; opacity: 1; }
			60%  { opacity: 0; }
			100% { top: 6%; opacity: 0; }
		}
	}
	.receipt h4 {
		margin: 0 0 4px;
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 700;
		text-align: center;
		letter-spacing: 0.04em;
	}
	.receipt .sub {
		text-align: center;
		color: #6E7068;
		font-size: 9.5px;
		margin-bottom: 10px;
	}
	.receipt .row {
		display: flex;
		justify-content: space-between;
		border-top: 1px dashed rgba(0,0,0,0.15);
		padding: 4px 0;
	}
	.receipt .total {
		display: flex;
		justify-content: space-between;
		border-top: 1.5px solid #2A2C26;
		margin-top: 8px;
		padding-top: 6px;
		font-weight: 700;
	}
	.inv-num {
		margin-top: 6px;
		font-size: 9px;
		text-align: center;
		color: #6E7068;
	}
	.barcode {
		margin-top: 10px;
		height: 22px;
		background: repeating-linear-gradient(90deg, #2A2C26 0 2px, transparent 2px 4px, #2A2C26 4px 5px, transparent 5px 9px);
		border-radius: 2px;
	}

	/* Extracted fields */
	.extracted {
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow: hidden;
	}
	.field {
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 9px 12px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		position: relative;
	}
	@media (prefers-reduced-motion: no-preference) {
		.field {
			opacity: 0;
			transform: translateY(6px);
			animation: rise 0.5s ease forwards;
		}
		.f1 { animation-delay: 0.6s; }
		.f2 { animation-delay: 1.0s; }
		.f3 { animation-delay: 1.4s; }
		.f4 { animation-delay: 1.8s; }
		.f5 { animation-delay: 2.2s; }
		@keyframes rise {
			to { opacity: 1; transform: translateY(0); }
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.field { opacity: 1; transform: none; }
	}
	.field-label {
		font-family: var(--font-mono);
		font-size: 9.5px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-mute);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.conf { color: var(--brand); font-weight: 600; }
	.field-value {
		font-size: 14px;
		font-weight: 600;
		color: var(--ink);
		letter-spacing: -0.01em;
	}
	.field-value.mono { font-family: var(--font-mono); font-weight: 500; font-size: 12.5px; }
	.items-field { background: var(--brand-soft); border-color: transparent; }
	.items-field .field-value { color: var(--brand-deep); }
	.item-row {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		padding: 2px 0;
		color: var(--brand-deep);
	}

	@media (max-width: 720px) {
		.scanner { aspect-ratio: auto; min-height: 380px; }
		.scanner-body { grid-template-columns: 1fr; }
		.receipt { display: none; }
	}
</style>

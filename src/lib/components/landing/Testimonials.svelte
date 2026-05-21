<script lang="ts">
</script>

<section id="testimoni">
	<div class="section-head">
		<div>
			<div class="section-tag">TESTIMONI</div>
			<h2 class="section-title">Dipercaya oleh<br>tim <em>finance & ops.</em></h2>
		</div>
		<p class="section-sub">
			Lihat bagaimana SmartDoc mempercepat proses rekapitulasi pengeluaran dan rekonsiliasi data ratusan jam per bulan.
		</p>
	</div>

	<div class="testi-grid">
		<div class="testi-card">
			<p class="quote">"Dulu akhir bulan selalu lembur untuk rekap ribuan resi pengeluaran tim sales. Sekarang dengan SmartDoc, tinggal batch upload dan datanya langsung rapi di Excel. Sangat menghemat waktu!"</p>
			<div class="author">
				<div class="avatar">A</div>
				<div class="info">
					<div class="name">Andi Setiawan</div>
					<div class="role">Finance Manager, TechLog</div>
				</div>
			</div>
		</div>

		<div class="testi-card">
			<p class="quote">"Akurasi OCR-nya luar biasa. Bahkan untuk struk termal yang pudar dan lecek, SmartDoc masih bisa mendeteksi vendor dan total dengan tepat. Ekspor ke JSON juga mempermudah sistem kami."</p>
			<div class="author">
				<div class="avatar">D</div>
				<div class="info">
					<div class="name">Diana Pratiwi</div>
					<div class="role">Head of Ops, KopiSenja</div>
				</div>
			</div>
		</div>

		<div class="testi-card">
			<p class="quote">"Sangat cocok untuk tim lapangan kami. Mereka tinggal foto resi bensin dan makan, lalu datanya terstruktur. Proses reimbursement yang biasanya makan seminggu kini jadi hitungan jam."</p>
			<div class="author">
				<div class="avatar">R</div>
				<div class="info">
					<div class="name">Reza Mahendra</div>
					<div class="role">Area Sales, Nusantara Group</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	section { padding: 96px 0; position: relative; z-index: 1; }

	.testi-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.testi-card {
		background: var(--bg-elevated);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		padding: 32px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 32px;
		transition: transform .25s ease, box-shadow .25s ease;
	}

	.testi-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-md);
	}

	.quote {
		margin: 0;
		font-size: 15.5px;
		line-height: 1.6;
		color: var(--ink);
	}

	.author {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.avatar {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--brand-soft);
		color: var(--brand);
		display: grid;
		place-items: center;
		font-family: var(--font-serif);
		font-size: 20px;
		font-style: italic;
		font-weight: 600;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.name {
		font-weight: 600;
		font-size: 14.5px;
		color: var(--ink);
	}

	.role {
		font-size: 13px;
		color: var(--ink-soft);
	}

	@media (max-width: 900px) {
		.testi-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

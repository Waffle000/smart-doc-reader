<footer class="shell">
	<div class="foot-grid">
		<div class="foot-brand">
			<div class="brand">
				<span class="brand-mark">S</span>
				SmartDoc
			</div>
			<p>Resi & invoice, jadi data yang rapi. Dibangun di Indonesia.</p>
		</div>
		<div>
			<h5>Produk</h5>
			<ul>
				<li><a href="/upload">Upload</a></li>
				<li><a href="/inbox">Inbox</a></li>
				<li><a href="/#how">Cara Kerja</a></li>
			</ul>
		</div>
		<div>
			<h5>Tentang</h5>
			<ul>
				<li><a href="https://ai.google.dev/terms" target="_blank" rel="noopener">Kebijakan AI</a></li>
				<li><a href="https://ai.google.dev/terms" target="_blank" rel="noopener">Privasi</a></li>
			</ul>
		</div>
	</div>
</footer>
<div class="shell">
	<div class="foot-bottom">
		<span>© 2026 SmartDoc · Ekstraksi dokumen berbasis AI</span>
		<span>Made with ☕ in ID</span>
	</div>
</div>

<style>
	.foot-grid {
		border-top: 1px solid var(--line);
		padding: 40px 0;
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr;
		gap: 32px;
		font-size: 13px;
		color: var(--ink-soft);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		letter-spacing: -0.01em;
		font-size: 18px;
		color: var(--ink);
	}
	.brand-mark {
		width: 28px; height: 28px;
		border-radius: 8px;
		background: var(--brand);
		color: var(--bg);
		display: grid;
		place-items: center;
		font-family: var(--font-serif);
		font-size: 18px;
		font-style: italic;
		line-height: 1;
		padding-bottom: 2px;
	}
	.foot-brand { max-width: 280px; }
	.foot-brand p { margin: 12px 0 0; color: var(--ink-mute); line-height: 1.5; }
	h5 {
		font-family: var(--font-mono);
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: var(--ink-mute);
		margin: 0 0 14px;
		font-weight: 500;
	}
	ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
	a { transition: color .15s; }
	a:hover { color: var(--ink); }
	.foot-bottom {
		border-top: 1px solid var(--line-soft);
		padding: 18px 0 40px;
		display: flex;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--ink-mute);
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
	@media (max-width: 720px) {
		.foot-grid { grid-template-columns: 1fr 1fr; }
	}
</style>

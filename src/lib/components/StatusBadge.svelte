<script lang="ts">
	type Status = 'uploaded' | 'processing' | 'extracted' | 'verified' | 'failed' | 'not_a_receipt';

	let { status }: { status: Status } = $props();

	const config = $derived((() => {
		switch (status) {
			case 'verified': return { label: 'Siap', cls: '' };
			case 'extracted': return { label: 'Perlu cek', cls: 'review' };
			case 'processing':
			case 'uploaded': return { label: 'Memproses', cls: 'pending' };
			case 'failed': return { label: 'Gagal', cls: 'review' };
			case 'not_a_receipt': return { label: 'Bukan resi', cls: 'review' };
			default: return { label: status, cls: 'pending' };
		}
	})());
</script>

<span class="badge {config.cls}">{config.label}</span>

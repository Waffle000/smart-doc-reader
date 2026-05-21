export function formatAmount(amount: number | null, currency: string | null): string {
	if (amount == null) return '—';
	const cur = currency ?? 'IDR';
	try {
		return new Intl.NumberFormat(cur === 'IDR' ? 'id-ID' : 'en-US', {
			style: 'currency', currency: cur, minimumFractionDigits: cur === 'IDR' ? 0 : 2
		}).format(amount);
	} catch { return `${cur} ${amount.toLocaleString()}`; }
}
// parse input user "12.500,50" / "12,500.50" / "12500.5" → number
export function parseAmount(input: string): number | null {
	const cleaned = input.replace(/[^\d.,-]/g, '');
	if (!cleaned) return null;
	// jika ada keduanya, asumsikan pemisah terakhir = desimal
	const lastComma = cleaned.lastIndexOf(','), lastDot = cleaned.lastIndexOf('.');
	let normalized = cleaned;
	if (lastComma > lastDot) normalized = cleaned.replace(/\./g, '').replace(',', '.');
	else normalized = cleaned.replace(/,/g, '');
	const n = parseFloat(normalized);
	return isNaN(n) ? null : n;
}

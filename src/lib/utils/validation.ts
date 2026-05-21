import { CURRENCY_WHITELIST } from '$lib/server/ai/schema';
import type { Confidence } from '$lib/server/db/schema';

export function dateSane(iso: string | null): boolean {
	if (!iso) return false;
	const d = new Date(iso);
	if (isNaN(d.getTime())) return false;
	const now = Date.now();
	return d.getTime() > now - 366 * 864e5 && d.getTime() < now + 183 * 864e5; // -1yr .. +6mo
}
export function currencyKnown(c: string | null): boolean {
	return !!c && (CURRENCY_WHITELIST as readonly string[]).includes(c);
}
export function totalsMatch(total: number | null, items: { total: number | null }[]): boolean {
	if (total == null || items.length === 0) return true;
	const sum = items.reduce((a, i) => a + (i.total ?? 0), 0);
	return Math.abs(sum - total) <= total * 0.05;
}
// confidence akhir = yang terburuk antara AI dan hasil validasi
export function effectiveConfidence(ai: Confidence | null, validationOk: boolean): Confidence {
	if (!validationOk) return 'low';
	return ai ?? 'low';
}

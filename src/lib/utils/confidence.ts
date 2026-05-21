import type { Confidence } from '$lib/server/db/schema';
// Mengembalikan style decoration sesuai design.md §7 (warna --warn terracotta).
export function confidenceClass(c: Confidence | null): string {
	if (c === 'low') return 'conf-low';     // wavy underline --warn (terracotta)
	if (c === 'medium') return 'conf-medium'; // dotted underline --warn
	return '';                                // high = tanpa indikator
}
export const CONFIDENCE_HINT: Record<Confidence, string> = {
	high: '', medium: 'AI tidak 100% yakin — periksa nilai ini.', low: 'Keyakinan rendah — wajib diperiksa.'
};

import { error } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { documents, extractions } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform }) => {
	if (!platform?.env) throw error(500, 'Binding tidak tersedia.');
	const db = getDb(platform.env.DB);

	const idsParam = url.searchParams.get('ids');
	const ids = idsParam ? idsParam.split(',').filter(Boolean) : null;

	let rows;
	if (ids && ids.length > 0) {
		rows = await db
			.select({
				filename: documents.filename, status: documents.status,
				vendor: extractions.vendor, invoiceDate: extractions.invoiceDate,
				totalAmount: extractions.totalAmount, currency: extractions.currency,
				taxAmount: extractions.taxAmount
			})
			.from(documents)
			.leftJoin(extractions, eq(extractions.documentId, documents.id))
			.where(inArray(documents.id, ids));
	} else {
		rows = await db
			.select({
				filename: documents.filename, status: documents.status,
				vendor: extractions.vendor, invoiceDate: extractions.invoiceDate,
				totalAmount: extractions.totalAmount, currency: extractions.currency,
				taxAmount: extractions.taxAmount
			})
			.from(documents)
			.leftJoin(extractions, eq(extractions.documentId, documents.id));
	}

	const headers = ['filename', 'vendor', 'invoice_date', 'total_amount', 'currency', 'tax_amount', 'status'];
	const csvRows = [headers.join(',')];

	for (const row of rows) {
		const values = [
			escapeCSV(row.filename),
			escapeCSV(row.vendor ?? ''),
			escapeCSV(row.invoiceDate ?? ''),
			row.totalAmount?.toString() ?? '',
			escapeCSV(row.currency ?? ''),
			row.taxAmount?.toString() ?? '',
			escapeCSV(row.status)
		];
		csvRows.push(values.join(','));
	}

	const csv = csvRows.join('\n');

	return new Response(csv, {
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': 'attachment; filename="export.csv"'
		}
	});
};

function escapeCSV(value: string): string {
	if (value.includes(',') || value.includes('"') || value.includes('\n')) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

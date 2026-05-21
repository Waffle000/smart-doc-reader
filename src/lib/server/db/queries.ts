import { desc, like, and, gte, lte, eq } from 'drizzle-orm';
import type { DB } from './index';
import { documents, extractions } from './schema';

export async function listDocuments(db: DB, userId: string, opts: { q?: string; from?: string; to?: string }) {
	const where = [eq(documents.userId, userId)];
	if (opts.q) where.push(like(extractions.vendor, `%${opts.q}%`));
	if (opts.from) where.push(gte(extractions.invoiceDate, opts.from));
	if (opts.to) where.push(lte(extractions.invoiceDate, opts.to));
	return db
		.select({
			id: documents.id, filename: documents.filename, status: documents.status,
			createdAt: documents.createdAt, vendor: extractions.vendor,
			invoiceDate: extractions.invoiceDate, totalAmount: extractions.totalAmount,
			currency: extractions.currency
		})
		.from(documents)
		.leftJoin(extractions, eq(extractions.documentId, documents.id))
		.where(and(...where))
		.orderBy(desc(documents.createdAt));
}

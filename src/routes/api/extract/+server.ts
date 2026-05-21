import { json, error } from '@sveltejs/kit';
import { ulid } from 'ulidx';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { documents, extractions, lineItems } from '$lib/server/db/schema';
import { getFile } from '$lib/server/r2';
import { extractDocument } from '$lib/server/ai/extract';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
	if (!platform?.env) throw error(500, 'Binding tidak tersedia.');
	const { documentId } = await request.json() as { documentId: string };
	const db = getDb(platform.env.DB);

	const [doc] = await db.select().from(documents).where(eq(documents.id, documentId));
	if (!doc) throw error(404, 'Dokumen tidak ditemukan.');
	if (doc.status === 'processing') return json({ ok: true, message: 'Sudah diproses.' });
	if (doc.status === 'extracted' || doc.status === 'verified') return json({ ok: true, message: 'Sudah diekstrak.' });

	await db.update(documents).set({ status: 'processing', updatedAt: Date.now() }).where(eq(documents.id, doc.id));

	const obj = await getFile(platform.env.R2, doc.r2Key);
	if (!obj) { await markFailed(db, doc.id, 'File hilang di storage.'); return json({ ok: false, code: 'FILE_MISSING' }, { status: 422 }); }

	const outcome = await extractDocument({
		apiKey: platform.env.GEMINI_API_KEY,
		fileBytes: await obj.arrayBuffer(),
		mimeType: doc.mimeType
	});

	if (!outcome.ok) { await markFailed(db, doc.id, outcome.message); return json({ ok: false, code: outcome.code, message: outcome.message }, { status: 502 }); }

	const r = outcome.result;
	if (!r.is_document) {
		await db.update(documents).set({ status: 'not_a_receipt', errorMessage: r.rejection_reason, updatedAt: Date.now() }).where(eq(documents.id, doc.id));
		return json({ ok: false, code: 'NOT_A_RECEIPT', message: r.rejection_reason });
	}

	const extId = ulid();
	const now = Date.now();
	const statements = [
		db.insert(extractions).values({
			id: extId, documentId: doc.id, vendor: r.vendor, vendorConfidence: r.vendor_confidence,
			invoiceDate: r.invoice_date, invoiceDateConfidence: r.invoice_date_confidence,
			totalAmount: r.total_amount, totalAmountConfidence: r.total_amount_confidence,
			currency: r.currency, currencyConfidence: r.currency_confidence,
			taxAmount: r.tax_amount, subtotal: r.subtotal,
			rawAiResponse: outcome.raw, aiModel: outcome.model, isUserEdited: false, createdAt: now, updatedAt: now
		}),
		...r.line_items.map((li, i) => db.insert(lineItems).values({
			id: ulid(), extractionId: extId, description: li.description, quantity: li.quantity,
			unitPrice: li.unit_price, total: li.total, confidence: li.confidence, position: i, createdAt: now
		})),
		db.update(documents).set({ status: 'extracted', updatedAt: now }).where(eq(documents.id, doc.id))
	];
	await db.batch(statements as never); // D1 transaction
	return json({ ok: true, extractionId: extId });
};

async function markFailed(db: ReturnType<typeof getDb>, id: string, message: string): Promise<void> {
	await db.update(documents).set({ status: 'failed', errorMessage: message, updatedAt: Date.now() }).where(eq(documents.id, id));
}

import { error, fail, redirect } from '@sveltejs/kit';
import { eq, desc, asc } from 'drizzle-orm';
import { ulid } from 'ulidx';
import { getDb } from '$lib/server/db';
import { documents, extractions, lineItems } from '$lib/server/db/schema';
import { deleteFile } from '$lib/server/r2';
import { parseAmount } from '$lib/utils/currency';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, platform, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	if (!platform?.env) throw error(500, 'Binding tidak tersedia.');
	const db = getDb(platform.env.DB);
	const [doc] = await db.select().from(documents).where(eq(documents.id, params.id));
	if (!doc || doc.userId !== locals.user.id) throw error(404, 'Dokumen tidak ditemukan.');
	const [ext] = await db.select().from(extractions)
		.where(eq(extractions.documentId, doc.id)).orderBy(desc(extractions.createdAt)).limit(1);
	const items = ext
		? await db.select().from(lineItems).where(eq(lineItems.extractionId, ext.id)).orderBy(asc(lineItems.position))
		: [];
	return { doc, ext: ext ?? null, items };
};

export const actions: Actions = {
	save: async ({ request, params, platform, locals }) => {
		if (!locals.user) throw error(401, 'Unauthorized');
		if (!platform?.env) return fail(500, { message: 'Binding tidak tersedia.' });
		const db = getDb(platform.env.DB);
		const formData = await request.formData();

		const [doc] = await db.select().from(documents).where(eq(documents.id, params.id));
		if (!doc || doc.userId !== locals.user.id) throw error(404, 'Dokumen tidak ditemukan.');

		const [ext] = await db.select().from(extractions)
			.where(eq(extractions.documentId, doc.id)).orderBy(desc(extractions.createdAt)).limit(1);
		if (!ext) return fail(400, { message: 'Belum ada data ekstraksi.' });

		const now = Date.now();
		const vendor = formData.get('vendor') as string | null;
		const invoiceDate = formData.get('invoiceDate') as string | null;
		const totalAmount = formData.get('totalAmount') ? parseAmount(formData.get('totalAmount') as string) : null;
		const currency = formData.get('currency') as string | null;
		const taxAmount = formData.get('taxAmount') ? parseAmount(formData.get('taxAmount') as string) : null;
		const subtotal = formData.get('subtotal') ? parseAmount(formData.get('subtotal') as string) : null;

		await db.update(extractions).set({
			vendor, invoiceDate, totalAmount, currency, taxAmount, subtotal,
			isUserEdited: true, updatedAt: now
		}).where(eq(extractions.id, ext.id));

		// Update line items
		const itemCount = parseInt(formData.get('itemCount') as string) || 0;
		for (let i = 0; i < itemCount; i++) {
			const itemId = formData.get(`item_${i}_id`) as string;
			const description = formData.get(`item_${i}_description`) as string;
			const quantity = formData.get(`item_${i}_quantity`) ? parseAmount(formData.get(`item_${i}_quantity`) as string) : null;
			const unitPrice = formData.get(`item_${i}_unitPrice`) ? parseAmount(formData.get(`item_${i}_unitPrice`) as string) : null;
			const total = formData.get(`item_${i}_total`) ? parseAmount(formData.get(`item_${i}_total`) as string) : null;

			if (itemId) {
				await db.update(lineItems).set({ description, quantity, unitPrice, total }).where(eq(lineItems.id, itemId));
			}
		}

		await db.update(documents).set({ status: 'verified', updatedAt: now }).where(eq(documents.id, doc.id));

		return { success: true };
	},

	reextract: async ({ params, platform, locals }) => {
		if (!locals.user) throw error(401, 'Unauthorized');
		if (!platform?.env) return fail(500, { message: 'Binding tidak tersedia.' });
		const db = getDb(platform.env.DB);
		
		const [doc] = await db.select().from(documents).where(eq(documents.id, params.id));
		if (!doc || doc.userId !== locals.user.id) throw error(404, 'Dokumen tidak ditemukan.');
		
		await db.update(documents).set({ status: 'uploaded', errorMessage: null, updatedAt: Date.now() }).where(eq(documents.id, params.id));
		return { reextract: true };
	},

	delete: async ({ params, platform, locals }) => {
		if (!locals.user) throw error(401, 'Unauthorized');
		if (!platform?.env) return fail(500, { message: 'Binding tidak tersedia.' });
		const db = getDb(platform.env.DB);

		const [doc] = await db.select().from(documents).where(eq(documents.id, params.id));
		if (!doc || doc.userId !== locals.user.id) throw error(404, 'Dokumen tidak ditemukan.');

		// Hard delete: D1 cascade + R2
		await db.delete(documents).where(eq(documents.id, doc.id));
		await deleteFile(platform.env.R2, doc.r2Key);

		throw redirect(303, '/inbox');
	}
};

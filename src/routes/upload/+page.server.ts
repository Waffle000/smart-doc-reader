import { fail, redirect } from '@sveltejs/kit';
import { ulid } from 'ulidx';
import { getDb } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { putFile } from '$lib/server/r2';
import { validateFile } from '$lib/utils/file-validation';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, platform, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });
		if (!platform?.env) return fail(500, { message: 'Binding Cloudflare tidak tersedia.' });
		const formData = await request.formData();
		const file = formData.get('file');
		if (!(file instanceof File)) return fail(400, { message: 'Tidak ada file yang dipilih.' });

		const buffer = await file.arrayBuffer();
		const check = validateFile(new Uint8Array(buffer), file.size);
		if (!check.ok) return fail(400, { message: check.message });

		const id = ulid();
		const r2Key = `documents/${id}`;
		const now = Date.now();
		try {
			await putFile(platform.env.R2, r2Key, buffer, check.mime);
			const db = getDb(platform.env.DB);
			await db.insert(documents).values({
				id, userId: locals.user.id, filename: file.name.slice(0, 255), mimeType: check.mime,
				sizeBytes: file.size, r2Key, status: 'uploaded', createdAt: now, updatedAt: now
			});
		} catch (err) {
			console.error('Upload gagal:', err);
			return fail(500, { message: 'Gagal menyimpan dokumen. Coba lagi.' });
		}
		throw redirect(303, `/docs/${id}`);
	}
};

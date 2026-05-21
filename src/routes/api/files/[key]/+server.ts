import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getDb } from '$lib/server/db';
import { documents } from '$lib/server/db/schema';
import { getFile } from '$lib/server/r2';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	if (!platform?.env) throw error(500, 'Binding tidak tersedia.');
	const db = getDb(platform.env.DB);

	// key param = document ID, r2Key = documents/${id}
	const r2Key = `documents/${params.key}`;
	const [doc] = await db.select().from(documents).where(eq(documents.r2Key, r2Key));
	if (!doc || doc.userId !== locals.user.id) throw error(404, 'File tidak ditemukan.');

	const obj = await getFile(platform.env.R2, doc.r2Key);
	if (!obj) throw error(404, 'File tidak ditemukan di storage.');

	const body = await obj.arrayBuffer();

	return new Response(body, {
		headers: {
			'Content-Type': doc.mimeType,
			'Content-Disposition': `inline; filename="${doc.filename.replace(/"/g, '\\"')}"`,
			'X-Content-Type-Options': 'nosniff',
			'Cache-Control': 'private, max-age=3600'
		}
	});
};

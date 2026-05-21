import { getDb } from '$lib/server/db';
import { listDocuments } from '$lib/server/db/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, platform, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	if (!platform?.env) throw error(500, 'Binding tidak tersedia.');
	const db = getDb(platform.env.DB);
	const q = url.searchParams.get('q') ?? undefined;
	const from = url.searchParams.get('from') ?? undefined;
	const to = url.searchParams.get('to') ?? undefined;
	const docs = await listDocuments(db, locals.user.id, { q, from, to });
	return { docs, filters: { q, from, to } };
};

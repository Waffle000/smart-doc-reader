import { redirect } from '@sveltejs/kit';
import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (event.locals.session) {
		await invalidateSession(event.platform?.env.DB!, event.locals.session.id);
		deleteSessionTokenCookie(event);
	}
	throw redirect(302, '/');
};

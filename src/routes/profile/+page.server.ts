import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Already protected by hooks.server.ts? No, hooks.server.ts protects /inbox, /upload, /docs.
	// We need to either add /profile to protectedRoutes in hooks.server.ts, or check here.
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	return {
		user: locals.user
	};
};

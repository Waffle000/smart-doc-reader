import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { verifyPassword, createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, '/inbox');
	}
	return {};
};

const loginSchema = z.object({
	email: z.string().email('Email tidak valid'),
	password: z.string().min(1, 'Password diperlukan')
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		const parsed = loginSchema.safeParse({ email, password });
		
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0].message,
				email: email?.toString()
			});
		}

		const db = getDb(event.platform?.env.DB!);
		
		const existingUser = await db.select().from(users).where(eq(users.email, parsed.data.email)).get();
		if (!existingUser) {
			return fail(400, {
				error: 'Email atau password salah',
				email: parsed.data.email
			});
		}

		const validPassword = await verifyPassword(parsed.data.password, existingUser.passwordHash);
		if (!validPassword) {
			return fail(400, {
				error: 'Email atau password salah',
				email: parsed.data.email
			});
		}

		try {
			const token = generateSessionToken();
			const session = await createSession(event.platform?.env.DB!, token, existingUser.id);
			setSessionTokenCookie(event, token, new Date(session.expiresAt));
		} catch (e) {
			console.error('Login error:', e);
			return fail(500, {
				error: 'Terjadi kesalahan saat masuk',
				email: parsed.data.email
			});
		}

		throw redirect(302, '/inbox');
	}
};

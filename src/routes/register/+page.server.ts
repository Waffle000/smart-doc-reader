import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { getDb } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { hashPassword, createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { ulid } from 'ulidx';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, '/inbox');
	}
	return {};
};

const registerSchema = z.object({
	name: z.string().min(2, 'Nama minimal 2 karakter'),
	email: z.string().email('Email tidak valid'),
	password: z.string().min(8, 'Password minimal 8 karakter')
});

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');

		const parsed = registerSchema.safeParse({ name, email, password });
		
		if (!parsed.success) {
			return fail(400, {
				error: parsed.error.issues[0].message,
				name: name?.toString(),
				email: email?.toString()
			});
		}

		const db = getDb(event.platform?.env.DB!);
		
		// Check if email exists
		const existingUser = await db.select().from(users).where(eq(users.email, parsed.data.email)).get();
		if (existingUser) {
			return fail(400, {
				error: 'Email sudah terdaftar',
				name: parsed.data.name,
				email: parsed.data.email
			});
		}

		// Hash password and create user
		const passwordHash = await hashPassword(parsed.data.password);
		const userId = ulid();
		
		try {
			await db.insert(users).values({
				id: userId,
				name: parsed.data.name,
				email: parsed.data.email,
				passwordHash,
				createdAt: Date.now(),
				updatedAt: Date.now()
			});

			const token = generateSessionToken();
			const session = await createSession(event.platform?.env.DB!, token, userId);
			setSessionTokenCookie(event, token, new Date(session.expiresAt));
		} catch (e) {
			console.error('Register error:', e);
			return fail(500, {
				error: 'Terjadi kesalahan saat mendaftar',
				email: parsed.data.email
			});
		}

		throw redirect(302, '/inbox');
	}
};

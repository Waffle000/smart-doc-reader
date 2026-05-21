import { eq } from 'drizzle-orm';
import type { D1Database } from '@cloudflare/workers-types';
import { getDb } from './db';
import { sessions, users, type Session, type User } from './db/schema';
import type { RequestEvent } from '@sveltejs/kit';

const ENCODER = new TextEncoder();
const SESSION_COOKIE_NAME = 'session';
// 7 days in milliseconds
const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; 

function buf2hex(buffer: ArrayBuffer | Uint8Array) {
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	return Array.from(bytes)
		.map((x) => x.toString(16).padStart(2, '0'))
		.join('');
}

function hex2buf(hex: string) {
	return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
}

export async function hashPassword(password: string): Promise<string> {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		ENCODER.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveBits']
	);

	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);

	const saltHex = buf2hex(salt);
	const hashHex = buf2hex(derivedBits);

	return `pbkdf2_sha256$100000$${saltHex}$${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
	const parts = storedHash.split('$');
	if (parts.length !== 4 || parts[0] !== 'pbkdf2_sha256') return false;

	const iterations = parseInt(parts[1], 10);
	const saltHex = parts[2];
	const originalHashHex = parts[3];

	const salt = hex2buf(saltHex);
	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		ENCODER.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveBits']
	);

	const derivedBits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: iterations,
			hash: 'SHA-256'
		},
		keyMaterial,
		256
	);

	const newHashHex = buf2hex(derivedBits);
	return newHashHex === originalHashHex;
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return buf2hex(bytes);
}

export async function createSession(d1: D1Database, token: string, userId: string): Promise<Session> {
	const sessionId = await hashSessionToken(token);
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: Date.now() + SESSION_EXPIRY_MS
	};
	
	const db = getDb(d1);
	await db.insert(sessions).values(session);
	return session;
}

// We hash the token before storing it in the database for security (session hijacking protection if DB leaks)
async function hashSessionToken(token: string): Promise<string> {
	const tokenBytes = ENCODER.encode(token);
	const hashBuffer = await crypto.subtle.digest('SHA-256', tokenBytes);
	return buf2hex(hashBuffer);
}

export async function validateSessionToken(d1: D1Database, token: string): Promise<{ session: Session; user: User } | { session: null; user: null }> {
	const sessionId = await hashSessionToken(token);
	const db = getDb(d1);
	
	const result = await db
		.select({ user: users, session: sessions })
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.get();

	if (!result) {
		return { session: null, user: null };
	}

	const { user, session } = result;

	// Check if expired
	if (Date.now() >= session.expiresAt) {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		return { session: null, user: null };
	}

	// Extend session if it's past half of its lifetime
	if (Date.now() >= session.expiresAt - SESSION_EXPIRY_MS / 2) {
		session.expiresAt = Date.now() + SESSION_EXPIRY_MS;
		await db
			.update(sessions)
			.set({ expiresAt: session.expiresAt })
			.where(eq(sessions.id, session.id));
	}

	return { session, user };
}

export async function invalidateSession(d1: D1Database, sessionId: string): Promise<void> {
	const db = getDb(d1);
	await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(SESSION_COOKIE_NAME, token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/',
		secure: !event.url.hostname.includes('localhost')
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set(SESSION_COOKIE_NAME, '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/',
		secure: !event.url.hostname.includes('localhost')
	});
}

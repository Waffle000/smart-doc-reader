import { redirect, type Handle } from '@sveltejs/kit';
import { validateSessionToken, setSessionTokenCookie, deleteSessionTokenCookie } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Check for session token
	const token = event.cookies.get('session');
	
	if (!token || !event.platform?.env.DB) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		// 2. Validate session
		const { session, user } = await validateSessionToken(event.platform.env.DB, token);
		
		if (session) {
			setSessionTokenCookie(event, token, new Date(session.expiresAt));
		} else {
			deleteSessionTokenCookie(event);
		}
		
		event.locals.user = user;
		event.locals.session = session;
	}

	// 3. Protect routes
	const protectedRoutes = ['/inbox', '/upload', '/docs'];
	const isProtectedRoute = protectedRoutes.some(route => event.url.pathname.startsWith(route));
	
	if (isProtectedRoute && !event.locals.user) {
		throw redirect(302, '/login');
	}

	const res = await resolve(event);
	res.headers.set('X-Content-Type-Options', 'nosniff');
	res.headers.set('X-Frame-Options', 'DENY');
	res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
	res.headers.set('Content-Security-Policy',
		"default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'");
	return res;
};

import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/db/schema').User | null;
			session: import('$lib/server/db/schema').Session | null;
		}
		interface Platform {
			env: {
				DB: D1Database;
				R2: R2Bucket;
				GEMINI_API_KEY: string;
			};
		}
	}
}
export {};

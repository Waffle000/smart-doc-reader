import type { R2Bucket } from '@cloudflare/workers-types';

export async function putFile(r2: R2Bucket, key: string, body: ArrayBuffer, contentType: string): Promise<void> {
	await r2.put(key, body, { httpMetadata: { contentType } });
}
export async function getFile(r2: R2Bucket, key: string) { return r2.get(key); }
export async function deleteFile(r2: R2Bucket, key: string): Promise<void> { await r2.delete(key); }

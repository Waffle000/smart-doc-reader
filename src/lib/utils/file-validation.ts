export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;
export type AllowedMime = (typeof ALLOWED_MIME)[number];

export type FileValidation =
	| { ok: true; mime: AllowedMime }
	| { ok: false; code: 'EMPTY' | 'TOO_LARGE' | 'UNSUPPORTED_TYPE'; message: string };

export function validateFile(bytes: Uint8Array, declaredSize: number): FileValidation {
	if (declaredSize === 0 || bytes.length === 0) return { ok: false, code: 'EMPTY', message: 'File kosong.' };
	if (declaredSize > MAX_FILE_SIZE) return { ok: false, code: 'TOO_LARGE', message: 'File lebih dari 10MB. Kompres dulu.' };
	const mime = detectMime(bytes);
	if (!mime) return { ok: false, code: 'UNSUPPORTED_TYPE', message: 'Hanya JPG, PNG, WebP, atau PDF.' };
	return { ok: true, mime };
}

function detectMime(b: Uint8Array): AllowedMime | null {
	if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
	if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
	if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'application/pdf';
	if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
		b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
	return null;
}

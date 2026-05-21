import { GoogleGenAI } from '@google/genai';
import { extractionResultSchema, type ExtractionResult } from './schema';
import { SYSTEM_PROMPT, USER_INSTRUCTION, GEMINI_RESPONSE_SCHEMA } from './prompt';

const MODEL = 'gemini-2.5-flash';
const TIMEOUT_MS = 28_000;

export type ExtractOutcome =
	| { ok: true; result: ExtractionResult; model: string; raw: string }
	| { ok: false; code: 'TIMEOUT' | 'API_ERROR' | 'PARSE_ERROR' | 'INVALID_OUTPUT'; message: string };

interface ExtractInput { apiKey: string; fileBytes: ArrayBuffer; mimeType: string; }

export async function extractDocument({ apiKey, fileBytes, mimeType }: ExtractInput): Promise<ExtractOutcome> {
	const ai = new GoogleGenAI({ apiKey });
	const base64 = arrayBufferToBase64(fileBytes);
	const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('__TIMEOUT__')), TIMEOUT_MS));

	let rawText: string;
	try {
		const response = await Promise.race([
			ai.models.generateContent({
				model: MODEL,
				contents: [{ role: 'user', parts: [{ text: USER_INSTRUCTION }, { inlineData: { mimeType, data: base64 } }] }],
				config: {
					systemInstruction: SYSTEM_PROMPT,
					responseMimeType: 'application/json',
					responseSchema: GEMINI_RESPONSE_SCHEMA,
					temperature: 0.1
				}
			}),
			timeout
		]);
		rawText = response.text ?? '';
		if (!rawText.trim()) return { ok: false, code: 'API_ERROR', message: 'Respons kosong dari model.' };
	} catch (err) {
		if (err instanceof Error && err.message === '__TIMEOUT__')
			return { ok: false, code: 'TIMEOUT', message: 'Ekstraksi melebihi batas waktu.' };
		console.error('Gemini API error:', err);
		return { ok: false, code: 'API_ERROR', message: 'Gagal menghubungi layanan AI.' };
	}

	let parsedJson: unknown;
	try { parsedJson = JSON.parse(rawText); }
	catch { return { ok: false, code: 'PARSE_ERROR', message: 'Respons AI bukan JSON valid.' }; }

	const validated = extractionResultSchema.safeParse(parsedJson);
	if (!validated.success) {
		console.error('Output gagal validasi Zod:', validated.error.issues);
		return { ok: false, code: 'INVALID_OUTPUT', message: 'Hasil ekstraksi tidak sesuai format.' };
	}
	return { ok: true, result: validated.data, model: MODEL, raw: rawText };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	const chunk = 0x8000;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}

import { z } from 'zod';

export const confidenceSchema = z.enum(['high', 'medium', 'low']);
export const CURRENCY_WHITELIST = ['IDR', 'USD', 'SGD', 'EUR', 'JPY', 'MYR', 'AUD', 'GBP'] as const;
const MAX_AMOUNT = 1_000_000_000;
const MAX_TEXT = 200;

export const lineItemSchema = z.object({
	description: z.string().max(MAX_TEXT),
	quantity: z.number().min(0).max(100_000).nullable(),
	unit_price: z.number().min(0).max(MAX_AMOUNT).nullable(),
	total: z.number().min(0).max(MAX_AMOUNT).nullable(),
	confidence: confidenceSchema
});

export const extractionResultSchema = z.object({
	is_document: z.boolean(),
	rejection_reason: z.string().max(300).nullable(),
	vendor: z.string().max(MAX_TEXT).nullable(),
	vendor_confidence: confidenceSchema.nullable(),
	invoice_date: z.string().max(10).nullable(),
	invoice_date_confidence: confidenceSchema.nullable(),
	total_amount: z.number().min(0).max(MAX_AMOUNT).nullable(),
	total_amount_confidence: confidenceSchema.nullable(),
	currency: z.string().max(3).nullable(),
	currency_confidence: confidenceSchema.nullable(),
	tax_amount: z.number().min(0).max(MAX_AMOUNT).nullable(),
	subtotal: z.number().min(0).max(MAX_AMOUNT).nullable(),
	line_items: z.array(lineItemSchema).max(200)
});

export type ExtractionResult = z.infer<typeof extractionResultSchema>;
export type LineItemResult = z.infer<typeof lineItemSchema>;

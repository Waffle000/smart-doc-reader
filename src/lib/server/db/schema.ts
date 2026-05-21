import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const DOCUMENT_STATUS = [
	'uploaded', 'processing', 'extracted', 'verified', 'failed', 'not_a_receipt'
] as const;
export const CONFIDENCE = ['high', 'medium', 'low'] as const;

export const documents = sqliteTable('documents', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	filename: text('filename').notNull(),
	mimeType: text('mime_type').notNull(),
	sizeBytes: integer('size_bytes').notNull(),
	r2Key: text('r2_key').notNull().unique(),
	status: text('status', { enum: DOCUMENT_STATUS }).notNull(),
	errorMessage: text('error_message'),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull()
}, (t) => ({
	statusIdx: index('idx_documents_status').on(t.status),
	createdIdx: index('idx_documents_created').on(t.createdAt),
	userIdx: index('idx_documents_user').on(t.userId)
}));

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull()
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull()
}, (t) => ({
	userIdx: index('idx_sessions_user').on(t.userId)
}));

export const extractions = sqliteTable('extractions', {
	id: text('id').primaryKey(),
	documentId: text('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
	vendor: text('vendor'),
	vendorConfidence: text('vendor_confidence', { enum: CONFIDENCE }),
	invoiceDate: text('invoice_date'),
	invoiceDateConfidence: text('invoice_date_confidence', { enum: CONFIDENCE }),
	totalAmount: real('total_amount'),
	totalAmountConfidence: text('total_amount_confidence', { enum: CONFIDENCE }),
	currency: text('currency'),
	currencyConfidence: text('currency_confidence', { enum: CONFIDENCE }),
	taxAmount: real('tax_amount'),
	subtotal: real('subtotal'),
	rawAiResponse: text('raw_ai_response').notNull(),
	aiModel: text('ai_model').notNull(),
	isUserEdited: integer('is_user_edited', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull()
}, (t) => ({
	docIdx: index('idx_extractions_doc').on(t.documentId),
	vendorIdx: index('idx_extractions_vendor').on(t.vendor),
	dateIdx: index('idx_extractions_date').on(t.invoiceDate)
}));

export const lineItems = sqliteTable('line_items', {
	id: text('id').primaryKey(),
	extractionId: text('extraction_id').notNull().references(() => extractions.id, { onDelete: 'cascade' }),
	description: text('description').notNull(),
	quantity: real('quantity'),
	unitPrice: real('unit_price'),
	total: real('total'),
	confidence: text('confidence', { enum: CONFIDENCE }),
	position: integer('position').notNull(),
	createdAt: integer('created_at').notNull()
}, (t) => ({
	extractionIdx: index('idx_items_extraction').on(t.extractionId)
}));

export const usersRelations = relations(users, ({ many }) => ({
	documents: many(documents),
	sessions: many(sessions)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, { fields: [sessions.userId], references: [users.id] })
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({ 
	extractions: many(extractions),
	user: one(users, { fields: [documents.userId], references: [users.id] })
}));
export const extractionsRelations = relations(extractions, ({ one, many }) => ({
	document: one(documents, { fields: [extractions.documentId], references: [documents.id] }),
	lineItems: many(lineItems)
}));
export const lineItemsRelations = relations(lineItems, ({ one }) => ({
	extraction: one(extractions, { fields: [lineItems.extractionId], references: [extractions.id] })
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type Extraction = typeof extractions.$inferSelect;
export type NewExtraction = typeof extractions.$inferInsert;
export type LineItem = typeof lineItems.$inferSelect;
export type NewLineItem = typeof lineItems.$inferInsert;
export type DocumentStatus = (typeof DOCUMENT_STATUS)[number];
export type Confidence = (typeof CONFIDENCE)[number];

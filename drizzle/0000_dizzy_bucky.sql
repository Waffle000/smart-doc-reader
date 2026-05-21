CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`r2_key` text NOT NULL,
	`status` text NOT NULL,
	`error_message` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `documents_r2_key_unique` ON `documents` (`r2_key`);--> statement-breakpoint
CREATE INDEX `idx_documents_status` ON `documents` (`status`);--> statement-breakpoint
CREATE INDEX `idx_documents_created` ON `documents` (`created_at`);--> statement-breakpoint
CREATE TABLE `extractions` (
	`id` text PRIMARY KEY NOT NULL,
	`document_id` text NOT NULL,
	`vendor` text,
	`vendor_confidence` text,
	`invoice_date` text,
	`invoice_date_confidence` text,
	`total_amount` real,
	`total_amount_confidence` text,
	`currency` text,
	`currency_confidence` text,
	`tax_amount` real,
	`subtotal` real,
	`raw_ai_response` text NOT NULL,
	`ai_model` text NOT NULL,
	`is_user_edited` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`document_id`) REFERENCES `documents`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_extractions_doc` ON `extractions` (`document_id`);--> statement-breakpoint
CREATE INDEX `idx_extractions_vendor` ON `extractions` (`vendor`);--> statement-breakpoint
CREATE INDEX `idx_extractions_date` ON `extractions` (`invoice_date`);--> statement-breakpoint
CREATE TABLE `line_items` (
	`id` text PRIMARY KEY NOT NULL,
	`extraction_id` text NOT NULL,
	`description` text NOT NULL,
	`quantity` real,
	`unit_price` real,
	`total` real,
	`confidence` text,
	`position` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`extraction_id`) REFERENCES `extractions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_items_extraction` ON `line_items` (`extraction_id`);
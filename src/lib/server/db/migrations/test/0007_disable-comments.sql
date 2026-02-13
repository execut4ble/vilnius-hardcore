ALTER TABLE "event" ADD COLUMN "disable_comments" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "disable_comments" boolean DEFAULT false NOT NULL;
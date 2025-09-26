CREATE TABLE "banned_ip" (
	"id" serial PRIMARY KEY NOT NULL,
	"ip_address" text NOT NULL,
	"ban_date" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "banned_ip_ip_address_unique" UNIQUE("ip_address")
);
--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "ip_address" text;
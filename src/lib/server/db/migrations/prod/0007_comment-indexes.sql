CREATE INDEX "comment_event_id_idx" ON "comment" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "comment_post_id_idx" ON "comment" USING btree ("post_id");
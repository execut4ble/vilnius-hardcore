import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import {
  eventInsertSchema,
  eventUpdateSchema,
} from "$lib/server/db/validations";
import { z } from "zod";
import { uploadImageAction } from "./fileUpload";

export const eventActions = {
  update_event: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: object = Object.fromEntries(formData.entries());
    const slug: FormDataEntryValue | null = formData.get("slug");
    try {
      const event = eventUpdateSchema.parse(data);
      const response = await db
        .update(table.event)
        .set(event)
        .where(eq(table.event.slug, slug as string))
        .returning();
      return response;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors: errors } = err.flatten();
        return fail(400, { errors });
      }
    }
  },
  create_event: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const data: object = Object.fromEntries(formData.entries());
    try {
      const event = eventInsertSchema.parse(data);
      await db.insert(table.event).values(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const { fieldErrors: errors } = err.flatten();
        return fail(400, { errors });
      }
    }
  },
  remove_event: async ({ locals, request }) => {
    if (!locals.session) {
      return fail(401);
    }
    const formData: FormData = await request.formData();
    const slug: FormDataEntryValue | null = formData.get("slug");
    await db.delete(table.event).where(eq(table.event.slug, slug as string));
  },
  upload_image: uploadImageAction,
};

import { fail } from "@sveltejs/kit";
import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { db } from "../db";
import * as table from "$lib/server/db/schema";
import { and, eq, ne } from "drizzle-orm";

export const FILES_DIR = "./static/public/uploads";

export const uploadImageAction = async ({ locals, request }) => {
  const data: FormData = await request.formData();
  const file: FormDataEntryValue | null = data.get("file") as File;

  if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR, { recursive: true });
  }

  if (!locals.session) {
    return fail(401, { message: "Unauthorized" });
  }

  if (file instanceof File === false || file.size === 0) {
    return fail(400, { message: "Bad request" });
  }

  if (!file.type.includes("image")) {
    return fail(406, { message: "File format is not allowed!" });
  }

  const file_path = path.normalize(path.join(FILES_DIR, file.name));
  const slug = data.get("slug");
  const existingFiles = await db
    .select()
    .from(table.event)
    .where(
      and(
        eq(table.event.image, file.name),
        ne(table.event.slug, slug as string),
      ),
    );
  if (existingFiles.length > 0) {
    return fail(400, {
      message: "File name already in use!",
    });
  }

  const nodejs_wstream = fs.createWriteStream(file_path);
  // Convert Web `ReadableStream` to a Node.js `Readable` stream
  const web_rstream = file.stream();
  const nodejs_rstream = Readable.fromWeb(
    web_rstream as ReadableStream<Uint8Array>,
  );
  // Write file to disk and wait for it to finish
  await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
    return fail(500, { message: "An internal error occurred!" });
  });
};

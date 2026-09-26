import { fail } from "@sveltejs/kit";
import path from "node:path";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { db } from "../db";
import * as table from "$lib/server/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { ImageFileValidator } from "$lib/server/validation/image-file.validator";

export const FILES_DIR = "./uploads";

const imageValidator = new ImageFileValidator();

export const uploadImageAction = async ({ locals, request }) => {
  if (!locals.session) {
    return fail(401, { message: "Unauthorized" });
  }

  const data: FormData = await request.formData();
  const file = data.get("file");

  if (file instanceof File === false) {
    return fail(400, { message: "Bad request" });
  }

  const result = await imageValidator.validate(file);
  if (!result.ok) {
    return fail(result.status, { message: result.message });
  }

  const { safeName } = result;
  const root = path.resolve(FILES_DIR);
  const file_path = path.resolve(root, safeName);

  const isContained =
    file_path === root || file_path.startsWith(root + path.sep);
  if (!isContained) {
    return fail(400, { message: "Invalid file name" });
  }

  const slug = data.get("slug");
  const existingFiles = await db
    .select()
    .from(table.event)
    .where(
      and(
        eq(table.event.image, safeName),
        ne(table.event.slug, slug as string),
      ),
    );

  if (existingFiles.length > 0) {
    return fail(400, { message: "File name already in use!" });
  }

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true });
  }

  try {
    const nodejs_wstream = fs.createWriteStream(file_path);
    const nodejs_rstream = Readable.fromWeb(
      file.stream() as ReadableStream<Uint8Array>,
    );
    await pipeline(nodejs_rstream, nodejs_wstream);
  } catch (err) {
    console.error("File upload error:", err);
    await fs.promises.rm(file_path, { force: true }).catch(() => {});
    return fail(500, { message: "An internal error occurred!" });
  }

  return { success: true, file: safeName };
};

import { fail } from "@sveltejs/kit";
import path from "node:path";
import { Readable } from "node:stream";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";

export const FILES_DIR = "./static/public/uploads";

export const uploadImageAction = async ({ request }) => {
  const data: FormData = await request.formData();
  const file: FormDataEntryValue | null = data.get("file") as File;

  if (file instanceof File === false || file.size === 0) {
    return fail(400);
  }

  if (!file.type.includes("image")) {
    return fail(406, { message: "File format is not allowed!" });
  }

  const file_path = path.normalize(path.join(FILES_DIR, file.name));

  if (fs.existsSync(file_path)) {
    return fail(400);
  }

  const nodejs_wstream = fs.createWriteStream(file_path);
  // Convert Web `ReadableStream` to a Node.js `Readable` stream
  const web_rstream = file.stream();
  const nodejs_rstream = Readable.fromWeb(web_rstream as any);
  // Write file to disk and wait for it to finish
  await pipeline(nodejs_rstream, nodejs_wstream).catch(() => {
    return fail(500);
  });
};

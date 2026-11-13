import path from "path";
import fs from "fs";
import type { RequestHandler } from "./$types";
import { fileTypeFromFile } from "file-type";
import { FILES_DIR } from "#lib/server/actions/file-upload.actions.js";
import { ImageFilenamePolicy } from "#lib/server/validation/image-file.policy.js";

const filenamePolicy = new ImageFilenamePolicy();

export const GET: RequestHandler = async ({ params }) => {
  const safeName = filenamePolicy.sanitize(params.image);
  if (!safeName) {
    return new Response("File not found", { status: 404 });
  }

  const root = path.resolve(FILES_DIR);
  const filePath = path.resolve(root, safeName);

  const isContained = filePath === root || filePath.startsWith(root + path.sep);
  if (!isContained) {
    return new Response("File not found", { status: 404 });
  }

  if (!fs.existsSync(filePath)) {
    return new Response("File not found", { status: 404 });
  }

  // Confirm the bytes on disk actually match an allowed image type before serving it.
  const detected = await fileTypeFromFile(filePath).catch(() => undefined);
  if (!detected || !filenamePolicy.isAllowedExtension(detected.ext)) {
    return new Response("File not found", { status: 404 });
  }

  try {
    const fileStream: fs.ReadStream = fs.createReadStream(filePath);
    let streamClosed: boolean = false;

    return new Response(
      new ReadableStream({
        start(controller: ReadableStreamDefaultController<Uint8Array>) {
          fileStream.on("data", (chunk: string | Buffer) => {
            if (streamClosed) return;
            try {
              const uint8Array =
                chunk instanceof Buffer
                  ? new Uint8Array(chunk)
                  : new Uint8Array(Buffer.from(chunk));
              controller.enqueue(uint8Array);
            } catch (err) {
              if (!streamClosed) {
                console.error("Error enqueuing chunk:", err);
                streamClosed = true;
                fileStream.destroy();
              }
            }
          });

          fileStream.on("end", () => {
            if (streamClosed) return;
            try {
              controller.close();
              streamClosed = true;
            } catch (err) {
              console.error("Error closing controller:", err);
            }
          });

          fileStream.on("error", (err: Error) => {
            if (streamClosed) return;
            console.error("File stream error:", err);
            streamClosed = true;
            try {
              controller.error(err);
            } catch (controllerErr) {
              console.error("Error signaling controller error:", controllerErr);
            }
          });
        },

        cancel() {
          streamClosed = true;
          fileStream.destroy();
        },
      }),
      {
        headers: {
          "Content-Type": detected.mime,
          "Content-Length": fs.statSync(filePath).size.toString(),
          "Cache-Control": "public, max-age=86400",
          "Accept-Ranges": "bytes",
        },
      },
    );
  } catch (error) {
    console.error("Image server error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};

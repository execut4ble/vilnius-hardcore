import path from "path";
import fs from "fs";
import type { RequestHandler } from "./$types";
import { FILES_DIR } from "$lib/formActions/fileUpload";

export const GET: RequestHandler = ({ params }) => {
  const filePath = path.normalize(path.join(FILES_DIR, params.image));

  // Check if file exists first
  if (!fs.existsSync(filePath)) {
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
              // Convert chunk to Uint8Array regardless of whether it's string or Buffer
              const uint8Array =
                chunk instanceof Buffer
                  ? new Uint8Array(chunk)
                  : new Uint8Array(Buffer.from(chunk));
              controller.enqueue(uint8Array);
            } catch (err) {
              // Stream might be closed, ignore enqueue errors
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
              // Controller might already be closed
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
          // Clean up when stream is cancelled
          streamClosed = true;
          fileStream.destroy();
        },
      }),
      {
        headers: {
          "Content-Type": getContentType(filePath),
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

// Utility function to determine content type
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

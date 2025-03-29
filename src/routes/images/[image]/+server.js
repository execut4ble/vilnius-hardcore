import path from "path";
import fs from "fs";
import { FILES_DIR } from "$lib/formActions/fileUpload";

// Use the Web Streams API for better compatibility with Fetch API responses
export function GET({ params }) {
  const filePath = path.normalize(path.join(FILES_DIR, params.image));

  try {
    const fileStream = fs.createReadStream(filePath);

    return new Response(
      new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => {
            if (!controller.desiredSize) return; // Prevent enqueuing when closed
            controller.enqueue(chunk);
          });

          fileStream.on("end", () => {
            if (!controller.desiredSize) return; // Ensure it doesn’t close twice
            controller.close();
          });

          fileStream.on("error", (err) => {
            if (!controller.desiredSize) return; // Prevent duplicate errors
            controller.error(err);
          });
        },
      }),
      {
        headers: {
          "Content-Type": getContentType(filePath),
          "Cache-Control": "public, max-age=86400",
        },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response("File not found", { status: 404 });
  }
}

// Utility function to determine content type
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

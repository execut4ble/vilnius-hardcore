import path from "path";
import fs from "fs";
import { FILES_DIR } from "$lib/files-dir";

// Use the Web Streams API for better compatibility with Fetch API responses
export function GET({ params }) {
  const filePath = path.normalize(path.join(FILES_DIR, params.image));

  try {
    const fileStream = fs.createReadStream(filePath);

    // Convert the Node.js stream into a Web ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": getContentType(filePath),
        "Cache-Control": "public, max-age=86400", // Enables caching
      },
    });
  } catch (error) {
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

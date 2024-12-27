import fs from "node:fs";
import { read } from "$app/server";
import { FILES_DIR } from "$lib/files-dir";

if (!fs.existsSync(FILES_DIR)) {
  fs.mkdirSync(FILES_DIR, { recursive: true });
}

import.meta.glob(
  "/static/public/uploads/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp,svg}",
  {
    query: {
      enhanced: true,
    },
    import: "default",
    eager: true,
  },
);

export async function GET({ params }) {
  return read("/static/public/uploads/" + params.name);
}

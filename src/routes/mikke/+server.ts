import { createHash } from "node:crypto";
import type { RequestHandler } from "./$types";
import { fileTypeFromBuffer } from "file-type";
import { MIKKE_ENDPOINT } from "$app/env/private";
import { BLACKLISTED_MD5 } from "#lib/server/mikke-blacklist.js";

const FALLBACK_PATH = "/mikke-fallback.gif";
const UPSTREAM_TIMEOUT_MS = 5_000;

// The upstream PHP returns a random image on every request, so this response
// must never be cached.
const NO_STORE = { "Cache-Control": "no-store" };

export const GET: RequestHandler = async () => {
  let upstream: Response;
  try {
    upstream = await fetch(MIKKE_ENDPOINT, {
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (err) {
    console.error("mikke: upstream request failed:", err);
    return fallbackResponse();
  }

  if (!upstream.ok) {
    console.error(`mikke: upstream responded ${upstream.status}`);
    return fallbackResponse();
  }

  const bytes = new Uint8Array(await upstream.arrayBuffer());
  if (bytes.byteLength === 0) {
    console.error("mikke: upstream returned an empty body");
    return fallbackResponse();
  }

  // The upstream Content-Type is unreliable (JPEGs have been served labeled
  // as image/gif), so detect the real format from the bytes.
  const detected = await fileTypeFromBuffer(bytes);
  const contentType =
    detected?.mime ??
    upstream.headers.get("Content-Type") ??
    "application/octet-stream";

  const md5 = createHash("md5").update(bytes).digest("hex");
  if (BLACKLISTED_MD5.has(md5)) {
    return fallbackResponse();
  }

  return new Response(bytes, {
    headers: { "Content-Type": contentType, ...NO_STORE },
  });
};

function fallbackResponse(): Response {
  return new Response(null, {
    status: 302,
    headers: { Location: FALLBACK_PATH, ...NO_STORE },
  });
}

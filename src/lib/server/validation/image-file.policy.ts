import path from "node:path";

export const DEFAULT_ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
] as const;

const EXT_ALIASES: Record<string, string> = { jpeg: "jpg" };
export const canonicalExt = (ext: string) =>
  EXT_ALIASES[ext.toLowerCase()] ?? ext.toLowerCase();

export class ImageFilenamePolicy {
  readonly allowedExtensions: ReadonlySet<string>;
  private readonly filenameRe: RegExp;

  constructor(
    allowedExtensions: readonly string[] = DEFAULT_ALLOWED_EXTENSIONS,
  ) {
    this.allowedExtensions = new Set(
      allowedExtensions.map((e) => e.toLowerCase()),
    );
    const pattern = [...this.allowedExtensions].join("|");
    this.filenameRe = new RegExp(
      `^[a-zA-Z0-9._()-ąčęėįšųūžöåä]+\\.(${pattern})$`,
      "i",
    );
  }

  /** Strips path components and enforces the allowlist. Returns the bare safe filename, or null. */
  sanitize(name: string): string | null {
    const base = path.basename(name);
    return this.filenameRe.test(base) ? base : null;
  }

  extensionOf(filename: string): string {
    return canonicalExt(path.extname(filename).slice(1));
  }

  isAllowedExtension(ext: string): boolean {
    return this.allowedExtensions.has(canonicalExt(ext));
  }
}

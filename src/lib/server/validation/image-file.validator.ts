import { fileTypeFromBlob } from "file-type";
import { ImageFilenamePolicy, canonicalExt } from "./image-file.policy";

export type ImageValidationResult =
  | { ok: true; safeName: string; mime: string }
  | { ok: false; status: number; message: string };

export interface ImageFileValidatorOptions {
  allowedExtensions?: readonly string[];
}

export class ImageFileValidator {
  private readonly policy: ImageFilenamePolicy;

  constructor(options: ImageFileValidatorOptions = {}) {
    this.policy = new ImageFilenamePolicy(options.allowedExtensions);
  }

  async validate(file: File): Promise<ImageValidationResult> {
    if (file.size === 0)
      return { ok: false, status: 400, message: "Empty file" };

    const safeName = this.policy.sanitize(file.name);
    if (!safeName)
      return { ok: false, status: 400, message: "Invalid file name" };

    const detected = await fileTypeFromBlob(file);
    if (!detected || !detected.mime.startsWith("image/")) {
      return {
        ok: false,
        status: 406,
        message: "File content is not a recognized image format",
      };
    }

    const detectedExt = canonicalExt(detected.ext);
    if (!this.policy.isAllowedExtension(detectedExt)) {
      return { ok: false, status: 406, message: "Image format is not allowed" };
    }

    if (this.policy.extensionOf(safeName) !== detectedExt) {
      return {
        ok: false,
        status: 406,
        message: "File extension does not match its content",
      };
    }

    return { ok: true, safeName, mime: detected.mime };
  }
}

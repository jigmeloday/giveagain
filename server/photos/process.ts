import "server-only";
import sharp from "sharp";

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_WIDTH = 1440;
const MAX_INPUT_SIDE = 12_000;
const MIN_INPUT_SIDE = 300;

export class PhotoError extends Error {}

/** The real file type, from the first bytes. The browser's file name and type can say anything. */
function detectType(bytes: Buffer): "jpeg" | "png" | "webp" | null {
  if (bytes.length > 12 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length > 12 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (bytes.length > 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return null;
}

export type ProcessedPhoto = { body: Buffer; width: number; height: number };

/**
 * Checks the image and re-encodes it as WebP at most 1440px wide.
 * Re-encoding drops all metadata, including GPS location, and any hidden data in the original.
 */
export async function processPhoto(input: Buffer): Promise<ProcessedPhoto> {
  if (input.length === 0 || input.length > MAX_PHOTO_BYTES) throw new PhotoError("Each photo must be under 8 MB.");
  if (!detectType(input)) throw new PhotoError("Use a JPEG, PNG or WebP photo.");

  try {
    const meta = await sharp(input, { limitInputPixels: MAX_INPUT_SIDE * MAX_INPUT_SIDE, failOn: "error" }).metadata();
    const { width = 0, height = 0 } = meta;
    if (Math.min(width, height) < MIN_INPUT_SIDE) throw new PhotoError("That photo is too small. Use one at least 300 pixels wide.");
    if (Math.max(width, height) > MAX_INPUT_SIDE) throw new PhotoError("That photo is too large.");

    const { data, info } = await sharp(input, { limitInputPixels: MAX_INPUT_SIDE * MAX_INPUT_SIDE })
      .rotate() // apply the camera's orientation before the metadata is dropped
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    return { body: data, width: info.width, height: info.height };
  } catch (error) {
    if (error instanceof PhotoError) throw error;
    throw new PhotoError("We couldn't read that photo. Try another one.");
  }
}

import sharp from "sharp";
import { uploadListingPhoto } from "@/server/photos/upload";
import type { PhotoStorage } from "@/server/photos/storage";

/** A real JPEG of the given size, made on the spot. */
export const makeJpeg = (width = 600, height = 450) =>
  sharp({ create: { width, height, channels: 3, background: { r: 120, g: 90, b: 60 } } }).jpeg().toBuffer();

/** Uploads n photos for this user through the same code the website uses. */
export async function uploadSome(storage: PhotoStorage, userId: string, n = 3) {
  const jpeg = await makeJpeg();
  return Promise.all(Array.from({ length: n }, () => uploadListingPhoto(storage, userId, jpeg)));
}

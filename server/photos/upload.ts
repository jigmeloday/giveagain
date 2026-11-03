import "server-only";
import { randomUUID } from "node:crypto";
import { processPhoto } from "@/server/photos/process";
import type { PhotoStorage } from "@/server/photos/storage";

export type StoredPhoto = { key: string; width: number; height: number };

/** Every key starts with its owner's id, so ownership can be checked from the key alone. */
export const photoKeyPrefix = (userId: string) => `listings/${userId}/`;

export const isOwnPhotoKey = (key: string, userId: string) =>
  key.startsWith(photoKeyPrefix(userId)) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$/.test(key.slice(photoKeyPrefix(userId).length));

/** Checks, cleans and stores one uploaded photo under a random name. */
export async function uploadListingPhoto(storage: PhotoStorage, userId: string, file: Buffer): Promise<StoredPhoto> {
  const { body, width, height } = await processPhoto(file);
  const key = `${photoKeyPrefix(userId)}${randomUUID()}.webp`;
  await storage.put(key, body, "image/webp");
  return { key, width, height };
}

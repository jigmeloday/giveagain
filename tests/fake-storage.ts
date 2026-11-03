import type { PhotoStorage } from "@/server/photos/storage";

/** In-memory stand-in for Neon Object Storage, so tests never need the network. */
export function makeFakeStorage(): PhotoStorage & { files: Map<string, { body: Buffer; contentType: string }> } {
  const files = new Map<string, { body: Buffer; contentType: string }>();
  return {
    files,
    async put(key, body, contentType) {
      files.set(key, { body, contentType });
    },
    async exists(key) {
      return files.has(key);
    },
    async remove(key) {
      files.delete(key);
    },
    url: (key) => `https://storage.test/listing-photos/${key}`,
  };
}

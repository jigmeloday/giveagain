import "server-only";
import { DeleteObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/** The only way the app touches photo files. Tests swap in a fake; production uses Neon Object Storage (S3). */
export type PhotoStorage = {
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  remove(key: string): Promise<void>;
  /** Public address of a stored photo. Keys are random, so an address can't be guessed. */
  url(key: string): string;
};

const BUCKET = process.env.PHOTO_BUCKET ?? "photos";

/** Thrown when the storage settings are missing, so callers can say "not available" instead of "try again". */
export class StorageNotConfiguredError extends Error {}

/** Turns "the bucket or credentials are wrong" failures from S3 into a setup error with a plain explanation. */
export function asSetupError(error: unknown): unknown {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  if (e?.name === "NoSuchBucket" || (e?.name === "NotFound" && e.$metadata?.httpStatusCode === 404)) {
    return new StorageNotConfiguredError(`Photo storage bucket "${BUCKET}" doesn't exist on this storage endpoint. Create it in the Neon console (public read) or set PHOTO_BUCKET.`);
  }
  if (e?.$metadata?.httpStatusCode === 401 || e?.$metadata?.httpStatusCode === 403) {
    return new StorageNotConfiguredError("Photo storage rejected our credentials. Run `neon env pull` again.");
  }
  return error;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new StorageNotConfiguredError(`Photo storage is not set up: ${name} is missing. See the README.`);
  return value;
}

function createS3Storage(): PhotoStorage {
  const endpoint = required("AWS_ENDPOINT_URL_S3").replace(/\/$/, "");
  const s3 = new S3Client({
    endpoint,
    region: required("AWS_REGION"),
    credentials: { accessKeyId: required("AWS_ACCESS_KEY_ID"), secretAccessKey: required("AWS_SECRET_ACCESS_KEY") },
    forcePathStyle: true, // Neon uses path-style addressing
  });

  return {
    async put(key, body, contentType) {
      // Photos never change once stored, so they can be cached for a year.
      await s3
        .send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType, CacheControl: "public, max-age=31536000, immutable" }))
        .catch((e) => { throw asSetupError(e); });
    },
    async exists(key) {
      try {
        await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
        return true;
      } catch (error) {
        if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) return false;
        throw asSetupError(error);
      }
    },
    async remove(key) {
      await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
    },
    url: (key) => `${endpoint}/${BUCKET}/${key}`,
  };
}

let instance: PhotoStorage | undefined;
const real = () => (instance ??= createS3Storage());

/** Connects on first use, so pages that never touch photos work even without storage settings. */
export const storage: PhotoStorage = {
  put: async (...args) => real().put(...args),
  exists: async (key) => real().exists(key),
  remove: async (key) => real().remove(key),
  url: (key) => real().url(key),
};

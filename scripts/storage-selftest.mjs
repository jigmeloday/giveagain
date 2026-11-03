// Checks photo storage end to end with a throwaway file: upload, read back without credentials, delete.
// Usage: node --env-file=.env.local scripts/storage-selftest.mjs
import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, HeadBucketCommand, HeadObjectCommand, ListBucketsCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.AWS_ENDPOINT_URL_S3?.replace(/\/$/, "");
const bucket = process.env.PHOTO_BUCKET ?? "photos";
if (!endpoint || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) throw new Error("Storage settings are missing from .env.local.");

const s3 = new S3Client({ endpoint, region: process.env.AWS_REGION, forcePathStyle: true });
const key = `listings/_selftest/${randomUUID()}.webp`;
const body = Buffer.from("UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "base64"); // a 1x1 WebP

const existing = ((await s3.send(new ListBucketsCommand({}))).Buckets ?? []).map((b) => b.Name);
if (!existing.includes(bucket)) {
  console.error(`The settings work, but there is no bucket called "${bucket}" on ${new URL(endpoint).hostname.split(".")[0]}.`);
  console.error(`Buckets that exist there: ${existing.length ? existing.join(", ") : "(none)"}`);
  console.error(`Create it in the Neon console (Storage, public read) on this branch, or set PHOTO_BUCKET to an existing name.`);
  process.exit(1);
}

try {
  await s3.send(new HeadBucketCommand({ Bucket: bucket }));
  console.log(`bucket "${bucket}": found`);
  await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "image/webp", CacheControl: "public, max-age=31536000, immutable" }));
  console.log("upload: ok");
  const head = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  console.log("stored content-type:", head.ContentType, "| cache-control:", head.CacheControl);
  const anon = await fetch(`${endpoint}/${bucket}/${key}`);
  console.log("anonymous read:", anon.status, anon.headers.get("content-type"), anon.headers.get("x-content-type-options") ?? "(no nosniff header)");
} finally {
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key })).catch(() => {});
  console.log("after delete, anonymous read:", (await fetch(`${endpoint}/${bucket}/${key}`)).status);
}

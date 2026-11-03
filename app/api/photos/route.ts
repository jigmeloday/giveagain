import { getSessionUser } from "@/server/context";
import { isAllowedOrigin } from "@/server/origin";
import { MAX_PHOTO_BYTES, PhotoError } from "@/server/photos/process";
import { StorageNotConfiguredError, storage } from "@/server/photos/storage";
import { uploadListingPhoto } from "@/server/photos/upload";
import { createLimiter } from "@/server/rate-limit";

const allowUpload = createLimiter(60, 60 * 60 * 1000);
const fail = (error: string, status: number) => Response.json({ error }, { status });

/** Uploads one photo. Signed-in only. The file is checked, cleaned of metadata, re-encoded and stored under a random name. */
export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) return fail("Forbidden", 403);
  const user = await getSessionUser(request.headers);
  if (!user) return fail("Please sign in.", 401);
  if (user.banned) return fail("Your account is paused.", 403);
  if (!allowUpload(user.id)) return fail("You've added a lot of photos. Please wait a little and try again.", 429);

  // Cheap check before reading the body; the real size check happens again on the bytes.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_PHOTO_BYTES + 100_000) return fail("Each photo must be under 8 MB.", 413);

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return fail("Choose a photo to add.", 400);

  try {
    return Response.json(await uploadListingPhoto(storage, user.id, Buffer.from(await file.arrayBuffer())));
  } catch (error) {
    if (error instanceof PhotoError) return fail(error.message, 400);
    if (error instanceof StorageNotConfiguredError) {
      console.error(error.message);
      return fail("Photo uploads aren't available right now. Please try again later.", 503);
    }
    console.error("photo upload failed", error instanceof Error ? error.message : "unknown error");
    return fail("We couldn't save that photo. Please try again.", 500);
  }
}

// @vitest-environment node
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { MAX_PHOTO_BYTES, PhotoError, processPhoto } from "@/server/photos/process";
import { isOwnPhotoKey, uploadListingPhoto } from "@/server/photos/upload";
import { makeFakeStorage } from "../../tests/fake-storage";
import { makeJpeg } from "../../tests/photos";

describe("processPhoto", () => {
  it("turns a photo into a WebP and keeps its shape", async () => {
    const out = await processPhoto(await makeJpeg(800, 600));
    expect(await sharp(out.body).metadata()).toMatchObject({ format: "webp", width: 800, height: 600 });
    expect(out).toMatchObject({ width: 800, height: 600 });
  });

  it("shrinks big photos to 1440 wide and never enlarges small ones", async () => {
    expect((await processPhoto(await makeJpeg(3000, 2000))).width).toBe(1440);
    expect((await processPhoto(await makeJpeg(500, 400))).width).toBe(500);
  });

  it("removes GPS and other metadata", async () => {
    const withGps = await sharp(await makeJpeg()).withExif({ IFD3: { GPSLatitudeRef: "N", GPSLatitude: "27/1 28/1 0/1" } }).jpeg().toBuffer();
    expect((await sharp(withGps).metadata()).exif).toBeDefined();
    expect((await sharp((await processPhoto(withGps)).body).metadata()).exif).toBeUndefined();
  });

  it("applies the camera's rotation before dropping it", async () => {
    const rotated = await sharp(await makeJpeg(600, 400)).withMetadata({ orientation: 6 }).jpeg().toBuffer();
    expect(await processPhoto(rotated)).toMatchObject({ width: 400, height: 600 });
  });

  it("rejects things that are not photos, whatever they are called", async () => {
    const bad = [Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>"), Buffer.from("GIF89a....................."), Buffer.from("plain text pretending to be a photo"), Buffer.alloc(0), Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])];
    for (const file of bad) await expect(processPhoto(file)).rejects.toBeInstanceOf(PhotoError);
  });

  it("rejects files that are too big or too small", async () => {
    await expect(processPhoto(Buffer.concat([await makeJpeg(), Buffer.alloc(MAX_PHOTO_BYTES)]))).rejects.toThrow(/8 MB/);
    await expect(processPhoto(await makeJpeg(100, 100))).rejects.toThrow(/too small/);
  });
});

describe("uploadListingPhoto", () => {
  it("stores one WebP under the owner's folder with a random name", async () => {
    const storage = makeFakeStorage();
    const a = await uploadListingPhoto(storage, "user-1", await makeJpeg());
    const b = await uploadListingPhoto(storage, "user-1", await makeJpeg());
    expect(a.key).toMatch(/^listings\/user-1\/[0-9a-f-]{36}\.webp$/);
    expect(a.key).not.toBe(b.key);
    expect(storage.files.get(a.key)?.contentType).toBe("image/webp");
  });

  it("stores nothing when the file is bad", async () => {
    const storage = makeFakeStorage();
    await expect(uploadListingPhoto(storage, "user-1", Buffer.from("nope"))).rejects.toBeInstanceOf(PhotoError);
    expect(storage.files.size).toBe(0);
  });

  it("recognises only a person's own keys", () => {
    const key = `listings/u1/${crypto.randomUUID()}.webp`;
    expect(isOwnPhotoKey(key, "u1")).toBe(true);
    expect(isOwnPhotoKey(key, "u2")).toBe(false);
    expect(isOwnPhotoKey(`listings/u1/../u2/${crypto.randomUUID()}.webp`, "u1")).toBe(false);
  });
});

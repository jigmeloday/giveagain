// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { StorageNotConfiguredError, asSetupError, storage } from "@/server/photos/storage";

afterEach(() => vi.unstubAllEnvs());

describe("photo storage without settings", () => {
  it("says it is not set up instead of failing in some other way", async () => {
    vi.stubEnv("AWS_ENDPOINT_URL_S3", "");
    await expect(storage.put("listings/u/x.webp", Buffer.from("x"), "image/webp")).rejects.toBeInstanceOf(StorageNotConfiguredError);
    expect(() => storage.url("listings/u/x.webp")).toThrow(StorageNotConfiguredError);
  });
});

describe("asSetupError", () => {
  it("explains a missing bucket and rejected credentials", () => {
    expect(asSetupError({ name: "NoSuchBucket" })).toBeInstanceOf(StorageNotConfiguredError);
    expect((asSetupError({ name: "NotFound", $metadata: { httpStatusCode: 404 } }) as Error).message).toMatch(/doesn't exist/);
    expect((asSetupError({ $metadata: { httpStatusCode: 403 } }) as Error).message).toMatch(/credentials/);
  });

  it("leaves other errors alone", () => {
    const other = new Error("timeout");
    expect(asSetupError(other)).toBe(other);
  });
});

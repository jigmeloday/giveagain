// @vitest-environment node
import { describe, expect, it } from "vitest";
import { callerFor } from "../../tests/callers";
import { withCleanDb } from "../../tests/backend";
import { testDb } from "../../tests/db";
import { makeFakeStorage } from "../../tests/fake-storage";
import { makeUser } from "../../tests/factories";
import { uploadSome } from "../../tests/photos";
import type { SessionUser } from "@/server/trpc";

withCleanDb();

const base = {
  title: "Three-seat sofa", category: "Furniture", condition: "Good", description: "Grey sofa, a few marks on one arm.",
  size: "", dzongkhag: "Thimphu", area: "Motithang", collection: "", headsUp: "", phone: "17123456", agree: true,
} as const;

const create = (user: SessionUser, storage: ReturnType<typeof makeFakeStorage>, photos: object[]) =>
  callerFor(user, storage).listing.create({ ...base, photos } as never);

describe("photos on a new listing", () => {
  it("are stored in order and show up as public addresses once approved", async () => {
    const storage = makeFakeStorage();
    const owner = await makeUser();
    const photos = await uploadSome(storage, owner.id, 3);
    const { id } = await create(owner, storage, photos);

    const { rows } = await testDb.query(`SELECT key, position FROM listing_photo WHERE listing_id = $1 ORDER BY position`, [id]);
    expect(rows.map((r) => r.key)).toEqual(photos.map((p) => p.key));
    await testDb.query(`UPDATE listing SET status = 'available' WHERE id = $1`, [id]);
    const { listing } = await callerFor(null, storage).listing.byId({ id });
    expect(listing.photos).toEqual(photos.map((p) => `https://storage.test/listing-photos/${p.key}`));
  });

  it("need at least 3 and at most 6", async () => {
    const storage = makeFakeStorage();
    const owner = await makeUser();
    await expect(create(owner, storage, await uploadSome(storage, owner.id, 2))).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(create(owner, storage, await uploadSome(storage, owner.id, 7))).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(create(owner, storage, await uploadSome(storage, owner.id, 6))).resolves.toBeDefined();
  });

  it("cannot be someone else's uploads", async () => {
    const storage = makeFakeStorage();
    const [owner, other] = [await makeUser(), await makeUser()];
    const theirs = await uploadSome(storage, other.id, 3);
    await expect(create(owner, storage, theirs)).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("cannot point at files that were never uploaded, or at odd paths", async () => {
    const storage = makeFakeStorage();
    const owner = await makeUser();
    const real = await uploadSome(storage, owner.id, 3);
    const fake = { key: `listings/${owner.id}/${crypto.randomUUID()}.webp`, width: 600, height: 450 };
    await expect(create(owner, storage, [real[0], real[1], fake])).rejects.toMatchObject({ code: "BAD_REQUEST" });
    for (const key of ["../../etc/passwd", `listings/${owner.id}/../other/x.webp`, `listings/${owner.id}/x.png`, "http://evil.example/x.webp"]) {
      await expect(create(owner, storage, [real[0], real[1], { ...real[2], key }])).rejects.toMatchObject({ code: "BAD_REQUEST" });
    }
  });

  it("cannot be used twice in one listing, or in a second listing", async () => {
    const storage = makeFakeStorage();
    const owner = await makeUser();
    const photos = await uploadSome(storage, owner.id, 3);
    await expect(create(owner, storage, [photos[0], photos[0], photos[1]])).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await create(owner, storage, photos);
    await expect(create(owner, storage, photos)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect((await testDb.query(`SELECT count(*)::int n FROM listing`)).rows[0].n).toBe(1);
  });
});

// @vitest-environment node
import { describe, expect, it } from "vitest";
import { callerFor } from "../../tests/callers";
import { withCleanDb } from "../../tests/backend";
import { testDb } from "../../tests/db";
import { makeFakeStorage } from "../../tests/fake-storage";
import { makeListing, makeUser } from "../../tests/factories";
import { uploadSome } from "../../tests/photos";
import type { SessionUser } from "@/server/trpc";

withCleanDb();

const valid = {
  title: "Three-seat sofa", category: "Furniture", condition: "Good", description: "Grey sofa, a few marks on one arm.",
  size: "", dzongkhag: "Thimphu", area: "Motithang", collection: "", headsUp: "", phone: "17123456", agree: true,
} as const;

const storage = makeFakeStorage();
/** Posts a valid listing as this user, with three photos they really uploaded, plus any changes. */
async function post(user: SessionUser | null, patch: object = {}, photos?: object[]) {
  const mine = user ? await uploadSome(storage, user.id) : [];
  return callerFor(user, storage).listing.create({ ...valid, photos: photos ?? mine, ...patch } as never);
}

describe("creating a listing", () => {
  it("needs a signed-in, active user", async () => {
    await expect(post(null)).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(post(await makeUser({ banned: true }))).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("starts pending, owned by the caller, with the phone stored as E.164", async () => {
    const user = await makeUser();
    const { id } = await post(user);
    const { rows } = await testDb.query(`SELECT owner_id, status, contact_phone, size, collection FROM listing WHERE id = $1`, [id]);
    expect(rows[0]).toEqual({ owner_id: user.id, status: "pending", contact_phone: "+97517123456", size: null, collection: null });
  });

  it("will not take a status, owner or any other server-controlled field from the client", async () => {
    const user = await makeUser();
    await expect(post(user, { status: "available" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(post(user, { ownerId: "someone-else" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects bad input", async () => {
    const user = await makeUser();
    const bad = [
      { title: "ab" }, { title: "x".repeat(81) }, { description: "short" }, { description: "x".repeat(501) },
      { category: "Weapons" }, { condition: "Mint" }, { dzongkhag: "London" }, { area: "" }, { phone: "12" },
      { phone: "+14155550123" }, { phone: "letters" }, { agree: false },
    ];
    for (const patch of bad) await expect(post(user, patch)).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("keeps odd text as plain text", async () => {
    const user = await makeUser();
    const title = "<script>alert(1)</script> བཀྲ་ཤིས'; --";
    const { id } = await post(user, { title });
    expect((await testDb.query(`SELECT title FROM listing WHERE id = $1`, [id])).rows[0].title).toBe(title);
  });

  it("limits how many posts can wait for review", async () => {
    const user = await makeUser();
    for (let i = 0; i < 5; i++) await makeListing(user.id);
    await expect(post(user)).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("limits how many things one person can have online, and quick double posts can't slip past", async () => {
    const user = await makeUser();
    for (let i = 0; i < 4; i++) await makeListing(user.id);
    const results = await Promise.allSettled([post(user), post(user), post(user)]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  });
});

describe("marking given and taking down", () => {
  it("lets only the owner do it, and says not found to anyone else", async () => {
    const owner = await makeUser();
    const other = await makeUser();
    const id = await makeListing(owner.id, { status: "available" });
    await expect(callerFor(other).listing.markGiven({ id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(callerFor(other).listing.withdraw({ id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(callerFor(null).listing.markGiven({ id })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect((await testDb.query(`SELECT status FROM listing WHERE id = $1`, [id])).rows[0].status).toBe("available");
  });

  it("follows the rules for each state", async () => {
    const owner = await makeUser();
    const caller = callerFor(owner);
    const pending = await makeListing(owner.id);
    await expect(caller.listing.markGiven({ id: pending })).rejects.toMatchObject({ code: "CONFLICT" });
    await caller.listing.withdraw({ id: pending });
    await expect(caller.listing.withdraw({ id: pending })).rejects.toMatchObject({ code: "CONFLICT" });

    const live = await makeListing(owner.id, { status: "available" });
    await caller.listing.markGiven({ id: live });
    expect((await testDb.query(`SELECT status FROM listing WHERE id = $1`, [live])).rows[0].status).toBe("given");
  });
});

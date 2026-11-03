// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { pool } from "@/server/db";
import type { SessionUser } from "@/server/trpc";
import { callerFor } from "../../tests/callers";
import { resetDb, testDb } from "../../tests/db";
import { makeListing, makeUser } from "../../tests/factories";

let admin: SessionUser;
let owner: SessionUser;

beforeEach(async () => {
  await resetDb();
  admin = await makeUser({ role: "admin", name: "Admin" });
  owner = await makeUser({ name: "Pema Dorji", email: "pema@example.com" });
});
afterAll(async () => {
  await pool.end();
  await testDb.end();
});


describe("moderation queue", () => {
  it("lists only pending listings, oldest first", async () => {
    const newer = await makeListing(owner.id, { title: "Newer", createdAt: "2026-11-02T10:00:00Z" });
    const older = await makeListing(owner.id, { title: "Older", createdAt: "2026-11-01T10:00:00Z" });
    await makeListing(owner.id, { status: "available" });
    await makeListing(owner.id, { status: "rejected", rejectionReason: "other" });
    await makeListing(owner.id, { deletedAt: "2026-11-02T00:00:00Z" });

    const { items } = await callerFor(admin).admin.moderation.queue({});
    expect(items.map((i) => i.id)).toEqual([older, newer]);
  });

  it("shows the owner's history but never their email or phone", async () => {
    await makeListing(owner.id, { status: "available" });
    await makeListing(owner.id, { status: "rejected", rejectionReason: "other" });
    await makeListing(owner.id, { photos: ["a.webp", "b.webp"] });

    const { items } = await callerFor(admin).admin.moderation.queue({});
    expect(items[0].owner).toMatchObject({ name: "Pema Dorji", rejectedCount: 1, openReports: 0 });
    expect(items[0].photoUrls).toEqual(["https://storage.test/listing-photos/a.webp", "https://storage.test/listing-photos/b.webp"]);
    expect(JSON.stringify(items)).not.toContain("pema@example.com");
    expect(Object.keys(items[0].owner).sort()).toEqual(["approvedCount", "id", "joinedAt", "name", "openReports", "rejectedCount"]);
  });

  it("pages with a cursor without repeating or skipping", async () => {
    const ids = [];
    for (let i = 1; i <= 5; i++) ids.push(await makeListing(owner.id, { title: `Item ${i}`, createdAt: `2026-11-0${i}T10:00:00Z` }));

    const first = await callerFor(admin).admin.moderation.queue({ limit: 2 });
    const second = await callerFor(admin).admin.moderation.queue({ limit: 2, cursor: first.nextCursor! });
    const third = await callerFor(admin).admin.moderation.queue({ limit: 2, cursor: second.nextCursor! });
    expect([...first.items, ...second.items, ...third.items].map((i) => i.id)).toEqual(ids);
    expect(third.nextCursor).toBeNull();
  });

  it("refuses oversized pages and unknown input", async () => {
    await expect(callerFor(admin).admin.moderation.queue({ limit: 51 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(callerFor(admin).admin.moderation.queue({ limit: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    // @ts-expect-error extra keys are rejected
    await expect(callerFor(admin).admin.moderation.queue({ status: "available" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

describe("dashboard numbers", () => {
  it("counts what is waiting, live and given, and the oldest waiting time", async () => {
    await makeListing(owner.id, { createdAt: "2026-11-01T10:00:00Z" });
    await makeListing(owner.id, { createdAt: "2026-11-02T10:00:00Z" });
    await makeListing(owner.id, { status: "available" });
    await makeListing(owner.id, { status: "reserved" });
    await makeListing(owner.id, { status: "given" });
    await makeListing(owner.id, { deletedAt: "2026-11-02T00:00:00Z" });
    await makeUser({ banned: true });

    const stats = await callerFor(admin).admin.dashboard();
    expect(stats).toMatchObject({ pendingListings: 2, liveListings: 2, givenListings: 1, openReports: 0, users: 3, suspendedUsers: 1 });
    expect(stats.oldestPendingAt).toBe("2026-11-01T10:00:00.000Z");
  });

  it("shows no oldest time when nothing is waiting", async () => {
    expect((await callerFor(admin).admin.dashboard()).oldestPendingAt).toBeNull();
  });
});

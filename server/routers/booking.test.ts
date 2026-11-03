// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { callerFor } from "../../tests/callers";
import { withCleanDb } from "../../tests/backend";
import { testDb } from "../../tests/db";
import { makeBooking, makeListing, makeUser } from "../../tests/factories";
import type { SessionUser } from "@/server/trpc";

withCleanDb();
let owner: SessionUser;
let seeker: SessionUser;
let listing: string;
const ask = (user: SessionUser | null, listingId = listing, extra: object = {}) =>
  callerFor(user).booking.request({ listingId, phone: "17998877", note: "I can collect on Saturday.", ...extra });
const statusOf = async (table: "listing" | "booking", id: string) => (await testDb.query(`SELECT status FROM ${table} WHERE id = $1`, [id])).rows[0].status;

beforeEach(async () => {
  owner = await makeUser();
  seeker = await makeUser();
  listing = await makeListing(owner.id, { status: "available" });
});

describe("asking for an item", () => {
  it("needs a signed-in, active user", async () => {
    await expect(ask(null)).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(ask(await makeUser({ banned: true }))).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("stores the request with the phone as E.164", async () => {
    const { id } = await ask(seeker);
    const { rows } = await testDb.query(`SELECT requester_id, phone, status, note FROM booking WHERE id = $1`, [id]);
    expect(rows[0]).toEqual({ requester_id: seeker.id, phone: "+97517998877", status: "requested", note: "I can collect on Saturday." });
  });

  it("cannot ask for your own item", async () => {
    await expect(ask(owner)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("cannot ask for something that is not online, and does not reveal that it exists", async () => {
    for (const status of ["pending", "rejected", "withdrawn"]) {
      const id = await makeListing(owner.id, { status, rejectionReason: status === "rejected" ? "other" : undefined });
      await expect(ask(seeker, id)).rejects.toMatchObject({ code: "NOT_FOUND" });
    }
    await expect(ask(seeker, crypto.randomUUID())).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(ask(seeker, await makeListing(owner.id, { status: "given" }))).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("allows one active request each, and allows asking again after cancelling", async () => {
    const { id } = await ask(seeker);
    await expect(ask(seeker)).rejects.toMatchObject({ code: "CONFLICT" });
    await callerFor(seeker).booking.cancel({ id });
    await expect(ask(seeker)).resolves.toBeDefined();
  });

  it("holds the line when two quick requests arrive together", async () => {
    const results = await Promise.allSettled([ask(seeker), ask(seeker), ask(seeker)]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
  });

  it("validates the phone and note, and caps open requests", async () => {
    await expect(ask(seeker, listing, { phone: "12" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(ask(seeker, listing, { note: "x".repeat(301) })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(ask(seeker, listing, { extra: 1 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    for (let i = 0; i < 10; i++) await makeBooking(await makeListing(owner.id, { status: "available" }), seeker.id);
    await expect(ask(seeker)).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });
});

describe("the giver answering", () => {
  it("accepting reserves the item and declines everyone else", async () => {
    const other = await makeUser();
    const first = await makeBooking(listing, seeker.id);
    const second = await makeBooking(listing, other.id);
    await callerFor(owner).booking.answer({ id: first, answer: "accepted" });
    expect(await statusOf("booking", first)).toBe("accepted");
    expect(await statusOf("booking", second)).toBe("declined");
    expect(await statusOf("listing", listing)).toBe("reserved");
  });

  it("declining leaves the item available", async () => {
    const id = await makeBooking(listing, seeker.id);
    await callerFor(owner).booking.answer({ id, answer: "declined" });
    expect(await statusOf("listing", listing)).toBe("available");
  });

  it("only the giver can answer, and everyone else gets not found", async () => {
    const id = await makeBooking(listing, seeker.id);
    await expect(callerFor(seeker).booking.answer({ id, answer: "accepted" })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(callerFor(await makeUser()).booking.answer({ id, answer: "accepted" })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(callerFor(null).booking.answer({ id, answer: "accepted" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(await statusOf("booking", id)).toBe("requested");
  });

  it("answers once, and chooses only one person even when two answers race", async () => {
    const a = await makeBooking(listing, seeker.id);
    const b = await makeBooking(listing, (await makeUser()).id);
    const results = await Promise.allSettled([callerFor(owner).booking.answer({ id: a, answer: "accepted" }), callerFor(owner).booking.answer({ id: b, answer: "accepted" })]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect((await testDb.query(`SELECT count(*)::int n FROM booking WHERE listing_id = $1 AND status = 'accepted'`, [listing])).rows[0].n).toBe(1);
    await expect(callerFor(owner).booking.answer({ id: a, answer: "declined" })).rejects.toMatchObject({ code: "CONFLICT" });
  });
});

describe("cancelling", () => {
  it("only the seeker can cancel, and cancelling an accepted request puts the item back online", async () => {
    const id = await makeBooking(listing, seeker.id);
    await callerFor(owner).booking.answer({ id, answer: "accepted" });
    await expect(callerFor(owner).booking.cancel({ id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await callerFor(seeker).booking.cancel({ id });
    expect(await statusOf("booking", id)).toBe("cancelled");
    expect(await statusOf("listing", listing)).toBe("available");
    await expect(callerFor(seeker).booking.cancel({ id })).rejects.toMatchObject({ code: "CONFLICT" });
  });
});

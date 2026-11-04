// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { callerFor } from "../../tests/callers";
import { withCleanDb } from "../../tests/backend";
import { makeBooking, makeListing, makeUser } from "../../tests/factories";
import type { SessionUser } from "@/server/trpc";

withCleanDb();
let owner: SessionUser;
let seeker: SessionUser;
let listing: string;

beforeEach(async () => {
  owner = await makeUser({ name: "Pema Dorji" });
  seeker = await makeUser({ name: "Karma Wangmo", email: "karma@example.com" });
  listing = await makeListing(owner.id, { status: "available", contactPhone: "+97517123456", addressPrivate: "Blue gate, behind the school" });
});

describe("my listings", () => {
  it("needs sign-in and shows only the caller's own", async () => {
    await expect(callerFor(null).account.myListings()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await makeListing(seeker.id);
    expect((await callerFor(owner).account.myListings()).map((l) => l.id)).toEqual([listing]);
  });

  it("shows the giver who asked, with their phone, but never an email or full name", async () => {
    await makeBooking(listing, seeker.id, { phone: "+97517998877", note: "Saturday works." });
    const [mine] = await callerFor(owner).account.myListings();
    expect(mine.requests).toMatchObject([{ name: "Karma W.", phone: "+97517998877", note: "Saturday works.", status: "requested" }]);
    expect(JSON.stringify(mine)).not.toMatch(/karma@example\.com|Wangmo/);
  });

  it("another user gets not found for a listing id that isn't theirs", async () => {
    await expect(callerFor(seeker).account.myListing({ id: listing })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(callerFor(owner).account.myListing({ id: listing })).resolves.toMatchObject({ id: listing });
  });

  it("gives a rejected listing's reason in kind words", async () => {
    const id = await makeListing(owner.id, { status: "rejected", rejectionReason: "unclear_photos" });
    expect((await callerFor(owner).account.myListing({ id })).rejectionReason).toMatch(/clearer photos/);
  });
});

describe("my requests", () => {
  it("holds back the giver's phone and address until the request is accepted", async () => {
    const id = await makeBooking(listing, seeker.id);
    expect(JSON.stringify(await callerFor(seeker).account.myBooking({ id }))).not.toMatch(/\+97517123456|Blue gate/);

    await callerFor(owner).booking.answer({ id, answer: "accepted" });
    expect(await callerFor(seeker).account.myBooking({ id })).toMatchObject({ status: "accepted", giverPhone: "+97517123456", pickupNote: "Blue gate, behind the school" });
  });

  it("a seeker who was declined never gets the contact details", async () => {
    const other = await makeUser();
    const mine = await makeBooking(listing, seeker.id);
    const theirs = await makeBooking(listing, other.id);
    await callerFor(owner).booking.answer({ id: theirs, answer: "accepted" });
    expect(JSON.stringify(await callerFor(seeker).account.myBooking({ id: mine }))).not.toMatch(/\+97517123456|Blue gate/);
  });

  it("shows only the caller's own requests", async () => {
    const id = await makeBooking(listing, seeker.id);
    expect(await callerFor(owner).account.myBookings()).toEqual([]);
    await expect(callerFor(owner).account.myBooking({ id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(await callerFor(seeker).account.myBookings()).toHaveLength(1);
  });
});

describe("the waiting-requests badge", () => {
  it("counts only this giver's requests that are still waiting", async () => {
    const other = await makeUser();
    const theirs = await makeListing(other.id, { status: "available" });
    await makeBooking(theirs, seeker.id);
    await makeBooking(listing, seeker.id);
    await makeBooking(listing, other.id, { status: "declined" });
    expect(await callerFor(owner).account.openRequestCount()).toBe(1);
    expect(await callerFor(other).account.openRequestCount()).toBe(1);
    expect(await callerFor(seeker).account.openRequestCount()).toBe(0);
  });

  it("needs sign-in", async () => {
    await expect(callerFor(null).account.openRequestCount()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

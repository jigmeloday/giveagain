// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import { callerFor } from "../../tests/callers";
import { withCleanDb } from "../../tests/backend";
import { makeBooking, makeListing, makeUser } from "../../tests/factories";
import type { SessionUser } from "@/server/trpc";

withCleanDb();
const anon = callerFor(null);
let owner: SessionUser;
beforeEach(async () => {
  owner = await makeUser({ name: "Pema Dorji", email: "pema@example.com" });
});

describe("public listings", () => {
  it("shows only approved, undeleted listings", async () => {
    const live = await makeListing(owner.id, { status: "available" });
    const reserved = await makeListing(owner.id, { status: "reserved" });
    for (const status of ["pending", "rejected", "withdrawn", "given"]) await makeListing(owner.id, { status, rejectionReason: status === "rejected" ? "other" : undefined });
    await makeListing(owner.id, { status: "available", deletedAt: "2026-11-01T00:00:00Z" });

    const { items } = await anon.listing.list({});
    expect(items.map((i) => i.id).sort()).toEqual([live, reserved].sort());
  });

  it("never exposes private fields", async () => {
    await makeListing(owner.id, { status: "available", contactPhone: "+97517555555", addressPrivate: "Blue gate, behind the school" });
    const { items } = await anon.listing.list({});
    const text = JSON.stringify(items);
    for (const secret of ["+97517555555", "Blue gate", "pema@example.com", owner.id, "Dorji"]) expect(text).not.toContain(secret);
    expect(items[0].giver.name).toBe("Pema D.");
  });

  it("filters by category, Dzongkhag and condition, and searches name and description", async () => {
    const sofa = await makeListing(owner.id, { status: "available", title: "Grey sofa", category: "Furniture", dzongkhag: "Thimphu", condition: "Good" });
    await makeListing(owner.id, { status: "available", title: "Kids books", category: "Books", dzongkhag: "Paro", condition: "Fair", description: "Picture books for small children." });
    const ids = async (f: object) => (await anon.listing.list(f)).items.map((i) => i.id);

    expect(await ids({ category: "Furniture" })).toEqual([sofa]);
    expect(await ids({ dzongkhag: "Thimphu", condition: "Good" })).toEqual([sofa]);
    expect(await ids({ q: "SOFA" })).toEqual([sofa]);
    expect(await ids({ q: "picture" })).toHaveLength(1);
    expect(await ids({ q: "nothing like this" })).toEqual([]);
  });

  it("treats % and _ in a search as plain characters", async () => {
    await makeListing(owner.id, { status: "available", title: "Grey sofa" });
    expect((await anon.listing.list({ q: "%" })).items).toHaveLength(0);
    expect((await anon.listing.list({ q: "s_fa" })).items).toHaveLength(0);
    expect((await anon.listing.list({ q: "'; DROP TABLE listing; --" })).items).toHaveLength(0);
  });

  it("rejects unknown filter values and oversized pages", async () => {
    // @ts-expect-error not a category
    await expect(anon.listing.list({ category: "Weapons" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(anon.listing.list({ limit: 51 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(anon.listing.list({ q: "x".repeat(101) })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("pages newest first without repeats", async () => {
    const ids = [];
    for (let i = 1; i <= 5; i++) ids.push(await makeListing(owner.id, { status: "available", createdAt: `2026-11-0${i}T10:00:00Z` }));
    const first = await anon.listing.list({ limit: 2 });
    const second = await anon.listing.list({ limit: 2, cursor: first.nextCursor! });
    const third = await anon.listing.list({ limit: 2, cursor: second.nextCursor! });
    expect([...first.items, ...second.items, ...third.items].map((i) => i.id)).toEqual(ids.reverse());
    expect(third.nextCursor).toBeNull();
  });

  it("counts requests that are still waiting", async () => {
    const id = await makeListing(owner.id, { status: "available" });
    await makeBooking(id, (await makeUser()).id);
    await makeBooking(id, (await makeUser()).id, { status: "declined" });
    expect((await anon.listing.byId({ id })).listing.askingCount).toBe(1);
  });
});

describe("one item", () => {
  it("is not found unless it is public", async () => {
    for (const status of ["pending", "rejected", "withdrawn", "given"]) {
      const id = await makeListing(owner.id, { status, rejectionReason: status === "rejected" ? "other" : undefined });
      await expect(anon.listing.byId({ id })).rejects.toMatchObject({ code: "NOT_FOUND" });
    }
    await expect(anon.listing.byId({ id: crypto.randomUUID() })).rejects.toMatchObject({ code: "NOT_FOUND" });
    // not even the owner sees a pending listing through the public route
    const pending = await makeListing(owner.id);
    await expect(callerFor(owner).listing.byId({ id: pending })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("tells the visitor whether they own it or already asked", async () => {
    const id = await makeListing(owner.id, { status: "available" });
    const seeker = await makeUser();
    await makeBooking(id, seeker.id);
    expect((await anon.listing.byId({ id })).viewer).toEqual({ signedIn: false, isOwner: false, requested: false });
    expect((await callerFor(owner).listing.byId({ id })).viewer).toMatchObject({ isOwner: true, requested: false });
    expect((await callerFor(seeker).listing.byId({ id })).viewer).toMatchObject({ isOwner: false, requested: true });
  });

  it("counts categories under the other filters", async () => {
    await makeListing(owner.id, { status: "available", category: "Furniture", dzongkhag: "Thimphu" });
    await makeListing(owner.id, { status: "available", category: "Books", dzongkhag: "Paro" });
    await makeListing(owner.id, { status: "pending", category: "Books" });
    const counts = await anon.listing.categoryCounts({ category: "Books" });
    expect(counts.all).toBe(2);
    expect(counts.byCategory.find((c) => c.category === "Furniture")?.count).toBe(1);
  });
});

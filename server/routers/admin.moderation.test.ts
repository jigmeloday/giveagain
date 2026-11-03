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

const statusOf = async (id: string) => (await testDb.query(`SELECT status FROM listing WHERE id = $1`, [id])).rows[0].status;
const auditRows = async () => (await testDb.query(`SELECT * FROM audit_log ORDER BY id`)).rows;

describe("approving a listing", () => {
  it("makes it available and records who did it", async () => {
    const id = await makeListing(owner.id);
    await callerFor(admin).admin.moderation.approve({ id });

    expect(await statusOf(id)).toBe("available");
    const { rows } = await testDb.query(`SELECT moderated_by, moderated_at FROM listing WHERE id = $1`, [id]);
    expect(rows[0].moderated_by).toBe(admin.id);
    expect(rows[0].moderated_at).not.toBeNull();
  });

  it("writes an audit entry", async () => {
    const id = await makeListing(owner.id);
    await callerFor(admin).admin.moderation.approve({ id });
    expect(await auditRows()).toMatchObject([{ actor_id: admin.id, action: "listing.approve", target_type: "listing", target_id: id }]);
  });

  it("only works on pending listings", async () => {
    for (const status of ["available", "reserved", "given", "withdrawn"]) {
      const id = await makeListing(owner.id, { status });
      await expect(callerFor(admin).admin.moderation.approve({ id })).rejects.toMatchObject({ code: "CONFLICT" });
      expect(await statusOf(id)).toBe(status);
    }
    expect(await auditRows()).toHaveLength(0);
  });

  it("says not found for missing or deleted listings and rejects bad ids", async () => {
    const deleted = await makeListing(owner.id, { deletedAt: "2026-11-02T00:00:00Z" });
    await expect(callerFor(admin).admin.moderation.approve({ id: crypto.randomUUID() })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(callerFor(admin).admin.moderation.approve({ id: deleted })).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(callerFor(admin).admin.moderation.approve({ id: "1; DROP TABLE listing" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("lets only one of two admins who approve at the same moment succeed", async () => {
    const other = await makeUser({ role: "admin" });
    const id = await makeListing(owner.id);
    const results = await Promise.allSettled([
      callerFor(admin).admin.moderation.approve({ id }),
      callerFor(other).admin.moderation.approve({ id }),
    ]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(await auditRows()).toHaveLength(1);
  });
});

describe("rejecting a listing", () => {
  it("stores the reason and note and records the action", async () => {
    const id = await makeListing(owner.id);
    await callerFor(admin).admin.moderation.reject({ id, reason: "unclear_photos", note: "Please retake in daylight." });

    const { rows } = await testDb.query(`SELECT status, rejection_reason, rejection_note, moderated_by FROM listing WHERE id = $1`, [id]);
    expect(rows[0]).toEqual({ status: "rejected", rejection_reason: "unclear_photos", rejection_note: "Please retake in daylight.", moderated_by: admin.id });
    expect(await auditRows()).toMatchObject([{ action: "listing.reject", reason: "unclear_photos", target_id: id }]);
  });

  it("needs a reason from the fixed list", async () => {
    const id = await makeListing(owner.id);
    // @ts-expect-error reason is required
    await expect(callerFor(admin).admin.moderation.reject({ id })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    // @ts-expect-error reason must be on the list
    await expect(callerFor(admin).admin.moderation.reject({ id, reason: "because" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(await statusOf(id)).toBe("pending");
  });

  it("limits the note and stores odd text literally", async () => {
    const id = await makeListing(owner.id);
    await expect(callerFor(admin).admin.moderation.reject({ id, reason: "other", note: "x".repeat(301) })).rejects.toMatchObject({ code: "BAD_REQUEST" });

    const tricky = "'); DROP TABLE listing; -- བཀྲ་ཤིས་བདེ་ལེགས <script>";
    await callerFor(admin).admin.moderation.reject({ id, reason: "other", note: tricky });
    const { rows } = await testDb.query(`SELECT rejection_note FROM listing WHERE id = $1`, [id]);
    expect(rows[0].rejection_note).toBe(tricky);
  });

  it("cannot reject something already reviewed", async () => {
    const id = await makeListing(owner.id, { status: "available" });
    await expect(callerFor(admin).admin.moderation.reject({ id, reason: "other" })).rejects.toMatchObject({ code: "CONFLICT" });
    expect(await statusOf(id)).toBe("available");
  });
});

describe("the audit log", () => {
  it("cannot be edited or deleted, even directly in the database", async () => {
    await callerFor(admin).admin.moderation.approve({ id: await makeListing(owner.id) });
    await expect(testDb.query(`UPDATE audit_log SET reason = 'changed'`)).rejects.toThrow(/append-only/);
    await expect(testDb.query(`DELETE FROM audit_log`)).rejects.toThrow(/append-only/);
  });
});

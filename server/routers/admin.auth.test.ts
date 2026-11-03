// @vitest-environment node
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { pool } from "@/server/db";
import { callerFor } from "../../tests/callers";
import { resetDb, testDb } from "../../tests/db";
import { makeListing, makeUser } from "../../tests/factories";

beforeEach(resetDb);
afterAll(async () => {
  await pool.end();
  await testDb.end();
});

const CALLS = {
  dashboard: (c: ReturnType<typeof callerFor>) => c.admin.dashboard(),
  queue: (c: ReturnType<typeof callerFor>) => c.admin.moderation.queue({}),
  approve: (c: ReturnType<typeof callerFor>) => c.admin.moderation.approve({ id: crypto.randomUUID() }),
  reject: (c: ReturnType<typeof callerFor>) => c.admin.moderation.reject({ id: crypto.randomUUID(), reason: "other" }),
};

describe.each(Object.entries(CALLS))("admin.%s access", (_name, call) => {
  it("turns away signed-out visitors", async () => {
    await expect(call(callerFor(null))).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("turns away normal users", async () => {
    const user = await makeUser();
    await expect(call(callerFor(user))).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("turns away suspended admins on every request", async () => {
    const admin = await makeUser({ role: "admin", banned: true });
    await expect(call(callerFor(admin))).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("a normal user cannot change someone's listing status", () => {
  it("leaves a pending listing untouched", async () => {
    const owner = await makeUser();
    const id = await makeListing(owner.id);
    await expect(callerFor(owner).admin.moderation.approve({ id })).rejects.toMatchObject({ code: "FORBIDDEN" });
    const { rows } = await testDb.query(`SELECT status FROM listing WHERE id = $1`, [id]);
    expect(rows[0].status).toBe("pending");
  });
});

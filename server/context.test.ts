// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toSessionUser } from "@/server/context";

const session = (user: object) => ({ user: { id: "u1", name: "Pema", ...user } }) as never;

describe("toSessionUser", () => {
  it("is null when signed out", () => {
    expect(toSessionUser(null)).toBeNull();
  });

  it("only ever treats the exact role 'admin' as admin", () => {
    expect(toSessionUser(session({ role: "admin" }))?.role).toBe("admin");
    for (const role of [undefined, null, "user", "Admin", "admin,user", "superadmin"]) expect(toSessionUser(session({ role }))?.role).toBe("user");
  });

  it("carries the suspended flag", () => {
    expect(toSessionUser(session({ role: "user", banned: true }))?.banned).toBe(true);
    expect(toSessionUser(session({ role: "user" }))?.banned).toBe(false);
  });
});

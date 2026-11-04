// @vitest-environment node
import { describe, expect, it } from "vitest";
import { hasSessionCookieIn } from "@/server/session-hint";

const store = (...names: string[]) => ({ has: (name: string) => names.includes(name) });

describe("hasSessionCookieIn", () => {
  it("sees the sign-in cookie, with or without the secure prefix", () => {
    expect(hasSessionCookieIn(store("better-auth.session_token"))).toBe(true);
    expect(hasSessionCookieIn(store("__Secure-better-auth.session_token"))).toBe(true);
  });

  it("does not take the cached copy or other cookies as signed in", () => {
    expect(hasSessionCookieIn(store())).toBe(false);
    expect(hasSessionCookieIn(store("better-auth.session_data", "theme"))).toBe(false);
  });
});

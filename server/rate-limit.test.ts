// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createLimiter } from "@/server/rate-limit";

describe("createLimiter", () => {
  it("allows up to the limit, then says no, per key", () => {
    const allow = createLimiter(2, 1000);
    expect([allow("a", 0), allow("a", 1), allow("a", 2)]).toEqual([true, true, false]);
    expect(allow("b", 2)).toBe(true);
  });

  it("starts again after the window", () => {
    const allow = createLimiter(1, 1000);
    expect(allow("a", 0)).toBe(true);
    expect(allow("a", 500)).toBe(false);
    expect(allow("a", 1001)).toBe(true);
  });
});

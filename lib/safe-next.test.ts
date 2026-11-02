import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/safe-next";

describe("safeNext", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/items/1")).toBe("/items/1");
  });

  it("falls back to home for anything else", () => {
    for (const bad of [undefined, "", "items/1", "//evil.com", "https://evil.com", "/\\evil.com"]) {
      expect(safeNext(bad)).toBe("/");
    }
  });
});

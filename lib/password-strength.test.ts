import { describe, expect, it } from "vitest";
import { passwordStrength } from "@/lib/password-strength";

describe("passwordStrength", () => {
  it("is empty for no input", () => {
    expect(passwordStrength("")).toEqual({ score: 0, label: "" });
  });

  it("asks for 8 characters when short", () => {
    expect(passwordStrength("abc1").score).toBe(1);
  });

  it("grows with length and a mix of letters and numbers", () => {
    expect(passwordStrength("abcdefgh").score).toBe(2);
    expect(passwordStrength("abcdefg1").score).toBe(3);
    expect(passwordStrength("abcdefghijk1").score).toBe(4);
  });
});

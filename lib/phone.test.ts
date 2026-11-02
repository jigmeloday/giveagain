import { describe, expect, it } from "vitest";
import { phoneSchema, toE164 } from "./phone";

describe("toE164", () => {
  it.each([
    ["17123456", "+97517123456"],
    ["+97517123456", "+97517123456"],
    ["17 12 34 56", "+97517123456"],
    ["17-12-34-56", "+97517123456"],
    ["+975 17 12 34 56", "+97517123456"],
    ["77123456", "+97577123456"],
  ])("accepts the Bhutan mobile number %s", (input, expected) => {
    expect(toE164(input)).toBe(expected);
  });

  it.each(["", "123", "1712345678901", "abc", "17 12 34 5x", "+14155552671", "+919876543210"])("rejects %s", (input) => {
    expect(toE164(input)).toBeNull();
  });
});

describe("phoneSchema", () => {
  it("stores only the E.164 form", () => {
    expect(phoneSchema.parse(" 17 12 34 56 ")).toBe("+97517123456");
  });

  it("explains an empty value in plain words", () => {
    expect(phoneSchema.safeParse("").error?.issues[0].message).toBe("Enter your phone number.");
  });

  it("explains an invalid value in plain words", () => {
    expect(phoneSchema.safeParse("12").error?.issues[0].message).toMatch(/valid phone number/);
  });
});

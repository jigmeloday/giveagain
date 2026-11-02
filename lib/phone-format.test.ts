import { describe, expect, it } from "vitest";
import { formatPhone, groupDigits, nationalDigits, withDialCode } from "./phone-format";

describe("phone formatting", () => {
  it("adds the country code to typed digits", () => {
    expect(withDialCode("17 12-34")).toBe("+9751712" + "34");
  });

  it("gives an empty value when nothing is typed", () => {
    expect(withDialCode("")).toBe("");
    expect(withDialCode("abc")).toBe("");
  });

  it("strips the country code when showing a stored value", () => {
    expect(nationalDigits("+97517123456")).toBe("17123456");
    expect(nationalDigits("17123456")).toBe("17123456");
  });

  it("groups digits in pairs", () => {
    expect(groupDigits("17123456")).toBe("17 12 34 56");
    expect(groupDigits("171")).toBe("17 1");
  });
});

describe("formatPhone", () => {
  it("formats Bhutan numbers and leaves others alone", () => {
    expect(formatPhone("+97517123456")).toBe("+975 17 12 34 56");
    expect(formatPhone("+14155550123")).toBe("+14155550123");
  });
});

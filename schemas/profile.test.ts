import { describe, expect, it } from "vitest";
import { profileSchema } from "@/schemas/profile";

const valid = {
  photo: null,
  firstName: "Pema",
  lastInitial: "D",
  about: "",
  dzongkhag: "Thimphu",
  phone: "",
  notify: { requests: true, answers: true, nearby: true, weekly: false },
  privacy: { firstNameOnly: true, showGiven: true },
};

describe("profileSchema", () => {
  it("accepts a valid profile with no phone", () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it("needs exactly one letter for the last initial", () => {
    expect(profileSchema.safeParse({ ...valid, lastInitial: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...valid, lastInitial: "DO" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...valid, lastInitial: "1" }).success).toBe(false);
  });

  it("keeps the about text short", () => {
    expect(profileSchema.safeParse({ ...valid, about: "x".repeat(161) }).success).toBe(false);
  });
});

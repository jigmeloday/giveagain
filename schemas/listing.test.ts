import { describe, expect, it } from "vitest";
import { giveListingSchema } from "@/schemas/listing";

const photo = () => new File(["x"], "item.jpg", { type: "image/jpeg" });
const valid = {
  title: "Study desk",
  category: "Furniture",
  dzongkhag: "Thimphu",
  condition: "Good",
  description: "Solid wooden desk with one drawer.",
  phone: "+97517123456",
  agree: true,
};

describe("giveListingSchema photos", () => {
  it("needs at least 3 photos", () => {
    const result = giveListingSchema.safeParse({ ...valid, photos: [photo(), photo()] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Add at least 3 photos.");
  });

  it("accepts 3 to 6 photos and rejects 7", () => {
    expect(giveListingSchema.safeParse({ ...valid, photos: [photo(), photo(), photo()] }).success).toBe(true);
    expect(giveListingSchema.safeParse({ ...valid, photos: Array.from({ length: 7 }, photo) }).success).toBe(false);
  });
});

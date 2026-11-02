import { describe, expect, it } from "vitest";
import { itemPhotos } from "@/lib/item-photos";

describe("itemPhotos", () => {
  it("gives three placeholders when there are no photos", () => {
    const result = itemPhotos({ name: "Sofa" });
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.src === undefined)).toBe(true);
    expect(result[0].alt).toBe("Sofa, the whole item");
  });

  it("keeps real photos first and pads to three", () => {
    expect(itemPhotos({ name: "Sofa", photos: ["/a.webp"] }).map((p) => p.src)).toEqual(["/a.webp", undefined, undefined]);
  });

  it("shows up to six photos", () => {
    const urls = Array.from({ length: 8 }, (_, i) => `/${i}.webp`);
    expect(itemPhotos({ name: "Sofa", photos: urls })).toHaveLength(6);
  });
});

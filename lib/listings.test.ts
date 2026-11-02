import { describe, expect, it } from "vitest";
import { SAMPLE_LISTINGS } from "@/constants/sample-listings";
import { filterListings } from "@/lib/listings";

describe("filterListings", () => {
  it("returns everything without filters", () => {
    expect(filterListings(SAMPLE_LISTINGS, {})).toHaveLength(SAMPLE_LISTINGS.length);
  });

  it("combines filters", () => {
    const result = filterListings(SAMPLE_LISTINGS, { category: "Furniture", dzongkhag: "Thimphu" });
    expect(result.map((i) => i.id)).toEqual(["1"]);
  });

  it("searches name and description, ignoring case", () => {
    expect(filterListings(SAMPLE_LISTINGS, { q: "STROLLER" }).map((i) => i.id)).toEqual(["6"]);
    expect(filterListings(SAMPLE_LISTINGS, { q: "pickup truck" }).map((i) => i.id)).toEqual(["1"]);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterListings(SAMPLE_LISTINGS, { q: "zzz" })).toEqual([]);
  });
});

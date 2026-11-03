import { describe, expect, it } from "vitest";
import { parseFilters } from "@/lib/search-params";

describe("parseFilters", () => {
  it("keeps known choices and a trimmed search", () => {
    expect(parseFilters({ q: "  sofa ", category: "Furniture", dzongkhag: "Thimphu", condition: "Good" })).toEqual({
      q: "sofa", category: "Furniture", dzongkhag: "Thimphu", condition: "Good",
    });
  });

  it("drops unknown choices and empty values", () => {
    expect(parseFilters({ q: "", category: "Weapons", dzongkhag: ["Paro", "Thimphu"], condition: "Mint" })).toEqual({
      q: undefined, category: undefined, dzongkhag: "Paro", condition: undefined,
    });
  });

  it("caps the search length", () => {
    expect(parseFilters({ q: "x".repeat(300) }).q).toHaveLength(100);
  });
});

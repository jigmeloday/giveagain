import { describe, expect, it } from "vitest";
import { giverFirstName, giverInitials, giverSummary } from "@/lib/giver";

describe("giver helpers", () => {
  it("makes initials and first names", () => {
    expect(giverInitials("Pema D.")).toBe("PD");
    expect(giverFirstName("Pema D.")).toBe("Pema");
  });

  it("summarises what they have given", () => {
    expect(giverSummary({ name: "Pema D.", given: 12, since: "2025-03-01T00:00:00Z" })).toBe("Has given 12 things since Mar 2025");
    expect(giverSummary({ name: "A", given: 1, since: "2025-03-01T00:00:00Z" })).toContain("1 thing since");
    expect(giverSummary({ name: "A", given: 0, since: "2025-03-01T00:00:00Z" })).toBe("New here.");
  });
});

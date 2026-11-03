// @vitest-environment node
import { describe, expect, it } from "vitest";
import { countOpenRequests } from "@/lib/account";
import type { MyListing } from "@/types/account";

const listing = (statuses: MyListing["requests"][number]["status"][]): MyListing => ({
  id: "l", name: "Sofa", category: "Furniture", area: "Motithang", dzongkhag: "Thimphu", postedAt: "2026-11-02T00:00:00Z", status: "available",
  requests: statuses.map((status, i) => ({ id: `r${i}`, name: "Karma W.", phone: "+97517998877", status, requestedAt: "2026-11-02T00:00:00Z" })),
});

describe("countOpenRequests", () => {
  it("counts only requests still waiting", () => {
    expect(countOpenRequests([listing(["requested", "accepted"]), listing(["requested", "declined"])])).toBe(2);
  });

  it("is zero without listings", () => {
    expect(countOpenRequests([])).toBe(0);
  });
});

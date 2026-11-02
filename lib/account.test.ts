import { describe, expect, it } from "vitest";
import { SAMPLE_MY_LISTINGS } from "@/constants/sample-account";
import { countOpenRequests } from "@/lib/account";

describe("countOpenRequests", () => {
  it("counts only requests still waiting", () => {
    expect(countOpenRequests(SAMPLE_MY_LISTINGS)).toBe(2);
  });

  it("is zero without listings", () => {
    expect(countOpenRequests([])).toBe(0);
  });
});

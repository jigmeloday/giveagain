import { describe, expect, it } from "vitest";
import { timeAgo } from "@/lib/format";

const now = new Date("2026-11-02T12:00:00Z");

describe("timeAgo", () => {
  it("handles minutes, hours and days", () => {
    expect(timeAgo("2026-11-02T11:59:50Z", now)).toBe("Just now");
    expect(timeAgo("2026-11-02T11:59:00Z", now)).toBe("1 minute ago");
    expect(timeAgo("2026-11-02T10:00:00Z", now)).toBe("2 hours ago");
    expect(timeAgo("2026-11-01T06:00:00Z", now)).toBe("Yesterday");
    expect(timeAgo("2026-10-30T06:00:00Z", now)).toBe("3 days ago");
  });

  it("shows a Thimphu date after a week", () => {
    expect(timeAgo("2026-10-20T00:00:00Z", now)).toBe("20 Oct 2026");
  });
});

// @vitest-environment node
import { describe, expect, it } from "vitest";
import { isAllowedOrigin } from "@/server/origin";

const ours = "http://localhost:3000";
const post = (origin?: string) => new Request("http://localhost:3000/api/trpc/x", { method: "POST", headers: origin ? { origin } : {} });

describe("isAllowedOrigin", () => {
  it("allows reads from anywhere", () => {
    expect(isAllowedOrigin(new Request("http://localhost:3000/api/trpc/x", { headers: { origin: "https://evil.example" } }), ours)).toBe(true);
  });

  it("allows writes from our own site", () => {
    expect(isAllowedOrigin(post(ours), ours)).toBe(true);
  });

  it("blocks writes from another site", () => {
    expect(isAllowedOrigin(post("https://evil.example"), ours)).toBe(false);
    expect(isAllowedOrigin(post("http://localhost:3000.evil.example"), ours)).toBe(false);
  });
});

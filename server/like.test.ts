// @vitest-environment node
import { describe, expect, it } from "vitest";
import { escapeLike } from "@/server/like";

describe("escapeLike", () => {
  it("makes wildcards literal", () => {
    expect(escapeLike("100%_sure\\")).toBe("100\\%\\_sure\\\\");
  });

  it("leaves normal text alone", () => {
    expect(escapeLike("sofa བཀྲ་ཤིས")).toBe("sofa བཀྲ་ཤིས");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { PhoneInput } from "./phone-input";

function Harness({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <PhoneInput label="Phone number" value={value} onChange={setValue} />
      <output>{value}</output>
    </>
  );
}

describe("PhoneInput", () => {
  it("reports the number with the country code", async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText("Phone number"), "17123456");
    expect(screen.getByRole("status")).toHaveTextContent("+97517123456");
    expect(screen.getByLabelText("Phone number")).toHaveValue("17 12 34 56");
  });

  it("shows a stored number without the country code", () => {
    render(<Harness initial="+97517123456" />);
    expect(screen.getByLabelText("Phone number")).toHaveValue("17 12 34 56");
  });

  it("ignores letters and reports empty when cleared", async () => {
    render(<Harness />);
    const field = screen.getByLabelText("Phone number");
    await userEvent.type(field, "ab");
    expect(screen.getByRole("status")).toHaveTextContent("");
    expect(field).toHaveValue("");
  });

  it("uses a phone keyboard on mobile", () => {
    render(<Harness />);
    expect(screen.getByLabelText("Phone number")).toHaveAttribute("inputmode", "tel");
  });
});

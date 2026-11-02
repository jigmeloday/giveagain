import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";
import { RadioGroup } from "./radio-group";
import { Select } from "./select";
import { Switch } from "./switch";

const options = [
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
];

describe("Checkbox", () => {
  it("can be ticked by clicking its label", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="It is free to take" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText("It is free to take"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("shows its error and is marked invalid", () => {
    render(<Checkbox label="It is free to take" error="Please confirm." />);
    expect(screen.getByRole("checkbox", { name: "It is free to take" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Please confirm.");
  });
});

describe("Switch", () => {
  it("toggles from its label", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Pause this listing" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("switch", { name: "Pause this listing" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe("RadioGroup", () => {
  it("is a named group with one radio per option", () => {
    render(<RadioGroup label="Condition" options={options} />);
    expect(screen.getByRole("group", { name: "Condition" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("reports the chosen value", async () => {
    const onValueChange = vi.fn();
    render(<RadioGroup label="Condition" options={options} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Fair" }));
    expect(onValueChange).toHaveBeenCalledWith("Fair");
  });

  it("shows its error", () => {
    render(<RadioGroup label="Condition" options={options} error="Choose the condition." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Choose the condition.");
  });
});

describe("Select", () => {
  it("has a label, a placeholder and an error", () => {
    render(<Select label="Category" options={options} placeholder="Choose one" error="Choose a category." />);
    const trigger = screen.getByRole("combobox", { name: /Category/ });
    expect(trigger).toHaveTextContent("Choose one");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Choose a category.");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";
import { PasswordInput } from "./password-input";
import { Textarea } from "./textarea";

describe("Input", () => {
  it("ties the label to the field", () => {
    render(<Input label="Item name" />);
    expect(screen.getByLabelText("Item name")).toBeInTheDocument();
  });

  it("shows the error, marks the field invalid and links them", () => {
    render(<Input label="Item name" error="Give the item a short name." />);
    const field = screen.getByLabelText("Item name");
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Give the item a short name.");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field.getAttribute("aria-describedby")).toContain(alert.id);
  });

  it("links the hint and does not mark a valid field invalid", () => {
    render(<Input label="Item name" hint="Keep it short." />);
    const field = screen.getByLabelText("Item name");
    expect(field).not.toHaveAttribute("aria-invalid");
    expect(field).toHaveAccessibleDescription("Keep it short.");
  });

  it("marks required fields", () => {
    render(<Input label="Item name" required />);
    expect(screen.getByLabelText(/Item name/)).toBeRequired();
  });

  it("passes native props through", async () => {
    render(<Input label="Email" type="email" placeholder="you@example.com" />);
    const field = screen.getByLabelText("Email");
    await userEvent.type(field, "a@b.bt");
    expect(field).toHaveValue("a@b.bt");
    expect(field).toHaveAttribute("type", "email");
  });
});

describe("Textarea", () => {
  it("has a label and an error", () => {
    render(<Textarea label="Description" error="Tell people more." />);
    expect(screen.getByLabelText("Description")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Tell people more.");
  });
});

describe("PasswordInput", () => {
  it("hides the password until asked", async () => {
    render(<PasswordInput label="Password" defaultValue="secret12" />);
    const field = screen.getByLabelText("Password");
    expect(field).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(field).toHaveAttribute("type", "text");

    await userEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(field).toHaveAttribute("type", "password");
  });

  it("does not submit the form when the toggle is pressed", async () => {
    let submitted = false;
    render(
      <form onSubmit={(event) => { event.preventDefault(); submitted = true; }}>
        <PasswordInput label="Password" />
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(submitted).toBe(false);
  });
});

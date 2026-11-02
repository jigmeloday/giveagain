import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageUpload } from "./image-upload";

const file = (name: string, type: string) => new File(["x"], name, { type });

function Harness({ max }: { max?: number }) {
  const [files, setFiles] = useState<File[]>([]);
  return <ImageUpload label="Photos" files={files} onChange={setFiles} max={max} />;
}

beforeEach(() => {
  let n = 0;
  vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: () => `blob:test/${n++}`, revokeObjectURL: () => undefined }));
});

describe("ImageUpload", () => {
  it("shows a preview for each chosen photo", async () => {
    render(<Harness />);
    await userEvent.upload(screen.getByLabelText("Photos"), [file("a.jpg", "image/jpeg"), file("b.png", "image/png")]);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("skips files that are not JPEG, PNG or WebP and says so", async () => {
    render(<Harness />);
    await userEvent.upload(screen.getByLabelText("Photos"), [file("a.jpg", "image/jpeg")]);
    const input = screen.getByLabelText("Photos") as HTMLInputElement;
    await userEvent.upload(input, file("doc.pdf", "application/pdf"), { applyAccept: false });
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("alert")).toHaveTextContent("Some files were skipped");
  });

  it("stops at the maximum and hides the add button", async () => {
    render(<Harness max={2} />);
    await userEvent.upload(screen.getByLabelText("Photos"), [file("1.jpg", "image/jpeg"), file("2.jpg", "image/jpeg"), file("3.jpg", "image/jpeg")]);
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /Add/ })).not.toBeInTheDocument();
  });

  it("removes a photo", async () => {
    render(<Harness />);
    await userEvent.upload(screen.getByLabelText("Photos"), [file("a.jpg", "image/jpeg"), file("b.jpg", "image/jpeg")]);
    await userEvent.click(screen.getByRole("button", { name: "Remove photo 1" }));
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});

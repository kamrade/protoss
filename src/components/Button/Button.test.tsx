import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders with default variant and size styles", () => {
    render(<Button>Submit</Button>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveClass("inline-flex");
    expect(button).toHaveClass("bg-gray-900");
    expect(button).toHaveClass("px-4", "py-2");
  });

  it("applies the provided variant, size, and className", () => {
    render(
      <Button variant="secondary" size="lg" className="custom-class">
        Save
      </Button>
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveClass("border-gray-300");
    expect(button).toHaveClass("px-5", "py-3");
    expect(button).toHaveClass("custom-class");
  });

  it("supports rendering as a child element via Slot", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
    );

    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("inline-flex");
    expect(link).toHaveClass("bg-gray-900");
  });

  it("forwards refs to the underlying DOM element", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe("Ref Button");
  });
});

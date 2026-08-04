import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./progress";

describe("Progress", () => {
  it("exposes the current value for assistive tech", () => {
    render(<Progress value={3} max={8} label="Paso 3 de 8" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuemax", "8");
    expect(screen.getByText("Paso 3 de 8")).toBeInTheDocument();
  });

  it("clamps the value between 0 and max", () => {
    render(<Progress value={20} max={8} />);
    const fill = screen.getByRole("progressbar").firstElementChild as HTMLElement;
    expect(fill.style.width).toBe("100%");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("associates the label with the input", () => {
    render(<Input label="¿Cuánto ganas al mes?" />);
    expect(screen.getByLabelText("¿Cuánto ganas al mes?")).toBeInTheDocument();
  });

  it("shows help text and links it via aria-describedby", () => {
    render(<Input label="Ahorros" help="Incluye solo el dinero disponible." />);
    const input = screen.getByLabelText("Ahorros");
    expect(screen.getByText("Incluye solo el dinero disponible.")).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription("Incluye solo el dinero disponible.");
  });

  it("marks the field as invalid and shows the error message", () => {
    render(<Input label="Ahorros" error="El importe no puede ser negativo." />);
    const input = screen.getByLabelText("Ahorros");
    expect(input).toBeInvalid();
    expect(screen.getByRole("alert")).toHaveTextContent("El importe no puede ser negativo.");
  });
});

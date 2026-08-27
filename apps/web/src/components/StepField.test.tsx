import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { StepDefinition } from "@atlas/journey-engine";

import { StepField } from "./StepField";

const currencyStep: StepDefinition = {
  id: "initialPortfolio",
  type: "currency",
  required: true,
  label: { es: "¿Cuánto tienes invertido?" },
};

const percentageStep: StepDefinition = {
  id: "stockAllocationPct",
  type: "percentage",
  required: true,
  label: { es: "¿Qué porcentaje en acciones?" },
};

describe("StepField numeric inputs", () => {
  it("never wipes what was already typed when a decimal point is typed mid-entry", () => {
    // Reproduce el bug real: escribir "100.000" tecla a tecla (como
    // separador de miles a la española) no debía dejar el campo vacío.
    const onChange = vi.fn();
    render(<StepField step={currencyStep} value={undefined} error={null} onChange={onChange} />);
    const input = screen.getByLabelText(currencyStep.label.es) as HTMLInputElement;

    for (const partial of ["1", "10", "100", "100.", "100.0", "100.00", "100.000"]) {
      fireEvent.change(input, { target: { value: partial } });
    }

    expect(input.value).toBe("100.000");
  });

  it("strips thousands-separator dots/commas from a currency field into a plain integer", () => {
    const onChange = vi.fn();
    render(<StepField step={currencyStep} value={undefined} error={null} onChange={onChange} />);
    const input = screen.getByLabelText(currencyStep.label.es);

    fireEvent.change(input, { target: { value: "100.000" } });

    expect(onChange).toHaveBeenLastCalledWith(100_000);
  });

  it("also strips comma-formatted thousands separators", () => {
    const onChange = vi.fn();
    render(<StepField step={currencyStep} value={undefined} error={null} onChange={onChange} />);
    const input = screen.getByLabelText(currencyStep.label.es);

    fireEvent.change(input, { target: { value: "1,000,000" } });

    expect(onChange).toHaveBeenLastCalledWith(1_000_000);
  });

  it("treats a dot or comma as a decimal point for percentage fields, not a thousands separator", () => {
    const onChange = vi.fn();
    render(<StepField step={percentageStep} value={undefined} error={null} onChange={onChange} />);
    const input = screen.getByLabelText(percentageStep.label.es) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "6" } });
    fireEvent.change(input, { target: { value: "6." } });
    fireEvent.change(input, { target: { value: "6.5" } });

    expect(input.value).toBe("6.5");
    expect(onChange).toHaveBeenLastCalledWith(6.5);
  });

  it("accepts a comma as the decimal separator for percentage fields too", () => {
    const onChange = vi.fn();
    render(<StepField step={percentageStep} value={undefined} error={null} onChange={onChange} />);
    const input = screen.getByLabelText(percentageStep.label.es);

    fireEvent.change(input, { target: { value: "6,5" } });

    expect(onChange).toHaveBeenLastCalledWith(6.5);
  });

  it("reports undefined once the field is cleared", () => {
    const onChange = vi.fn();
    render(<StepField step={currencyStep} value={1_000} error={null} onChange={onChange} />);
    const input = screen.getByLabelText(currencyStep.label.es);

    fireEvent.change(input, { target: { value: "" } });

    expect(onChange).toHaveBeenLastCalledWith(undefined);
  });

  it("initializes the visible text from an existing numeric answer", () => {
    render(<StepField step={currencyStep} value={50_000} error={null} onChange={vi.fn()} />);
    expect(screen.getByLabelText(currencyStep.label.es)).toHaveValue("50000");
  });
});

import { describe, expect, it } from "vitest";

import { validateStepValue } from "./validation";
import type { StepDefinition } from "./types";

const numberStep: StepDefinition = {
  id: "savings",
  type: "currency",
  required: true,
  label: { es: "¿Cuánto tienes ahorrado?" },
  validation: { minimum: 0 },
};

describe("validateStepValue", () => {
  it("requires a value when the step is required", () => {
    expect(validateStepValue(numberStep, undefined)).toBe("Este campo es obligatorio.");
    expect(validateStepValue(numberStep, "")).toBe("Este campo es obligatorio.");
  });

  it("allows an empty value when the step is optional", () => {
    const optional = { ...numberStep, required: false };
    expect(validateStepValue(optional, undefined)).toBeNull();
  });

  it("rejects non-numeric values for numeric types", () => {
    expect(validateStepValue(numberStep, "abc")).toBe("Introduce un número válido.");
  });

  it("enforces the configured minimum", () => {
    expect(validateStepValue(numberStep, -500)).toBe("El valor no puede ser menor que 0.");
  });

  it("enforces the configured maximum", () => {
    const bounded: StepDefinition = { ...numberStep, validation: { maximum: 40 } };
    expect(validateStepValue(bounded, 80)).toBe("El valor no puede ser mayor que 40.");
  });

  it("accepts a valid numeric value", () => {
    expect(validateStepValue(numberStep, 45_000)).toBeNull();
  });

  it("validates booleans", () => {
    const boolStep: StepDefinition = { ...numberStep, type: "boolean" };
    expect(validateStepValue(boolStep, "yes")).toBe("Selecciona una opción.");
    expect(validateStepValue(boolStep, true)).toBeNull();
  });
});

import type { StepDefinition } from "./types";

const NUMERIC_TYPES = new Set(["number", "currency", "percentage"]);

/**
 * Validación instantánea de un paso: formato + límites declarados en la
 * configuración. Las reglas de negocio complejas (coherencia entre varias
 * respuestas) siguen viviendo en el Decision Engine, no aquí.
 */
export function validateStepValue(step: StepDefinition, value: unknown): string | null {
  const isEmpty = value === undefined || value === null || value === "";

  if (step.required && isEmpty) {
    return "Este campo es obligatorio.";
  }

  if (isEmpty) {
    return null;
  }

  if (NUMERIC_TYPES.has(step.type)) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return "Introduce un número válido.";
    }
    if (step.validation?.minimum !== undefined && value < step.validation.minimum) {
      return `El valor no puede ser menor que ${step.validation.minimum}.`;
    }
    if (step.validation?.maximum !== undefined && value > step.validation.maximum) {
      return `El valor no puede ser mayor que ${step.validation.maximum}.`;
    }
  }

  if (step.type === "boolean" && typeof value !== "boolean") {
    return "Selecciona una opción.";
  }

  if (step.type === "select" && typeof value !== "string") {
    return "Selecciona una opción.";
  }

  return null;
}

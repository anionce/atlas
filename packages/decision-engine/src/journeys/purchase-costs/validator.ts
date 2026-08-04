import { DecisionValidationError } from "../../errors";
import type { DecisionError } from "../../shared-types";
import type { PurchaseCostsInputValues } from "./types";

export function validatePurchaseCostsInput(values: PurchaseCostsInputValues): void {
  const errors: DecisionError[] = [];

  if (!Number.isFinite(values.propertyPrice) || values.propertyPrice <= 0) {
    errors.push({
      code: "invalid_property_price",
      field: "propertyPrice",
      severity: "error",
      message: "El precio de la vivienda debe ser un número mayor que cero.",
    });
  }

  if (errors.length > 0) {
    throw new DecisionValidationError(errors);
  }
}

import type { BuyHomeDecisionInput } from "./journeys/buy-home/types";
import type { CompoundInterestDecisionInput } from "./journeys/compound-interest/types";
import type { FireDecisionInput } from "./journeys/fire/types";
import type { PurchaseCostsDecisionInput } from "./journeys/purchase-costs/types";

/**
 * Contrato genérico de TDD-001, ahora con cuatro Journeys. Añadir uno más
 * es añadir un miembro más a esta unión y un `case` más en `engine.ts` —
 * nunca tocar los Journeys existentes.
 */
export type DecisionInput =
  | BuyHomeDecisionInput
  | CompoundInterestDecisionInput
  | FireDecisionInput
  | PurchaseCostsDecisionInput;

export type {
  BuyHomeDecisionInput,
  BuyHomeInputValues,
  BuyHomeMetrics,
} from "./journeys/buy-home/types";
export type {
  CompoundInterestDecisionInput,
  CompoundInterestInputValues,
  CompoundInterestMetrics,
} from "./journeys/compound-interest/types";
export type { FireDecisionInput, FireInputValues, FireMetrics } from "./journeys/fire/types";
export type {
  PurchaseCostsDecisionInput,
  PurchaseCostsInputValues,
  PurchaseCostsMetrics,
} from "./journeys/purchase-costs/types";

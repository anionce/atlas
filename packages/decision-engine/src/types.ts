import type { BuyHomeDecisionInput } from "./journeys/buy-home/types";
import type { CompoundInterestDecisionInput } from "./journeys/compound-interest/types";

/**
 * Contrato genérico de TDD-001, ahora con dos Journeys. Añadir un tercero
 * es añadir un miembro más a esta unión y un `case` más en `engine.ts` —
 * nunca tocar los Journeys existentes.
 */
export type DecisionInput = BuyHomeDecisionInput | CompoundInterestDecisionInput;

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

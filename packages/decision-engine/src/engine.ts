import { evaluateBuyHome } from "./journeys/buy-home/engine";
import type { BuyHomeDecisionInput, BuyHomeMetrics } from "./journeys/buy-home/types";
import { evaluateCompoundInterest } from "./journeys/compound-interest/engine";
import type {
  CompoundInterestDecisionInput,
  CompoundInterestMetrics,
} from "./journeys/compound-interest/types";
import type { DecisionInput } from "./types";
import type { DecisionResult } from "./shared-types";

export function evaluateDecision(input: BuyHomeDecisionInput): DecisionResult<BuyHomeMetrics>;
export function evaluateDecision(
  input: CompoundInterestDecisionInput,
): DecisionResult<CompoundInterestMetrics>;
/**
 * Único punto de entrada público del Decision Engine, sea cual sea el
 * Journey. Solo hace dispatch por `journeyId`: toda la lógica vive en el
 * módulo del Journey correspondiente, nunca aquí.
 */
export function evaluateDecision(
  input: DecisionInput,
): DecisionResult<BuyHomeMetrics> | DecisionResult<CompoundInterestMetrics> {
  switch (input.journeyId) {
    case "buy-home":
      return evaluateBuyHome(input);
    case "compound-interest":
      return evaluateCompoundInterest(input);
  }
}

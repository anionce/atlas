import { evaluateBuyHome } from "./journeys/buy-home/engine";
import type { BuyHomeDecisionInput, BuyHomeMetrics } from "./journeys/buy-home/types";
import { evaluateCompoundInterest } from "./journeys/compound-interest/engine";
import type {
  CompoundInterestDecisionInput,
  CompoundInterestMetrics,
} from "./journeys/compound-interest/types";
import { evaluateFire } from "./journeys/fire/engine";
import type { FireDecisionInput, FireMetrics } from "./journeys/fire/types";
import { evaluatePurchaseCosts } from "./journeys/purchase-costs/engine";
import type {
  PurchaseCostsDecisionInput,
  PurchaseCostsMetrics,
} from "./journeys/purchase-costs/types";
import { evaluateSavingsRate } from "./journeys/savings-rate/engine";
import type { SavingsRateDecisionInput, SavingsRateMetrics } from "./journeys/savings-rate/types";
import type { DecisionInput } from "./types";
import type { DecisionResult } from "./shared-types";

export function evaluateDecision(input: BuyHomeDecisionInput): DecisionResult<BuyHomeMetrics>;
export function evaluateDecision(
  input: CompoundInterestDecisionInput,
): DecisionResult<CompoundInterestMetrics>;
export function evaluateDecision(input: FireDecisionInput): DecisionResult<FireMetrics>;
export function evaluateDecision(
  input: PurchaseCostsDecisionInput,
): DecisionResult<PurchaseCostsMetrics>;
export function evaluateDecision(
  input: SavingsRateDecisionInput,
): DecisionResult<SavingsRateMetrics>;
/**
 * Único punto de entrada público del Decision Engine, sea cual sea el
 * Journey. Solo hace dispatch por `journeyId`: toda la lógica vive en el
 * módulo del Journey correspondiente, nunca aquí.
 */
export function evaluateDecision(
  input: DecisionInput,
):
  | DecisionResult<BuyHomeMetrics>
  | DecisionResult<CompoundInterestMetrics>
  | DecisionResult<FireMetrics>
  | DecisionResult<PurchaseCostsMetrics>
  | DecisionResult<SavingsRateMetrics> {
  switch (input.journeyId) {
    case "buy-home":
      return evaluateBuyHome(input);
    case "compound-interest":
      return evaluateCompoundInterest(input);
    case "fire":
      return evaluateFire(input);
    case "purchase-costs":
      return evaluatePurchaseCosts(input);
    case "savings-rate":
      return evaluateSavingsRate(input);
  }
}

export { evaluateDecision } from "./engine";
export { DecisionValidationError } from "./errors";

export { compareScenarios as compareBuyHomeScenarios } from "./journeys/buy-home/scenarios";
export { compareScenarios as compareCompoundInterestScenarios } from "./journeys/compound-interest/scenarios";
export { compareScenarios as compareFireScenarios } from "./journeys/fire/scenarios";

export type { DecisionInput } from "./types";
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
  DecisionResult,
  DecisionError,
  Insight,
  InsightSeverity,
  Recommendation,
  ScenarioComparison,
  ScenarioResult,
} from "./shared-types";

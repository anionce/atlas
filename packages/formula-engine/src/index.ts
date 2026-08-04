export { calculateMortgage, maxPrincipalForPayment } from "./mortgage";
export type { MortgageInput, MortgageResult } from "./mortgage";

export { calculatePurchaseCosts } from "./purchase-costs";
export type { PurchaseCostsInput, PurchaseCostsBreakdown } from "./purchase-costs";

export { ITP_RATE_BY_REGION, DEFAULT_ITP_RATE } from "./spanish-regions";
export type { SpanishRegion } from "./spanish-regions";

export { calculateAffordability } from "./affordability";
export type { AffordabilityInput, AffordabilityResult } from "./affordability";

export { calculateCompoundInterest, monthsToReachGoal } from "./compound-interest";
export type { CompoundInterestInput, CompoundInterestResult } from "./compound-interest";

export { calculateFireNumber } from "./fire";
export type { FireNumberInput } from "./fire";

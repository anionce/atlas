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

export {
  calculateFireNumber,
  calculateFireNumberAfterTax,
  calculateFireNumberWithPension,
} from "./fire";
export type { FireNumberInput, FireNumberAfterTaxInput, FireNumberWithPensionInput } from "./fire";

export {
  calculateSpanishSavingsTax,
  SPANISH_SAVINGS_TAX_BRACKETS_2026,
} from "./spanish-savings-tax";
export type { SavingsTaxBracket } from "./spanish-savings-tax";

export {
  estimateSpanishPublicPensionGrossMonthly,
  estimateSpanishPublicPensionNetMonthly,
  SPANISH_GENERAL_TAX_BRACKETS_APPROX_2026,
} from "./spanish-pension-estimate";
export type { SpanishPensionEstimateInput } from "./spanish-pension-estimate";

export { calculateCoastFire } from "./coast-fire";
export type { CoastFireInput, CoastFireResult } from "./coast-fire";

export { calculateSavingsRate } from "./savings-rate";
export type { SavingsRateInput, SavingsRateResult } from "./savings-rate";

export { US_HISTORICAL_MARKET_RETURNS } from "./historical-market-data";
export type { HistoricalMarketYear } from "./historical-market-data";

export { calculateHistoricalBacktest, constantDollarStrategy } from "./historical-backtest";
export type {
  HistoricalBacktestInput,
  HistoricalBacktestResult,
  HistoricalSimulationResult,
  WithdrawalStrategy,
  WithdrawalStrategyContext,
} from "./historical-backtest";

export {
  createGuytonKlingerStrategy,
  createOneOverNStrategy,
  createPercentOfPortfolioStrategy,
  createVpwStrategy,
} from "./withdrawal-strategies";

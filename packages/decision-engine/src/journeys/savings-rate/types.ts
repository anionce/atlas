export interface SavingsRateInputValues {
  /** Ingreso mensual neto. */
  monthlyIncome: number;
  monthlyExpenses: number;
  currentInvestments?: number;
  annualReturnRate: number;
}

export interface SavingsRateDecisionInput {
  journeyId: "savings-rate";
  version: string;
  locale: "es";
  values: SavingsRateInputValues;
}

export interface SavingsRateMetrics {
  /** Ingresos menos gastos, en euros. Puede ser negativo. */
  monthlySavings: number;
  /** Porcentaje de tus ingresos que ahorras. Puede ser negativo o superar el 100 %. */
  savingsRatePct: number;
  /** Capital necesario para vivir de las rentas (regla del 4 %) a tu nivel de gasto actual. */
  fireNumber: number;
  /** `null` si, a este ritmo de ahorro, nunca se alcanza. */
  monthsToFire: number | null;
}

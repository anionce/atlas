export interface FireInputValues {
  currentAge: number;
  currentInvestments?: number;
  monthlyContribution: number;
  annualReturnRate: number;
  /** Gasto mensual que necesitarías cubrir viviendo de las rentas. */
  monthlyExpenses: number;
}

export interface FireDecisionInput {
  journeyId: "fire";
  version: string;
  locale: "es";
  values: FireInputValues;
}

export interface FireMetrics {
  /** Capital necesario para vivir de las rentas (regla del 4 %), sin contar impuestos. */
  fireNumber: number;
  /**
   * Capital necesario ajustado por el IRPF español sobre la parte de
   * ganancia de cada retirada — el número realista para vivir en España.
   * Es una aproximación (ver `calculateFireNumberAfterTax`), no un cálculo
   * fiscal exacto.
   */
  fireNumberAfterTax: number;
  /** `null` si, al ritmo actual, nunca se alcanza. */
  monthsToFire: number | null;
  ageAtFire: number | null;
}

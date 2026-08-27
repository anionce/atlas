export interface FireInputValues {
  currentAge: number;
  currentInvestments?: number;
  monthlyContribution: number;
  annualReturnRate: number;
  /** Gasto mensual que necesitarías cubrir viviendo de las rentas. */
  monthlyExpenses: number;
  /**
   * Estimación NETA de la pensión pública mensual que esperas cobrar, tal
   * como te la daría el simulador oficial de la Seguridad Social. Si se
   * indica, tiene prioridad sobre la estimación automática calculada a
   * partir de `currentGrossMonthlyIncome`/`yearsAlreadyContributed`.
   */
  monthlyPensionEstimate?: number;
  /**
   * Salario bruto mensual actual. Solo se usa, junto con
   * `yearsAlreadyContributed`, para estimar automáticamente la pensión
   * pública cuando no se indica `monthlyPensionEstimate` directamente.
   */
  currentGrossMonthlyIncome?: number;
  /** Años ya cotizados a la Seguridad Social hasta hoy. */
  yearsAlreadyContributed?: number;
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
  /**
   * Capital necesario ajustado por IRPF y, además, por la pensión pública
   * española: si se indicó una estimación de pensión, reduce el capital
   * necesario a partir de la edad legal de jubilación y financia con un
   * fondo puente el tramo desde que se alcanza FIRE hasta esa edad. Cuando
   * no se indica pensión, coincide exactamente con `fireNumberAfterTax`.
   * Es una aproximación (ver `calculateFireNumberWithPension`): asume que
   * la edad de jubilación y el importe de la pensión no cambian de aquí a
   * entonces.
   */
  fireNumberWithPension: number;
  /**
   * Pensión pública mensual neta efectivamente usada para calcular
   * `fireNumberWithPension`: la indicada directamente, o la estimada
   * automáticamente a partir del salario y los años cotizados si no se
   * indicó ninguna. `0` si no hay ninguna de las dos.
   */
  effectiveMonthlyPension: number;
  /** De dónde sale `effectiveMonthlyPension`. */
  pensionSource: "reported" | "estimated" | "none";
  /**
   * Gasto mensual que le quedaría por cubrir a la cartera a partir de la
   * edad legal de jubilación, una vez descontada `effectiveMonthlyPension`.
   * Coincide con el gasto mensual original cuando `pensionSource` es
   * `"none"`.
   */
  reducedMonthlyExpensesAfterPension: number;
  /** `null` si, al ritmo actual, nunca se alcanza. */
  monthsToFire: number | null;
  ageAtFire: number | null;
}

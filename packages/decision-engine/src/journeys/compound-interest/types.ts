export interface CompoundInterestInputValues {
  initialAmount?: number;
  monthlyContribution: number;
  annualReturnRate: number;
  years: number;
  /** Si se da, el motor calcula cuántos meses hacen falta para alcanzarlo. */
  goalAmount?: number;
}

export interface CompoundInterestDecisionInput {
  journeyId: "compound-interest";
  version: string;
  locale: "es";
  values: CompoundInterestInputValues;
}

export interface CompoundInterestMetrics {
  finalBalance: number;
  totalContributed: number;
  totalInterestEarned: number;
  /** `null` si no se dio objetivo, o si no es alcanzable con estos datos. */
  monthsToGoal: number | null;
}

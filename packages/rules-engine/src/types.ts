export type RuleSeverity = "success" | "warning" | "info";

/**
 * Las reglas no calculan ni redactan: solo interpretan métricas ya calculadas
 * y emiten un código. El Decision Engine traduce ese código a lenguaje natural.
 */
export interface RuleTrigger {
  code: string;
  severity: RuleSeverity;
}

export interface CoastFireInput {
  /** Número FIRE objetivo, en euros. */
  fireNumber: number;
  currentInvestments: number;
  monthlyContribution: number;
  annualReturnRatePct: number;
  currentAge: number;
  /**
   * Edad hasta la que "dejarías crecer" el capital sin aportar más, antes de
   * necesitar el número FIRE completo. Normalmente la edad de jubilación
   * habitual, no la edad FIRE objetivo — Coast FIRE responde justo a la
   * pregunta de si podrías parar de aportar antes de esa edad y aun así
   * llegar a tiempo solo con el crecimiento de lo que ya tienes.
   */
  targetAge: number;
}

export interface CoastFireResult {
  /**
   * Cuánto necesitarías tener invertido HOY para, sin aportar ni un euro
   * más, llegar solo por crecimiento a `fireNumber` en `targetAge`.
   */
  coastFireNumberToday: number;
  /** Si ya tienes invertido hoy lo suficiente para parar de aportar ahora mismo. */
  alreadyCoasting: boolean;
  /**
   * Edad a la que, aportando al ritmo actual hasta entonces, podrías parar
   * de aportar y aun así llegar a `fireNumber` en `targetAge` solo con el
   * crecimiento. `null` si, al ritmo actual, no se alcanza antes de
   * `targetAge` (habría que seguir aportando hasta el final).
   */
  coastFireAge: number | null;
}

/**
 * Cuánto capital hace falta en `age` para que, creciendo solo (sin más
 * aportaciones) a `annualReturnRatePct`, llegue a `fireNumber` en
 * `targetAge`. Es el número FIRE descontado hacia atrás en el tiempo.
 */
function coastFireNumberAtAge(
  fireNumber: number,
  annualReturnRatePct: number,
  age: number,
  targetAge: number,
): number {
  const yearsToGrow = Math.max(0, targetAge - age);
  if (yearsToGrow === 0) return fireNumber;
  return fireNumber / (1 + annualReturnRatePct / 100) ** yearsToGrow;
}

/**
 * Coast FIRE: el punto en el que ya tienes invertido lo suficiente para que,
 * sin aportar nada más, el simple crecimiento compuesto te lleve a tu número
 * FIRE para `targetAge` — a partir de ahí, "dejas que el tiempo haga el
 * resto". Es un concepto distinto de la edad FIRE habitual (cuándo puedes
 * dejar de trabajar del todo): Coast FIRE es cuándo puedes dejar de
 * *ahorrar*, aunque sigas trabajando por otros motivos.
 *
 * Búsqueda mes a mes (no fórmula cerrada) porque el capital necesario baja
 * cada mes que pasa —queda menos tiempo para crecer— mientras el capital
 * acumulado sube por las aportaciones, y ambas curvas no se cruzan de forma
 * algebraicamente simple.
 */
export function calculateCoastFire(input: CoastFireInput): CoastFireResult {
  const {
    fireNumber,
    currentInvestments,
    monthlyContribution,
    annualReturnRatePct,
    currentAge,
    targetAge,
  } = input;

  const coastFireNumberToday = coastFireNumberAtAge(
    fireNumber,
    annualReturnRatePct,
    currentAge,
    targetAge,
  );
  const alreadyCoasting = currentInvestments >= coastFireNumberToday;

  if (alreadyCoasting) {
    return { coastFireNumberToday, alreadyCoasting: true, coastFireAge: currentAge };
  }

  const monthlyRate = annualReturnRatePct / 100 / 12;
  const maxMonths = Math.round(Math.max(0, targetAge - currentAge) * 12);

  let balance = currentInvestments;
  for (let month = 1; month <= maxMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    const ageAtMonth = currentAge + month / 12;
    const requiredAtThisAge = coastFireNumberAtAge(
      fireNumber,
      annualReturnRatePct,
      ageAtMonth,
      targetAge,
    );
    if (balance >= requiredAtThisAge) {
      return { coastFireNumberToday, alreadyCoasting: false, coastFireAge: ageAtMonth };
    }
  }

  return { coastFireNumberToday, alreadyCoasting: false, coastFireAge: null };
}

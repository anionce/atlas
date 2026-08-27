import { CircleCheckBig, TriangleAlert } from "lucide-react";

import { ASSUMED_PUBLIC_PENSION_AGE } from "@atlas/decision-engine";
import type { DecisionResult, FireMetrics } from "@atlas/decision-engine";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
  CardValue,
} from "@atlas/design-system";

function formatEuros(amount: number): string {
  return `${Math.round(amount).toLocaleString("es-ES", { useGrouping: "always" })} €`;
}

function formatYears(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) return `${years} años`;
  return `${years} años y ${remainingMonths} meses`;
}

export interface ResultScreenProps {
  result: DecisionResult<FireMetrics>;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const {
    monthsToFire,
    ageAtFire,
    fireNumber,
    fireNumberAfterTax,
    fireNumberWithPension,
    effectiveMonthlyPension,
    pensionSource,
    reducedMonthlyExpensesAfterPension,
    coastFireNumberToday,
    alreadyCoasting,
    coastFireAge,
  } = result.metrics;
  const reachable = monthsToFire !== null && ageAtFire !== null;
  const pensionApplied = pensionSource !== "none";

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
      <Card className="bg-primary text-primary-foreground rounded-3xl">
        <CardDescription className="text-primary-foreground/80">Resumen</CardDescription>
        <CardValue className="text-4xl">
          {reachable ? `${Math.round(ageAtFire)} años` : formatEuros(fireNumberWithPension)}
        </CardValue>
        <p className="mt-2 text-lg">{result.summary}</p>
      </Card>

      <div className={`grid grid-cols-1 gap-4 ${reachable ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
        <Card>
          <CardDescription>Capital necesario para vivir de las rentas</CardDescription>
          <CardValue className="text-2xl">{formatEuros(fireNumberWithPension)}</CardValue>
          <CardDescription className="mt-2 text-sm">
            {pensionApplied ? (
              <>
                Con el IRPF español ya descontado. Sin contar ninguna pensión:{" "}
                {formatEuros(fireNumberAfterTax)}. Sin impuestos ni pensión:{" "}
                {formatEuros(fireNumber)}.
              </>
            ) : (
              <>
                Estimación con el IRPF español sobre la parte de ganancia de cada retirada ya
                descontado. Sin contar impuestos: {formatEuros(fireNumber)}.
              </>
            )}
          </CardDescription>
        </Card>
        {reachable ? (
          <Card>
            <CardDescription>Tiempo estimado</CardDescription>
            <CardValue className="text-2xl">{formatYears(monthsToFire)}</CardValue>
          </Card>
        ) : null}
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardTitle className="text-base">Coast FIRE</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          {alreadyCoasting ? (
            <>
              Ya has alcanzado tu Coast FIRE: aunque no aportaras ni un euro más a partir de hoy, el
              crecimiento de lo que ya tienes invertido bastaría por sí solo para llegar a tu número
              FIRE ({formatEuros(fireNumberAfterTax)}) para los {ASSUMED_PUBLIC_PENSION_AGE} años.
            </>
          ) : coastFireAge !== null ? (
            <>
              Podrías alcanzar tu Coast FIRE a los {Math.round(coastFireAge)} años: a partir de esa
              edad, si dejaras de aportar, el crecimiento por sí solo te llevaría a tu número FIRE
              para los {ASSUMED_PUBLIC_PENSION_AGE} años. Para poder parar de aportar ya mismo,
              necesitarías tener invertidos hoy {formatEuros(coastFireNumberToday)}.
            </>
          ) : (
            <>
              Al ritmo actual no llegarías a poder dejar de aportar antes de los{" "}
              {ASSUMED_PUBLIC_PENSION_AGE} años — seguirías necesitando aportar hasta entonces.
            </>
          )}{" "}
          Es un concepto distinto de la edad FIRE: no es cuándo puedes dejar de trabajar del todo,
          sino cuándo puedes dejar de <em>ahorrar</em>, aunque sigas trabajando por otros motivos.
        </CardDescription>
      </Card>

      {pensionApplied ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardTitle className="text-base">Tu pensión pública en el cálculo</CardTitle>
          <CardDescription className="mt-2 text-sm leading-relaxed">
            Cuentas con {formatEuros(effectiveMonthlyPension)}/mes de pensión pública
            {pensionSource === "estimated" ? " (estimación automática)" : ""}, a partir de los{" "}
            {ASSUMED_PUBLIC_PENSION_AGE} años — la edad legal de jubilación que asumimos, ya que la
            real depende de cuánto hayas cotizado para entonces. Hasta esa edad tu cartera tiene que
            cubrir el gasto completo; a partir de ahí, solo la diferencia entre tu gasto y la
            pensión: {formatEuros(reducedMonthlyExpensesAfterPension)}/mes. Por eso el capital
            necesario baja de {formatEuros(fireNumberAfterTax)} a{" "}
            {formatEuros(fireNumberWithPension)}.
            {pensionSource === "estimated" ? (
              <>
                {" "}
                Es una estimación muy aproximada a partir de tu salario y años cotizados —no tiene
                en cuenta tu comunidad autónoma, tu situación familiar, ni cambios futuros en la
                ley—. Para una cifra fiable, usa el{" "}
                <a
                  href="https://prestaciones.seg-social.es/simulador-servicio/simulador-pension-jubilacion.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  simulador oficial de la Seguridad Social
                </a>
                .
              </>
            ) : null}
          </CardDescription>
        </Card>
      ) : null}

      {result.warnings.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-foreground text-xl font-semibold">A tener en cuenta</h2>
          {result.warnings.map((warning) => (
            <Card key={warning.code} className="border-warning/40 bg-warning/10">
              <div className="flex gap-3">
                <TriangleAlert className="text-warning mt-0.5 size-5 shrink-0" strokeWidth={2} />
                <div>
                  <CardTitle className="text-base">{warning.title}</CardTitle>
                  <CardDescription>{warning.message}</CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </section>
      ) : null}

      {result.insights.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-foreground text-xl font-semibold">Lo positivo</h2>
          {result.insights.map((insight) => (
            <Card key={insight.code} className="border-success/40 bg-success/10">
              <div className="flex gap-3">
                <CircleCheckBig className="text-success mt-0.5 size-5 shrink-0" strokeWidth={2} />
                <div>
                  <CardTitle className="text-base">{insight.title}</CardTitle>
                  <CardDescription>{insight.message}</CardDescription>
                </div>
              </div>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-xl font-semibold">Recomendaciones</h2>
        {result.recommendations.map((rec) => (
          <Card key={rec.id}>
            <CardTitle>{rec.title}</CardTitle>
            <CardDescription>{rec.message}</CardDescription>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-xl font-semibold">Comparativa de escenarios</h2>
        <div className="border-border overflow-x-auto rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Escenario</th>
                <th className="px-4 py-3 font-medium">Capital necesario</th>
                <th className="px-4 py-3 font-medium">Tiempo estimado</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.scenarios.map((scenario) => (
                <tr key={scenario.id} className="border-border border-t">
                  <td className="text-foreground px-4 py-3 font-medium">{scenario.label}</td>
                  <td className="px-4 py-3">{formatEuros(scenario.metrics.fireNumberAfterTax)}</td>
                  <td className="px-4 py-3">
                    {scenario.metrics.monthsToFire !== null
                      ? formatYears(scenario.metrics.monthsToFire)
                      : "No alcanzable"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-sm">{result.comparison.explanation}</p>
        <p className="text-muted-foreground text-sm">
          Lean FIRE y Fat FIRE no cambian tu plan de aportación — muestran cuánto haría falta si tu
          gasto en la jubilación fuera un 30 % más ajustado o un 50 % más holgado que el que nos
          diste, para que veas el rango completo.
        </p>
        {pensionApplied ? (
          <p className="text-muted-foreground text-sm">
            Ninguna fila de esta tabla descuenta tu pensión pública (solo el IRPF): al cambiar de
            plan también cambian los años que trabajas y, con ellos, la pensión estimada, así que
            aquí comparamos solo el efecto de cada palanca por separado.
          </p>
        ) : null}
      </section>

      <Card>
        <CardTitle className="text-base">Próximos pasos</CardTitle>
        <ul className="mt-2 flex flex-col gap-2">
          {result.nextSteps.map((step) => (
            <li key={step} className="text-muted-foreground text-sm">
              · {step}
            </li>
          ))}
        </ul>
        <CardFooter>
          <Button type="button" variant="tertiary" onClick={onRestart}>
            Empezar de nuevo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

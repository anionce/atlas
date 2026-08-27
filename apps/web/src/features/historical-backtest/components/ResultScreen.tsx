import { CircleCheckBig, TriangleAlert } from "lucide-react";

import type { DecisionResult, HistoricalBacktestMetrics } from "@atlas/decision-engine";
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

function formatPct(pct: number): string {
  return `${Math.round(pct)} %`;
}

/**
 * Una barra por cada ventana histórica simulada — verde si la cartera
 * aguantó todo el plazo, roja si se agotó antes. No es una librería de
 * gráficas: son <rect> de SVG a mano, la forma más simple de mostrar 69
 * resultados de un vistazo sin añadir ninguna dependencia nueva.
 */
function SimulationStrip({
  simulations,
}: {
  simulations: HistoricalBacktestMetrics["simulations"];
}) {
  const width = 700;
  const height = 60;
  const barWidth = simulations.length > 0 ? width / simulations.length : width;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-16 w-full"
      role="img"
      aria-label={`${simulations.filter((s) => s.success).length} de ${simulations.length} secuencias históricas sobrevivieron`}
    >
      {simulations.map((sim, i) => (
        <rect
          key={sim.startYear}
          x={i * barWidth}
          y={0}
          width={Math.max(barWidth - 1, 1)}
          height={height}
          className={sim.success ? "fill-success" : "fill-destructive"}
        >
          <title>
            {sim.startYear}–{sim.endYear}: {sim.success ? "aguantó" : "se agotó"} (
            {formatEuros(sim.endingBalance)} al final)
          </title>
        </rect>
      ))}
    </svg>
  );
}

export interface ResultScreenProps {
  result: DecisionResult<HistoricalBacktestMetrics>;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const { successRatePct, successCount, totalSimulations, simulations, withdrawalRatePct } =
    result.metrics;
  const failedSimulations = simulations.filter((s) => !s.success);

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
      <Card className="bg-primary text-primary-foreground rounded-3xl">
        <CardDescription className="text-primary-foreground/80">
          Tasa de éxito histórica
        </CardDescription>
        <CardValue className="text-4xl">{formatPct(successRatePct)}</CardValue>
        <p className="mt-2 text-lg">{result.summary}</p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardDescription>Secuencias que aguantaron</CardDescription>
          <CardValue className="text-2xl">
            {successCount} de {totalSimulations}
          </CardValue>
        </Card>
        <Card>
          <CardDescription>Tasa de retirada del primer año</CardDescription>
          <CardValue className="text-2xl">{withdrawalRatePct.toFixed(1)} %</CardValue>
        </Card>
      </div>

      <Card>
        <CardTitle className="text-base">Cada secuencia histórica posible</CardTitle>
        <CardDescription className="mt-1 text-sm">
          Una barra por cada año real en que se podría haber empezado esta jubilación, desde 1928.
          Verde: la cartera aguantó todo el plazo. Roja: se agotó antes. Pasa el ratón por encima de
          una barra para ver el año.
        </CardDescription>
        <div className="mt-4">
          <SimulationStrip simulations={simulations} />
        </div>
      </Card>

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

      {failedSimulations.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-foreground text-xl font-semibold">Secuencias que no aguantaron</h2>
          <div className="border-border overflow-x-auto rounded-2xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Período</th>
                </tr>
              </thead>
              <tbody>
                {failedSimulations.map((sim) => (
                  <tr key={sim.startYear} className="border-border border-t">
                    <td className="text-foreground px-4 py-3 font-medium">
                      {sim.startYear}–{sim.endYear}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <th className="px-4 py-3 font-medium">Tasa de éxito histórica</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.scenarios.map((scenario) => (
                <tr key={scenario.id} className="border-border border-t">
                  <td className="text-foreground px-4 py-3 font-medium">{scenario.label}</td>
                  <td className="px-4 py-3">{formatPct(scenario.metrics.successRatePct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-sm">{result.comparison.explanation}</p>
      </section>

      <Card className="border-primary/30 bg-primary/5">
        <CardTitle className="text-base">Sobre esta simulación</CardTitle>
        <CardDescription className="mt-2 text-sm leading-relaxed">
          Usa datos históricos reales de mercado de EE. UU. desde 1928 (S&amp;P 500, bonos del
          Tesoro a 10 años, inflación) — no existe un dataset igual de largo y limpio de mercado
          español o europeo, así que usamos el mismo que las calculadoras de referencia de este tipo
          (FI Calc, FIRECalc, cFIREsim). Que una secuencia histórica haya aguantado no garantiza que
          el futuro se parezca al pasado — es una forma de estresar tu plan contra escenarios reales
          que ya ocurrieron, no una predicción.
        </CardDescription>
      </Card>

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

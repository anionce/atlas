import { CircleCheckBig, TriangleAlert } from "lucide-react";

import type { CompoundInterestMetrics, DecisionResult } from "@atlas/decision-engine";
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

function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} meses`;
  if (remainingMonths === 0) return `${years} años`;
  return `${years} años y ${remainingMonths} meses`;
}

export interface ResultScreenProps {
  result: DecisionResult<CompoundInterestMetrics>;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const { monthsToGoal } = result.metrics;

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
      <Card className="bg-primary text-primary-foreground rounded-3xl">
        <CardDescription className="text-primary-foreground/80">Resumen</CardDescription>
        <CardValue className="text-4xl">{formatEuros(result.metrics.finalBalance)}</CardValue>
        <p className="mt-2 text-lg">{result.summary}</p>
      </Card>

      <div
        className={`grid grid-cols-1 gap-4 ${monthsToGoal !== null ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
      >
        <Card>
          <CardDescription>Aportado en total</CardDescription>
          <CardValue className="text-2xl">{formatEuros(result.metrics.totalContributed)}</CardValue>
        </Card>
        <Card>
          <CardDescription>Intereses ganados</CardDescription>
          <CardValue className="text-2xl">
            {formatEuros(result.metrics.totalInterestEarned)}
          </CardValue>
        </Card>
        {monthsToGoal !== null ? (
          <Card>
            <CardDescription>Tiempo hasta tu objetivo</CardDescription>
            <CardValue className="text-2xl">{formatMonths(monthsToGoal)}</CardValue>
          </Card>
        ) : null}
      </div>

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
                <th className="px-4 py-3 font-medium">Balance final</th>
                <th className="px-4 py-3 font-medium">Intereses ganados</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.scenarios.map((scenario) => (
                <tr key={scenario.id} className="border-border border-t">
                  <td className="text-foreground px-4 py-3 font-medium">{scenario.label}</td>
                  <td className="px-4 py-3">{formatEuros(scenario.metrics.finalBalance)}</td>
                  <td className="px-4 py-3">{formatEuros(scenario.metrics.totalInterestEarned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-sm">{result.comparison.explanation}</p>
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

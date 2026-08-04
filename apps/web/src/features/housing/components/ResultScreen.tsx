import type { DecisionResult } from "@atlas/decision-engine";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
  CardValue,
} from "@atlas/design-system";

function formatEuros(amount: number): string {
  return `${Math.round(amount).toLocaleString("es-ES")} €`;
}

export interface ResultScreenProps {
  result: DecisionResult;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
      <Card className="bg-primary text-primary-foreground rounded-3xl">
        <CardDescription className="text-primary-foreground/80">Resumen</CardDescription>
        <CardValue className="text-4xl">{formatEuros(result.metrics.maxPropertyPrice)}</CardValue>
        <p className="mt-2 text-lg">{result.summary}</p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardDescription>Cuota estimada</CardDescription>
          <CardValue className="text-2xl">
            {formatEuros(result.metrics.monthlyPayment)}/mes
          </CardValue>
        </Card>
        <Card>
          <CardDescription>Entrada necesaria</CardDescription>
          <CardValue className="text-2xl">{formatEuros(result.metrics.requiredEntry)}</CardValue>
        </Card>
        <Card>
          <CardDescription>Gastos de compra estimados</CardDescription>
          <CardValue className="text-2xl">{formatEuros(result.metrics.purchaseCosts)}</CardValue>
        </Card>
      </div>

      {result.warnings.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-foreground text-xl font-semibold">A tener en cuenta</h2>
          {result.warnings.map((warning) => (
            <Card key={warning.code} className="border-warning/40 bg-warning/10">
              <CardTitle className="text-base">{warning.title}</CardTitle>
              <CardDescription>{warning.message}</CardDescription>
            </Card>
          ))}
        </section>
      ) : null}

      {result.insights.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-foreground text-xl font-semibold">Lo positivo</h2>
          {result.insights.map((insight) => (
            <Card key={insight.code} className="border-success/40 bg-success/10">
              <CardTitle className="text-base">{insight.title}</CardTitle>
              <CardDescription>{insight.message}</CardDescription>
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
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Cuota</th>
                <th className="px-4 py-3 font-medium">Intereses totales</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.scenarios.map((scenario) => (
                <tr key={scenario.id} className="border-border border-t">
                  <td className="text-foreground px-4 py-3 font-medium">{scenario.label}</td>
                  <td className="px-4 py-3">{formatEuros(scenario.metrics.maxPropertyPrice)}</td>
                  <td className="px-4 py-3">{formatEuros(scenario.metrics.monthlyPayment)}</td>
                  <td className="px-4 py-3">{formatEuros(scenario.metrics.totalInterest)}</td>
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

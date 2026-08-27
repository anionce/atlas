"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { trackScenarioCompared } from "@atlas/analytics";
import { DecisionValidationError, evaluateDecision } from "@atlas/decision-engine";
import { WizardScreen } from "@atlas/design-system";
import { LocalStoragePersistenceAdapter } from "@atlas/journey-engine";

import { StepField } from "@/components/StepField";
import { useJourneyMachine } from "@/lib/use-journey-machine";
import { useStepError } from "@/lib/use-step-error";

import { purchaseCostsJourney } from "../purchase-costs.journey";
import { toDecisionInput } from "../purchase-costs-to-decision-input";
import { PurchaseCostsResultScreen } from "./PurchaseCostsResultScreen";

export function PurchaseCostsJourneyClient() {
  const router = useRouter();
  const journey = useJourneyMachine(purchaseCostsJourney);
  const { state, currentStep, progress, isComplete, setAnswer, goNext, goBack } = journey;
  const [currentError, setCurrentError] = useStepError(currentStep?.id);

  const result = useMemo(() => {
    if (!isComplete) return null;
    try {
      return {
        data: evaluateDecision(toDecisionInput(state.answers)),
        error: null as string | null,
      };
    } catch (error) {
      if (error instanceof DecisionValidationError) {
        return { data: null, error: error.errors.map((e) => e.message).join(" ") };
      }
      throw error;
    }
  }, [isComplete, state.answers]);

  useEffect(() => {
    if (result?.data) {
      trackScenarioCompared({
        journeyId: purchaseCostsJourney.id,
        scenarioIds: result.data.comparison.scenarios.map((s) => s.id),
      });
    }
  }, [result]);

  const handleRestart = () => {
    new LocalStoragePersistenceAdapter().clear(purchaseCostsJourney.id);
    router.push("/");
  };

  if (isComplete && result?.data) {
    return (
      <div className="bg-background min-h-screen px-6 py-16">
        <div className="mx-auto mb-6 w-full max-w-[900px]">
          <Link href="/" className="text-muted-foreground text-sm hover:underline">
            ← Inicio
          </Link>
        </div>
        <PurchaseCostsResultScreen result={result.data} onRestart={handleRestart} />
      </div>
    );
  }

  if (isComplete && result?.error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[600px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-foreground text-lg">No hemos podido calcular tu resultado.</p>
        <p className="text-muted-foreground text-sm">{result.error}</p>
        <Link href="/" className="text-primary text-sm hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  if (!currentStep) {
    return null;
  }

  const stepNumber = Math.min(progress.current + 1, progress.total);

  return (
    <div className="bg-background min-h-screen px-6 py-16">
      <div className="mx-auto mb-6 w-full max-w-[600px]">
        <Link href="/" className="text-muted-foreground text-sm hover:underline">
          ← Inicio
        </Link>
      </div>
      <WizardScreen
        title={purchaseCostsJourney.title.es}
        stepLabel={`Paso ${stepNumber} de ${progress.total}`}
        progressValue={progress.current}
        progressMax={progress.total}
        onBack={progress.current > 0 ? goBack : undefined}
        onNext={() => goNext()}
        nextDisabled={!journey.machine.canGoNext()}
        nextLabel={stepNumber === progress.total ? "Ver resultado" : "Continuar"}
      >
        <StepField
          step={currentStep}
          value={state.answers[currentStep.id]}
          error={currentError}
          onChange={(value) => setCurrentError(setAnswer(currentStep.id, value))}
        />
      </WizardScreen>
    </div>
  );
}

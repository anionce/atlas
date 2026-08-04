"use client";

import { useEffect, useMemo, useState } from "react";

import { trackScenarioCompared } from "@atlas/analytics";
import { DecisionValidationError, evaluateDecision } from "@atlas/decision-engine";
import { WizardScreen } from "@atlas/design-system";

import { buyHomeJourney } from "@/features/housing/buy-home.journey";
import { toDecisionInput } from "@/features/housing/to-decision-input";
import { useJourneyMachine } from "@/lib/use-journey-machine";

import { ResultScreen } from "./ResultScreen";
import { StepField } from "./StepField";

export function BuyHomeJourneyClient() {
  const journey = useJourneyMachine(buyHomeJourney);
  const { state, currentStep, progress, isComplete, setAnswer, goNext, goBack } = journey;
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [errorStepId, setErrorStepId] = useState<string | null>(null);

  // Al cambiar de paso, el error del paso anterior ya no aplica. Lo
  // ajustamos durante el render (patrón recomendado por React) en vez de
  // con un efecto, para evitar un re-render en cascada.
  if (currentStep && errorStepId !== currentStep.id) {
    setErrorStepId(currentStep.id);
    setCurrentError(null);
  }

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
        journeyId: buyHomeJourney.id,
        scenarioIds: result.data.comparison.scenarios.map((s) => s.id),
      });
    }
  }, [result]);

  if (isComplete && result?.data) {
    return (
      <div className="bg-background min-h-screen px-6 py-16">
        <ResultScreen result={result.data} onRestart={() => window.location.reload()} />
      </div>
    );
  }

  if (isComplete && result?.error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[600px] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-foreground text-lg">No hemos podido calcular tu resultado.</p>
        <p className="text-muted-foreground text-sm">{result.error}</p>
      </div>
    );
  }

  if (!currentStep) {
    return null;
  }

  const stepNumber = Math.min(progress.current + 1, progress.total);

  return (
    <div className="bg-background min-h-screen px-6 py-16">
      <WizardScreen
        title={buyHomeJourney.title.es}
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

"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { trackScenarioCompared } from "@atlas/analytics";
import { DecisionValidationError, evaluateDecision } from "@atlas/decision-engine";
import { WizardScreen } from "@atlas/design-system";
import { LocalStoragePersistenceAdapter } from "@atlas/journey-engine";
import type { FaqItem } from "@atlas/seo";

import { ToolFaq, ToolIntro } from "@/components/ToolIntro";
import { StepField } from "@/components/StepField";
import { buyHomeJourney } from "@/features/housing/buy-home.journey";
import { toDecisionInput } from "@/features/housing/to-decision-input";
import { useJourneyMachine } from "@/lib/use-journey-machine";
import { useStepError } from "@/lib/use-step-error";

import { ResultScreen } from "./ResultScreen";

export function BuyHomeJourneyClient({ intro, faqs }: { intro: string; faqs: FaqItem[] }) {
  const router = useRouter();
  const journey = useJourneyMachine(buyHomeJourney);
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
        journeyId: buyHomeJourney.id,
        scenarioIds: result.data.comparison.scenarios.map((s) => s.id),
      });
    }
  }, [result]);

  const handleRestart = () => {
    // Reiniciar de verdad: si solo recargásemos la página, el progreso
    // persistido en localStorage nos devolvería a este mismo resultado.
    new LocalStoragePersistenceAdapter().clear(buyHomeJourney.id);
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
        <ResultScreen result={result.data} onRestart={handleRestart} />
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
      <ToolIntro description={intro} />
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
      <ToolFaq faqs={faqs} />
    </div>
  );
}

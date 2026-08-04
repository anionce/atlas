import type { ReactNode } from "react";

import { Button } from "./button";
import { Progress } from "./progress";
import { cn } from "./utils";

export interface WizardScreenProps {
  title: string;
  stepLabel: string;
  progressValue: number;
  progressMax: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  className?: string;
}

/**
 * Una pregunta por pantalla: no es un formulario, es una conversación.
 * La lógica de navegación/estado vive en el Journey Engine; este componente
 * solo sabe renderizar un paso y disparar los callbacks que le pasen.
 */
export function WizardScreen({
  title,
  stepLabel,
  progressValue,
  progressMax,
  children,
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled,
  className,
}: WizardScreenProps) {
  return (
    <div className={cn("mx-auto flex w-full max-w-[600px] flex-col gap-6", className)}>
      <div className="flex flex-col gap-3">
        <h1 className="text-foreground text-2xl font-semibold">{title}</h1>
        <Progress value={progressValue} max={progressMax} label={stepLabel} />
      </div>

      <div className="flex flex-col gap-4">{children}</div>

      <div className="border-border mt-2 flex items-center justify-between border-t pt-6">
        {onBack ? (
          <Button type="button" variant="tertiary" onClick={onBack}>
            Atrás
          </Button>
        ) : (
          <span />
        )}
        {onNext ? (
          <Button type="button" variant="primary" onClick={onNext} disabled={nextDisabled}>
            {nextLabel} →
          </Button>
        ) : null}
      </div>
    </div>
  );
}

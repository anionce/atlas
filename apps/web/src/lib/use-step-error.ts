"use client";

import { useState } from "react";

/**
 * El error de validación del paso anterior no debería seguir visible al
 * cambiar de pregunta. Lo ajustamos durante el render (patrón recomendado
 * por React) en vez de con un efecto, para evitar un re-render en cascada.
 */
export function useStepError(currentStepId: string | undefined) {
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [errorStepId, setErrorStepId] = useState<string | null>(null);

  if (currentStepId && errorStepId !== currentStepId) {
    setErrorStepId(currentStepId);
    setCurrentError(null);
  }

  return [currentError, setCurrentError] as const;
}

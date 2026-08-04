# ADR-0003: Las herramientas se definen por configuración, no por código

Estado: Aceptada
Fecha: 2026-08-04

## Contexto

PRD 04 lo llama "probablemente la decisión técnica más importante del
proyecto": si crear una herramienta nueva requiere escribir miles de
líneas de código, el sistema está mal diseñado. El objetivo declarado es
que crear la herramienta número cien cueste aproximadamente lo mismo que
la número diez.

## Decisión

Un Journey es un objeto `JourneyDefinition` (`packages/journey-engine`):
id, título, y una lista de `StepDefinition` (tipo de pregunta,
validación, dependencias condicionales). No contiene lógica, solo
estructura — ver `apps/web/src/features/housing/buy-home.journey.ts`. El
Journey Engine que la interpreta no sabe nada del dominio (hipotecas,
ahorro, lo que sea): "para el motor, todos son simplemente preguntas y
respuestas" (TDD-002).

## Consecuencias

- Añadir una pregunta a "Comprar vivienda" es añadir un objeto al array
  `steps`, no tocar el Journey Engine.
- Un Journey nuevo (ahorro, inversión...) reutiliza el mismo
  `JourneyMachine`, el mismo `WizardScreen`, la misma persistencia — el
  trabajo real está en las fórmulas y reglas específicas del dominio.
- Riesgo: si un Journey futuro necesita un tipo de pregunta o de
  navegación que la configuración actual no contempla, hay que extender
  el esquema (`StepType`, `StepDependency`) antes de poder describirlo —
  la expresividad del sistema está limitada a lo que el esquema soporta.

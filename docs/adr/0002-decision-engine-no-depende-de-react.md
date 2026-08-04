# ADR-0002: El Decision Engine no depende de React

Estado: Aceptada
Fecha: 2026-08-04

## Contexto

TDD-001 fija esto como principio de ingeniería del proyecto entero: "las
dependencias apuntan hacia el dominio, nunca hacia la interfaz". Si el
motor de decisión dependiera de React, no podría reutilizarse desde una
API, una app móvil, un CLI, tests, o un futuro asistente con IA — y
cualquier cambio de framework en el frontend obligaría a tocar la lógica
de negocio.

## Decisión

`packages/decision-engine` (y sus dependencias `packages/formula-engine`
y `packages/rules-engine`) son TypeScript puro: sin imports de `react`,
`next`, ni de nada que conozca DOM o UI. Su contrato es
`evaluateDecision(DecisionInput): DecisionResult`, funciones puras y
deterministas de principio a fin.

## Consecuencias

- React puede depender del Decision Engine; el Decision Engine nunca
  puede depender de React. Un lint o un CI check podría hacer cumplir
  esto en el futuro si el equipo crece.
- Los tests de estos paquetes corren en Node sin `jsdom`, lo que los hace
  rápidos (decision-engine: 26 tests en ~180ms).
- Cuando exista `apps/mobile` o una API pública, reutilizan el mismo
  paquete sin reescribir nada.

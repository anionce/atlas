# ADR-0008: La capacidad de compra siempre respeta el límite de endeudamiento

Estado: Aceptada
Fecha: 2026-08-04

## Contexto

El Journey "Comprar vivienda" no le pregunta al usuario un precio de
vivienda objetivo: `calculateAffordability` (`packages/formula-engine`)
calcula el precio máximo razonable a partir de ingresos, ahorro, interés
y plazo, limitando la cuota resultante a un `maxDebtRatioPct` (35% por
defecto). Esto significa que, para el precio que el motor devuelve como
resultado principal, el ratio de endeudamiento nunca supera ese límite —
por construcción.

Consecuencia no obvia: la regla `high_debt_ratio` de
`packages/rules-engine` (que avisa por encima del 40%) nunca se dispara
sobre el resultado principal de una simulación de "Comprar vivienda",
porque el propio cálculo ya evita llegar ahí. Esto se descubrió al
escribir los tests de `decision-engine` — un test que esperaba ver ese
aviso en el flujo normal falló, y la causa era el diseño, no un bug.

## Decisión

Mantener el comportamiento: el resultado principal del Journey siempre es
una cifra seguro, nunca una cifra "arriesgada con aviso". La regla
`high_debt_ratio` se queda en `rules-engine` como bloque reutilizable
(con sus propios tests) para el día en que exista una herramienta que sí
evalúe un precio elegido por el usuario en vez de calcular el máximo
seguro.

## Consecuencias

- Coherente con PRD 05 (UX): "Reducir la ansiedad del usuario en cada
  paso" — nunca recomendar una cifra que el propio sistema consideraría
  arriesgada.
- Si en el futuro se añade una función tipo "¿puedo permitirme ESTA
  vivienda de X €?" (evaluando un precio que el usuario introduce, no el
  máximo calculado), ese sería el punto donde `high_debt_ratio` sí podría
  dispararse de verdad.
- Cualquiera que lea `packages/decision-engine/src/recommendations.ts` y
  se pregunte por qué la recomendación `reduce_term_or_price` usa
  `debtRatioPct >= 30` en vez de `> 40`: es la misma razón — el límite
  real ya está aplicado antes, así que el umbral de la recomendación
  tiene que vivir por debajo del techo, no por encima.

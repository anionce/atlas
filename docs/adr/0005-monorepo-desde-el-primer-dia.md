# ADR-0005: Monorepo desde el primer día

Estado: Aceptada
Fecha: 2026-08-04

## Contexto

El proyecto ya tiene, desde el MVP, siete piezas que se reutilizan entre
sí (`design-system`, `formula-engine`, `rules-engine`, `decision-engine`,
`journey-engine`, `analytics`, `seo`) consumidas por una única app
(`apps/web`). PRD 11 anticipa que dentro de dos años puede haber
`apps/mobile`, `apps/admin`, `apps/api` reutilizando los mismos paquetes.

## Decisión

Un único repositorio Git, gestionado como workspace de pnpm
(`pnpm-workspace.yaml`), con `apps/*` para aplicaciones desplegables y
`packages/*` para todo lo reutilizable. Cada paquete es
`"private": true`, se consume vía `workspace:*`, y exporta su código
TypeScript fuente directamente (sin paso de build propio) — Next.js lo
transpila vía `transpilePackages`.

## Consecuencias

- Un cambio que afecta a varios paquetes (por ejemplo, cambiar la forma
  de `DecisionResult`) se revisa y se mergea en un único PR, en vez de
  coordinar versiones entre repos separados.
- No hay versionado semántico real entre paquetes todavía (todos están en
  `0.0.0`); el día que un paquete se publique fuera del monorepo (por
  ejemplo, si `design-system` se convierte en una librería pública), esto
  habrá que revisarlo.
- CI (`.github/workflows/ci.yml`) corre lint/typecheck/test/build para
  todo el workspace en cada PR; a medida que crezca el número de
  paquetes, puede valer la pena cachear o paralelizar por paquete
  afectado en lugar de rehacer todo siempre.

# ADR-0006: pnpm como gestor de paquetes

Estado: Aceptada
Fecha: 2026-08-04

## Contexto

Los documentos de origen (PRD/TDD) no especifican gestor de paquetes,
solo "monorepo". Con nueve paquetes de workspace y dependencias cruzadas
entre ellos (`decision-engine` depende de `formula-engine` y
`rules-engine`, por ejemplo), el gestor necesitaba workspaces reales con
enlaces simbólicos correctos y sin duplicar `node_modules` en cada
paquete.

## Decisión

pnpm, con `pnpm-workspace.yaml` listando `apps/*` y `packages/*`, y
dependencias internas declaradas como `"@atlas/x": "workspace:*"`.

## Consecuencias

- Instalación más rápida y con menos duplicación de disco que npm/yarn
  clásico, gracias al store de contenido direccionado de pnpm.
- Por defecto pnpm no hace phantom dependencies (un paquete no puede usar
  algo que no haya declarado explícitamente en su propio `package.json`),
  lo que obligó a declarar dependencias de dev (eslint, vitest,
  typescript...) en cada paquete individualmente en vez de asumir que
  "ya están instaladas en la raíz". Es más código de configuración por
  paquete, pero evita que un paquete se rompa silenciosamente si el árbol
  de dependencias cambia.
- Cualquiera que clone el repo necesita pnpm instalado (fijado en
  `package.json` vía `"packageManager"`); no funciona con `npm install`.
